"use server";

import prisma from "@/lib/prisma";
import { 
  Restaurant,
  Order, 
  InventoryItem, 
  ActionResponse,
  PaymentMethod,
  MenuCategory,
  MenuItem
} from "@/types";
import { revalidatePath } from "next/cache";
import { 
  OrderSchema, 
  InventoryItemSchema,
  MenuItemSchema
} from "@/lib/validation";
import { z } from "zod";
import { auth } from "@clerk/nextjs/server";

/**
 * Standardized Error Creator
 */
function createError<T>(message: string, code?: string): ActionResponse<T> {
  return { success: false, error: message, code };
}

export async function getRestaurantData(hotelId: string): Promise<ActionResponse<{
  restaurants: Restaurant[],
  activeOrders: Order[],
  inventory: InventoryItem[]
}>> {
  try {
    const restaurants = await prisma.restaurant.findMany({
      where: { hotelId },
      include: {
        categories: {
          include: {
            items: true
          }
        }
      }
    }) as unknown as Restaurant[];

    const activeOrders = await prisma.order.findMany({
      where: { 
        hotelId,
        status: { in: ["PENDIENTE", "PREPARANDO", "SERVIDO"] }
      },
      include: {
        items: {
          include: {
            menuItem: true
          }
        }
      },
      orderBy: { createdAt: "desc" }
    }) as unknown as Order[];

    const inventory = await prisma.inventoryItem.findMany({
      where: { hotelId }
    }) as unknown as InventoryItem[];

    return { 
      success: true, 
      data: { restaurants, activeOrders, inventory } 
    };
  } catch {
    console.error("Error fetching restaurant data");
    return createError("Failed to fetch restaurant data", "FETCH_ERROR");
  }
}

export async function createRestaurant(hotelId: string, name: string, type: string): Promise<ActionResponse<Restaurant>> {
  try {
    const restaurant = await prisma.restaurant.create({
      data: { name, type, hotelId }
    });
    
    await prisma.auditLog.create({
      data: {
        userId: (await getUserId()) || "",
        action: "CREATE_RESTAURANT",
        details: `Created restaurant: ${name}`,
      }
    });

    revalidatePath("/");
    return { success: true, data: restaurant as unknown as Restaurant };
  } catch {
    return createError("Failed to create restaurant", "CREATE_ERROR");
  }
}

export async function processOrder(hotelId: string, rawData: unknown): Promise<ActionResponse<Order>> {
  try {
    // 1. Validate Input
    const validated = OrderSchema.parse({ ...(rawData as object), hotelId });

    // 2. Start Transaction
    const result = await prisma.$transaction(async (tx) => {
      // 3. Check and Deduct Inventory
      for (const item of validated.items) {
        // Find recipes for this menu item
        const menuItem = await tx.menuItem.findUnique({
          where: { id: item.menuItemId },
          include: { recipe: true }
        });

        if (!menuItem) throw new Error(`Menu item ${item.menuItemId} not found`);

        for (const ingredient of menuItem.recipe) {
          const inventoryItem = await tx.inventoryItem.findUnique({
            where: { id: ingredient.inventoryItemId }
          });

          if (!inventoryItem) continue;

          const totalNeeded = ingredient.quantityNeeded * item.quantity;
          
          if (inventoryItem.quantity < totalNeeded) {
            throw new Error(`INSUFFICIENT_STOCK:${inventoryItem.name}`);
          }

          // Deduct stock
          await tx.inventoryItem.update({
            where: { id: inventoryItem.id },
            data: { quantity: { decrement: totalNeeded } }
          });
        }
      }

      // 4. Create Order
      const order = await tx.order.create({
        data: {
          hotelId: validated.hotelId,
          roomNumber: validated.roomNumber,
          total: validated.total,
          status: "PENDIENTE",
          paymentMethod: validated.paymentMethod as PaymentMethod,
          items: {
            create: validated.items.map(i => ({
              menuItemId: i.menuItemId,
              quantity: i.quantity,
              price: i.price
            }))
          }
        },
        include: {
          items: {
            include: { menuItem: true }
          }
        }
      });

      return order;
    });

    revalidatePath("/");
    return { success: true, data: result as unknown as Order };
  } catch (err: unknown) {
    console.error("Order processing failed:", err);
    if (err instanceof z.ZodError) {
      return createError(err.issues[0].message, "VALIDATION_ERROR");
    }
    const error = err as Error;
    if (error.message?.startsWith("INSUFFICIENT_STOCK:")) {
      const itemName = error.message.split(":")[1];
      return createError(`Inventario insuficiente para: ${itemName}`, "STOCK_ERROR");
    }
    return createError(error.message || "Failed to process order", "SYSTEM_ERROR");
  }
}

// Helper to get current user ID
async function getUserId() {
  const { userId: clerkId } = await auth();
  if (!clerkId) return null;
  const user = await prisma.user.findUnique({ where: { clerkId } });
  return user?.id;
}

export async function updateOrderStatus(orderId: string, status: string): Promise<ActionResponse> {
  try {
    await prisma.order.update({
      where: { id: orderId },
      data: { status }
    });
    revalidatePath("/");
    return { success: true };
  } catch {
    return createError("Failed to update status");
  }
}

export async function updateInventoryItem(hotelId: string, rawData: unknown): Promise<ActionResponse<InventoryItem>> {
  try {
    const validated = InventoryItemSchema.parse(rawData);
    const id = (rawData as { id?: string }).id;

    const item = await prisma.inventoryItem.upsert({
      where: { id: id || "new-item-placeholder" },
      update: {
        name: validated.name,
        quantity: validated.quantity,
        unit: validated.unit,
        threshold: validated.threshold,
        price: validated.price,
      },
      create: {
        ...validated,
        hotelId
      }
    });

    revalidatePath("/");
    return { success: true, data: item as unknown as InventoryItem };
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      return createError(err.issues[0].message, "VALIDATION_ERROR");
    }
    return createError("Failed to update inventory");
  }
}

export async function createMenuCategory(restaurantId: string, name: string): Promise<ActionResponse<MenuCategory>> {
  try {
    const category = await prisma.menuCategory.create({
      data: { name, restaurantId }
    });
    
    revalidatePath("/");
    return { success: true, data: category as unknown as MenuCategory };
  } catch {
    return createError("Failed to create category");
  }
}

export async function createMenuItem(hotelId: string, rawData: unknown): Promise<ActionResponse<MenuItem>> {
  try {
    const validated = MenuItemSchema.parse(rawData);
    
    const menuItem = await prisma.menuItem.create({
      data: {
        name: validated.name,
        description: validated.description,
        price: validated.price,
        categoryId: validated.categoryId,
        available: true
      }
    });

    await prisma.auditLog.create({
      data: {
        userId: (await getUserId()) || "",
        action: "CREATE_MENU_ITEM",
        details: `Created dish: ${validated.name}`,
      }
    });

    revalidatePath("/");
    return { success: true, data: menuItem as unknown as MenuItem };
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      return createError(err.issues[0].message, "VALIDATION_ERROR");
    }
    return createError("Failed to create dish");
  }
}

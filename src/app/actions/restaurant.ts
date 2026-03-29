"use server";

import prisma from "@/lib/prisma";
import { Restaurant, Order, InventoryItem, MenuCategory, MenuItem } from "@/types";
import { revalidatePath } from "next/cache";

export async function getRestaurantData(hotelId: string) {
  try {
    const restaurants = await (prisma as any).restaurant.findMany({
      where: { hotelId },
      include: {
        categories: {
          include: {
            items: true
          }
        }
      }
    }) as Restaurant[];

    const activeOrders = await (prisma as any).order.findMany({
      where: { 
        hotelId,
        status: { in: ["PENDIENTE", "PREPARANDO"] }
      },
      include: {
        items: {
          include: {
            menuItem: true
          }
        }
      },
      orderBy: { createdAt: "desc" }
    }) as Order[];

    const inventory = await (prisma as any).inventoryItem.findMany({
      where: { hotelId }
    }) as InventoryItem[];

    return { success: true, restaurants, activeOrders, inventory };
  } catch (error) {
    console.error("Error fetching restaurant data:", error);
    return { success: false, error: "Failed to fetch restaurant data" };
  }
}

export async function createRestaurant(hotelId: string, name: string, type: string) {
  try {
    const restaurant = await prisma.restaurant.create({
      data: {
        name,
        type,
        hotelId
      }
    });
    revalidatePath("/");
    return { success: true, restaurant };
  } catch (error) {
    console.error("Error creating restaurant:", error);
    return { success: false, error: "Failed to create restaurant" };
  }
}

export async function createMenuCategory(restaurantId: string, name: string) {
  try {
    const category = await prisma.menuCategory.create({
      data: {
        name,
        restaurantId
      }
    });
    revalidatePath("/");
    return { success: true, category };
  } catch {
    return { success: false, error: "Failed to create category" };
  }
}

export async function createMenuItem(categoryId: string, data: { name: string, description?: string, price: number }) {
  try {
    const item = await prisma.menuItem.create({
      data: {
        ...data,
        categoryId
      }
    });
    revalidatePath("/");
    return { success: true, item };
  } catch {
    return { success: false, error: "Failed to create menu item" };
  }
}

export async function processOrder(hotelId: string, data: {
  roomNumber?: string,
  items: { menuItemId: string, quantity: number, price: number }[],
  total: number,
  paymentMethod: any // Enum from types later
}) {
  try {
    const order = await prisma.order.create({
      data: {
        hotelId,
        roomNumber: data.roomNumber,
        total: data.total,
        status: "PENDIENTE",
        paymentMethod: data.paymentMethod,
        items: {
          create: data.items.map(item => ({
            menuItemId: item.menuItemId,
            quantity: item.quantity,
            price: item.price
          }))
        }
      }
    });

    // Deduct inventory logic could go here if items have ingredients linked
    // For now we'll just log it
    
    revalidatePath("/");
    return { success: true, order };
  } catch (error) {
    console.error("Error processing order:", error);
    return { success: false, error: "Failed to process order" };
  }
}

export async function updateOrderStatus(orderId: string, status: string) {
  try {
    await prisma.order.update({
      where: { id: orderId },
      data: { status }
    });
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}

export async function updateInventoryItem(hotelId: string, data: { name: string, quantity: number, unit: string, threshold?: number }) {
  try {
    const item = await prisma.inventoryItem.upsert({
      where: { id: (data as any).id || "new-item" }, // This is a bit hacky for demo, usually we have ID
      update: {
        quantity: data.quantity,
        threshold: data.threshold
      },
      create: {
        name: data.name,
        quantity: data.quantity,
        unit: data.unit,
        threshold: data.threshold || 5,
        hotelId
      }
    });
    revalidatePath("/");
    return { success: true, item };
  } catch (error) {
    return { success: false };
  }
}

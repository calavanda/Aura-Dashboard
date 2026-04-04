import { z } from "zod";

export const OrderItemSchema = z.object({
  menuItemId: z.string().min(1, "Menu item ID is required"),
  quantity: z.number().int().positive("Quantity must be at least 1"),
  price: z.number().nonnegative("Price cannot be negative"),
});

export const OrderSchema = z.object({
  hotelId: z.string().min(1, "Hotel ID is required"),
  roomNumber: z.string().optional().nullable(),
  items: z.array(OrderItemSchema).min(1, "At least one item is required"),
  total: z.number().nonnegative(),
  paymentMethod: z.enum(["EN_LINEA", "EFECTIVO", "CARGO_A_HABITACION", "TERMINAL", "TRANSFERENCIA"]),
});

export const MenuItemSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  price: z.number().nonnegative("Price cannot be negative"),
  categoryId: z.string().min(1, "Category ID is required"),
  recipe: z.array(z.object({
    inventoryItemId: z.string(),
    quantityNeeded: z.number().positive()
  })).optional()
});

export const InventoryItemSchema = z.object({
  name: z.string().min(1, "Name is required"),
  quantity: z.number().nonnegative("Quantity cannot be negative"),
  unit: z.string().min(1, "Unit is required"),
  threshold: z.number().nonnegative().optional().default(5),
  price: z.number().nonnegative().optional().default(0),
});

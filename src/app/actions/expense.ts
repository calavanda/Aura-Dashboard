"use server";

import prisma from "@/lib/prisma";
import { ActionResponse } from "@/types";
import { revalidatePath } from "next/cache";

/**
 * Standardized Error Creator
 */
function createError<T>(message: string, code?: string): ActionResponse<T> {
  return { success: false, error: message, code };
}

export async function createExpense(hotelId: string, data: { description: string, amount: number, category: string }): Promise<ActionResponse<any>> {
  try {
    const p = prisma as any;
    const expense = await p.expense.create({
      data: {
        description: data.description,
        amount: data.amount,
        category: data.category,
        hotelId
      }
    });

    revalidatePath("/");
    return { success: true, data: expense };
  } catch {
    return createError("Failed to create expense");
  }
}

export async function getFinancialSummary(hotelId: string) {
  try {
    const p = prisma as any;
    // 1. Get Revenue (All PAGADO orders)
    const orders = await p.order.findMany({
      where: { 
        hotelId,
        paymentStatus: "PAGADO"
      },
      select: { total: true }
    });
    const revenue = orders.reduce((sum: number, o: { total: number }) => sum + o.total, 0);

    // 2. Get Operating Expenses
    const expenses = await p.expense.findMany({
      where: { hotelId }
    });
    const totalExpenses = expenses.reduce((sum: number, e: { amount: number }) => sum + e.amount, 0);

    // 3. Get Inventory Value (Current Assets)
    const inventory = await p.inventoryItem.findMany({
      where: { hotelId }
    });
    const inventoryValue = inventory.reduce((sum: number, i: { quantity: number, price: number }) => sum + (i.quantity * i.price), 0);

    return {
      success: true,
      data: {
        revenue,
        totalExpenses,
        inventoryValue,
        netProfit: revenue - totalExpenses
      }
    };
  } catch {
    return createError("Failed to get financial summary");
  }
}

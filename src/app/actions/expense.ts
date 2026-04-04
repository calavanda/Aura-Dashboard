"use server";

import prisma from "@/lib/prisma";
import { ActionResponse, Expense, FinancialSummary } from "@/types";
import { revalidatePath } from "next/cache";

/**
 * Creador de errores estandarizado para respuestas de servidor.
 * @param message Mensaje descriptivo del error.
 * @param code Código de error opcional.
 */
function createError<T>(message: string, code?: string): ActionResponse<T> {
  return { success: false, error: message, code };
}

/**
 * Registra un nuevo gasto operativo en el sistema.
 * @param hotelId ID del establecimiento.
 * @param data Datos del gasto (descripción, monto y categoría).
 */
export async function createExpense(hotelId: string, data: { description: string, amount: number, category: string }): Promise<ActionResponse<Expense>> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- El modelo 'Expense' puede no estar en el cliente generado localmente
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
    return { success: true, data: expense as Expense };
  } catch {
    return createError("Failed to create expense");
  }
}

/**
 * Obtiene un resumen financiero consolidado que incluye ingresos brutos,
 * gastos totales, valor de activos en inventario y utilidad neta.
 * @param hotelId ID del hotel a consultar.
 */
export async function getFinancialSummary(hotelId: string): Promise<ActionResponse<FinancialSummary>> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Requerido para acceder a modelos dinámicos de finanzas
    const p = prisma as any;
    
    // 1. Obtener ingresos por Gastronomía (Pedidos ya PAGADOS)
    const orders = await p.order.findMany({
      where: { 
        hotelId,
        paymentStatus: "PAGADO"
      },
      select: { total: true }
    });
    const restaurantRevenue = orders.reduce((sum: number, o: { total: number }) => sum + o.total, 0);

    // 2. Obtener ingresos por Hospitalidad (Reservaciones ya PAGADAS)
    const reservations = await p.reservation.findMany({
      where: {
        hotelId,
        paymentStatus: "PAGADO"
      },
      select: { amount: true }
    });
    const hospitalityRevenue = reservations.reduce((sum: number, r: { amount: number | null }) => sum + (r.amount || 0), 0);

    const revenue = restaurantRevenue + hospitalityRevenue;

    // 3. Obtener Gastos Operativos (Luz, agua, renta, etc.)
    const expenses = await p.expense.findMany({
      where: { hotelId }
    });
    const totalExpenses = expenses.reduce((sum: number, e: { amount: number }) => sum + e.amount, 0);

    // 4. Calcular el Valor del Activo en Inventario
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

/**
 * Obtiene la lista completa de gastos operativos registrados, ordenados por fecha.
 * @param hotelId ID del establecimiento.
 */
export async function getExpenses(hotelId: string): Promise<ActionResponse<Expense[]>> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Requerido para acceder al historial de egresos
    const p = prisma as any;
    const expenses = await p.expense.findMany({
      where: { hotelId },
      orderBy: { date: 'desc' }
    });
    return { success: true, data: expenses as Expense[] };
  } catch {
    return createError("Failed to get expenses");
  }
}

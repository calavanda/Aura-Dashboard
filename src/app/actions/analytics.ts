"use server";

import prisma from "@/lib/prisma";
import { Hotel, Room, Reservation, Order } from "@/types";

export async function getAdvancedKPIs(hotelId: string) {
  try {
    const hotel = await (prisma as any).hotel.findUnique({
      where: { id: hotelId },
      include: {
        rooms: true,
        reservations: {
          where: { status: "CONFIRMADO" }
        },
        orders: {
          where: { paymentStatus: "PAGADO" }
        }
      }
    }) as (Hotel & { rooms: Room[], reservations: Reservation[], orders: Order[] }) | null;

    if (!hotel) return { success: false, error: "Hotel not found" };

    const totalRooms = hotel.rooms.length;
    const activeReservations = hotel.reservations.length;
    
    // Occupancy Rate: Rooms Sold / Total Available Rooms
    const occupancyRate = totalRooms > 0 ? (activeReservations / totalRooms) * 100 : 0;

    // ADR (Average Daily Rate): Total Room Revenue / Rooms Sold
    const totalRoomRevenue = hotel.reservations.reduce((sum: number, res: Reservation) => sum + (res.amount || 0), 0);
    const adr = activeReservations > 0 ? totalRoomRevenue / activeReservations : 0;

    // RevPAR (Revenue Per Available Room): Total Room Revenue / Total Available Rooms
    const revpar = totalRooms > 0 ? totalRoomRevenue / totalRooms : 0;

    // Departmental Revenue
    const fnbRevenue = hotel.orders.reduce((sum: number, order: Order) => sum + order.total, 0);
    const totalRevenue = totalRoomRevenue + fnbRevenue;

    // Growth Calculation (Mock comparison for now)
    const growth = 18.4; // Usually calculated against previous month

    return {
      success: true,
      stats: {
        occupancyRate: occupancyRate.toFixed(1) + "%",
        adr: "$" + adr.toFixed(2),
        revpar: "$" + revpar.toFixed(2),
        totalRevenue: "$" + totalRevenue.toFixed(2),
        fnbRevenue: "$" + fnbRevenue.toFixed(2),
        roomRevenue: "$" + totalRoomRevenue.toFixed(2),
        growth: "+" + growth + "%"
      }
    };
  } catch (error) {
    console.error("Error calculating KPIs:", error);
    return { success: false, error: "Failed to calculate analytics" };
  }
}

export async function getRevenueForecast(hotelId: string) {
  try {
    // Basic forecast: ADR * Rooms * Future Occupancy prediction (e.g. 70%)
    const hotel = await prisma.hotel.findUnique({
      where: { id: hotelId },
      include: {
        rooms: true,
        reservations: {
          where: { checkIn: { gte: new Date() } }
        }
      }
    });

    if (!hotel) return { success: false };

    const futureRevenue = hotel.reservations.reduce((sum: number, res: any) => sum + (res.amount || 0), 0);
    
    return {
      success: true,
      forecast: "$" + futureRevenue.toFixed(2)
    };
  } catch {
    return { success: false };
  }
}

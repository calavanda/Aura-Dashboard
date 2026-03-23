"use server";

import prisma from "@/lib/prisma";
import { logActivity } from "@/lib/audit";

export async function exportHotelDataAction(hotelId: string, userId: string) {
  try {
    const data = await prisma.hotel.findUnique({
      where: { id: hotelId },
      include: {
        rooms: true,
        reservations: true,
        users: true,
      }
    });

    if (!data) return { success: false, error: "Data not found" };

    await logActivity(userId, "BACKUP_EXPORT", `Exported data for hotel ${hotelId}`);

    return { 
      success: true, 
      data: JSON.stringify(data, null, 2),
      filename: `aura_backup_${hotelId}_${new Date().toISOString()}.json`
    };
  } catch (error) {
    return { success: false, error: "Export failed" };
  }
}

export async function restoreHotelDataAction(hotelId: string, jsonData: string, userId: string) {
  // Advanced restoration logic would go here
  // For now, we'll log the attempt
  await logActivity(userId, "BACKUP_RESTORE_ATTEMPT", `User attempted to restore data via JSON`);
  return { success: false, error: "Manual restoration requires administrator intervention for safety." };
}

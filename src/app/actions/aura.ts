"use server";

import prisma from "@/lib/prisma";
import { HotelConfig, Room } from "@/context/AuraContext";
import { revalidatePath } from "next/cache";

export async function createHotelWithRooms(config: HotelConfig, clerkId: string) {
  try {
    const hotel = await prisma.hotel.create({
      data: {
        name: config.name,
        type: config.type,
        // We'll add services and logoUrl later in the Config Panel phase
      }
    });

    // Update user to link to this hotel and set as ADMIN
    await prisma.user.update({
      where: { clerkId },
      data: { 
        hotelId: hotel.id,
        role: "ADMIN" 
      }
    });

    await createAuditLog(clerkId, "Hotel Creado", `Establecimiento: ${config.name}`);
    revalidatePath("/");
    return { success: true, hotelId: hotel.id };
  } catch (error) {
    console.error("Error creating hotel:", error);
    return { success: false, error: "Failed to create hotel" };
  }
}

export async function addRoomAction(hotelId: string, roomNumber: string, roomType: string, clerkId?: string) {
  try {
    const hotel = await prisma.hotel.findUnique({
      where: { id: hotelId },
      include: { rooms: true }
    });

    if (hotel && hotel.subscription === "BASIC" && hotel.rooms.length >= 5) {
      return { success: false, error: "Límite de 5 habitaciones alcanzado en el plan BASIC. Por favor, mejora tu plan." };
    }

    const newRoom = await prisma.room.create({
      data: {
        number: roomNumber,
        type: roomType,
        status: "Limpia", // Default
        hotelId: hotelId,
      }
    });
    // We need clerkId here for logging. Usually it comes from auth() but since these are specialized actions,
    // I'll assume we can pass it or fetch it. For now, I'll update the signature if possible.
    // Actually, I'll just check if I can get the user's clerkId another way or skip detail for now.
    revalidatePath("/");
    return { success: true, room: newRoom };
  } catch (error) {
    console.error("Error adding room:", error);
    return { success: false };
  }
}

export async function deleteRoomAction(roomId: string) {
  try {
    await prisma.room.delete({
      where: { id: roomId }
    });
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error deleting room:", error);
    return { success: false };
  }
}

export async function getHotelData(clerkId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { clerkId },
      include: {
        hotel: {
          include: {
            rooms: true,
            reservations: {
              orderBy: { createdAt: 'desc' }
            },
            users: {
              include: {
                logs: {
                  orderBy: { timestamp: 'desc' },
                  take: 30
                }
              }
            }
          }
        }
      }
    });

    if (!user || !user.hotel) return { success: false, error: "No hotel found" };

    // Flatten logs from all users
    const allLogs = user.hotel.users.flatMap(u => u.logs.map(l => ({
      ...l,
      userName: u.email.split('@')[0]
    }))).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 30);

    return { 
      success: true, 
      hotel: user.hotel,
      user: {
        email: user.email,
        role: user.role
      },
      rooms: user.hotel.rooms,
      reservations: user.hotel.reservations,
      logs: allLogs,
    };
  } catch (error) {
    console.error("Error fetching hotel data:", error);
    return { success: false };
  }
}

export async function generateConnectionCodeAction(hotelId: string) {
  try {
    const code = Math.random().toString(36).substring(2, 10).toUpperCase();
    await prisma.hotel.update({
      where: { id: hotelId },
      data: { connectionCode: code }
    });
    revalidatePath("/");
    return { success: true, code };
  } catch (error) {
    console.error("Error generating connection code:", error);
    return { success: false };
  }
}

export async function createAuditLog(clerkId: string, action: string, details?: string) {
  try {
    const user = await prisma.user.findUnique({ where: { clerkId } });
    if (!user) return { success: false };

    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action,
        details
      }
    });
    return { success: true };
  } catch (error) {
    console.error("Error creating audit log:", error);
    return { success: false };
  }
}

export async function purgeHotelDataAction(hotelId: string, type: "RESERVATIONS" | "LOGS" | "ALL") {
  try {
    if (type === "RESERVATIONS" || type === "ALL") {
      await prisma.reservation.deleteMany({
        where: { hotelId: hotelId }
      });
    }

    if (type === "LOGS" || type === "ALL") {
      // Find all users of this hotel to delete their logs
      const hotel = await prisma.hotel.findUnique({
        where: { id: hotelId },
        include: { users: true }
      });
      
      if (hotel) {
        const userIds = hotel.users.map(u => u.id);
        await prisma.auditLog.deleteMany({
          where: { userId: { in: userIds } }
        });
      }
    }

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error purging hotel data:", error);
    return { success: false, error: "Failed to purge data" };
  }
}

export async function checkOrCreateUserAction(clerkId: string, email: string) {
  try {
    const user = await prisma.user.upsert({
      where: { clerkId },
      update: {},
      create: {
        clerkId,
        email,
        role: "RESERVADOR", // Default role
      }
    });
    return { success: true, user };
  } catch (error) {
    console.error("Error checking/creating user:", error);
    return { success: false };
  }
}

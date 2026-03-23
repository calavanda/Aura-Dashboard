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

    revalidatePath("/");
    return { success: true, hotelId: hotel.id };
  } catch (error) {
    console.error("Error creating hotel:", error);
    return { success: false, error: "Failed to create hotel" };
  }
}

export async function addRoomAction(hotelId: string, room: Omit<Room, "id">) {
  try {
    const newRoom = await prisma.room.create({
      data: {
        number: room.number,
        type: room.type,
        status: "Limpia", // Default
        hotelId: hotelId,
      }
    });
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
            reservations: true
          }
        }
      }
    });

    if (!user || !user.hotel) return { success: false, error: "No hotel found" };

    return { 
      success: true, 
      hotel: user.hotel,
      rooms: user.hotel.rooms,
      reservations: user.hotel.reservations
    };
  } catch (error) {
    console.error("Error fetching hotel data:", error);
    return { success: false };
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

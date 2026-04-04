"use server";

import prisma from "@/lib/prisma";
import { RoomStatus, PaymentMethod, PaymentStatus, PaymentProvider, AuditLog, BusinessMode } from "@/types";
import { HotelConfig } from "@/context/AuraContext";
import { revalidatePath } from "next/cache";
import { verifyAuth } from "@/lib/auth";

export async function createHotelWithRooms(config: HotelConfig, clerkId: string) {
  try {
    const hotel = await prisma.hotel.create({
      data: {
        name: config.name,
        type: config.type,
        businessMode: config.businessMode,
        // We'll add services and logoUrl later in the Config Panel phase
      }
    });

    // If GASTRONOMY mode, create an initial restaurant automatically
    if (config.businessMode === "GASTRONOMY") {
      await prisma.restaurant.create({
        data: {
          name: config.name, // Use business name as default restaurant name
          type: config.type, // Use business type as default restaurant type
          hotelId: hotel.id
        }
      });
    }

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
  } catch {
    return { success: false, error: "Failed to create hotel" };
  }
}

export async function updateHotelAction(hotelId: string, data: { name?: string, type?: string, logoUrl?: string, businessMode?: BusinessMode }) {
  try {
    await verifyAuth(hotelId, ["ADMIN"]);
    const hotel = await prisma.hotel.update({
      where: { id: hotelId },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.type && { type: data.type }),
        ...(data.logoUrl && { logoUrl: data.logoUrl }),
        ...(data.businessMode && { businessMode: data.businessMode }),
      }
    });
    revalidatePath("/");
    return { success: true, hotel };
  } catch (error) {
    console.error("Error updating hotel:", error);
    return { success: false, error: "Failed to update hotel" };
  }
}

export async function addRoomAction(hotelId: string, roomNumber: string, roomType: string, status?: RoomStatus, price?: number) {
  try {
    await verifyAuth(hotelId, ["ADMIN", "GERENTE"]);
    const hotel = await prisma.hotel.findUnique({
      where: { id: hotelId },
      include: { rooms: true }
    });

    if (hotel && hotel.subscription === "BASIC" && hotel.rooms.length >= 5) {
      return { success: false, error: "Límite de 5 habitaciones alcanzado en el plan BASIC. Por favor, mejora tu plan." };
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const newRoom = await (prisma as any).room.create({
      data: {
        number: roomNumber,
        type: roomType,
        price: price || 0,
        status: status || "Limpia",
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
    const room = await prisma.room.findUnique({ where: { id: roomId } });
    if (!room) return { success: false, error: "Habitación no encontrada" };
    await verifyAuth(room.hotelId, ["ADMIN", "GERENTE"]);

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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const user = await (prisma as any).user.findUnique({
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
            },
            restaurants: {
              include: {
                inventory: true,
                orders: {
                  where: { status: { in: ["PENDIENTE", "PREPARANDO"] } },
                  include: {
                    items: {
                      include: { menuItem: true }
                    }
                  }
                },
                categories: {
                  include: {
                    items: {
                      include: {
                        recipe: {
                          include: {
                            inventoryItem: true
                          }
                        }
                      }
                    }
                  }
                }
              }
            },
            inventory: {
              where: { restaurantId: null } // General hotel supplies
            },
            orders: {
               where: { 
                 restaurantId: null,
                 status: { in: ["PENDIENTE", "PREPARANDO"] } 
               },
               include: {
                 items: {
                   include: { menuItem: true }
                 }
               }
            }
          }
        }
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }) as Record<string, any>;

    if (!user || !user.hotel) return { success: false, error: "No hotel found" };

    // Flatten logs from all users
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const allLogs = user.hotel.users.flatMap((u: Record<string, any>) => u.logs.map((l: AuditLog) => ({
      ...l,
      userName: u.email.split('@')[0]
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }))).sort((a: Record<string, any>, b: Record<string, any>) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 30);

    return { 
      success: true, 
      hotel: user.hotel,
      user: {
        email: user.email,
        role: user.role
      },
      rooms: user.hotel.rooms,
      reservations: user.hotel.reservations,
      inventory: user.hotel.inventory,
      restaurants: user.hotel.restaurants,
      logs: allLogs,
      isOwner: (process.env.AURA_OWNER_EMAILS || "").split(",").includes(user.email)
    };
  } catch (error) {
    console.error("Error fetching hotel data:", error);
    return { success: false };
  }
}

export async function generateConnectionCodeAction(hotelId: string) {
  try {
    await verifyAuth(hotelId, ["ADMIN", "GERENTE"]);
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

    // Anti-duplication: check if same action in last 5 seconds
    const fiveSecondsAgo = new Date(Date.now() - 5000);
    const recentLog = await prisma.auditLog.findFirst({
      where: {
        userId: user.id,
        action,
        details: details || null,
        timestamp: { gte: fiveSecondsAgo }
      }
    });

    if (recentLog) return { success: true }; // Skip duplicate

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

export async function purgeHotelDataAction(hotelId: string, type: "RESERVATIONS" | "LOGS" | "ROOMS" | "ALL") {
  try {
    await verifyAuth(hotelId, ["ADMIN"]);
    if (type === "RESERVATIONS" || type === "ALL") {
      await prisma.reservation.deleteMany({
        where: { hotelId: hotelId }
      });
    }

    if (type === "ROOMS" || type === "ALL") {
      await prisma.room.deleteMany({
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

export async function updateRoomStatusAction(roomId: string, status: string) {
  try {
    const room = await prisma.room.findUnique({ where: { id: roomId } });
    if (!room) return { success: false };
    await verifyAuth(room.hotelId, ["ADMIN", "GERENTE", "COCINERO", "MESERO", "CAJERO"]);

    const updatedRoom = await prisma.room.update({
      where: { id: roomId },
      data: { status: status as RoomStatus }
    });
    revalidatePath("/");
    return { success: true, room: updatedRoom };
  } catch (error) {
    console.error("Error updating room status:", error);
    return { success: false };
  }
}

export async function updateRoomAction(roomId: string, data: Partial<{ number: string, type: string, status: string }>) {
  try {
    const room = await prisma.room.findUnique({ where: { id: roomId } });
    if (!room) return { success: false };
    await verifyAuth(room.hotelId, ["ADMIN", "GERENTE"]);

    const updatedRoom = await prisma.room.update({
      where: { id: roomId },
      data: {
        ...(data.number && { number: data.number }),
        ...(data.type && { type: data.type }),
        ...(data.status && { status: data.status as RoomStatus }),
      }
    });
    revalidatePath("/");
    return { success: true, room: updatedRoom };
  } catch (error) {
    console.error("Error updating room:", error);
    return { success: false };
  }
}

export async function addReservationAction(hotelId: string, data: {
  guestName: string,
  roomNumber: string,
  checkIn: string, // ISO string
  checkOut?: string, // ISO string
  status: string,
  amount?: number,
  paymentMethod?: string,
  paymentStatus?: string,
  paymentProvider?: string
}) {
  try {
    await verifyAuth(hotelId); 
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const reservation = await (prisma as any).reservation.create({
      data: {
        guestName: data.guestName,
        roomNumber: data.roomNumber,
        checkIn: new Date(data.checkIn),
        checkOut: data.checkOut ? new Date(data.checkOut) : null,
        status: data.status,
        hotelId: hotelId,
        amount: data.amount,
        paymentMethod: (data.paymentMethod as PaymentMethod) || "EFECTIVO",
        paymentStatus: (data.paymentStatus as PaymentStatus) || "PENDIENTE",
        paymentProvider: (data.paymentProvider as PaymentProvider) || "NINGUNO"
      }
    });
    revalidatePath("/");
    return { success: true, reservation };
  } catch (error) {
    console.error("Error creating reservation:", error);
    return { success: false };
  }
}

export async function updateReservationPaymentAction(reservationId: string, data: {
  paymentStatus: string,
  paymentMethod: string,
  amount?: number
}) {
  try {
    const res = await (prisma as any).reservation.findUnique({ where: { id: reservationId } });
    if (!res) return { success: false };
    await verifyAuth(res.hotelId, ["ADMIN", "GERENTE", "CAJERO"]);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const reservation = await (prisma as any).reservation.update({
      where: { id: reservationId },
      data: {
        paymentStatus: data.paymentStatus as PaymentStatus,
        paymentMethod: data.paymentMethod as PaymentMethod,
        ...(data.amount !== undefined && { amount: data.amount })
      }
    });
    revalidatePath("/");
    return { success: true, reservation };
  } catch (error) {
    console.error("Error updating reservation payment:", error);
    return { success: false };
  }
}

export async function validateMasterKeyAction(hotelId: string, key: string) {
  try {
    await verifyAuth(hotelId, ["ADMIN"]);
    const MASTER_KEY = process.env.AURA_MASTER_KEY || "AURA-OWNER-2026";
    if (key === MASTER_KEY) {
      await prisma.hotel.update({
        where: { id: hotelId },
        data: { subscription: "ENTERPRISE" }
      });
      revalidatePath("/");
      return { success: true };
    }
    return { success: false, error: "Clave de licencia inválida" };
  } catch (error) {
    console.error("Error validating master key:", error);
    return { success: false, error: "Server error" };
  }
}

export async function checkOrCreateUserAction(clerkId: string, email: string) {
  try {
    // 1. Check if user already exists by Clerk ID
    let user = await prisma.user.findUnique({
      where: { clerkId }
    });

    if (user) {
      return { success: true, user };
    }

    // 2. Check if user was pre-invited by email
    user = await prisma.user.findUnique({
      where: { email }
    });

    if (user) {
      // Link Clerk ID to the pre-invited record
      const updatedUser = await prisma.user.update({
        where: { email },
        data: { clerkId }
      });
      return { success: true, user: updatedUser };
    }

    // 3. Simple creation (new user)
    const newUser = await prisma.user.create({
      data: {
        clerkId,
        email,
        role: "RESERVADOR", // Default role
      }
    });

    return { success: true, user: newUser };
  } catch (error) {
    console.error("Error checking/creating user:", error);
    return { success: false };
  }
}

export async function addTeamMember(hotelId: string, email: string, role: string) {
  try {
    await verifyAuth(hotelId, ["ADMIN", "GERENTE"]);
    // Check if user already exists
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      if (existing.hotelId === hotelId) {
        return { success: false, error: "El usuario ya es parte del equipo" };
      }
      // If user exists elsewhere, we can't easily "steal" them without a multi-hotel model
      // but for now, we'll allow updating their hotelId if they are not active elsewhere
      // or just error out.
      return { success: false, error: "El correo pertenece a un usuario en otro establecimiento" };
    }

    const newUser = await (prisma as any).user.create({
      data: {
        email,
        role: role as any,
        hotelId,
        clerkId: null
      }
    });

    revalidatePath("/");
    return { success: true, user: newUser };
  } catch {
    return { success: false, error: "Failed to add member" };
  }
}

export async function getBusinessTeam(hotelId: string) {
  try {
    const users = await prisma.user.findMany({
      where: { hotelId },
      orderBy: { createdAt: 'asc' }
    });
    return { success: true, users };
  } catch {
    return { success: false, error: "Failed to fetch team" };
  }
}

export async function removeTeamMember(userId: string) {
  try {
    const targetUser = await prisma.user.findUnique({ where: { id: userId } });
    if (!targetUser || !targetUser.hotelId) return { success: false };
    await verifyAuth(targetUser.hotelId, ["ADMIN"]);

    await prisma.user.update({
      where: { id: userId },
      data: { hotelId: null, role: "RESERVADOR" } // Unlink rather than delete to preserve history
    });
    revalidatePath("/");
    return { success: true };
  } catch {
    return { success: false, error: "Failed to remove member" };
  }
}
export async function resetBusinessAction(hotelId: string, confirmationName: string) {
  try {
    await verifyAuth(hotelId, ["ADMIN"]);
    
    const hotel = await prisma.hotel.findUnique({
      where: { id: hotelId }
    });

    if (!hotel) return { success: false, error: "Negocio no encontrado" };

    // Verify name confirmation
    if (confirmationName.trim().toLowerCase() !== hotel.name.trim().toLowerCase()) {
      return { success: false, error: "El nombre de confirmación no coincide" };
    }

    // Capture restaurant IDs for cleanup
    const restaurantIds = (await prisma.restaurant.findMany({
      where: { hotelId },
      select: { id: true }
    })).map(r => r.id);

    const p = prisma as any;

    // Atomic transaction to delete EVERYTHING related to the hotel
    await prisma.$transaction([
      // 1. Delete dependent child records
      p.reservation.deleteMany({ where: { hotelId } }),
      p.room.deleteMany({ where: { hotelId } }),
      p.inventoryItem.deleteMany({ where: { hotelId } }),
      p.expense.deleteMany({ where: { hotelId } }),
      p.device.deleteMany({ where: { hotelId } }),
      p.auditLog.deleteMany({ where: { user: { hotelId } } }),
      
      // 2. Cleanup Restaurant Data
      p.orderItem.deleteMany({
        where: { order: { hotelId } }
      }),
      p.order.deleteMany({ where: { hotelId } }),
      
      p.menuItem.deleteMany({
        where: { category: { restaurantId: { in: restaurantIds } } }
      }),
      p.menuCategory.deleteMany({
        where: { restaurantId: { in: restaurantIds } }
      }),
      p.restaurant.deleteMany({
        where: { hotelId }
      }),

      // 3. Dissociate ALL users from this hotel (Admin included)
      p.user.updateMany({
        where: { hotelId },
        data: { hotelId: null, role: "RESERVADOR" }
      }),

      // 4. Finally, delete the hotel record
      p.hotel.delete({
        where: { id: hotelId }
      })
    ]);

    revalidatePath("/");
    return { success: true };
  } catch (err: unknown) {
    console.error("Error resetting business:", err);
    return { success: false, error: err instanceof Error ? err.message : "Error interno del servidor" };
  }
}

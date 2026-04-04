import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { Role } from "@/types";

/**
 * Validates that the current user exists, belongs to the correct hotel, 
 * and has one of the allowed roles.
 * 
 * @param hotelId - The ID of the business being accessed.
 * @param allowedRoles - (Optional) List of roles permitted for this action.
 * @returns The user record if authorized, otherwise throws an error.
 */
export async function verifyAuth(hotelId?: string, allowedRoles?: Role[]) {
  const { userId: clerkId } = await auth();
  
  if (!clerkId) {
    throw new Error("No autorizado: Sesión no encontrada");
  }

  const user = await prisma.user.findUnique({
    where: { clerkId }
  });

  if (!user) {
    throw new Error("No autorizado: Usuario no registrado");
  }

  // Cross-Business Protection: Check if user belongs to the requested business
  if (hotelId && user.hotelId !== hotelId) {
    throw new Error("No autorizado: El usuario no pertenece a este establecimiento");
  }

  // RBAC Protection: Check if user has one of the allowed roles
  if (allowedRoles && !allowedRoles.includes(user.role as Role)) {
    throw new Error(`Acceso denegado: El rol '${user.role}' no tiene permisos para esta acción`);
  }

  return user;
}

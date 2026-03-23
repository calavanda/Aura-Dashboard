import prisma from "@/lib/prisma";

export async function logActivity(userId: string, action: string, details: string) {
  try {
    await prisma.auditLog.create({
      data: {
        userId,
        action,
        details,
        ipAddress: "System", // Could be passed from request
      }
    });
  } catch (error) {
    console.error("Failed to log activity:", error);
  }
}

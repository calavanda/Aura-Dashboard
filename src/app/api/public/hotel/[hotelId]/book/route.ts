import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  { params }: { params: { hotelId: string } }
) {
  try {
    const { hotelId } = params;
    const body = await request.json();
    const { guestName, roomType, checkIn } = body;

    // Create a pending reservation in the DB
    const reservation = await prisma.reservation.create({
      data: {
        guestName,
        roomNumber: "TBD", // Assigned on check-in or auto-assigned
        checkIn: new Date(checkIn),
        status: "PENDIENTE",
        hotelId: hotelId,
      }
    });

    return NextResponse.json({ success: true, reservation }, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      }
    });
  } catch (error) {
    console.error("Public booking error:", error);
    return NextResponse.json({ error: "Booking failed" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    }
  });
}

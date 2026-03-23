import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { PaymentStatus, PaymentMethod, PaymentProvider } from "@prisma/client";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ hotelId: string }> | { hotelId: string } }
) {
  try {
    const resolvedParams = await params;
    const { hotelId } = resolvedParams;

    // Verificar si el hotel existe
    const hotel = await prisma.hotel.findUnique({
      where: { id: hotelId },
    });

    if (!hotel) {
      return NextResponse.json({ error: "Hotel not found" }, { status: 404 });
    }

    const body = await request.json();
    const { 
      guestName, 
      roomNumber, 
      checkIn, 
      paymentMethod = "EFECTIVO", 
      paymentProvider = "NINGUNO",
      transactionId = null,
      amount = 0 
    } = body;

    if (!guestName || !roomNumber || !checkIn) {
      return NextResponse.json(
        { error: "Missing required fields (guestName, roomNumber, checkIn)" },
        { status: 400 }
      );
    }

    // Default status base on payment method
    let paymentStatus = "PENDIENTE";
    let reservationStatus = "PENDIENTE";
    
    // In a real application, ONLINE payments might start as PENDING until confirmed by webhook
    if (paymentMethod === "EN_LINEA") {
      paymentStatus = "PENDIENTE"; // to be confirmed by /payments microservice
    } else if (paymentMethod === "EFECTIVO") {
      paymentStatus = "PENDIENTE"; // usually paid at front desk
    }

    // Crear la reservación
    const reservation = await prisma.reservation.create({
      data: {
        guestName,
        roomNumber,
        checkIn: new Date(checkIn),
        status: reservationStatus,
        paymentMethod: paymentMethod as PaymentMethod,
        paymentStatus: paymentStatus as PaymentStatus,
        paymentProvider: paymentProvider as PaymentProvider,
        transactionId: transactionId,
        amount: amount,
        hotelId,
      },
    });

    return NextResponse.json({
      message: "Reservation created successfully",
      reservation,
    }, {
      status: 201,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      }
    });

  } catch (error) {
    console.error("[RESERVATIONS_API_ERROR]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
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

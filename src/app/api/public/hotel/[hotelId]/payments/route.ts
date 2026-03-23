import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { PaymentStatus, PaymentProvider } from "@prisma/client";

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
    const { reservationId, action, transactionId, paymentProvider } = body; // action: 'CONFIRM_ONLINE_PAYMENT', 'REGISTER_CASH_PAYMENT'

    if (!reservationId || !action) {
      return NextResponse.json(
        { error: "Missing required fields (reservationId, action)" },
        { status: 400 }
      );
    }

    const reservation = await prisma.reservation.findUnique({
      where: { id: reservationId },
    });

    if (!reservation) {
      return NextResponse.json({ error: "Reservation not found" }, { status: 404 });
    }

    let updatedPaymentStatus: PaymentStatus = reservation.paymentStatus as PaymentStatus;
    let updatedReservationStatus = reservation.status;

    if (action === "CONFIRM_ONLINE_PAYMENT") {
      updatedPaymentStatus = "PAGADO";
      updatedReservationStatus = "CONFIRMADO";
    } else if (action === "REGISTER_CASH_PAYMENT") {
      updatedPaymentStatus = "PAGADO";
      updatedReservationStatus = "CONFIRMADO";
    } else if (action === "REFUND") {
      updatedPaymentStatus = "REEMBOLSADO";
      updatedReservationStatus = "CANCELADO";
    }

    // Actualizar estado de pago en la base de datos
    const updatedReservation = await prisma.reservation.update({
      where: { id: reservationId },
      data: {
        paymentStatus: updatedPaymentStatus,
        status: updatedReservationStatus,
        ...(transactionId && { transactionId }),
        ...(paymentProvider && { paymentProvider: paymentProvider as PaymentProvider }),
      },
    });

    return NextResponse.json({
      message: "Payment processed successfully",
      reservation: updatedReservation,
    }, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      }
    });

  } catch (error) {
    console.error("[PAYMENTS_API_ERROR]", error);
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

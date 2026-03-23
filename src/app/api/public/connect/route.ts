import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { connectionCode } = await req.json();

    if (!connectionCode) {
      return NextResponse.json({ success: false, error: "Código requerido" }, { status: 400 });
    }

    const hotel = await prisma.hotel.findUnique({
      where: { connectionCode },
      select: {
        id: true,
        name: true,
        subscription: true
      }
    });

    if (!hotel) {
      return NextResponse.json({ success: false, error: "Código inválido" }, { status: 404 });
    }

    if (hotel.subscription !== "ENTERPRISE") {
      return NextResponse.json({ 
        success: false, 
        error: "Tu plan actual (BASIC/PRO) no permite la conexión con sitios web externos. Por favor, haz el upgrade a ENTERPRISE." 
      }, { status: 403 });
    }

    return NextResponse.json({ 
      success: true, 
      hotelId: hotel.id,
      hotelName: hotel.name 
    });

  } catch (error) {
    console.error("Error connecting hotel:", error);
    return NextResponse.json({ success: false, error: "Error interno" }, { status: 500 });
  }
}

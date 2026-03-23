import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  try {
    const hotel = await prisma.hotel.findFirst();
    if (hotel) {
      console.log("SUCCESS_HOTEL_ID:" + hotel.id);
    } else {
      console.log("FAILURE_NO_HOTEL");
    }
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

main();

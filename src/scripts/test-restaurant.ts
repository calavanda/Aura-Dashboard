import { prisma } from "../lib/prisma";
import { processOrder } from "../app/actions/restaurant";

export async function testDeduction() {
  console.log("--- STARTING RESTAURANT ROBUSTNESS TEST ---");
  
  const hotel = await prisma.hotel.findFirst();
  if (!hotel) {
    console.error("No hotel found for test");
    return;
  }

  // 1. Setup Data: Inventory, Menu Item, Recipe
  const ingredient = await prisma.inventoryItem.create({
    data: {
      name: "Harina (Test)",
      quantity: 10, // 10 kg
      unit: "kg",
      hotelId: hotel.id,
      threshold: 2
    }
  });

  const category = await prisma.menuCategory.findFirst({
    where: { restaurant: { hotelId: hotel.id } }
  }) || await prisma.menuCategory.create({
    data: {
      name: "Test Cat",
      restaurant: { create: { name: "Test Rest", type: "RESTAURANTE", hotelId: hotel.id } }
    }
  });

  const menuItem = await prisma.menuItem.create({
    data: {
      name: "Pasta Test",
      price: 200,
      categoryId: category.id,
      recipe: {
        create: {
          inventoryItemId: ingredient.id,
          quantityNeeded: 0.5 // 0.5 kg per order
        }
      }
    }
  });

  console.log(`Created test items. Ingredient: ${ingredient.quantity}kg, Recipe: 0.5kg/pasta`);

  // 2. Test Success Ordering
  console.log("Testing order success...");
  const resp1 = await processOrder(hotel.id, {
    items: [{ menuItemId: menuItem.id, quantity: 2, price: 200 }],
    total: 400,
    paymentMethod: "EFECTIVO"
  });

  if (resp1.success) {
    const updatedIng = await prisma.inventoryItem.findUnique({ where: { id: ingredient.id } });
    console.log(`Order 1 success! Stock now: ${updatedIng?.quantity}kg (Expected: 9.0)`);
  } else {
    console.error("Order 1 failed unexpectedly:", resp1.error);
  }

  // 3. Test Failure (Insufficient Stock)
  console.log("Testing order failure (insufficient stock)...");
  const resp2 = await processOrder(hotel.id, {
    items: [{ menuItemId: menuItem.id, quantity: 20, price: 200 }], // Needs 10kg, only has 9kg
    total: 4000,
    paymentMethod: "EFECTIVO"
  });

  if (!resp2.success && resp2.code === "STOCK_ERROR") {
    console.log("Correctly failed with STOCK_ERROR:", resp2.error);
  } else {
    console.error("Order 2 should have failed but didn't or returned wrong error:", resp2);
  }

  // Cleanup
  await prisma.menuRecipeIngredient.deleteMany({ where: { menuItemId: menuItem.id } });
  await prisma.menuItem.delete({ where: { id: menuItem.id } });
  await prisma.inventoryItem.delete({ where: { id: ingredient.id } });
  console.log("--- TEST COMPLETED & CLEANED ---");
}

// Note: This script is intended to be run with ts-node or similar.
// testDeduction().catch(console.error);

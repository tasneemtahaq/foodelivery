import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import MenuClient from "./MenuClient";

export const dynamic = "force-dynamic";

type FoodWithCategory = Prisma.FoodGetPayload<{
  include: { category: true };
}>;

export default async function MenuPage() {
  let foods: FoodWithCategory[] = [];

  try {
    foods = await prisma.food.findMany({
      where:   { isAvailable: true },
      include: { category: true },
      orderBy: [{ categoryId: "asc" }, { id: "asc" }],
    });
  } catch (error) {
    console.error("Menu error:", error);
  }

  return <MenuClient foods={foods} />;
}
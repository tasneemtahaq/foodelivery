import { prisma } from "../../../lib/prisma";
import AdminFoodsClient from "./AdminFoodsClient";
import { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

export type AdminFood = Prisma.FoodGetPayload<{
  include: { category: true };
}>;

export type AdminCategory = Prisma.CategoryGetPayload<{
  include: { _count: { select: { foods: true } } };
}>;

export default async function AdminFoodsPage() {
  let foods:      AdminFood[]     = [];
  let categories: AdminCategory[] = [];

  try {
    foods = await prisma.food.findMany({
      include: { category: true },
      orderBy: { createdAt: "desc" },
    });
    categories = await prisma.category.findMany({
      include: { _count: { select: { foods: true } } },
    });
  } catch (error) {
    console.error("Admin foods error:", error);
  }

return (
  <AdminFoodsClient
    foods={foods}
    categories={categories}
  />
);
}
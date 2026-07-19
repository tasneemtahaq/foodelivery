import { prisma } from "../../lib/prisma";
import MenuClient from "./MenuClient";
import Footer from "../components/Footer";
import { Prisma } from "@prisma/client";

export type MenuFood = Prisma.FoodGetPayload<{
  include: { category: true };
}>;

export type MenuCategory = Prisma.CategoryGetPayload<{
  include: { _count: { select: { foods: true } } };
}>;

export default async function MenuPage() {
  let foods:      MenuFood[]     = [];
  let categories: MenuCategory[] = [];

  try {
    foods = await prisma.food.findMany({
      where:   { isAvailable: true },
      include: { category: true },
      orderBy: { createdAt: "desc" },
    });

    console.log("Foods found:", foods.length); console.log(foods);

    categories = await prisma.category.findMany({
      include: { _count: { select: { foods: true } } },
    });
  } catch (error) {
    console.error("Menu page DB error:", error);
  }

  return (
    <div className="min-h-screen" style={{ background: "#f9fafb" }}>
      <MenuClient foods={foods} categories={categories} />
      <Footer />
    </div>
  );
}
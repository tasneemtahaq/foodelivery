import { prisma } from "../lib/prisma";
import Hero from "./components/Hero";
import FeaturedFoods from "./components/FeaturedFoods";
import Categories from "./components/Categories";
import Footer from "./components/Footer";
import { Prisma } from "@prisma/client";

// ── Proper TypeScript types (no "any") ──
type FeaturedFood = Prisma.FoodGetPayload<{
  include: { category: true };
}>;

type CategoryWithCount = Prisma.CategoryGetPayload<{
  include: { _count: { select: { foods: true } } };
}>;

export default async function Home() {
  let featuredFoods: FeaturedFood[]      = [];
  let categories:    CategoryWithCount[] = [];

  try {
    featuredFoods = await prisma.food.findMany({
      where:   { isFeatured: true, isAvailable: true },
      include: { category: true },
      take:    8,
    });

    categories = await prisma.category.findMany({
      include: { _count: { select: { foods: true } } },
    });
  } catch (error) {
    console.error("Database error:", error);
  }

  return (
    <div className="min-h-screen">
      <Hero />
      <FeaturedFoods foods={featuredFoods} />
      <Categories categories={categories} />
      <Footer />
    </div>
  );
}
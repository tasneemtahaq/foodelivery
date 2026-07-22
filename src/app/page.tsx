import { prisma } from "../lib/prisma";
import Hero from "./components/Hero";
import FeaturedFoods from "./components/FeaturedFoods";
import Footer from "./components/Footer";
import { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";
// ── Proper TypeScript types (no "any") ──
type FeaturedFood = Prisma.FoodGetPayload<{
  include: { category: true };
}>;



export default async function Home() {
  let featuredFoods: FeaturedFood[]      = [];
  

  try {
    featuredFoods = await prisma.food.findMany({
      where:   { isFeatured: true, isAvailable: true },
      include: { category: true },
      take:    3,
    });

  
  } catch (error) {
    console.error("Database error:", error);
  }

  return (
    <div className="min-h-screen">
      <Hero />
      <FeaturedFoods foods={featuredFoods} />
      <Footer />
    </div>
  );
}
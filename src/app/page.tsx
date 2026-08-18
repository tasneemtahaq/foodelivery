import dynamicImport from "next/dynamic";
import { prisma } from "@/lib/prisma";
import Hero from "./components/Hero";
import Footer from "./components/Footer";
import { Prisma } from "@prisma/client";
import AIAssistant from "./components/AIAssistant";

export const dynamic = "force-dynamic";

// Load below-fold components only when needed
const FeaturedFoods = dynamicImport(
  () => import("./components/FeaturedFoods"),
  {
    loading: () => (
      <div className="py-20 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-64 rounded-2xl animate-pulse"
              style={{ background: "rgba(249,115,22,0.05)" }}
            />
          ))}
        </div>
      </div>
    ),
  }
);

const Categories = dynamicImport(
  () => import("./components/Categories"),
  {
    loading: () => (
      <div className="py-20 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-32 rounded-2xl animate-pulse"
              style={{ background: "rgba(249,115,22,0.05)" }}
            />
          ))}
        </div>
      </div>
    ),
  }
);

type FeaturedFood = Prisma.FoodGetPayload<{
  include: { category: true };
}>;

type CategoryWithCount = Prisma.CategoryGetPayload<{
  include: {
    _count: {
      select: {
        foods: true;
      };
    };
  };
}>;

export default async function Home() {
  let featuredFoods: FeaturedFood[] = [];
  let categories: CategoryWithCount[] = [];

  try {
    [featuredFoods, categories] = await Promise.all([
      prisma.food.findMany({
        where: {
          isFeatured: true,
          isAvailable: true,
        },
        include: {
          category: true,
        },
        take: 3,
      }),

      prisma.category.findMany({
        include: {
          _count: {
            select: {
              foods: true,
            },
          },
        },
      }),
    ]);
  } catch (error) {
    console.error("Database error:", error);
  }

  return (
    <div className="min-h-screen">
      <Hero />

      <FeaturedFoods foods={featuredFoods} />

      <Categories categories={categories} />

      {/* AI Assistant */}
      <AIAssistant menuItems={featuredFoods.map(f => ({
        id:          f.id,
        name:        f.name,
        price:       f.price,
        offerPrice:  f.offerPrice,
        description: f.description,
        category:    f.category.name,
      }))} />

      <Footer />
    </div>
  );
}
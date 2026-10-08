import { prisma } from "@/lib/prisma";
import HomeClient from "./components/HomeClient";
import { unstable_noStore as noStore } from "next/cache";
import  Footer  from "./components/Footer";


export default async function Home() {
  noStore();

  let featuredFoods: {
    id:          number;
    name:        string;
    price:       number;
    offerPrice:  number | null;
    description: string;
    image:       string | null;
    category:    { name: string };
  }[] = [];

  let categories: {
    id:     number;
    name:   string;
    image:  string | null;
    _count: { foods: number };
  }[] = [];

  try {
    [featuredFoods, categories] = await Promise.all([
      prisma.food.findMany({
        where:   { isFeatured: true, isAvailable: true },
        include: { category: true },
        take:    3,
      }),
      prisma.category.findMany({
        include: { _count: { select: { foods: true } } },
        take:    4,
      }),
    ]);
  } catch (error) {
    console.error("Database error:", error);
  }

  return (
    <>
    <HomeClient
      featuredFoods={featuredFoods}
      categories={categories} />
      <Footer />
      </>
  );
}
import { prisma } from "@/lib/prisma";
import AdminCategoriesClient from "./AdminCategoriesClient";
import { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

export type AdminCategory = Prisma.CategoryGetPayload<{
  include: { _count: { select: { foods: true } } };
}>;

export default async function AdminCategoriesPage() {
  let categories: AdminCategory[] = [];

  try {
    categories = await prisma.category.findMany({
      include: { _count: { select: { foods: true } } },
      orderBy: { name: "asc" },
    });
  } catch (error) {
    console.error("Categories error:", error);
  }

  return (
  <AdminCategoriesClient
    categories={categories}
  />
);
}
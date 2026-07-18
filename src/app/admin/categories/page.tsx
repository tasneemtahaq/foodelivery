import { prisma } from "@/lib/prisma";
import AdminSidebar from "../components/AdminSidebar";
import AdminCategoriesClient from "./AdminCategoriesClient";
import { Prisma } from "@prisma/client";

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
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 ml-64 p-8 pt-10">
        <AdminCategoriesClient categories={categories} />
      </main>
    </div>
  );
}
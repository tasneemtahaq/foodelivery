import { prisma } from "../../../lib/prisma";
import AdminSidebar from "../components/AdminSidebar";
import AdminOrdersClient from "./AdminOrdersClient";
import { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

export type AdminOrder = Prisma.OrderGetPayload<{
  include: {
    customer:   true;
    orderItems: { include: { food: true } };
  };
}>;

export default async function AdminOrdersPage() {
  let orders: AdminOrder[] = [];

  try {
    orders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        customer:   true,
        orderItems: { include: { food: true } },
      },
    });
  } catch (error) {
    console.error("Admin orders error:", error);
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 md:ml-64 p-4 md:p-8 pt-20 md:pt-10">
        <AdminOrdersClient orders={orders} />
      </main>
    </div>
  );
}
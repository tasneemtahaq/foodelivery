import { prisma } from "../../../lib/prisma";
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
  <AdminOrdersClient
    orders={orders}
  />
);
}
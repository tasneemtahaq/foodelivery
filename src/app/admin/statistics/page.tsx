import { prisma } from "@/lib/prisma";
import AdminSidebar from "../components/AdminSidebar";
import StatisticsClient from "./StatisticsClient";

export const dynamic = "force-dynamic";

export default async function StatisticsPage() {
  // Get all orders with items
  const orders = await prisma.order.findMany({
    include: {
      customer:   true,
      orderItems: { include: { food: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="flex min-h-screen w-full" style={{ background: "#0F0F0F" }}>
      <AdminSidebar />
      <main className="flex-1 min-w-0 pt-20 md:pt-8 p-4 md:p-8">
        <div className="md:ml-64">
          <StatisticsClient orders={orders} />
        </div>
      </main>
    </div>
  );
}
import { prisma } from "@/lib/prisma";
import AdminSidebar from "./components/AdminSidebar";
import AdminDashboardClient from "./AdminDashboardClient";

async function getStats() {
  try {
    const [
      totalOrders,
      pendingOrders,
      preparingOrders,
      deliveredOrders,
      cancelledOrders,
      totalCustomers,
      totalFoods,
      recentOrders,
      allOrders,
    ] = await Promise.all([
      prisma.order.count(),
      prisma.order.count({ where: { status: "pending"          } }),
      prisma.order.count({ where: { status: "preparing"        } }),
      prisma.order.count({ where: { status: "delivered"        } }),
      prisma.order.count({ where: { status: "cancelled"        } }),
      prisma.customer.count(),
      prisma.food.count(),
      prisma.order.findMany({
        take:    5,
        orderBy: { createdAt: "desc" },
        include: { customer: true },
      }),
      prisma.order.findMany({
        select: { totalAmount: true },
      }),
    ]);

    const totalRevenue = allOrders.reduce(
      (sum, o) => sum + o.totalAmount, 0
    );

    return {
      totalOrders,
      pendingOrders,
      preparingOrders,
      deliveredOrders,
      cancelledOrders,
      totalCustomers,
      totalFoods,
      totalRevenue,
      recentOrders,
    };
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return {
      totalOrders:     0,
      pendingOrders:   0,
      preparingOrders: 0,
      deliveredOrders: 0,
      cancelledOrders: 0,
      totalCustomers:  0,
      totalFoods:      0,
      totalRevenue:    0,
      recentOrders:    [],
    };
  }
}

export default async function AdminDashboard() {
  const stats = await getStats();

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 md:ml-64 p-4 md:p-8 pt-20 md:pt-10">
        <AdminDashboardClient stats={stats} />
      </main>
    </div>
  );
}
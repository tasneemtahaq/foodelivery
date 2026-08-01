import { prisma } from "@/lib/prisma";
import AdminSidebar from "../components/AdminSidebar";
import DeliveryAreasClient from "./DeliveryAreasClient";

export const dynamic = "force-dynamic";

export default async function DeliveryAreasPage() {
  const areas = await prisma.deliveryArea.findMany({
    orderBy: { deliveryCharge: "asc" },
  });

  return (
    <div className="flex min-h-screen w-full" style={{ background: "#0F0F0F" }}>
      <AdminSidebar />
      <main className="flex-1 min-w-0 pt-20 md:pt-8 p-4 md:p-8">
        <div className="md:ml-64">
          <DeliveryAreasClient areas={areas} />
        </div>
      </main>
    </div>
  );
}
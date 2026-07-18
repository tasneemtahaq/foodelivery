import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import OrderSummaryClient from "./OrderSummaryClient";
import Footer from "../../components/Footer";

interface PageProps {
  params: Promise<{ orderNumber: string }>;
}

export default async function OrderSummaryPage({ params }: PageProps) {
  const { orderNumber } = await params;

  let order = null;

  try {
    order = await prisma.order.findUnique({
      where:   { orderNumber },
      include: {
        customer:   true,
        orderItems: {
          include: { food: true },
        },
      },
    });
  } catch (error) {
    console.error("Order summary error:", error);
  }

  if (!order) notFound();

  return (
    <div
      className="min-h-screen"
      style={{ background: "#f9fafb", paddingTop: "80px" }}
    >
      <OrderSummaryClient order={order} />
      <Footer />
    </div>
  );
}
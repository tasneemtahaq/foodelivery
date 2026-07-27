import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id }    = await params;
    const { status } = await request.json();

    const validStatuses = [
      "pending",
      "preparing",
      "out_for_delivery",
      "delivered",
      "cancelled",
    ];

    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Invalid status" },
        { status: 400 }
      );
    }

    const order = await prisma.order.update({
      where: { id: parseInt(id) },
      data:  { status },
    });

    return NextResponse.json({ success: true, order });

  } catch (error) {
    console.error("Update order error:", error);
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 }
    );
  }
  
}
export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id }   = await context.params;
    const orderId  = parseInt(id);

    if (isNaN(orderId)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    // Delete order items first
    await prisma.orderItem.deleteMany({
      where: { orderId },
    });

    // Then delete the order
    await prisma.order.delete({
      where: { id: orderId },
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("DELETE order error:", error);
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    );
  }
}
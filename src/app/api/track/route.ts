import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// Compare only the last 10 digits, so 0333-2287497 matches 03332287497
const lastTen = (value: string) => value.replace(/\D/g, "").slice(-10);

export async function POST(request: NextRequest) {
  try {
    const { orderNumber, phone } = await request.json();

    if (!orderNumber || !phone) {
      return NextResponse.json(
        { error: "Please enter your order number and phone number." },
        { status: 400 }
      );
    }

    const order = await prisma.order.findUnique({
      where:   { orderNumber: String(orderNumber).trim().toUpperCase() },
      include: {
        customer:   true,
        orderItems: { include: { food: true } },
      },
    });

    // Same message for "not found" and "wrong phone", so nobody
    // can guess other people's orders
    if (!order || lastTen(order.customer.phone) !== lastTen(String(phone))) {
      return NextResponse.json(
        { error: "We couldn't find an order with those details. Please check and try again." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      order: {
        orderNumber:    order.orderNumber,
        status:         order.status,
        estimatedTime:  order.estimatedTime,
        createdAt:      order.createdAt,
        deliveryCharge: order.deliveryCharge,
        totalAmount:    order.totalAmount,
        items: order.orderItems.map((item) => ({
          id:       item.id,
          name:     item.food.name,
          quantity: item.quantity,
          price:    item.price,
        })),
      },
    });
  } catch (error) {
    console.error("Track API error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
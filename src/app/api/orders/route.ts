import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Generate unique order number like ORD-2024-001
async function generateOrderNumber(): Promise<string> {
  const count = await prisma.order.count();
  const year  = new Date().getFullYear();
  const num   = String(count + 1).padStart(3, "0");
  return `ORD-${year}-${num}`;
}

export async function POST(request: NextRequest) {
  console.log("✅ Orders API called!"); 
  try {
    const body = await request.json();

    const {
      customer,
      items,
      paymentMethod,
      instructions,
      deliveryCharge,
      totalAmount,
    } = body;

    // ── Validate required fields ──
    if (!customer?.name || !customer?.phone || !customer?.address) {
      return NextResponse.json(
        { error: "Missing required customer fields" },
        { status: 400 }
      );
    }

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: "Cart is empty" },
        { status: 400 }
      );
    }

    // ── Create or find customer ──
    const existingCustomer = await prisma.customer.findFirst({
      where: { phone: customer.phone },
    });

    const savedCustomer = existingCustomer
      ? await prisma.customer.update({
          where: { id: existingCustomer.id },
          data:  {
            name:    customer.name,
            address: customer.address,
            city:    customer.city,
            area:    customer.area ?? "",
            email:   customer.email ?? null,
          },
        })
      : await prisma.customer.create({
          data: {
            name:    customer.name,
            phone:   customer.phone,
            email:   customer.email ?? null,
            address: customer.address,
            city:    customer.city,
            area:    customer.area ?? "",
          },
        });

    // ── Generate order number ──
    const orderNumber = await generateOrderNumber();

    // ── Create the order ──
    const order = await prisma.order.create({
      data: {
        orderNumber,
        paymentMethod,
        instructions:  instructions ?? "",
        deliveryCharge,
        totalAmount,
        estimatedTime: "30-45 minutes",
        customerId:    savedCustomer.id,
        orderItems: {
          create: items.map((item: {
            id:       number;
            quantity: number;
            price:    number;
          }) => ({
            foodId:   item.id,
            quantity: item.quantity,
            price:    item.price,
          })),
        },
      },
      include: {
        customer:   true,
        orderItems: { include: { food: true } },
      },
    });

    // ── Build WhatsApp message ──
    const itemsList = order.orderItems
      .map((item) =>
        `• ${item.food.name} x${item.quantity} = Rs.${item.price * item.quantity}`
      )
      .join("\n");

    const message =
      `🔔 *NEW ORDER — Mama Soups*\n\n` +
      `*Order #:* ${order.orderNumber}\n\n` +
      `👤 *Customer*\n` +
      `Name: ${savedCustomer.name}\n` +
      `Phone: ${savedCustomer.phone}\n` +
      `Address: ${savedCustomer.address}` +
      `${savedCustomer.area ? `, ${savedCustomer.area}` : ""}` +
      `, ${savedCustomer.city}\n\n` +
      `🛒 *Items*\n${itemsList}\n\n` +
      `💰 *Total: Rs.${totalAmount}*\n` +
      `Payment: ${paymentMethod}\n\n` +
      `${instructions ? `📝 Notes: ${instructions}\n\n` : ""}` +
      `⏰ ${new Date().toLocaleString("en-PK")}`;

    const whatsappLink =
      `https://wa.me/923312287497?text=${encodeURIComponent(message)}`;

    return NextResponse.json({
      success:      true,
      orderNumber:  order.orderNumber,
      orderId:      order.id,
      whatsappLink,
    });

  } catch (error) {
    console.error("Order API error:", error);
    return NextResponse.json(
      { error: "Failed to place order. Please try again." },
      { status: 500 }
    );
  }
}
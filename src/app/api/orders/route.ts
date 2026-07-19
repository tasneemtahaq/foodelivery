import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

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

    // ── Send Email Notification ──
    const itemsHtml = order.orderItems
      .map(
        (item) => `
        <tr>
          <td style="padding:8px;border-bottom:1px solid #f0f0f0">${item.food.name}</td>
          <td style="padding:8px;border-bottom:1px solid #f0f0f0;text-align:center">${item.quantity}</td>
          <td style="padding:8px;border-bottom:1px solid #f0f0f0;text-align:right">Rs.${item.price * item.quantity}</td>
        </tr>`
      )
      .join("");

    try {
      await resend.emails.send({
        from:    "Mama Soups Orders <onboarding@resend.dev>",
        to:      [process.env.ADMIN_EMAIL_NOTIFY ?? "admin@mamasoups.com"],
        subject: `🔔 New Order #${order.orderNumber} — Rs.${totalAmount}`,
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
            
            <!-- Header -->
            <div style="background:linear-gradient(135deg,#F97316,#EA580C);padding:24px;border-radius:12px 12px 0 0;text-align:center">
              <h1 style="color:white;margin:0;font-size:24px">🍜 New Order Received!</h1>
              <p style="color:rgba(255,255,255,0.85);margin:8px 0 0">Mama Soups</p>
            </div>

            <!-- Order Number -->
            <div style="background:#fff7ed;padding:16px;text-align:center;border-left:1px solid #fed7aa;border-right:1px solid #fed7aa">
              <p style="margin:0;font-size:14px;color:#92400e">Order Number</p>
              <p style="margin:4px 0 0;font-size:28px;font-weight:bold;color:#F97316">${order.orderNumber}</p>
            </div>

            <!-- Customer Details -->
            <div style="padding:24px;background:white;border-left:1px solid #e5e7eb;border-right:1px solid #e5e7eb">
              <h2 style="font-size:16px;color:#1F2937;margin:0 0 12px">👤 Customer Details</h2>
              <table style="width:100%">
                <tr><td style="padding:4px 0;color:#6B7280;width:100px">Name:</td><td style="padding:4px 0;font-weight:600;color:#1F2937">${savedCustomer.name}</td></tr>
                <tr><td style="padding:4px 0;color:#6B7280">Phone:</td><td style="padding:4px 0;font-weight:600;color:#1F2937">${savedCustomer.phone}</td></tr>
                <tr><td style="padding:4px 0;color:#6B7280">Address:</td><td style="padding:4px 0;font-weight:600;color:#1F2937">${savedCustomer.address}${savedCustomer.area ? `, ${savedCustomer.area}` : ""}, ${savedCustomer.city}</td></tr>
                <tr><td style="padding:4px 0;color:#6B7280">Payment:</td><td style="padding:4px 0;font-weight:600;color:#1F2937">${paymentMethod}</td></tr>
                ${instructions ? `<tr><td style="padding:4px 0;color:#6B7280">Notes:</td><td style="padding:4px 0;color:#1F2937">${instructions}</td></tr>` : ""}
              </table>
            </div>

            <!-- Order Items -->
            <div style="padding:24px;background:white;border-left:1px solid #e5e7eb;border-right:1px solid #e5e7eb;border-top:1px solid #f0f0f0">
              <h2 style="font-size:16px;color:#1F2937;margin:0 0 12px">🛒 Order Items</h2>
              <table style="width:100%;border-collapse:collapse">
                <thead>
                  <tr style="background:#f9fafb">
                    <th style="padding:8px;text-align:left;font-size:12px;color:#6B7280">ITEM</th>
                    <th style="padding:8px;text-align:center;font-size:12px;color:#6B7280">QTY</th>
                    <th style="padding:8px;text-align:right;font-size:12px;color:#6B7280">PRICE</th>
                  </tr>
                </thead>
                <tbody>${itemsHtml}</tbody>
              </table>
            </div>

            <!-- Total -->
            <div style="padding:16px 24px;background:#fff7ed;border:1px solid #fed7aa;border-top:none;display:flex;justify-content:space-between">
              <span style="font-weight:bold;color:#1F2937">Total Amount</span>
              <span style="font-weight:bold;font-size:20px;color:#F97316">Rs.${totalAmount}</span>
            </div>

            <!-- Action Button -->
            <div style="padding:24px;background:white;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 12px 12px;text-align:center">
              <a href="https://wa.me/923312287497?text=${encodeURIComponent(message)}"
                 style="display:inline-block;background:linear-gradient(135deg,#25D366,#1ebe57);color:white;padding:12px 32px;border-radius:8px;text-decoration:none;font-weight:bold;margin-right:12px">
                📱 Reply on WhatsApp
              </a>
              <p style="margin:16px 0 0;font-size:12px;color:#9CA3AF">
                ${new Date().toLocaleString("en-PK")}
              </p>
            </div>
          </div>
        `,
      });
      console.log("✅ Email notification sent!");
    } catch (emailError) {
      // Don't fail the order if email fails
      console.error("Email failed:", emailError);
    }

    return NextResponse.json({
      success:      true,
      orderNumber:  order.orderNumber,
      orderId:      order.id,
      whatsappLink,
    });

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
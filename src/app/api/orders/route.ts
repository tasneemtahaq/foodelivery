import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";

export const dynamic = "force-dynamic";

const resend = new Resend(process.env.RESEND_API_KEY);

// ── Generate unique order number ──
async function generateOrderNumber(): Promise<string> {
  const year      = new Date().getFullYear();
  const timestamp = Date.now().toString().slice(-6);
  const random    = Math.floor(Math.random() * 100).toString().padStart(2, "0");
  return `ORD-${year}-${timestamp}${random}`;
}

export async function POST(request: NextRequest) {
  console.log("✅ Orders API called!");
  try {
    const body = await request.json();

    const {
      customer,
      items,
      paymentMethod,
      instructions  = "",
      deliveryCharge = 0,
      totalAmount,
      screenshotUrl  = null,
    } = body;

    // ── Validate ──
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

    // ── Create order ──
    const order = await prisma.order.create({
      data: {
        orderNumber,
        paymentMethod,
        instructions:  instructions ?? "",
        deliveryCharge,
        totalAmount,
        screenshotUrl: screenshotUrl ?? null,
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

    console.log(`✅ Order created: ${order.orderNumber}`);

    // ── Send Email ──
    const itemsHtml = order.orderItems
      .map((item) => `
        <tr>
          <td style="padding:8px;border-bottom:1px solid #f0f0f0">${item.food.name}</td>
          <td style="padding:8px;border-bottom:1px solid #f0f0f0;text-align:center">${item.quantity}</td>
          <td style="padding:8px;border-bottom:1px solid #f0f0f0;text-align:right">Rs.${item.price * item.quantity}</td>
        </tr>`)
      .join("");

    try {
      await resend.emails.send({
        from:    "Mama Soups Orders <onboarding@resend.dev>",
        to:      [process.env.ADMIN_EMAIL_NOTIFY ?? "admin@mamasoups.com"],
        subject: `🔔 New Order #${order.orderNumber} — Rs.${totalAmount}`,
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
            <div style="background:linear-gradient(135deg,#F97316,#EA580C);padding:24px;border-radius:12px 12px 0 0;text-align:center">
              <h1 style="color:white;margin:0;font-size:24px">🍜 New Order Received!</h1>
              <p style="color:rgba(255,255,255,0.85);margin:8px 0 0">Mama Soups</p>
            </div>
            <div style="background:#fff7ed;padding:16px;text-align:center;border-left:1px solid #fed7aa;border-right:1px solid #fed7aa">
              <p style="margin:0;font-size:14px;color:#92400e">Order Number</p>
              <p style="margin:4px 0 0;font-size:28px;font-weight:bold;color:#F97316">${order.orderNumber}</p>
            </div>
            <div style="padding:24px;background:white;border-left:1px solid #e5e7eb;border-right:1px solid #e5e7eb">
              <h2 style="font-size:16px;color:#1F2937;margin:0 0 12px">👤 Customer Details</h2>
              <table style="width:100%">
                <tr><td style="padding:4px 0;color:#6B7280;width:100px">Name:</td><td style="padding:4px 0;font-weight:600;color:#1F2937">${savedCustomer.name}</td></tr>
                <tr><td style="padding:4px 0;color:#6B7280">Phone:</td><td style="padding:4px 0;font-weight:600;color:#1F2937">${savedCustomer.phone}</td></tr>
                <tr><td style="padding:4px 0;color:#6B7280">Address:</td><td style="padding:4px 0;font-weight:600;color:#1F2937">${savedCustomer.address}${savedCustomer.area ? `, ${savedCustomer.area}` : ""}, ${savedCustomer.city}</td></tr>
                <tr><td style="padding:4px 0;color:#6B7280">Payment:</td><td style="padding:4px 0;font-weight:600;color:#1F2937">${paymentMethod}</td></tr>
                ${instructions ? `<tr><td style="padding:4px 0;color:#6B7280">Notes:</td><td style="padding:4px 0;color:#1F2937">${instructions}</td></tr>` : ""}
                ${screenshotUrl ? `
                <tr>
                  <td style="padding:4px 0;color:#6B7280;vertical-align:top">Screenshot:</td>
                  <td style="padding:4px 0">
                    <a href="${screenshotUrl}" target="_blank" style="color:#F97316;font-weight:bold;text-decoration:none">
                      📸 View Payment Screenshot →
                    </a>
                  </td>
                </tr>` : ""}
              </table>
            </div>
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
            <div style="padding:16px 24px;background:#fff7ed;border:1px solid #fed7aa;border-top:none">
              <div style="display:flex;justify-content:space-between;align-items:center">
                <span style="font-weight:bold;color:#1F2937">Total Amount</span>
                <span style="font-weight:bold;font-size:20px;color:#F97316">Rs.${totalAmount}</span>
              </div>
            </div>
            ${screenshotUrl ? `
            <div style="padding:16px 24px;background:white;border:1px solid #e5e7eb;border-top:none">
              <p style="font-weight:bold;color:#1F2937;margin:0 0 8px">📸 Payment Screenshot:</p>
              <img src="${screenshotUrl}" alt="Payment Screenshot"
                   style="width:100%;max-height:300px;object-fit:contain;border-radius:8px;border:1px solid #e5e7eb" />
            </div>` : ""}
            <div style="padding:16px 24px;background:white;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 12px 12px;text-align:center">
              <p style="margin:0;font-size:12px;color:#9CA3AF">${new Date().toLocaleString("en-PK")}</p>
            </div>
          </div>
        `,
      });
      console.log("✅ Email sent!");
    } catch (emailError) {
      console.error("Email failed:", emailError);
    }

   
       // ── Send Slack Notification ──
    try {
      const webhookUrl = process.env.SLACK_WEBHOOK_URL;

      if (!webhookUrl) {
        console.log("⚠️ No SLACK_WEBHOOK_URL in .env — skipping Slack");
      } else {
        // Slack treats < > & as special characters, so we make customer
        // text safe (this also stops fake @channel pings)
        const esc = (text: string) =>
          String(text)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");

        const address = `${savedCustomer.address}${
          savedCustomer.area ? `, ${savedCustomer.area}` : ""
        }, ${savedCustomer.city}`;

        const itemsText = order.orderItems
          .map(
            (item) =>
              `• ${esc(item.food.name)} × ${item.quantity} — Rs.${item.price * item.quantity}`
          )
          .join("\n");

        // Only accept screenshots that really came from our Cloudinary
        const safeScreenshot =
          typeof screenshotUrl === "string" &&
          screenshotUrl.startsWith("https://res.cloudinary.com/")
            ? screenshotUrl
            : null;

        const blocks: Record<string, unknown>[] = [
          {
            type: "header",
            text: { type: "plain_text", text: "🛍️ New Order — Mama Soups", emoji: true },
          },
          {
            type: "section",
            fields: [
              { type: "mrkdwn", text: `*Order Number*\n${order.orderNumber}` },
              { type: "mrkdwn", text: `*Total*\nRs.${totalAmount}` },
              { type: "mrkdwn", text: `*Payment*\n${esc(paymentMethod)}` },
              { type: "mrkdwn", text: `*Delivery charge*\nRs.${deliveryCharge}` },
              { type: "mrkdwn", text: `*Customer*\n${esc(savedCustomer.name)}` },
              { type: "mrkdwn", text: `*Phone*\n${esc(savedCustomer.phone)}` },
            ],
          },
          {
            type: "section",
            text: { type: "mrkdwn", text: `*Address*\n${esc(address)}` },
          },
          {
            type: "section",
            text: { type: "mrkdwn", text: `*Items*\n${itemsText}` },
          },
        ];

        if (instructions) {
          blocks.push({
            type: "section",
            text: { type: "mrkdwn", text: `*Instructions*\n${esc(instructions)}` },
          });
        }

        if (safeScreenshot) {
          blocks.push({
            type: "section",
            text: {
              type: "mrkdwn",
              text: `*Payment screenshot*\n<${safeScreenshot}|Open full size>`,
            },
          });
          blocks.push({
            type: "image",
            image_url: safeScreenshot,
            alt_text: "Payment screenshot",
          });
        }

        blocks.push({
          type: "context",
          elements: [
            { type: "mrkdwn", text: new Date().toLocaleString("en-PK") },
          ],
        });

        const slackRes = await fetch(webhookUrl, {
          method:  "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            // This line is what shows in your phone's notification
            text: `New order ${order.orderNumber} — Rs.${totalAmount}`,
            blocks,
          }),
        });

        if (slackRes.ok) {
          console.log("✅ Slack notification sent!");
        } else {
          const errorText = await slackRes.text();
          console.error("Slack error:", errorText);
        }
      }
    } catch (slackError) {
      console.error("Slack failed:", slackError);
    }

    return NextResponse.json({
      success:       true,
      orderNumber:   order.orderNumber,
      orderId:       order.id,
      estimatedTime: order.estimatedTime,
    });

  } catch (error) {
    console.error("❌ Order API error:", error);
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    );
  }
}
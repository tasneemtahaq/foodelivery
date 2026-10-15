import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { BUSINESS } from "@/lib/business";

export const dynamic = "force-dynamic";

type ChatMessage = { role: "user" | "assistant"; content: string };

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "API key not configured" },
        { status: 500 }
      );
    }

    // Keep only normal chat messages (stops anyone from sneaking in fake
    // "system" instructions) and limit the length
    const messages: ChatMessage[] = (Array.isArray(body.messages) ? body.messages : [])
      .filter(
        (m: { role?: string; content?: unknown }) =>
          (m.role === "user" || m.role === "assistant") &&
          typeof m.content === "string"
      )
      .slice(-12)
      .map((m: ChatMessage) => ({
        role:    m.role,
        content: m.content.slice(0, 1000),
      }));

    if (messages.length === 0) {
      return NextResponse.json({ error: "No message" }, { status: 400 });
    }

    // ── Load the live menu and delivery charges from the database ──
    let menuText  = "(The live menu could not be loaded. Ask the customer to open the Menu page.)";
    let areasText = "(Delivery areas could not be loaded. Ask the customer to open the Delivery Areas page.)";

    try {
      const [foods, areas] = await Promise.all([
        prisma.food.findMany({
          where:   { isAvailable: true },
          include: { category: true },
          orderBy: [{ categoryId: "asc" }, { id: "asc" }],
        }),
        prisma.deliveryArea.findMany({
          where:   { isActive: true },
          orderBy: { deliveryCharge: "asc" },
        }),
      ]);

      if (foods.length > 0) {
        menuText = foods
          .map(
            (f) =>
              `- ${f.name} (${f.category.name}): Rs.${f.offerPrice ?? f.price}` +
              `${f.offerPrice ? ` (usual price Rs.${f.price})` : ""} — ${f.description}`
          )
          .join("\n");
      }

      if (areas.length > 0) {
        areasText = areas
          .map((a) => `- ${a.name}: Rs.${a.deliveryCharge}`)
          .join("\n");
      }
    } catch (dbError) {
      console.error("Chat: could not load menu:", dbError);
    }

    const systemPrompt = `You are the friendly ordering assistant for ${BUSINESS.name}, a soup, fries and puri takeaway in Karachi, Pakistan. You chat with customers on our website.

OUR MENU (prices in Rs.):
${menuText}

DELIVERY AREAS AND DELIVERY CHARGES:
${areasText}

BUSINESS FACTS:
- Opening hours: ${BUSINESS.hoursText}
- We deliver within about ${BUSINESS.deliveryRadius} of ${BUSINESS.address}
- Estimated delivery time: ${BUSINESS.deliveryTime}
- Phone: ${BUSINESS.phone}
- Payment options: ${BUSINESS.payments}
- Customers can track an order at mamasoups.net/track using their order number and phone number.
- Customers order on the website: tap Add to Cart on the Menu page, then Checkout. You cannot place orders yourself.
- Popular items: ${BUSINESS.popularItems.join(", ")} (only mention an item if it is on the menu above).
- Taste notes (use these when describing food or matching flavours):
${BUSINESS.menuNotes}
${BUSINESS.currentOffer ? `- Current offer (mention it when it fits): ${BUSINESS.currentOffer}` : ""}

HOW TO TALK:
- Be warm, cheerful and short: 1 to 3 sentences. No markdown and no asterisks.
- Reply in the customer's language: English, Urdu, or Roman Urdu (Urdu written in English letters).
- Give a confident recommendation instead of listing everything. For example suggest a soup, then offer a fries or a soda to go with it.
- Ask only one simple question at a time, like "Do you like spicy food?" or "How many people are you ordering for?".
- Finish by gently inviting them to order, for example: "Tap View Menu below and add it to your cart!".
- Mention a delivery charge only when the customer tells you their area, using the list above.

STRICT RULES:
- Use ONLY the menu, prices, areas and facts above. Never invent items, prices, discounts, offers, ingredients or delivery times.
- If you do not know something, say so and suggest calling ${BUSINESS.phone}.
- Do not talk about anything unrelated to ordering from us. Politely steer back to the menu.`;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method:  "POST",
      headers: {
        "Content-Type":  "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model:      "openai/gpt-oss-20b",
        max_tokens: 800,
        messages:   [{ role: "system", content: systemPrompt }, ...messages],
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("Groq error:", response.status, err);
      return NextResponse.json({ error: "AI service error" }, { status: 500 });
    }

    const data = await response.json();

    const reply = String(data.choices?.[0]?.message?.content ?? "")
      .replace(/<think>[\s\S]*?<\/think>/g, "")
      .replace(/\*\*/g, "")
      .trim();

    return NextResponse.json({
      reply:
        reply ||
        `Sorry, I couldn't think of an answer. Please see our Menu page or call ${BUSINESS.phone}.`,
    });
  } catch (error) {
    console.error("Chat error:", error);
    return NextResponse.json({ error: "Chat failed" }, { status: 500 });
  }
}
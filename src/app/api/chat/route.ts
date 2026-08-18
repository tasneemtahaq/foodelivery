import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const { messages, menuItems } = await request.json();

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "API key not configured" },
        { status: 500 }
      );
    }

    // Build menu context
    const menuContext = menuItems
      .map((item: {
        name:        string;
        category:    string;
        price:       number;
        offerPrice:  number | null;
        description: string;
      }) =>
        `- ${item.name} (${item.category}): Rs.${item.offerPrice ?? item.price} — ${item.description}`
      )
      .join("\n");

    const systemPrompt = `You are a friendly food ordering assistant for "Mama Soups" restaurant in Karachi, Pakistan.

MENU:
${menuContext}

RESTAURANT INFO:
- Delivery hours: Monday to Saturday, 5:00 PM to 10:30 PM
- Closed on Sundays
- Delivery within 8km radius in Karachi
- Areas: Saddar, Civil Lines, Garden, Lines Area, Soldier Bazaar, Jamshed Quarter, PECHS, Nursery, Tariq Road, Bahadurabad, Clifton, Boat Basin, Bath Island, Defence Phase 1-4, Gizri
- Delivery charges: Rs.100 to Rs.450 depending on area

YOUR JOB:
- Help customers choose from the menu
- Answer questions about food, prices, delivery
- Suggest popular items
- Be friendly and helpful
- Keep responses short (2-3 sentences max)
- Use emojis occasionally
- Guide customers to click Add to Cart on the menu page to order
- Respond in the same language the customer uses (Urdu or English)

POPULAR ITEMS:
- Chicken Corn Soup (best seller!)
- Masala Fries
- Pani Puri
- Blue Fire Fries (very spicy!)
- Green Chilli fries (mild spicy)
- Barbque Fries (smoky mild spicy)
- Chatpata fries (tangy & spicy)
- Salsa Fries (tangy)
- Cheese Fries (Cheddar cheesy Flavour)
- Plain French Fries (classic crispy)
- Flavoured Sodas (Blueberry, Apple, Orange, Lemon, Icecream Soda)
- Yakhi Soup (Chicken, Mutton, Beef)
- Flavoured Fries (Cheese, BBQ, Green Chilli, Blue Fire, Masala, Chatpata, Plain salted, Salsa)
- French Fries (Classic, Crispy)
- Pani Puri (Spicy & Tangy)
- Flavoured Soda (Refreshing & Fizzy)`;

    // Call Groq API
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method:  "POST",
      headers: {
        "Content-Type":  "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-20b",
        max_tokens: 500,
        messages:   [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("Groq error:", response.status, err);
      return NextResponse.json(
        { error: `API error ${response.status}` },
        { status: 500 }
      );
    }

    const data  = await response.json();
    let reply = data.choices?.[0]?.message?.content
      ?? "Sorry, I could not process that!";

    // Remove <think> reasoning blocks from response
    reply = reply.replace(/<think>[\s\S]*?<\/think>/g, "").trim();

    return NextResponse.json({ reply });

  } catch (error) {
    console.error("Chat error:", error);
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    );
  }
}
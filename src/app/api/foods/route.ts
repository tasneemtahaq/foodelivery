import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const foods = await prisma.food.findMany({
      include: { category: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ foods });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.name || !body.price || !body.categoryId) {
      return NextResponse.json(
        { error: "Name, price and category required" },
        { status: 400 }
      );
    }

    const food = await prisma.food.create({
      data: {
        name:        String(body.name).trim(),
        description: body.description ? String(body.description).trim() : "",
        price:       parseFloat(String(body.price)),
        offerPrice:  body.offerPrice ? parseFloat(String(body.offerPrice)) : null,
        categoryId:  parseInt(String(body.categoryId)),
        isAvailable: body.isAvailable !== undefined ? Boolean(body.isAvailable) : true,
        isFeatured:  body.isFeatured  !== undefined ? Boolean(body.isFeatured)  : false,
      },
      include: { category: true },
    });

    return NextResponse.json({ success: true, food });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
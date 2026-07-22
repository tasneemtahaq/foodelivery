import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const foodId  = parseInt(id);

    if (isNaN(foodId)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const body = await request.json();
    const data: Record<string, unknown> = {};

    if (body.name        !== undefined) data.name        = String(body.name).trim();
    if (body.description !== undefined) data.description = String(body.description).trim();
    if (body.isAvailable !== undefined) data.isAvailable = Boolean(body.isAvailable);
    if (body.isFeatured  !== undefined) data.isFeatured  = Boolean(body.isFeatured);
    if (body.price       !== undefined) data.price       = parseFloat(String(body.price));
    if (body.categoryId  !== undefined) data.categoryId  = parseInt(String(body.categoryId));
    if (body.offerPrice  !== undefined) {
      data.offerPrice = body.offerPrice
        ? parseFloat(String(body.offerPrice))
        : null;
    }

    const food = await prisma.food.update({
      where:   { id: foodId },
      data,
      include: { category: true },
    });

    return NextResponse.json({ success: true, food });

  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const foodId  = parseInt(id);

    if (isNaN(foodId)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const orderCount = await prisma.orderItem.count({
      where: { foodId },
    });

    if (orderCount > 0) {
      const food = await prisma.food.update({
        where:   { id: foodId },
        data:    { isAvailable: false },
        include: { category: true },
      });
      return NextResponse.json({ success: true, softDelete: true, food });
    }

    await prisma.food.delete({ where: { id: foodId } });
    return NextResponse.json({ success: true, softDelete: false });

  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
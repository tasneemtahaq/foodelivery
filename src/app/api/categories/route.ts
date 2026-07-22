import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: { _count: { select: { foods: true } } },
      orderBy: { name: "asc" },
    });
    return NextResponse.json({ categories });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name } = await request.json();
    if (!name?.trim()) {
      return NextResponse.json({ error: "Name required" }, { status: 400 });
    }
    const category = await prisma.category.create({
      data:    { name: name.trim() },
      include: { _count: { select: { foods: true } } },
    });
    return NextResponse.json({ success: true, category });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const areas = await prisma.deliveryArea.findMany({
      where:   { isActive: true },
      orderBy: { deliveryCharge: "asc" },
    });
    return NextResponse.json({ areas });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, deliveryCharge } = await request.json();

    if (!name || deliveryCharge === undefined) {
      return NextResponse.json(
        { error: "Name and delivery charge required" },
        { status: 400 }
      );
    }

    const area = await prisma.deliveryArea.create({
      data: {
        name,
        deliveryCharge: parseInt(deliveryCharge),
      },
    });

    return NextResponse.json({ success: true, area });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
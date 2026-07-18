import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Returns count of orders placed in last 2 minutes
export async function GET() {
  try {
    const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000);

    const count = await prisma.order.count({
      where: {
        status:    "pending",
        createdAt: { gte: twoMinutesAgo },
      },
    });

    return NextResponse.json({ count });
  } catch (error) {
    return NextResponse.json({ count: 0, error: String(error) });
  }
}
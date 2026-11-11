import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminRequest } from "@/lib/adminAuth";
import { BUSINESS } from "@/lib/business";

export const dynamic = "force-dynamic";

const closedMessage = () =>
  `We're closed right now and not taking orders. Our hours: ${BUSINESS.hoursText}.`;

async function getSettings() {
  const existing = await prisma.settings.findFirst();
  if (existing) return existing;
  return prisma.settings.create({ data: {} });
}

// Anyone can ask "are you open?"
export async function GET() {
  try {
    const settings = await getSettings();
    return NextResponse.json({
      open:    settings.ordersOpen,
      message: settings.ordersOpen ? "" : closedMessage(),
    });
  } catch (error) {
    console.error("Store status error:", error);
    // If the database can't be reached, don't lock customers out
    return NextResponse.json({ open: true, message: "" });
  }
}

// Only a logged-in admin can open or close the shop
export async function PATCH(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json(
      { error: "Please log out and log in to admin again." },
      { status: 401 }
    );
  }

  try {
    const { ordersOpen } = await request.json();

    if (typeof ordersOpen !== "boolean") {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const settings = await getSettings();
    const updated = await prisma.settings.update({
      where: { id: settings.id },
      data:  { ordersOpen },
    });

    return NextResponse.json({
      open:    updated.ordersOpen,
      message: updated.ordersOpen ? "" : closedMessage(),
    });
  } catch (error) {
    console.error("Store status update error:", error);
    return NextResponse.json({ error: "Could not update" }, { status: 500 });
  }
}
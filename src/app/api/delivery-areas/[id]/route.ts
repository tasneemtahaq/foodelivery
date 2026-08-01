import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id }   = await context.params;
    const body     = await request.json();

    const area = await prisma.deliveryArea.update({
      where: { id: parseInt(id) },
      data:  {
        name:           body.name           !== undefined ? body.name           : undefined,
        deliveryCharge: body.deliveryCharge !== undefined ? parseInt(body.deliveryCharge) : undefined,
        isActive:       body.isActive       !== undefined ? body.isActive       : undefined,
      },
    });

    return NextResponse.json({ success: true, area });
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
    await prisma.deliveryArea.delete({ where: { id: parseInt(id) } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
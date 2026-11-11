import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { ADMIN_COOKIE, createAdminToken, adminCookieOptions } from "@/lib/adminAuth";

export async function POST(request: NextRequest) {
  try {
    const { email, password, isAdmin } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password required" },
        { status: 400 }
      );
    }

    if (isAdmin) {
      // ── Admin Login ──
      const admin = await prisma.admin.findUnique({
        where: { email },
      });

      if (!admin) {
        return NextResponse.json(
          { error: "Invalid email or password" },
          { status: 401 }
        );
      }

      const isValid = await bcrypt.compare(password, admin.password);
      if (!isValid) {
        return NextResponse.json(
          { error: "Invalid email or password" },
          { status: 401 }
        );
      }

        const response = NextResponse.json({
        success: true,
        role:    "admin",
        user: { id: admin.id, email: admin.email },
      });
      response.cookies.set(ADMIN_COOKIE, createAdminToken(admin.id), adminCookieOptions);
      return response;

    } else {
      // ── Customer Login ──
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        return NextResponse.json(
          { error: "No account found with this email" },
          { status: 401 }
        );
      }

      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        return NextResponse.json(
          { error: "Incorrect password" },
          { status: 401 }
        );
      }

      return NextResponse.json({
        success: true,
        role:    "customer",
        user: {
          id:    user.id,
          name:  user.name,
          email: user.email,
          phone: user.phone,
        },
      });
    }

  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    );
  }
}
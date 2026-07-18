"use client";

import { useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router     = useRouter();
  const pathname   = usePathname();
  const user       = useAuthStore((s) => s.user);
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const hydrated   = useAuthStore((s) => s.hasHydrated);
  const checked    = useRef(false);

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (!hydrated) return;
    if (checked.current) return;
    checked.current = true;

    if (isLoginPage) return;

    if (!isLoggedIn || user?.role !== "admin") {
      router.push("/admin/login");
    }
  }, [hydrated, isLoggedIn, user, router, isLoginPage]);

  // If on login page — show it directly
  if (isLoginPage) {
    return (
      <div className="min-h-screen" style={{ background: "#0F0F0F" }}>
        {children}
      </div>
    );
  }

  // Not hydrated yet or not admin — show loader
  if (!hydrated || !isLoggedIn || user?.role !== "admin") {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center gap-3"
        style={{ background: "#0F0F0F" }}
      >
        <div
          className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin"
          style={{ borderColor: "#F97316", borderTopColor: "transparent" }}
        />
        <p className="text-sm" style={{ color: "#6B7280" }}>
          Checking authentication...
        </p>
      </div>
    );
  }

  // Admin is logged in — show admin panel
  return (
    <div className="min-h-screen" style={{ background: "#0F0F0F" }}>
      {children}
    </div>
  );
}
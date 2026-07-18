"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router     = useRouter();
  const user       = useAuthStore((s) => s.user);
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const hydrated   = useAuthStore((s) => s.hasHydrated);

  useEffect(() => {
    if (!hydrated) return;

    // Redirect to admin login if not logged in as admin
    if (!isLoggedIn || user?.role !== "admin") {
      router.push("/admin/login");
    }
  }, [hydrated, isLoggedIn, user, router]);

  // Show loading while checking auth
  if (!hydrated || !isLoggedIn || user?.role !== "admin") {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "#0F0F0F" }}
      >
        <div
          className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin"
          style={{ borderColor: "#F97316", borderTopColor: "transparent" }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "#0F0F0F" }}>
      {children}
    </div>
  );
}
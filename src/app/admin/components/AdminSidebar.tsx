"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  LayoutDashboard, UtensilsCrossed, ShoppingBag,
  Users, Settings, LogOut, Tag,
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/admin",          icon: LayoutDashboard },
  { label: "Orders",    href: "/admin/orders",   icon: ShoppingBag     },
  { label: "Foods",     href: "/admin/foods",    icon: UtensilsCrossed },
  { label: "Categories",href: "/admin/categories",icon: Tag            },
  { label: "Customers", href: "/admin/customers",icon: Users           },
  { label: "Settings",  href: "/admin/settings", icon: Settings        },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="fixed left-0 top-0 bottom-0 w-64 flex flex-col z-40"
      style={{
        background: "#111111",
        borderRight: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <Image
                    src="/images/logo.png"
                    alt="Logo"
                    width={60}
                    height={60}
                    style={{ width: "auto", height: "36px", objectFit: "contain" }}
                  />
<div>
  <p className="font-bold text-white text-sm">Mama Soups</p>
  <p className="text-xs" style={{ color: "#6B7280" }}>Admin Panel</p>
</div>

      {/* Nav Links */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        {NAV_ITEMS.map((item) => {
          const Icon     = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
                style={{
                  background: isActive
                    ? "rgba(249,115,22,0.15)"
                    : " transparent",
                  color: isActive ? "#F97316" : "rgba(255,255,255,0.6)",
                }}
                whileHover={{
                  background: isActive
                    ? "rgba(249,115,22,0.15)"
                    : "rgba(255,255,255,0.05)",
                  color: isActive ? "#F97316" : "#FFFFFF",
                }}
              >
                <Icon size={18} />
                {item.label}
                {isActive && (
                  <motion.div
                    className="ml-auto w-1.5 h-1.5 rounded-full"
                    style={{ background: "#F97316" }}
                    layoutId="activeIndicator"
                  />
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Bottom: Back to site + Logout */}
      <div
        className="px-3 py-4 flex flex-col gap-1"
        style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
      >
        <Link href="/">
          <motion.div
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium"
            style={{ color: "rgba(255,255,255,0.5)" }}
            whileHover={{ color: "#FFFFFF", background: "rgba(255,255,255,0.05)" }}
          >
            <LogOut size={18} />
            Back to Website
          </motion.div>
        </Link>
      </div>
    </aside>
  );
}
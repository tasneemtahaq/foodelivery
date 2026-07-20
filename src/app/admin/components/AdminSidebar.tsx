"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  LayoutDashboard, UtensilsCrossed, ShoppingBag,
  Users, Settings, LogOut, Tag, Menu, X,
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Dashboard",  href: "/admin",            icon: LayoutDashboard },
  { label: "Orders",     href: "/admin/orders",     icon: ShoppingBag     },
  { label: "Foods",      href: "/admin/foods",      icon: UtensilsCrossed },
  { label: "Categories", href: "/admin/categories", icon: Tag             },
  { label: "Customers",  href: "/admin/customers",  icon: Users           },
  { label: "Settings",   href: "/admin/settings",   icon: Settings        },
];

// ── Sidebar content extracted as separate component OUTSIDE ──
function SidebarContent({
  pathname,
  onClose,
}: {
  pathname: string;
  onClose: () => void;
}) {
  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div
        className="px-4 py-4 flex items-center gap-3"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        <Image
          src="/images/logo.png"
          alt="Mama Soups"
          width={36}
          height={36}
          style={{
            width:        "36px",
            height:       "36px",
            objectFit:    "contain",
            borderRadius: "8px",
          }}
        />
        <div>
          <p className="font-bold text-white text-sm">Mama Soups</p>
          <p className="text-xs" style={{ color: "#6B7280" }}>Admin Panel</p>
        </div>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        {NAV_ITEMS.map((item) => {
          const Icon     = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
            >
              <motion.div
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium"
                style={{
                  background: isActive
                    ? "rgba(249,115,22,0.15)"
                    : "rgba(0,0,0,0)",
                  color: isActive
                    ? "#F97316"
                    : "rgba(255,255,255,0.6)",
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

      {/* Bottom */}
      <div
        className="px-3 py-4"
        style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
      >
        <Link href="/" onClick={onClose}>
          <motion.div
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium"
            style={{
              color:      "rgba(255,255,255,0.5)",
              background: "rgba(0,0,0,0)",
            }}
            whileHover={{
              color:      "#FFFFFF",
              background: "rgba(255,255,255,0.05)",
            }}
          >
            <LogOut size={18} />
            Back to Website
          </motion.div>
        </Link>
      </div>
    </div>
  );
}

// ── Main Sidebar Component ──
export default function AdminSidebar() {
  const pathname       = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* ── MOBILE: Top Bar with Hamburger ── */}
      <div
        className="md:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3"
        style={{
          background:   "#111111",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div className="flex items-center gap-2">
          <Image
            src="/images/logo.png"
            alt="Mama Soups"
            width={32}
            height={32}
            style={{ width: "32px", height: "32px", objectFit: "contain" }}
          />
          <span className="text-white font-bold text-sm">Admin</span>
        </div>
        <button
          onClick={() => setOpen((o) => !o)}
          className="p-2 rounded-lg"
          style={{ color: "#F97316" }}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* ── MOBILE: Slide-in Drawer ── */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              className="md:hidden fixed inset-0 z-40"
              style={{ background: "rgba(0,0,0,0.7)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{   opacity: 0 }}
              onClick={() => setOpen(false)}
            />

            {/* Drawer */}
            <motion.div
              className="md:hidden fixed top-0 left-0 bottom-0 z-50 w-64"
              style={{ background: "#111111" }}
              initial={{ x: -264 }}
              animate={{ x: 0 }}
              exit={{   x: -264 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <SidebarContent
                pathname={pathname}
                onClose={() => setOpen(false)}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── DESKTOP: Fixed Sidebar ── */}
      <aside
        className="hidden md:flex flex-col fixed left-0 top-0 bottom-0 w-64 z-40"
        style={{
          background:  "#111111",
          borderRight: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <SidebarContent
          pathname={pathname}
          onClose={() => {}}
        />
      </aside>
    </>
  );
}
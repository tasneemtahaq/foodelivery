"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Menu, X } from "lucide-react";
import Image from "next/image";
import { useCartStore, CartStore  } from "../../store/cartStore";
import { useAuthStore } from "@/store/authStore";
import toast from "react-hot-toast";

const NAV_LINKS = [
  { label: "Home",            href: "/"        },
  { label: "Find Food",       href: "/menu"    },
  { label: "Tracking",        href: "#"        },
  { label: "Find Restaurant", href: "#"        },
  { label: "Location",        href: "#"        },
];

export default function Navbar() {
  const [scrolled,  setScrolled]  = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);
  const pathname   = usePathname();
  const totalItems = useCartStore((state: CartStore) => state.totalItems());
  const hasHydrated = useCartStore((state: CartStore) => state.hasHydrated);
  const user       = useAuthStore((s) => s.user);
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const logout     = useAuthStore((s) => s.logout);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const prevPathname = useRef(pathname);

useEffect(() => {
  if (prevPathname.current !== pathname) {
    prevPathname.current = pathname;
    setMenuOpen(false);
  }
}, [pathname]);

  return (
    <>
      <motion.nav
  className={`fixed top-0 left-0 right-0 z-20 backdrop-blur-xl border-b transition-all duration-300 ${
    scrolled
            ? "bg-white/95 border-white/30 shadow-lg"
            : "bg-white/60 border-transparent"
  }`}
  style={{
    padding: scrolled ? "12px 0" : "18px 0",
  }}
  initial={{ y: -80, opacity: 0 }}
  animate={{ y: 0, opacity: 1 }}
  transition={{ duration: 0.5 }}
>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">

          {/* ── Logo ── */}
          <Link href="/" className="flex items-center gap-4">
            <Image
             src="/images/logo.png"
             alt="Logo"
             width={60}
             height={60}
             loading="eager"
            priority
             style={{ width: "auto", height: "40px", objectFit: "contain" }}
            />
          </Link>

          {/* ── Desktop Nav Links ── */}
          <ul className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm font-medium tracking-wide transition-colors duration-200 relative group"
                    style={{ color: isActive ? "#F97316" : "#374151" }}
                  >
                    {link.label}
                    <span
                      className="absolute -bottom-1 left-0 h-0.5 rounded-full transition-all duration-300 group-hover:w-full"
                      style={{
                        background: "#F97316",
                        width: isActive ? "100%" : "0%",
                      }}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* ── Right: Sign In + Sign Up + Cart ── */}
          <div className="hidden md:flex items-center gap-3">

            {/* Cart */}
            <Link href="/cart">
              <motion.div
                className="relative flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium"
                style={{ color: "#374151" }}
                whileHover={{ color: "#F97316" }}
              >
                <ShoppingCart size={20} />
                {hasHydrated && totalItems > 0 && (
                  <motion.span
                    key={totalItems}
                    className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center text-white"
                    style={{ background: "#F97316" }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    {totalItems}
                  </motion.span>
                )}
              </motion.div>
            </Link>

            {/* Sign In */}
            {isLoggedIn && user ? (
              // ── Logged in state ──
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium" style={{ color: "#374151" }}>
                  Hi, {user.name ?? user.email.split("@")[0]}! 👋
                </span>
                <button
                  onClick={() => { logout(); toast.success("Logged out!"); }}
                  className="px-5 py-2 rounded-full text-sm font-semibold border-2 transition-all hover:bg-red-50"
                  style={{ borderColor: "#EF4444", color: "#EF4444" }}
                >
                  Logout
                </button>
              </div>
            ) : (
              // ── Logged out state ──
              <>
                <Link
                  href="/login"
                  className="px-6 py-2.5 rounded-full text-sm font-semibold transition-all hover:scale-105"
                  style={{ background: "#F97316", color: "white" }}
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="px-6 py-2.5 rounded-full text-sm font-semibold border-2 transition-all hover:bg-orange-50 hover:scale-105"
                  style={{ borderColor: "#F97316", color: "#F97316" }}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="md:hidden flex items-center gap-3">
            <Link href="/cart" className="relative">
              <ShoppingCart size={22} style={{ color: "#374151" }} />
              {hasHydrated && totalItems > 0 && (
                <span
                  className="absolute -top-2 -right-2 w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center text-white"
                  style={{ background: "#F97316" }}
                >
                  {totalItems}
                </span>
              )}
            </Link>
            <button onClick={() => setMenuOpen((o) => !o)}>
              {menuOpen
                ? <X size={24} style={{ color: "#374151" }} />
                : <Menu size={24} style={{ color: "#374151" }} />
              }
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-40 flex flex-col pt-20 px-6"
            style={{ background: "white" }}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{   opacity: 0, y: -10 }}
          >
            <ul className="flex flex-col gap-6 mt-8">
              {NAV_LINKS.map((link, i) => (
                <motion.li
                  key={link.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 }}
                >
                  <Link
                    href={link.href}
                    className="text-2xl font-bold"
                    style={{ color: pathname === link.href ? "#F97316" : "#1F2937" }}
                    onClick={() => setMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
            <div className="flex gap-3 mt-10">
              <Link
                href="/admin"
                className="px-6 py-3 rounded-full font-bold text-white"
                style={{ background: "#F97316" }}
                onClick={() => setMenuOpen(false)}
              >
                Sign In
              </Link>
              <Link
                href="#"
                className="px-6 py-3 rounded-full font-bold border-2"
                style={{ borderColor: "#F97316", color: "#F97316" }}
                onClick={() => setMenuOpen(false)}
              >
                Sign Up
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
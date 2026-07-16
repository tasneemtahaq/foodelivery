"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, ArrowRight } from "lucide-react";
import { useCartStore } from "../../store/cartStore";
import type { CartStore } from "../../store/cartStore";
import Footer from "../components/Footer";

export default function CartPage() {
  const items       = useCartStore((s: CartStore) => s.items);
  const increaseQty = useCartStore((s: CartStore) => s.increaseQty);
  const decreaseQty = useCartStore((s: CartStore) => s.decreaseQty);
  const removeItem  = useCartStore((s: CartStore) => s.removeItem);
  const clearCart   = useCartStore((s: CartStore) => s.clearCart);
  const totalPrice  = useCartStore((s: CartStore) => s.totalPrice());

  const DELIVERY_CHARGE = Math.max(0, totalPrice < 2000 ? 200 : 0);
  const TAX             = Math.round(totalPrice * 0.17);
  const GRAND_TOTAL     = totalPrice + DELIVERY_CHARGE + TAX;

  // ── Empty Cart ──
  if (items.length === 0) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center px-4"
        style={{ background: "#f9fafb", paddingTop: "80px" }}
      >
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="text-8xl mb-6">🛒</div>
          <h2 className="text-2xl font-bold mb-2" style={{ color: "#1F2937" }}>
            Your cart is empty
          </h2>
          <p className="mb-8 text-sm" style={{ color: "#6B7280" }}>
            Add some delicious items from our menu!
          </p>
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-white"
            style={{ background: "#F97316" }}
          >
            <ArrowLeft size={18} />
            Browse Menu
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen"
      style={{ background: "#f9fafb", paddingTop: "80px" }}
    >
      <div className="max-w-7xl mx-auto px-4 py-10">

        {/* ── Header ── */}
        <motion.div
          className="mb-8 flex items-center justify-between flex-wrap gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <h1 className="text-3xl font-bold" style={{ color: "#1F2937" }}>
              Your <span style={{ color: "#F97316" }}>Cart</span>
            </h1>
            <p className="text-sm mt-1" style={{ color: "#6B7280" }}>
              {items.length} item{items.length > 1 ? "s" : ""} in your cart
            </p>
          </div>

          {/* Back to menu */}
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 text-sm font-medium"
            style={{ color: "#F97316" }}
          >
            <ArrowLeft size={16} />
            Continue Shopping
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── LEFT: Cart Items ── */}
          <div className="lg:col-span-2 flex flex-col gap-4">

            {/* Clear cart button */}
            <div className="flex justify-end">
              <button
                onClick={clearCart}
                className="text-xs font-medium px-4 py-2 rounded-lg border transition-all hover:bg-red-50"
                style={{
                  color: "#EF4444",
                  borderColor: "rgba(239,68,68,0.3)",
                }}
              >
                Clear Cart
              </button>
            </div>

            {/* Cart Items List */}
            <AnimatePresence>
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  className="flex items-center gap-4 p-4 rounded-2xl"
                  style={{
                    background: "white",
                    border: "1px solid rgba(0,0,0,0.07)",
                    boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
                  }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{    opacity: 0, x:  20, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Food Image */}
                  <div
                    className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 flex items-center justify-center text-3xl"
                    style={{ background: "#fff7ed" }}
                  >
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    ) : (
                      <span>🍽️</span>
                    )}
                  </div>

                  {/* Food Info */}
                  <div className="flex-1 min-w-0">
                    <h3
                      className="font-bold text-base truncate"
                      style={{ color: "#1F2937" }}
                    >
                      {item.name}
                    </h3>
                    <p
                      className="text-sm font-semibold mt-1"
                      style={{ color: "#F97316" }}
                    >
                      Rs.{item.price} each
                    </p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2 shrink-0">
                    <motion.button
                      onClick={() => decreaseQty(item.id)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center border transition-all"
                      style={{
                        borderColor: "rgba(249,115,22,0.3)",
                        color: "#F97316",
                      }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Minus size={14} />
                    </motion.button>

                    <span
                      className="w-8 text-center font-bold text-sm"
                      style={{ color: "#1F2937" }}
                    >
                      {item.quantity}
                    </span>

                    <motion.button
                      onClick={() => increaseQty(item.id)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
                      style={{ background: "#F97316" }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Plus size={14} />
                    </motion.button>
                  </div>

                  {/* Item Total */}
                  <div
                    className="text-right shrink-0 min-w-17.5"
                  >
                    <p className="font-bold" style={{ color: "#1F2937" }}>
                      Rs.{item.price * item.quantity}
                    </p>
                  </div>

                  {/* Remove Button */}
                  <motion.button
                    onClick={() => removeItem(item.id)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all hover:bg-red-50"
                    style={{ color: "#EF4444" }}
                    whileTap={{ scale: 0.9 }}
                    aria-label="Remove item"
                  >
                    <Trash2 size={16} />
                  </motion.button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* ── RIGHT: Order Summary ── */}
          <motion.div
            className="lg:col-span-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div
              className="rounded-2xl p-6 sticky top-24"
              style={{
                background: "white",
                border: "1px solid rgba(0,0,0,0.07)",
                boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
              }}
            >
              {/* Summary Header */}
              <div className="flex items-center gap-2 mb-6">
                <ShoppingBag size={20} style={{ color: "#F97316" }} />
                <h2 className="font-bold text-lg" style={{ color: "#1F2937" }}>
                  Order Summary
                </h2>
              </div>

              {/* Price Breakdown */}
              <div className="flex flex-col gap-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span style={{ color: "#6B7280" }}>
                    Subtotal ({items.length} items)
                  </span>
                  <span className="font-medium" style={{ color: "#1F2937" }}>
                    Rs.{totalPrice}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span style={{ color: "#6B7280" }}>Delivery Charge</span>
                  <span className="font-medium" style={{ color: "#1F2937" }}>
                    Rs.{DELIVERY_CHARGE}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span style={{ color: "#6B7280" }}>Tax</span>
                  <span className="font-medium" style={{ color: "#1F2937" }}>
                    Rs.{TAX}
                  </span>
                </div>

                {/* Divider */}
                <div
                  className="h-px w-full my-1"
                  style={{ background: "rgba(0,0,0,0.07)" }}
                />

                {/* Grand Total */}
                <div className="flex justify-between">
                  <span className="font-bold" style={{ color: "#1F2937" }}>
                    Grand Total
                  </span>
                  <span
                    className="font-bold text-xl"
                    style={{ color: "#F97316" }}
                  >
                    Rs.{GRAND_TOTAL}
                  </span>
                </div>
              </div>

              {/* Free delivery notice */}
              {totalPrice < 1000 && (
                <div
                  className="text-xs px-3 py-2 rounded-lg mb-4 text-center"
                  style={{
                    background: "rgba(249,115,22,0.08)",
                    color: "#F97316",
                  }}
                >
                  Add Rs.{1000 - totalPrice} more for free delivery! 🎉
                </div>
              )}

              {totalPrice >= 1000 && (
                <div
                  className="text-xs px-3 py-2 rounded-lg mb-4 text-center font-medium"
                  style={{
                    background: "rgba(34,197,94,0.1)",
                    color: "#16A34A",
                  }}
                >
                  ✅ You got free delivery!
                </div>
              )}

              {/* Checkout Button */}
              <Link href="/checkout">
                <motion.div
                  className="w-full py-4 rounded-xl font-bold text-white text-center flex items-center justify-center gap-2 cursor-pointer"
                  style={{
                    background: "linear-gradient(135deg, #F97316, #EA580C)",
                    boxShadow: "0 4px 20px rgba(249,115,22,0.35)",
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Proceed to Checkout
                  <ArrowRight size={18} />
                </motion.div>
              </Link>

              {/* Continue Shopping */}
              <Link
                href="/menu"
                className="block text-center text-sm mt-4 font-medium transition-colors hover:opacity-80"
                style={{ color: "#6B7280" }}
              >
                ← Continue Shopping
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
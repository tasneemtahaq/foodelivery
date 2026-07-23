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
  const hasHydrated = useCartStore((s: CartStore) => s.hasHydrated);

 const GRAND_TOTAL = totalPrice;

  // ── Empty Cart ──
  if (!hasHydrated) {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: "#f9fafb", paddingTop: "80px" }}
    >
      Loading...
    </div>
  );
}

// Empty Cart
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
      <div
        style={{
          maxWidth:  "1100px",
          margin:    "0 auto",
          padding:   "40px 32px",
        }}
      >

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

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

          {/* ── LEFT: Cart Items ── */}
          <div className="lg:col-span-3 flex flex-col gap-4">

            {/* Clear cart button */}
            <div className="flex justify-end px-2">
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
            className="lg:col-span-2 min-w-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div
              className="rounded-2xl sticky top-24"
              style={{
                padding:   "28px",
                border:    "1px solid rgba(0,0,0,0.08)",
                boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
                background: "white",
              }}
            >
              {/* Summary Header */}
              <div className="px-2 flex items-center gap-2 mb-6">
                <ShoppingBag size={20} style={{ color: "#F97316" }}  />
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


                {/* Delivery notice */}
                <div
                  className="flex items-start gap-2 px-3 py-2.5 rounded-xl text-xs"
                  style={{
                    background: "rgba(249,115,22,0.06)",
                    border:     "1px solid rgba(249,115,22,0.15)",
                    color:      "#92400E",
                  }}
                >
                  <span className="mt-0.5">🚗</span>
                  <span>
                    Delivery charges will be calculated based on your area.
                    Our team will confirm the exact amount when processing your order.
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
                    Total
                  </span>
                  <span
                    className="font-bold text-xl"
                    style={{ color: "#F97316" }}
                  >
                    Rs.{GRAND_TOTAL}
                  </span>
                </div>
              </div>


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
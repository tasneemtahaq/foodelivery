"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  Trash2, Plus, Minus, ShoppingBag, ArrowLeft, ArrowRight, Truck,
} from "lucide-react";
import { useCartStore } from "../../store/cartStore";
import type { CartStore } from "../../store/cartStore";
import { pageStyle, glass } from "../../lib/theme";

export default function CartPage() {
  const items       = useCartStore((s: CartStore) => s.items);
  const increaseQty = useCartStore((s: CartStore) => s.increaseQty);
  const decreaseQty = useCartStore((s: CartStore) => s.decreaseQty);
  const removeItem  = useCartStore((s: CartStore) => s.removeItem);
  const clearCart   = useCartStore((s: CartStore) => s.clearCart);
  const totalPrice  = useCartStore((s: CartStore) => s.totalPrice());
  const hasHydrated = useCartStore((s: CartStore) => s.hasHydrated);

  // ── Loading (cart is being read from the browser) ──
  if (!hasHydrated) {
    return (
      <main
        style={{
          ...pageStyle,
          display:        "flex",
          alignItems:     "center",
          justifyContent: "center",
        }}
      >
        <p style={{ color: "#6c5a49", fontSize: "14px" }}>Loading your cart...</p>
      </main>
    );
  }

  // ── Empty cart ──
  if (items.length === 0) {
    return (
      <main
        style={{
          ...pageStyle,
          display:        "flex",
          alignItems:     "center",
          justifyContent: "center",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            ...glass,
            padding:   "48px 32px",
            textAlign: "center",
            maxWidth:  "420px",
            width:     "100%",
          }}
        >
          <div style={{ fontSize: "64px", marginBottom: "16px" }}>🛒</div>
          <h2
            style={{
              fontSize:     "24px",
              fontWeight:   500,
              color:        "#171717",
              marginBottom: "8px",
            }}
          >
            Your cart is empty
          </h2>
          <p style={{ fontSize: "13px", color: "#6c5a49", marginBottom: "28px" }}>
            Add some delicious items from our menu!
          </p>
          <Link
            href="/menu"
            style={{
              display:      "inline-flex",
              alignItems:   "center",
              gap:          "8px",
              padding:      "13px 28px",
              borderRadius: "999px",
              background:   "linear-gradient(135deg, #F97316, #EA580C)",
              color:        "white",
              fontSize:     "13px",
              fontWeight:   600,
              boxShadow:    "0 8px 22px rgba(249,115,22,0.4)",
            }}
          >
            <ArrowLeft size={16} />
            Browse Menu
          </Link>
        </motion.div>
      </main>
    );
  }

  return (
    <main style={pageStyle}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>

        {/* ── Heading ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            display:        "flex",
            alignItems:     "flex-end",
            justifyContent: "space-between",
            flexWrap:       "wrap",
            gap:            "16px",
            marginBottom:   "32px",
          }}
        >
          <div>
            <p
              style={{
                fontSize:      "11px",
                fontWeight:    500,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color:         "#89735f",
                marginBottom:  "10px",
              }}
            >
              Review your order
            </p>
            <h1
              style={{
                fontSize:      "40px",
                fontWeight:    500,
                letterSpacing: "-1px",
                color:         "#171717",
              }}
            >
              Your Cart
            </h1>
            <p style={{ fontSize: "13px", color: "#4a4640", marginTop: "6px" }}>
              {items.length} item{items.length > 1 ? "s" : ""} in your cart
            </p>
          </div>

          <Link
            href="/menu"
            style={{
              display:        "inline-flex",
              alignItems:     "center",
              gap:            "8px",
              padding:        "10px 20px",
              borderRadius:   "999px",
              background:     "rgba(255,255,255,0.6)",
              backdropFilter: "blur(10px)",
              fontSize:       "12px",
              fontWeight:     600,
              color:          "#6c5a49",
            }}
          >
            <ArrowLeft size={14} />
            Continue Shopping
          </Link>
        </motion.div>

        {/* ── Two columns (stack on small screens) ── */}
        <div
          style={{
            display:    "flex",
            flexWrap:   "wrap",
            gap:        "24px",
            alignItems: "flex-start",
          }}
        >

          {/* LEFT: items */}
          <div
            style={{
              flex:          "2 1 460px",
              minWidth:      0,
              display:       "flex",
              flexDirection: "column",
              gap:           "14px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                type="button"
                onClick={clearCart}
                style={{
                  padding:      "8px 18px",
                  borderRadius: "999px",
                  background:   "rgba(255,255,255,0.6)",
                  border:       "1px solid rgba(220,38,38,0.35)",
                  fontSize:     "11px",
                  fontWeight:   600,
                  color:        "#dc2626",
                  cursor:       "pointer",
                }}
              >
                Clear Cart
              </button>
            </div>

            <AnimatePresence>
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.25 }}
                  style={{
                    ...glass,
                    borderRadius: "26px",
                    padding:      "16px 20px",
                    display:      "flex",
                    alignItems:   "center",
                    flexWrap:     "wrap",
                    gap:          "16px",
                  }}
                >
                  {/* Image */}
                  <div
                    style={{
                      position:       "relative",
                      width:          "84px",
                      height:         "84px",
                      borderRadius:   "50%",
                      overflow:       "hidden",
                      flexShrink:     0,
                      border:         "3px solid rgba(255,255,255,0.9)",
                      boxShadow:      "0 8px 20px rgba(0,0,0,0.13)",
                      background:     "#eee9df",
                      display:        "flex",
                      alignItems:     "center",
                      justifyContent: "center",
                      fontSize:       "30px",
                    }}
                  >
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="84px"
                        className="object-cover"
                      />
                    ) : (
                      "🍜"
                    )}
                  </div>

                  {/* Name + price each */}
                  <div style={{ flex: "1 1 140px", minWidth: 0 }}>
                    <h3
                      style={{
                        fontSize:   "16px",
                        fontWeight: 600,
                        color:      "#222",
                      }}
                    >
                      {item.name}
                    </h3>
                    <p
                      style={{
                        marginTop:  "4px",
                        fontSize:   "13px",
                        fontWeight: 600,
                        color:      "#c68129",
                      }}
                    >
                      Rs.{item.price} each
                    </p>
                  </div>

                  {/* Quantity */}
                  <div
                    style={{
                      display:      "flex",
                      alignItems:   "center",
                      gap:          "12px",
                      height:       "42px",
                      padding:      "0 12px",
                      borderRadius: "999px",
                      background:   "rgba(255,255,255,0.75)",
                      border:       "1px solid rgba(137,115,95,0.3)",
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => decreaseQty(item.id)}
                      aria-label="Decrease quantity"
                      style={{ background: "none", border: "none", cursor: "pointer", color: "#6c5a49" }}
                    >
                      <Minus size={15} />
                    </button>
                    <span
                      style={{
                        minWidth:   "18px",
                        textAlign:  "center",
                        fontSize:   "14px",
                        fontWeight: 700,
                        color:      "#222",
                      }}
                    >
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => increaseQty(item.id)}
                      aria-label="Increase quantity"
                      style={{ background: "none", border: "none", cursor: "pointer", color: "#c68129" }}
                    >
                      <Plus size={15} />
                    </button>
                  </div>

                  {/* Line total */}
                  <p
                    style={{
                      minWidth:   "80px",
                      textAlign:  "right",
                      fontSize:   "16px",
                      fontWeight: 700,
                      color:      "#222",
                    }}
                  >
                    Rs.{item.price * item.quantity}
                  </p>

                  {/* Remove */}
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    aria-label="Remove item"
                    style={{
                      width:          "38px",
                      height:         "38px",
                      borderRadius:   "50%",
                      display:        "flex",
                      alignItems:     "center",
                      justifyContent: "center",
                      background:     "rgba(220,38,38,0.08)",
                      border:         "none",
                      color:          "#dc2626",
                      cursor:         "pointer",
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* RIGHT: summary */}
          <motion.aside
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            style={{
              ...glass,
              flex:     "1 1 320px",
              minWidth: 0,
              padding:  "28px",
              position: "sticky",
              top:      "110px",
            }}
          >
            <div
              style={{
                display:      "flex",
                alignItems:   "center",
                gap:          "10px",
                marginBottom: "22px",
              }}
            >
              <ShoppingBag size={20} style={{ color: "#c68129" }} />
              <h2 style={{ fontSize: "20px", fontWeight: 500, color: "#171717" }}>
                Order Summary
              </h2>
            </div>

            <div
              style={{
                display:        "flex",
                justifyContent: "space-between",
                fontSize:       "14px",
                color:          "#4a4640",
                marginBottom:   "16px",
              }}
            >
              <span>Subtotal ({items.length} item{items.length > 1 ? "s" : ""})</span>
              <span style={{ fontWeight: 600, color: "#222" }}>Rs.{totalPrice}</span>
            </div>

            {/* Delivery notice */}
            <div
              style={{
                display:      "flex",
                alignItems:   "flex-start",
                gap:          "10px",
                padding:      "12px 14px",
                borderRadius: "16px",
                background:   "rgba(249,115,22,0.1)",
                border:       "1px solid rgba(249,115,22,0.25)",
                fontSize:     "12px",
                lineHeight:   1.5,
                color:        "#7a5320",
                marginBottom: "18px",
              }}
            >
              <Truck size={16} style={{ flexShrink: 0, marginTop: "1px" }} />
              <span>
                Delivery charge is added at checkout, once you select your area.
              </span>
            </div>

            <div
              style={{
                height:       "1px",
                background:   "rgba(137,115,95,0.25)",
                marginBottom: "18px",
              }}
            />

            <div
              style={{
                display:        "flex",
                justifyContent: "space-between",
                alignItems:     "baseline",
                marginBottom:   "24px",
              }}
            >
              <span style={{ fontSize: "16px", fontWeight: 600, color: "#171717" }}>
                Total
              </span>
              <span style={{ fontSize: "24px", fontWeight: 700, color: "#F97316" }}>
                Rs.{totalPrice}
              </span>
            </div>

            <Link
              href="/checkout"
              style={{
                display:        "flex",
                alignItems:     "center",
                justifyContent: "center",
                gap:            "10px",
                width:          "100%",
                padding:        "15px",
                borderRadius:   "999px",
                background:     "linear-gradient(135deg, #F97316, #EA580C)",
                color:          "white",
                fontSize:       "13px",
                fontWeight:     700,
                letterSpacing:  "0.1em",
                textTransform:  "uppercase",
                boxShadow:      "0 8px 22px rgba(249,115,22,0.4)",
              }}
            >
              Proceed to Checkout
              <ArrowRight size={16} />
            </Link>

            <Link
              href="/menu"
              style={{
                display:   "block",
                textAlign: "center",
                marginTop: "16px",
                fontSize:  "12px",
                fontWeight: 500,
                color:     "#6c5a49",
              }}
            >
              ← Continue Shopping
            </Link>
          </motion.aside>
        </div>
      </div>
    </main>
  );
}
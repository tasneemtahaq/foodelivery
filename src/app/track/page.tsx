"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Search, Package, ChefHat, Bike, CheckCircle, XCircle, Phone, RefreshCw,
} from "lucide-react";
import { pageStyle, glass } from "@/lib/theme";

interface TrackedOrder {
  orderNumber:    string;
  status:         string;
  estimatedTime:  string | null;
  createdAt:      string;
  deliveryCharge: number;
  totalAmount:    number;
  items: { id: number; name: string; quantity: number; price: number }[];
}

const STEPS = [
  { key: "pending",          label: "Order received",   desc: "We have your order",             icon: Package     },
  { key: "preparing",        label: "Preparing",        desc: "Your food is being made fresh",  icon: ChefHat     },
  { key: "out_for_delivery", label: "Out for delivery", desc: "Our rider is on the way",        icon: Bike        },
  { key: "delivered",        label: "Delivered",        desc: "Enjoy your meal!",               icon: CheckCircle },
];

const inputStyle = {
  width:        "100%",
  padding:      "13px 16px",
  borderRadius: "14px",
  border:       "1px solid rgba(137,115,95,0.3)",
  background:   "rgba(255,255,255,0.8)",
  color:        "#171717",
  fontSize:     "14px",
  outline:      "none",
} as const;

const labelStyle = {
  display:       "block",
  fontSize:      "11px",
  fontWeight:    600,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color:         "#6c5a49",
  marginBottom:  "7px",
} as const;

function TrackForm() {
  const searchParams = useSearchParams();

  const [orderNumber, setOrderNumber] = useState(
    () => searchParams.get("order") ?? ""
  );
  const [phone,   setPhone]   = useState("");
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");
  const [order,   setOrder]   = useState<TrackedOrder | null>(null);

  const lookUp = useCallback(
    async (silent: boolean) => {
      if (!silent) {
        setLoading(true);
        setError("");
      }
      try {
        const res  = await fetch("/api/track", {
          method:  "POST",
          headers: { "Content-Type": "application/json" },
          body:    JSON.stringify({ orderNumber, phone }),
        });
        const data = await res.json();

        if (!res.ok) {
          if (!silent) {
            setOrder(null);
            setError(data.error ?? "Something went wrong.");
          }
          return;
        }
        setOrder(data.order);
      } catch {
        if (!silent) setError("Could not connect. Please try again.");
      } finally {
        if (!silent) setLoading(false);
      }
    },
    [orderNumber, phone]
  );

  // While the order is still active, check for updates every 30 seconds
  const isActive =
    order !== null &&
    order.status !== "delivered" &&
    order.status !== "cancelled";

  useEffect(() => {
    if (!isActive) return;
    const timer = setInterval(() => lookUp(true), 30000);
    return () => clearInterval(timer);
  }, [isActive, lookUp]);

  const currentIndex = order
    ? STEPS.findIndex((s) => s.key === order.status)
    : -1;

  return (
    <main style={pageStyle}>
      <div style={{ maxWidth: "640px", margin: "0 auto" }}>

        {/* Heading */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
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
            Where is my food?
          </p>
          <h1
            style={{
              fontSize:      "40px",
              fontWeight:    500,
              letterSpacing: "-1px",
              color:         "#171717",
            }}
          >
            Track Your Order
          </h1>
          <p style={{ fontSize: "13px", color: "#4a4640", marginTop: "8px" }}>
            Enter your order number and the phone number you ordered with.
          </p>
        </div>

        {/* Lookup form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            lookUp(false);
          }}
          style={{
            ...glass,
            padding:       "26px",
            display:       "flex",
            flexDirection: "column",
            gap:           "16px",
          }}
        >
          <div>
            <label style={labelStyle}>Order number</label>
            <input
              type="text"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              placeholder="ORD-2026-123456"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Phone number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="0333-2287497"
              style={inputStyle}
            />
          </div>

          {error && (
            <p style={{ fontSize: "13px", color: "#dc2626" }}>{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              display:        "flex",
              alignItems:     "center",
              justifyContent: "center",
              gap:            "10px",
              padding:        "15px",
              borderRadius:   "999px",
              border:         "none",
              fontSize:       "13px",
              fontWeight:     700,
              letterSpacing:  "0.1em",
              textTransform:  "uppercase",
              color:          "white",
              cursor:         loading ? "not-allowed" : "pointer",
              background:     loading
                ? "#b8b0a6"
                : "linear-gradient(135deg, #F97316, #EA580C)",
              boxShadow:      loading
                ? "none"
                : "0 8px 22px rgba(249,115,22,0.4)",
            }}
          >
            <Search size={16} />
            {loading ? "Searching..." : "Track Order"}
          </button>
        </form>

        {/* Result */}
        {order && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ ...glass, padding: "28px", marginTop: "24px" }}
          >
            <div
              style={{
                display:        "flex",
                justifyContent: "space-between",
                alignItems:     "flex-start",
                flexWrap:       "wrap",
                gap:            "10px",
                marginBottom:   "24px",
              }}
            >
              <div>
                <p style={{ fontSize: "11px", color: "#9a9189", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                  Order
                </p>
                <p style={{ fontSize: "18px", fontWeight: 700, color: "#EA580C" }}>
                  #{order.orderNumber}
                </p>
              </div>
              {order.status !== "cancelled" && order.estimatedTime && (
                <p style={{ fontSize: "12px", color: "#6c5a49" }}>
                  Estimated time: <strong>{order.estimatedTime}</strong>
                </p>
              )}
            </div>

            {order.status === "cancelled" ? (
              <div
                style={{
                  display:      "flex",
                  gap:          "12px",
                  padding:      "16px",
                  borderRadius: "18px",
                  background:   "rgba(220,38,38,0.08)",
                  border:       "1px solid rgba(220,38,38,0.25)",
                  color:        "#991b1b",
                  fontSize:     "13px",
                  lineHeight:   1.6,
                }}
              >
                <XCircle size={20} style={{ flexShrink: 0 }} />
                <span>
                  This order was cancelled. If you have any questions, please
                  call us on 0333-2287497.
                </span>
              </div>
            ) : (
              <div>
                {STEPS.map((step, i) => {
                  const done   = i <= currentIndex;
                  const isLast = i === STEPS.length - 1;
                  const Icon   = step.icon;
                  return (
                    <div key={step.key} style={{ display: "flex", gap: "16px" }}>
                      <div
                        style={{
                          display:       "flex",
                          flexDirection: "column",
                          alignItems:    "center",
                        }}
                      >
                        <span
                          style={{
                            width:          "44px",
                            height:         "44px",
                            borderRadius:   "50%",
                            display:        "flex",
                            alignItems:     "center",
                            justifyContent: "center",
                            color:          done ? "white" : "#9a9189",
                            background:     done
                              ? "linear-gradient(135deg, #F97316, #EA580C)"
                              : "rgba(255,255,255,0.7)",
                            border:         done
                              ? "none"
                              : "1.5px solid rgba(137,115,95,0.3)",
                            boxShadow:      i === currentIndex
                              ? "0 0 0 6px rgba(249,115,22,0.2)"
                              : "none",
                          }}
                        >
                          <Icon size={20} />
                        </span>
                        {!isLast && (
                          <span
                            style={{
                              width:      "3px",
                              flex:       1,
                              minHeight:  "34px",
                              background: i < currentIndex
                                ? "#F97316"
                                : "rgba(137,115,95,0.25)",
                            }}
                          />
                        )}
                      </div>

                      <div style={{ paddingBottom: isLast ? 0 : "22px", paddingTop: "8px" }}>
                        <p
                          style={{
                            fontSize:   "15px",
                            fontWeight: 600,
                            color:      done ? "#171717" : "#9a9189",
                          }}
                        >
                          {step.label}
                        </p>
                        <p style={{ fontSize: "12px", color: "#6c5a49", marginTop: "2px" }}>
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Items + total */}
            <div
              style={{
                marginTop:  "26px",
                paddingTop: "20px",
                borderTop:  "1px solid rgba(137,115,95,0.25)",
              }}
            >
              {order.items.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display:        "flex",
                    justifyContent: "space-between",
                    fontSize:       "13px",
                    color:          "#4a4640",
                    marginBottom:   "8px",
                  }}
                >
                  <span>
                    {item.name} <span style={{ color: "#9a9189" }}>×{item.quantity}</span>
                  </span>
                  <span style={{ fontWeight: 600, color: "#222" }}>
                    Rs.{item.price * item.quantity}
                  </span>
                </div>
              ))}

              {order.deliveryCharge > 0 && (
                <div
                  style={{
                    display:        "flex",
                    justifyContent: "space-between",
                    fontSize:       "13px",
                    color:          "#4a4640",
                    marginBottom:   "8px",
                  }}
                >
                  <span>Delivery</span>
                  <span style={{ fontWeight: 600, color: "#222" }}>
                    Rs.{order.deliveryCharge}
                  </span>
                </div>
              )}

              <div
                style={{
                  display:        "flex",
                  justifyContent: "space-between",
                  alignItems:     "baseline",
                  marginTop:      "12px",
                }}
              >
                <span style={{ fontSize: "15px", fontWeight: 600, color: "#171717" }}>
                  Total
                </span>
                <span style={{ fontSize: "22px", fontWeight: 700, color: "#EA580C" }}>
                  Rs.{order.totalAmount}
                </span>
              </div>
            </div>

            <div
              style={{
                display:        "flex",
                justifyContent: "space-between",
                alignItems:     "center",
                flexWrap:       "wrap",
                gap:            "10px",
                marginTop:      "22px",
              }}
            >
              {isActive ? (
                <span
                  style={{
                    display:    "inline-flex",
                    alignItems: "center",
                    gap:        "6px",
                    fontSize:   "11px",
                    color:      "#6c5a49",
                  }}
                >
                  <RefreshCw size={12} />
                  Updates automatically every 30 seconds
                </span>
              ) : (
                <span />
              )}
              <a
                href="tel:03332287497"
                style={{
                  display:    "inline-flex",
                  alignItems: "center",
                  gap:        "6px",
                  fontSize:   "12px",
                  fontWeight: 600,
                  color:      "#EA580C",
                }}
              >
                <Phone size={13} />
                Call us: 0333-2287497
              </a>
            </div>
          </motion.div>
        )}

        <div style={{ textAlign: "center", marginTop: "28px" }}>
          <Link
            href="/menu"
            style={{ fontSize: "13px", fontWeight: 600, color: "#6c5a49" }}
          >
            ← Back to menu
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function TrackPage() {
  return (
    <Suspense fallback={null}>
      <TrackForm />
    </Suspense>
  );
}
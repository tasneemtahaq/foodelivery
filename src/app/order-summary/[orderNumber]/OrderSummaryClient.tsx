"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  CheckCircle, Package, Phone, MapPin, User,
  Clock, CreditCard, ShoppingBag, Home, StickyNote,
} from "lucide-react";
import { pageStyle, glass } from "@/lib/theme";

interface OrderItem {
  id:       number;
  quantity: number;
  price:    number;
  food: {
    id:    number;
    name:  string;
    image: string | null;
  };
}

interface Customer {
  name:    string;
  phone:   string;
  email:   string | null;
  address: string;
  city:    string;
  area:    string | null;
}

interface Order {
  id:             number;
  orderNumber:    string;
  status:         string;
  paymentMethod:  string;
  deliveryCharge: number;
  tax:            number;
  totalAmount:    number;
  instructions:   string | null;
  estimatedTime:  string | null;
  createdAt:      Date;
  customer:       Customer;
  orderItems:     OrderItem[];
}

const PAYMENT_LABELS: Record<string, string> = {
  cash:      "Cash on Delivery",
  bank:      "Bank Transfer",
  jazzcash:  "JazzCash",
  easypaisa: "EasyPaisa",
};

const STATUS_COLORS: Record<string, string> = {
  pending:          "#d97706",
  preparing:        "#2563eb",
  out_for_delivery: "#7c3aed",
  delivered:        "#059669",
  cancelled:        "#dc2626",
};

// One row in the "Delivery Details" card (kept outside the main component)
function DetailRow({
  icon,
  label,
  children,
}: {
  icon:     ReactNode;
  label:    string;
  children: ReactNode;
}) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}>
      <span
        style={{
          width:          "40px",
          height:         "40px",
          borderRadius:   "12px",
          flexShrink:     0,
          display:        "flex",
          alignItems:     "center",
          justifyContent: "center",
          background:     "rgba(249,115,22,0.12)",
          color:          "#EA580C",
        }}
      >
        {icon}
      </span>
      <div style={{ minWidth: 0 }}>
        <p
          style={{
            fontSize:      "10px",
            fontWeight:    600,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color:         "#9a9189",
          }}
        >
          {label}
        </p>
        <p
          style={{
            marginTop:  "2px",
            fontSize:   "14px",
            fontWeight: 600,
            color:      "#222",
            wordBreak:  "break-word",
          }}
        >
          {children}
        </p>
      </div>
    </div>
  );
}

export default function OrderSummaryClient({ order }: { order: Order }) {
  const subtotal = order.orderItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const formattedDate = new Date(order.createdAt).toLocaleString("en-PK", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  const statusColor = STATUS_COLORS[order.status] ?? "#d97706";

  return (
    <main style={pageStyle}>
      <div style={{ maxWidth: "760px", margin: "0 auto" }}>

        {/* ── Success header ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ textAlign: "center", marginBottom: "36px" }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.15 }}
            style={{
              width:          "92px",
              height:         "92px",
              borderRadius:   "50%",
              margin:         "0 auto 20px",
              display:        "flex",
              alignItems:     "center",
              justifyContent: "center",
              background:     "rgba(255,255,255,0.7)",
              border:         "3px solid rgba(255,255,255,0.9)",
              boxShadow:      "0 14px 36px rgba(5,150,105,0.25)",
            }}
          >
            <CheckCircle size={48} style={{ color: "#059669" }} />
          </motion.div>

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
            Order confirmed
          </p>
          <h1
            style={{
              fontSize:      "40px",
              fontWeight:    500,
              letterSpacing: "-1px",
              color:         "#171717",
            }}
          >
            Thank you, {order.customer.name}!
          </h1>
          <p style={{ fontSize: "14px", color: "#4a4640", marginTop: "8px" }}>
            Your order has been received and we are getting it ready.
          </p>

          <div
            style={{
              display:        "inline-flex",
              alignItems:     "center",
              gap:            "8px",
              marginTop:      "20px",
              padding:        "10px 22px",
              borderRadius:   "999px",
              background:     "rgba(255,255,255,0.75)",
              backdropFilter: "blur(10px)",
              border:         "1.5px solid #F97316",
              color:          "#EA580C",
              fontSize:       "14px",
              fontWeight:     700,
            }}
          >
            <Package size={16} />
            Order #{order.orderNumber}
          </div>
        </motion.div>

        {/* ── Status + estimated time ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{
            display:             "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap:                 "16px",
            marginBottom:        "24px",
          }}
        >
          {/* Status */}
          <div
            style={{
              ...glass,
              borderRadius: "24px",
              padding:      "18px 22px",
              display:      "flex",
              alignItems:   "center",
              gap:          "14px",
            }}
          >
            <span
              style={{
                width:          "46px",
                height:         "46px",
                borderRadius:   "14px",
                display:        "flex",
                alignItems:     "center",
                justifyContent: "center",
                background:     `${statusColor}1f`,
                color:          statusColor,
              }}
            >
              <Package size={20} />
            </span>
            <div>
              <p
                style={{
                  fontSize:      "10px",
                  fontWeight:    600,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color:         "#9a9189",
                }}
              >
                Status
              </p>
              <p
                style={{
                  fontSize:      "15px",
                  fontWeight:    700,
                  color:         statusColor,
                  textTransform: "capitalize",
                }}
              >
                {order.status.replace(/_/g, " ")}
              </p>
            </div>
          </div>

          {/* Estimated time */}
          <div
            style={{
              ...glass,
              borderRadius: "24px",
              padding:      "18px 22px",
              display:      "flex",
              alignItems:   "center",
              gap:          "14px",
            }}
          >
            <span
              style={{
                width:          "46px",
                height:         "46px",
                borderRadius:   "14px",
                display:        "flex",
                alignItems:     "center",
                justifyContent: "center",
                background:     "rgba(249,115,22,0.14)",
                color:          "#EA580C",
              }}
            >
              <Clock size={20} />
            </span>
            <div>
              <p
                style={{
                  fontSize:      "10px",
                  fontWeight:    600,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color:         "#9a9189",
                }}
              >
                Estimated time
              </p>
              <p style={{ fontSize: "15px", fontWeight: 700, color: "#222" }}>
                {order.estimatedTime ?? "30-45 minutes"}
              </p>
            </div>
          </div>
        </motion.div>

        {/* ── Ordered items ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{ ...glass, padding: "28px", marginBottom: "24px" }}
        >
          <div
            style={{
              display:      "flex",
              alignItems:   "center",
              gap:          "10px",
              marginBottom: "20px",
            }}
          >
            <ShoppingBag size={20} style={{ color: "#EA580C" }} />
            <h2 style={{ fontSize: "20px", fontWeight: 500, color: "#171717" }}>
              Ordered Items
            </h2>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            {order.orderItems.map((item, i) => (
              <div
                key={item.id}
                style={{
                  display:        "flex",
                  alignItems:     "center",
                  justifyContent: "space-between",
                  gap:            "12px",
                  padding:        "14px 0",
                  borderTop:      i === 0 ? "none" : "1px solid rgba(137,115,95,0.2)",
                }}
              >
                <div
                  style={{
                    display:    "flex",
                    alignItems: "center",
                    gap:        "14px",
                    minWidth:   0,
                  }}
                >
                  <span
                    style={{
                      width:          "32px",
                      height:         "32px",
                      borderRadius:   "10px",
                      flexShrink:     0,
                      display:        "flex",
                      alignItems:     "center",
                      justifyContent: "center",
                      background:     "linear-gradient(135deg, #F97316, #EA580C)",
                      color:          "white",
                      fontSize:       "13px",
                      fontWeight:     700,
                    }}
                  >
                    {item.quantity}
                  </span>
                  <span style={{ fontSize: "14px", fontWeight: 600, color: "#222" }}>
                    {item.food.name}
                  </span>
                </div>
                <span
                  style={{
                    fontSize:   "14px",
                    fontWeight: 700,
                    color:      "#222",
                    whiteSpace: "nowrap",
                  }}
                >
                  Rs.{item.price * item.quantity}
                </span>
              </div>
            ))}
          </div>

          {/* Price breakdown */}
          <div
            style={{
              marginTop:  "8px",
              paddingTop: "18px",
              borderTop:  "1px solid rgba(137,115,95,0.3)",
            }}
          >
            <div
              style={{
                display:        "flex",
                justifyContent: "space-between",
                fontSize:       "14px",
                color:          "#4a4640",
                marginBottom:   "10px",
              }}
            >
              <span>Subtotal</span>
              <span style={{ color: "#222" }}>Rs.{subtotal}</span>
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
              <span>Delivery</span>
              <span style={{ color: order.deliveryCharge > 0 ? "#222" : "#9a9189" }}>
                {order.deliveryCharge > 0
                  ? `Rs.${order.deliveryCharge}`
                  : "To be confirmed"}
              </span>
            </div>

            <div
              style={{
                display:        "flex",
                justifyContent: "space-between",
                alignItems:     "baseline",
                paddingTop:     "16px",
                borderTop:      "1px solid rgba(137,115,95,0.3)",
              }}
            >
              <span style={{ fontSize: "16px", fontWeight: 600, color: "#171717" }}>
                Total
              </span>
              <span style={{ fontSize: "26px", fontWeight: 700, color: "#EA580C" }}>
                Rs.{order.totalAmount}
              </span>
            </div>
          </div>
        </motion.div>

        {/* ── Delivery details ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          style={{ ...glass, padding: "28px", marginBottom: "28px" }}
        >
          <h2
            style={{
              fontSize:     "20px",
              fontWeight:   500,
              color:        "#171717",
              marginBottom: "22px",
            }}
          >
            Delivery Details
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <DetailRow icon={<User size={18} />} label="Customer">
              {order.customer.name}
            </DetailRow>

            <DetailRow icon={<Phone size={18} />} label="Phone">
              {order.customer.phone}
            </DetailRow>

            <DetailRow icon={<MapPin size={18} />} label="Address">
              {order.customer.address}
              {order.customer.area ? `, ${order.customer.area}` : ""}
              {`, ${order.customer.city}`}
            </DetailRow>

            <DetailRow icon={<CreditCard size={18} />} label="Payment method">
              {PAYMENT_LABELS[order.paymentMethod] ?? order.paymentMethod}
            </DetailRow>

            {order.instructions && (
              <DetailRow icon={<StickyNote size={18} />} label="Instructions">
                {order.instructions}
              </DetailRow>
            )}
          </div>

          <p
            style={{
              marginTop:  "24px",
              paddingTop: "16px",
              borderTop:  "1px solid rgba(137,115,95,0.25)",
              fontSize:   "12px",
              color:      "#6c5a49",
            }}
          >
            Ordered on {formattedDate}
          </p>
        </motion.div>

        {/* ── Buttons ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          style={{ display: "flex", flexWrap: "wrap", gap: "14px" }}
        >
          <Link
            href="/"
            style={{
              flex:           "1 1 220px",
              display:        "flex",
              alignItems:     "center",
              justifyContent: "center",
              gap:            "10px",
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
            <Home size={17} />
            Back to Home
          </Link>

          <Link
            href="/menu"
            style={{
              flex:           "1 1 220px",
              display:        "flex",
              alignItems:     "center",
              justifyContent: "center",
              gap:            "10px",
              padding:        "13px",
              borderRadius:   "999px",
              background:     "transparent",
              border:         "2px solid #F97316",
              color:          "#EA580C",
              fontSize:       "13px",
              fontWeight:     700,
              letterSpacing:  "0.1em",
              textTransform:  "uppercase",
            }}
          >
            <ShoppingBag size={17} />
            Order More
          </Link>

          <Link
            href={`/track?order=${order.orderNumber}`}
                        style={{
              flex:           "1 1 100%",
              display:        "flex",
              alignItems:     "center",
              justifyContent: "center",
              gap:            "10px",
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
            📍 Track this order
          </Link>

        </motion.div>
      </div>
    </main>
  );
}
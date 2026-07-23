"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  CheckCircle, Package, Phone, MapPin,
  Clock, CreditCard, ShoppingBag, Home,
} from "lucide-react";

// ── Type for the order coming from database ──
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
  id:            number;
  orderNumber:   string;
  status:        string;
  paymentMethod: string;
  deliveryCharge:number;
  tax:           number;
  totalAmount:   number;
  instructions:  string | null;
  estimatedTime: string | null;
  createdAt:     Date;
  customer:      Customer;
  orderItems:    OrderItem[];
}

// ── Payment method display names ──
const PAYMENT_LABELS: Record<string, string> = {
  cash:      "Cash on Delivery",
  bank:      "Bank Transfer",
  jazzcash:  "JazzCash",
  easypaisa: "EasyPaisa",
};

// ── Status colors ──
const STATUS_COLORS: Record<string, string> = {
  pending:          "#F59E0B",
  preparing:        "#3B82F6",
  out_for_delivery: "#8B5CF6",
  delivered:        "#10B981",
  cancelled:        "#EF4444",
};

export default function OrderSummaryClient({ order }: { order: Order }) {
  const subtotal = order.orderItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const formattedDate = new Date(order.createdAt).toLocaleString("en-PK", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">

      {/* ── Success Header ── */}
      <motion.div
        className="text-center mb-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Animated checkmark */}
        <motion.div
          className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-5"
          style={{ background: "rgba(16,185,129,0.1)" }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
        >
          <CheckCircle size={50} style={{ color: "#10B981" }} />
        </motion.div>

        <motion.h1
          className="text-3xl font-bold mb-2"
          style={{ color: "#1F2937" }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          Order Placed! 🎉
        </motion.h1>

        <motion.p
          className="text-sm"
          style={{ color: "#6B7280" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Thank you {order.customer.name}! Your order has been received.
        </motion.p>

        {/* Order Number Badge */}
        <motion.div
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full mt-4 text-sm font-bold"
          style={{
            padding: "3px 6px",
            background: "rgba(249,115,22,0.1)",
            border:     "1.5px solid rgba(249,115,22,0.3)",
            color:      "#F97316",
          }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
        >
          <Package size={16} />
          Order #{order.orderNumber}
        </motion.div>
      </motion.div>

      {/* ── Status + Estimated Time ── */}
      <motion.div
        className="grid grid-cols-2 gap-4 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        {/* Status */}
        <div
          className="p-4 rounded-2xl flex items-center gap-3"
          style={{
            padding: "3px 6px",
            background: "white",
            border: "1px solid rgba(0,0,0,0.07)",
            boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
          }}
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{
              background: `${STATUS_COLORS[order.status] ?? "#F59E0B"}15`,
            }}
          >
            <Package
              size={18}
              style={{ color: STATUS_COLORS[order.status] ?? "#F59E0B" }}
            />
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide"
               style={{ color: "#9CA3AF" }}>
              Status
            </p>
            <p
              className="font-bold capitalize text-sm"
              style={{ color: STATUS_COLORS[order.status] ?? "#F59E0B" }}
            >
              {order.status.replace(/_/g, " ")}
            </p>
          </div>
        </div>

        {/* Estimated Time */}
        <div
          className="p-4 rounded-2xl flex items-center gap-3"
          style={{
            padding: "3px 6px",
            background: "white",
            border: "1px solid rgba(0,0,0,0.07)",
            boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
          }}
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: "rgba(249,115,22,0.1)" }}
          >
            <Clock size={18} style={{ color: "#F97316" }} />
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide"
               style={{ color: "#9CA3AF" }}>
              Estimated Time
            </p>
            <p className="font-bold text-sm" style={{ color: "#1F2937" }}>
              {order.estimatedTime ?? "30-45 minutes"}
            </p>
          </div>
        </div>
      </motion.div>

      {/* ── Order Items ── */}
      <motion.div
        className="rounded-2xl p-6 mb-6"
        style={{
          padding: "3px 6px",
          background: "white",
          border: "1px solid rgba(0,0,0,0.07)",
          boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-center gap-2 mb-5">
          <ShoppingBag size={18} style={{ color: "#F97316" }} />
          <h2 className="font-bold text-lg" style={{ color: "#1F2937" }}>
            Ordered Items
          </h2>
        </div>

        <div className="flex flex-col gap-3">
          {order.orderItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between py-2"
              style={{ padding: "3px 6px", borderBottom: "1px solid rgba(0,0,0,0.05)" }}
            >
              <div className="flex items-center gap-3">
                {/* Quantity badge */}
                <span
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white shrink-0"
                  style={{ background: "#F97316" }}
                >
                  {item.quantity}
                </span>
                <span className="text-sm font-medium" style={{ color: "#1F2937" }}>
                  {item.food.name}
                </span>
              </div>
              <span className="text-sm font-bold" style={{ color: "#1F2937" }}>
                Rs.{item.price * item.quantity}
              </span>
            </div>
          ))}
        </div>

        {/* Price breakdown */}
        <div className="mt-4 pt-4 flex flex-col gap-2"
             style={{ borderTop: "1px solid rgba(0,0,0,0.07)" }}>
          <div className="flex justify-between text-sm">
            <span style={{ padding: "3px 6px",color: "#6B7280" }}>Subtotal</span>
            <span style={{ padding: "3px 6px",color: "#1F2937" }}>Rs.{subtotal}</span>
          </div>
          <div className="flex justify-between text-sm"
          style={{padding: "3px 6px", borderTop: "1px solid rgba(0,0,0,0.07)" }}>
           <p className="text-green-600 font-bold italic"> Delivery charges may apply</p>
            </div>
          <div
            className="flex justify-between font-bold text-base pt-2"
            style={{padding: "3px 6px", borderTop: "1px solid rgba(0,0,0,0.07)" }}
          >
            <span style={{ color: "#1F2937" }}>Total Paid</span>
            <span style={{ color: "#F97316" }}>Rs.{order.totalAmount}</span>
          </div>
        </div>
      </motion.div>

      {/* ── Customer + Payment Details ── */}
      <motion.div
        className="rounded-2xl p-6 mb-6"
        style={{
          padding: "4px 8px",
          background: "white",
          border: "1px solid rgba(0,0,0,0.07)",
          boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h2 className="font-bold text-lg mb-5" style={{ color: "#1F2937" }}>
          Delivery Details
        </h2>

        <div className="flex flex-col gap-4">
          {/* Name */}
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
              style={{ background: "rgba(249,115,22,0.08)" }}
            >
              <Package size={16} style={{ color: "#F97316" }} />
            </div>
            <div>
              <p className="text-xs" style={{ color: "#9CA3AF" }}>Customer</p>
              <p className="font-semibold text-sm" style={{ color: "#1F2937" }}>
                {order.customer.name}
              </p>
            </div>
          </div>

          {/* Phone */}
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
              style={{ background: "rgba(249,115,22,0.08)" }}
            >
              <Phone size={16} style={{ color: "#F97316" }} />
            </div>
            <div>
              <p className="text-xs" style={{ color: "#9CA3AF" }}>Phone</p>
              <p className="font-semibold text-sm" style={{ color: "#1F2937" }}>
                {order.customer.phone}
              </p>
            </div>
          </div>

          {/* Address */}
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
              style={{ background: "rgba(249,115,22,0.08)" }}
            >
              <MapPin size={16} style={{ color: "#F97316" }} />
            </div>
            <div>
              <p className="text-xs" style={{ color: "#9CA3AF" }}>Address</p>
              <p className="font-semibold text-sm" style={{ color: "#1F2937" }}>
                {order.customer.address}
                {order.customer.area ? `, ${order.customer.area}` : ""}
                , {order.customer.city}
              </p>
            </div>
          </div>

          {/* Payment */}
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
              style={{ background: "rgba(249,115,22,0.08)" }}
            >
              <CreditCard size={16} style={{ color: "#F97316" }} />
            </div>
            <div>
              <p className="text-xs" style={{ color: "#9CA3AF" }}>
                Payment Method
              </p>
              <p className="font-semibold text-sm" style={{ color: "#1F2937" }}>
                {PAYMENT_LABELS[order.paymentMethod] ?? order.paymentMethod}
              </p>
            </div>
          </div>

          {/* Special Instructions */}
          {order.instructions && (
            <div className="flex items-start gap-3">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: "rgba(249,115,22,0.08)" }}
              >
                <Clock size={16} style={{ color: "#F97316" }} />
              </div>
              <div>
                <p className="text-xs" style={{ color: "#9CA3AF" }}>
                  Instructions
                </p>
                <p className="font-semibold text-sm" style={{ color: "#1F2937" }}>
                  {order.instructions}
                </p>
              </div>
            </div>
          )}

          {/* Order date */}
          <div
            className="text-xs pt-3 mt-1"
            style={{
              padding: "4px 8px",
              color: "#636660",
              borderTop: "1px solid rgba(0,0,0,0.06)",
            }}
          >
            Ordered on {formattedDate}
          </div>
        </div>
      </motion.div>

      {/* ── Action Buttons ── */}
      
      <motion.div
        className=" flex flex-col sm:flex-row gap-3"
        style={{ marginTop: "20px" }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Link
          href="/"
          className="flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-white"
          style={{
            background: "linear-gradient(135deg, #F97316, #EA580C)",
            boxShadow: "0 4px 20px rgba(249,115,22,0.3)",
          }}
        >
          <Home size={18} />
          Back to Home
        </Link>

        <Link
          href="/menu"
          className="flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-bold border-2 transition-all hover:bg-orange-50"
          style={{
            borderColor: "#F97316",
            color:       "#F97316",
          }}
        >
          <ShoppingBag size={18} />
          Order More
        </Link>
      </motion.div>
    </div>
  );
}
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";
import type { AdminOrder } from "./page";

const STATUS_OPTIONS = [
  { value: "pending",          label: "Pending",          color: "#F59E0B" },
  { value: "preparing",        label: "Preparing",        color: "#3B82F6" },
  { value: "out_for_delivery", label: "Out for Delivery", color: "#8B5CF6" },
  { value: "delivered",        label: "Delivered",        color: "#10B981" },
  { value: "cancelled",        label: "Cancelled",        color: "#EF4444" },
];

const PAYMENT_LABELS: Record<string, string> = {
  cash:      "Cash on Delivery",
  bank:      "Bank Transfer",
  jazzcash:  "JazzCash",
  easypaisa: "EasyPaisa",
};

export default function AdminOrdersClient({
  orders: initialOrders,
}: {
  orders: AdminOrder[];
}) {
  const [orders,      setOrders]      = useState(initialOrders);
  const [expandedId,  setExpandedId]  = useState<number | null>(null);
  const [updatingId,  setUpdatingId]  = useState<number | null>(null);

  // Auto-check for new pending orders every 30 seconds
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res  = await fetch("/api/orders/new");
        const data = await res.json();
        if (data.count > 0) {
          toast(`🔔 ${data.count} new order${data.count > 1 ? "s" : ""}!`, {
            duration: 6000,
            icon: "🍜",
          });
        }
      } catch {
        // silent fail
      }
    }, 30000); // every 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Toggle expand/collapse order details
  const toggleExpand = (id: number) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  // Update order status
  const updateStatus = async (orderId: number, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method:  "PATCH",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error("Failed to update");

      // Update local state immediately (no page reload needed!)
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId ? { ...o, status: newStatus } : o
        )
      );

      toast.success("Order status updated! ✅");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusColor = (status: string) =>
    STATUS_OPTIONS.find((s) => s.value === status)?.color ?? "#F59E0B";

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Orders</h1>
          <p className="text-sm mt-1" style={{ color: "#6B7280" }}>
            {orders.length} total orders
          </p>
        </div>
      </div>

      {/* Orders List */}
      {orders.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-5xl mb-4">📋</p>
          <p className="text-white font-bold text-lg">No orders yet</p>
          <p style={{ color: "#6B7280" }} className="text-sm mt-1">
            Orders will appear here when customers place them
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {orders.map((order, i) => (
            <motion.div
              key={order.id}
              className="rounded-2xl overflow-hidden"
              style={{
                background: "#1A1A1A",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              {/* Order Row */}
              <div
                className="px-5 py-4 flex flex-wrap items-center gap-4 cursor-pointer"
                onClick={() => toggleExpand(order.id)}
              >
                {/* Order Number */}
                <div className="min-w-32.5">
                  <p className="text-xs" style={{ color: "#6B7280" }}>
                    Order #
                  </p>
                  <p className="font-bold" style={{ color: "#F97316" }}>
                    {order.orderNumber}
                  </p>
                </div>

                {/* Customer */}
                <div className="flex-1 min-w-35">
                  <p className="text-xs" style={{ color: "#6B7280" }}>
                    Customer
                  </p>
                  <p className="text-sm font-medium text-white">
                    {order.customer.name}
                  </p>
                  <p className="text-xs" style={{ color: "#6B7280" }}>
                    {order.customer.phone}
                  </p>
                </div>

                {/* Amount */}
                <div className="min-w-22.5">
                  <p className="text-xs" style={{ color: "#6B7280" }}>Amount</p>
                  <p className="text-sm font-bold text-white">
                    Rs.{order.totalAmount}
                  </p>
                </div>

                {/* Payment */}
                <div className="min-w-30">
                  <p className="text-xs" style={{ color: "#6B7280" }}>Payment</p>
                  <p className="text-xs font-medium" style={{ color: "#9CA3AF" }}>
                    {PAYMENT_LABELS[order.paymentMethod] ?? order.paymentMethod}
                  </p>
                </div>

                {/* Status Dropdown */}
                <div
                  className="min-w-40"
                  onClick={(e) => e.stopPropagation()}
                >
                  <p className="text-xs mb-1" style={{ color: "#6B7280" }}>
                    Status
                  </p>
                  <div className="relative">
                    <select
                      value={order.status}
                      onChange={(e) => updateStatus(order.id, e.target.value)}
                      disabled={updatingId === order.id}
                      className="w-full px-3 py-1.5 rounded-lg text-xs font-bold appearance-none cursor-pointer"
                      style={{
                        background: `${getStatusColor(order.status)}20`,
                        border:     `1px solid ${getStatusColor(order.status)}40`,
                        color:       getStatusColor(order.status),
                        outline:    "none",
                      }}
                    >
                      {STATUS_OPTIONS.map((opt) => (
                        <option
                          key={opt.value}
                          value={opt.value}
                          style={{ background: "#1A1A1A", color: opt.color }}
                        >
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    {updatingId === order.id && (
                      <motion.div
                        className="absolute right-2 top-1/2 -translate-y-1/2"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <RefreshCw size={12} style={{ color: "#F97316" }} />
                      </motion.div>
                    )}
                  </div>
                </div>

                {/* Expand toggle */}
                <div style={{ color: "#6B7280" }}>
                  {expandedId === order.id
                    ? <ChevronUp size={18} />
                    : <ChevronDown size={18} />
                  }
                </div>
              </div>

              {/* Expanded Order Details */}
              <AnimatePresence>
                {expandedId === order.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{   height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
                  >
                    <div className="px-5 py-4 grid grid-cols-1 md:grid-cols-2 gap-6">

                      {/* Items */}
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider mb-3"
                           style={{ color: "#6B7280" }}>
                          Ordered Items
                        </p>
                        <div className="flex flex-col gap-2">
                          {order.orderItems.map((item) => (
                            <div
                              key={item.id}
                              className="flex justify-between text-sm"
                            >
                              <span style={{ color: "#D1D5DB" }}>
                                {item.food.name}
                                <span
                                  className="ml-2 text-xs"
                                  style={{ color: "#6B7280" }}
                                >
                                  x{item.quantity}
                                </span>
                              </span>
                              <span className="font-medium text-white">
                                Rs.{item.price * item.quantity}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Price summary */}
                        <div
                          className="mt-3 pt-3 flex flex-col gap-1"
                          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
                        >
                          <div className="flex justify-between text-xs"
                               style={{ color: "#6B7280" }}>
                            <span>Delivery</span>
                            <span>
                              {order.deliveryCharge === 0
                                ? "FREE"
                                : `Rs.${order.deliveryCharge}`}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm font-bold">
                            <span style={{ color: "#D1D5DB" }}>Total</span>
                            <span style={{ color: "#F97316" }}>
                              Rs.{order.totalAmount}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Delivery Info */}
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider mb-3"
                           style={{ color: "#6B7280" }}>
                          Delivery Info
                        </p>
                        <div className="flex flex-col gap-2 text-sm">
                          <div>
                            <span style={{ color: "#6B7280" }}>Address: </span>
                            <span style={{ color: "#D1D5DB" }}>
                              {order.customer.address}
                              {order.customer.area
                                ? `, ${order.customer.area}`
                                : ""}
                              , {order.customer.city}
                            </span>
                          </div>
                          {order.instructions && (
                            <div>
                              <span style={{ color: "#6B7280" }}>Instructions: </span>
                              <span style={{ color: "#D1D5DB" }}>
                                {order.instructions}
                              </span>
                            </div>
                          )}
                          <div>
                            <span style={{ color: "#6B7280" }}>Placed: </span>
                            <span style={{ color: "#D1D5DB" }}>
                              {new Date(order.createdAt).toLocaleString("en-PK", {
                                dateStyle: "medium",
                                timeStyle: "short",
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp, ShoppingBag, Users,
  Calendar, ChevronLeft, ChevronRight,
} from "lucide-react";

interface OrderItem {
  id:       number;
  quantity: number;
  price:    number;
  food:     { name: string };
}

interface Order {
  id:            number;
  orderNumber:   string;
  status:        string;
  totalAmount:   number;
  paymentMethod: string;
  createdAt:     Date;
  customer:      { name: string; phone: string };
  orderItems:    OrderItem[];
}

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

const STATUS_COLORS: Record<string, string> = {
  pending:          "#F59E0B",
  preparing:        "#3B82F6",
  out_for_delivery: "#8B5CF6",
  delivered:        "#10B981",
  cancelled:        "#EF4444",
};

export default function StatisticsClient({ orders }: { orders: Order[] }) {
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth());
  const [selectedYear,  setSelectedYear]  = useState(now.getFullYear());

  // Filter orders for selected month
  const monthOrders = useMemo(() => {
    return orders.filter((o) => {
      const d = new Date(o.createdAt);
      return d.getMonth() === selectedMonth && d.getFullYear() === selectedYear;
    });
  }, [orders, selectedMonth, selectedYear]);

  // Calculate stats
  const stats = useMemo(() => {
    const delivered  = monthOrders.filter((o) => o.status === "delivered");
    const cancelled  = monthOrders.filter((o) => o.status === "cancelled");
    const revenue    = delivered.reduce((sum, o) => sum + o.totalAmount, 0);
    const totalRevenue = monthOrders
      .filter((o) => o.status !== "cancelled")
      .reduce((sum, o) => sum + o.totalAmount, 0);

    // Top selling items
    const itemMap: Record<string, { name: string; count: number; revenue: number }> = {};
    monthOrders.forEach((order) => {
      order.orderItems.forEach((item) => {
        if (!itemMap[item.food.name]) {
          itemMap[item.food.name] = { name: item.food.name, count: 0, revenue: 0 };
        }
        itemMap[item.food.name].count   += item.quantity;
        itemMap[item.food.name].revenue += item.price * item.quantity;
      });
    });

    const topItems = Object.values(itemMap)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Daily breakdown
    const dailyMap: Record<string, number> = {};
    monthOrders.forEach((o) => {
      const day = new Date(o.createdAt).getDate().toString();
      dailyMap[day] = (dailyMap[day] ?? 0) + o.totalAmount;
    });

    // Payment methods
    const paymentMap: Record<string, number> = {};
    monthOrders.forEach((o) => {
      paymentMap[o.paymentMethod] = (paymentMap[o.paymentMethod] ?? 0) + 1;
    });

    return {
      totalOrders:    monthOrders.length,
      deliveredCount: delivered.length,
      cancelledCount: cancelled.length,
      revenue,
      totalRevenue,
      topItems,
      dailyMap,
      paymentMap,
      uniqueCustomers: new Set(monthOrders.map((o) => o.customer.phone)).size,
    };
  }, [monthOrders]);

  const prevMonth = () => {
    if (selectedMonth === 0) { setSelectedMonth(11); setSelectedYear((y) => y - 1); }
    else setSelectedMonth((m) => m - 1);
  };

  const nextMonth = () => {
    if (selectedMonth === 11) { setSelectedMonth(0); setSelectedYear((y) => y + 1); }
    else setSelectedMonth((m) => m + 1);
  };

  const PAYMENT_LABELS: Record<string, string> = {
    cash: "Cash on Delivery", bank: "Bank Transfer",
    jazzcash: "JazzCash", easypaisa: "EasyPaisa",
  };

  const cardStyle = {
    background: "#1A1A1A",
    border:     "1px solid rgba(255,255,255,0.06)",
    borderRadius: "16px",
    padding:    "20px",
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Statistics</h1>
          <p className="text-sm mt-1" style={{ color: "#6B7280" }}>
            Monthly orders & income overview
          </p>
        </div>

        {/* Month Selector */}
        <div
          className="flex items-center gap-3 px-4 py-2 rounded-xl"
          style={{ background: "#1A1A1A", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <button onClick={prevMonth} style={{ color: "#F97316" }}>
            <ChevronLeft size={20} />
          </button>
          <div className="flex items-center gap-2 min-w-36 justify-center">
            <Calendar size={16} style={{ color: "#F97316" }} />
            <span className="text-white font-bold text-sm">
              {MONTHS[selectedMonth]} {selectedYear}
            </span>
          </div>
          <button onClick={nextMonth} style={{ color: "#F97316" }}>
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* ── STAT CARDS ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          {
            label: "Total Orders",
            value: stats.totalOrders,
            icon:  ShoppingBag,
            color: "#F97316",
            bg:    "rgba(249,115,22,0.1)",
          },
          {
            label: "Total Revenue",
            value: `Rs.${stats.totalRevenue.toLocaleString()}`,
            icon:  TrendingUp,
            color: "#10B981",
            bg:    "rgba(16,185,129,0.1)",
          },
          {
            label: "Delivered",
            value: stats.deliveredCount,
            icon:  ShoppingBag,
            color: "#10B981",
            bg:    "rgba(16,185,129,0.1)",
          },
          {
            label: "Customers",
            value: stats.uniqueCustomers,
            icon:  Users,
            color: "#3B82F6",
            bg:    "rgba(59,130,246,0.1)",
          },
        ].map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.label}
              style={cardStyle}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                style={{ background: card.bg }}
              >
                <Icon size={20} style={{ color: card.color }} />
              </div>
              <p className="text-2xl font-bold text-white">{card.value}</p>
              <p className="text-xs mt-1" style={{ color: "#6B7280" }}>{card.label}</p>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

        {/* ── TOP SELLING ITEMS ── */}
        <motion.div
          style={cardStyle}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="font-bold text-white mb-4 flex items-center gap-2">
            🏆 Top Selling Items
          </h2>
          {stats.topItems.length === 0 ? (
            <p className="text-sm" style={{ color: "#6B7280" }}>No orders this month</p>
          ) : (
            <div className="flex flex-col gap-3">
              {stats.topItems.map((item, i) => (
                <div key={item.name} className="flex items-center gap-3">
                  <span
                    className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-black shrink-0"
                    style={{ background: i === 0 ? "#F59E0B" : i === 1 ? "#9CA3AF" : "#CD7F32" }}
                  >
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white truncate">{item.name}</p>
                    <div
                      className="h-1.5 rounded-full mt-1"
                      style={{ background: "rgba(255,255,255,0.06)" }}
                    >
                      <div
                        className="h-full rounded-full"
                        style={{
                          width:      `${(item.count / (stats.topItems[0]?.count || 1)) * 100}%`,
                          background: "linear-gradient(to right, #F97316, #F59E0B)",
                        }}
                      />
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs font-bold" style={{ color: "#F97316" }}>
                      {item.count} sold
                    </p>
                    <p className="text-xs" style={{ color: "#6B7280" }}>
                      Rs.{item.revenue}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* ── PAYMENT METHODS ── */}
        <motion.div
          style={cardStyle}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="font-bold text-white mb-4">
            💳 Payment Methods
          </h2>
          {Object.keys(stats.paymentMap).length === 0 ? (
            <p className="text-sm" style={{ color: "#6B7280" }}>No orders this month</p>
          ) : (
            <div className="flex flex-col gap-3">
              {Object.entries(stats.paymentMap)
                .sort(([,a], [,b]) => b - a)
                .map(([method, count]) => (
                  <div key={method} className="flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between mb-1">
                        <p className="text-sm text-white">
                          {PAYMENT_LABELS[method] ?? method}
                        </p>
                        <p className="text-sm font-bold" style={{ color: "#F97316" }}>
                          {count}
                        </p>
                      </div>
                      <div
                        className="h-1.5 rounded-full"
                        style={{ background: "rgba(255,255,255,0.06)" }}
                      >
                        <div
                          className="h-full rounded-full"
                          style={{
                            width:      `${(count / stats.totalOrders) * 100}%`,
                            background: "linear-gradient(to right, #F97316, #F59E0B)",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* ── ORDER STATUS BREAKDOWN ── */}
      <motion.div
        style={cardStyle}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mb-6"
      >
        <h2 className="font-bold text-white mb-4">📊 Order Status Breakdown</h2>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[
            { label: "Pending",        key: "pending",          color: "#F59E0B" },
            { label: "Preparing",      key: "preparing",        color: "#3B82F6" },
            { label: "Out Delivery",   key: "out_for_delivery", color: "#8B5CF6" },
            { label: "Delivered",      key: "delivered",        color: "#10B981" },
            { label: "Cancelled",      key: "cancelled",        color: "#EF4444" },
          ].map(({ label, key, color }) => {
            const count = monthOrders.filter((o) => o.status === key).length;
            return (
              <div
                key={key}
                className="p-3 rounded-xl text-center"
                style={{ background: `${color}15`, border: `1px solid ${color}30` }}
              >
                <p className="text-xl font-bold" style={{ color }}>{count}</p>
                <p className="text-xs mt-1" style={{ color: "#9CA3AF" }}>{label}</p>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* ── RECENT ORDERS THIS MONTH ── */}
      <motion.div
        style={cardStyle}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <h2 className="font-bold text-white mb-4">
          📋 Orders This Month ({monthOrders.length})
        </h2>
        {monthOrders.length === 0 ? (
          <p className="text-sm" style={{ color: "#6B7280" }}>No orders this month</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-500px">
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  {["Order #", "Customer", "Amount", "Status", "Date"].map((h) => (
                    <th
                      key={h}
                      className="pb-3 text-left text-xs font-medium uppercase tracking-wider"
                      style={{ color: "#6B7280" }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {monthOrders.slice(0, 10).map((order) => (
                  <tr
                    key={order.id}
                    style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}
                  >
                    <td className="py-3 text-sm font-bold" style={{ color: "#F97316" }}>
                      {order.orderNumber}
                    </td>
                    <td className="py-3 text-sm text-white">
                      {order.customer.name}
                    </td>
                    <td className="py-3 text-sm font-medium text-white">
                      Rs.{order.totalAmount}
                    </td>
                    <td className="py-3">
                      <span
                        className="px-2 py-0.5 rounded-lg text-xs font-bold capitalize"
                        style={{
                          background: `${STATUS_COLORS[order.status] ?? "#F59E0B"}20`,
                          color:       STATUS_COLORS[order.status] ?? "#F59E0B",
                        }}
                      >
                        {order.status.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="py-3 text-xs" style={{ color: "#6B7280" }}>
                      {new Date(order.createdAt).toLocaleDateString("en-PK")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {monthOrders.length > 10 && (
              <p className="text-xs mt-3 text-center" style={{ color: "#6B7280" }}>
                Showing 10 of {monthOrders.length} orders
              </p>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  ShoppingBag, Users, UtensilsCrossed,
  Clock, CheckCircle, XCircle, TrendingUp,
} from "lucide-react";

interface RecentOrder {
  id:          number;
  orderNumber: string;
  status:      string;
  totalAmount: number;
  createdAt:   Date;
  customer:    { name: string; phone: string };
}

interface Stats {
  totalOrders:     number;
  pendingOrders:   number;
  preparingOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  totalCustomers:  number;
  totalFoods:      number;
  totalRevenue:    number;
  recentOrders:    RecentOrder[];
}

const STATUS_COLORS: Record<string, string> = {
  pending:          "#F59E0B",
  preparing:        "#3B82F6",
  out_for_delivery: "#8B5CF6",
  delivered:        "#10B981",
  cancelled:        "#EF4444",
};

export default function AdminDashboardClient({ stats }: { stats: Stats }) {
  const STAT_CARDS = [
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
      label: "Customers",
      value: stats.totalCustomers,
      icon:  Users,
      color: "#3B82F6",
      bg:    "rgba(59,130,246,0.1)",
    },
    {
      label: "Menu Items",
      value: stats.totalFoods,
      icon:  UtensilsCrossed,
      color: "#8B5CF6",
      bg:    "rgba(139,92,246,0.1)",
    },
  ];

  const ORDER_STATUS_CARDS = [
    { label: "Pending",   value: stats.pendingOrders,   color: "#F59E0B", icon: Clock        },
    { label: "Preparing", value: stats.preparingOrders, color: "#3B82F6", icon: ShoppingBag  },
    { label: "Delivered", value: stats.deliveredOrders, color: "#10B981", icon: CheckCircle  },
    { label: "Cancelled", value: stats.cancelledOrders, color: "#EF4444", icon: XCircle      },
  ];

  return (
    <div>
      {/* Header */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-sm mt-1" style={{ color: "#6B7280" }}>
          Welcome back! Here&apos;s what&apos;s happening today.
        </p>
      </motion.div>

      {/* Main Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {STAT_CARDS.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.label}
              className="p-5 rounded-2xl"
              style={{
                background: "#1A1A1A",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
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
              <p className="text-xs mt-1" style={{ color: "#6B7280" }}>
                {card.label}
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* Order Status Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {ORDER_STATUS_CARDS.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.label}
              className="p-4 rounded-2xl flex items-center gap-3"
              style={{
                background: "#1A1A1A",
                border: `1px solid ${card.color}25`,
              }}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + i * 0.07 }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: `${card.color}15` }}
              >
                <Icon size={18} style={{ color: card.color }} />
              </div>
              <div>
                <p className="text-xl font-bold text-white">{card.value}</p>
                <p className="text-xs" style={{ color: "#6B7280" }}>
                  {card.label}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Recent Orders Table */}
      <motion.div
        className="rounded-2xl overflow-hidden"
        style={{
          background: "#1A1A1A",
          border: "1px solid rgba(255,255,255,0.06)",
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        {/* Table Header */}
        <div
          className="px-6 py-4 flex items-center justify-between"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
        >
          <h2 className="font-bold text-white">Recent Orders</h2>
          <Link
            href="/admin/orders"
            className="text-xs font-medium transition-colors hover:opacity-80"
            style={{ color: "#F97316" }}
          >
            View All →
          </Link>
        </div>

        {/* Table */}
        {stats.recentOrders.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-4xl mb-2">📋</p>
            <p style={{ color: "#6B7280" }}>No orders yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                  {["Order #", "Customer", "Phone", "Amount", "Status", "Action"].map((h) => (
                    <th
                      key={h}
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                      style={{ color: "#6B7280" }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {stats.recentOrders.map((order, i) => (
                  <motion.tr
                    key={order.id}
                    style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + i * 0.05 }}
                  >
                    <td className="px-6 py-4">
                      <span
                        className="text-sm font-bold"
                        style={{ color: "#F97316" }}
                      >
                        {order.orderNumber}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-white">
                        {order.customer.name}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm" style={{ color: "#9CA3AF" }}>
                        {order.customer.phone}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-white">
                        Rs.{order.totalAmount}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className="px-2 py-1 rounded-lg text-xs font-bold capitalize"
                        style={{
                          background: `${STATUS_COLORS[order.status] ?? "#F59E0B"}20`,
                          color:       STATUS_COLORS[order.status] ?? "#F59E0B",
                        }}
                      >
                        {order.status.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        href="/admin/orders"
                        className="text-xs font-medium transition-colors hover:opacity-80"
                        style={{ color: "#F97316" }}
                      >
                        Manage →
                      </Link>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  );
}
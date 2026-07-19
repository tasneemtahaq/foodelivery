"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Mail, Lock, Shield } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import toast from "react-hot-toast";

export default function AdminLoginPage() {
  const router  = useRouter();
  const login   = useAuthStore((s) => s.login);

  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [loading,  setLoading]  = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res  = await fetch("/api/auth/login", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ email, password, isAdmin: true }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      login({ ...data.user, role: "admin" });
      toast.success("Welcome, Admin! 👑");
      router.push("/admin");

    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "#0F0F0F" }}
    >
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background: "rgba(249,115,22,0.1)", border: "1px solid rgba(249,115,22,0.2)" }}
          >
            <Shield size={28} style={{ color: "#F97316" }} />
          </div>
          <h1 className="text-2xl font-bold text-white">Admin Login</h1>
          <p className="text-sm mt-1" style={{ color: "#6B7280" }}>
            Mama Soups — Admin Panel
          </p>
        </div>

        {/* Form */}
        <div
          className="p-8 rounded-2xl"
          style={{
            background: "#1A1A1A",
            border:     "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <form onSubmit={handleLogin} className="flex flex-col gap-4">

            {/* Email */}
            <div className="relative">
              <Mail size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2"
                style={{ color: "#6B7280" }}
              />
              <input
                type="email"
                placeholder="Admin email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full outline-none text-white text-sm"
                style={{
                  padding:      "12px 16px 12px 40px",
                  borderRadius: "10px",
                  border:       "1px solid rgba(255,255,255,0.1)",
                  background:   "rgba(255,255,255,0.05)",
                }}
              />
            </div>

            {/* Password */}
            <div className="relative">
              <Lock size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2"
                style={{ color: "#6B7280" }}
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full outline-none text-white text-sm"
                style={{
                  padding:      "12px 16px 12px 40px",
                  borderRadius: "10px",
                  border:       "1px solid rgba(255,255,255,0.1)",
                  background:   "rgba(255,255,255,0.05)",
                }}
              />
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-bold text-white mt-2"
              style={{
                background: loading
                  ? "#374151"
                  : "linear-gradient(135deg, #F97316, #EA580C)",
              }}
              whileHover={!loading ? { scale: 1.02 } : {}}
              whileTap={!loading ? { scale: 0.98 } : {}}
            >
              {loading ? "Signing in..." : "Sign In to Admin"}
            </motion.button>
          </form>

        
        </div>
      </motion.div>
    </div>
  );
}
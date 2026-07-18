"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router   = useRouter();
  const login    = useAuthStore((s) => s.login);

  const [email,     setEmail]     = useState("");
  const [password,  setPassword]  = useState("");
  const [showPass,  setShowPass]  = useState(false);
  const [loading,   setLoading]   = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const res  = await fetch("/api/auth/login", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ email, password, isAdmin: false }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      login({ ...data.user, role: "customer" });
      toast.success(`Welcome back, ${data.user.name}! 👋`);
      router.push("/");

    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width:        "100%",
    padding:      "12px 16px 12px 44px",
    borderRadius: "12px",
    border:       "1.5px solid rgba(0,0,0,0.1)",
    background:   "white",
    color:        "#1F2937",
    fontSize:     "14px",
    outline:      "none",
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        background: "linear-gradient(135deg, #fff7ed 0%, #ffffff 50%, #fff7ed 100%)",
        paddingTop: "80px",
      }}
    >
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Image
            src="/images/logo.png"
            alt="Mama Soups"
            width={80}
            height={80}
            style={{ width: "auto", height: "70px", objectFit: "contain", margin: "0 auto" }}
          />
          <h1 className="text-2xl font-bold mt-4" style={{ color: "#1F2937" }}>
            Welcome Back!
          </h1>
          <p className="text-sm mt-1" style={{ color: "#6B7280" }}>
            Sign in to your account
          </p>
        </div>

        {/* Form Card */}
        <div
          className="p-8 rounded-2xl"
          style={{
            background:  "white",
            boxShadow:   "0 10px 40px rgba(0,0,0,0.08)",
            border:      "1px solid rgba(0,0,0,0.06)",
          }}
        >
          <form onSubmit={handleLogin} className="flex flex-col gap-4">

            {/* Email */}
            <div className="relative">
              <Mail
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2"
                style={{ color: "#9CA3AF" }}
              />
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={inputStyle}
              />
            </div>

            {/* Password */}
            <div className="relative">
              <Lock
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2"
                style={{ color: "#9CA3AF" }}
              />
              <input
                type={showPass ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ ...inputStyle, paddingRight: "44px" }}
              />
              <button
                type="button"
                onClick={() => setShowPass((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
                style={{ color: "#9CA3AF" }}
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-bold text-white flex items-center justify-center gap-2 mt-2"
              style={{
                background: loading
                  ? "#9CA3AF"
                  : "linear-gradient(135deg, #F97316, #EA580C)",
                boxShadow: loading
                  ? "none"
                  : "0 4px 20px rgba(249,115,22,0.35)",
              }}
              whileHover={!loading ? { scale: 1.02 } : {}}
              whileTap={!loading ? { scale: 0.98 } : {}}
            >
              {loading ? "Signing in..." : (
                <>Sign In <ArrowRight size={16} /></>
              )}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px" style={{ background: "rgba(0,0,0,0.08)" }} />
            <span className="text-xs" style={{ color: "#9CA3AF" }}>OR</span>
            <div className="flex-1 h-px" style={{ background: "rgba(0,0,0,0.08)" }} />
          </div>

          {/* Register link */}
          <p className="text-center text-sm" style={{ color: "#6B7280" }}>
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-bold transition-colors hover:opacity-80"
              style={{ color: "#F97316" }}
            >
              Sign Up Free
            </Link>
          </p>
        </div>

        {/* Admin login link */}
        <p className="text-center text-xs mt-4" style={{ color: "#9CA3AF" }}>
          Are you an admin?{" "}
          <Link
            href="/admin/login"
            className="font-medium hover:opacity-80"
            style={{ color: "#F97316" }}
          >
            Admin Login →
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
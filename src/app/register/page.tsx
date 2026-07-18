"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowRight } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const router = useRouter();
  const login  = useAuthStore((s) => s.login);

  const [form,     setForm]     = useState({
    name: "", email: "", password: "", phone: "",
  });
  const [showPass, setShowPass] = useState(false);
  const [loading,  setLoading]  = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.password) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      const res  = await fetch("/api/auth/register", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      // Auto login after register
      const loginRes  = await fetch("/api/auth/login", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          email:    form.email,
          password: form.password,
          isAdmin:  false,
        }),
      });
      const loginData = await loginRes.json();

      login({ ...loginData.user, role: "customer" });
      toast.success("Account created! Welcome to Mama Soups 🍜");
      router.push("/");

    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = (icon = true) => ({
    width:        "100%",
    padding:      `12px 16px 12px ${icon ? "44px" : "16px"}`,
    borderRadius: "12px",
    border:       "1.5px solid rgba(0,0,0,0.1)",
    background:   "white",
    color:        "#1F2937",
    fontSize:     "14px",
    outline:      "none",
  });

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-8"
      style={{
        background: "linear-gradient(135deg, #fff7ed 0%, #ffffff 50%, #fff7ed 100%)",
        paddingTop: "100px",
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
            Create Account
          </h1>
          <p className="text-sm mt-1" style={{ color: "#6B7280" }}>
            Join Mama Soups today — it&apos;s free!
          </p>
        </div>

        {/* Form */}
        <div
          className="p-8 rounded-2xl"
          style={{
            background: "white",
            boxShadow:  "0 10px 40px rgba(0,0,0,0.08)",
            border:     "1px solid rgba(0,0,0,0.06)",
          }}
        >
          <form onSubmit={handleRegister} className="flex flex-col gap-4">

            {/* Name */}
            <div className="relative">
              <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2"
                   style={{ color: "#9CA3AF" }} />
              <input
                type="text"
                name="name"
                placeholder="Full name *"
                value={form.name}
                onChange={handleChange}
                style={inputStyle()}
              />
            </div>

            {/* Email */}
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2"
                   style={{ color: "#9CA3AF" }} />
              <input
                type="email"
                name="email"
                placeholder="Email address *"
                value={form.email}
                onChange={handleChange}
                style={inputStyle()}
              />
            </div>

            {/* Phone */}
            <div className="relative">
              <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2"
                     style={{ color: "#9CA3AF" }} />
              <input
                type="tel"
                name="phone"
                placeholder="Phone number (optional)"
                value={form.phone}
                onChange={handleChange}
                style={inputStyle()}
              />
            </div>

            {/* Password */}
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2"
                   style={{ color: "#9CA3AF" }} />
              <input
                type={showPass ? "text" : "password"}
                name="password"
                placeholder="Password (min 6 characters) *"
                value={form.password}
                onChange={handleChange}
                style={{ ...inputStyle(), paddingRight: "44px" }}
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
              {loading ? "Creating account..." : (
                <>Create Account <ArrowRight size={16} /></>
              )}
            </motion.button>
          </form>

          <p className="text-center text-sm mt-5" style={{ color: "#6B7280" }}>
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-bold hover:opacity-80"
              style={{ color: "#F97316" }}
            >
              Sign In
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
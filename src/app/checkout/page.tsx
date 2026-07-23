"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, User, Phone, Mail, MapPin,
  CreditCard, Truck, Building2, Smartphone, CheckCircle,
} from "lucide-react";
import { useCartStore } from "../../store/cartStore";
import type { CartStore } from "../../store/cartStore";
import toast from "react-hot-toast";

interface FormData {
  name:          string;
  phone:         string;
  email:         string;
  houseNo:       string;
  streetNo:      string;
  area:          string;
  instructions:  string;
  paymentMethod: "cash" | "bank" | "jazzcash" | "easypaisa";
}

interface FormErrors {
  name?:     string;
  phone?:    string;
  houseNo?:  string;
  streetNo?: string;
}

const PAYMENT_METHODS = [
  {
    id:    "cash",
    label: "Cash on Delivery",
    desc:  "Pay when your order arrives",
    icon:  Truck,
    color: "#16A34A",
  },
  {
    id:    "bank",
    label: "Bank Transfer",
    desc:  "Transfer to our bank account",
    icon:  Building2,
    color: "#2563EB",
  },
  {
    id:    "jazzcash",
    label: "JazzCash",
    desc:  "Pay via JazzCash mobile wallet",
    icon:  Smartphone,
    color: "#DC2626",
  },
  {
    id:    "easypaisa",
    label: "EasyPaisa",
    desc:  "Pay via EasyPaisa mobile wallet",
    icon:  Smartphone,
    color: "#059669",
  },
] as const;

export default function CheckoutPage() {
  const router     = useRouter();
  const items      = useCartStore((s: CartStore) => s.items);
  const totalPrice = useCartStore((s: CartStore) => s.totalPrice());
  const clearCart  = useCartStore((s: CartStore) => s.clearCart);

  // ── No delivery charge or tax ──
  const GRAND_TOTAL = totalPrice;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name:          "",
    phone:         "",
    email:         "",
    houseNo:       "",
    streetNo:      "",
    area:          "",
    instructions:  "",
    paymentMethod: "cash",
  });
  const [errors, setErrors] = useState<FormErrors>({});

  // Empty cart redirect
  if (items.length === 0) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center"
        style={{ background: "#f9fafb", paddingTop: "80px" }}
      >
        <div className="text-center">
          <div className="text-7xl mb-4">🛒</div>
          <h2 className="text-xl font-bold mb-4" style={{ color: "#1F2937" }}>
            Your cart is empty!
          </h2>
          <Link
            href="/menu"
            className="px-6 py-3 rounded-xl font-bold text-white inline-block"
            style={{ background: "#F97316" }}
          >
            Go to Menu
          </Link>
        </div>
      </div>
    );
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.name.trim())
      newErrors.name = "Name is required";
    if (!formData.phone.trim())
      newErrors.phone = "Phone number is required";
    else if (!/^[0-9+\-\s]{10,15}$/.test(formData.phone))
      newErrors.phone = "Enter a valid phone number";
    if (!formData.houseNo.trim())
      newErrors.houseNo = "House number is required";
    if (!formData.streetNo.trim())
      newErrors.streetNo = "Street number is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/orders", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: {
            name:    formData.name,
            phone:   formData.phone,
            email:   formData.email,
            address: `House ${formData.houseNo}, Street ${formData.streetNo}`,
            city:    "Karachi",
            area:    formData.area,
          },
          items,
          paymentMethod:  formData.paymentMethod,
          instructions:   formData.instructions,
          deliveryCharge: 0,
          totalAmount:    GRAND_TOTAL,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Order failed");

      // ── Open WhatsApp with order details ──
      if (data.whatsappLink) {
        window.open(data.whatsappLink, "_blank");
      }

      clearCart();
      toast.success("Order placed! Opening WhatsApp... 📱");
      router.push(`/order-summary/${data.orderNumber}`);

    } catch (error) {
      console.error("Order error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputStyle = {
    width:        "100%",
    padding:      "12px 16px",
    borderRadius: "12px",
    border:       "1.5px solid rgba(0,0,0,0.1)",
    background:   "white",
    color:        "#1F2937",
    fontSize:     "14px",
    outline:      "none",
  };

  const errorStyle = {
    color:     "#EF4444",
    fontSize:  "12px",
    marginTop: "4px",
  };

  const labelStyle = {
    display:       "block",
    fontSize:      "12px",
    fontWeight:    "600" as const,
    color:         "#374151",
    marginBottom:  "6px",
    letterSpacing: "0.05em",
    textTransform: "uppercase" as const,
  };

  return (
     <div
      className="min-h-screen"
      style={{ background: "#f9fafb", paddingTop: "80px" }}
    >
      <div
        style={{
          maxWidth:  "1100px",
          margin:    "0 auto",
          padding:   "40px 32px",
        }}
      >

        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Link
            href="/cart"
            className="inline-flex items-center gap-2 text-sm font-medium mb-4"
            style={{ color: "#F97316" }}
          >
            <ArrowLeft size={16} />
            Back to Cart
          </Link>
          <h1 className="text-3xl font-bold" style={{ color: "#1F2937" }}>
            Checkout
          </h1>
          <p className="text-sm mt-1" style={{ color: "#6B7280" }}>
            Fill in your details to complete the order
          </p>
        </motion.div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* ── LEFT: Form ── */}
            <div className="lg:col-span-2 flex flex-col gap-6">

              {/* Personal Details */}
              <motion.div
                className="p-6 rounded-2xl"
                style={{
                  padding: "20px",
                  background: "white",
                  border: "1px solid rgba(0,0,0,0.07)",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="flex items-center gap-2 mb-5">
                  <User size={18} style={{ color: "#F97316" }} />
                  <h2 className="font-bold text-lg" style={{ color: "#1F2937" }}>
                    Personal Details
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Name */}
                  <div>
                    <label style={labelStyle}>
                      Full Name <span style={{ color: "#EF4444" }}>*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Ahmed Khan"
                      style={{
                        ...inputStyle,
                        borderColor: errors.name ? "#EF4444" : "rgba(0,0,0,0.1)",
                      }}
                    />
                    {errors.name && <p style={errorStyle}>{errors.name}</p>}
                  </div>

                  {/* Phone */}
                  <div>
                    <label style={labelStyle}>
                      Phone Number <span style={{ color: "#EF4444" }}>*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="0300-1234567"
                      style={{
                        ...inputStyle,
                        borderColor: errors.phone ? "#EF4444" : "rgba(0,0,0,0.1)",
                      }}
                    />
                    {errors.phone && <p style={errorStyle}>{errors.phone}</p>}
                  </div>

                  {/* Email */}
                  <div className="md:col-span-2">
                    <label style={labelStyle}>
                      Email Address
                      <span className="ml-2 font-normal normal-case"
                            style={{ color: "#9CA3AF" }}>
                        (optional)
                      </span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="ahmed@email.com"
                      style={inputStyle}
                    />
                  </div>
                </div>
              </motion.div>

              {/* Delivery Address */}
              <motion.div
                className="p-6 rounded-2xl"
                style={{
                  padding: "20px",
                  background: "white",
                  border: "1px solid rgba(0,0,0,0.07)",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-center gap-2 mb-5">
                  <MapPin size={18} style={{ color: "#F97316" }} />
                  <h2 className="font-bold text-lg" style={{ color: "#1F2937" }}>
                    Delivery Address
                  </h2>
                </div>

                {/* Fixed Karachi badge */}
                <div
                  className="flex items-center gap-3 px-4 py-3 rounded-xl mb-4"
                  style={{
                    padding: "12px 16px",
                    background: "rgba(249,115,22,0.06)",
                    border: "1.5px solid rgba(249,115,22,0.2)",
                  }}
                >
                  <MapPin size={16} style={{ color: "#F97316" }} />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider"
                       style={{ color: "#9CA3AF" }}>
                      Delivering in
                    </p>
                    <p className="font-bold" style={{ color: "#F97316" }}>
                      Karachi only
                    </p>
                  </div>
                  <div
                    className="min-w-14 px-3 py-3 rounded-full text-xs font-bold"
                    style={{padding: "2px 6px", background: "#F97316", color: "white" }}
                  >
                    ✓  Fixed
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* House No */}
                  <div>
                    <label style={labelStyle}>
                      House / Flat No. <span style={{ color: "#EF4444" }}>*</span>
                    </label>
                    <input
                      type="text"
                      name="houseNo"
                      value={formData.houseNo}
                      onChange={handleChange}
                      placeholder="e.g. A-12 or Flat 3B"
                      style={{
                        ...inputStyle,
                        borderColor: errors.houseNo ? "#EF4444" : "rgba(0,0,0,0.1)",
                      }}
                    />
                    {errors.houseNo && <p style={errorStyle}>{errors.houseNo}</p>}
                  </div>

                  {/* Street No */}
                  <div>
                    <label style={labelStyle}>
                      Street / Gali No. <span style={{ color: "#EF4444" }}>*</span>
                    </label>
                    <input
                      type="text"
                      name="streetNo"
                      value={formData.streetNo}
                      onChange={handleChange}
                      placeholder="e.g. Street 5 or Gali 3"
                      style={{
                        ...inputStyle,
                        borderColor: errors.streetNo ? "#EF4444" : "rgba(0,0,0,0.1)",
                      }}
                    />
                    {errors.streetNo && <p style={errorStyle}>{errors.streetNo}</p>}
                  </div>

                  {/* Area */}
                  <div className="md:col-span-2">
                    <label style={labelStyle}>
                      Area / Sector
                      <span className="ml-2 font-normal normal-case"
                            style={{ color: "#9CA3AF" }}>
                        (optional)
                      </span>
                    </label>
                    <input
                      type="text"
                      name="area"
                      value={formData.area}
                      onChange={handleChange}
                      placeholder="e.g. DHA Phase 6, Gulshan Block 3, Clifton..."
                      style={inputStyle}
                    />
                  </div>

                  {/* Instructions */}
                  <div className="md:col-span-2">
                    <label style={labelStyle}>
                      Delivery Instructions
                      <span className="ml-2 font-normal normal-case"
                            style={{ color: "#9CA3AF" }}>
                        (optional)
                      </span>
                    </label>
                    <textarea
                      name="instructions"
                      value={formData.instructions}
                      onChange={handleChange}
                      placeholder="Near landmark, ring bell, call on arrival..."
                      rows={3}
                      style={{ ...inputStyle, resize: "none" }}
                    />
                  </div>
                </div>
              </motion.div>

              {/* Payment Method */}
              <motion.div
                className="p-6 rounded-2xl"
                style={{
                  padding: "20px",
                  background: "white",
                  border: "1px solid rgba(0,0,0,0.07)",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex items-center gap-2 mb-5">
                  <CreditCard size={18} style={{ color: "#F97316" }} />
                  <h2 className="font-bold text-lg" style={{ color: "#1F2937" }}>
                    Payment Method
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {PAYMENT_METHODS.map((method) => {
                    const Icon       = method.icon;
                    const isSelected = formData.paymentMethod === method.id;
                    return (
                      <motion.button
                        key={method.id}
                        type="button"
                        onClick={() =>
                          setFormData((p) => ({
                            ...p,
                            paymentMethod: method.id as FormData["paymentMethod"],
                          }))
                        }
                        className="flex items-center gap-3 p-4 rounded-xl border-2 text-left"
                        style={{
                          borderColor: isSelected ? "#F97316" : "rgba(0,0,0,0.08)",
                          background:  isSelected ? "rgba(249,115,22,0.05)" : "white",
                        }}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                      >
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                          style={{ background: `${method.color}15` }}
                        >
                          <Icon size={18} style={{ color: method.color }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm"
                             style={{ color: isSelected ? "#F97316" : "#1F2937" }}>
                            {method.label}
                          </p>
                          <p className="text-xs mt-0.5" style={{ color: "#9CA3AF" }}>
                            {method.desc}
                          </p>
                        </div>
                        {isSelected && (
                          <CheckCircle size={18} style={{ color: "#F97316", flexShrink: 0 }} />
                        )}
                      </motion.button>
                    );
                  })}
                </div>

                {/* Payment details */}
                <AnimatePresence mode="wait">
                  {formData.paymentMethod !== "cash" && (
                    <motion.div
                      key={formData.paymentMethod}
                      className="mt-4 p-4 rounded-xl text-sm"
                      style={{
                        background: "rgba(249,115,22,0.06)",
                        border:     "1px solid rgba(249,115,22,0.15)",
                        color:      "#92400E",
                      }}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{   opacity: 0, height: 0 }}
                    >
                      {formData.paymentMethod === "bank" && (
                        <>
                          <p className="font-bold mb-2">Bank Transfer Details:</p>
                          <p>Bank: Meezan Bank</p>
                          <p>Account: Your Account Number</p>
                          <p>Title: Mama Soups</p>
                          <p className="mt-2 text-xs" style={{ color: "#9CA3AF" }}>
                            Send screenshot to our WhatsApp after placing order.
                          </p>
                        </>
                      )}
                      {formData.paymentMethod === "jazzcash" && (
                        <>
                          <p className="font-bold mb-2">JazzCash Details:</p>
                          <p>Number: 0333-2287497</p>
                          <p>Name: Mama Soups</p>
                          <p className="mt-2 text-xs" style={{ color: "#9CA3AF" }}>
                            Send screenshot to our WhatsApp after placing order.
                          </p>
                        </>
                      )}
                      {formData.paymentMethod === "easypaisa" && (
                        <>
                          <p className="font-bold mb-2">EasyPaisa Details:</p>
                          <p>Number: 0333-2287497</p>
                          <p>Name: Mama Soups</p>
                          <p className="mt-2 text-xs" style={{ color: "#9CA3AF" }}>
                            Send screenshot to our WhatsApp after placing order.
                          </p>
                        </>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>

            {/* ── RIGHT: Order Summary ── */}
            <motion.div
              className="lg:col-span-1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div
                className="rounded-2xl p-6 sticky top-24"
                style={{
                  padding: "24px",
                  background: "white",
                  border: "1px solid rgba(0,0,0,0.07)",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
                }}
              >
                <h2 className="font-bold text-lg mb-4" style={{ color: "#1F2937" }}>
                  Order Summary
                </h2>

                {/* Items */}
                <div className="flex flex-col gap-3 mb-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span style={{ color: "#6B7280" }}>
                        {item.name}
                        <span className="ml-1 text-xs">x{item.quantity}</span>
                      </span>
                      <span className="font-medium" style={{ color: "#1F2937" }}>
                        Rs.{item.price * item.quantity}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="h-px w-full my-3"
                     style={{ background: "rgba(0,0,0,0.07)" }} />

                {/* Total */}
                <div className="flex flex-col gap-2 mb-5">
                  <div className="flex justify-between text-sm">
                    <span style={{ color: "#6B7280" }}>Subtotal</span>
                    <span style={{ color: "#1F2937" }}>Rs.{totalPrice}</span>
                  </div>

                  {/* Delivery notice */}
                  <div
                    className="text-xs px-3 py-2 rounded-lg"
                    style={{
                      background: "rgba(249,115,22,0.06)",
                      color:      "#92400E",
                    }}
                  >
                    🚗 Delivery charge based on your area
                  </div>

                  <div className="h-px w-full my-1"
                       style={{ background: "rgba(0,0,0,0.07)" }} />

                  <div className="flex justify-between font-bold">
                    <span style={{ color: "#1F2937" }}>Total</span>
                    <span style={{ color: "#F97316" }}>Rs.{GRAND_TOTAL}</span>
                  </div>
                </div>

                {/* Place Order */}
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-xl font-bold text-white flex items-center justify-center gap-2"
                  style={{
                    background: isSubmitting
                      ? "#9CA3AF"
                      : "linear-gradient(135deg, #F97316, #EA580C)",
                    boxShadow: isSubmitting
                      ? "none"
                      : "0 4px 20px rgba(249,115,22,0.35)",
                    cursor: isSubmitting ? "not-allowed" : "pointer",
                  }}
                  whileHover={!isSubmitting ? { scale: 1.02 } : {}}
                  whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                >
                  {isSubmitting ? (
                    <>
                      <motion.div
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                      Placing Order...
                    </>
                  ) : (
                    <>
                      <CheckCircle size={18} />
                      Place Order
                    </>
                  )}
                </motion.button>

              </div>
            </motion.div>
          </div>
        </form>
      </div>
    </div>
  );
}
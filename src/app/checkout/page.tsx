"use client";

import { useState, useEffect } from "react";
import type { CSSProperties, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, User, MapPin,
  CreditCard, Truck, Building2, Smartphone, CheckCircle,
} from "lucide-react";
import { useCartStore } from "../../store/cartStore";
import type { CartStore } from "../../store/cartStore";
import toast from "react-hot-toast";
import { pageStyle, glass } from "../../lib/theme";

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
  area?:     string;
}

interface DeliveryArea {
  id:             number;
  name:           string;
  deliveryCharge: number;
}

const PAYMENT_METHODS = [
  { id: "cash",      label: "Cash on Delivery", desc: "Pay when your order arrives",    icon: Truck,      color: "#16A34A" },
  { id: "bank",      label: "Bank Transfer",    desc: "Transfer to our bank account",   icon: Building2,  color: "#2563EB" },
  { id: "jazzcash",  label: "JazzCash",         desc: "Pay via JazzCash mobile wallet", icon: Smartphone, color: "#DC2626" },
  { id: "easypaisa", label: "EasyPaisa",        desc: "Pay via EasyPaisa mobile wallet", icon: Smartphone, color: "#059669" },
] as const;

// ── Small reusable pieces (kept OUTSIDE the main component) ──

function Card({
  title,
  icon,
  children,
}: {
  title:    string;
  icon:     ReactNode;
  children: ReactNode;
}) {
  return (
    <div style={{ ...glass, padding: "26px" }}>
      <div
        style={{
          display:      "flex",
          alignItems:   "center",
          gap:          "10px",
          marginBottom: "20px",
        }}
      >
        {icon}
        <h2 style={{ fontSize: "20px", fontWeight: 500, color: "#171717" }}>
          {title}
        </h2>
      </div>
      {children}
    </div>
  );
}

function Field({
  label,
  required,
  optional,
  error,
  full,
  children,
}: {
  label:     string;
  required?: boolean;
  optional?: boolean;
  error?:    string;
  full?:     boolean;
  children:  ReactNode;
}) {
  return (
    <div style={{ gridColumn: full ? "1 / -1" : undefined }}>
      <label
        style={{
          display:       "block",
          fontSize:      "11px",
          fontWeight:    600,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color:         "#6c5a49",
          marginBottom:  "7px",
        }}
      >
        {label}
        {required && <span style={{ color: "#dc2626" }}> *</span>}
        {optional && (
          <span
            style={{
              marginLeft:    "8px",
              fontWeight:    400,
              textTransform: "none",
              letterSpacing: 0,
              color:         "#9a9189",
            }}
          >
            (optional)
          </span>
        )}
      </label>
      {children}
      {error && (
        <p style={{ color: "#dc2626", fontSize: "12px", marginTop: "5px" }}>
          {error}
        </p>
      )}
    </div>
  );
}

const gridTwo: CSSProperties = {
  display:             "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap:                 "16px",
};

export default function CheckoutPage() {
  const router     = useRouter();
  const items      = useCartStore((s: CartStore) => s.items);
  const totalPrice = useCartStore((s: CartStore) => s.totalPrice());
  const clearCart  = useCartStore((s: CartStore) => s.clearCart);

  const [deliveryAreas,  setDeliveryAreas]  = useState<DeliveryArea[]>([]);
  const [deliveryCharge, setDeliveryCharge] = useState<number>(0);

  const GRAND_TOTAL = totalPrice + deliveryCharge;

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

  const [screenshotUrl,       setScreenshotUrl]       = useState<string>("");
  const [uploadingScreenshot, setUploadingScreenshot] = useState(false);
  const [screenshotPreview,   setScreenshotPreview]   = useState<string>("");

  useEffect(() => {
    fetch("/api/delivery-areas")
      .then((r) => r.json())
      .then((data) => setDeliveryAreas(data.areas ?? []));
  }, []);

  // ── Empty cart ──
  if (items.length === 0) {
    return (
      <main
        style={{
          ...pageStyle,
          display:        "flex",
          alignItems:     "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            ...glass,
            padding:   "48px 32px",
            textAlign: "center",
            maxWidth:  "420px",
            width:     "100%",
          }}
        >
          <div style={{ fontSize: "64px", marginBottom: "16px" }}>🛒</div>
          <h2
            style={{
              fontSize:     "24px",
              fontWeight:   500,
              color:        "#171717",
              marginBottom: "24px",
            }}
          >
            Your cart is empty!
          </h2>
          <Link
            href="/menu"
            style={{
              display:      "inline-block",
              padding:      "13px 28px",
              borderRadius: "999px",
              background:   "linear-gradient(135deg, #F97316, #EA580C)",
              color:        "white",
              fontSize:     "13px",
              fontWeight:   600,
              boxShadow:    "0 8px 22px rgba(249,115,22,0.4)",
            }}
          >
            Go to Menu
          </Link>
        </div>
      </main>
    );
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleScreenshotUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setScreenshotPreview(reader.result as string);
    reader.readAsDataURL(file);

    setUploadingScreenshot(true);
    try {
      const form = new FormData();
      form.append("file", file);

      const res  = await fetch("/api/upload-payment", {
        method: "POST",
        body:   form,
      });
      const data = await res.json();

      if (data.success) {
        setScreenshotUrl(data.screenshotUrl);
        toast.success("Screenshot uploaded! ✅");
      } else {
        toast.error("Upload failed — please try again");
        setScreenshotPreview("");
      }
    } catch {
      toast.error("Upload failed");
      setScreenshotPreview("");
    } finally {
      setUploadingScreenshot(false);
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
    if (!formData.area)
      newErrors.area = "Please select your area";
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
          screenshotUrl:  screenshotUrl || null,
          deliveryCharge: deliveryCharge,
          totalAmount:    GRAND_TOTAL,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Order failed");

      clearCart();
      toast.success("Order placed successfully! 🎉");
      router.push(`/order-summary/${data.orderNumber}`);
    } catch (error) {
      console.error("Order error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Input look (frosted, rounded) ──
  const inputStyle: CSSProperties = {
    width:        "100%",
    padding:      "12px 16px",
    borderRadius: "14px",
    border:       "1px solid rgba(137,115,95,0.3)",
    background:   "rgba(255,255,255,0.75)",
    color:        "#171717",
    fontSize:     "14px",
    outline:      "none",
  };

  const errorBorder = (hasError?: string): CSSProperties =>
    hasError ? { borderColor: "#dc2626" } : {};

  return (
    <main style={pageStyle}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>

        {/* ── Heading ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: "32px" }}
        >
          <Link
            href="/cart"
            style={{
              display:        "inline-flex",
              alignItems:     "center",
              gap:            "8px",
              padding:        "10px 20px",
              borderRadius:   "999px",
              background:     "rgba(255,255,255,0.6)",
              backdropFilter: "blur(10px)",
              fontSize:       "12px",
              fontWeight:     600,
              color:          "#6c5a49",
              marginBottom:   "22px",
            }}
          >
            <ArrowLeft size={14} />
            Back to Cart
          </Link>
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
            Almost there
          </p>
          <h1
            style={{
              fontSize:      "40px",
              fontWeight:    500,
              letterSpacing: "-1px",
              color:         "#171717",
            }}
          >
            Checkout
          </h1>
          <p style={{ fontSize: "13px", color: "#4a4640", marginTop: "6px" }}>
            Fill in your details to complete the order
          </p>
        </motion.div>

        <form onSubmit={handleSubmit}>
          <div
            style={{
              display:    "flex",
              flexWrap:   "wrap",
              gap:        "24px",
              alignItems: "flex-start",
            }}
          >

            {/* ════════ LEFT: form cards ════════ */}
            <div
              style={{
                flex:          "2 1 480px",
                minWidth:      0,
                display:       "flex",
                flexDirection: "column",
                gap:           "24px",
              }}
            >

              {/* Personal details */}
              <Card
                title="Personal Details"
                icon={<User size={19} style={{ color: "#F97316" }} />}
              >
                <div style={gridTwo}>
                  <Field label="Full Name" required error={errors.name}>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Ahmed Khan"
                      style={{ ...inputStyle, ...errorBorder(errors.name) }}
                    />
                  </Field>

                  <Field label="Phone Number" required error={errors.phone}>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="0300-1234567"
                      style={{ ...inputStyle, ...errorBorder(errors.phone) }}
                    />
                  </Field>

                  <Field label="Email Address" optional full>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="ahmed@email.com"
                      style={inputStyle}
                    />
                  </Field>
                </div>
              </Card>

              {/* Delivery address */}
              <Card
                title="Delivery Address"
                icon={<MapPin size={19} style={{ color: "#F97316" }} />}
              >
                {/* Karachi badge */}
                <div
                  style={{
                    display:      "flex",
                    alignItems:   "center",
                    gap:          "12px",
                    padding:      "12px 16px",
                    borderRadius: "16px",
                    background:   "rgba(198,129,41,0.1)",
                    border:       "1px solid rgba(198,129,41,0.25)",
                    marginBottom: "18px",
                  }}
                >
                  <MapPin size={16} style={{ color: "#F97316" }} />
                  <div style={{ flex: 1 }}>
                    <p
                      style={{
                        fontSize:      "10px",
                        fontWeight:    600,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color:         "#9a9189",
                      }}
                    >
                      Delivering in
                    </p>
                    <p style={{ fontSize: "14px", fontWeight: 700, color: "#F97316" }}>
                      Karachi only
                    </p>
                  </div>
                  <span
                    style={{
                      padding:      "3px 10px",
                      borderRadius: "999px",
                      background:   "#F97316",
                      color:        "white",
                      fontSize:     "11px",
                      fontWeight:   700,
                    }}
                  >
                    ✓ Fixed
                  </span>
                </div>

                <div style={gridTwo}>
                  <Field label="House / Flat No." required error={errors.houseNo}>
                    <input
                      type="text"
                      name="houseNo"
                      value={formData.houseNo}
                      onChange={handleChange}
                      placeholder="e.g. A-12 or Flat 3B"
                      style={{ ...inputStyle, ...errorBorder(errors.houseNo) }}
                    />
                  </Field>

                  <Field label="Street / Gali No." required error={errors.streetNo}>
                    <input
                      type="text"
                      name="streetNo"
                      value={formData.streetNo}
                      onChange={handleChange}
                      placeholder="e.g. Street 5 or Gali 3"
                      style={{ ...inputStyle, ...errorBorder(errors.streetNo) }}
                    />
                  </Field>

                  <Field label="Area" required error={errors.area} full>
                    <select
                      name="area"
                      value={formData.area}
                      onChange={(e) => {
                        const selected = deliveryAreas.find(
                          (a) => a.name === e.target.value
                        );
                        setDeliveryCharge(selected?.deliveryCharge ?? 0);
                        handleChange(e);
                      }}
                      style={{
                        ...inputStyle,
                        ...errorBorder(errors.area),
                        cursor: "pointer",
                        color:  formData.area ? "#171717" : "#9a9189",
                      }}
                    >
                      <option value="" disabled>
                        Select area
                      </option>
                      {deliveryAreas.map((area) => (
                        <option key={area.id} value={area.name}>
                          {area.name} — Rs.{area.deliveryCharge} delivery
                        </option>
                      ))}
                    </select>
                  </Field>

                  <Field label="Delivery Instructions" optional full>
                    <textarea
                      name="instructions"
                      value={formData.instructions}
                      onChange={handleChange}
                      placeholder="Near landmark, ring bell, call on arrival..."
                      rows={3}
                      style={{ ...inputStyle, resize: "none" }}
                    />
                  </Field>
                </div>
              </Card>

              {/* Payment method */}
              <Card
                title="Payment Method"
                icon={<CreditCard size={19} style={{ color: "#F97316" }} />}
              >
                <div
                  style={{
                    display:             "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
                    gap:                 "12px",
                  }}
                >
                  {PAYMENT_METHODS.map((method) => {
                    const Icon       = method.icon;
                    const isSelected = formData.paymentMethod === method.id;
                    return (
                      <button
                        key={method.id}
                        type="button"
                        onClick={() =>
                          setFormData((p) => ({
                            ...p,
                            paymentMethod: method.id as FormData["paymentMethod"],
                          }))
                        }
                        style={{
                          display:      "flex",
                          alignItems:   "center",
                          gap:          "12px",
                          padding:      "14px",
                          borderRadius: "20px",
                          textAlign:    "left",
                          cursor:       "pointer",
                          background:   isSelected
                            ? "rgba(255,255,255,0.95)"
                            : "rgba(255,255,255,0.45)",
                          border: isSelected
                            ? "1.5px solid #F97316"
                            : "1.5px solid transparent",
                          boxShadow: isSelected
                            ? "0 8px 20px rgba(249,115,22,0.18)"
                            : "none",
                        }}
                      >
                        <span
                          style={{
                            width:          "42px",
                            height:         "42px",
                            borderRadius:   "12px",
                            display:        "flex",
                            alignItems:     "center",
                            justifyContent: "center",
                            flexShrink:     0,
                            background:     `${method.color}18`,
                          }}
                        >
                          <Icon size={19} style={{ color: method.color }} />
                        </span>
                        <span style={{ flex: 1, minWidth: 0 }}>
                          <span
                            style={{
                              display:    "block",
                              fontSize:   "13px",
                              fontWeight: 600,
                              color:      isSelected ? "#F97316" : "#222",
                            }}
                          >
                            {method.label}
                          </span>
                          <span
                            style={{
                              display:   "block",
                              marginTop: "2px",
                              fontSize:  "11px",
                              color:     "#9a9189",
                            }}
                          >
                            {method.desc}
                          </span>
                        </span>
                        {isSelected && (
                          <CheckCircle
                            size={18}
                            style={{ color: "#F97316", flexShrink: 0 }}
                          />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Account details + screenshot upload */}
                <AnimatePresence mode="wait">
                  {formData.paymentMethod !== "cash" && (
                    <motion.div
                      key={formData.paymentMethod}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      style={{
                        marginTop:    "18px",
                        borderRadius: "20px",
                        overflow:     "hidden",
                        background:   "rgba(249,115,22,0.1)",
                        border:       "1px solid rgba(249,115,22,0.25)",
                      }}
                    >
                      <div
                        style={{
                          padding:    "16px 18px",
                          fontSize:   "13px",
                          lineHeight: 1.7,
                          color:      "#7a5320",
                        }}
                      >
                        {formData.paymentMethod === "bank" && (
                          <>
                            <p style={{ fontWeight: 700, marginBottom: "4px" }}>
                              Bank Transfer Details:
                            </p>
                            <p>Bank: JS Bank</p>
                            <p>Account: 228576</p>
                            <p>Title: Taha Saifuddin</p>
                          </>
                        )}
                        {formData.paymentMethod === "jazzcash" && (
                          <>
                            <p style={{ fontWeight: 700, marginBottom: "4px" }}>
                              JazzCash Details:
                            </p>
                            <p>Number: 0333-2287497</p>
                            <p>Name: Taha Saifuddin</p>
                          </>
                        )}
                        {formData.paymentMethod === "easypaisa" && (
                          <>
                            <p style={{ fontWeight: 700, marginBottom: "4px" }}>
                              EasyPaisa Details:
                            </p>
                            <p>Number: 0333-2287497</p>
                            <p>Name: Taha Saifuddin</p>
                          </>
                        )}
                      </div>

                      <div
                        style={{
                          padding:   "16px 18px",
                          borderTop: "1px solid rgba(249,115,22,0.25)",
                        }}
                      >
                        <p
                          style={{
                            fontSize:     "13px",
                            fontWeight:   700,
                            color:        "#7a5320",
                            marginBottom: "12px",
                          }}
                        >
                          📸 Upload Payment Screenshot
                        </p>

                        {!screenshotPreview ? (
                          <label
                            style={{
                              display:        "flex",
                              flexDirection:  "column",
                              alignItems:     "center",
                              justifyContent: "center",
                              gap:            "6px",
                              width:          "100%",
                              padding:        "26px 12px",
                              borderRadius:   "18px",
                              border:         "2px dashed rgba(249,115,22,0.5)",
                              background:     "rgba(255,255,255,0.45)",
                              cursor:         "pointer",
                            }}
                          >
                            <span style={{ fontSize: "30px" }}>📷</span>
                            <span
                              style={{
                                fontSize:   "12px",
                                fontWeight: 600,
                                color:      "#F97316",
                              }}
                            >
                              {uploadingScreenshot
                                ? "Uploading..."
                                : "Tap to upload payment screenshot"}
                            </span>
                            <span style={{ fontSize: "11px", color: "#9a9189" }}>
                              JPG, PNG or screenshot
                            </span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleScreenshotUpload}
                              disabled={uploadingScreenshot}
                              style={{ display: "none" }}
                            />
                          </label>
                        ) : (
                          <div
                            style={{
                              position:     "relative",
                              width:        "100%",
                              borderRadius: "18px",
                              overflow:     "hidden",
                              border:       "2px solid rgba(249,115,22,0.4)",
                              background:   "white",
                            }}
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={screenshotPreview}
                              alt="Payment screenshot"
                              style={{
                                width:     "100%",
                                maxHeight: "220px",
                                objectFit: "contain",
                                display:   "block",
                              }}
                            />
                            <span
                              style={{
                                position:     "absolute",
                                top:          "8px",
                                right:        "8px",
                                padding:      "4px 10px",
                                borderRadius: "10px",
                                fontSize:     "11px",
                                fontWeight:   700,
                                color:        "white",
                                background:   screenshotUrl
                                  ? "rgba(16,185,129,0.92)"
                                  : "rgba(249,115,22,0.92)",
                              }}
                            >
                              {screenshotUrl
                                ? "✅ Uploaded"
                                : uploadingScreenshot
                                  ? "⏳ Uploading..."
                                  : "❌ Failed"}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                setScreenshotPreview("");
                                setScreenshotUrl("");
                              }}
                              aria-label="Remove screenshot"
                              style={{
                                position:       "absolute",
                                top:            "8px",
                                left:           "8px",
                                width:          "28px",
                                height:         "28px",
                                borderRadius:   "50%",
                                border:         "none",
                                background:     "rgba(220,38,38,0.9)",
                                color:          "white",
                                fontSize:       "12px",
                                fontWeight:     700,
                                cursor:         "pointer",
                              }}
                            >
                              ✕
                            </button>
                          </div>
                        )}

                        <p
                          style={{
                            marginTop: "10px",
                            fontSize:  "12px",
                            color:     "#2f7d4f",
                          }}
                        >
                          Upload your payment screenshot so we can verify your
                          order quickly.
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            </div>

            {/* ════════ RIGHT: order summary ════════ */}
            <motion.aside
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              style={{
                ...glass,
                flex:     "1 1 320px",
                minWidth: 0,
                padding:  "28px",
                position: "sticky",
                top:      "110px",
              }}
            >
              <h2
                style={{
                  fontSize:     "20px",
                  fontWeight:   500,
                  color:        "#171717",
                  marginBottom: "18px",
                }}
              >
                Order Summary
              </h2>

              {/* Items */}
              <div
                style={{
                  display:       "flex",
                  flexDirection: "column",
                  gap:           "10px",
                  marginBottom:  "16px",
                }}
              >
                {items.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      display:        "flex",
                      justifyContent: "space-between",
                      gap:            "12px",
                      fontSize:       "13px",
                    }}
                  >
                    <span style={{ color: "#4a4640" }}>
                      {item.name}
                      <span
                        style={{
                          marginLeft: "6px",
                          fontSize:   "11px",
                          color:      "#9a9189",
                        }}
                      >
                        ×{item.quantity}
                      </span>
                    </span>
                    <span style={{ fontWeight: 600, color: "#222", whiteSpace: "nowrap" }}>
                      Rs.{item.price * item.quantity}
                    </span>
                  </div>
                ))}
              </div>

              <div
                style={{
                  height:       "1px",
                  background:   "rgba(137,115,95,0.25)",
                  marginBottom: "16px",
                }}
              />

              {/* Subtotal + delivery */}
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
                <span style={{ color: "#222" }}>Rs.{totalPrice}</span>
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
                <span>
                  Delivery
                  {formData.area && (
                    <span style={{ marginLeft: "6px", fontSize: "11px" }}>
                      ({formData.area})
                    </span>
                  )}
                </span>
                <span style={{ color: "#222" }}>
                  {deliveryCharge > 0 ? (
                    `Rs.${deliveryCharge}`
                  ) : (
                    <span style={{ color: "#9a9189" }}>Select area</span>
                  )}
                </span>
              </div>

              <div
                style={{
                  height:       "1px",
                  background:   "rgba(137,115,95,0.25)",
                  marginBottom: "16px",
                }}
              />

              <div
                style={{
                  display:        "flex",
                  justifyContent: "space-between",
                  alignItems:     "baseline",
                  marginBottom:   "24px",
                }}
              >
                <span style={{ fontSize: "16px", fontWeight: 600, color: "#171717" }}>
                  Total
                </span>
                <span style={{ fontSize: "24px", fontWeight: 700, color: "#F97316" }}>
                  Rs.{GRAND_TOTAL}
                </span>
              </div>

              {/* Place order */}
              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={!isSubmitting ? { scale: 1.02 } : {}}
                whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                style={{
                  width:          "100%",
                  padding:        "15px",
                  borderRadius:   "999px",
                  border:         "none",
                  display:        "flex",
                  alignItems:     "center",
                  justifyContent: "center",
                  gap:            "10px",
                  fontSize:       "13px",
                  fontWeight:     700,
                  letterSpacing:  "0.1em",
                  textTransform:  "uppercase",
                  color:          "white",
                  cursor:         isSubmitting ? "not-allowed" : "pointer",
                  background:     isSubmitting
                    ? "#b8b0a6"
                    : "linear-gradient(135deg, #F97316, #EA580C)",
                  boxShadow:      isSubmitting
                    ? "none"
                    : "0 8px 22px rgba(249,115,22,0.4)",
                }}
              >
                {isSubmitting ? (
                  <>
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      style={{
                        width:        "18px",
                        height:       "18px",
                        borderRadius: "50%",
                        border:       "2px solid white",
                        borderTopColor: "transparent",
                        display:      "inline-block",
                      }}
                    />
                    Placing Order...
                  </>
                ) : (
                  <>
                    <CheckCircle size={17} />
                    Place Order
                  </>
                )}
              </motion.button>
            </motion.aside>
          </div>
        </form>
      </div>
    </main>
  );
}
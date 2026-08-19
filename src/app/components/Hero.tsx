"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Clock, MapPin, Star, ChevronDown } from "lucide-react";

interface DeliveryArea {
  id:             number;
  name:           string;
  deliveryCharge: number;
}

const FOOD_CARDS = [
  {
    emoji:       "🍜",
    title:       "Chicken Corn Soup",
    desc:        "Hot & hearty, 2 sizes",
    highlighted: true,
  },
  {
    emoji:       "🍟",
    title:       "7 Flavored Fries",
    desc:        "Crispy, loaded toppings",
    highlighted: false,
  },
  {
    emoji:       "🥙",
    title:       "Pani Puri / Meethi Puri",
    desc:        "Fresh & tangy street style",
    highlighted: false,
  },
];

export default function Hero() {
  const [areas,        setAreas]        = useState<DeliveryArea[]>([]);
  const [selectedArea, setSelectedArea] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
 

  useEffect(() => {
    fetch("/api/delivery-areas")
      .then((r) => r.json())
      .then((data) => setAreas(data.areas ?? []));
  }, []);

  return (
    <section
      className="w-full overflow-hidden"
      style={{
        background:    "linear-gradient(135deg, #fff7ed 0%, #ffffff 50%, #fff7ed 100%)",
        paddingTop:    "80px",
        paddingBottom: "40px",
      }}
    >
      <div className="w-full max-w-7xl mx-auto px-4">

       

        {/* ── Timing Bar ── */}
        <motion.div
          className="w-full flex flex-wrap items-center justify-center gap-x-4 gap-y-2 px-4 py-3 rounded-2xl mb-6"
          style={{
            padding:  "2px 4px",
            background: "rgba(249,115,22,0.06)",
            border:     "1px solid rgba(249,115,22,0.2)",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-1.5 text-xs font-medium"
               style={{ color: "#F97316" }}>
            <Clock size={14} />
            <span>Mon–Sat: 5:00 PM – 10:30 PM</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-medium"
               style={{ color: "#dc2626" }}>
            <span>🚫 Sundays: Closed</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-medium"
               style={{ color: "#16a34a" }}>
            <MapPin size={14} />
            <span>Delivering within 8km</span>
          </div>
          <a
            href="https://maps.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs font-medium"
            style={{ color: "#F97316" }}
          >
            <Star size={12} />
            Find us on Google Maps
          </a>
        </motion.div>

        {/* ── Main Content ── */}
        <div className="flex flex-col items-center gap-8 lg:grid lg:grid-cols-3 lg:gap-10 lg:items-center">

          {/* CENTER: Soup Bowl — shows first on mobile */}
          <div className="flex items-center justify-center order-1 lg:order-2 w-full">
            <motion.div
              className="relative flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              {/* Glow */}
              <div
                className="absolute rounded-full"
                style={{
                  width:      "280px",
                  height:     "280px",
                  background: "radial-gradient(circle, rgba(249,115,22,0.2) 0%, transparent 70%)",
                }}
              />

              {/* Bowl image */}
              <div
                className="relative rounded-full overflow-hidden"
                style={{ width: "220px", height: "220px" }}
              >
                <Image
                  src="/images/soup.jpg"
                  alt="Mama Soups"
                  fill
                  sizes="220px"
                  className="object-cover"
                  priority
                />
                <div
                  className="absolute inset-0 rounded-full pointer-events-none"
                  style={{
                    background: "radial-gradient(ellipse at 30% 20%, rgba(255,255,255,0.12) 0%, transparent 45%)",
                    boxShadow:  "inset 0 0 0 4px rgba(249,115,22,0.15)",
                  }}
                />
              </div>
            </motion.div>
          </div>

          {/* LEFT: Text + Area Selector */}
          <div className="flex flex-col gap-5 order-2 lg:order-1 w-full text-center lg:text-left">
            <motion.h1
              className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight"
              style={{ color: "#1F2937" }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              TASTE THE SOUL
              <br />
              <span style={{ color: "#F97316" }}>IN EVERY SPOON</span>
            </motion.h1>

            <motion.p
              className="text-sm leading-relaxed mx-auto lg:mx-0 max-w-xs"
              style={{ color: "#6B7280" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Hot soups, crispy fries & fresh puris — delivered
              straight to your door within 8km of our location.
            </motion.p>

            {/* Area Selector */}
            <motion.div
              className="w-full"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <p className="text-xs font-semibold uppercase tracking-wider mb-2 text-left"
                 style={{ color: "#9CA3AF" }}>
                Select Your Area
              </p>
              <div className="relative w-full">
                <button
                  onClick={() => setShowDropdown((s) => !s)}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 text-sm font-medium"
                  style={{
                    borderColor: selectedArea ? "#F97316" : "rgba(0,0,0,0.12)",
                    background:  selectedArea ? "rgba(249,115,22,0.04)" : "white",
                    color:       selectedArea ? "#F97316" : "#9CA3AF",
                  }}
                >
                  <div className="flex items-center gap-2">
                    <MapPin size={15} style={{ color: "#F97316" }} />
                    {selectedArea || "Choose your area..."}
                  </div>
                  <ChevronDown
                    size={15}
                    style={{
                      color:     "#F97316",
                      transform: showDropdown ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform 0.2s",
                    }}
                  />
                </button>

                <AnimatePresence>
                  {showDropdown && (
                    <motion.div
                      className=" absolute left-0 right-0 mt-1 rounded-xl overflow-auto z-100"
                      style={{
                        padding:    "4px 4px",
                        background: "white",
                        border:     "1px solid rgba(0,0,0,0.1)",
                        boxShadow:  "0 8px 32px rgba(0,0,0,0.12)",
                        maxHeight:  "180px",
                        top:        "100%",
                      }}
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0  }}
                      exit={{   opacity: 0, y: -8  }}
                    >
                      {areas.map((area) => (
                        <button
                          key={area.id}
                          className="w-full text-left px-4 py-2.5 text-sm flex justify-between items-center hover:bg-orange-50"
                          style={{padding: "2px 4px",  color: "#1F2937" }}
                          onClick={() => {
                            setSelectedArea(area.name);
                            setShowDropdown(false);
                          }}
                        >
                          <span>{area.name}</span>
                          <span className="text-xs" style={{ color: "#F97316" }}>
                            Rs.{area.deliveryCharge}
                          </span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {selectedArea && (
                <motion.p
                  className="text-xs mt-2 flex items-center gap-1"
                  style={{ color: "#16a34a" }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  ✅ We deliver to {selectedArea}!
                </motion.p>
              )}
            </motion.div>

            {/* Buttons */}
            <motion.div
              className="flex flex-wrap gap-3 justify-center lg:justify-start"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Link
                href="/menu"
                className="px-8 py-3 rounded-full text-sm font-bold text-white"
                style={{
                  padding:   "2px 4px",
                  background: "#F97316",
                  boxShadow:  "0 4px 16px rgba(249,115,22,0.35)",
                }}
              >
                Order Now
              </Link>
              <Link
                href="/menu"
                className="px-8 py-3 rounded-full font-bold text-sm border-2"
                style={{ padding:   "2px 4px",borderColor: "#F97316", color: "#F97316" }}
              >
                See Menu
              </Link>
            </motion.div>
          </div>

          {/* RIGHT: Food Cards */}
          <div className="flex flex-col gap-3 order-3 w-full">
            {FOOD_CARDS.map((card, i) => (
              <motion.div
                key={card.title}
                className="flex items-center gap-3 p-4 rounded-2xl w-full"
                style={{
                  background: card.highlighted ? "#F97316" : "white",
                  boxShadow:  card.highlighted
                    ? "0 8px 24px rgba(249,115,22,0.3)"
                    : "0 4px 16px rgba(0,0,0,0.07)",
                }}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0  }}
                transition={{ delay: 0.3 + i * 0.12 }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
                  style={{
                    background: card.highlighted
                      ? "rgba(255,255,255,0.2)"
                      : "rgba(249,115,22,0.08)",
                  }}
                >
                  {card.emoji}
                </div>
                <div>
                  <p
                    className="font-bold text-sm"
                    style={{ color: card.highlighted ? "white" : "#1F2937" }}
                  >
                    {card.title}
                  </p>
                  <p
                    className="text-xs mt-0.5"
                    style={{ color: card.highlighted ? "rgba(255,255,255,0.75)" : "#9CA3AF" }}
                  >
                    {card.desc}
                  </p>
                </div>
              </motion.div>
            ))}

            {/* Google Maps */}
            <motion.a
              href="https://maps.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 rounded-2xl w-full"
              style={{
                background: "white",
                boxShadow:  "0 4px 16px rgba(0,0,0,0.07)",
              }}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0  }}
              transition={{ delay: 0.6 }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
                style={{ background: "rgba(249,115,22,0.08)" }}
              >
                📍
              </div>
              <div>
                <p className="font-bold text-sm" style={{ color: "#1F2937" }}>
                  Find Us on Google Maps
                </p>
                <div className="flex items-center gap-0.5 mt-0.5">
                  {[1,2,3,4,5].map((s) => (
                    <Star key={s} size={10} fill="#F97316" style={{ color: "#F97316" }} />
                  ))}
                  <span className="text-xs ml-1" style={{ color: "#9CA3AF" }}>
                    Mama Soups
                  </span>
                </div>
              </div>
            </motion.a>
          </div>
        </div>
      </div>
    </section>
  );
}
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Clock, MapPin, Star, ChevronDown } from "lucide-react";

// Karachi areas within 8km radius
const AREAS = [
  "Saddar",
  "Civil lines",
  "Garden",
  "Lines Area",
  "Soldier Bazaar",
  "Jamshed Quarter",
  "PECHS",
  "Nursery",
  "Tariq Road",
  "Bahadurabad",
  "Clifton",
  "Boat Basin",
  "Bath Island",
  "Defence Phase 1",
  "Defense Phase 2",
  "Gizri (Selected Areas)",
];

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
  const [selectedArea, setSelectedArea]   = useState("");
  const [showDropdown, setShowDropdown]   = useState(false);
  const [showLaunchBanner, setShowLaunchBanner] = useState(true);

  return (
    <section
      className="relative overflow-hidden px-4 sm:px-6 lg:px-8 justify-items-center"
      style={{
        background:    "linear-gradient(135deg, #fff7ed 0%, #ffffff 50%, #fff7ed 100%)",
        paddingTop:    "100px",
        paddingBottom: "60px",
        minHeight:     "100vh",
      }}
    >
      {/* ── Orange glow ── */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width:     "500px",
          height:    "500px",
          background: "radial-gradient(circle, rgba(249,115,22,0.15) 0%, transparent 70%)",
          top:       "50%",
          left:      "50%",
          transform: "translate(-50%, -50%)",
        }}
      />

      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col gap-6">

        {/* ── 🎉 LAUNCH BANNER ── */}
        <AnimatePresence>
          {showLaunchBanner && (
            <motion.div
              className="relative w-full rounded-2xl overflow-hidden"
              style={{
                padding:"4px 8px",
                background: "linear-gradient(135deg, #F97316, #dc2626)",
                boxShadow:  "0 8px 32px rgba(249,115,22,0.4)",
              }}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0,   scale: 1    }}
              exit={{    opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.5 }}
            >
              {/* Animated stars background */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {["10%", "25%", "45%", "65%", "80%", "90%"].map((left, i) => (
                  <motion.div
                    key={i}
                    className="absolute text-white/20 text-2xl"
                    style={{ left, top: "20%" }}
                    animate={{ y: [-5, 5, -5], rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2 + i * 0.3, repeat: Infinity }}
                  >
                    ⭐
                  </motion.div>
                ))}
              </div>

              <div className="relative px-6 py-4 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  {/* Animated rocket */}
                  <motion.span
                    className="text-3xl"
                    animate={{ y: [0, -8, 0], rotate: [-5, 5, -5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    🚀
                  </motion.span>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className="px-2 py-0.5 rounded-full text-xs font-black tracking-widest uppercase"
                        style={{ padding:"4px 8px", background: "rgba(255,255,255,0.25)", color: "white" }}
                      >
                        Coming Soon
                      </span>
                      <motion.span
                        className="px-2 py-0.5 rounded-full text-xs font-black"
                        style={{padding:"4px 8px", background: "#fbbf24", color: "#000" }}
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      >
                        🎊 Grand Opening
                      </motion.span>
                    </div>
                    <p className="text-white font-black text-lg mt-0.5">
                      We&apos;re Launching{" "}
                      <span
                        className="px-2 py-0.5 rounded-lg"
                        style={{padding:"2px 4px", background: "rgba(255,255,255,0.2)" }}
                      >
                        1st August 2026
                      </span>
                      ! 🎉
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.85)" }}>
                      Mark your calendars — hot soups, crispy fries & puris are coming to your door!
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Link
                    href="/menu"
                    className="px-4 py-2 rounded-full text-sm font-bold transition-all hover:scale-105"
                    style={{padding:"4px 8px", background: "white", color: "#F97316" }}
                  >
                    Sneak Peek Menu →
                  </Link>
                  <button
                    onClick={() => setShowLaunchBanner(false)}
                    className="text-white/70 hover:text-white text-lg"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── TIMING + INFO BAR ── */}
        <motion.div
          className="flex flex-wrap items-center justify-center gap-4 px-4 py-3 rounded-2xl"
          style={{
            background: "rgba(249,115,22,0.06)",
            border:     "1px solid rgba(249,115,22,0.2)",
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center gap-2 text-sm font-medium"
               style={{ color: "#F97316" }}>
            <Clock size={16} />
            <span>Mon–Sat: 5:00 PM – 10:30 PM</span>
          </div>

          <div
            className="w-px h-4 hidden sm:block"
            style={{ background: "rgba(249,115,22,0.3)" }}
          />

          <div className="flex items-center gap-2 text-sm font-medium"
               style={{ color: "#dc2626" }}>
            <span>🚫</span>
            <span>Sundays: Closed</span>
          </div>

          <div
            className="w-px h-4 hidden sm:block"
            style={{ background: "rgba(249,115,22,0.3)" }}
          />

          <div className="flex items-center gap-2 text-sm font-medium"
               style={{ color: "#16a34a" }}>
            <MapPin size={16} />
            <span>Delivering within 8km radius</span>
          </div>

          <div
            className="w-px h-4 hidden sm:block"
            style={{ background: "rgba(249,115,22,0.3)" }}
          />

          {/* Google Maps link */}
          <a
            href="https://maps.app.goo.gl/2rJkU2XBVYdUdZvZA"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-sm font-medium transition-opacity hover:opacity-80"
            style={{ color: "#F97316" }}
          >
            <Star size={14} />
            Find us on Google Maps
          </a>
        </motion.div>

        {/* ── MAIN HERO GRID ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr_1fr] gap-10 lg:gap-14 items-center">

          {/* LEFT: Text + Area Selector */}
          <div className="flex flex-col gap-6 order-2 lg:order-1">

            <motion.h1
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black leading-[1.05] tracking-tight"
              style={{ color: "#1F2937" }}
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              TASTE THE SOUL
              <br />
              <span style={{ color: "#F97316" }}>IN EVERY SPOON</span>
            </motion.h1>

            <motion.p
              className="text-base leading-relaxed max-w-xs"
              style={{ color: "#6B7280" }}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 }}
            >
              Hot soups, crispy fries & fresh puris —
              delivered straight to your door within
              8km of our location.
            </motion.p>

            {/* ── Area Selector ── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
            >
              <p className="text-xs font-semibold uppercase tracking-wider mb-2"
                 style={{ color: "#9CA3AF" }}>
                Select Your Area
              </p>
              <div className="relative">
                <button
                  onClick={() => setShowDropdown((s) => !s)}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all"
                  style={{
                    borderColor: selectedArea ? "#F97316" : "rgba(0,0,0,0.15)",
                    background:  selectedArea ? "rgba(249,115,22,0.05)" : "white",
                    color:       selectedArea ? "#F97316" : "#6B7280",
                  }}
                >
                  <div className="flex items-center gap-2">
                    <MapPin size={16} style={{ color: "#F97316" }} />
                    {selectedArea || "Choose your area..."}
                  </div>
                  <ChevronDown
                    size={16}
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
                      className="absolute top-full left-0 right-0 mt-1 rounded-xl overflow-hidden z-50"
                      style={{
                        background: "white",
                        border:     "1px solid rgba(0,0,0,0.1)",
                        boxShadow:  "0 8px 32px rgba(0,0,0,0.12)",
                        maxHeight:  "200px",
                        overflowY:  "auto",
                      }}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0  }}
                      exit={{   opacity: 0, y: -10 }}
                    >
                      {AREAS.map((area) => (
                        <button
                          key={area}
                          className="w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-orange-50"
                          style={{ color: "#1F2937" }}
                          onClick={() => {
                            setSelectedArea(area);
                            setShowDropdown(false);
                          }}
                        >
                          {area}
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
                  ✅ Great! We deliver to {selectedArea}
                </motion.p>
              )}
            </motion.div>

            {/* Buttons */}
            <motion.div
              className="flex flex-wrap gap-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Link
                href="/menu"
                className="px-8 py-3.5 rounded-full text-sm font-bold text-white text-center transition-all hover:scale-105"
                style={{
                  padding:"4px 8px",
                  background: "#F97316",
                  boxShadow:  "0 4px 20px rgba(249,115,22,0.35)",
                }}
              >
                Order Now
              </Link>
              <Link
                href="/menu"
                className="px-8 py-3.5 rounded-full font-bold text-sm text-center border-2 transition-all hover:bg-orange-50"
                style={{ padding:"3px 7px",borderColor: "#F97316", color: "#F97316" }}
              >
                See Menu
              </Link>
            </motion.div>
          </div>

          {/* CENTER: Soup Bowl */}
          <div className="flex items-center justify-center order-1 lg:order-2">
            <motion.div
              className="relative flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.7 }}
            >
              <motion.div
                className="absolute rounded-full"
                style={{
                  width:      "500px",
                  height:     "500px",
                  background: "radial-gradient(circle, rgba(249,115,22,0.25) 0%, rgba(249,115,22,0.05) 60%, transparent 80%)",
                }}
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              />

              <motion.div
                className="relative rounded-full overflow-hidden"
                style={{
                  width:  "clamp(220px, 32vw, 400px)",
                  height: "clamp(220px, 32vw, 400px)",
                }}
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <Image
                  src="/images/soup.jpg"
                  alt="Mama Soups"
                  fill
                  sizes="400px"
                  className="object-cover"
                  priority
                  loading="eager"
                />
                <div
                  className="absolute inset-0 rounded-full pointer-events-none"
                  style={{
                    background: "radial-gradient(ellipse at 30% 20%, rgba(255,255,255,0.12) 0%, transparent 45%)",
                  }}
                />
              </motion.div>

              {/* Steam */}
              {["-20px", "0px", "20px"].map((x, i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full"
                  style={{
                    width:      "6px",
                    height:     "6px",
                    background: "rgba(249,115,22,0.4)",
                    bottom:     "60%",
                    left:       `calc(50% + ${x})`,
                  }}
                  animate={{ y: [0, -60, -80], opacity: [0.6, 0.3, 0], scale: [1, 1.5, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.5, ease: "easeOut" }}
                />
              ))}
            </motion.div>
          </div>

          {/* RIGHT: Food Cards */}
          <div className="flex flex-col gap-4 order-3">
            {FOOD_CARDS.map((card, i) => (
              <motion.div
                key={card.title}
                className="flex items-center gap-4 p-5 rounded-3xl w-full transition-all duration-300"
                style={{
                  background: card.highlighted ? "#F97316" : "#FFFFFF",
                  boxShadow:  card.highlighted
                    ? "0 8px 30px rgba(249,115,22,0.35)"
                    : "0 4px 20px rgba(0,0,0,0.08)",
                  border: card.highlighted ? "none" : "1px solid rgba(0,0,0,0.06)",
                }}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0  }}
                transition={{ delay: 0.3 + i * 0.15 }}
              >
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl shrink-0"
                  style={{
                    background: card.highlighted
                      ? "rgba(255,255,255,0.25)"
                      : "rgba(249,115,22,0.08)",
                  }}
                >
                  {card.emoji}
                </div>
                <div>
                  <p
                    className="font-bold text-sm leading-tight"
                    style={{ color: card.highlighted ? "#FFFFFF" : "#1F2937" }}
                  >
                    {card.title}
                  </p>
                  <p
                    className="text-xs mt-1"
                    style={{ color: card.highlighted ? "rgba(255,255,255,0.75)" : "#9CA3AF" }}
                  >
                    {card.desc}
                  </p>
                </div>
              </motion.div>
            ))}

            {/* Google Maps Rating */}
            <motion.a
              href="https://maps.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 rounded-3xl transition-all hover:scale-102"
              style={{
                background: "white",
                border:     "1px solid rgba(0,0,0,0.06)",
                boxShadow:  "0 4px 20px rgba(0,0,0,0.06)",
              }}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0  }}
              transition={{ delay: 0.75 }}
            >
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl shrink-0"
                style={{ background: "rgba(249,115,22,0.08)" }}
              >
                📍
              </div>
              <div>
                <p className="font-bold text-sm" style={{ color: "#1F2937" }}>
                  Find Us on Google Maps
                </p>
                <div className="flex items-center gap-1 mt-0.5">
                  {[1,2,3,4,5].map((s) => (
                    <Star key={s} size={10} fill="#F97316" style={{ color: "#F97316" }} />
                  ))}
                  <span className="text-xs ml-1" style={{ color: "#6B7280" }}>
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
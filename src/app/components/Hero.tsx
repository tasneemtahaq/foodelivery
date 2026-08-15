"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Clock, MapPin, Star, StarHalf, ChevronDown } from "lucide-react";

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
  "Defense Phase 3",
  "Defense Phase 4",
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
  background:
    "radial-gradient(circle at 50% 42%, rgba(1,65,28,0.08) 0%, transparent 32%), linear-gradient(135deg, #f8fff9 0%, #ffffff 50%, #f1f8f3 100%)",
  paddingTop: "clamp(72px, 10vw, 100px)",
  paddingBottom: "clamp(35px, 6vw, 60px)",
  minHeight: "100vh",
}}
    >
      {/* ── Orange glow ── */}
      <div
        className="absolute rounded-full pointer-events-none"
       style={{
  width: "clamp(280px, 70vw, 500px)",
  height: "clamp(280px, 70vw, 500px)",
  background:
    "radial-gradient(circle, rgba(1,65,28,0.18) 0%, rgba(1,65,28,0.06) 50%, transparent 72%)",
  top: "48%",
  left: "50%",
  transform: "translate(-50%, -50%)",
}}
      />

      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col gap-5 sm:gap-6 lg:gap-8">

        {/* ── 🎉 LAUNCH BANNER ── */}
        <AnimatePresence>
          {showLaunchBanner && (
            <motion.div
              className="relative w-full rounded-2xl overflow-hidden"
             style={{
                padding: "4px 8px",
                background:"linear-gradient(135deg, #01411C 0%, #006B3C 55%, #01411C 100%)",
                boxShadow:"0 10px 35px rgba(1,65,28,0.28)",
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
                    className="absolute text-white/30 text-base sm:text-xl lg:text-2xl"
                    style={{ left, top: "20%" }}
                    animate={{ y: [-5, 5, -5], rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2 + i * 0.3 }}
                  >
                    ⭐
                  </motion.div>
                ))}
              </div>

              <div className="relative px-4 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row items-center sm:justify-between gap-3 sm:gap-4">
                <div className="flex items-center gap-4">
                  {/* Animated rocket */}
                  <motion.span
                    className="text-3xl"
                    animate={{ y: [0, -8, 0], rotate: [-5, 5, -5] }}
                    transition={{ duration: 1.5,  }}
                  >
                    🤍💚
                  </motion.span>

               
<div className="flex flex-col items-center text-center gap-1.5 sm:gap-2">
  
  {/* Independence Day Message */}
  <motion.p
    className="text-sm sm:text-base md:text-lg text-white font-black leading-tight"
    initial={{ opacity: 0, y: -6 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    Celebrate Independence Day with{" "}
    <span
      className="inline-block px-2 py-0.5 rounded-full ml-1"
      style={{
        padding: "2px 6px",
        background: "rgba(255,255,255,0.14)",
        border: "1px solid rgba(255,255,255,0.22)",
      }}
    >
      MAMA SOUPS
    </span>
  </motion.p>

  {/* Special Offer */}
  <motion.p
    className="text-[11px] sm:text-xs md:text-sm text-white/90 font-medium leading-relaxed max-w-75 sm:max-w-none"
    initial={{ opacity: 0, y: 6 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.2 }}
  >
    On every order of{" "}
    <span className="font-bold text-white">
      Chicken Corn Soup (Family Bowl)
    </span>{" "}
    get{" "}
    
    <motion.span
      className="inline-flex items-center font-black text-white text-lg px-2 py-0.5 rounded-full mx-1"
      style={{
        padding: "2px 6px",
         background: "rgba(255,255,255,0.14)",
         border: "1px solid rgba(255,255,255,0.22)",
      }}
      animate={{
        scale: [1, 1.06, 1],
        boxShadow: [
          "0 0 0 rgba(10,143,77,0)",
          "0 0 14px rgba(10,143,77,0.5)",
          "0 0 0 rgba(10,143,77,0)",
        ],
      }}
      transition={{
        duration: 1.8,
        ease: "easeInOut",
      }}
    >
      ✨ FREE
    </motion.span>{" "}
    
    <span className="font-bold text-white">
      Greenchilli Fries
    </span>
  </motion.p>
<span className="text-[11px] sm:text-xs md:text-sm text-white/90 font-medium leading-relaxed max-w-75 sm:max-w-none" > Offer Valid for Online Deliveries Only</span>
</div>
       </div>
                
                

                <div className="flex items-center gap-3">
                  <Link
                    href="/menu"
                    className="px-4 py-2 rounded-full text-sm font-bold transition-all hover:scale-105"
                    style={{ padding: "5px 10px", background: "#FFFFFF", color: "#01411C", boxShadow: "0 4px 15px rgba(0,0,0,0.12)",}}
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
          style={{background:"linear-gradient(90deg, rgba(1,65,28,0.04), rgba(255,255,255,0.9), rgba(1,65,28,0.04))",
                  border: "1px solid rgba(1,65,28,0.14)",
                  boxShadow: "0 6px 25px rgba(1,65,28,0.05)",
                  backdropFilter: "blur(10px)",
                   }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center gap-2 text-sm font-medium"
               style={{ color: "#01411C" }}>
            <Clock size={16} />
            <span>Mon–Sat: 5:00 PM – 10:30 PM</span>
          </div>

          <div
            className="w-px h-4 hidden sm:block"
            style={{ background: "rgba(1,65,28,0.16)" }}
          />

          <div className="flex items-center gap-2 text-sm font-medium"
               style={{ color: "#B42318" }}>
            <span>🚫</span>
            <span>Sundays: Closed</span>
          </div>

          <div
            className="w-px h-4 hidden sm:block"
            style={{ background: "rgba(249,115,22,0.3)" }}
          />

          <div className="flex items-center gap-2 text-sm font-medium"
               style={{ color: "#087443" }}>
            <MapPin size={16} />
            <span> Check if We Deliver to Your Area </span>
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
            style={{ color: "#006B3C" }}
          >
           ⭐ Find us on Google Maps
          </a>
        </motion.div>

        {/* ── MAIN HERO GRID ── */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr] lg:grid-cols-[1fr_1.2fr_1fr] gap-8 sm:gap-10 lg:gap-14 items-center w-full">

          {/* LEFT: Text + Area Selector */}
          <div className="flex flex-col gap-6 order-2 lg:order-1">

            <motion.h1
              className="text-[clamp(2.25rem,7vw,5rem)] font-black leading-[1.02] tracking-[-0.03em]"
              style={{ color: "#123524", textShadow: "0 2px 20px rgba(1,65,28,0.08)" }}
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              TASTE THE SOUL
              <br />
              <span style={{ color: "#01411C",
  textShadow: "0 3px 18px rgba(1,65,28,0.12)", }}>IN EVERY SPOON</span>
            </motion.h1>

            <motion.p
              className="text-sm sm:text-base leading-relaxed max-w-full sm:max-w-md"
              style={{ color: "#596B61" }}
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
              <p className="w-full min-h-12 flex items-center justify-between px-3 sm:px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all"
                 style={{ padding: "0.75rem", color: "#9CA3AF", }}>
                Select Your Area
              </p>
              <div className="relative">
                <button
                  onClick={() => setShowDropdown((s) => !s)}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all"
                 style={{
  borderColor: selectedArea
    ? "#01411C"
    : "rgba(1,65,28,0.16)",
  background: selectedArea
    ? "rgba(1,65,28,0.05)"
    : "rgba(255,255,255,0.9)",
  color: selectedArea
    ? "#01411C"
    : "#68786D",
  boxShadow: selectedArea
    ? "0 5px 20px rgba(1,65,28,0.10)"
    : "0 3px 12px rgba(0,0,0,0.04)",
}}
                >
                  <div className="flex items-center gap-2">
                    <MapPin size={16} style={{ color: "#01411C" }} />
                    {selectedArea || "Choose your area..."}
                  </div>
                  <ChevronDown
                    size={16}
                    style={{color: "#01411C", transform: showDropdown ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s",}}
                  />
                </button>

                <AnimatePresence>
                  {showDropdown && (
                    <motion.div
                      className="absolute top-full left-0 right-0 mt-1 rounded-xl overflow-hidden z-50"
                      style={{
                           background: "rgba(255,255,255,0.98)",
                           border: "1px solid rgba(1,65,28,0.12)",
                           boxShadow: "0 15px 40px rgba(1,65,28,0.14)",
                           maxHeight: "min(260px, 45vh)",
                           overflowY: "auto",
                           backdropFilter: "blur(12px)",
                       }}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0  }}
                      exit={{   opacity: 0, y: -10 }}
                    >
                      {AREAS.map((area) => (
                        <button
                          key={area}
                          className="w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-green-50"
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
               className="w-full sm:w-auto px-7 sm:px-8 py-3.5 rounded-full text-sm font-bold text-white text-center transition-all hover:scale-[1.03]"
                style={{
                  padding:"4px 8px",
                  background:"linear-gradient(135deg, #01411C, #006B3C)",
                  boxShadow:"0 7px 25px rgba(1,65,28,0.28)",
                }}
              >
                Order Now
              </Link>
              <Link
                href="/menu"
                className="w-full sm:w-auto px-7 sm:px-8 py-3.5 rounded-full font-bold text-sm text-center border-2 transition-all hover:bg-green-50"
                style={{ padding:"3px 7px", borderColor: "#01411C", color: "#01411C", background: "rgba(255,255,255,0.8)", }}
              >
                See Menu
              </Link>
            </motion.div>
          </div>

          {/* CENTER: Soup Bowl */}
          <div className="flex items-center justify-center order-1 lg:order-2 py-4 sm:py-6 lg:py-0">
            <motion.div
              className="relative flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.7 }}
            >
              <motion.div
                className="absolute rounded-full"
                style={{width: "clamp(260px, 75vw, 500px)",
                        height: "clamp(260px, 75vw, 500px)",
                        background:"radial-gradient(circle, rgba(1,65,28,0.24) 0%, rgba(0,107,60,0.08) 48%, transparent 75%)",
                      }}
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 4, ease: "easeInOut" }}
              />

              <motion.div
                className="relative rounded-full overflow-hidden"
                style={{
                  width:  "clamp(220px, 32vw, 400px)",
                  height: "clamp(220px, 32vw, 400px)",
                }}
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, ease: "easeInOut" }}
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
                  style={{ width: "clamp(260px, 75vw, 500px)", 
                           height: "clamp(260px, 75vw, 500px)",
                           background:"radial-gradient(circle, rgba(1,65,28,0.24) 0%, rgba(0,107,60,0.08) 48%, transparent 75%)",}}
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
                    background: "rgba(255,255,255,0.8)",
                    boxShadow: "0 0 12px rgba(255,255,255,0.5)",
                    bottom:     "60%",
                    left:       `calc(50% + ${x})`,
                  }}
                  animate={{ y: [0, -60, -80], opacity: [0.6, 0.3, 0], scale: [1, 1.5, 0] }}
                  transition={{ duration: 2.5, delay: i * 0.5, ease: "easeOut" }}
                />
              ))}
            </motion.div>
          </div>

          {/* RIGHT: Food Cards */}
          <div className="flex flex-col gap-4 order-3">
            {FOOD_CARDS.map((card, i) => (
              <div
                key={card.title}
                className="flex items-center gap-4 p-5 rounded-3xl w-full transition-all duration-300"
                style={{
                  background: card.highlighted ? "linear-gradient(135deg, #01411C, #006B3C)" : "rgba(255,255,255,0.94)",
                  boxShadow: card.highlighted ? "0 12px 35px rgba(1,65,28,0.25)" : "0 8px 25px rgba(1,65,28,0.06)",
                  border: card.highlighted ? "none": "1px solid rgba(1,65,28,0.09)",
                }}
               
              >
                <div
                 className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center text-2xl sm:text-3xl shrink-0"
                  style={{
                   background: card.highlighted ? "rgba(255,255,255,0.16)": "rgba(1,65,28,0.06)",
                  }}
                >
                  {card.emoji}
                </div>
                <div>
                  <p
                    className="font-bold text-sm leading-tight"
                    style={{ color: card.highlighted ? "#FFFFFF" : "#173D28" }}
                  >
                    {card.title}
                  </p>
                  <p
                    className="text-xs mt-1"
                    style={{  color: card.highlighted ? "rgba(255,255,255,0.78)": "#718078" }}
                  >
                    {card.desc}
                  </p>
                </div>
              </div>
            ))}

            {/* Google Maps Rating */}
            <motion.a
              href="https://maps.app.goo.gl/2rJkU2XBVYdUdZvZA"
              target="_blank"
              rel="noopener noreferrer"
             className="flex items-center gap-3 p-3 sm:p-4 rounded-2xl sm:rounded-3xl transition-all hover:scale-[1.02]"
            style={{background:"linear-gradient(135deg, rgba(255,255,255,0.98), rgba(244,250,246,0.95))",
                    border: "1px solid rgba(1,65,28,0.09)",
                    boxShadow: "0 8px 25px rgba(1,65,28,0.07)",
                     }}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0  }}
              transition={{ delay: 0.75 }}
            >
              <div
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center text-2xl sm:text-3xl shrink-0"
                style={{ background: "rgba(1,65,28,0.07)"}}
              >
                📍
              </div>
              <div>
                <p className="font-bold text-sm" style={{ color: "#173D28" }}>
                  Find Us on Google Maps
                </p>
                <div className="flex items-center gap-1 mt-0.5">
                  {[1,2,3,4].map((s) => (
                    <Star key={s} size={10} fill="#0A8F4D"
                          color="#0A8F4D"  />
                  ))}
                   <StarHalf
                      size={10}
                      fill="#0A8F4D"
                      color="#0A8F4D"
                      />
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
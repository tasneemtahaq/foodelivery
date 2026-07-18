"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

// Right side floating food cards
const FOOD_CARDS = [
  {
    emoji: "🍜",
    title: "Chicken Corn Soup",
    desc:  "Hot & hearty, 2 sizes",
    highlighted: true,
  },
  {
    emoji: "🍟",
    title: "7 Flavored Fries",
    desc:  "Crispy, loaded toppings",
    highlighted: false,
  },
  {
    emoji: "🥙",
    title: "Pani Puri / Meethi Puri",
    desc:  "Fresh & tangy street style",
    highlighted: false,
  },
];

export default function Hero() {
  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden px-4 sm:px-6 lg:px-8"
      style={{
        background: "linear-gradient(135deg, #fff7ed 0%, #ffffff 50%, #fff7ed 100%)",
        paddingTop: "110px",
        paddingBottom: "60px",
      }}
    >
      {/* ── Orange glow behind center image ── */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: "500px",
          height: "500px",
          background: "radial-gradient(circle, rgba(249,115,22,0.18) 0%, transparent 70%)",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      />

      <div className="relative z-10 w-full max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr_1fr] gap-10 lg:gap-14 items-center">

          {/* ── LEFT: Text Content ── */}
          <div className="flex flex-col gap-6 order-2 lg:order-1">

            <motion.h1
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black leading-[1.05] tracking-tight "
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
              Just confirm your order and enjoy our
              delicious, fastest delivery — soups,
              fries & puris straight to your door.
            </motion.p>

            {/* Buttons */}
            <motion.div
              className="flex flex-wrap gap-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Link
                href="/menu"
                className="min-w-24 px-8 py-10 rounded-full text-sm font-semibold text-center transition-all duration-200 hover:scale-105"
                style={{
                  background: "#F97316",
                  boxShadow: "0 4px 20px rgba(249,115,22,0.35)",
                }}
              >
                Order Now
              </Link>
              <Link
                href="/menu"
                className="min-w-24 px-10 py-4 rounded-full font-bold text-sm text-center border-2 transition-all hover:bg-orange-50"
                style={{ borderColor: "#F97316", color: "#F97316" }}
              >
                See Menu
              </Link>
            </motion.div>
          </div>

          {/* ── CENTER: Steel Soup Bowl Image ── */}
          <div className="flex items-center justify-center order-1 lg:order-2">
            <motion.div
              className="relative flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.7 }}
            >
              {/* Glowing orange circle behind bowl */}
              <motion.div
                className="absolute rounded-full"
                style={{
                  width: "500px",
                  height: "500px",
                  background: "radial-gradient(circle, rgba(249,115,22,0.25) 0%, rgba(249,115,22,0.05) 60%, transparent 80%)",
                }}
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              />

              {/* Black plate with real soup image */}
            <motion.div
               className="relative rounded-full overflow-hidden"
                style={{
                     width:"clamp(240px,35vw,430px)",
                     height:"clamp(240px,35vw,430px)"
                  }}
               animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
                   {/* Real soup image */}
              <Image
                 src="/images/soup.jpg"
                 alt="Soup"
                 fill
                 sizes="280px"
                 className="object-cover"
                 priority
               />


                 {/* Shiny rim highlight */}
              <div
                className="absolute inset-0 rounded-full pointer-events-none"
                 style={{
                     background: "radial-gradient(ellipse at 30% 20%, rgba(255,255,255,0.12) 0%, transparent 45%)",
                        }}
                 />
                </motion.div>

              {/* Steam particles rising from bowl */}
              {["-20px", "0px", "20px"].map((x, i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full"
                  style={{
                    width: "6px",
                    height: "6px",
                    background: "rgba(249,115,22,0.4)",
                    bottom: "60%",
                    left: `calc(50% + ${x})`,
                  }}
                  animate={{
                    y: [0, -60, -80],
                    opacity: [0.6, 0.3, 0],
                    scale: [1, 1.5, 0],
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    delay: i * 0.5,
                    ease: "easeOut",
                  }}
                />
              ))}
            </motion.div>
          </div>

          {/* ── RIGHT: Floating Food Cards ── */}
          <div className="flex flex-col gap-4 order-3">
            {FOOD_CARDS.map((card, i) => (
              <motion.div
                key={card.title}
                className="flex items-center gap-4 p-5 rounded-3xl w-full max-w-sm transition-all duration-300"
                style={{
                  background: card.highlighted
                    ? "#F97316"
                    : "#FFFFFF",
                  boxShadow: card.highlighted
                    ? "0 8px 30px rgba(249,115,22,0.35)"
                    : "0 4px 20px rgba(0,0,0,0.08)",
                  border: card.highlighted
                    ? "none"
                    : "1px solid rgba(0,0,0,0.06)",
                }}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.15 }}
              >
                {/* Food image circle */}
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
                    style={{
                      color: card.highlighted
                        ? "rgba(255,255,255,0.75)"
                        : "#9CA3AF",
                    }}
                  >
                    {card.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
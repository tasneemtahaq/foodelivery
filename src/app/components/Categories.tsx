"use client";

import { motion } from "framer-motion";
import Link from "next/link";

interface Category {
  id:    number;
  name:  string;
  image: string | null;
  _count: { foods: number };
}

const CATEGORY_EMOJIS: Record<string, string> = {
  "Soups": "🥣",
  "fries": "🍟",
  "soda": "🥤",
  default: "🍽️",
};

export default function Categories({
  categories,
}: {
  categories: Category[];
}) {
  return (
    <section className="py-20 px-4" id="categories"
      style={{ background: "rgba(255,255,255,0.02)" }}>
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-xs tracking-[0.3em] uppercase mb-3"
             style={{ color: "#F59E0B" }}>
            What Are You Craving?
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-white">
            Browse <span style={{ color: "#F59E0B" }}>Categories</span>
          </h2>
        </motion.div>

        {/* Category Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <Link
                href={`/menu?category=${cat.id}`}
                className="flex flex-col items-center gap-3 p-6 rounded-2xl text-center transition-all duration-300 group"
                style={{
                  background: "#111111",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}
              >
                {/* Emoji */}
                <motion.div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
                  style={{ background: "rgba(245,158,11,0.1)" }}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  {CATEGORY_EMOJIS[cat.name] ?? CATEGORY_EMOJIS.default}
                </motion.div>

                <div>
                  <p className="font-bold text-white group-hover:text-amber-400 transition-colors">
                    {cat.name}
                  </p>
                  <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.4)" }}>
                    {cat._count.foods} items
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
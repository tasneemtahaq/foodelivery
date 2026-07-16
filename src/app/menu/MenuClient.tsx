"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ShoppingCart, Tag, SlidersHorizontal } from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";
import type { MenuFood, MenuCategory } from "./page";
import { useCartStore } from "../../store/cartStore";
import type { CartStore } from "../../store/cartStore";

interface MenuClientProps {
  foods:      MenuFood[];
  categories: MenuCategory[];
}

export default function MenuClient({ foods, categories }: MenuClientProps) {
  const [search,     setSearch]     = useState("");
  const [activeCat,  setActiveCat]  = useState<number | null>(null);
  const [sortBy,     setSortBy]     = useState<"default" | "price_asc" | "price_desc">("default");
  const [showFilter, setShowFilter] = useState(false);

  const addItem = useCartStore((state: CartStore) => state.addItem);

  // Filter + Search + Sort logic
  const filteredFoods = useMemo(() => {
    let result = [...foods];

    // Filter by category
    if (activeCat !== null) {
      result = result.filter((f) => f.categoryId === activeCat);
    }

    // Filter by search text
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (f) =>
          f.name.toLowerCase().includes(q) ||
          f.description.toLowerCase().includes(q)
      );
    }

    // Sort
    if (sortBy === "price_asc") {
      result.sort((a, b) => (a.offerPrice ?? a.price) - (b.offerPrice ?? b.price));
    } else if (sortBy === "price_desc") {
      result.sort((a, b) => (b.offerPrice ?? b.price) - (a.offerPrice ?? a.price));
    }

    return result;
  }, [foods, activeCat, search, sortBy]);

  const handleAddToCart = (food: MenuFood) => {
    addItem({
      id:       food.id,
      name:     food.name,
      price:    food.offerPrice ?? food.price,
      image:    food.image,
      quantity: 1,
    });
    toast.success(`${food.name} added! 🛒`);
  };

  return (
    <div style={{ paddingTop: "80px" }}>
      

      {/* ── Page Header ── */}
      <div
        className="py-12 px-4 text-center"
        style={{
          background: "linear-gradient(135deg, #fff7ed 0%, #ffffff 100%)",
          borderBottom: "1px solid rgba(249,115,22,0.1)",
        }}
      >
        <motion.p
          className="text-xs tracking-[0.3em] uppercase mb-2"
          style={{ color: "#F97316" }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Fresh &amp; Delicious
        </motion.p>
        <motion.h1
          className="text-4xl md:text-5xl font-bold mb-4"
          style={{ color: "#1F2937" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Our <span style={{ color: "#F97316" }}>Menu</span>
        </motion.h1>
        <motion.p
          className="text-sm max-w-md mx-auto"
          style={{ color: "#6B7280" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Soups, fries, and puris — made fresh and delivered fast.
        </motion.p>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* ── Search + Filter Bar ── */}
        <div className="flex flex-wrap gap-3 mb-6">

          {/* Search */}
          <div className="relative flex-1 min-w-50">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2"
              style={{ color: "#9CA3AF" }}
            />
            <input
              type="text"
              placeholder="Search foods..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-3 rounded-xl text-sm outline-none"
              style={{
                background: "white",
                border: "1px solid rgba(0,0,0,0.1)",
                color: "#1F2937",
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              }}
            />
          </div>

          {/* Sort Filter Toggle */}
          <button
            onClick={() => setShowFilter((s) => !s)}
            className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all"
            style={{
              background: showFilter ? "#F97316" : "white",
              border: "1px solid rgba(0,0,0,0.1)",
              color: showFilter ? "white" : "#374151",
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            }}
          >
            <SlidersHorizontal size={16} />
            Sort
          </button>
        </div>

        {/* Sort Options */}
        <AnimatePresence>
          {showFilter && (
            <motion.div
              className="flex gap-3 mb-6 flex-wrap"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{   opacity: 0, height: 0 }}
            >
              {[
                { label: "Default",     value: "default"    },
                { label: "Price: Low → High", value: "price_asc"  },
                { label: "Price: High → Low", value: "price_desc" },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setSortBy(opt.value as typeof sortBy)}
                  className="px-4 py-2 rounded-xl text-xs font-medium border transition-all"
                  style={{
                    background: sortBy === opt.value ? "#F97316" : "white",
                    borderColor: sortBy === opt.value ? "#F97316" : "rgba(0,0,0,0.1)",
                    color: sortBy === opt.value ? "white" : "#374151",
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Category Pills ── */}
        <div className="flex gap-2 flex-wrap mb-8">
          <button
            onClick={() => setActiveCat(null)}
            className="px-5 py-2 rounded-full text-sm font-medium border transition-all"
            style={{
              background: activeCat === null ? "#F97316" : "white",
              borderColor: activeCat === null ? "#F97316" : "rgba(0,0,0,0.1)",
              color: activeCat === null ? "white" : "#374151",
            }}
          >
            All Items
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCat(cat.id)}
              className="px-5 py-2 rounded-full text-sm font-medium border transition-all"
              style={{
                background: activeCat === cat.id ? "#F97316" : "white",
                borderColor: activeCat === cat.id ? "#F97316" : "rgba(0,0,0,0.1)",
                color: activeCat === cat.id ? "white" : "#374151",
              }}
            >
              {cat.name}
              <span
                className="ml-2 text-xs"
                style={{
                  color: activeCat === cat.id
                    ? "rgba(255,255,255,0.8)"
                    : "#9CA3AF",
                }}
              >
                {cat._count.foods}
              </span>
            </button>
          ))}
        </div>

        {/* ── Results Count ── */}
        <p className="text-sm mb-6" style={{ color: "#6B7280" }}>
          Showing <strong style={{ color: "#1F2937" }}>{filteredFoods.length}</strong> items
          {activeCat !== null && (
            <span> in <strong style={{ color: "#F97316" }}>
              {categories.find((c) => c.id === activeCat)?.name}
            </strong></span>
          )}
        </p>

        {/* ── Food Grid ── */}
        {filteredFoods.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">🍽️</p>
            <p className="font-bold text-lg" style={{ color: "#1F2937" }}>
              No foods found
            </p>
            <p className="text-sm mt-1" style={{ color: "#6B7280" }}>
              Try a different search or category
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredFoods.map((food, i) => (
                <motion.div
                  key={food.id}
                  layout
                  className="rounded-2xl overflow-hidden group"
                  style={{
                    background: "white",
                    border: "1px solid rgba(0,0,0,0.07)",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{    opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ y: -4 }}
                >
                  {/* Image */}
                  <div
                    className="relative h-48 overflow-hidden flex items-center justify-center text-6xl"
                    style={{ background: "#fff7ed" }}
                  >
                    {food.image ? (
                      <Image
                        src={food.image}
                        alt={food.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        sizes="(max-width: 768px) 100vw, 25vw"
                      />
                    ) : (
                      <span>🍽️</span>
                    )}

                    {/* Offer badge */}
                    {food.offerPrice && (
                      <div
                        className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold text-white"
                        style={{ background: "#F97316" }}
                      >
                        <Tag size={10} />
                        OFFER
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-4 flex flex-col gap-3">
                    <div>
                      <p className="text-xs font-medium mb-1"
                         style={{ color: "#F97316" }}>
                        {food.category.name}
                      </p>
                      <h3 className="font-bold text-base leading-tight"
                          style={{ color: "#1F2937" }}>
                        {food.name}
                      </h3>
                      <p className="text-xs mt-1 line-clamp-2"
                         style={{ color: "#6B7280" }}>
                        {food.description}
                      </p>
                    </div>

                    {/* Price + Button */}
                    <div className="flex items-center justify-between">
                      <div>
                        {food.offerPrice ? (
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-lg"
                                  style={{ color: "#F97316" }}>
                              Rs.{food.offerPrice}
                            </span>
                            <span className="text-xs line-through"
                                  style={{ color: "#9CA3AF" }}>
                              Rs.{food.price}
                            </span>
                          </div>
                        ) : (
                          <span className="font-bold text-lg"
                                style={{ color: "#F97316" }}>
                            Rs.{food.price}
                          </span>
                        )}
                      </div>

                      <motion.button
                        onClick={() => handleAddToCart(food)}
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold"
                        style={{ background: "#F97316" }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <ShoppingCart size={16} />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
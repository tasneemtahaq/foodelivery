"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {Search, ShoppingCart, Tag, SlidersHorizontal, Soup, CookingPot, GlassWater, UtensilsCrossed} from "lucide-react";
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
  const [showSearch, setShowSearch] = useState(false);
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


const getCategoryIcon = (name: string) => {
  const iconClass = "text-[#E26310]"; // Orange color

  switch (name.toLowerCase()) {
    case "soups":
      return (
        <Soup
          size={34}
          strokeWidth={1.5}
          className={iconClass}
        />
      );

    case "fries":
      return (
        <CookingPot
          size={34}
          strokeWidth={1}
          className={iconClass}
        />
      );

    case "puri":
      return (
        <UtensilsCrossed
          size={34}
          strokeWidth={1}
          className={iconClass}
        />
      );

    case "sodas":
      return (
        <GlassWater
          size={34}
          strokeWidth={1}
          className={iconClass}
        />
      );

    default:
      return (
        <UtensilsCrossed
          size={34}
          strokeWidth={1}
          className={iconClass}
        />
      );
  }
};

  return (
    <div
  className="w-full min-h-screen"
  style={{
    paddingTop: "110px",
    background: "#120C08",
  }}
>

      {/* ── Page Header ── */}
      <div
         className="max-w-full mx-auto flex flex-col items-center justify-center text-center px-6 py-24"
           style={{
           background:
              "linear-gradient(rgba(18,12,8,.55), rgba(18,12,8,.55)), url('/images/menu-bg.jpg') center/cover no-repeat",
               minHeight: "360px",
               borderBottom: "1px solid rgba(216,139,42,.30)",
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
          className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight"
          style={{ color: "#F8E9D2" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Our <span style={{ color: "#D88B2A" }}>Menu</span>
        </motion.h1>
        <motion.p
          className="text-base lg:text-lg leading-8 max-w-2xl mx-auto"
         style={{
              color: "#D6C5AF",
              maxWidth: "650px",
            }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Soups, fries, and puris — made fresh and delivered fast.
        </motion.p>
      </div>

           <div className="max-w-7xl mx-auto px-6 lg:px-10 py-8 lg:py-12">
  {/* Search */}

  <div className="flex justify-end mb-12 relative">
  <div className="flex items-center gap-3">

    {/* Search */}


      {/* Search Button */}

      <button
        onClick={() => setShowSearch(!showSearch)}
        className="w-12 h-12 rounded-full bg-[#2A1D16] border border-[#4A3528] flex items-center justify-center hover:bg-[#D88B2A] transition-all duration-300"
      >
        <Search
          size={18}
          className="text-[#F8E9D2]"
        />
      </button>

      {/* Search Popup */}

      <AnimatePresence>

        {showSearch && (

          <motion.div 
             initial={{
              opacity: 0,
              scaleX: 0.7,
              x: 20
            }}

            animate={{
              opacity: 1,
              scaleX: 1,
              x: 0
            }}exit={{
              opacity: 0,
              scaleX: 0.7,
              x: 20
            }}
              transition={{
              duration: .25
            }}

          >

            <input

              autoFocus

              type="text"

              placeholder="Search menu..."

              value={search}

              onChange={(e)=>setSearch(e.target.value)}

              className="w-75 sm:w-85
              px-5
              py-3
              rounded-full
              bg-[#2A1D16]
              border
              border-[#4A3528]
              text-[#F8E9D2]
              placeholder:text-[#B9A998]
              outline-none
              shadow-2xl
              "

            />

          </motion.div>

        )}

      </AnimatePresence>

    </div>

    {/* Sort */}

    <button
      onClick={()=>setShowFilter(!showFilter)}
      className="
      w-12
      h-12
      rounded-full
      bg-[#2A1D16]
      border
      border-[#4A3528]
      flex
      items-center
      justify-center
      hover:bg-[#D88B2A]
      transition-all
      duration-300
      "
    >
      <SlidersHorizontal
        size={18}
        className="text-[#F8E9D2]"
      />
    </button>

  </div>
</div>


       
        {/* Sort Options */}

<div className="relative flex justify-end mb-10">

  <AnimatePresence>

    {showFilter && (

      <motion.div
        initial={{ opacity: 0, y: -10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="
          absolute
          right-5
          mt-14
          bg-[#2A1D16]
          border
          border-[#4A3528]
          rounded-2xl
          shadow-2xl
          p-3
          z-50
          flex
          flex-col
          gap-2
          min-w-55
        "
      >
        {[
          { label: "Default", value: "default" },
          { label: "Price: Low → High", value: "price_asc" },
          { label: "Price: High → Low", value: "price_desc" },
        ].map((opt) => (
          <button
            key={opt.value}
            onClick={() => {
              setSortBy(opt.value as typeof sortBy);
              setShowFilter(false);
            }}
            className="px-4 py-3 rounded-xl text-left transition"
            style={{
              background:
                sortBy === opt.value ? "#D88B2A" : "transparent",
              color: "#F8E9D2",
            }}
          >
            {opt.label}
          </button>
        ))}
      </motion.div>

    )}

  </AnimatePresence>

</div>

        {/* ── Category Pills ── */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-5 mb-12">
          <button
            onClick={() => setActiveCat(null)}
            className="h-24 rounded-2xl font-semibold text-lg transition-all duration-300 shadow-lg"
            style={{
              background: activeCat === null ? "#D88B2A" : "#2A1D16",
              border: "1px solid #4A3528",
              color: "#F8E9D2",
             }}
          >
            All Items
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCat(cat.id)}
              className="h-24 rounded-2xl font-semibold text-lg transition-all duration-300 shadow-lg"
              style={{
                   background: activeCat === cat.id ? "#D88B2A" : "#2A1D16",
                   border: "1px solid #4A3528",
                   color: "#F8E9D2",
               }}
            >
              <div className="flex flex-col items-center justify-center gap-2">
                 {getCategoryIcon(cat.name)}

  <span>
    {cat.name}
  </span>

  <span
    className="text-xs"
    style={{
      color:
        activeCat === cat.id
          ? "rgba(255,255,255,.8)"
          : "#B9A998",
    }}
  >
    {cat._count.foods}
  </span>
         </div>
             
            </button>
          ))}
        </div>

        {/* ── Results Count ── */}
        <p className="text-sm mb-6" 
        style={{ color: "#6B7280" }}>
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
          <div className="flex flex-col items-center gap-6">
            <AnimatePresence mode="popLayout">
              {filteredFoods.map((food, i) => (
                <motion.div
                  key={food.id}
                  layout
                  className="flex w-full max-w-5xl rounded-2xl overflow-hidden"
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
                    className="relative w-44 h-40 shrink-0 overflow-hidden flex items-center justify-center text-6xl"
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
                
                   <div className="flex-1 flex flex-col justify-between p-5">
                    <div>
                      <p className="text-xs font-medium mb-1"
                         style={{ color: "#F97316" }}>
                        {food.category.name}
                      </p>
                      <h3 className="font-bold text-base leading-tight"
                          style={{ color: "#1F2937" }}>
                        {food.name}
                      </h3>
                      <p
                    className="text-sm mt-2 line-clamp-3 leading-6"
                    style={{ color: "#6B7280" }}
                     >
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
  
  );
}
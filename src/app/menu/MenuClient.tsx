"use client";

import { useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Search, Heart, ShoppingCart, Clock, Tag, Minus, Plus, Check,
  ChevronLeft, ChevronRight,
} from "lucide-react";
import toast from "react-hot-toast";
import { useCartStore } from "@/store/cartStore";
import type { CartStore } from "@/store/cartStore";
import AIAssistant from "../components/AIAssistant";

interface Food {
  id:           number;
  name:         string;
  description:  string;
  price:        number;
  offerPrice:   number | null;
  image:        string | null;
  isAvailable?: boolean;
  category:     { name: string };
}

const CATEGORY_EMOJI: Record<string, string> = {
  Soups:  "🍜",
  Fries:  "🍟",
  Puri:   "🥙",
  Sodas:  "🥤",
  Drinks: "🥤",
};

// Same frosted-cream look as the cards on the homepage
const glass = {
  background:     "rgba(250,248,242,0.86)",
  backdropFilter: "blur(14px)",
  border:         "1px solid rgba(255,255,255,0.7)",
  boxShadow:      "0 18px 40px rgba(61,47,29,0.13)",
  borderRadius:   "30px",
} as const;

export default function MenuClient({ foods }: { foods: Food[] }) {
  const router  = useRouter();
  const addItem = useCartStore((s: CartStore) => s.addItem);

  const [search,         setSearch]         = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedId,     setSelectedId]     = useState<number | null>(null);
  const [showAll,        setShowAll]        = useState(false);
  const [quantity,       setQuantity]       = useState(1);
  const [favorites,      setFavorites]      = useState<number[]>([]);
  
  const listRef = useRef<HTMLDivElement>(null);

  // Scrolls the item list left or right (used by the arrow buttons on phones)
  const scrollList = (direction: "left" | "right") => {
    listRef.current?.scrollBy({
      left:     direction === "left" ? -240 : 240,
      behavior: "smooth",
    });
  };

  // Look of the round orange arrow buttons
  const arrowButtonStyle = {
    width:          "46px",
    height:         "46px",
    borderRadius:   "50%",
    display:        "flex",
    alignItems:     "center",
    justifyContent: "center",
    background:     "linear-gradient(135deg, #F97316, #EA580C)",
    color:          "white",
    border:         "none",
    boxShadow:      "0 8px 20px rgba(249,115,22,0.4)",
    cursor:         "pointer",
  } as const;

  // Category names taken from your foods automatically
  const categoryNames = useMemo(
    () => Array.from(new Set(foods.map((f) => f.category.name))),
    [foods]
  );

  // Foods after search + category filter
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return foods.filter((f) => {
      const matchCategory =
        activeCategory === "All" || f.category.name === activeCategory;
      const matchSearch =
        q === "" ||
        f.name.toLowerCase().includes(q) ||
        f.description.toLowerCase().includes(q);
      return matchCategory && matchSearch;
    });
  }, [foods, search, activeCategory]);

  const visibleFoods = showAll ? filtered : filtered.slice(0, 6);

  // The food shown in the big panel (first one if nothing picked yet)
  const selected =
    filtered.find((f) => f.id === selectedId) ?? filtered[0] ?? null;

  const soldOut = selected?.isAvailable === false;

  const pickFood = (id: number) => {
    setSelectedId(id);
    setQuantity(1);
  };

  const pickCategory = (name: string) => {
    setActiveCategory(name);
    setSelectedId(null);
    setShowAll(false);
    setQuantity(1);
  };

  const addSelectedToCart = (food: Food, qty: number) => {
    for (let i = 0; i < qty; i++) {
      addItem({
        id:       food.id,
        name:     food.name,
        price:    food.offerPrice ?? food.price,
        image:    food.image,
        quantity: 1,
      });
    }
  };

  const handleAddToCart = () => {
    if (!selected) return;
    addSelectedToCart(selected, quantity);
    toast.success(`${quantity} × ${selected.name} added! 🛒`);
  };

  const handleBuyNow = () => {
    if (!selected) return;
    addSelectedToCart(selected, quantity);
    router.push("/checkout");
  };

  const toggleFavorite = (id: number) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  return (
    <main
      style={{
        minHeight:     "100vh",
        width:         "100%",
        paddingTop:    "130px",
        paddingBottom: "80px",
        paddingLeft:   "16px",
        paddingRight:  "16px",
        overflowX:     "hidden",
        background: `
          radial-gradient(circle at 8% 8%, rgba(120, 180, 125, 0.92) 0%, rgba(120, 180, 125, 0) 28%),
          radial-gradient(circle at 92% 10%, rgba(100, 165, 108, 0.88) 0%, rgba(100, 165, 108, 0) 28%),
          radial-gradient(circle at 5% 92%, rgba(110, 175, 118, 0.85) 0%, rgba(110, 175, 118, 0) 26%),
          radial-gradient(circle at 94% 90%, rgba(95, 160, 102, 0.85) 0%, rgba(95, 160, 102, 0) 26%),
          radial-gradient(circle at 50% 45%, rgba(240, 155, 60, 0.82) 0%, rgba(240, 155, 60, 0) 38%),
          linear-gradient(135deg, #c8e6c9 0%, #e8d5b8 30%, #f0b060 52%, #e8d5b8 72%, #c8e6c9 100%)
        `,
      }}
    >
      <div style={{ maxWidth: "1180px", margin: "0 auto" }}>

        {/* ── Page heading ── */}
        <div style={{ textAlign: "center", marginBottom: "36px" }}>
          <p
            style={{
              fontSize:      "11px",
              fontWeight:    500,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color:         "#89735f",
              marginBottom:  "12px",
            }}
          >
            Fresh • Homemade • Delicious
          </p>
          <h1
            style={{
              fontSize:      "40px",
              fontWeight:    500,
              letterSpacing: "-1px",
              color:         "#171717",
            }}
          >
            Our Menu
          </h1>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[370px_1fr]">

          {/* ════════ LEFT: list panel ════════ */}
          <aside style={{ ...glass, padding: "22px" }}>

            {/* Search */}
            <div style={{ position: "relative", marginBottom: "18px" }}>
              <Search
                size={16}
                style={{
                  position:  "absolute",
                  left:      "14px",
                  top:       "50%",
                  transform: "translateY(-50%)",
                  color:     "#89735f",
                }}
              />
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setSelectedId(null);
                  setShowAll(false);
                }}
                placeholder="Search the menu..."
                style={{
                  width:        "100%",
                  padding:      "11px 14px 11px 40px",
                  borderRadius: "999px",
                  border:       "1px solid rgba(137,115,95,0.25)",
                  background:   "rgba(255,255,255,0.7)",
                  fontSize:     "13px",
                  color:        "#171717",
                  outline:      "none",
                }}
              />
            </div>

            {/* Category circles */}
            <div
              style={{
                display:       "flex",
                gap:           "14px",
                overflowX:     "auto",
                paddingBottom: "6px",
                marginBottom:  "18px",
              }}
            >
              {["All", ...categoryNames].map((name) => {
                const active = activeCategory === name;
                return (
                  <button
                    key={name}
                    type="button"
                    onClick={() => pickCategory(name)}
                    style={{
                      display:       "flex",
                      flexDirection: "column",
                      alignItems:    "center",
                      gap:           "6px",
                      flexShrink:    0,
                      background:    "none",
                      border:        "none",
                      cursor:        "pointer",
                    }}
                  >
                    <span
                      style={{
                        width:          "48px",
                        height:         "48px",
                        borderRadius:   "50%",
                        display:        "flex",
                        alignItems:     "center",
                        justifyContent: "center",
                        fontSize:       "22px",
                        background:     active ? "white" : "rgba(255,255,255,0.5)",
                        border:         active
                          ? "2px solid #c68129"
                          : "2px solid transparent",
                        boxShadow: active
                          ? "0 6px 16px rgba(198,129,41,0.3)"
                          : "none",
                      }}
                    >
                      {name === "All" ? "🍽️" : CATEGORY_EMOJI[name] ?? "🍴"}
                    </span>
                    <span
                      style={{
                        fontSize:   "10px",
                        fontWeight: active ? 700 : 500,
                        color:      active ? "#c68129" : "#6c5a49",
                      }}
                    >
                      {name}
                    </span>
                  </button>
                );
              })}
            </div>

            <h2
              style={{
                fontSize:     "24px",
                fontWeight:   500,
                color:        "#171717",
                marginBottom: "12px",
              }}
            >
              {activeCategory === "All" ? "All Items" : activeCategory}
            </h2>

            {/* Item list (scrolls sideways on phones, up/down on desktop) */}
                        <div
              ref={listRef}
              className="flex gap-3 overflow-x-auto pb-2 lg:max-h-107.5 lg:flex-col lg:overflow-x-visible lg:overflow-y-auto lg:pr-1"
            >
              {filtered.length === 0 && (
                <p style={{ fontSize: "13px", color: "#6c5a49", padding: "12px 4px" }}>
                  No items found. Try a different search.
                </p>
              )}

              {visibleFoods.map((food) => {
                const isSelected = selected?.id === food.id;
                return (
                  <button
                    key={food.id}
                    type="button"
                    onClick={() => pickFood(food.id)}
                    className="min-w-55 lg:min-w-0"
                    style={{
                      display:      "flex",
                      alignItems:   "center",
                      gap:          "12px",
                      padding:      "10px",
                      borderRadius: "18px",
                      textAlign:    "left",
                      cursor:       "pointer",
                      flexShrink:   0,
                      background:   isSelected
                        ? "white"
                        : "rgba(255,255,255,0.85)",
                      border: isSelected
                        ? "2px solid #c68129"
                        : "1.5px solid rgba(137,115,95,0.35)",
                      boxShadow: isSelected
                        ? "0 10px 24px rgba(198,129,41,0.3)"
                        : "0 4px 12px rgba(61,47,29,0.08)",
                    }}
                  >
                    <span
                      style={{
                        position:     "relative",
                        width:        "56px",
                        height:       "56px",
                        borderRadius: "14px",
                        overflow:     "hidden",
                        flexShrink:   0,
                        background:   "#eee9df",
                        display:      "flex",
                        alignItems:   "center",
                        justifyContent: "center",
                        fontSize:     "22px",
                      }}
                    >
                      {food.image ? (
                        <Image
                          src={food.image}
                          alt={food.name}
                          fill
                          sizes="56px"
                          className="object-cover"
                        />
                      ) : (
                        "🍜"
                      )}
                    </span>
                    <span style={{ minWidth: 0 }}>
                      <span
                        className="line-clamp-1"
                        style={{
                          display:    "block",
                          fontSize:   "13px",
                          fontWeight: 600,
                          color:      "#222",
                        }}
                      >
                        {food.name}
                      </span>
                      <span
                        style={{
                          display:    "block",
                          marginTop:  "3px",
                          fontSize:   "12px",
                          fontWeight: 700,
                          color:      "#c68129",
                        }}
                      >
                        Rs.{food.offerPrice ?? food.price}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>

                        {/* Arrow buttons (phones only) */}
            {filtered.length > 1 && (
              <div
                className="flex items-center justify-between lg:hidden"
                style={{ marginTop: "14px" }}
              >
                <button
                  type="button"
                  onClick={() => scrollList("left")}
                  aria-label="Scroll menu left"
                  style={arrowButtonStyle}
                >
                  <ChevronLeft size={22} />
                </button>

                <span
                  style={{
                    fontSize:   "11px",
                    fontWeight: 600,
                    color:      "#6c5a49",
                  }}
                >
                  Swipe or tap the arrows
                </span>

                <button
                  type="button"
                  onClick={() => scrollList("right")}
                  aria-label="Scroll menu right"
                  style={arrowButtonStyle}
                >
                  <ChevronRight size={22} />
                </button>
              </div>
            )}

            {/* View all button */}
            {filtered.length > 6 && (
              <button
                type="button"
                onClick={() => setShowAll((s) => !s)}
                 style={{
                  width:         "100%",
                  marginTop:     "12px",
                  padding:       "15px",
                  borderRadius:  "999px",
                  border:        "none",
                  background:    "linear-gradient(135deg, #F97316, #EA580C)",
                  fontSize:      "13px",
                  fontWeight:    700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color:         "white",
                  boxShadow:     "0 10px 26px rgba(249,115,22,0.45)",
                  cursor:        "pointer",
                }}
              >
                {showAll ? "Show less" : `View all (${filtered.length})`}
              </button>
            )}
          </aside>

          {/* ════════ RIGHT: selected food panel ════════ */}
          <section
            style={{
              ...glass,
              padding:        "32px 24px",
              display:        "flex",
              alignItems:     "center",
              justifyContent: "center",
              minHeight:      "520px",
            }}
          >
            {!selected ? (
              <p style={{ color: "#6c5a49", fontSize: "14px" }}>
                Nothing to show yet.
              </p>
            ) : (
              <motion.div
                key={selected.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                style={{
                  width:         "100%",
                  display:       "flex",
                  flexDirection: "column",
                  alignItems:    "center",
                  textAlign:     "center",
                }}
              >
                {/* Big round food image */}
                <div
                  style={{
                    position: "relative",
                    width:    "clamp(220px, 42vw, 360px)",
                    height:   "clamp(220px, 42vw, 360px)",
                  }}
                >
                  <div
                    style={{
                      position:     "absolute",
                      inset:        "-8%",
                      borderRadius: "50%",
                      background:   "rgba(240,154,75,0.3)",
                      filter:       "blur(45px)",
                    }}
                  />
                  <div
                    style={{
                      position:     "relative",
                      width:        "100%",
                      height:       "100%",
                      borderRadius: "50%",
                      overflow:     "hidden",
                      border:       "4px solid rgba(255,255,255,0.85)",
                      boxShadow:    "0 20px 60px rgba(74,48,25,0.22)",
                      background:   "#eee9df",
                      display:      "flex",
                      alignItems:   "center",
                      justifyContent: "center",
                      fontSize:     "72px",
                    }}
                  >
                    {selected.image ? (
                      <Image
                        src={selected.image}
                        alt={selected.name}
                        fill
                        priority
                        sizes="360px"
                        className="object-cover"
                      />
                    ) : (
                      "🍜"
                    )}
                  </div>
                </div>

                {/* Name + price */}
                <h2
                  style={{
                    marginTop:  "28px",
                    fontSize:   "28px",
                    fontWeight: 500,
                    color:      "#171717",
                  }}
                >
                  {selected.name}
                </h2>

                <div
                  style={{
                    marginTop:  "8px",
                    display:    "flex",
                    alignItems: "baseline",
                    gap:        "10px",
                  }}
                >
                  <span
                    style={{ fontSize: "22px", fontWeight: 700, color: "#c68129" }}
                  >
                    Rs.{selected.offerPrice ?? selected.price}
                  </span>
                  {selected.offerPrice && (
                    <span
                      style={{
                        fontSize:       "14px",
                        color:          "#9a9189",
                        textDecoration: "line-through",
                      }}
                    >
                      Rs.{selected.price}
                    </span>
                  )}
                </div>

                <p
                  style={{
                    marginTop:  "14px",
                    maxWidth:   "460px",
                    fontSize:   "13px",
                    lineHeight: 1.55,
                    color:      "#4a4640",
                  }}
                >
                  {selected.description}
                </p>

                {/* Info chips */}
                <div
                  style={{
                    marginTop:      "18px",
                    display:        "flex",
                    flexWrap:       "wrap",
                    justifyContent: "center",
                    gap:            "10px",
                  }}
                >
                  {[
                    { icon: Clock, text: "30–45 min delivery" },
                    { icon: Tag,   text: selected.category.name },
                    {
                      icon: Check,
                      text: soldOut ? "Currently unavailable" : "Freshly made",
                    },
                  ].map(({ icon: Icon, text }) => (
                    <span
                      key={text}
                      style={{
                        display:      "inline-flex",
                        alignItems:   "center",
                        gap:          "6px",
                        padding:      "7px 14px",
                        borderRadius: "999px",
                        background:   "rgba(255,255,255,0.6)",
                        fontSize:     "11px",
                        color:        "#6c5a49",
                      }}
                    >
                      <Icon size={13} />
                      {text}
                    </span>
                  ))}
                </div>

                {/* Buttons row */}
                <div
                  style={{
                    marginTop:      "28px",
                    display:        "flex",
                    flexWrap:       "wrap",
                    alignItems:     "center",
                    justifyContent: "center",
                    gap:            "12px",
                  }}
                >
                  {/* Heart */}
                  <button
                    type="button"
                    onClick={() => toggleFavorite(selected.id)}
                    aria-label="Favourite"
                    style={{
                      width:          "46px",
                      height:         "46px",
                      borderRadius:   "50%",
                      display:        "flex",
                      alignItems:     "center",
                      justifyContent: "center",
                      background:     "rgba(255,255,255,0.7)",
                      border:         "1px solid rgba(137,115,95,0.3)",
                      cursor:         "pointer",
                    }}
                  >
                    <Heart
                      size={18}
                      fill={favorites.includes(selected.id) ? "#dc2626" : "none"}
                      style={{
                        color: favorites.includes(selected.id)
                          ? "#dc2626"
                          : "#6c5a49",
                      }}
                    />
                  </button>

                  {/* Quantity */}
                  <div
                    style={{
                      display:      "flex",
                      alignItems:   "center",
                      gap:          "14px",
                      padding:      "0 14px",
                      height:       "46px",
                      borderRadius: "999px",
                      background:   "rgba(255,255,255,0.7)",
                      border:       "1px solid rgba(137,115,95,0.3)",
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      aria-label="Decrease quantity"
                      style={{ background: "none", border: "none", cursor: "pointer", color: "#6c5a49" }}
                    >
                      <Minus size={16} />
                    </button>
                    <span
                      style={{
                        minWidth:  "18px",
                        textAlign: "center",
                        fontSize:  "14px",
                        fontWeight: 700,
                        color:     "#222",
                      }}
                    >
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.min(20, q + 1))}
                      aria-label="Increase quantity"
                      style={{ background: "none", border: "none", cursor: "pointer", color: "#6c5a49" }}
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  {/* Add to cart */}
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    disabled={soldOut}
                    style={{
                      display:       "inline-flex",
                      alignItems:    "center",
                      gap:           "8px",
                      height:        "46px",
                      padding:       "0 24px",
                      borderRadius:  "999px",
                      background:    "rgba(255,255,255,0.7)",
                      border:        "1px solid rgba(137,115,95,0.4)",
                      fontSize:      "11px",
                      fontWeight:    600,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      color:         "#4a4640",
                      cursor:        soldOut ? "not-allowed" : "pointer",
                      opacity:       soldOut ? 0.5 : 1,
                    }}
                  >
                    <ShoppingCart size={15} />
                    Add to cart
                  </button>

                  {/* Buy now */}
                  <button
                    type="button"
                    onClick={handleBuyNow}
                    disabled={soldOut}
                    style={{
                      height:        "46px",
                      padding:       "0 30px",
                      borderRadius:  "999px",
                      background:    "linear-gradient(135deg, #F97316, #EA580C)",
                      border:        "none",
                      fontSize:      "11px",
                      fontWeight:    700,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      color:         "white",
                      boxShadow:     "0 8px 22px rgba(249,115,22,0.4)",
                      cursor:        soldOut ? "not-allowed" : "pointer",
                      opacity:       soldOut ? 0.5 : 1,
                    }}
                  >
                    Buy now
                  </button>
                </div>
              </motion.div>
            )}
          </section>
        </div>
      </div>

      <AIAssistant
        menuItems={foods.map((f) => ({
          id:          f.id,
          name:        f.name,
          price:       f.price,
          offerPrice:  f.offerPrice,
          description: f.description,
          category:    f.category.name,
        }))}
      />
    </main>
  );
}
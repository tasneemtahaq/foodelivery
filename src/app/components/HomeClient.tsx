"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  ShoppingCart,
  Star,
  ArrowUpRight,
  CalendarDays,
  Utensils,
  Truck,
} from "lucide-react";

import { useCartStore } from "@/store/cartStore";
import type { CartStore } from "@/store/cartStore";
import toast from "react-hot-toast";
import AIAssistant from "./AIAssistant";


interface Food {
  id: number;
  name: string;
  price: number;
  offerPrice: number | null;
  description: string;
  image: string | null;
  category: {
    name: string;
  };
}

interface Category {
  id: number;
  name: string;
  image: string | null;
  _count: {
    foods: number;
  };
}

export default function HomeClient({
  featuredFoods,
  categories: _categories,
}: {
  featuredFoods: Food[];
  categories: Category[];
}) {
  const addItem = useCartStore((state: CartStore) => state.addItem);
  const topFoods = featuredFoods.slice(0, 3);

  const handleAdd = (food: Food) => {
    addItem({
      id: food.id,
      name: food.name,
      price: food.offerPrice ?? food.price,
      image: food.image,
      quantity: 1,
    });

    toast.success(`${food.name} added! 🛒`);
  };

  return (
    <main
      className="relative min-h-screen w-full overflow-x-hidden text-[#171717]"
      style={{
        width: "100%",
        minWidth: 0,
        margin: 0,
        background: `
          radial-gradient(circle at 8% 8%, rgba(120, 180, 125, 0.92) 0%, rgba(120, 180, 125, 0) 28%),
          radial-gradient(circle at 92% 10%, rgba(100, 165, 108, 0.88) 0%, rgba(100, 165, 108, 0) 28%),
          radial-gradient(circle at 5% 92%, rgba(110, 175, 118, 0.85) 0%, rgba(110, 175, 118, 0) 26%),
          radial-gradient(circle at 94% 90%, rgba(95, 160, 102, 0.85) 0%, rgba(95, 160, 102, 0) 26%),
          radial-gradient(circle at 50% 45%, rgba(240, 155, 60, 0.82) 0%, rgba(240, 155, 60, 0) 38%),
          radial-gradient(circle at 32% 18%, rgba(246, 210, 170, 0.75) 0%, rgba(246, 210, 170, 0) 25%),
          radial-gradient(circle at 68% 18%, rgba(246, 210, 170, 0.75) 0%, rgba(246, 210, 170, 0) 25%),
          linear-gradient(135deg, #c8e6c9 0%, #e8d5b8 30%, #f0b060 52%, #e8d5b8 72%, #c8e6c9 100%)
        `,
      }}
    >
      <div
        className="mx-auto flex w-full max-w-7xl flex-col items-center px-4 pb-16 pt-32.5 sm:px-8 sm:pt-35 lg:px-12"
        style={{ paddingTop: "130px", marginInline: "auto" }}
      >
        {/* HERO */}
          <section className="w-full pt-10 pb-6 sm:pt-14 sm:pb-10">
          <div
            className="mx-auto grid w-full max-w-280 items-center justify-items-center gap-12 md:grid-cols-2 md:gap-16 lg:gap-20"
            style={{ marginInline: "auto" }}
          >
            <motion.div
              className="flex flex-col items-center text-center"
              initial={{ opacity: 0, x: -28 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="mb-3 rounded-full bg-white/45 px-4 py-1.5 text-[11px] font-medium tracking-[0.16em] text-[#6e6256] shadow-sm backdrop-blur-md sm:text-[12px]"
              style={{ padding: "4px" }}
              >
                FRESH • HOMEMADE • DELICIOUS
              </span>

              <h1 className="max-w-140 text-[42px] font-medium leading-[0.98] tracking-[-1.7px] sm:text-[52px] lg:text-[64px]"
              style={{ marginTop: "20px" }}
              >
                Delicious Soup Is
                <br />
                Waiting For You
              </h1>

              <p className=" max-w-107.5 text-[13px] leading-[1.45] text-[#3d3b38] sm:text-[15px]"
               style={{ marginTop: "40px" }}
               >
                 
               The Best Soup In Town, Now Serving at Your Comfort. Order Now and Savor the Flavor, Crafted with Fresh Ingredients and Love.
              </p>

              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/menu"
                  className="transition hover:-translate-y-0.5"
                  style={{
                    padding:       "7px 17px",
                    borderRadius:  "999px",
                    background:    "linear-gradient(135deg, #F97316, #EA580C)",
                    color:         "white",
                    fontSize:      "14px",
                    fontWeight:    700,
                    letterSpacing: "0.04em",
                    boxShadow:     "0 12px 30px rgba(249,115,22,0.5)",
                  }}
                >
                  View Menu
                </Link>

                <a
                  href="https://maps.google.com/?q=Mama+Soups+Hussaini+Manzil+Saddar+Karachi"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition hover:-translate-y-0.5"
                  style={{
                    display:       "inline-flex",
                    alignItems:    "center",
                    gap:           "8px",
                    padding:       "6px 16px",
                    borderRadius:  "999px",
                    background:    "box-blur(0px, 2px, 4px, rgba(1, 1, 1, 0.5))",
                    border:        "2px solid #F97316",
                    color:         "#EA580C",
                    fontSize:      "14px",
                    fontWeight:    700,
                    letterSpacing: "0.04em",
                  }}
                >
                  ⭐ Google Reviews
                </a>
              </div>
            </motion.div>

            <motion.div
              className="relative mx-auto h-75 w-75 sm:h-87.5 sm:w-87.5 lg:h-105 lg:w-105"
              initial={{ opacity: 0, scale: 0.88 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.75, delay: 0.1 }}
            >
              <div className="absolute inset-[-8%] rounded-full bg-[#f09a4b]/28 blur-[55px]" />
              <div className="absolute inset-[6%] rounded-full border border-white/55 bg-white/18 shadow-[0_26px_75px_rgba(87,58,26,0.18)] backdrop-blur-[2px]" />
              <div className="absolute inset-[12%] rounded-full bg-linear-to-br from-white/45 via-transparent to-[#f2b36f]/20 blur-[2px]" />
              <div className="relative h-full w-full overflow-hidden rounded-full border-4 border-white/75 shadow-[0_20px_60px_rgba(74,48,25,0.22)]">
                <Image
                  src="/images/soup.png"
                  alt="Mama Soups"
                  fill
                  priority
                  sizes="420px"
                  className="object-cover"
                />
              </div>
            </motion.div>
          </div>
        </section>

        {/* TOP LIST */}
        <section className="mt-20 flex w-full flex-col items-center py-4 sm:mt-16">
          <motion.div
            className="mb-8 text-center"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.2em] text-[#89735f]"
            style={{ marginTop: "40px" }}>
              Our favourites
            </p>
            <h2 className="text-[34px] font-medium leading-none tracking-[-1px] sm:text-[42px]">
              Top List
            </h2>
            
          </motion.div>

          <div
            className="mx-auto grid w-full max-w-280 grid-cols-1 place-items-center gap-7 md:grid-cols-3"
            style={{padding: "4px", marginTop: "40px", marginInline: "auto" }}
          >
            {topFoods.map((food, index) => (
              <motion.article
                key={food.id}
                className="relative w-full max-w-85 min-h-77.5 overflow-hidden rounded-[30px] px-5 pb-5 pt-6 shadow-[0_18px_40px_rgba(61,47,29,0.13)] backdrop-blur-sm sm:min-h-82.5"
                 style={{
                  padding: "4px",
                  background: "rgba(250,248,242,0.86)",
                }}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.1, y: -6 }}
              >
                <div className="absolute right-4 top-4 rounded-full bg-white/28 px-2.5 py-1 text-[9px] font-medium uppercase tracking-[0.13em] backdrop-blur-md"
                style={{ padding: "4px", background: "rgba(255, 255, 255, 0.28)" }}
                >
                  {index === 0 ? "Popular" : index === 1 ? "Chef Pick" : "Fresh"}
                </div>

                <div className="relative mx-auto mt-1 h-37.5 w-37.5 overflow-hidden rounded-full border-4 border-white/90 shadow-[0_8px_20px_rgba(0,0,0,0.13)] sm:h-41.25 sm:w-41.25"
                style={{ marginInline: "auto" }}
                >
                  {food.image ? (
                    <Image
                      src={food.image}
                      alt={food.name}
                      fill
                      sizes="165px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-[#eee9df] text-5xl">
                      🍜
                    </div>
                  )}
                </div>

                <div className="mt-4 flex items-center justify-center gap-2">
                  <div className="flex gap-0.5"
                  style={{ marginTop: "10px"}}
                  >
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={13}
                        fill="currentColor"
                        className="text-[#e7ba35]"
                      />
                    ))}
                  </div>
                  <span
                    className="text-[11px]"
                    style={{ marginTop: "12px", color: "#777" }}
                  >
                    {index === 0 ? "8.1" : index === 1 ? "9.2" : "8.5"}
                  </span>
                </div>

                <h3
                  className="mt-2 line-clamp-1 text-center text-[17px] font-semibold sm:text-[19px]"
                  style={{marginInline: "auto", color: "#222" }}
                >
                  {food.name}
                </h3>

                <p
                  className="mx-auto mt-1.5 line-clamp-2 min-h-9 max-w-67.5 text-center text-[11px] leading-[1.35] sm:text-[12px]"
                   style={{marginInline: "auto", color: "#74706a" }}
                >
                  {food.description}
                </p>

                <div className="mt-4 flex items-center justify-between">
                  <span
                    className="text-[15px] font-bold sm:text-[16px]"
                     style={{ padding: "16px", color: "#222" }}
                  >
                    Rs.{food.offerPrice ?? food.price}
                  </span>

                  <motion.button
                    type="button"
                    onClick={() => handleAdd(food)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.92 }}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F97316] text-white shadow-md"
                    aria-label={`Add ${food.name} to cart`}
                  >
                    <ShoppingCart size={20} />
                  </motion.button>
                </div>
              </motion.article>
            ))}
          </div>
        </section>

        {/* FRIES FEATURE */}
        <section className="mt-14 flex w-full flex-col items-center py-6 sm:mt-20"
        style={{ marginTop: "40px", padding: "16px" }}>
          <div
            className="mx-auto grid w-full max-w-400 items-center justify-items-center gap-8 px-4 py-6 md:grid-cols-2 md:gap-12 md:px-8 md:py-8"
            style={{ marginInline: "auto" }}
          >
            <motion.div
              className="relative mx-auto h-70 w-full max-w-152.5 sm:h-85 lg:h-97.5"
              initial={{ opacity: 0, x: -28 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="absolute inset-[12%] rounded-full bg-[#f3b267]/25 blur-[70px]" />
              <Image
                src="/images/friessalsa.png"
                alt="Best French Fries"
                fill
                sizes="2500px"
                className="object-contain object-center"
              />
            </motion.div>

            <motion.div
              className="flex flex-col items-center text-center"
              initial={{ opacity: 0, x: 26 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.2em] text-[#8b7054]">
                Crispy perfection
              </p>
              <h2 className="text-[34px] font-medium leading-[1.03] tracking-[-1.1px] sm:text-[44px]">
                Best Potatoes For
                <br />
                French Fries
              </h2>

              <p className="mt-4 max-w-107.5 text-[12px] leading-[1.45] text-[#403c37] sm:text-[13px]">
                Russet potatoes are ideal. Since they&apos;re dense, they don&apos;t
                contain as much water inside, which allows them to get extra crispy.
              </p>

              <Link
                href="/menu"
                className="mt-5 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/80 shadow-[0_8px_24px_rgba(68,49,27,0.11)] transition hover:scale-105"
                aria-label="Order now"
              >
                <ArrowUpRight size={18} />
              </Link>
            </motion.div>
          </div>
        </section>

        {/* SERVICES */}
        <section className="mt-12 flex w-full flex-col items-center pb-6 pt-2 sm:mt-16">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.2em] text-[#89735f]">
              Everything in one place
            </p>
            <h2 className="text-[28px] font-medium tracking-[-0.6px] sm:text-[34px]">
              Our services
            </h2>
          </motion.div>

          <div
            className="mx-auto mt-8 grid w-full max-w-245 grid-cols-2 gap-6 sm:grid-cols-3 sm:gap-8"
            style={{ marginTop: "32px", marginInline: "auto" }}
          >
            <Link
              href="/menu"
              className="flex flex-col items-center gap-2 text-center transition hover:-translate-y-1"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-full border border-[#72685d]/55 bg-white/35 shadow-sm backdrop-blur-md sm:h-16 sm:w-16">
                <CalendarDays size={21} />
              </span>
              <span className="text-[10px] font-medium text-[#45403b] sm:text-[11px]">
                Online Order
              </span>
            </Link>

            <a
              href="tel:03332287497"
              className="flex flex-col items-center gap-2 text-center transition hover:-translate-y-1"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-full border border-[#72685d]/55 bg-white/35 shadow-sm backdrop-blur-md sm:h-16 sm:w-16">
                <Utensils size={21} />
              </span>
              <span className="text-[10px] font-medium text-[#45403b] sm:text-[11px]">
                Catering service
              </span>
            </a>

           

           <Link
              href="#delivery-areas"
              onClick={(e) => {e.preventDefault();
                document.getElementById("delivery-areas")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="flex flex-col items-center gap-2 text-center transition hover:-translate-y-1"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-full border border-[#72685d]/55 bg-white/35 shadow-sm backdrop-blur-md sm:h-16 sm:w-16">
                <Truck size={21} />
              </span>
              <span className="text-[10px] font-medium text-[#45403b] sm:text-[11px]">
                Delivery Areas
              </span>
            </Link>
          </div>
        </section>
      </div>

      <AIAssistant
        menuItems={featuredFoods.map((food) => ({
          id: food.id,
          name: food.name,
          price: food.price,
          offerPrice: food.offerPrice,
          description: food.description,
          category: food.category.name,
        }))}
      />
    </main>
  );
}

"use client";

import { motion } from "framer-motion";
import { ShoppingCart, Tag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCartStore, CartStore } from "../../store/cartStore";
import toast from "react-hot-toast";

interface Food {
  id:          number;
  name:        string;
  description: string;
  price:       number;
  offerPrice:  number | null;
  image:       string | null;
  category:    { name: string };
}

interface FeaturedFoodsProps {
  foods: Food[];
}

export default function FeaturedFoods({ foods }: FeaturedFoodsProps) {
  const addItem = useCartStore((state: CartStore) => state.addItem);

  const handleAddToCart = (food: Food) => {
    addItem({
      id:       food.id,
      name:     food.name,
      price:    food.offerPrice ?? food.price,
      image:    food.image,
      quantity: 1,
    });
    toast.success(`${food.name} added to cart! 🛒`);
  };

  if (foods.length === 0) return null;

  // Show only first 3
  const featuredFoods = foods.slice(0, 3);

  return (
    <section
      className="py-20 px-4"
      style={{padding: "12px 16px",  background: "#737373" }}
      id="featured"
    >
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p
            className="text-xs tracking-[0.3em] uppercase mb-3"
            style={{padding:"2px 4px", color: "#F59E0B" }}
          >
            Customer Favourites
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-white">
            Featured <span style={{ color: "#F59E0B" }}>Foods</span>
          </h2>
        </motion.div>

        {/* 3 Food Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-10 flex-wrap">
          {featuredFoods.map((food, i) => (
            <motion.div
              key={food.id}
              className="rounded-2xl overflow-hidden group"
              style={{
                padding: "9px 9px",
                background: "#111111",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -4 }}
            >
              {/* Image */}
              <div
                className="relative h-52 overflow-hidden flex items-center justify-center text-6xl"
                style={{ padding:"9px 9px", background: "rgba(245,158,11,0.05)" }}
              >
                {food.image ? (
                  <Image
                    src={food.image}
                    alt={food.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                ) : (
                  <span>🍽️</span>
                )}

                {food.offerPrice && (
                  <div
                    className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold text-black"
                    style={{ background: "#F59E0B" }}
                  >
                    <Tag size={10} />
                    OFFER
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-5 flex flex-col gap-3">
                <div>
                  <p className="text-xs mb-1" style={{ color: "#F59E0B" }}>
                    {food.category.name}
                  </p>
                  <h3 className="font-bold text-white text-lg leading-tight">
                    {food.name}
                  </h3>
                  <p
                    className="text-xs mt-1 line-clamp-2"
                    style={{ color: "rgba(255,255,255,0.5)" }}
                  >
                    {food.description}
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    {food.offerPrice ? (
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-lg" style={{ color: "#F59E0B" }}>
                          Rs.{food.offerPrice}
                        </span>
                        <span
                          className="text-xs line-through"
                          style={{ color: "rgba(255,255,255,0.35)" }}
                        >
                          Rs.{food.price}
                        </span>
                      </div>
                    ) : (
                      <span className="font-bold text-lg" style={{ color: "#F59E0B" }}>
                        Rs.{food.price}
                      </span>
                    )}
                  </div>

                  <motion.button
                    onClick={() => handleAddToCart(food)}
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-black font-bold"
                    style={{ background: "#F59E0B" }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    aria-label={`Add ${food.name} to cart`}
                  >
                    <ShoppingCart size={16} />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View Full Menu Button */}
        <motion.div
          className="text-center mt-4 mb-8"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <Link
            href="/menu"
            className=" inline-flex items-center gap-2 px-8 py-10 rounded-full font-bold text-black transition-all hover:scale-105"
            style={{
              padding: "4px 8px",
              background:  "#F59E0B",
              boxShadow:   "0 4px 20px rgba(245,158,11,0.35)",
            }}
          >
            View Full Menu →
          </Link>
        </motion.div>

      </div>
    </section>
  );
}
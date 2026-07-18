"use client";

import { motion } from "framer-motion";
import { ShoppingCart, Star, Tag } from "lucide-react";
import Image from "next/image";
import { useCartStore, CartStore } from "../../store/cartStore";
import toast from "react-hot-toast";

// This is the shape of a food item coming from the database
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

  return (
    <section className="py-20 px-4" style={{ background: "#737373" }} id="featured">
      <div className="max-w-7xl mx-auto ">

        {/* Section Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-xs tracking-[0.3em] uppercase mb-3"
             style={{ color: "#F59E0B" }}>
            Customer Favourites
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-white">
            Featured <span style={{ color: "#F59E0B" }}>Foods</span>
          </h2>
        </motion.div>

        {/* Food Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {foods.map((food, i) => (
            <motion.div
              key={food.id}
              className="rounded-2xl overflow-hidden group"
              style={{
                background: "#111111",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -4 }}
            >
              {/* Food Image */}
              <div
                className="relative h-48 overflow-hidden flex items-center justify-center text-6xl"
                style={{ background: "rgba(245,158,11,0.05)" }}
              >
                {food.image ? (
                  <Image
                    src={food.image}
                    alt={food.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <span>🍽️</span>
                )}

                {/* Offer badge */}
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

              {/* Food Info */}
              <div className="p-4 flex flex-col gap-3">
                <div>
                  <p className="text-xs mb-1" style={{ color: "#F59E0B" }}>
                    {food.category.name}
                  </p>
                  <h3 className="font-bold text-white text-lg leading-tight">
                    {food.name}
                  </h3>
                  <p className="text-xs mt-1 line-clamp-2"
                     style={{ color: "rgba(255,255,255,0.5)" }}>
                    {food.description}
                  </p>
                </div>

                {/* Price + Add to Cart */}
                <div className="flex items-center justify-between mt-auto">
                  <div>
                    {food.offerPrice ? (
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-lg" style={{ color: "#F59E0B" }}>
                          Rs.{food.offerPrice}
                        </span>
                        <span className="text-xs line-through"
                              style={{ color: "rgba(255,255,255,0.35)" }}>
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
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-black font-bold transition-all"
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
      </div>
    </section>
  );
}
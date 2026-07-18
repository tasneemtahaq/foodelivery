"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, X, Check } from "lucide-react";
import toast from "react-hot-toast";
import type { AdminFood, AdminCategory } from "./page";

interface FoodForm {
  name:        string;
  description: string;
  price:       string;
  offerPrice:  string;
  categoryId:  string;
  isAvailable: boolean;
  isFeatured:  boolean;
}

const EMPTY_FORM: FoodForm = {
  name:        "",
  description: "",
  price:       "",
  offerPrice:  "",
  categoryId:  "",
  isAvailable: true,
  isFeatured:  false,
};

export default function AdminFoodsClient({
  foods:      initialFoods,
  categories,
}: {
  foods:      AdminFood[];
  categories: AdminCategory[];
}) {
  const [foods,       setFoods]       = useState(initialFoods);
  const [showModal,   setShowModal]   = useState(false);
  const [editingFood, setEditingFood] = useState<AdminFood | null>(null);
  const [form,        setForm]        = useState<FoodForm>(EMPTY_FORM);
  const [loading,     setLoading]     = useState(false);
  const [deletingId,  setDeletingId]  = useState<number | null>(null);

  // Open Add modal
  const openAdd = () => {
    setEditingFood(null);
    setForm(EMPTY_FORM);
    setShowModal(true);
  };

  // Open Edit modal
  const openEdit = (food: AdminFood) => {
    setEditingFood(food);
    setForm({
      name:        food.name,
      description: food.description,
      price:       String(food.price),
      offerPrice:  food.offerPrice ? String(food.offerPrice) : "",
      categoryId:  String(food.categoryId),
      isAvailable: food.isAvailable,
      isFeatured:  food.isFeatured,
    });
    setShowModal(true);
  };

  // Handle form submit (Add or Edit)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name || !form.price || !form.categoryId) {
      toast.error("Please fill in name, price, and category");
      return;
    }

    setLoading(true);

    try {
      const payload = {
  name:        form.name.trim(),
  description: form.description.trim(),
  price:       form.price,
  offerPrice:  form.offerPrice || null,
  categoryId:  form.categoryId,
  isAvailable: form.isAvailable,
  isFeatured:  form.isFeatured,
};

      if (editingFood) {
        // EDIT existing food
        const res = await fetch(`/api/foods/${editingFood.id}`, {
          method:  "PATCH",
          headers: { "Content-Type": "application/json" },
          body:    JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Failed to update");
        const updated = await res.json();

        setFoods((prev) =>
          prev.map((f) => (f.id === editingFood.id ? updated.food : f))
        );
        toast.success("Food updated! ✅");
      } else {
        // ADD new food
        const res = await fetch("/api/foods", {
          method:  "POST",
          headers: { "Content-Type": "application/json" },
          body:    JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Failed to add");
        const created = await res.json();

        setFoods((prev) => [created.food, ...prev]);
        toast.success("Food added! 🎉");
      }

      setShowModal(false);
    } catch (error) {
      console.error("Full error:", error);
      const message = error instanceof Error ? error.message : "Unknown error";
      toast.error(`Error: ${message}`);
    } finally {
      setLoading(false);
    }
  };

  // Delete food
  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Delete "${name}"?`)) return;

    setDeletingId(id);
    try {
      const res  = await fetch(`/api/foods/${id}`, { method: "DELETE" });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error ?? "Failed to delete");

      if (data.softDelete) {
        // Food had orders — just mark as unavailable in UI
        setFoods((prev) =>
          prev.map((f) =>
            f.id === id ? { ...f, isAvailable: false } : f
          )
        );
        toast(`"${name}" hidden from menu (has existing orders)`, {
          icon: "ℹ️",
        });
      } else {
        // Fully deleted
        setFoods((prev) => prev.filter((f) => f.id !== id));
        toast.success(`"${name}" deleted!`);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete — check console");
    } finally {
      setDeletingId(null);
    }
  };
  
  // Toggle availability
 const toggleAvailability = async (food: AdminFood) => {
    try {
      const newValue = !food.isAvailable;
      const res = await fetch(`/api/foods/${food.id}`, {
        method:  "PATCH",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ isAvailable: newValue }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Toggle error:", data);
        throw new Error(data.error ?? "Failed");
      }

      setFoods((prev) =>
        prev.map((f) => (f.id === food.id ? data.food : f))
      );
      toast.success(
        !food.isAvailable ? "Food is now available!" : "Food hidden from menu"
      );
    } catch {
      toast.error("Failed to update");
    }
  };

  const inputStyle = {
    width:        "100%",
    padding:      "10px 14px",
    borderRadius: "10px",
    border:       "1px solid rgba(255,255,255,0.1)",
    background:   "rgba(255,255,255,0.05)",
    color:        "white",
    fontSize:     "14px",
    outline:      "none",
  };

  const labelStyle = {
    display:       "block",
    fontSize:      "11px",
    fontWeight:    "600" as const,
    color:         "#9CA3AF",
    marginBottom:  "6px",
    textTransform: "uppercase" as const,
    letterSpacing: "0.05em",
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Foods</h1>
          <p className="text-sm mt-1" style={{ color: "#6B7280" }}>
            {foods.length} items on menu
          </p>
        </div>
        <motion.button
          onClick={openAdd}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-white"
          style={{ background: "linear-gradient(135deg,#F97316,#EA580C)" }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <Plus size={18} />
          Add Food
        </motion.button>
      </div>

      {/* Foods Table */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          background: "#1A1A1A",
          border: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              {["Name", "Category", "Price", "Available", "Featured", "Actions"].map((h) => (
                <th
                  key={h}
                  className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  style={{ color: "#6B7280" }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {foods.map((food, i) => (
              <motion.tr
                key={food.id}
                style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.03 }}
              >
                <td className="px-5 py-3">
                  <div>
                    <p className="text-sm font-medium text-white">{food.name}</p>
                    <p
                      className="text-xs mt-0.5 line-clamp-1 max-w-50"
                      style={{ color: "#6B7280" }}
                    >
                      {food.description}
                    </p>
                  </div>
                </td>
                <td className="px-5 py-3">
                  <span
                    className="px-2 py-1 rounded-lg text-xs font-medium"
                    style={{
                      background: "rgba(249,115,22,0.1)",
                      color:      "#F97316",
                    }}
                  >
                    {food.category.name}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <div>
                    <p className="text-sm font-bold text-white">
                      Rs.{food.offerPrice ?? food.price}
                    </p>
                    {food.offerPrice && (
                      <p
                        className="text-xs line-through"
                        style={{ color: "#6B7280" }}
                      >
                        Rs.{food.price}
                      </p>
                    )}
                  </div>
                </td>
                <td className="px-5 py-3">
                  <button
                    onClick={() => toggleAvailability(food)}
                    className="w-12 h-6 rounded-full transition-all duration-300 relative"
                    style={{
                      background: food.isAvailable
                        ? "#10B981"
                        : "rgba(255,255,255,0.1)",
                    }}
                  >
                    <div
                      className="absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300"
                      style={{ left: food.isAvailable ? "28px" : "4px" }}
                    />
                  </button>
                </td>
                <td className="px-5 py-3">
                  {food.isFeatured ? (
                    <span style={{ color: "#F59E0B" }}>⭐ Yes</span>
                  ) : (
                    <span style={{ color: "#6B7280" }}>— No</span>
                  )}
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <motion.button
                      onClick={() => openEdit(food)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{
                        background: "rgba(59,130,246,0.1)",
                        color:      "#3B82F6",
                      }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Pencil size={14} />
                    </motion.button>
                    <motion.button
                      onClick={() => handleDelete(food.id, food.name)}
                      disabled={deletingId === food.id}
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{
                        background: "rgba(239,68,68,0.1)",
                        color:      "#EF4444",
                      }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Trash2 size={14} />
                    </motion.button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Add/Edit Modal ── */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.8)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{   opacity: 0 }}
            onClick={() => setShowModal(false)}
          >
            <motion.div
              className="w-full max-w-lg rounded-2xl p-6"
              style={{
                background: "#1A1A1A",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1,   opacity: 1 }}
              exit={{   scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">
                  {editingFood ? "Edit Food" : "Add New Food"}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  style={{ color: "#6B7280" }}
                >
                  <X size={20} />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {/* Name */}
                <div>
                  <label style={labelStyle}>Food Name *</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, name: e.target.value }))
                    }
                    placeholder="e.g. Chicken Corn Soup"
                    style={inputStyle}
                  />
                </div>

                {/* Description */}
                <div>
                  <label style={labelStyle}>Description</label>
                  <textarea
                    value={form.description}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, description: e.target.value }))
                    }
                    placeholder="Brief description of the food..."
                    rows={2}
                    style={{ ...inputStyle, resize: "none" }}
                  />
                </div>

                {/* Price + Offer Price */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label style={labelStyle}>Price (Rs.) *</label>
                    <input
                      type="number"
                      value={form.price}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, price: e.target.value }))
                      }
                      placeholder="150"
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Offer Price (Rs.)</label>
                    <input
                      type="number"
                      value={form.offerPrice}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, offerPrice: e.target.value }))
                      }
                      placeholder="Optional"
                      style={inputStyle}
                    />
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label style={labelStyle}>Category *</label>
                  <select
                    value={form.categoryId}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, categoryId: e.target.value }))
                    }
                    style={{
                      ...inputStyle,
                      cursor: "pointer",
                    }}
                  >
                    <option value="" style={{ background: "#1A1A1A" }}>
                      Select category...
                    </option>
                    {categories.map((cat) => (
                      <option
                        key={cat.id}
                        value={cat.id}
                        style={{ background: "#1A1A1A" }}
                      >
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Toggles */}
                <div className="flex gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.isAvailable}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, isAvailable: e.target.checked }))
                      }
                    />
                    <span className="text-sm" style={{ color: "#D1D5DB" }}>
                      Available on menu
                    </span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.isFeatured}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, isFeatured: e.target.checked }))
                      }
                    />
                    <span className="text-sm" style={{ color: "#D1D5DB" }}>
                      Featured on homepage
                    </span>
                  </label>
                </div>

                {/* Submit */}
                <motion.button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl font-bold text-white flex items-center justify-center gap-2 mt-2"
                  style={{
                    background: loading
                      ? "#4B5563"
                      : "linear-gradient(135deg,#F97316,#EA580C)",
                  }}
                  whileHover={!loading ? { scale: 1.02 } : {}}
                  whileTap={!loading ? { scale: 0.98 } : {}}
                >
                  {loading ? (
                    <motion.div
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                  ) : (
                    <>
                      <Check size={18} />
                      {editingFood ? "Save Changes" : "Add Food"}
                    </>
                  )}
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
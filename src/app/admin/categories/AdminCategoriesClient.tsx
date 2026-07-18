"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, X, Check, Tag } from "lucide-react";
import toast from "react-hot-toast";
import type { AdminCategory } from "./page";

export default function AdminCategoriesClient({
  categories: initialCategories,
}: {
  categories: AdminCategory[];
}) {
  const [categories, setCategories] = useState(initialCategories);
  const [showModal,  setShowModal]  = useState(false);
  const [editingCat, setEditingCat] = useState<AdminCategory | null>(null);
  const [name,       setName]       = useState("");
  const [loading,    setLoading]    = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const openAdd = () => {
    setEditingCat(null);
    setName("");
    setShowModal(true);
  };

  const openEdit = (cat: AdminCategory) => {
    setEditingCat(cat);
    setName(cat.name);
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { toast.error("Name is required"); return; }

    setLoading(true);
    try {
      if (editingCat) {
        const res  = await fetch(`/api/categories/${editingCat.id}`, {
          method:  "PATCH",
          headers: { "Content-Type": "application/json" },
          body:    JSON.stringify({ name: name.trim() }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        setCategories((prev) =>
          prev.map((c) => (c.id === editingCat.id ? { ...c, name: name.trim() } : c))
        );
        toast.success("Category updated! ✅");
      } else {
        const res  = await fetch("/api/categories", {
          method:  "POST",
          headers: { "Content-Type": "application/json" },
          body:    JSON.stringify({ name: name.trim() }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        setCategories((prev) => [...prev, data.category]);
        toast.success("Category added! 🎉");
      }
      setShowModal(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Delete "${name}"? All foods in this category will be affected.`)) return;
    setDeletingId(id);
    try {
      const res  = await fetch(`/api/categories/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setCategories((prev) => prev.filter((c) => c.id !== id));
      toast.success("Category deleted!");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Categories</h1>
          <p className="text-sm mt-1" style={{ color: "#6B7280" }}>
            {categories.length} categories
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
          Add Category
        </motion.button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat, i) => (
          <motion.div
            key={cat.id}
            className="p-5 rounded-2xl flex items-center justify-between"
            style={{
              background: "#1A1A1A",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: "rgba(249,115,22,0.1)" }}
              >
                <Tag size={18} style={{ color: "#F97316" }} />
              </div>
              <div>
                <p className="font-bold text-white">{cat.name}</p>
                <p className="text-xs mt-0.5" style={{ color: "#6B7280" }}>
                  {cat._count.foods} food{cat._count.foods !== 1 ? "s" : ""}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <motion.button
                onClick={() => openEdit(cat)}
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: "rgba(59,130,246,0.1)", color: "#3B82F6" }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Pencil size={14} />
              </motion.button>
              <motion.button
                onClick={() => handleDelete(cat.id, cat.name)}
                disabled={deletingId === cat.id || cat._count.foods > 0}
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{
                  background: cat._count.foods > 0
                    ? "rgba(255,255,255,0.05)"
                    : "rgba(239,68,68,0.1)",
                  color: cat._count.foods > 0 ? "#4B5563" : "#EF4444",
                }}
                whileHover={cat._count.foods === 0 ? { scale: 1.1 } : {}}
                whileTap={cat._count.foods === 0 ? { scale: 0.9 } : {}}
                title={cat._count.foods > 0
                  ? "Remove all foods first before deleting"
                  : "Delete category"}
              >
                <Trash2 size={14} />
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Add/Edit Modal */}
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
              className="w-full max-w-md rounded-2xl p-6"
              style={{
                background: "#1A1A1A",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1,   opacity: 1 }}
              exit={{   scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-bold text-white">
                  {editingCat ? "Edit Category" : "Add Category"}
                </h2>
                <button onClick={() => setShowModal(false)}
                        style={{ color: "#6B7280" }}>
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-2"
                       style={{ color: "#9CA3AF" }}>
                  Category Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Soups, Fries, Drinks..."
                  className="w-full px-4 py-3 rounded-xl outline-none text-white mb-4"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                  autoFocus
                />
                <motion.button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl font-bold text-white flex items-center justify-center gap-2"
                  style={{
                    background: loading
                      ? "#4B5563"
                      : "linear-gradient(135deg,#F97316,#EA580C)",
                  }}
                  whileHover={!loading ? { scale: 1.02 } : {}}
                >
                  {loading ? "Saving..." : (
                    <><Check size={16} />{editingCat ? "Save" : "Add"}</>
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
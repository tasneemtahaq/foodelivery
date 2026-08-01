"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Pencil, Check, X, Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

interface DeliveryArea {
  id:             number;
  name:           string;
  deliveryCharge: number;
  isActive:       boolean;
}

export default function DeliveryAreasClient({
  areas: initialAreas,
}: {
  areas: DeliveryArea[];
}) {
  const [areas,     setAreas]     = useState(initialAreas);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName,  setEditName]  = useState("");
  const [editCharge,setEditCharge]= useState("");
  const [newName,   setNewName]   = useState("");
  const [newCharge, setNewCharge] = useState("");
  const [showAdd,   setShowAdd]   = useState(false);

  const startEdit = (area: DeliveryArea) => {
    setEditingId(area.id);
    setEditName(area.name);
    setEditCharge(String(area.deliveryCharge));
  };

  const saveEdit = async (id: number) => {
    try {
      const res  = await fetch(`/api/delivery-areas/${id}`, {
        method:  "PATCH",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          name:           editName,
          deliveryCharge: parseInt(editCharge),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setAreas((prev) =>
        prev.map((a) =>
          a.id === id
            ? { ...a, name: editName, deliveryCharge: parseInt(editCharge) }
            : a
        )
      );
      setEditingId(null);
      toast.success("Area updated! ✅");
    } catch (error) {
      toast.error(String(error));
    }
  };

  const toggleActive = async (area: DeliveryArea) => {
    try {
      await fetch(`/api/delivery-areas/${area.id}`, {
        method:  "PATCH",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ isActive: !area.isActive }),
      });
      setAreas((prev) =>
        prev.map((a) =>
          a.id === area.id ? { ...a, isActive: !a.isActive } : a
        )
      );
      toast.success(area.isActive ? "Area disabled" : "Area enabled");
    } catch {
      toast.error("Failed to update");
    }
  };

  const deleteArea = async (id: number, name: string) => {
    if (!confirm(`Delete "${name}"?`)) return;
    try {
      await fetch(`/api/delivery-areas/${id}`, { method: "DELETE" });
      setAreas((prev) => prev.filter((a) => a.id !== id));
      toast.success("Area deleted!");
    } catch {
      toast.error("Failed to delete");
    }
  };

  const addArea = async () => {
    if (!newName || !newCharge) {
      toast.error("Fill in name and charge");
      return;
    }
    try {
      const res  = await fetch("/api/delivery-areas", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          name:           newName,
          deliveryCharge: parseInt(newCharge),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setAreas((prev) => [...prev, data.area].sort((a, b) => a.deliveryCharge - b.deliveryCharge));
      setNewName("");
      setNewCharge("");
      setShowAdd(false);
      toast.success("Area added! ✅");
    } catch (error) {
      toast.error(String(error));
    }
  };

  const inputStyle = {
    background:   "rgba(255,255,255,0.05)",
    border:       "1px solid rgba(255,255,255,0.15)",
    borderRadius: "8px",
    padding:      "6px 10px",
    color:        "white",
    fontSize:     "14px",
    outline:      "none",
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Delivery Areas</h1>
          <p className="text-sm mt-1" style={{ color: "#6B7280" }}>
            Manage delivery charges per area
          </p>
        </div>
        <motion.button
          onClick={() => setShowAdd((s) => !s)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-white"
          style={{ background: "linear-gradient(135deg,#F97316,#EA580C)" }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <Plus size={18} />
          Add Area
        </motion.button>
      </div>

      {/* Add New Area Form */}
      {showAdd && (
        <motion.div
          className="p-4 rounded-2xl mb-6 flex flex-wrap gap-3 items-end"
          style={{ background: "#1A1A1A", border: "1px solid rgba(249,115,22,0.2)" }}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex flex-col gap-1">
            <label className="text-xs" style={{ color: "#9CA3AF" }}>Area Name</label>
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="e.g. Gulshan"
              style={{ ...inputStyle, minWidth: "180px" }}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs" style={{ color: "#9CA3AF" }}>Delivery Charge (Rs.)</label>
            <input
              type="number"
              value={newCharge}
              onChange={(e) => setNewCharge(e.target.value)}
              placeholder="e.g. 300"
              style={{ ...inputStyle, width: "120px" }}
            />
          </div>
          <button
            onClick={addArea}
            className="px-4 py-2 rounded-lg font-bold text-white text-sm"
            style={{ background: "#F97316" }}
          >
            Add
          </button>
          <button
            onClick={() => setShowAdd(false)}
            className="px-4 py-2 rounded-lg text-sm"
            style={{ color: "#6B7280" }}
          >
            Cancel
          </button>
        </motion.div>
      )}

      {/* Areas Table */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{ background: "#1A1A1A", border: "1px solid rgba(255,255,255,0.06)" }}
      >
        {/* Table Header */}
        <div
          className="grid grid-cols-4 gap-4 px-5 py-3 text-xs font-medium uppercase tracking-wider"
          style={{
            color:        "#6B7280",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <span>Area Name</span>
          <span>Delivery Charge</span>
          <span>Status</span>
          <span>Actions</span>
        </div>

        {/* Rows */}
        {areas.map((area, i) => (
          <motion.div
            key={area.id}
            className="grid grid-cols-4 gap-4 px-5 py-4 items-center"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.03 }}
          >
            {/* Name */}
            <div>
              {editingId === area.id ? (
                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  style={{ ...inputStyle, width: "100%" }}
                />
              ) : (
                <p className="text-sm font-medium text-white">{area.name}</p>
              )}
            </div>

            {/* Charge */}
            <div>
              {editingId === area.id ? (
                <div className="flex items-center gap-1">
                  <span className="text-sm" style={{ color: "#9CA3AF" }}>Rs.</span>
                  <input
                    type="number"
                    value={editCharge}
                    onChange={(e) => setEditCharge(e.target.value)}
                    style={{ ...inputStyle, width: "80px" }}
                  />
                </div>
              ) : (
                <span
                  className="px-3 py-1 rounded-lg text-sm font-bold"
                  style={{ background: "rgba(249,115,22,0.1)", color: "#F97316" }}
                >
                  Rs.{area.deliveryCharge}
                </span>
              )}
            </div>

            {/* Status Toggle */}
            <div>
              <button
                onClick={() => toggleActive(area)}
                className="flex items-center gap-2 text-xs font-medium"
              >
                <div
                  className="w-10 h-5 rounded-full relative transition-all"
                  style={{ background: area.isActive ? "#10B981" : "rgba(255,255,255,0.1)" }}
                >
                  <div
                    className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all"
                    style={{ left: area.isActive ? "22px" : "2px" }}
                  />
                </div>
                <span style={{ color: area.isActive ? "#10B981" : "#6B7280" }}>
                  {area.isActive ? "Active" : "Disabled"}
                </span>
              </button>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {editingId === area.id ? (
                <>
                  <motion.button
                    onClick={() => saveEdit(area.id)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: "rgba(16,185,129,0.1)", color: "#10B981" }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Check size={14} />
                  </motion.button>
                  <motion.button
                    onClick={() => setEditingId(null)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: "rgba(239,68,68,0.1)", color: "#EF4444" }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X size={14} />
                  </motion.button>
                </>
              ) : (
                <>
                  <motion.button
                    onClick={() => startEdit(area)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: "rgba(59,130,246,0.1)", color: "#3B82F6" }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Pencil size={14} />
                  </motion.button>
                  <motion.button
                    onClick={() => deleteArea(area.id, area.name)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: "rgba(239,68,68,0.1)", color: "#EF4444" }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Trash2 size={14} />
                  </motion.button>
                </>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
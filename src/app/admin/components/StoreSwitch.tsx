"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function StoreSwitch() {
  const [open,   setOpen]   = useState<boolean | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/store-status", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => setOpen(d.open !== false))
      .catch(() => setOpen(null));
  }, []);

  const toggle = async () => {
    if (open === null || saving) return;
    const next = !open;

    if (
      !next &&
      !confirm("Close orders now? Customers will not be able to order until you open again.")
    ) {
      return;
    }

    setSaving(true);
    try {
      const res  = await fetch("/api/store-status", {
        method:  "PATCH",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ ordersOpen: next }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed");

      setOpen(data.open);
      toast.success(data.open ? "Orders are OPEN ✅" : "Orders are CLOSED 🔒");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not update");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      style={{
        margin:       "0 12px 12px",
        padding:      "14px",
        borderRadius: "16px",
        background:   "rgba(255,255,255,0.05)",
        border:       open === false
          ? "1px solid rgba(239,68,68,0.5)"
          : "1px solid rgba(16,185,129,0.4)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
        <span
          style={{
            width:        "10px",
            height:       "10px",
            borderRadius: "50%",
            background:   open === null ? "#6B7280" : open ? "#10B981" : "#EF4444",
          }}
        />
        <span style={{ fontSize: "13px", fontWeight: 700, color: "white" }}>
          {open === null ? "Checking..." : open ? "Taking orders" : "Orders closed"}
        </span>
      </div>

      <button
        type="button"
        onClick={toggle}
        disabled={open === null || saving}
        style={{
          width:        "100%",
          padding:      "10px",
          borderRadius: "999px",
          border:       "none",
          fontSize:     "12px",
          fontWeight:   700,
          color:        "white",
          cursor:       saving ? "not-allowed" : "pointer",
          opacity:      open === null || saving ? 0.6 : 1,
          background:   open
            ? "linear-gradient(135deg, #ef4444, #b91c1c)"
            : "linear-gradient(135deg, #10B981, #059669)",
        }}
      >
        {saving ? "Saving..." : open ? "Close orders" : "Open orders"}
      </button>
    </div>
  );
}
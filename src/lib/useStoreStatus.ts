"use client";

import { useEffect, useState } from "react";

// Asks the server "are we open?" now, and again every minute
export function useStoreStatus() {
  const [status, setStatus] = useState({ open: true, message: "" });

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const res  = await fetch("/api/store-status", { cache: "no-store" });
        const data = await res.json();
        if (!cancelled) {
          setStatus({ open: data.open !== false, message: data.message ?? "" });
        }
      } catch {
        // keep the last known answer
      }
    };

    load();
    const timer = setInterval(load, 60000);

    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, []);

  return status;
}
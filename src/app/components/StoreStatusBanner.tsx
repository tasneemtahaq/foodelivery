"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useStoreStatus } from "@/lib/useStoreStatus";

export default function StoreStatusBanner() {
  const pathname = usePathname();
  const store    = useStoreStatus();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Never show on admin pages, and only show when we are closed
  if (pathname?.startsWith("/admin") || store.open) return null;

  return (
    <div
      role="status"
      style={{
        position:      "fixed",
        // sits right under the navbar (the navbar is slightly shorter after scrolling)
        top:           scrolled ? "63px" : "75px",
        left:          0,
        right:         0,
        zIndex:        19,
        padding:       "9px 16px",
        textAlign:     "center",
        fontSize:      "13px",
        fontWeight:    700,
        color:         "white",
        background:    "linear-gradient(135deg, #b91c1c, #7f1d1d)",
        boxShadow:     "0 6px 16px rgba(127,29,29,0.35)",
        transition:    "top 0.2s",
      }}
    >
      🔒 We&apos;re closed right now and not taking orders.
    </div>
  );
}
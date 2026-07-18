"use client";

import Link from "next/link";
import { Phone, MapPin, Clock } from "lucide-react";
import Image from "next/image";

export default function Footer() {
  return (
    <footer
      className="pt-24 pb-24 px-4 mt-auto"
      style={{
        background: "#080808",
        borderTop: "1px solid rgba(245,158,11,0.1)",
      }}
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 pb-10"
           style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>

        {/* Brand */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg,#F5FEFE,#D97706)" }}
            >
              <Link href="/" className="flex items-center gap-4">
            <Image
                          src="/images/logo.png"
                          alt="Logo"
                          width={60}
                          height={60}
                          style={{ width: "auto", height: "36px", objectFit: "contain" }}
                        />
          </Link>
            </div>
            <span className="text-lg font-bold text-white">
              Mama<span style={{ color: "#F59E0B" }}>Soups</span>
            </span>
          </div>
          <p className="text-sm leading-relaxed"
             style={{ color: "rgba(255,255,255,0.45)" }}>
            Fresh, hot, delicious Soup delivered to your door anywhere in Karachi.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-xs tracking-[0.2em] uppercase mb-5 font-medium"
              style={{ color: "#F59E0B" }}>
            Quick Links
          </h4>
          <ul className="flex flex-col gap-3">
            {[
              { label: "Home",  href: "/"      },
              { label: "Menu",  href: "/menu"  },
              { label: "Cart",  href: "/cart"  },
            ].map((l) => (
              <li key={l.label}>
                <Link href={l.href}
                  className="text-sm transition-colors duration-200 hover:text-amber-400"
                  style={{ color: "rgba(255,255,255,0.5)" }}>
                  → {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-xs tracking-[0.2em] uppercase mb-5 font-medium"
              style={{ color: "#F59E0B" }}>
            Contact
          </h4>
          <ul className="flex flex-col gap-3">
            {[
              { icon: Phone,  text: "0333-2287497"           },
              { icon: MapPin, text: "Karachi, Pakistan"       },
              { icon: Clock,  text: "5:00 PM – 11:00 PM"    },
            ].map(({ icon: Icon, text }) => (
              <li key={text}
                  className="flex items-center gap-2 text-sm"
                  style={{ color: "rgba(255,255,255,0.5)" }}>
                <Icon size={14} style={{ color: "#F59E0B" }} />
                {text}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <p className="text-center text-xs pt-8"
         style={{ color: "rgba(255,255,255,0.25)" }}>
        © {new Date().getFullYear()} Mama Soups. All rights reserved.
      </p>
    </footer>
  );
}
import Link from "next/link";
import Image from "next/image";
import { Phone, MapPin, Clock, CameraIcon, PlayIcon, GlobeIcon } from "lucide-react";

const QUICK_LINKS = [
  { label: "Home",           href: "/" },
  { label: "Menu",           href: "/menu" },
  { label: "Cart",           href: "/cart" },
  { label: "Delivery Areas", href: "/delivery-areas" },
];

// TODO: replace these with your real social media page links
const SOCIALS = [
  { label: "Instagram", href: "https://instagram.com/mamasoups", icon: CameraIcon },
  { label: "Facebook",  href: "https://facebook.com/mamasoups",  icon: GlobeIcon },
  { label: "YouTube",   href: "https://youtube.com/@mamasoups",  icon: PlayIcon },
];

const headingStyle = {
  fontSize:      "12px",
  fontWeight:    700,
  letterSpacing: "0.18em",
  textTransform: "uppercase",
  color:         "#F97316",
  marginBottom:  "18px",
} as const;

const textStyle = {
  fontSize:   "13px",
  lineHeight: 1.7,
  color:      "rgba(255,244,230,0.75)",
} as const;

export default function Footer() {
  return (
    <footer
      style={{
        width:      "100%",
        background: "linear-gradient(160deg, #3a2410 0%, #2b1a0b 55%, #1f1308 100%)",
        borderTop:  "3px solid #F97316",
        padding:    "56px 20px 28px",
      }}
    >
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>

        <div
          style={{
            display:             "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
            gap:                 "40px",
          }}
        >
          {/* ── Brand ── */}
          <div>
            <div
              style={{
                display:        "inline-flex",
                alignItems:     "center",
                justifyContent: "center",
                padding:        "8px 14px",
                borderRadius:   "16px",
                background:     "#fff7ed",
                marginBottom:   "16px",
              }}
            >
              <Image
                src="/images/logo.png"
                alt="Mama Soups"
                width={90}
                height={44}
                style={{ width: "auto", height: "44px", objectFit: "contain" }}
              />
            </div>
            <p style={textStyle}>
              Hot soups, crispy fries and fresh puris, made fresh daily and
              delivered to your door in Karachi.
            </p>

            {/* Social icons */}
            <div style={{ display: "flex", gap: "10px", marginTop: "18px" }}>
              {SOCIALS.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  style={{
                    width:          "40px",
                    height:         "40px",
                    borderRadius:   "50%",
                    display:        "flex",
                    alignItems:     "center",
                    justifyContent: "center",
                    background:     "linear-gradient(135deg, #F97316, #EA580C)",
                    color:          "white",
                    boxShadow:      "0 6px 16px rgba(249,115,22,0.35)",
                  }}
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* ── Quick links ── */}
          <div>
            <h3 style={headingStyle}>Quick Links</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {QUICK_LINKS.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  style={{ fontSize: "13px", color: "rgba(255,244,230,0.85)" }}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* ── Contact ── */}
          <div>
            <h3 style={headingStyle}>Contact Us</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <a
                href="tel:03332287497"
                style={{ display: "flex", gap: "10px", ...textStyle, color: "#fff4e6" }}
              >
                <Phone size={16} style={{ color: "#F97316", flexShrink: 0, marginTop: "4px" }} />
                0333-2287497
              </a>
              <a
                href="https://maps.google.com/?q=Mama+Soups+Hussaini+Manzil+Saddar+Karachi"
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: "flex", gap: "10px", ...textStyle }}
              >
                <MapPin size={16} style={{ color: "#F97316", flexShrink: 0, marginTop: "4px" }} />
                <span>
                  Hussaini Manzil, D&apos;Cruze Lane,
                  <br />
                  Mansfield Street, Saddar, Karachi
                </span>
              </a>
            </div>
          </div>

          {/* ── Timings ── */}
          <div>
            <h3 style={headingStyle}>Opening Hours</h3>
            <div style={{ display: "flex", gap: "10px", ...textStyle }}>
              <Clock size={16} style={{ color: "#F97316", flexShrink: 0, marginTop: "4px" }} />
              <span>
                Monday to Saturday
                <br />
                <strong style={{ color: "#fff4e6" }}>5:00 PM – 11:00 PM</strong>
                <br />
                <span style={{ color: "#fca5a5" }}>Sundays: 5:00 PM – 11:00 PM </span>
              </span>
            </div>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div
          style={{
            marginTop:  "44px",
            paddingTop: "20px",
            borderTop:  "1px solid rgba(255,244,230,0.15)",
            textAlign:  "center",
            fontSize:   "12px",
            color:      "rgba(255,244,230,0.55)",
          }}
        >
          © {new Date().getFullYear()} Mama Soups. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
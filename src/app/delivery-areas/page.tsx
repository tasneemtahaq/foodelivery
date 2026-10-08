import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { MapPin, Clock, ArrowLeft, ShoppingBag } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DeliveryAreasPage() {
  let areas: { id: number; name: string; deliveryCharge: number }[] = [];

  try {
    areas = await prisma.deliveryArea.findMany({
      where:   { isActive: true },
      orderBy: { deliveryCharge: "asc" },
    });
  } catch (error) {
    console.error("Delivery areas error:", error);
  }

  return (
    <main
      style={{
        minHeight:     "100vh",
        width:         "100%",
        paddingTop:    "130px",
        paddingBottom: "80px",
        paddingLeft:   "16px",
        paddingRight:  "16px",
        background: `
          radial-gradient(circle at 8% 8%, rgba(120, 180, 125, 0.92) 0%, rgba(120, 180, 125, 0) 28%),
          radial-gradient(circle at 92% 10%, rgba(100, 165, 108, 0.88) 0%, rgba(100, 165, 108, 0) 28%),
          radial-gradient(circle at 5% 92%, rgba(110, 175, 118, 0.85) 0%, rgba(110, 175, 118, 0) 26%),
          radial-gradient(circle at 94% 90%, rgba(95, 160, 102, 0.85) 0%, rgba(95, 160, 102, 0) 26%),
          radial-gradient(circle at 50% 45%, rgba(240, 155, 60, 0.82) 0%, rgba(240, 155, 60, 0) 38%),
          linear-gradient(135deg, #c8e6c9 0%, #e8d5b8 30%, #f0b060 52%, #e8d5b8 72%, #c8e6c9 100%)
        `,
      }}
    >
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>

        {/* Back link */}
        <Link
          href="/"
          style={{
            display:    "inline-flex",
            alignItems: "center",
            gap:        "8px",
            fontSize:   "13px",
            fontWeight: 500,
            color:      "#6c5a49",
            marginBottom: "32px",
          }}
        >
          <ArrowLeft size={16} />
          Back to Home
        </Link>

        {/* Heading */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <p
            style={{
              fontSize:      "11px",
              fontWeight:    500,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color:         "#89735f",
              marginBottom:  "12px",
            }}
          >
            Where we deliver
          </p>
          <h1
            style={{
              fontSize:      "40px",
              fontWeight:    500,
              letterSpacing: "-1px",
              color:         "#171717",
              marginBottom:  "12px",
            }}
          >
            Delivery Areas
          </h1>
          <p style={{ fontSize: "14px", color: "#3d3b38" }}>
            We deliver within an 8km radius of our location in Saddar, Karachi.
          </p>
        </div>

        {/* Info bar */}
        <div
          style={{
            display:        "flex",
            flexWrap:       "wrap",
            justifyContent: "center",
            gap:            "12px",
            marginBottom:   "40px",
          }}
        >
          <div
            style={{
              display:        "flex",
              alignItems:     "center",
              gap:            "8px",
              padding:        "10px 18px",
              borderRadius:   "999px",
              background:     "rgba(255,255,255,0.6)",
              backdropFilter: "blur(10px)",
              fontSize:       "12px",
              color:          "#6c5a49",
            }}
          >
            <Clock size={14} />
            Mon–Sat: 5:00 PM – 10:30 PM
          </div>
          <div
            style={{
              display:        "flex",
              alignItems:     "center",
              gap:            "8px",
              padding:        "10px 18px",
              borderRadius:   "999px",
              background:     "rgba(255,255,255,0.6)",
              backdropFilter: "blur(10px)",
              fontSize:       "12px",
              color:          "#b91c1c",
            }}
          >
            🚫 Sundays: Closed
          </div>
        </div>

        {/* Areas grid */}
        {areas.length === 0 ? (
          <p style={{ textAlign: "center", color: "#6c5a49" }}>
            Delivery areas will be listed here soon.
          </p>
        ) : (
          <div
            style={{
              display:             "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
              gap:                 "16px",
            }}
          >
            {areas.map((area) => (
              <div
                key={area.id}
                style={{
                  display:        "flex",
                  alignItems:     "center",
                  justifyContent: "space-between",
                  gap:            "12px",
                  padding:        "18px 20px",
                  borderRadius:   "20px",
                  background:     "rgba(250,248,242,0.86)",
                  backdropFilter: "blur(10px)",
                  boxShadow:      "0 10px 28px rgba(61,47,29,0.10)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <MapPin size={16} style={{ color: "#c68129", flexShrink: 0 }} />
                  <span style={{ fontSize: "14px", fontWeight: 500, color: "#222" }}>
                    {area.name}
                  </span>
                </div>
                <span
                  style={{
                    fontSize:     "13px",
                    fontWeight:   700,
                    color:        "#c68129",
                    whiteSpace:   "nowrap",
                  }}
                >
                  Rs.{area.deliveryCharge}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Order button */}
        <div style={{ textAlign: "center", marginTop: "48px" }}>
          <Link
            href="/menu"
            style={{
              display:      "inline-flex",
              alignItems:   "center",
              gap:          "8px",
              padding:      "14px 32px",
              borderRadius: "999px",
              background:   "#c68129",
              color:        "white",
              fontSize:     "14px",
              fontWeight:   600,
              boxShadow:    "0 8px 24px rgba(198,129,41,0.35)",
            }}
          >
            <ShoppingBag size={16} />
            Order Now
          </Link>
        </div>
      </div>
    </main>
  );
}
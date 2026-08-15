import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import NavbarWrapper from "./components/NavbarWrapper";

export const metadata: Metadata = {
  title: "Mama Soups | Best Soups in Karachi | Order Online",
  description:
    "Order hot, delicious soups and crazy flavoured treats from Mama Soups in Karachi. Explore our menu and order your favourite soup online.",
  keywords: [
    "soups in Karachi",
    "best soup in Karachi",
    "soup Karachi",
    "chicken corn soup Karachi",
    "soup delivery Karachi",
    "order soup online Karachi",
    "Mama Soups",
    "French Fries",
    "Flavoured Fries",
    "Yakhi Soup",
    "Flavoured Soda",
  ],

  verification: {
    google: "cHFyG1G98G6-bax6SavFgXmnedB-EsyeISuvFnAUJbs",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        {/* Preconnect to speed up external resources */}
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
      </head>
      <body>
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{
      __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Restaurant",
        name: "Mama Soup",
        url: "https://www.mamasoups.net",
        telephone: "+923332287497",
        address: {
          "@type": "PostalAddress",
          streetAddress: "Hussaini Manzil, D'Cruz Ln, opp. F.T. Sweets",
          addressLocality: "Karachi",
          postalCode: "74400",
          addressCountry: "PK",
        },
        servesCuisine: ["Chinese", "Soups"],
        menu: "https://www.mamasoups.net/menu",
        openingHoursSpecification: [
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: [
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
            ],
            opens: "17:00",
            closes: "23:00",
          },
        ],
      }),
    }}
  />

  <NavbarWrapper />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#1A1A1A",
              color:      "white",
              border:     "1px solid rgba(249,115,22,0.3)",
            },
          }}
        />
        <main>{children}</main>
      </body>
    </html>
  );
}
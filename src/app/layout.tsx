import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import NavbarWrapper from "./components/NavbarWrapper";

export const metadata: Metadata = {
  title:       "Mama Soups — Soups, Fries & Puris",
  description: "Hot soups, crispy fries and fresh puris delivered to your door in Karachi.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        {/* Navbar — hidden on admin pages */}
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
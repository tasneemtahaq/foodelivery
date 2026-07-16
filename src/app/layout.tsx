import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./components/Navbar";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title:       "Mama Soups — Order Online",
  description: "Fresh, hot food delivered to your door in Karachi.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#1A1A1A",
              color:      "white",
              border:     "1px solid rgba(245,158,11,0.3)",
            },
          }}
        />
        <main>{children}</main>
      </body>
    </html>
  );
}
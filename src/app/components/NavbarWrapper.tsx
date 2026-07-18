"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";

export default function NavbarWrapper() {
  const pathname = usePathname();

  // Hide navbar on all admin pages
  const isAdminPage = pathname.startsWith("/admin");

  if (isAdminPage) return null;

  return <Navbar />;
}
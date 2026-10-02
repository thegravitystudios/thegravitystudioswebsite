"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { ThemeToggle } from "@/components/ThemeToggle";
import { FloatingNavDock } from "@/components/FloatingNavDock";
import { CookieConsentBanner } from "@/components/CookieConsentBanner";

export function MainLayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "";
  const [isPortalOrAdmin, setIsPortalOrAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    const host = window.location.hostname || "";
    const isSubdomain = host.startsWith("portal.") || host.includes("portal");
    const isPath = pathname.startsWith("/portal") || pathname.startsWith("/admin");
    const search = typeof window !== "undefined" ? window.location.search : "";
    const isEmbed = search.includes("embed=true") || (typeof window !== "undefined" && window.self !== window.top);
    setIsPortalOrAdmin(isSubdomain || isPath || isEmbed);
  }, [pathname]);

  const isPathPortal = pathname.startsWith("/portal") || pathname.startsWith("/admin");

  // Prevent flash of main website navbar on portal subdomain or embedded views
  if (isPortalOrAdmin === true || isPathPortal) {
    return <main className="flex-grow min-h-screen bg-[#0B0B0E] text-white">{children}</main>;
  }

  if (isPortalOrAdmin === null && (typeof window !== "undefined" && window.location.hostname.startsWith("portal."))) {
    return <main className="flex-grow min-h-screen bg-[#070709] text-white">{children}</main>;
  }

  return (
    <>
      <Nav />
      <main className="flex-grow">{children}</main>
      <Footer />
      <ThemeToggle />
      <FloatingNavDock />
      <CookieConsentBanner />
    </>
  );
}

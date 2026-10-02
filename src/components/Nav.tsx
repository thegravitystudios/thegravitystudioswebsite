"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/Button";
import { useTheme } from "@/context/ThemeContext";
import { MoreVertical, X, ArrowUpRight } from "lucide-react";

export function Nav() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { theme } = useTheme();

  const isHomePage = pathname === "/";
  const isAiProductionPage = pathname === "/ai-production";
  const isDarkPage = isHomePage || isAiProductionPage;
  const isLight = theme === "light";

  // Navigation Links
  const navLinks = [
    { label: "WORK", href: "/work" },
    { label: "SERVICES", href: "/services" },
    { label: "ABOUT", href: "/about" },
    { label: "CONTACT", href: "/contact" },
    { label: "AI PRODUCTION", href: "/ai-production" },
  ];

  // Pages that have dark hero section backdrops (Home, About, AI Production)
  const isDarkHeroPage = isHomePage || isAiProductionPage || pathname === "/about";

  // Logo Variant Strategy (White for dark hero pages, Black for light pages in Light Mode)
  const logoVariant = isDarkHeroPage ? "white" : isLight ? "black" : "white";

  return (
    <header className="absolute top-0 left-0 right-0 z-50 py-4 sm:py-5 lg:py-6 bg-transparent border-none transition-all duration-300 pointer-events-auto opacity-100">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-12 flex items-center justify-between gap-3 md:gap-6 lg:gap-10">
        {/* Left: Stacked Typography Logo */}
        <div className="transform scale-90 sm:scale-95 lg:scale-100 origin-left flex-shrink-0">
          <Logo forceVariant={logoVariant} />
        </div>

        {/* Center Nav Links — Scales fluidly across screen sizes */}
        <nav aria-label="Main Navigation" className="hidden md:flex items-center gap-3 md:gap-4 lg:gap-8 xl:gap-10">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`type-eyebrow text-[10px] md:text-[11px] lg:text-xs tracking-wider whitespace-nowrap transition-colors relative py-1 ${
                  isActive
                    ? link.href === "/ai-production"
                      ? "text-red-500 font-bold"
                      : "text-purple-400 font-bold"
                    : isDarkHeroPage
                    ? "text-white/90 hover:text-white font-medium"
                    : isLight
                    ? "text-zinc-900 hover:text-black font-semibold"
                    : "text-white/90 hover:text-white font-medium"
                }`}
              >
                {link.label}
                {isActive && (
                  <span
                    className={`absolute bottom-0 left-0 right-0 h-0.5 rounded-full ${
                      link.href === "/ai-production"
                        ? "bg-gradient-to-r from-[#D90429] to-[#FF4D4D]"
                        : "tgs-gradient-bg"
                    }`}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Action: Desktop gets "BOOK A CALL", Phone gets "3 DOTS MENU" */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          {/* Desktop "BOOK A CALL" Button */}
          <div className="hidden md:block">
            <Button
              href="/book"
              target="_blank"
              rel="noopener noreferrer"
              size="sm"
              variant="primary"
              className="text-[10px] md:text-[11px] lg:text-xs px-3 py-1.5 md:px-4 md:py-2 lg:px-5 lg:py-2.5 whitespace-nowrap"
            >
              BOOK A CALL
            </Button>
          </div>

          {/* Phone "THREE DOTS MENU" Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
            className={`md:hidden flex items-center justify-center p-2 rounded-full backdrop-blur-md transition-all cursor-pointer shadow-lg active:scale-95 ${
              isLight
                ? "bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 text-black"
                : "bg-white/10 hover:bg-white/20 border border-white/20 text-white"
            }`}
          >
            {isMobileMenuOpen ? (
              <X className={`w-4 h-4 ${isLight ? "text-black" : "text-white"}`} />
            ) : (
              <MoreVertical className={`w-4 h-4 ${isLight ? "text-black" : "text-white"}`} />
            )}
          </button>
        </div>
      </div>

      {/* MOBILE FULL-WIDTH OVERLAY DROPDOWN MENU */}
      {isMobileMenuOpen && (
        <div className={`md:hidden fixed inset-x-4 top-20 z-50 p-6 rounded-3xl backdrop-blur-3xl border shadow-2xl space-y-5 animate-word-reveal ${
          isLight ? "bg-white/95 border-neutral-200 text-black" : "bg-black/95 border-white/20 text-white"
        }`}>
          <div className={`flex items-center justify-between pb-3 border-b ${isLight ? "border-neutral-200" : "border-white/10"}`}>
            <span className="type-eyebrow text-xs text-purple-600 font-bold tracking-widest font-mono">
              NAVIGATION MENU
            </span>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className={`p-1 rounded-full ${isLight ? "text-black/70 hover:text-black hover:bg-neutral-100" : "text-white/70 hover:text-white hover:bg-white/10"}`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex flex-col gap-3">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              const isAi = link.href === "/ai-production";
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-bold tracking-wider font-headline transition-all ${
                    isActive
                      ? isAi
                        ? "bg-gradient-to-r from-[#D90429] to-[#FF4D4D] text-white"
                        : "tgs-gradient-bg text-white"
                      : isAi
                      ? "text-red-500 hover:bg-red-50"
                      : isLight
                      ? "text-zinc-900 hover:bg-neutral-100"
                      : "text-white/90 hover:bg-white/10"
                  }`}
                >
                  <span>{link.label}</span>
                  {isActive && <span className="w-2 h-2 rounded-full bg-white" />}
                </Link>
              );
            })}
          </div>

          <div className="pt-2">
            <a
              href="/book"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl tgs-gradient-bg text-white font-bold text-sm shadow-xl active:scale-95 transition-all"
            >
              <span>BOOK A CALL</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      )}
    </header>
  );
}

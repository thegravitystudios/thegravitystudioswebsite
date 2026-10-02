"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Compass,
  Film,
  User,
  Mail,
  ArrowUpRight,
  MoreHorizontal,
  X,
  Cpu,
} from "lucide-react";

export function FloatingNavDock() {
  const [isVisible, setIsVisible] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Navigation order matching header & footer: Home -> Work -> Services -> About -> Contact -> AI Production
  const pages = [
    { label: "Home", href: "/", icon: Home },
    { label: "Work", href: "/work", icon: Film },
    { label: "Services", href: "/services", icon: Compass },
    { label: "About", href: "/about", icon: User },
    { label: "Contact", href: "/contact", icon: Mail },
    { label: "AI Production", href: "/ai-production", icon: Cpu },
  ];

  // Scroll and Footer Intersection / Hover Observers
  useEffect(() => {
    let isFooterHovered = false;

    // Listen to footer hover events
    const footerElement = document.querySelector("footer");

    const handleFooterMouseEnter = () => {
      isFooterHovered = true;
      setIsVisible(false);
      setIsOpen(false);
    };

    const handleFooterMouseLeave = () => {
      isFooterHovered = false;
      handleScroll();
    };

    if (footerElement) {
      footerElement.addEventListener("mouseenter", handleFooterMouseEnter);
      footerElement.addEventListener("mouseleave", handleFooterMouseLeave);
    }

    const handleScroll = () => {
      if (isFooterHovered) {
        setIsVisible(false);
        return;
      }

      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      // Check if past hero (> 300px) AND not near footer (< 600px from document bottom)
      const isPastHero = scrollY > 300;
      const isNearFooter = scrollY + windowHeight >= documentHeight - 600;

      if (isPastHero && !isNearFooter) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
        setIsOpen(false);
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (footerElement) {
        footerElement.removeEventListener("mouseenter", handleFooterMouseEnter);
        footerElement.removeEventListener("mouseleave", handleFooterMouseLeave);
      }
    };
  }, [pathname]);

  return (
    <div
      className={`fixed bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ease-out ${
        isVisible
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-12 pointer-events-none"
      }`}
    >
      {/* POPUP MENU FOR MOBILE & TABLETS (< 1024px) */}
      {isOpen && (
        <div className="lg:hidden mb-3 p-3 rounded-3xl backdrop-blur-2xl bg-black/90 border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.8)] text-white w-[260px] animate-word-reveal">
          <div className="flex items-center justify-between px-3 py-2 border-b border-white/10 mb-2">
            <span className="type-eyebrow text-[10px] text-purple-400 font-bold">
              NAVIGATION
            </span>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-1">
            {pages.map((page) => {
              const IconComp = page.icon;
              const isActive = pathname === page.href;
              const isAi = page.href === "/ai-production";
              return (
                <Link
                  key={page.href}
                  href={page.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-medium transition-all ${
                    isActive
                      ? isAi
                        ? "bg-gradient-to-r from-[#D90429] to-[#FF4D4D] text-white font-bold"
                        : "tgs-gradient-bg text-white font-bold"
                      : isAi
                      ? "text-red-400 font-bold hover:bg-red-950/40"
                      : "text-white/80 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <IconComp className={`w-4 h-4 ${isAi ? "text-red-400" : "text-purple-300"}`} />
                  <span className="type-eyebrow text-xs tracking-wider">
                    {page.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* DOCK BAR CONTAINER */}
      <div className="flex items-center p-1.5 md:p-2 rounded-full backdrop-blur-xl bg-black/85 border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.6)] text-white select-none max-w-[calc(100vw-2rem)]">
        {/* MOBILE & TABLET 3-DOTS BUTTON (< 1024px) */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Open page navigation menu"
          className="lg:hidden flex items-center justify-center w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
        >
          {isOpen ? <X className="w-4 h-4" /> : <MoreHorizontal className="w-4 h-4 text-purple-300" />}
        </button>

        {/* DESKTOP PAGE LINKS (>= 1024px) */}
        <div className="hidden lg:flex items-center gap-2">
          {pages.map((page) => {
            const IconComp = page.icon;
            const isActive = pathname === page.href;
            const isAi = page.href === "/ai-production";
            return (
              <Link
                key={page.href}
                href={page.href}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-medium transition-all duration-300 whitespace-nowrap ${
                  isActive
                    ? isAi
                      ? "bg-gradient-to-r from-[#D90429] to-[#FF4D4D] text-white font-bold shadow-lg shadow-red-900/50 scale-105"
                      : "tgs-gradient-bg text-white font-bold shadow-lg shadow-purple-900/50 scale-105"
                    : isAi
                    ? "text-red-400 font-bold hover:text-red-300 hover:bg-red-950/40"
                    : "text-white/80 hover:text-white hover:bg-white/10"
                }`}
              >
                <IconComp className={`w-3.5 h-3.5 flex-shrink-0 ${isAi && !isActive ? "text-red-400" : ""}`} />
                <span className="type-eyebrow text-[11px] tracking-wider whitespace-nowrap">
                  {page.label}
                </span>
              </Link>
            );
          })}
        </div>

        <div className="h-4 w-[1px] bg-white/20 mx-0.5 hidden lg:block flex-shrink-0" />

        {/* Quick CTA inside floating dock — Desktop only (>= 1024px) */}
        <a
          href="/book"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden lg:flex items-center gap-1 px-4 py-2 rounded-full bg-white text-black font-bold text-xs hover:bg-purple-200 transition-colors shadow-md whitespace-nowrap flex-shrink-0"
        >
          <span className="type-eyebrow text-[10px] tracking-wider text-black font-bold whitespace-nowrap">
            BOOK A CALL
          </span>
          <ArrowUpRight className="w-3.5 h-3.5 text-black flex-shrink-0" />
        </a>
      </div>
    </div>
  );
}

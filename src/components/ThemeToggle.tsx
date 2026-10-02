"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useTheme } from "@/context/ThemeContext";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isIdle, setIsIdle] = useState(false);
  const [isFooterVisible, setIsFooterVisible] = useState(false);
  const isDark = theme === "dark";
  const isHomePage = pathname === "/";
  const isAiProduction = pathname === "/ai-production";

  // Scroll listener
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Footer Intersection Observer — Automatically hide toggle when user reaches footer
  useEffect(() => {
    const footerEl = document.getElementById("footer") || document.querySelector("footer");
    if (!footerEl) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsFooterVisible(entry.isIntersecting);
      },
      { threshold: 0.05 }
    );

    observer.observe(footerEl);
    return () => observer.disconnect();
  }, [pathname]);

  // Idle Timer
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const resetIdleTimer = () => {
      setIsIdle(false);
      clearTimeout(timeoutId);
      if (!isScrolled && isHomePage) {
        timeoutId = setTimeout(() => {
          setIsIdle(true);
        }, 3500);
      }
    };

    resetIdleTimer();

    window.addEventListener("mousemove", resetIdleTimer);
    window.addEventListener("mousedown", resetIdleTimer);
    window.addEventListener("keydown", resetIdleTimer);
    window.addEventListener("touchstart", resetIdleTimer);
    window.addEventListener("scroll", resetIdleTimer);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("mousemove", resetIdleTimer);
      window.removeEventListener("mousedown", resetIdleTimer);
      window.removeEventListener("keydown", resetIdleTimer);
      window.removeEventListener("touchstart", resetIdleTimer);
      window.removeEventListener("scroll", resetIdleTimer);
    };
  }, [isScrolled, isHomePage]);

  // Hide ThemeToggle button on /ai-production route after hooks execution
  if (isAiProduction) {
    return null;
  }

  const shouldHide = isFooterVisible || (!isScrolled && isHomePage && isIdle);

  return (
    <div
      className={`fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-50 transition-all duration-500 ease-in-out ${
        shouldHide
          ? "opacity-0 pointer-events-none translate-y-4"
          : "opacity-100 translate-y-0"
      }`}
    >
      {isDark ? (
        /* In Dark Mode: Under xl gets small circular icon button, xl gets full pill */
        <button
          onClick={(e) => toggleTheme(e)}
          type="button"
          aria-label="Switch to light mode"
          className="flex items-center justify-center gap-2 h-9 w-9 sm:h-10 sm:w-10 xl:w-auto xl:px-4 rounded-full bg-neutral-200 border border-neutral-300 text-neutral-900 hover:bg-white transition-all duration-300 shadow-2xl hover:scale-105 cursor-pointer select-none"
        >
          <Sun className="w-4 h-4 text-amber-600 animate-spin-slow flex-shrink-0" />
          <span className="hidden xl:inline-block type-eyebrow text-[10px] text-neutral-900 font-bold whitespace-nowrap">
            LIGHT MODE
          </span>
        </button>
      ) : (
        /* In Light Mode: Under xl gets small circular icon button, xl gets full pill */
        <button
          onClick={(e) => toggleTheme(e)}
          type="button"
          aria-label="Switch to dark mode"
          className="flex items-center justify-center gap-2 h-9 w-9 sm:h-10 sm:w-10 xl:w-auto xl:px-4 rounded-full bg-neutral-900 border border-neutral-700 text-neutral-100 hover:bg-black transition-all duration-300 shadow-2xl hover:scale-105 cursor-pointer select-none"
        >
          <Moon className="w-4 h-4 text-purple-300 flex-shrink-0" />
          <span className="hidden xl:inline-block type-eyebrow text-[10px] text-neutral-100 font-bold whitespace-nowrap">
            DARK MODE
          </span>
        </button>
      )}
    </div>
  );
}

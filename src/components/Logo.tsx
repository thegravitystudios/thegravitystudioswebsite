"use client";

import React from "react";
import Link from "next/link";
import { useTheme } from "@/context/ThemeContext";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  showBadge?: boolean;
  forceVariant?: "white" | "black";
}

export function Logo({
  size = "md",
  className = "",
  forceVariant,
}: LogoProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Determine active logo variant based on theme or explicit override
  const activeVariant = forceVariant
    ? forceVariant
    : isDark
    ? "white"
    : "black";

  const logoSrc =
    activeVariant === "white"
      ? "/logo-typography-white.png"
      : "/logo-typography-black.png";

  const logoSvgFallback =
    activeVariant === "white"
      ? "/logo-typography-white.svg"
      : "/logo-typography-black.svg";

  // Clean proportional height scale for authentic 1:1 image asset rendering
  const logoHeights = {
    sm: "h-12 sm:h-14 w-auto",
    md: "h-16 sm:h-20 md:h-24 w-auto",
    lg: "h-24 sm:h-32 md:h-36 w-auto",
  };

  return (
    <Link
      href="/"
      className={`group inline-flex items-center select-none transition-opacity duration-200 hover:opacity-95 ${className}`}
    >
      <div className="relative flex flex-col justify-center">
        <img
          src={logoSrc}
          onError={(e) => {
            (e.target as HTMLImageElement).src = logoSvgFallback;
          }}
          alt="The Gravity Studios Logo"
          className={`${logoHeights[size]} object-contain object-left transition-transform duration-300 group-hover:scale-[1.02]`}
        />
      </div>
    </Link>
  );
}

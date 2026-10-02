"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  href?: string;
  target?: string;
  rel?: string;
  showArrow?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function Button({
  variant = "primary",
  size = "md",
  href,
  target,
  rel,
  showArrow = true,
  children,
  className = "",
  ...props
}: ButtonProps) {
  const sizeClasses = {
    sm: "px-6 py-2.5 text-xs sm:text-sm font-extrabold tracking-widest uppercase",
    md: "px-7 py-3 text-sm font-extrabold tracking-widest uppercase",
    lg: "px-9 py-4 text-base font-black tracking-widest uppercase",
  };

  const baseClasses =
    "group inline-flex items-center justify-center rounded-full transition-all duration-300 ease-out select-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500/50";

  const variantClasses = {
    primary:
      "tgs-gradient-bg text-white shadow-xl shadow-purple-950/40 hover:shadow-[0_0_30px_rgba(168,85,247,0.6)] hover:-translate-y-1 hover:scale-105 active:scale-95 active:translate-y-0",
    secondary:
      "bg-[var(--bg-surface)]/90 backdrop-blur-md border-2 border-[var(--border-color)] text-[var(--text-primary)] font-extrabold dark:hover:border-purple-500/80 dark:hover:bg-purple-950/30 dark:hover:text-white light:hover:bg-[#141418] light:hover:text-white light:hover:border-[#141418] hover:shadow-[0_15px_35px_rgba(0,0,0,0.3)] hover:-translate-y-1 hover:scale-105 active:scale-95 active:translate-y-0",
    ghost:
      "bg-transparent text-[var(--text-primary)] font-extrabold hover:text-purple-400 hover:bg-purple-500/10 hover:scale-105 active:scale-95",
  };

  const combinedClasses = `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`;

  const content = (
    <>
      <span className="font-extrabold tracking-widest">{children}</span>
      {showArrow && (
        <ArrowRight className="w-4 h-4 ml-2 text-purple-200 group-hover:translate-x-1 group-hover:text-white transition-all duration-300 stroke-[2.5]" />
      )}
    </>
  );

  if (href) {
    const isExternal = href.startsWith("http") || target === "_blank";
    if (isExternal) {
      return (
        <a href={href} target={target} rel={rel} className={combinedClasses}>
          {content}
        </a>
      );
    }
    return (
      <Link href={href} className={combinedClasses}>
        {content}
      </Link>
    );
  }

  return (
    <button className={combinedClasses} {...props}>
      {content}
    </button>
  );
}

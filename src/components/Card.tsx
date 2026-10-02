"use client";

import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  onClick?: () => void;
}

export function Card({ children, className = "", hoverEffect = true, onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-6 md:p-8 transition-all duration-300 ${
        hoverEffect
          ? "hover:border-purple-500/40 hover:shadow-xl hover:shadow-purple-950/10 hover:-translate-y-1"
          : ""
      } ${onClick ? "cursor-pointer" : ""} ${className}`}
    >
      {children}
    </div>
  );
}

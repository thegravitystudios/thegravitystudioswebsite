"use client";

import React from "react";

interface PlaceholderBadgeProps {
  label: string;
  variant?: "badge" | "block" | "inline";
  className?: string;
}

export function PlaceholderBadge({ label, variant = "badge", className = "" }: PlaceholderBadgeProps) {
  if (variant === "inline") {
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-purple-500/10 text-purple-400 border border-purple-500/20 ${className}`}>
        {label}
      </span>
    );
  }

  if (variant === "block") {
    return (
      <div className={`p-4 rounded-lg border border-dashed border-purple-500/30 bg-purple-500/5 flex items-center justify-center text-xs font-mono tracking-wider text-purple-400 ${className}`}>
        {label}
      </div>
    );
  }

  return (
    <span className={`inline-block px-2.5 py-1 rounded-md text-[10px] font-mono tracking-wider uppercase bg-purple-500/15 text-purple-400 border border-purple-500/30 shadow-sm ${className}`}>
      {label}
    </span>
  );
}

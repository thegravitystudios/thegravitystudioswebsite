"use client";

import React from "react";

export function SkeletonCard() {
  return (
    <div className="p-6 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-surface)] animate-pulse space-y-4">
      <div className="h-4 w-1/3 bg-zinc-700/30 rounded-lg" />
      <div className="h-3 w-2/3 bg-zinc-700/20 rounded-lg" />
      <div className="h-24 w-full bg-zinc-700/20 rounded-2xl" />
    </div>
  );
}

export function SkeletonList() {
  return (
    <div className="space-y-3 animate-pulse">
      {[1, 2, 3].map((i) => (
        <div key={i} className="p-4 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] flex items-center justify-between">
          <div className="space-y-2 w-2/3">
            <div className="h-4 w-3/4 bg-zinc-700/30 rounded-lg" />
            <div className="h-3 w-1/2 bg-zinc-700/20 rounded-lg" />
          </div>
          <div className="h-8 w-20 bg-zinc-700/30 rounded-xl" />
        </div>
      ))}
    </div>
  );
}

"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function PortalBreadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav className="flex items-center gap-1.5 text-xs font-mono text-[var(--text-muted)] mb-4 select-none flex-wrap">
      <Link
        href="/portal/dashboard"
        className="hover:text-purple-400 transition-colors flex items-center gap-1"
      >
        <Home className="w-3.5 h-3.5" />
        <span>Portal</span>
      </Link>

      {items.map((item, idx) => (
        <React.Fragment key={idx}>
          <ChevronRight className="w-3 h-3 text-zinc-600" />
          {item.href ? (
            <Link href={item.href} className="hover:text-purple-400 transition-colors truncate max-w-[150px] sm:max-w-[200px]">
              {item.label}
            </Link>
          ) : (
            <span className="text-[var(--text-primary)] font-bold truncate max-w-[180px] sm:max-w-[250px]">
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}

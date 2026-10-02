"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Logo } from "@/components/Logo";
import { useTheme } from "@/context/ThemeContext";
import { supabase } from "@/lib/supabase";
import {
  Sun,
  Moon,
  LogOut,
  FolderKanban,
  Users,
  ShieldAlert,
  BarChart2,
  ExternalLink,
} from "lucide-react";

interface AdminHeaderProps {
  userName?: string;
  userRole?: string;
}

export function AdminHeader({ userName, userRole }: AdminHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === "light";
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.error(e);
    }
    localStorage.removeItem("gravity_portal_user");
    router.push("/portal/login");
  };

  const navLinks = [
    { label: "Dashboard", href: "/portal/admin/dashboard", icon: FolderKanban },
    { label: "Client Directory", href: "/portal/admin/clients", icon: Users },
  ];

  return (
    <header className="w-full border-b border-[var(--border-color)] bg-[var(--bg-main)] py-3.5 px-4 sm:px-8 transition-colors select-none">
      <div className="max-w-[1400px] mx-auto flex items-center justify-between gap-4">
        {/* Left: Logo & Internal Admin Tag */}
        <div className="flex items-center gap-6">
          <Link href="/portal/admin/dashboard" className="flex items-center gap-3">
            <Logo size="md" forceVariant={isLight ? "black" : "white"} showBadge={false} />
            <span className="type-eyebrow text-[10px] font-mono font-bold tracking-widest text-rose-400 bg-rose-500/10 border border-rose-500/30 px-2.5 py-1 rounded-full uppercase">
              INTERNAL ADMIN
            </span>
          </Link>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-2">
            {navLinks.map((link) => {
              const IconComp = link.icon;
              const isActive = pathname === link.href || (link.href !== "/portal/admin/dashboard" && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all ${
                    isActive
                      ? "bg-purple-500/15 border border-purple-500/40 text-purple-300"
                      : "text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)]"
                  }`}
                >
                  <IconComp className="w-3.5 h-3.5" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right: User Profile & Actions */}
        <div className="flex items-center gap-3">
          {userName && (
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-xs font-bold text-[var(--text-primary)] leading-tight">
                {userName}
              </span>
              <span className="type-eyebrow text-[10px] text-rose-400 font-mono tracking-wider uppercase">
                {userRole || "ADMIN / TEAM"}
              </span>
            </div>
          )}

          {/* Theme Toggle Button */}
          <button
            onClick={(e) => toggleTheme(e)}
            type="button"
            aria-label="Toggle theme"
            className="flex items-center justify-center w-9 h-9 rounded-full border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-primary)] hover:border-purple-500/50 transition-all cursor-pointer"
          >
            {isLight ? (
              <Moon className="w-4 h-4 text-purple-400" />
            ) : (
              <Sun className="w-4 h-4 text-amber-400" />
            )}
          </button>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="flex items-center gap-2 px-3 py-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] hover:bg-rose-500/10 hover:border-rose-500/40 text-[var(--text-primary)] hover:text-rose-400 text-xs font-mono font-bold transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden md:inline">{loggingOut ? "LOGGING OUT..." : "LOG OUT"}</span>
          </button>
        </div>
      </div>
    </header>
  );
}

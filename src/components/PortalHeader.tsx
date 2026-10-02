"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Logo } from "@/components/Logo";
import { useTheme } from "@/context/ThemeContext";
import { supabase } from "@/lib/supabase";
import { Sun, Moon, LogOut, User, LayoutDashboard, ShieldCheck } from "lucide-react";

interface PortalHeaderProps {
  userName?: string;
  companyName?: string;
  userRole?: string;
}

export function PortalHeader({ userName, companyName, userRole }: PortalHeaderProps) {
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

  return (
    <header className="w-full border-b border-[var(--border-color)] bg-[var(--bg-main)] py-4 px-4 sm:px-8 transition-colors select-none">
      <div className="max-w-[1280px] mx-auto flex items-center justify-between gap-4">
        {/* Left: Logo & Portal Tag */}
        <div className="flex items-center gap-4">
          <Link href="/portal/dashboard" className="flex items-center gap-3 group">
            <Logo size="md" forceVariant={isLight ? "black" : "white"} showBadge={false} />
            <span className="type-eyebrow text-[10px] font-mono font-bold tracking-widest text-purple-400 bg-purple-500/10 border border-purple-500/30 px-2.5 py-1 rounded-full uppercase">
              CLIENT PORTAL
            </span>
          </Link>
        </div>

        {/* Right: User Profile Info, Theme Toggle & Logout */}
        <div className="flex items-center gap-3 sm:gap-4">
          {userName && (
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-xs font-bold text-[var(--text-primary)] leading-tight">
                {userName}
              </span>
              {companyName && (
                <span className="type-eyebrow text-[10px] text-purple-400 font-mono tracking-wider">
                  {companyName}
                </span>
              )}
            </div>
          )}

          {/* Theme Toggle Button */}
          <button
            onClick={(e) => toggleTheme(e)}
            type="button"
            aria-label="Toggle theme"
            className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-primary)] hover:border-purple-500/50 transition-all cursor-pointer"
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
            className="flex items-center gap-2 px-3.5 py-2 rounded-full border border-[var(--border-color)] bg-[var(--bg-surface)] hover:bg-red-500/10 hover:border-red-500/40 text-[var(--text-primary)] hover:text-red-400 text-xs font-mono font-bold transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden md:inline">{loggingOut ? "LOGGING OUT..." : "LOG OUT"}</span>
          </button>
        </div>
      </div>
    </header>
  );
}

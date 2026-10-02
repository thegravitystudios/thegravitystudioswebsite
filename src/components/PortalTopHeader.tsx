"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTheme } from "@/context/ThemeContext";
import { supabase } from "@/lib/supabase";
import { NotificationCenter } from "@/components/NotificationCenter";
import { CommandPaletteSearch } from "@/components/CommandPaletteSearch";
import {
  Search,
  LogOut,
  Settings,
  HelpCircle,
  Command,
  Sun,
  Moon,
} from "lucide-react";

interface PortalTopHeaderProps {
  userName?: string;
  userEmail?: string;
  companyName?: string;
  userRole?: string;
  onSearch?: (query: string) => void;
}

export function PortalTopHeader({
  userName = "Prameet Patani",
  userEmail = "client@thegravitystudios.com",
  companyName = "Hero Motors",
  userRole = "client",
}: PortalTopHeaderProps) {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  const isAdmin = userRole === "admin" || userRole === "team";

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.error(e);
    }
    localStorage.removeItem("gravity_portal_user");
    router.push("/portal/login");
  };

  return (
    <header className="h-16 border-b border-[var(--border-color)] bg-[var(--bg-surface)]/90 backdrop-blur-md px-6 md:px-8 flex items-center justify-between sticky top-0 z-40 select-none font-sans mb-6">
      {/* Global Search Bar (Exact Blueprint Spec) */}
      <div className="relative flex-1 max-w-md">
        <div
          onClick={() => setCommandPaletteOpen(true)}
          className="relative w-full pl-10 pr-4 py-2 rounded-2xl bg-[var(--bg-main)] border border-[var(--border-color)] text-xs font-medium text-[var(--text-primary)] placeholder:text-slate-400 focus:outline-none flex items-center justify-between cursor-pointer group"
        >
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 group-hover:text-purple-500 transition-colors" />
          <span className="text-slate-400 group-hover:text-[var(--text-primary)] transition-colors truncate">
            Search projects, deliverables, invoices...
          </span>
          <div className="flex items-center gap-1 font-mono text-[9px] bg-[var(--bg-surface)] px-2 py-0.5 rounded-md border border-[var(--border-color)] text-slate-400 shrink-0 ml-2">
            <Command className="w-2.5 h-2.5" />
            <span>K</span>
          </div>
        </div>
      </div>

      {/* Quick Navigation Links (Center-Right) */}
      <nav className="hidden md:flex items-center gap-1 ml-6">
        <Link
          href={isAdmin ? "/portal/admin/dashboard" : "/portal/dashboard"}
          className="px-3 py-1.5 rounded-full text-xs font-bold text-slate-500 hover:text-[var(--text-primary)] transition-colors"
        >
          Dashboard
        </Link>
        <Link
          href="/portal/documents"
          className="px-3 py-1.5 rounded-full text-xs font-bold text-slate-500 hover:text-[var(--text-primary)] transition-colors"
        >
          Deliverables
        </Link>
        <Link
          href="/portal/invoices"
          className="px-3 py-1.5 rounded-full text-xs font-bold text-slate-500 hover:text-[var(--text-primary)] transition-colors"
        >
          Invoices
        </Link>
        <Link
          href="/portal/notifications"
          className="px-3 py-1.5 rounded-full text-xs font-bold text-slate-500 hover:text-[var(--text-primary)] transition-colors"
        >
          Activity Stream
        </Link>
      </nav>

      {/* Right Controls: Notifications, Theme Toggle & User Profile Badge */}
      <div className="flex items-center gap-3">
        <NotificationCenter />

        <button
          onClick={(e) => toggleTheme(e)}
          type="button"
          aria-label="Toggle theme"
          className="w-8 h-8 rounded-full border border-[var(--border-color)] bg-[var(--bg-main)] flex items-center justify-center text-[var(--text-primary)] hover:border-purple-500/50 transition-all cursor-pointer"
        >
          {theme === "light" ? (
            <Moon className="w-4 h-4 text-purple-600" />
          ) : (
            <Sun className="w-4 h-4 text-amber-400" />
          )}
        </button>

        {/* User Profile Badge (Exact Blueprint Spec) */}
        <div className="relative">
          <button
            onClick={() => setAccountMenuOpen(!accountMenuOpen)}
            className="flex items-center gap-2.5 pl-3 border-l border-[var(--border-color)] cursor-pointer text-left focus:outline-none"
          >
            <div className="w-8 h-8 rounded-full bg-slate-900 overflow-hidden border border-slate-700 flex items-center justify-center text-white font-bold text-xs shrink-0">
              {userName ? userName.charAt(0).toUpperCase() : "U"}
            </div>
            <div className="hidden sm:block text-left">
              <span className="text-xs font-bold block leading-tight text-[var(--text-primary)] truncate max-w-[120px]">
                {userName}
              </span>
              <span className="text-[11px] text-slate-500 font-medium block leading-tight truncate max-w-[120px]">
                {isAdmin ? "Founder & Admin" : companyName || "Client"}
              </span>
            </div>
          </button>

          {accountMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setAccountMenuOpen(false)}
              />

              <div className="absolute right-0 mt-3 w-60 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-[0_20px_50px_rgba(0,0,0,0.2)] z-50 p-2 space-y-1">
                <div className="p-3 border-b border-[var(--border-color)]">
                  <p className="text-xs font-bold text-[var(--text-primary)] truncate">
                    {userName}
                  </p>
                  <p className="text-[10px] font-mono text-[var(--text-muted)] truncate mt-0.5">
                    {userEmail}
                  </p>
                </div>

                <Link
                  href="/portal/settings"
                  onClick={() => setAccountMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-[var(--text-primary)] hover:bg-[var(--bg-main)] transition-colors"
                >
                  <Settings className="w-3.5 h-3.5 text-purple-500" />
                  <span>Profile Settings</span>
                </Link>

                <a
                  href="mailto:support@thegravitystudios.com"
                  onClick={() => setAccountMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-[var(--text-primary)] hover:bg-[var(--bg-main)] transition-colors"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-purple-500" />
                  <span>Support</span>
                </a>

                <div className="pt-1 border-t border-[var(--border-color)]">
                  <button
                    onClick={() => {
                      setAccountMenuOpen(false);
                      handleLogout();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Log Out</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Command Palette Overlay */}
      <CommandPaletteSearch
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
      />
    </header>
  );
}

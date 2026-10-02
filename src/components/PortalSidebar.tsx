"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "@/context/ThemeContext";
import { supabase } from "@/lib/supabase";
import {
  LayoutGrid,
  Home,
  Users,
  CheckSquare,
  Calendar,
  Receipt,
  FileText,
  BarChart2,
  Settings,
  LogOut,
  Sun,
  Moon,
  Video,
  Building2,
  Bell,
  Coffee,
} from "lucide-react";

interface PortalSidebarProps {
  companyName?: string;
  projectName?: string;
  userRole?: string;
}

export function PortalSidebar({ userRole }: PortalSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();

  const isAdmin = userRole === "admin" || userRole === "team" || pathname.startsWith("/portal/admin");

  const navItems = isAdmin
    ? [
        { label: "Admin Dashboard", href: "/portal/admin/dashboard", icon: LayoutGrid },
        { label: "Client Directory", href: "/portal/admin/clients", icon: Building2 },
        { label: "Agency Team Roster", href: "/portal/admin/team", icon: Users },
        { label: "Agency Finance", href: "/portal/admin/finance", icon: Receipt },
        { label: "Deliverables QC", href: "/portal/admin/deliverables", icon: Video },
        { label: "Contract Studio", href: "/portal/admin/contracts", icon: FileText },
        { label: "Agency Analytics", href: "/portal/admin/analytics", icon: BarChart2 },
        { label: "Settings", href: "/portal/settings", icon: Settings },
      ]
    : [
        { label: "Dashboard", href: "/portal/dashboard", icon: Home },
        { label: "Projects & Tasks", href: "/portal/tasks", icon: CheckSquare },
        { label: "Deliverables Vault", href: "/portal/documents", icon: FileText },
        { label: "Invoices & Receipts", href: "/portal/invoices", icon: Receipt },
        { label: "Activity Stream", href: "/portal/notifications", icon: Bell },
        { label: "Content Calendar", href: "/portal/calendar", icon: Calendar },
        { label: "Analytics & ROI", href: "/portal/analytics", icon: BarChart2 },
        { label: "Settings", href: "/portal/settings", icon: Settings },
      ];

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
    <>
      {/* Desktop Floating Vertical Black Navigation Pill (Exact Blueprint Specs) */}
      <aside className="hidden lg:flex fixed left-6 top-6 bottom-6 w-20 z-50 bg-[#09090B] rounded-[2.5rem] p-4 flex-col justify-between items-center text-white border border-slate-800/80 shadow-[0_20px_50px_rgba(0,0,0,0.3)] select-none">
        {/* Top Brand Logo Badge Container */}
        <Link
          href={isAdmin ? "/portal/admin/dashboard" : "/portal/dashboard"}
          className="w-12 h-12 rounded-2xl bg-white/10 hover:bg-white/20 p-1 flex items-center justify-center transition-all group overflow-hidden border border-white/20"
          title="The Gravity Studios"
        >
          <img
            src="/favicon-withbg.png"
            alt="The Gravity Studios Logo"
            className="w-full h-full object-contain rounded-xl group-hover:scale-105 transition-transform"
          />
        </Link>

        {/* Center Vertical Nav Icons */}
        <nav className="flex flex-col items-center gap-3 w-full my-auto py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== "/portal/dashboard" &&
                item.href !== "/portal/admin/dashboard" &&
                pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative w-12 h-12 rounded-2xl flex items-center justify-center transition-all group ${
                  isActive
                    ? "bg-white text-black shadow-lg shadow-white/10 scale-105"
                    : "text-slate-400 hover:text-white hover:bg-white/10"
                }`}
                title={item.label}
              >
                <Icon className="w-5 h-5" />
                {/* Tooltip on Hover */}
                <span className="absolute left-16 bg-[#09090B] text-white text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-800 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap shadow-xl z-50">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Action Controls (Theme Toggle + Logout) */}
        <div className="flex flex-col items-center gap-3 w-full">
          <button
            onClick={(e) => toggleTheme(e)}
            className="w-11 h-11 rounded-2xl text-slate-400 hover:text-white hover:bg-white/10 flex items-center justify-center transition-all cursor-pointer"
            title="Toggle Light / Dark Mode"
          >
            {theme === "light" ? (
              <Moon className="w-5 h-5" />
            ) : (
              <Sun className="w-5 h-5 text-amber-400" />
            )}
          </button>

          <button
            onClick={handleLogout}
            className="w-11 h-11 rounded-2xl text-red-400 hover:bg-red-500/20 flex items-center justify-center transition-all cursor-pointer"
            title="Sign Out"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </aside>

      {/* Mobile Top Floating Capsule Nav (Exact Blueprint Specs) */}
      <header className="lg:hidden sticky top-4 left-4 right-4 z-50 bg-[#09090B] text-white p-3 mx-4 rounded-3xl border border-slate-800 shadow-xl flex items-center justify-between select-none mb-4">
        <Link href={isAdmin ? "/portal/admin/dashboard" : "/portal/dashboard"} className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-white/10 p-0.5 border border-white/20">
            <img
              src="/favicon-withbg.png"
              alt="The Gravity Studios Logo"
              className="w-full h-full object-contain rounded-lg"
            />
          </div>
          <span className="font-extrabold text-xs tracking-wider uppercase font-sans">
            TGS PORTAL
          </span>
        </Link>

        <div className="flex items-center gap-1.5 overflow-x-auto">
          {navItems.slice(0, 5).map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`p-2 rounded-xl text-xs transition-all ${
                  isActive ? "bg-white text-black" : "text-slate-400 hover:text-white"
                }`}
                title={item.label}
              >
                <Icon className="w-4 h-4" />
              </Link>
            );
          })}
          <button
            onClick={handleLogout}
            className="p-2 text-red-400 hover:bg-red-500/20 rounded-xl cursor-pointer"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>
    </>
  );
}

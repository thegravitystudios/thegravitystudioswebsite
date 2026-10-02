"use client";

import React, { useState } from "react";
import { PortalTopHeader } from "@/components/PortalTopHeader";
import { PortalSidebar } from "@/components/PortalSidebar";
import { PortalRightSidebar } from "@/components/PortalRightSidebar";
import { PortalBreadcrumbs } from "@/components/PortalBreadcrumbs";
import { useToast } from "@/context/ToastContext";
import {
  BarChart2,
  TrendingUp,
  Download,
  Eye,
  Zap,
  Award,
  Calendar,
} from "lucide-react";

export default function AnalyticsPage() {
  const { addToast } = useToast();
  const [dateRange, setDateRange] = useState("Last 30 Days");

  const handleExportReport = () => {
    addToast("Generating Report", "Campaign performance PDF report exported successfully.", "success");
  };

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-primary)] flex flex-col font-sans transition-colors select-none">
      <PortalTopHeader userName="Anand Verma" companyName="Hero Motors" userRole="client" />

      <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-8 pb-12 flex flex-col lg:flex-row gap-6">
        <PortalSidebar companyName="Hero Motors" userRole="client" />

        <main className="flex-grow space-y-6">
          <PortalBreadcrumbs items={[{ label: "Analytics & ROI" }]} />

          {/* Header Bar */}
          <div className="p-6 sm:p-7 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-surface)] shadow-[0_10px_30px_rgba(0,0,0,0.03)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold font-headline text-[var(--text-primary)] flex items-center gap-3">
                <BarChart2 className="w-6 h-6 text-purple-400" />
                <span>Analytics & Performance ROI</span>
              </h1>
              <p className="text-xs text-[var(--text-muted)] mt-1">
                Campaign views, social engagement, production velocity, and media ROI.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="bg-[var(--bg-main)] border border-[var(--border-color)] rounded-2xl px-4 py-2.5 text-xs text-[var(--text-primary)] focus:outline-none focus:border-purple-500 font-mono font-bold"
              >
                <option value="Last 30 Days">Last 30 Days</option>
                <option value="Q3 2026">Q3 2026</option>
                <option value="Year-to-Date">Year-to-Date</option>
              </select>

              <button
                onClick={handleExportReport}
                className="px-4 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-md transition-all shrink-0 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Export PDF</span>
              </button>
            </div>
          </div>

          {/* KPI CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 font-mono text-xs">
            <div className="p-5 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-surface)] shadow-sm space-y-2">
              <div className="flex items-center justify-between text-[var(--text-muted)]">
                <span className="uppercase text-[10px]">Total Campaign Views</span>
                <Eye className="w-4 h-4 text-purple-400" />
              </div>
              <div className="text-2xl font-extrabold text-[var(--text-primary)] font-headline">1.48M</div>
              <span className="text-[10px] text-emerald-400 font-bold block">+24.5% vs last month</span>
            </div>

            <div className="p-5 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-surface)] shadow-sm space-y-2">
              <div className="flex items-center justify-between text-[var(--text-muted)]">
                <span className="uppercase text-[10px]">Avg Engagement Rate</span>
                <TrendingUp className="w-4 h-4 text-sky-400" />
              </div>
              <div className="text-2xl font-extrabold text-[var(--text-primary)] font-headline">18.4%</div>
              <span className="text-[10px] text-emerald-400 font-bold block">Top 5% Industry Benchmark</span>
            </div>

            <div className="p-5 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-surface)] shadow-sm space-y-2">
              <div className="flex items-center justify-between text-[var(--text-muted)]">
                <span className="uppercase text-[10px]">Production Velocity</span>
                <Zap className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-2xl font-extrabold text-[var(--text-primary)] font-headline">100%</div>
              <span className="text-[10px] text-purple-300 font-bold block">On-Time Milestones</span>
            </div>

            <div className="p-5 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-surface)] shadow-sm space-y-2">
              <div className="flex items-center justify-between text-[var(--text-muted)]">
                <span className="uppercase text-[10px]">Blended Media ROI</span>
                <Award className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-extrabold text-emerald-400 font-headline">3.85x</div>
              <span className="text-[10px] text-emerald-400 font-bold block">+0.4x Target Return</span>
            </div>
          </div>

          {/* PERFORMANCE BREAKDOWN CHARTS PLACEHOLDER */}
          <div className="p-6 sm:p-7 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-surface)] shadow-[0_10px_30px_rgba(0,0,0,0.03)] space-y-4">
            <h3 className="text-base font-bold font-headline text-[var(--text-primary)]">Deliverable Velocity & Views breakdown</h3>
            <div className="h-64 rounded-2xl bg-[var(--bg-main)] border border-[var(--border-color)] flex items-center justify-center p-6 text-center">
              <div className="space-y-2">
                <BarChart2 className="w-10 h-10 text-purple-400 mx-auto animate-bounce" />
                <p className="text-xs font-mono text-[var(--text-muted)]">
                  Live ROI Data Stream active for {dateRange}
                </p>
              </div>
            </div>
          </div>
        </main>

        <PortalRightSidebar />
      </div>
    </div>
  );
}

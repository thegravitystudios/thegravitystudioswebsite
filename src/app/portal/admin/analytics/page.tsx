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
  Award,
  Zap,
  Clock,
  CheckCircle2,
} from "lucide-react";

export default function AdminAnalyticsPage() {
  const { addToast } = useToast();
  const [range, setRange] = useState("This Month");

  const handleExportAdminReport = () => {
    addToast("Analytics Exported", "Agency master performance report downloaded as PDF.", "success");
  };

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-primary)] flex flex-col font-sans transition-colors select-none">
      <PortalTopHeader userName="Prameet Patani" companyName="Agency OS" userRole="admin" />

      <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-8 pb-12 flex flex-col lg:flex-row gap-6">
        <PortalSidebar companyName="Agency Admin" userRole="admin" />

        <main className="flex-grow space-y-6">
          <PortalBreadcrumbs items={[{ label: "Agency Analytics & Turnaround Velocity" }]} />

          {/* Header Bar */}
          <div className="p-6 sm:p-7 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-surface)] shadow-[0_10px_30px_rgba(0,0,0,0.03)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold font-headline text-[var(--text-primary)] flex items-center gap-3">
                <BarChart2 className="w-6 h-6 text-purple-400" />
                <span>Agency Throughput & Production Analytics</span>
              </h1>
              <p className="text-xs text-[var(--text-muted)] mt-1">
                Internal team editor turnaround speed, revision round averages, and client satisfaction.
              </p>
            </div>

            <button
              onClick={handleExportAdminReport}
              className="px-5 py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-md transition-all shrink-0 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Export PDF Report</span>
            </button>
          </div>

          {/* KPI STATS */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 font-mono text-xs">
            <div className="p-5 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-surface)] shadow-sm space-y-2">
              <span className="text-[10px] text-[var(--text-muted)] uppercase block">Avg Turnaround Speed</span>
              <div className="text-2xl font-extrabold text-[var(--text-primary)] font-headline">3.2 Days</div>
              <span className="text-[10px] text-emerald-400 font-bold block">-12% faster than target</span>
            </div>

            <div className="p-5 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-surface)] shadow-sm space-y-2">
              <span className="text-[10px] text-[var(--text-muted)] uppercase block">Revision Round Avg</span>
              <div className="text-2xl font-extrabold text-[var(--text-primary)] font-headline">1.2 Rounds</div>
              <span className="text-[10px] text-emerald-400 font-bold block">Low Client Revision Rate</span>
            </div>

            <div className="p-5 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-surface)] shadow-sm space-y-2">
              <span className="text-[10px] text-[var(--text-muted)] uppercase block">Production Capacity</span>
              <div className="text-2xl font-extrabold text-purple-300 font-headline">84%</div>
              <span className="text-[10px] text-purple-300 font-bold block">Optimal Team Utilization</span>
            </div>

            <div className="p-5 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-surface)] shadow-sm space-y-2">
              <span className="text-[10px] text-[var(--text-muted)] uppercase block">Client CSAT Score</span>
              <div className="text-2xl font-extrabold text-emerald-400 font-headline">9.8 / 10</div>
              <span className="text-[10px] text-emerald-400 font-bold block">High Retainer Retention</span>
            </div>
          </div>
        </main>

        <PortalRightSidebar />
      </div>
    </div>
  );
}

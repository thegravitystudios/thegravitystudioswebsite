"use client";

import React, { useState } from "react";
import Link from "next/link";
import { PortalTopHeader } from "@/components/PortalTopHeader";
import { PortalSidebar } from "@/components/PortalSidebar";
import { PortalRightSidebar } from "@/components/PortalRightSidebar";
import { useToast } from "@/context/ToastContext";
import {
  Bell,
  CheckCheck,
  FileText,
  MessageSquare,
  Receipt,
  AlertCircle,
  ArrowLeft,
  ExternalLink,
  Filter,
} from "lucide-react";

export default function NotificationsPage() {
  const { addToast } = useToast();
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const [notifications, setNotifications] = useState([
    {
      id: "n1",
      type: "deliverable",
      title: "New Deliverable Ready",
      message: "Hero Motors Commercial Cut v1 has been uploaded for your review.",
      timestamp: "10 mins ago",
      date: "Aug 29, 2026",
      read: false,
      linkUrl: "/portal/projects/demo/videos/demo-vid",
    },
    {
      id: "n2",
      type: "comment",
      title: "New Comment Pinned",
      message: "Prameet Patani replied to your timestamp comment at 0:12.",
      timestamp: "1 hour ago",
      date: "Aug 29, 2026",
      read: false,
      linkUrl: "/portal/projects/demo/videos/demo-vid",
    },
    {
      id: "n3",
      type: "invoice",
      title: "Invoice Issued",
      message: "Invoice #TGS-2026-001 (INR 2,50,000) is due on Sept 15, 2026.",
      timestamp: "1 day ago",
      date: "Aug 28, 2026",
      read: false,
      linkUrl: "/portal/projects/demo",
    },
    {
      id: "n4",
      type: "approval",
      title: "Revision Completed",
      message: "Brand Creative Brief v2 is ready for final sign-off.",
      timestamp: "2 days ago",
      date: "Aug 27, 2026",
      read: true,
      linkUrl: "/portal/projects/demo",
    },
    {
      id: "n5",
      type: "deliverable",
      title: "Project Scope Initialized",
      message: "Hero Motors Commercial Campaign project timeline and scope locked.",
      timestamp: "5 days ago",
      date: "Aug 24, 2026",
      read: true,
      linkUrl: "/portal/projects/demo",
    },
  ]);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    addToast("All notifications marked as read", undefined, "info");
  };

  const filtered = filter === "unread" ? notifications.filter((n) => !n.read) : notifications;

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-primary)] flex flex-col font-sans transition-colors">
      <PortalTopHeader userName="Client" companyName="Hero Motors" userRole="client" />

      <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-8 pb-12 flex flex-col lg:flex-row gap-6">
        <PortalSidebar companyName="Hero Motors" userRole="client" />

        <main className="flex-grow space-y-6">
          <Link
            href="/portal/dashboard"
            className="inline-flex items-center gap-2 text-xs font-mono text-[var(--text-muted)] hover:text-purple-400 transition-colors uppercase tracking-wider mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Dashboard</span>
          </Link>

          {/* Header Banner */}
          <div className="p-6 sm:p-7 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-surface)] shadow-[0_10px_30px_rgba(0,0,0,0.03)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold font-headline text-[var(--text-primary)] flex items-center gap-3">
                <Bell className="w-6 h-6 text-purple-400" />
                <span>Notification Center</span>
              </h1>
              <p className="text-xs text-[var(--text-muted)] mt-1">
                Full timeline history of project updates, comments, deliverables, and invoices.
              </p>
            </div>

            <button
              onClick={markAllRead}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-[var(--bg-main)] border border-[var(--border-color)] hover:border-purple-500/40 text-xs font-mono text-purple-400 font-bold uppercase transition-all shrink-0 cursor-pointer"
            >
              <CheckCheck className="w-4 h-4" />
              <span>Mark all as read</span>
            </button>
          </div>

          {/* Filter Bar */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-2xl text-xs font-mono font-bold uppercase transition-all cursor-pointer ${
                filter === "all"
                  ? "bg-purple-600 text-white shadow-md"
                  : "bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-muted)]"
              }`}
            >
              All Notifications ({notifications.length})
            </button>
            <button
              onClick={() => setFilter("unread")}
              className={`px-4 py-2 rounded-2xl text-xs font-mono font-bold uppercase transition-all cursor-pointer ${
                filter === "unread"
                  ? "bg-purple-600 text-white shadow-md"
                  : "bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-muted)]"
              }`}
            >
              Unread ({notifications.filter((n) => !n.read).length})
            </button>
          </div>

          {/* List */}
          <div className="p-6 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-surface)] shadow-[0_10px_30px_rgba(0,0,0,0.03)] space-y-3">
            {filtered.map((item) => (
              <div
                key={item.id}
                className={`p-4 rounded-2xl border transition-all flex items-start justify-between gap-4 ${
                  !item.read
                    ? "border-purple-500/40 bg-purple-500/5 text-[var(--text-primary)]"
                    : "border-[var(--border-color)] bg-[var(--bg-main)]/60 text-[var(--text-primary)]"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] shrink-0 mt-0.5">
                    {item.type === "deliverable" && <FileText className="w-4 h-4 text-purple-400" />}
                    {item.type === "comment" && <MessageSquare className="w-4 h-4 text-sky-400" />}
                    {item.type === "invoice" && <Receipt className="w-4 h-4 text-amber-400" />}
                    {item.type === "approval" && <AlertCircle className="w-4 h-4 text-emerald-400" />}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-bold font-headline">{item.title}</h3>
                      {!item.read && (
                        <span className="w-2 h-2 rounded-full bg-purple-500 shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-[var(--text-muted)] leading-relaxed">{item.message}</p>
                    <div className="mt-2 text-[10px] font-mono text-zinc-500">{item.date} • {item.timestamp}</div>
                  </div>
                </div>

                {item.linkUrl && (
                  <Link
                    href={item.linkUrl}
                    className="px-3.5 py-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] hover:border-purple-500/50 text-xs font-mono text-purple-400 font-bold uppercase transition-all shrink-0 flex items-center gap-1.5"
                  >
                    <span>View</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div>
            ))}
          </div>
        </main>

        <PortalRightSidebar />
      </div>
    </div>
  );
}

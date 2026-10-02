"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Bell, Check, CheckCheck, FileText, MessageSquare, AlertCircle, Receipt, ExternalLink } from "lucide-react";
import { useToast } from "@/context/ToastContext";

export interface NotificationItem {
  id: string;
  type: "deliverable" | "comment" | "approval" | "invoice";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  linkUrl?: string;
}

export function NotificationCenter() {
  const { addToast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: "n1",
      type: "deliverable",
      title: "New Deliverable Ready",
      message: "Hero Motors Commercial Cut v1 has been uploaded for your review.",
      timestamp: "10 mins ago",
      read: false,
      linkUrl: "/portal/projects/demo/videos/demo-vid",
    },
    {
      id: "n2",
      type: "comment",
      title: "New Comment Pinned",
      message: "Prameet Patani replied to your timestamp comment at 0:12.",
      timestamp: "1 hour ago",
      read: false,
      linkUrl: "/portal/projects/demo/videos/demo-vid",
    },
    {
      id: "n3",
      type: "invoice",
      title: "Invoice Issued",
      message: "Invoice #TGS-2026-001 (INR 2,50,000) is due on Sept 15, 2026.",
      timestamp: "1 day ago",
      read: false,
      linkUrl: "/portal/projects/demo",
    },
    {
      id: "n4",
      type: "approval",
      title: "Revision Completed",
      message: "Brand Creative Brief v2 is ready for final sign-off.",
      timestamp: "2 days ago",
      read: true,
      linkUrl: "/portal/projects/demo",
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    addToast("All notifications marked as read", undefined, "info");
  };

  const toggleRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "deliverable":
        return <FileText className="w-4 h-4 text-purple-400" />;
      case "comment":
        return <MessageSquare className="w-4 h-4 text-sky-400" />;
      case "invoice":
        return <Receipt className="w-4 h-4 text-amber-400" />;
      default:
        return <AlertCircle className="w-4 h-4 text-emerald-400" />;
    }
  };

  return (
    <div className="relative select-none">
      {/* Bell Button with Badge */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        type="button"
        className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-[var(--border-color)] bg-[var(--bg-surface)] flex items-center justify-center text-[var(--text-primary)] hover:border-purple-500/50 shadow-sm transition-all cursor-pointer"
        aria-label="Notifications"
      >
        <Bell className="w-4 h-4 text-zinc-600 dark:text-zinc-300" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-purple-600 text-white text-[9px] font-mono font-bold flex items-center justify-center shadow-md animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />

          <div className="absolute right-0 mt-3 w-80 sm:w-96 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-[0_20px_50px_rgba(0,0,0,0.3)] z-50 overflow-hidden font-sans">
            {/* Header */}
            <div className="p-4 border-b border-[var(--border-color)] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold font-headline text-[var(--text-primary)]">Notifications</span>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-mono text-[9px] font-bold">
                    {unreadCount} UNREAD
                  </span>
                )}
              </div>

              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="flex items-center gap-1 text-[10px] font-mono text-purple-400 hover:text-purple-300 transition-colors cursor-pointer"
                >
                  <CheckCheck className="w-3 h-3" />
                  <span>Mark all as read</span>
                </button>
              )}
            </div>

            {/* Notification Items List */}
            <div className="max-h-80 overflow-y-auto divide-y divide-[var(--border-color)]">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-xs text-[var(--text-muted)]">
                  No notifications yet.
                </div>
              ) : (
                notifications.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => toggleRead(item.id)}
                    className={`p-4 transition-all flex items-start gap-3 hover:bg-[var(--bg-main)] cursor-pointer ${
                      !item.read ? "bg-purple-500/5" : ""
                    }`}
                  >
                    <div className="p-2 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] shrink-0">
                      {getIcon(item.type)}
                    </div>

                    <div className="flex-grow min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-0.5">
                        <span className="text-xs font-bold text-[var(--text-primary)] truncate">{item.title}</span>
                        {!item.read && (
                          <span className="w-2 h-2 rounded-full bg-purple-500 shrink-0" />
                        )}
                      </div>
                      <p className="text-[11px] text-[var(--text-muted)] leading-relaxed line-clamp-2">
                        {item.message}
                      </p>
                      <div className="mt-1.5 flex items-center justify-between text-[10px] font-mono text-zinc-500">
                        <span>{item.timestamp}</span>
                        {item.linkUrl && (
                          <Link
                            href={item.linkUrl}
                            onClick={() => setIsOpen(false)}
                            className="text-purple-400 hover:underline flex items-center gap-1"
                          >
                            <span>View</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-[var(--border-color)] bg-[var(--bg-main)]/50 text-center">
              <Link
                href="/portal/notifications"
                onClick={() => setIsOpen(false)}
                className="text-xs font-mono font-bold text-purple-400 hover:text-purple-300 transition-colors uppercase tracking-wider"
              >
                View All Notifications →
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

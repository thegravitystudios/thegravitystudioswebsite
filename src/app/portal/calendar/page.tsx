"use client";

import React, { useState } from "react";
import Link from "next/link";
import { PortalTopHeader } from "@/components/PortalTopHeader";
import { PortalSidebar } from "@/components/PortalSidebar";
import { PortalRightSidebar } from "@/components/PortalRightSidebar";
import { PortalBreadcrumbs } from "@/components/PortalBreadcrumbs";
import { useToast } from "@/context/ToastContext";
import {
  Calendar as CalendarIcon,
  Plus,
  Video,
  CheckCircle2,
  Clock,
  Filter,
  X,
  Play,
  Share2,
} from "lucide-react";

interface ContentItem {
  id: string;
  title: string;
  platform: "Instagram" | "YouTube" | "LinkedIn" | "Meta Ads";
  date: string;
  time: string;
  status: "approved" | "in_review" | "draft" | "scheduled";
  videoUrl?: string;
}

export default function ContentCalendarPage() {
  const { addToast } = useToast();
  const [selectedPlatform, setSelectedPlatform] = useState<string>("All");
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  // Form states
  const [newTitle, setNewTitle] = useState("");
  const [newPlatform, setNewPlatform] = useState<"Instagram" | "YouTube" | "LinkedIn" | "Meta Ads">("Instagram");
  const [newDate, setNewDate] = useState("2026-09-05");

  const [items, setItems] = useState<ContentItem[]>([
    { id: "c1", title: "Hero Motors Launch Reel v1", platform: "Instagram", date: "Sept 01, 2026", time: "18:00 IST", status: "approved" },
    { id: "c2", title: "Behind The Scenes Production Cut", platform: "YouTube", date: "Sept 03, 2026", time: "12:00 IST", status: "in_review" },
    { id: "c3", title: "Executive Brand Storytelling", platform: "LinkedIn", date: "Sept 05, 2026", time: "10:00 IST", status: "scheduled" },
    { id: "c4", title: "Performance Ad Campaign Cut A", platform: "Meta Ads", date: "Sept 08, 2026", time: "09:00 IST", status: "draft" },
  ]);

  const filteredItems = selectedPlatform === "All"
    ? items
    : items.filter((i) => i.platform === selectedPlatform);

  const handleCreateItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;
    const newItem: ContentItem = {
      id: Date.now().toString(),
      title: newTitle,
      platform: newPlatform,
      date: newDate,
      time: "18:00 IST",
      status: "in_review",
    };
    setItems((prev) => [newItem, ...prev]);
    addToast("Content scheduled", `"${newTitle}" added to content pipeline.`);
    setNewTitle("");
    setCreateModalOpen(false);
  };

  const handleApprove = (id: string, title: string) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, status: "approved" as const } : i))
    );
    addToast("Content Approved!", `"${title}" has been approved for publishing.`);
    setSelectedContent(null);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-primary)] flex flex-col font-sans transition-colors select-none">
      <PortalTopHeader userName="Anand Verma" companyName="Hero Motors" userRole="client" />

      <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-8 pb-12 flex flex-col lg:flex-row gap-6">
        <PortalSidebar companyName="Hero Motors" userRole="client" />

        <main className="flex-grow space-y-6">
          <PortalBreadcrumbs items={[{ label: "Content Calendar" }]} />

          {/* Top Control Bar */}
          <div className="p-6 sm:p-7 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-surface)] shadow-[0_10px_30px_rgba(0,0,0,0.03)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold font-headline text-[var(--text-primary)] flex items-center gap-3">
                <CalendarIcon className="w-6 h-6 text-purple-400" />
                <span>Content Calendar & Deliverables</span>
              </h1>
              <p className="text-xs text-[var(--text-muted)] mt-1">
                Scheduled publishing pipeline for video reels, commercials, and brand content.
              </p>
            </div>

            <button
              onClick={() => setCreateModalOpen(true)}
              className="px-5 py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-md transition-all shrink-0 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Create Content</span>
            </button>
          </div>

          {/* Platform Filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {["All", "Instagram", "YouTube", "LinkedIn", "Meta Ads"].map((p) => (
              <button
                key={p}
                onClick={() => setSelectedPlatform(p)}
                className={`px-4 py-2 rounded-2xl text-xs font-mono font-bold uppercase transition-all shrink-0 cursor-pointer ${
                  selectedPlatform === p
                    ? "bg-purple-600 text-white shadow-md"
                    : "bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-muted)]"
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          {/* Content Pipeline Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedContent(item)}
                className="p-5 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-surface)] hover:border-purple-500/50 shadow-[0_10px_30px_rgba(0,0,0,0.03)] transition-all flex flex-col justify-between space-y-4 cursor-pointer group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-400 font-mono text-[9px] font-bold uppercase border border-purple-500/20">
                      {item.platform}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full font-mono text-[9px] font-bold uppercase border ${
                        item.status === "approved"
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : item.status === "in_review"
                          ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                          : "bg-zinc-800 text-zinc-400 border-zinc-700"
                      }`}
                    >
                      {item.status.replace("_", " ")}
                    </span>
                  </div>

                  <h3 className="text-base font-bold font-headline text-[var(--text-primary)] group-hover:text-purple-300 transition-colors">
                    {item.title}
                  </h3>
                </div>

                <div className="flex items-center justify-between text-xs font-mono text-[var(--text-muted)] pt-3 border-t border-[var(--border-color)]">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-zinc-400" />
                    <span>{item.date} • {item.time}</span>
                  </div>
                  <span className="text-purple-400 font-bold group-hover:underline">Review →</span>
                </div>
              </div>
            ))}
          </div>
        </main>

        <PortalRightSidebar />
      </div>

      {/* DELIVERABLE REVIEW MODAL */}
      {selectedContent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedContent(null)} />
          <div className="relative w-full max-w-lg bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-3xl p-6 shadow-2xl z-50 space-y-4 font-sans text-xs">
            <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
              <h3 className="text-base font-bold font-headline text-[var(--text-primary)]">{selectedContent.title}</h3>
              <button onClick={() => setSelectedContent(null)} className="text-zinc-500 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Placeholder */}
            <div className="w-full h-48 rounded-2xl bg-black flex items-center justify-center relative border border-[var(--border-color)]">
              <Play className="w-12 h-12 text-purple-400" />
            </div>

            <div className="flex justify-between font-mono text-xs text-[var(--text-muted)] bg-[var(--bg-main)] p-3 rounded-2xl border border-[var(--border-color)]">
              <span>Platform: <strong className="text-[var(--text-primary)]">{selectedContent.platform}</strong></span>
              <span>Publish Date: <strong className="text-purple-300">{selectedContent.date}</strong></span>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => handleApprove(selectedContent.id, selectedContent.title)}
                className="flex-grow py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold uppercase flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Approve Content</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE CONTENT MODAL */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setCreateModalOpen(false)} />
          <form onSubmit={handleCreateItem} className="relative w-full max-w-md bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-3xl p-6 shadow-2xl z-50 space-y-4 font-sans text-xs">
            <h3 className="text-base font-bold font-headline text-[var(--text-primary)]">+ Create New Deliverable</h3>
            <div>
              <label className="block font-mono text-[10px] text-[var(--text-muted)] uppercase mb-1">Content Title</label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Brand Commercial Cut B"
                className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-2xl px-4 py-3 text-xs text-[var(--text-primary)] focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block font-mono text-[10px] text-[var(--text-muted)] uppercase mb-1">Target Platform</label>
              <select
                value={newPlatform}
                onChange={(e) => setNewPlatform(e.target.value as any)}
                className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-2xl px-4 py-3 text-xs text-[var(--text-primary)] focus:outline-none focus:border-purple-500"
              >
                <option value="Instagram">Instagram Reels</option>
                <option value="YouTube">YouTube Shorts</option>
                <option value="LinkedIn">LinkedIn Video</option>
                <option value="Meta Ads">Meta Ad Campaign</option>
              </select>
            </div>
            <div className="flex gap-2 justify-end pt-2">
              <button
                type="button"
                onClick={() => setCreateModalOpen(false)}
                className="px-4 py-2.5 rounded-2xl border border-[var(--border-color)] text-[var(--text-muted)] text-xs font-mono uppercase font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-2xl bg-purple-600 text-white text-xs font-mono uppercase font-bold"
              >
                Schedule Deliverable
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

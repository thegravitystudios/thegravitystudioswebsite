"use client";

import React, { useState } from "react";
import Link from "next/link";
import { PortalTopHeader } from "@/components/PortalTopHeader";
import { PortalSidebar } from "@/components/PortalSidebar";
import { PortalRightSidebar } from "@/components/PortalRightSidebar";
import { PortalBreadcrumbs } from "@/components/PortalBreadcrumbs";
import { useToast } from "@/context/ToastContext";
import {
  Video,
  Upload,
  CheckCircle2,
  AlertCircle,
  Play,
  X,
  MessageSquare,
  Clock,
  ChevronRight,
} from "lucide-react";

interface DeliverableQC {
  id: string;
  title: string;
  clientCompany: string;
  revisionRound: number;
  maxRevisions: number;
  status: "pending_review" | "approved" | "revision_requested";
  videoUrl: string;
}

export default function MasterDeliverablesPage() {
  const { addToast } = useToast();
  const [selectedQC, setSelectedQC] = useState<DeliverableQC | null>(null);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);

  // Form states
  const [newVersionTitle, setNewVersionTitle] = useState("Hero Motors Commercial Cut v2");

  const [deliverables, setDeliverables] = useState<DeliverableQC[]>([
    { id: "v1", title: "Hero Motors Commercial Cut v1", clientCompany: "Hero Motors", revisionRound: 1, maxRevisions: 2, status: "pending_review", videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4" },
    { id: "v2", title: "Natural Veneers Architectural Showcase Cut v1", clientCompany: "Natural Veneers", revisionRound: 1, maxRevisions: 2, status: "revision_requested", videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4" },
    { id: "v3", title: "Aura Apparel Brand Anthem Reel", clientCompany: "Aura Apparel", revisionRound: 2, maxRevisions: 2, status: "approved", videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4" },
  ]);

  const handleUploadNewRound = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedQC) return;

    const nextRound = selectedQC.revisionRound + 1;
    setDeliverables((prev) =>
      prev.map((d) =>
        d.id === selectedQC.id
          ? { ...d, title: newVersionTitle, revisionRound: nextRound, status: "pending_review" }
          : d
      )
    );
    addToast("New Cut Uploaded", `Uploaded Cut v${nextRound} for ${selectedQC.clientCompany}.`);
    setUploadModalOpen(false);
    setSelectedQC(null);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-primary)] flex flex-col font-sans transition-colors select-none">
      <PortalTopHeader userName="Prameet Patani" companyName="Agency OS" userRole="admin" />

      <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-8 pb-12 flex flex-col lg:flex-row gap-6">
        <PortalSidebar companyName="Agency Admin" userRole="admin" />

        <main className="flex-grow space-y-6">
          <PortalBreadcrumbs items={[{ label: "Master Deliverables QC" }]} />

          {/* Header Bar */}
          <div className="p-6 sm:p-7 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-surface)] shadow-[0_10px_30px_rgba(0,0,0,0.03)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold font-headline text-[var(--text-primary)] flex items-center gap-3">
                <Video className="w-6 h-6 text-purple-400" />
                <span>Master Video QC & Deliverables Workstation</span>
              </h1>
              <p className="text-xs text-[var(--text-muted)] mt-1">
                Agency-wide video cut review, client feedback streams, and revision round bumping.
              </p>
            </div>
          </div>

          {/* QC CARDS GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {deliverables.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedQC(item)}
                className="p-5 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-surface)] hover:border-purple-500/50 shadow-[0_10px_30px_rgba(0,0,0,0.03)] transition-all flex flex-col justify-between space-y-4 cursor-pointer group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-mono text-purple-400 font-bold">{item.clientCompany}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full font-mono text-[9px] font-bold uppercase border ${
                        item.status === "approved"
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : item.status === "revision_requested"
                          ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                          : "bg-sky-500/10 text-sky-400 border-sky-500/20"
                      }`}
                    >
                      {item.status.replace("_", " ")}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold font-headline text-[var(--text-primary)] group-hover:text-purple-300 transition-colors">
                    {item.title}
                  </h3>
                </div>

                <div className="flex items-center justify-between text-[11px] font-mono text-[var(--text-muted)] pt-3 border-t border-[var(--border-color)]">
                  <span>Round {item.revisionRound}/{item.maxRevisions}</span>
                  <span className="text-purple-400 font-bold group-hover:underline">Inspect Cut →</span>
                </div>
              </div>
            ))}
          </div>
        </main>

        <PortalRightSidebar />
      </div>

      {/* QC WORKSTATION DRAWER */}
      {selectedQC && (
        <div className="fixed inset-0 z-50 flex justify-end select-none">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedQC(null)} />
          <div className="relative w-full max-w-md bg-[var(--bg-surface)] border-l border-[var(--border-color)] shadow-2xl h-full overflow-y-auto p-6 space-y-6 z-50 font-sans text-xs">
            <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
              <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-mono text-[10px] uppercase font-bold">
                DELIVERABLE WORKSTATION
              </span>
              <button onClick={() => setSelectedQC(null)} className="text-zinc-500 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <span className="text-xs font-mono text-purple-400 font-bold">{selectedQC.clientCompany}</span>
              <h3 className="text-base font-bold font-headline text-[var(--text-primary)]">{selectedQC.title}</h3>
            </div>

            <div className="w-full h-40 rounded-2xl bg-black flex items-center justify-center border border-[var(--border-color)]">
              <Play className="w-10 h-10 text-purple-400" />
            </div>

            <div className="pt-2">
              <button
                onClick={() => setUploadModalOpen(true)}
                className="w-full py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-mono text-xs font-bold uppercase flex items-center justify-center gap-2 shadow-md cursor-pointer"
              >
                <Upload className="w-4 h-4" />
                <span>+ Upload Cut v{selectedQC.revisionRound + 1}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* UPLOAD REVISION MODAL */}
      {uploadModalOpen && selectedQC && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setUploadModalOpen(false)} />
          <form onSubmit={handleUploadNewRound} className="relative w-full max-w-md bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-3xl p-6 shadow-2xl z-50 space-y-4 font-sans text-xs">
            <h3 className="text-base font-bold font-headline text-[var(--text-primary)]">Upload New Revision Round</h3>
            <div>
              <label className="block font-mono text-[10px] text-[var(--text-muted)] uppercase mb-1">New Version Title</label>
              <input
                type="text"
                required
                value={newVersionTitle}
                onChange={(e) => setNewVersionTitle(e.target.value)}
                className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-2xl px-4 py-3 text-xs text-[var(--text-primary)] focus:outline-none focus:border-purple-500"
              />
            </div>
            <div className="flex gap-2 justify-end pt-2">
              <button
                type="button"
                onClick={() => setUploadModalOpen(false)}
                className="px-4 py-2.5 rounded-2xl border border-[var(--border-color)] text-[var(--text-muted)] text-xs font-mono uppercase font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-2xl bg-purple-600 text-white text-xs font-mono uppercase font-bold"
              >
                Publish New Cut
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { PortalTopHeader } from "@/components/PortalTopHeader";
import { PortalSidebar } from "@/components/PortalSidebar";
import { PortalRightSidebar } from "@/components/PortalRightSidebar";
import { PortalBreadcrumbs } from "@/components/PortalBreadcrumbs";
import { useToast } from "@/context/ToastContext";
import {
  FileText,
  Plus,
  Download,
  CheckCircle2,
  X,
  FileCheck,
  ShieldCheck,
  Building2,
  ExternalLink,
  Video,
  Presentation,
  FolderArchive,
  Search,
  Filter,
} from "lucide-react";

interface VaultItem {
  id: string;
  title: string;
  category: "video_render" | "strategy_pdf" | "brand_asset" | "contract";
  fileType: string;
  fileSize: string;
  date: string;
  version: string;
  downloadUrl?: string;
  content?: string;
  signed?: boolean;
}

export default function DocumentVaultPage() {
  const { addToast } = useToast();
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedItem, setSelectedItem] = useState<VaultItem | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  // Form states for contract generation
  const [formType, setFormType] = useState<"MSA" | "SOW" | "Brief" | "NDA">("SOW");
  const [formCompany, setFormCompany] = useState("Hero Motors");
  const [formTitle, setFormTitle] = useState("Statement of Work - Commercial Brand Campaign");

  const [vaultItems, setVaultItems] = useState<VaultItem[]>([
    {
      id: "v1",
      title: "Hero Motors Brand Film - 4K ProRes 422 Master",
      category: "video_render",
      fileType: "MOV (4K ProRes)",
      fileSize: "4.8 GB",
      date: "Aug 29, 2026",
      version: "v1.0 Final",
      downloadUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      content: "4K Master Render File encoded in Apple ProRes 422 HQ with 24-bit uncompressed audio. Optimized for broadcast and theatrical distribution.",
    },
    {
      id: "v2",
      title: "2026 Brand Positioning & Go-To-Market Strategy Deck",
      category: "strategy_pdf",
      fileType: "PDF Document",
      fileSize: "24.5 MB",
      date: "Aug 25, 2026",
      version: "v2.1",
      downloadUrl: "#",
      content: "Complete 48-slide strategic blueprint covering target demographics, messaging pillars, omnichannel campaign roadmap, and ROI projections.",
    },
    {
      id: "v3",
      title: "Hero Motors Vector Logo Suite & Design Tokens",
      category: "brand_asset",
      fileType: "ZIP Archive",
      fileSize: "112 MB",
      date: "Aug 22, 2026",
      version: "v1.0",
      downloadUrl: "#",
      content: "Full brand identity package containing SVG, EPS, PNG logo variations, color palette spec sheets, typography packages, and social media templates.",
    },
    {
      id: "v4",
      title: "Master Services Agreement (MSA 2026)",
      category: "contract",
      fileType: "PDF Contract",
      fileSize: "1.8 MB",
      date: "Aug 15, 2026",
      version: "v1.0",
      signed: true,
      content: "This Master Services Agreement ('MSA') is entered into by and between The Gravity Studios and Hero Motors. Services include video production, brand strategy, campaign design, and paid media management.",
    },
    {
      id: "v5",
      title: "SOW #01 — Commercial Film Production Pipeline",
      category: "contract",
      fileType: "PDF Contract",
      fileSize: "2.4 MB",
      date: "Aug 20, 2026",
      version: "v1.0",
      signed: true,
      content: "Statement of Work #01 covers full pre-production, 4K video shoot, color grading, sound design master, and 2 revision rounds for upcoming brand vehicle launch.",
    },
    {
      id: "v6",
      title: "Social Media Teaser Cut (1080x1920 Vertical 9:16)",
      category: "video_render",
      fileType: "MP4 (H.264)",
      fileSize: "340 MB",
      date: "Aug 28, 2026",
      version: "v1.0 Final",
      downloadUrl: "#",
      content: "High-energy vertical video edit tailored for Instagram Reels, TikTok, and YouTube Shorts with dynamic burned-in kinetic typography.",
    },
  ]);

  const handleCreateDoc = (e: React.FormEvent) => {
    e.preventDefault();
    const newItem: VaultItem = {
      id: Date.now().toString(),
      title: formTitle,
      category: "contract",
      fileType: "PDF Contract",
      fileSize: "1.2 MB",
      date: "Aug 30, 2026",
      version: "v1.0",
      signed: false,
      content: `Official ${formType} legal contract document generated for ${formCompany}. Terms and scope of work attached.`,
    };
    setVaultItems((prev) => [newItem, ...prev]);
    addToast("Contract Generated", `${formType} document created for ${formCompany}.`, "success");
    setCreateModalOpen(false);
  };

  const handleDownload = (item: VaultItem) => {
    addToast("Download Initialized", `Preparing 4K / PDF download for "${item.title}".`, "success");
  };

  const filteredItems = vaultItems.filter((item) => {
    const matchesCategory = activeCategory === "all" || item.category === activeCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.fileType.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "video_render":
        return <Video className="w-5 h-5 text-purple-400" />;
      case "strategy_pdf":
        return <Presentation className="w-5 h-5 text-fuchsia-400" />;
      case "brand_asset":
        return <FolderArchive className="w-5 h-5 text-amber-400" />;
      case "contract":
      default:
        return <FileText className="w-5 h-5 text-emerald-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-primary)] flex flex-col font-sans transition-colors select-none">
      <PortalTopHeader userName="Anand Verma" companyName="Hero Motors" userRole="client" />

      <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-8 pb-12 flex flex-col lg:flex-row gap-6">
        <PortalSidebar companyName="Hero Motors" userRole="client" />

        <main className="flex-grow space-y-6">
          <PortalBreadcrumbs items={[{ label: "Deliverables Vault & Documents" }]} />

          {/* Header Bar */}
          <div className="p-6 sm:p-7 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-surface)] shadow-[0_10px_30px_rgba(0,0,0,0.03)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold font-headline text-[var(--text-primary)] flex items-center gap-3">
                <FileText className="w-6 h-6 text-purple-400" />
                <span>Deliverables Vault & Documents</span>
              </h1>
              <p className="text-xs text-[var(--text-muted)] mt-1">
                Download 4K video renders, strategy PDFs, brand assets, and signed legal agreements.
              </p>
            </div>

            <button
              onClick={() => setCreateModalOpen(true)}
              className="px-5 py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-[0_0_20px_rgba(168,85,247,0.35)] transition-all shrink-0 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Generate Contract</span>
            </button>
          </div>

          {/* Category Filter Pills & Search Input */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            {/* Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
              {[
                { id: "all", label: "All Deliverables" },
                { id: "video_render", label: "4K Video Masters" },
                { id: "strategy_pdf", label: "Strategy Decks" },
                { id: "brand_asset", label: "Brand Assets" },
                { id: "contract", label: "Contracts & MSA" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveCategory(tab.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase transition-all shrink-0 cursor-pointer ${
                    activeCategory === tab.id
                      ? "bg-purple-600/20 text-purple-300 border border-purple-500/40 shadow-sm"
                      : "bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-muted)] hover:text-white"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative min-w-[240px]">
              <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search deliverables..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-purple-500/70"
              />
            </div>
          </div>

          {/* DELIVERABLES VAULT GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className="p-5 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-surface)] hover:border-purple-500/50 shadow-[0_10px_30px_rgba(0,0,0,0.03)] transition-all flex flex-col justify-between space-y-4 cursor-pointer group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20">
                        {getCategoryIcon(item.category)}
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-400 font-mono text-[9px] font-bold uppercase border border-purple-500/20">
                        {item.fileType}
                      </span>
                    </div>

                    {item.signed !== undefined && (
                      <span
                        className={`px-2 py-0.5 rounded-full font-mono text-[9px] font-bold uppercase border ${
                          item.signed
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                        }`}
                      >
                        {item.signed ? "Signed ✓" : "Pending Sign"}
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold font-headline text-[var(--text-primary)] group-hover:text-purple-300 transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                </div>

                <div className="flex items-center justify-between text-xs font-mono text-[var(--text-muted)] pt-3 border-t border-[var(--border-color)]">
                  <span>{item.fileSize} • {item.date}</span>
                  <span className="text-purple-400 font-bold group-hover:underline flex items-center gap-1">
                    <span>View Asset</span>
                    <ExternalLink className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </main>

        <PortalRightSidebar />
      </div>

      {/* DELIVERABLE DETAILS & DOWNLOAD MODAL */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedItem(null)} />
          <div className="relative w-full max-w-xl bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-3xl p-6 shadow-2xl z-50 space-y-6 font-sans text-xs max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-[var(--border-color)] pb-3">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/20">
                  {getCategoryIcon(selectedItem.category)}
                </div>
                <div>
                  <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-mono text-[10px] uppercase font-bold">
                    {selectedItem.fileType}
                  </span>
                  <h3 className="text-base font-bold font-headline text-[var(--text-primary)] mt-1">
                    {selectedItem.title}
                  </h3>
                </div>
              </div>
              <button onClick={() => setSelectedItem(null)} className="text-zinc-500 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-[var(--bg-main)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] leading-relaxed space-y-3 font-mono">
              <p>{selectedItem.content}</p>
              <div className="pt-2 flex items-center justify-between text-[11px] text-zinc-400 border-t border-[var(--border-color)]">
                <span>Version: <strong className="text-white">{selectedItem.version}</strong></span>
                <span>File Size: <strong className="text-white">{selectedItem.fileSize}</strong></span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleDownload(selectedItem)}
                className="flex-grow py-3.5 rounded-2xl tgs-gradient-bg text-white font-mono text-xs font-bold uppercase flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(168,85,247,0.35)]"
              >
                <Download className="w-4 h-4" />
                <span>Download High-Res Deliverable ({selectedItem.fileSize})</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE DOCUMENT / CONTRACT MODAL */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setCreateModalOpen(false)} />
          <form onSubmit={handleCreateDoc} className="relative w-full max-w-md bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-3xl p-6 shadow-2xl z-50 space-y-4 font-sans text-xs">
            <h3 className="text-base font-bold font-headline text-[var(--text-primary)]">+ Generate Contract Document</h3>
            <div>
              <label className="block font-mono text-[10px] text-[var(--text-muted)] uppercase mb-1">Document Type</label>
              <select
                value={formType}
                onChange={(e) => setFormType(e.target.value as any)}
                className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-2xl px-4 py-3 text-xs text-[var(--text-primary)] focus:outline-none focus:border-purple-500"
              >
                <option value="SOW">Statement of Work (SOW)</option>
                <option value="MSA">Master Services Agreement (MSA)</option>
                <option value="Brief">Creative Brief</option>
                <option value="NDA">Non-Disclosure Agreement (NDA)</option>
              </select>
            </div>
            <div>
              <label className="block font-mono text-[10px] text-[var(--text-muted)] uppercase mb-1">Document Title</label>
              <input
                type="text"
                required
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-2xl px-4 py-3 text-xs text-[var(--text-primary)] focus:outline-none focus:border-purple-500"
              />
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
                className="px-5 py-2.5 rounded-2xl tgs-gradient-bg text-white text-xs font-mono uppercase font-bold"
              >
                Generate Contract
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

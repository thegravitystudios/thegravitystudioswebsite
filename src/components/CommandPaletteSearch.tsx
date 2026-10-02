"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, FileText, CheckSquare, Video, Folder, Layers, X, Command } from "lucide-react";

interface SearchResultItem {
  id: string;
  type: "document" | "task" | "video" | "project";
  title: string;
  subtitle: string;
  url: string;
}

export function CommandPaletteSearch({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  const mockDatabase: SearchResultItem[] = [
    {
      id: "1",
      type: "project",
      title: "Hero Motors Brand & Website Redesign",
      subtitle: "Active Project • Phase 03 Production",
      url: "/portal/projects/demo",
    },
    {
      id: "2",
      type: "video",
      title: "Hero Motors Commercial Cut v1",
      subtitle: "Video Deliverable • Revision 1/2",
      url: "/portal/projects/demo/videos/demo-vid",
    },
    {
      id: "3",
      type: "document",
      title: "Brand Creative Brief & Treatments",
      subtitle: "Document • v1",
      url: "/portal/projects/demo",
    },
    {
      id: "4",
      type: "document",
      title: "Agency client contract.doc",
      subtitle: "Document • Legal",
      url: "/portal/projects/demo",
    },
    {
      id: "5",
      type: "task",
      title: "Define the target market and audience",
      subtitle: "Client Task • Analytics",
      url: "/portal/dashboard#tasks",
    },
    {
      id: "6",
      type: "task",
      title: "Handover the design assets and specifications",
      subtitle: "Client Task • High Priority",
      url: "/portal/dashboard#tasks",
    },
    {
      id: "7",
      type: "task",
      title: "Conduct competitor analysis",
      subtitle: "Client Task • Analytics",
      url: "/portal/dashboard#tasks",
    },
  ];

  const results = query.trim()
    ? mockDatabase.filter(
        (item) =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.subtitle.toLowerCase().includes(query.toLowerCase())
      )
    : mockDatabase.slice(0, 5);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
      setSelectedIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Open palette
          const event = new CustomEvent("open-command-palette");
          window.dispatchEvent(event);
        }
      }

      if (!isOpen) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % results.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + results.length) % results.length);
      } else if (e.key === "Enter" && results[selectedIndex]) {
        e.preventDefault();
        router.push(results[selectedIndex].url);
        onClose();
      } else if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, results, selectedIndex, router, onClose]);

  if (!isOpen) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Video className="w-4 h-4 text-purple-400" />;
      case "document":
        return <FileText className="w-4 h-4 text-sky-400" />;
      case "task":
        return <CheckSquare className="w-4 h-4 text-amber-400" />;
      case "project":
        return <Layers className="w-4 h-4 text-emerald-400" />;
      default:
        return <Folder className="w-4 h-4 text-purple-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 select-none">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={onClose} />

      <div className="relative w-full max-w-xl bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.5)] overflow-hidden z-50 font-sans animate-fade-in">
        {/* Search Input Box */}
        <div className="p-4 border-b border-[var(--border-color)] flex items-center gap-3">
          <Search className="w-5 h-5 text-purple-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Type to search docs, tasks, files, deliverables..."
            className="w-full bg-transparent text-sm text-[var(--text-primary)] placeholder:text-zinc-400 focus:outline-none"
          />
          <button onClick={onClose} className="text-zinc-500 hover:text-white p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search Results List */}
        <div className="max-h-96 overflow-y-auto p-2 space-y-1">
          {results.length === 0 ? (
            <div className="p-8 text-center text-xs text-[var(--text-muted)]">
              No matching files, tasks, or deliverables found.
            </div>
          ) : (
            results.map((item, idx) => (
              <div
                key={item.id}
                onClick={() => {
                  router.push(item.url);
                  onClose();
                }}
                className={`p-3 rounded-2xl flex items-center justify-between transition-all cursor-pointer ${
                  idx === selectedIndex
                    ? "bg-purple-600/20 border border-purple-500/40 text-white"
                    : "hover:bg-[var(--bg-main)] text-[var(--text-primary)] border border-transparent"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)]">
                    {getIcon(item.type)}
                  </div>
                  <div>
                    <div className="text-xs font-bold font-headline">{item.title}</div>
                    <div className="text-[10px] font-mono text-[var(--text-muted)]">{item.subtitle}</div>
                  </div>
                </div>

                <div className="text-[10px] font-mono text-purple-400 uppercase font-bold shrink-0">
                  Select ↵
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Shortcut Bar */}
        <div className="p-3 bg-[var(--bg-main)] border-t border-[var(--border-color)] flex items-center justify-between text-[10px] font-mono text-[var(--text-muted)]">
          <div className="flex items-center gap-2">
            <span className="px-1.5 py-0.5 rounded bg-[var(--bg-surface)] border border-[var(--border-color)]">↑↓</span>
            <span>Navigate</span>
            <span className="px-1.5 py-0.5 rounded bg-[var(--bg-surface)] border border-[var(--border-color)]">↵</span>
            <span>Open</span>
            <span className="px-1.5 py-0.5 rounded bg-[var(--bg-surface)] border border-[var(--border-color)]">ESC</span>
            <span>Close</span>
          </div>

          <div className="flex items-center gap-1">
            <Command className="w-3 h-3 text-purple-400" />
            <span>+ K</span>
          </div>
        </div>
      </div>
    </div>
  );
}

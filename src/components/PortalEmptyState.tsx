"use client";

import React from "react";
import { Folder, CheckSquare, FileText, Video, Inbox } from "lucide-react";

interface EmptyStateProps {
  type?: "files" | "tasks" | "docs" | "videos" | "general";
  title?: string;
  message?: string;
}

export function PortalEmptyState({
  type = "general",
  title,
  message,
}: EmptyStateProps) {
  const getIcon = () => {
    switch (type) {
      case "files":
        return <Folder className="w-8 h-8 text-purple-400" />;
      case "tasks":
        return <CheckSquare className="w-8 h-8 text-amber-400" />;
      case "docs":
        return <FileText className="w-8 h-8 text-sky-400" />;
      case "videos":
        return <Video className="w-8 h-8 text-rose-400" />;
      default:
        return <Inbox className="w-8 h-8 text-zinc-400" />;
    }
  };

  const getDefaultTitle = () => {
    switch (type) {
      case "files":
        return "No files uploaded yet";
      case "tasks":
        return "No action items pending";
      case "docs":
        return "No documents uploaded yet";
      case "videos":
        return "No video cuts uploaded yet";
      default:
        return "Nothing here yet";
    }
  };

  const getDefaultMessage = () => {
    switch (type) {
      case "files":
        return "Your studio production team will add downloadable files as your project moves forward.";
      case "tasks":
        return "You have no outstanding approval tasks or client action items at this stage.";
      case "docs":
        return "Your brand brief, contract, and strategy documents will appear here once finalized.";
      case "videos":
        return "First video cuts and revisions will be uploaded here for timecoded review.";
      default:
        return "Items will be populated here as project milestones complete.";
    }
  };

  return (
    <div className="p-8 sm:p-12 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-main)]/50 text-center font-sans">
      <div className="w-14 h-14 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-color)] flex items-center justify-center mx-auto mb-3 shadow-sm">
        {getIcon()}
      </div>
      <h4 className="text-sm font-bold font-headline text-[var(--text-primary)] mb-1">
        {title || getDefaultTitle()}
      </h4>
      <p className="text-xs text-[var(--text-muted)] max-w-sm mx-auto leading-relaxed">
        {message || getDefaultMessage()}
      </p>
    </div>
  );
}

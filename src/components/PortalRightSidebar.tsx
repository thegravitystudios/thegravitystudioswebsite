"use client";

import React, { useState } from "react";
import { MessageSquare, FileText, Send, User, Download, ExternalLink } from "lucide-react";

interface PortalRightSidebarProps {
  documents?: { id: string; name: string; file_url: string }[];
  activities?: { id: string; action: string; created_at: string }[];
}

export function PortalRightSidebar({ documents = [], activities = [] }: PortalRightSidebarProps) {
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState([
    {
      id: "1",
      sender: "Alex Lovter (Producer)",
      text: "What do you think on the new design options? Here is the link.",
      time: "1h ago",
      isUser: false,
    },
    {
      id: "2",
      sender: "You",
      text: "Everything is great! But I have some points to discuss. Left some comments for you.",
      time: "2h ago",
      isUser: true,
    },
  ]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setChatMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        sender: "You",
        text: chatInput.trim(),
        time: "Just now",
        isUser: true,
      },
    ]);
    setChatInput("");
  };

  const defaultDocs = [
    { id: "d1", name: "Agency client contract.doc", file_url: "#" },
    { id: "d2", name: "Main concept.pdf", file_url: "#" },
    { id: "d3", name: "Agreement.pdf", file_url: "#" },
  ];

  const docList = documents.length > 0 ? documents : defaultDocs;

  return (
    <aside className="w-full lg:w-80 flex flex-col gap-6 shrink-0 select-none">
      {/* 1. CHAT / ACTIVITY STREAM CARD matching reference image */}
      <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-3xl p-5 shadow-[0_10px_30px_rgba(0,0,0,0.03)] flex flex-col justify-between min-h-[340px]">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold font-headline text-[var(--text-primary)]">Chat & Notes</h3>
            <span className="type-eyebrow text-[9px] font-mono text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded-full">
              LIVE
            </span>
          </div>

          <div className="space-y-3 font-sans text-xs">
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`p-3 rounded-2xl ${
                  msg.isUser
                    ? "bg-purple-600/10 border border-purple-500/20 text-[var(--text-primary)] ml-4"
                    : "bg-[var(--bg-main)] border border-[var(--border-color)] text-[var(--text-primary)] mr-4"
                }`}
              >
                <div className="flex items-center justify-between text-[10px] font-mono text-[var(--text-muted)] mb-1">
                  <span className="font-bold">{msg.sender}</span>
                  <span>{msg.time}</span>
                </div>
                <p className="text-xs text-[var(--text-primary)] leading-relaxed">{msg.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Input Field */}
        <form onSubmit={handleSendMessage} className="mt-4 pt-3 border-t border-[var(--border-color)] relative flex items-center">
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder="Add message..."
            className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-2xl pl-3.5 pr-10 py-2.5 text-xs text-[var(--text-primary)] placeholder:text-zinc-400 focus:outline-none focus:border-purple-500"
          />
          <button
            type="submit"
            className="absolute right-2 w-7 h-7 rounded-xl bg-purple-600 text-white flex items-center justify-center hover:bg-purple-500 transition-colors cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>

      {/* 2. LATEST DOCS CARD matching reference image */}
      <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-3xl p-5 shadow-[0_10px_30px_rgba(0,0,0,0.03)]">
        <h3 className="text-sm font-bold font-headline text-[var(--text-primary)] mb-4">Latest Docs</h3>

        <div className="space-y-2.5">
          {docList.slice(0, 4).map((doc) => (
            <a
              key={doc.id}
              href={doc.file_url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between p-3 rounded-2xl bg-[var(--bg-main)] border border-[var(--border-color)] hover:border-purple-500/40 hover:bg-purple-500/5 text-xs font-medium text-[var(--text-primary)] transition-all group"
            >
              <div className="flex items-center gap-2.5 truncate">
                <FileText className="w-4 h-4 text-purple-400 shrink-0" />
                <span className="truncate">{doc.name}</span>
              </div>
              <Download className="w-3.5 h-3.5 text-zinc-400 group-hover:text-purple-400 shrink-0" />
            </a>
          ))}
        </div>
      </div>
    </aside>
  );
}

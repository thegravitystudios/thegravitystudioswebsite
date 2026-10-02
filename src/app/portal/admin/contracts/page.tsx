"use client";

import React, { useState } from "react";
import Link from "next/link";
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
} from "lucide-react";

import { DocumentGeneratorModal } from "@/components/DocumentGeneratorModal";

interface AdminProposalRecord {
  id: string;
  title: string;
  type: "SOW" | "MSA" | "Proposal";
  company: string;
  amount: string;
  status: "Draft" | "Sent" | "Signed";
}

export default function AdminContractsPage() {
  const { addToast } = useToast();
  const [selectedProposal, setSelectedProposal] = useState<AdminProposalRecord | null>(null);
  const [generatorModalOpen, setGeneratorModalOpen] = useState(false);

  // Form states
  const [formCompany, setFormCompany] = useState("Aura Apparel");
  const [formTitle, setFormTitle] = useState("SOW #02 — Q4 Campaign Content Retainer");
  const [formAmount, setFormAmount] = useState("₹1,50,000 / mo");

  const [proposals, setProposals] = useState<AdminProposalRecord[]>([
    { id: "p1", title: "Master Services Agreement 2026", type: "MSA", company: "Hero Motors", amount: "₹2,50,000 / mo", status: "Signed" },
    { id: "p2", title: "SOW #01 — Commercial Film Production", type: "SOW", company: "Hero Motors", amount: "₹2,50,000 / mo", status: "Signed" },
    { id: "p3", title: "Brand Identity & 3D Render Retainer Proposal", type: "Proposal", company: "Natural Veneers", amount: "₹1,80,000 / mo", status: "Sent" },
  ]);

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-primary)] flex flex-col font-sans transition-colors select-none">
      <PortalTopHeader userName="Prameet Patani" companyName="Agency OS" userRole="admin" />

      <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-8 pb-12 flex flex-col lg:flex-row gap-6">
        <PortalSidebar companyName="Agency Admin" userRole="admin" />

        <main className="flex-grow space-y-6">
          <PortalBreadcrumbs items={[{ label: "Contract & Proposal Studio" }]} />

          {/* Header Bar */}
          <div className="p-6 sm:p-7 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-surface)] shadow-[0_10px_30px_rgba(0,0,0,0.03)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold font-headline text-[var(--text-primary)] flex items-center gap-3">
                <FileText className="w-6 h-6 text-purple-400" />
                <span>Contract & Proposal Studio</span>
              </h1>
              <p className="text-xs text-[var(--text-muted)] mt-1">
                Internal MSA, SOW, and legal proposal agreement generator.
              </p>
            </div>

            <button
              onClick={() => setGeneratorModalOpen(true)}
              className="px-5 py-3 rounded-2xl black-pill-btn text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 shadow-md transition-all shrink-0 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Launch Document Studio</span>
            </button>
          </div>

          {/* PROPOSALS GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {proposals.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedProposal(item)}
                className="p-5 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-surface)] hover:border-purple-500/50 shadow-[0_10px_30px_rgba(0,0,0,0.03)] transition-all flex flex-col justify-between space-y-4 cursor-pointer group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-mono text-purple-400 font-bold">{item.company}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full font-mono text-[9px] font-bold uppercase border ${
                        item.status === "Signed"
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : "bg-sky-500/10 text-sky-400 border-sky-500/20"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold font-headline text-[var(--text-primary)] group-hover:text-purple-300 transition-colors">
                    {item.title}
                  </h3>
                </div>

                <div className="flex items-center justify-between text-[11px] font-mono text-[var(--text-muted)] pt-3 border-t border-[var(--border-color)]">
                  <span className="text-emerald-400 font-bold">{item.amount}</span>
                  <span className="text-purple-400 font-bold group-hover:underline">View Contract →</span>
                </div>
              </div>
            ))}
          </div>
        </main>

        <PortalRightSidebar />
      </div>

      {/* DYNAMIC DOCUMENT GENERATOR MODAL */}
      <DocumentGeneratorModal
        isOpen={generatorModalOpen}
        onClose={() => setGeneratorModalOpen(false)}
        onDocumentCreated={(newDoc) => {
          setProposals((prev) => [
            {
              id: newDoc.id,
              title: newDoc.title,
              type: "SOW",
              company: newDoc.company,
              amount: "Custom Retainer",
              status: "Signed",
            },
            ...prev,
          ]);
        }}
      />
    </div>
  );
}

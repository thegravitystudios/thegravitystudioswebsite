"use client";

import React, { useState } from "react";
import { PortalTopHeader } from "@/components/PortalTopHeader";
import { PortalSidebar } from "@/components/PortalSidebar";
import { PortalRightSidebar } from "@/components/PortalRightSidebar";
import { PortalBreadcrumbs } from "@/components/PortalBreadcrumbs";
import { useToast } from "@/context/ToastContext";
import {
  Receipt,
  Plus,
  Download,
  CheckCircle2,
  DollarSign,
  CreditCard,
  Building2,
  TrendingUp,
  X,
} from "lucide-react";

interface AdminInvoiceItem {
  id: string;
  invoiceNumber: string;
  clientCompany: string;
  amount: number;
  date: string;
  status: "paid" | "unpaid";
}

export default function AdminFinancePage() {
  const { addToast } = useToast();
  const [selectedInv, setSelectedInv] = useState<AdminInvoiceItem | null>(null);
  const [issueModalOpen, setIssueModalOpen] = useState(false);

  // Form states
  const [formNumber, setFormNumber] = useState("TGS-2026-004");
  const [formCompany, setFormCompany] = useState("Hero Motors");
  const [formAmount, setFormAmount] = useState(250000);

  const [invoices, setInvoices] = useState<AdminInvoiceItem[]>([
    { id: "i1", invoiceNumber: "TGS-2026-001", clientCompany: "Hero Motors", amount: 250000, date: "Sept 15, 2026", status: "unpaid" },
    { id: "i2", invoiceNumber: "TGS-2026-002", clientCompany: "Natural Veneers", amount: 180000, date: "Aug 15, 2026", status: "paid" },
    { id: "i3", invoiceNumber: "TGS-2026-003", clientCompany: "Aura Apparel", amount: 150000, date: "July 31, 2026", status: "paid" },
  ]);

  const toggleStatus = (id: string) => {
    setInvoices((prev) =>
      prev.map((i) => {
        if (i.id === id) {
          const next = i.status === "paid" ? "unpaid" : "paid";
          addToast(
            next === "paid" ? "Bank Transfer Verified" : "Status reset to Unpaid",
            `Invoice ${i.invoiceNumber} set to ${next.toUpperCase()}.`,
            next === "paid" ? "success" : "info"
          );
          return { ...i, status: next };
        }
        return i;
      })
    );
  };

  const handleIssueInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    const newInv: AdminInvoiceItem = {
      id: Date.now().toString(),
      invoiceNumber: formNumber,
      clientCompany: formCompany,
      amount: Number(formAmount),
      date: "Aug 30, 2026",
      status: "unpaid",
    };
    setInvoices((prev) => [newInv, ...prev]);
    addToast("Tax Invoice Issued", `Issued ${formNumber} (INR ${formAmount.toLocaleString()}) for ${formCompany}.`);
    setIssueModalOpen(false);
  };

  const totalMRR = invoices.reduce((acc, i) => acc + i.amount, 0);
  const collected = invoices.filter((i) => i.status === "paid").reduce((acc, i) => acc + i.amount, 0);
  const pending = invoices.filter((i) => i.status === "unpaid").reduce((acc, i) => acc + i.amount, 0);

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-primary)] flex flex-col font-sans transition-colors select-none">
      <PortalTopHeader userName="Prameet Patani" companyName="Agency OS" userRole="admin" />

      <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-8 pb-12 flex flex-col lg:flex-row gap-6">
        <PortalSidebar companyName="Agency Admin" userRole="admin" />

        <main className="flex-grow space-y-6">
          <PortalBreadcrumbs items={[{ label: "Agency Financial Ledger" }]} />

          {/* Header Bar */}
          <div className="p-6 sm:p-7 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-surface)] shadow-[0_10px_30px_rgba(0,0,0,0.03)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold font-headline text-[var(--text-primary)] flex items-center gap-3">
                <Receipt className="w-6 h-6 text-purple-400" />
                <span>Agency Revenue & Accounts Receivable</span>
              </h1>
              <p className="text-xs text-[var(--text-muted)] mt-1">
                Internal financial ledger, retainer billing, GST tax receipts, and bank verification.
              </p>
            </div>

            <button
              onClick={() => setIssueModalOpen(true)}
              className="px-5 py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-md transition-all shrink-0 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Issue Tax Invoice</span>
            </button>
          </div>

          {/* Financial Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
            <div className="p-5 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-surface)] shadow-sm space-y-1">
              <span className="text-[10px] text-[var(--text-muted)] uppercase">Agency Monthly Contract Value</span>
              <div className="text-2xl font-extrabold text-[var(--text-primary)] font-headline">INR {totalMRR.toLocaleString()}</div>
            </div>

            <div className="p-5 rounded-3xl border border-emerald-500/30 bg-emerald-500/5 shadow-sm space-y-1">
              <span className="text-[10px] text-emerald-400 uppercase">Verified Collections</span>
              <div className="text-2xl font-extrabold text-emerald-400 font-headline">INR {collected.toLocaleString()}</div>
            </div>

            <div className="p-5 rounded-3xl border border-amber-500/30 bg-amber-500/5 shadow-sm space-y-1">
              <span className="text-[10px] text-amber-400 uppercase">Outstanding Receivables</span>
              <div className="text-2xl font-extrabold text-amber-400 font-headline">INR {pending.toLocaleString()}</div>
            </div>
          </div>

          {/* TABLE */}
          <div className="p-6 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-surface)] shadow-[0_10px_30px_rgba(0,0,0,0.03)] overflow-x-auto">
            <table className="w-full text-left text-xs font-sans border-collapse">
              <thead>
                <tr className="border-b border-[var(--border-color)] font-mono text-[10px] text-[var(--text-muted)] uppercase">
                  <th className="py-3 px-3">Invoice #</th>
                  <th className="py-3 px-3">Client Company</th>
                  <th className="py-3 px-3">Receivable Amount</th>
                  <th className="py-3 px-3">Due Date</th>
                  <th className="py-3 px-3">Payment Verification</th>
                  <th className="py-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-color)]">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-[var(--bg-main)]/50 transition-colors">
                    <td className="py-4 px-3 font-mono font-bold text-purple-400">{inv.invoiceNumber}</td>
                    <td className="py-4 px-3 font-bold text-[var(--text-primary)]">{inv.clientCompany}</td>
                    <td className="py-4 px-3 font-mono font-bold text-[var(--text-primary)]">INR {inv.amount.toLocaleString()}</td>
                    <td className="py-4 px-3 font-mono text-zinc-400">{inv.date}</td>
                    <td className="py-4 px-3 font-mono">
                      <button
                        onClick={() => toggleStatus(inv.id)}
                        className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase border cursor-pointer transition-all ${
                          inv.status === "paid"
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20"
                            : "bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/20"
                        }`}
                      >
                        {inv.status === "paid" ? "Paid ✓ (Verified)" : "Mark as Paid"}
                      </button>
                    </td>
                    <td className="py-4 px-3 text-right">
                      <button
                        onClick={() => setSelectedInv(inv)}
                        className="text-xs font-mono font-bold text-purple-400 hover:underline"
                      >
                        Inspect Invoice →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>

        <PortalRightSidebar />
      </div>

      {/* ISSUE INVOICE MODAL */}
      {issueModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIssueModalOpen(false)} />
          <form onSubmit={handleIssueInvoice} className="relative w-full max-w-md bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-3xl p-6 shadow-2xl z-50 space-y-4 font-sans text-xs">
            <h3 className="text-base font-bold font-headline text-[var(--text-primary)]">+ Issue Retainer Invoice</h3>
            <div>
              <label className="block font-mono text-[10px] text-[var(--text-muted)] uppercase mb-1">Invoice Number</label>
              <input
                type="text"
                required
                value={formNumber}
                onChange={(e) => setFormNumber(e.target.value)}
                className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-2xl px-4 py-3 text-xs text-[var(--text-primary)] focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block font-mono text-[10px] text-[var(--text-muted)] uppercase mb-1">Client Company</label>
              <input
                type="text"
                required
                value={formCompany}
                onChange={(e) => setFormCompany(e.target.value)}
                className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-2xl px-4 py-3 text-xs text-[var(--text-primary)] focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block font-mono text-[10px] text-[var(--text-muted)] uppercase mb-1">Amount (INR)</label>
              <input
                type="number"
                required
                value={formAmount}
                onChange={(e) => setFormAmount(Number(e.target.value))}
                className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-2xl px-4 py-3 text-xs text-[var(--text-primary)] focus:outline-none focus:border-purple-500"
              />
            </div>
            <div className="flex gap-2 justify-end pt-2">
              <button
                type="button"
                onClick={() => setIssueModalOpen(false)}
                className="px-4 py-2.5 rounded-2xl border border-[var(--border-color)] text-[var(--text-muted)] text-xs font-mono uppercase font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-2xl bg-purple-600 text-white text-xs font-mono uppercase font-bold"
              >
                Issue Invoice
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

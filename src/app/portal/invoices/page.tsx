"use client";

import React, { useState } from "react";
import { PortalTopHeader } from "@/components/PortalTopHeader";
import { PortalSidebar } from "@/components/PortalSidebar";
import { PortalRightSidebar } from "@/components/PortalRightSidebar";
import { PortalBreadcrumbs } from "@/components/PortalBreadcrumbs";
import { useToast } from "@/context/ToastContext";
import { Logo } from "@/components/Logo";
import {
  Receipt,
  Plus,
  Download,
  CheckCircle2,
  AlertCircle,
  X,
  Printer,
  DollarSign,
  CreditCard,
  Building2,
  ShieldCheck,
  QrCode,
  ArrowRight,
} from "lucide-react";

interface InvoiceRecord {
  id: string;
  invoiceNumber: string;
  clientName: string;
  company: string;
  amount: number;
  currency: string;
  dueDate: string;
  status: "paid" | "unpaid" | "overdue";
  items: { description: string; amount: number }[];
}

export default function FinancialInvoicesPage() {
  const { addToast } = useToast();
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceRecord | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [payModalOpen, setPayModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "upi" | "wire">("card");
  const [payLoading, setPayLoading] = useState(false);

  // Form states
  const [formNumber, setFormNumber] = useState("TGS-2026-002");
  const [formCompany, setFormCompany] = useState("Natural Veneers");
  const [formAmount, setFormAmount] = useState(180000);
  const [formDueDate, setFormDueDate] = useState("2026-09-30");

  const [invoices, setInvoices] = useState<InvoiceRecord[]>([
    {
      id: "i1",
      invoiceNumber: "TGS-2026-001",
      clientName: "Anand Verma",
      company: "Hero Motors",
      amount: 250000,
      currency: "INR",
      dueDate: "Sept 15, 2026",
      status: "unpaid",
      items: [
        { description: "Commercial Brand Film Production (Phase 03)", amount: 200000 },
        { description: "Post-Production Color Grading & Master Mix", amount: 50000 },
      ],
    },
    {
      id: "i2",
      invoiceNumber: "TGS-2026-002",
      clientName: "Wei Chen",
      company: "Natural Veneers",
      amount: 180000,
      currency: "INR",
      dueDate: "Aug 15, 2026",
      status: "paid",
      items: [
        { description: "Architectural 3D Asset Renders & Video Cuts", amount: 180000 },
      ],
    },
    {
      id: "i3",
      invoiceNumber: "TGS-2026-003",
      clientName: "Miya Chen",
      company: "Aura Apparel",
      amount: 150000,
      currency: "INR",
      dueDate: "July 31, 2026",
      status: "paid",
      items: [
        { description: "E-Commerce Video Campaign & Meta Ad Editing", amount: 150000 },
      ],
    },
  ]);

  const toggleInvoiceStatus = (id: string) => {
    setInvoices((prev) =>
      prev.map((inv) => {
        if (inv.id === id) {
          const nextStatus = inv.status === "paid" ? "unpaid" : "paid";
          addToast(
            nextStatus === "paid" ? "Payment verified" : "Marked unpaid",
            `Invoice ${inv.invoiceNumber} status updated.`,
            nextStatus === "paid" ? "success" : "info"
          );
          return { ...inv, status: nextStatus };
        }
        return inv;
      })
    );
  };

  const handleProcessPayment = () => {
    if (!selectedInvoice) return;
    setPayLoading(true);
    setTimeout(() => {
      setInvoices((prev) =>
        prev.map((inv) => (inv.id === selectedInvoice.id ? { ...inv, status: "paid" } : inv))
      );
      setSelectedInvoice((prev) => (prev ? { ...prev, status: "paid" } : null));
      setPayLoading(false);
      setPayModalOpen(false);
      addToast(
        "Payment Processed Successfully! 🎉",
        `Receipt issued for ${selectedInvoice.invoiceNumber} (INR ${selectedInvoice.amount.toLocaleString()}).`,
        "success"
      );
    }, 1200);
  };

  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    const newInv: InvoiceRecord = {
      id: Date.now().toString(),
      invoiceNumber: formNumber,
      clientName: "Client Contact",
      company: formCompany,
      amount: Number(formAmount),
      currency: "INR",
      dueDate: formDueDate,
      status: "unpaid",
      items: [{ description: "Agency Content Systems & Video Retainer", amount: Number(formAmount) }],
    };

    setInvoices((prev) => [newInv, ...prev]);
    addToast("Tax Invoice Generated", `Invoice ${formNumber} issued for ${formCompany}.`, "success");
    setCreateModalOpen(false);
  };

  const totalRevenue = invoices.reduce((acc, inv) => acc + inv.amount, 0);
  const paidRevenue = invoices
    .filter((inv) => inv.status === "paid")
    .reduce((acc, inv) => acc + inv.amount, 0);
  const unpaidRevenue = invoices
    .filter((inv) => inv.status === "unpaid")
    .reduce((acc, inv) => acc + inv.amount, 0);

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-primary)] flex flex-col font-sans transition-colors select-none">
      <PortalTopHeader userName="Anand Verma" companyName="Hero Motors" userRole="client" />

      <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-8 pb-12 flex flex-col lg:flex-row gap-6">
        <PortalSidebar companyName="Hero Motors" userRole="client" />

        <main className="flex-grow space-y-6">
          <PortalBreadcrumbs items={[{ label: "Invoices & Receipts" }]} />

          {/* Header Bar */}
          <div className="p-6 sm:p-7 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-surface)] shadow-[0_10px_30px_rgba(0,0,0,0.03)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold font-headline text-[var(--text-primary)] flex items-center gap-3">
                <Receipt className="w-6 h-6 text-purple-400" />
                <span>Invoices & Accounts Settlement</span>
              </h1>
              <p className="text-xs text-[var(--text-muted)] mt-1">
                View tax receipts, retainers, and settle pending payments instantly.
              </p>
            </div>

            <button
              onClick={() => setCreateModalOpen(true)}
              className="px-5 py-3 rounded-2xl black-pill-btn text-xs uppercase tracking-wider flex items-center gap-2 shadow-md shrink-0 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Create Invoice</span>
            </button>
          </div>

          {/* Financial KPI Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
            <div className="p-5 rounded-3xl saas-card">
              <span className="text-[10px] text-[var(--text-muted)] uppercase block font-bold">Total Retainer Value</span>
              <span className="text-2xl font-extrabold text-[var(--text-primary)] font-headline mt-1 block">
                ₹{totalRevenue.toLocaleString()}
              </span>
            </div>

            <div className="p-5 rounded-3xl border border-emerald-500/30 bg-emerald-500/5 shadow-sm">
              <span className="text-[10px] text-emerald-500 uppercase block font-bold">Collected Paid Revenue</span>
              <span className="text-2xl font-extrabold text-emerald-500 font-headline mt-1 block">
                ₹{paidRevenue.toLocaleString()}
              </span>
            </div>

            <div className="p-5 rounded-3xl border border-amber-500/30 bg-amber-500/5 shadow-sm">
              <span className="text-[10px] text-amber-500 uppercase block font-bold">Pending Unpaid Invoices</span>
              <span className="text-2xl font-extrabold text-amber-500 font-headline mt-1 block">
                ₹{unpaidRevenue.toLocaleString()}
              </span>
            </div>
          </div>

          {/* INVOICES TABLE */}
          <div className="saas-card p-6 rounded-3xl overflow-x-auto">
            <table className="w-full text-left text-xs font-sans border-collapse">
              <thead>
                <tr className="border-b border-[var(--border-color)] font-mono text-[10px] text-[var(--text-muted)] uppercase font-bold">
                  <th className="py-3 px-3">Invoice #</th>
                  <th className="py-3 px-3">Company</th>
                  <th className="py-3 px-3">Amount</th>
                  <th className="py-3 px-3">Due Date</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-color)]">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-[var(--bg-main)]/50 transition-colors">
                    <td className="py-4 px-3 font-mono font-bold text-purple-500">{inv.invoiceNumber}</td>
                    <td className="py-4 px-3 font-bold text-[var(--text-primary)]">{inv.company}</td>
                    <td className="py-4 px-3 font-mono font-bold text-[var(--text-primary)]">
                      INR {inv.amount.toLocaleString()}
                    </td>
                    <td className="py-4 px-3 font-mono text-slate-500">{inv.dueDate}</td>
                    <td className="py-4 px-3 font-mono">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[9px] font-bold uppercase border ${
                          inv.status === "paid"
                            ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                            : "bg-rose-500/10 text-rose-500 border-rose-500/20"
                        }`}
                      >
                        {inv.status}
                      </span>
                    </td>
                    <td className="py-4 px-3 text-right">
                      <button
                        onClick={() => setSelectedInvoice(inv)}
                        className="px-3.5 py-1.5 rounded-xl bg-purple-600/10 text-purple-600 dark:text-purple-300 text-xs font-mono font-bold uppercase hover:bg-purple-600/20 cursor-pointer"
                      >
                        View Invoice →
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

      {/* TAX INVOICE VIEWER MODAL */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedInvoice(null)} />
          <div className="relative w-full max-w-xl bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-3xl p-6 shadow-2xl z-50 space-y-6 font-sans text-xs max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-[var(--border-color)] pb-4">
              <div className="flex items-center gap-3">
                <Logo size="md" showBadge={false} />
                <div>
                  <h3 className="text-base font-bold font-headline text-[var(--text-primary)]">TAX INVOICE</h3>
                  <span className="text-xs font-mono text-purple-500 font-bold">{selectedInvoice.invoiceNumber}</span>
                </div>
              </div>
              <button onClick={() => setSelectedInvoice(null)} className="text-zinc-500 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Invoice Meta */}
            <div className="grid grid-cols-2 gap-4 font-mono text-xs bg-[var(--bg-main)] p-4 rounded-2xl border border-[var(--border-color)]">
              <div>
                <span className="text-[10px] text-[var(--text-muted)] block uppercase font-bold">Billed To</span>
                <strong className="text-[var(--text-primary)] block mt-0.5">{selectedInvoice.company}</strong>
                <span className="text-[10px] text-slate-500">{selectedInvoice.clientName}</span>
              </div>
              <div>
                <span className="text-[10px] text-[var(--text-muted)] block uppercase font-bold">Invoice Date & Due</span>
                <strong className="text-purple-500 block mt-0.5">Due: {selectedInvoice.dueDate}</strong>
                <span className="text-[10px] text-emerald-500 font-bold uppercase">{selectedInvoice.status}</span>
              </div>
            </div>

            {/* Line Items Breakdown */}
            <div className="space-y-2">
              <span className="font-mono text-[10px] text-[var(--text-muted)] uppercase font-bold">Services Rendered</span>
              {selectedInvoice.items.map((item, idx) => (
                <div key={idx} className="flex justify-between p-3 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)]">
                  <span>{item.description}</span>
                  <span className="font-mono font-bold">INR {item.amount.toLocaleString()}</span>
                </div>
              ))}
            </div>

            {/* Amount Summary */}
            <div className="pt-3 border-t border-[var(--border-color)] flex justify-between items-center font-mono text-sm">
              <span className="font-bold text-[var(--text-primary)]">Total Receivable:</span>
              <span className="text-xl font-black text-purple-500 font-headline">
                INR {selectedInvoice.amount.toLocaleString()}
              </span>
            </div>

            {/* Payment Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              {selectedInvoice.status === "unpaid" ? (
                <button
                  onClick={() => setPayModalOpen(true)}
                  className="w-full py-3.5 black-pill-btn text-xs font-mono font-bold uppercase flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                >
                  <CreditCard className="w-4 h-4 text-emerald-400" />
                  <span>Pay Invoice Online (INR {selectedInvoice.amount.toLocaleString()})</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => toggleInvoiceStatus(selectedInvoice.id)}
                  className="w-full py-3 rounded-2xl bg-emerald-600 text-white font-mono text-xs font-bold uppercase flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Paid & Verified ✓</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 1-CLICK INSTANT ONLINE PAYMENT MODAL */}
      {payModalOpen && selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setPayModalOpen(false)} />
          <div className="relative w-full max-w-md bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-3xl p-6 shadow-2xl z-50 space-y-5 font-sans text-xs">
            <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-500" />
                <h3 className="text-base font-bold font-headline text-[var(--text-primary)]">Secure Payment Gateway</h3>
              </div>
              <button onClick={() => setPayModalOpen(false)} className="text-zinc-500 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-[var(--bg-main)] border border-[var(--border-color)] space-y-2 font-mono">
              <div className="flex justify-between text-slate-400">
                <span>Invoice Number</span>
                <span className="text-[var(--text-primary)] font-bold">{selectedInvoice.invoiceNumber}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Billed Amount</span>
                <span className="text-purple-500 font-bold">INR {selectedInvoice.amount.toLocaleString()}</span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div>
              <label className="block font-mono text-[10px] text-[var(--text-muted)] uppercase mb-2 font-bold">Select Payment Method</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("card")}
                  className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1 cursor-pointer ${
                    paymentMethod === "card"
                      ? "border-purple-500 bg-purple-500/10 text-purple-400 font-bold"
                      : "border-[var(--border-color)] bg-[var(--bg-main)] text-slate-400"
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  <span className="text-[10px] font-mono">Card / NetBank</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("upi")}
                  className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1 cursor-pointer ${
                    paymentMethod === "upi"
                      ? "border-purple-500 bg-purple-500/10 text-purple-400 font-bold"
                      : "border-[var(--border-color)] bg-[var(--bg-main)] text-slate-400"
                  }`}
                >
                  <QrCode className="w-4 h-4" />
                  <span className="text-[10px] font-mono">Instant UPI</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("wire")}
                  className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1 cursor-pointer ${
                    paymentMethod === "wire"
                      ? "border-purple-500 bg-purple-500/10 text-purple-400 font-bold"
                      : "border-[var(--border-color)] bg-[var(--bg-main)] text-slate-400"
                  }`}
                >
                  <Building2 className="w-4 h-4" />
                  <span className="text-[10px] font-mono">Bank Wire</span>
                </button>
              </div>
            </div>

            {/* Method Details */}
            {paymentMethod === "upi" && (
              <div className="p-4 rounded-2xl bg-[var(--bg-main)] border border-[var(--border-color)] text-center space-y-2 font-mono">
                <span className="text-[10px] text-slate-400 uppercase block">Scan UPI QR Code</span>
                <div className="w-32 h-32 mx-auto bg-white p-2 rounded-xl flex items-center justify-center">
                  <QrCode className="w-24 h-24 text-black" />
                </div>
                <span className="text-[11px] font-bold text-purple-500 block">tgs@icici</span>
              </div>
            )}

            {paymentMethod === "wire" && (
              <div className="p-4 rounded-2xl bg-[var(--bg-main)] border border-[var(--border-color)] space-y-1.5 font-mono text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-400">Account Name:</span>
                  <span className="font-bold text-[var(--text-primary)]">The Gravity Studios Pvt Ltd</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Bank:</span>
                  <span className="font-bold text-[var(--text-primary)]">ICICI Bank</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">IFSC Code:</span>
                  <span className="font-bold text-purple-500">ICIC0000012</span>
                </div>
              </div>
            )}

            <button
              onClick={handleProcessPayment}
              disabled={payLoading}
              className="w-full py-4 black-pill-btn text-xs font-mono font-bold uppercase flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-50"
            >
              {payLoading ? (
                <span>Processing Payment Gateway...</span>
              ) : (
                <span>Confirm Payment (INR {selectedInvoice.amount.toLocaleString()})</span>
              )}
            </button>
          </div>
        </div>
      )}

      {/* CREATE INVOICE MODAL */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setCreateModalOpen(false)} />
          <form onSubmit={handleCreateInvoice} className="relative w-full max-w-md bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-3xl p-6 shadow-2xl z-50 space-y-4 font-sans text-xs">
            <h3 className="text-base font-bold font-headline text-[var(--text-primary)]">+ Issue Tax Invoice</h3>
            <div>
              <label className="block font-mono text-[10px] text-[var(--text-muted)] uppercase mb-1 font-bold">Invoice Number</label>
              <input
                type="text"
                required
                value={formNumber}
                onChange={(e) => setFormNumber(e.target.value)}
                className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-2xl px-4 py-3 text-xs text-[var(--text-primary)] focus:outline-none focus:border-purple-500 font-mono"
              />
            </div>
            <div>
              <label className="block font-mono text-[10px] text-[var(--text-muted)] uppercase mb-1 font-bold">Client Company</label>
              <input
                type="text"
                required
                value={formCompany}
                onChange={(e) => setFormCompany(e.target.value)}
                className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-2xl px-4 py-3 text-xs text-[var(--text-primary)] focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block font-mono text-[10px] text-[var(--text-muted)] uppercase mb-1 font-bold">Total Amount (INR)</label>
              <input
                type="number"
                required
                value={formAmount}
                onChange={(e) => setFormAmount(Number(e.target.value))}
                className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-2xl px-4 py-3 text-xs text-[var(--text-primary)] focus:outline-none focus:border-purple-500 font-mono"
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
                className="px-5 py-2.5 black-pill-btn text-xs font-mono uppercase font-bold"
              >
                Generate Tax Invoice
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

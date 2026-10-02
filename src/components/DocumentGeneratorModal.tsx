"use client";

import React, { useState } from "react";
import { useToast } from "@/context/ToastContext";
import { Logo } from "@/components/Logo";
import {
  FileText,
  X,
  Printer,
  Download,
  CheckCircle2,
  Sparkles,
  Building2,
  DollarSign,
  ShieldCheck,
  Plus,
} from "lucide-react";

interface DocumentGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDocumentCreated?: (doc: any) => void;
}

export function DocumentGeneratorModal({
  isOpen,
  onClose,
  onDocumentCreated,
}: DocumentGeneratorModalProps) {
  const { addToast } = useToast();

  // Template Type State
  const [docTemplate, setDocTemplate] = useState<
    | "GS-MSA-001"
    | "GS-SOW-001"
    | "GS-NDA-001"
    | "GS-LIC-001"
    | "GS-INV-001_India"
    | "GS-INV-001_Intl"
    | "GS-QUO-001"
  >("GS-SOW-001");

  // Dynamic Placeholder Inputs
  const [clientLegalName, setClientLegalName] = useState("Hero Motors India Pvt Ltd");
  const [brandName, setBrandName] = useState("Hero Motors");
  const [contactEmail, setContactEmail] = useState("anand@heromotors.com");
  const [projectTitle, setProjectTitle] = useState("Hero Motors Commercial Brand Film Pipeline");
  const [effectiveDate, setEffectiveDate] = useState("2026-09-08");
  const [totalFee, setTotalFee] = useState<number>(250000);
  const [currency, setCurrency] = useState("INR");
  const [gstin, setGstin] = useState("27AAACH1234F1Z9");

  if (!isOpen) return null;

  const generateDocumentText = () => {
    switch (docTemplate) {
      case "GS-MSA-001":
        return `DOCUMENT: GS-MSA-001 · MASTER SERVICES AGREEMENT
EFFECTIVE DATE: ${effectiveDate}
CLIENT LEGAL NAME: ${clientLegalName} (${brandName})

00 FRAMEWORK & PRECEDENCE
This Master Services Agreement ("MSA") is entered into by and between The Gravity Studios (Prameet Patani, Sole Proprietor) and ${clientLegalName}.

01 SERVICES & SCOPE
The Studio agrees to provide video production, brand strategy, campaign design, and paid media content development for ${brandName}. Individual project deliverables are governed under Statements of Work ("SOW") issued hereunder.

02 INTELLECTUAL PROPERTY & USAGE RIGHTS
Upon full payment of invoice fees, ${clientLegalName} is granted exclusive global usage rights for campaign media as specified in each SOW.

CONFIRMED & EXECUTED BY:
The Gravity Studios • Prameet Patani (Founder)
${clientLegalName} • Client Authorized Signatory`;

      case "GS-SOW-001":
        return `DOCUMENT: GS-SOW-001 · STATEMENT OF WORK
PROJECT NAME: ${projectTitle}
CLIENT: ${clientLegalName}
EFFECTIVE DATE: ${effectiveDate}
TOTAL FEE: ${currency} ${totalFee.toLocaleString()}

00 PROJECT INCORPORATION
This Statement of Work ("SOW") incorporates all terms of the Master Services Agreement (GS-MSA-001) between The Gravity Studios and ${clientLegalName}.

01 DELIVERABLES & PRODUCTION PIPELINE
- 4K Master Brand Film (60s Director's Cut)
- 3x Vertical Social Teasers (9:16 1080x1920)
- Full Color Grading (DaVinci Resolve Studio) & Sound Master (24-bit PCM)
- 2 Revision Rounds included in base scope.

02 PAYMENT SCHEDULE
- 50% Upfront Commitment Deposit (${currency} ${(totalFee * 0.5).toLocaleString()})
- 50% Final Delivery & Master Release (${currency} ${(totalFee * 0.5).toLocaleString()})`;

      case "GS-INV-001_India":
        return `TAX INVOICE · GS-INV-001 · INDIA / GST
INVOICE NO: TGS-2026-001
DATE: ${effectiveDate} | DUE DATE: ${effectiveDate}
GSTIN: 27AAAPG1234F1ZM | PLACE OF SUPPLY: Maharashtra

BILLED TO:
${clientLegalName} (${brandName})
Client GSTIN: ${gstin}
Email: ${contactEmail}

DESCRIPTION | SAC | QTY | RATE | AMOUNT
01 ${projectTitle} | 999612 | 1 | ₹${totalFee.toLocaleString()} | ₹${totalFee.toLocaleString()}

TOTAL RECEIVABLE: ₹${totalFee.toLocaleString()}
BANK WIRE: ICICI Bank · A/C: 000405001234 · IFSC: ICIC0000004 · Mumbai`;

      case "GS-INV-001_Intl":
        return `TAX INVOICE · GS-INV-001 · INTERNATIONAL
INVOICE NO: TGS-2026-INT-001
DATE: ${effectiveDate}
CURRENCY: ${currency}

BILLED TO:
${clientLegalName}
Email: ${contactEmail}

DESCRIPTION | QTY | RATE | AMOUNT
01 ${projectTitle} | 1 | $${totalFee.toLocaleString()} | $${totalFee.toLocaleString()}

TOTAL RECEIVABLE: $${totalFee.toLocaleString()}
INTERNATIONAL WIRE: SWIFT Code: ICICINBBXXX · IBAN / Routing provided on request.
WISE / PAYPAL DIRECT LINK: hello@thegravitystudios.com`;

      case "GS-NDA-001":
        return `DOCUMENT: GS-NDA-001 · NON-DISCLOSURE AGREEMENT
MUTUAL CONFIDENTIALITY AGREEMENT
PARTIES: The Gravity Studios & ${clientLegalName}
EFFECTIVE DATE: ${effectiveDate}

1. CONFIDENTIAL INFORMATION
All proprietary brand strategies, unreleased video footage, campaign concepts, and financial terms shared between parties shall remain strictly confidential for a period of 36 months.`;

      default:
        return `DOCUMENT PREVIEW GENERATED FOR ${clientLegalName}.`;
    }
  };

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    const docText = generateDocumentText();
    const newDoc = {
      id: Date.now().toString(),
      title: `${docTemplate} — ${projectTitle}`,
      type: docTemplate,
      company: clientLegalName,
      date: effectiveDate,
      version: 1,
      signed: true,
      content: docText,
    };

    if (onDocumentCreated) onDocumentCreated(newDoc);
    addToast(
      "Document Generated & Published! 📑",
      `Official template ${docTemplate} generated for ${clientLegalName}.`,
      "success"
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 select-none font-sans">
      <div className="fixed inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />

      <div className="relative w-full max-w-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-[2.5rem] p-6 sm:p-8 shadow-2xl z-50 space-y-6 max-h-[92vh] overflow-y-auto">
        <div className="flex items-start justify-between border-b border-[var(--border-color)] pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-purple-500/10 text-purple-500 border border-purple-500/20">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold text-purple-500 uppercase tracking-widest block">
                IN-PORTAL TEMPLATE GENERATOR
              </span>
              <h2 className="text-xl font-bold font-headline text-[var(--text-primary)]">
                Agency Document Studio
              </h2>
            </div>
          </div>
          <button onClick={onClose} className="text-zinc-500 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleGenerate} className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-xs">
          {/* Left Inputs (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div>
              <label className="block text-[10px] font-mono text-[var(--text-muted)] uppercase font-bold mb-1">
                Select Operational Template
              </label>
              <select
                value={docTemplate}
                onChange={(e) => setDocTemplate(e.target.value as any)}
                className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-2xl px-4 py-3 text-xs text-[var(--text-primary)] focus:outline-none focus:border-purple-500 font-mono font-bold"
              >
                <option value="GS-SOW-001">GS-SOW-001 · Statement of Work</option>
                <option value="GS-MSA-001">GS-MSA-001 · Master Services Agreement</option>
                <option value="GS-INV-001_India">GS-INV-001 · India GST Tax Invoice</option>
                <option value="GS-INV-001_Intl">GS-INV-001 · International Invoice</option>
                <option value="GS-NDA-001">GS-NDA-001 · Non-Disclosure Agreement</option>
                <option value="GS-LIC-001">GS-LIC-001 · Usage Rights Agreement</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-mono text-[var(--text-muted)] uppercase font-bold mb-1">
                Client Legal Entity
              </label>
              <input
                type="text"
                required
                value={clientLegalName}
                onChange={(e) => setClientLegalName(e.target.value)}
                className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-2xl px-4 py-3 text-xs text-[var(--text-primary)] focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono text-[var(--text-muted)] uppercase font-bold mb-1">
                Project Title & Scope
              </label>
              <input
                type="text"
                required
                value={projectTitle}
                onChange={(e) => setProjectTitle(e.target.value)}
                className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-2xl px-4 py-3 text-xs text-[var(--text-primary)] focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-mono text-[var(--text-muted)] uppercase font-bold mb-1">
                  Total Fee / Retainer
                </label>
                <input
                  type="number"
                  required
                  value={totalFee}
                  onChange={(e) => setTotalFee(Number(e.target.value))}
                  className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-2xl px-4 py-3 text-xs text-[var(--text-primary)] focus:outline-none focus:border-purple-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono text-[var(--text-muted)] uppercase font-bold mb-1">
                  Currency
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-2xl px-4 py-3 text-xs text-[var(--text-primary)] focus:outline-none focus:border-purple-500 font-mono font-bold"
                >
                  <option value="INR">INR (₹)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Right Live Document Preview (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
            <div>
              <span className="block text-[10px] font-mono text-[var(--text-muted)] uppercase font-bold mb-1">
                Live Generated Document Output
              </span>
              <pre className="w-full h-80 p-4 rounded-2xl bg-[var(--bg-main)] border border-[var(--border-color)] text-[11px] font-mono text-[var(--text-primary)] whitespace-pre-wrap overflow-y-auto leading-relaxed">
                {generateDocumentText()}
              </pre>
            </div>

            <div className="flex gap-2 justify-end pt-2 border-t border-[var(--border-color)]">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-2xl border border-[var(--border-color)] text-[var(--text-muted)] text-xs font-mono uppercase font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 black-pill-btn text-xs font-mono uppercase font-bold flex items-center gap-2 shadow-lg cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Generate & Publish Document</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

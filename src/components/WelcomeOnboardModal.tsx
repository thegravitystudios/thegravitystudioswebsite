"use client";

import React, { useState } from "react";
import { useToast } from "@/context/ToastContext";
import {
  Sparkles,
  User,
  Building2,
  Phone,
  Globe,
  DollarSign,
  CheckCircle2,
  ArrowRight,
  Upload,
  Link as LinkIcon,
  ShieldCheck,
} from "lucide-react";

interface WelcomeOnboardModalProps {
  isOpen: boolean;
  onComplete: (data: {
    fullName: string;
    nickname: string;
    roleTitle: string;
    phone: string;
    companyLegalName: string;
    brandName: string;
    brandDriveLink: string;
    preferredCurrency: string;
  }) => void;
  initialName?: string;
  initialCompany?: string;
}

export function WelcomeOnboardModal({
  isOpen,
  onComplete,
  initialName = "",
  initialCompany = "",
}: WelcomeOnboardModalProps) {
  const { addToast } = useToast();
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form States
  const [fullName, setFullName] = useState(initialName || "Anand Verma");
  const [nickname, setNickname] = useState("");
  const [roleTitle, setRoleTitle] = useState("Head of Brand & Marketing");
  const [phone, setPhone] = useState("+91 98200 12345");

  const [companyLegalName, setCompanyLegalName] = useState(initialCompany || "Hero Motors India Pvt Ltd");
  const [brandName, setBrandName] = useState(initialCompany || "Hero Motors");
  const [brandDriveLink, setBrandDriveLink] = useState("https://drive.google.com/drive/folders/demo-brand-assets");

  const [preferredCurrency, setPreferredCurrency] = useState("INR");
  const [updateFrequency, setUpdateFrequency] = useState("milestone");

  if (!isOpen) return null;

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      setStep((prev) => (prev + 1) as any);
    } else {
      onComplete({
        fullName,
        nickname: nickname || fullName.split(" ")[0],
        roleTitle,
        phone,
        companyLegalName,
        brandName,
        brandDriveLink,
        preferredCurrency,
      });
      addToast(
        `Welcome to The Gravity Studios, ${nickname || fullName.split(" ")[0]}! 🎉`,
        "Your brand workspace has been configured successfully.",
        "success"
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 select-none font-sans">
      <div className="fixed inset-0 bg-black/80 backdrop-blur-md" />

      <div className="relative w-full max-w-xl bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-[2.5rem] p-6 sm:p-8 shadow-2xl z-50 space-y-6">
        {/* Header Progress Bar */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-2xl bg-purple-500/10 text-purple-500 border border-purple-500/20">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold text-purple-500 uppercase tracking-widest block">
                  CLIENT ONBOARDING WIZARD
                </span>
                <h2 className="text-xl font-bold font-headline text-[var(--text-primary)]">
                  Welcome to The Gravity Studios
                </h2>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-[var(--text-muted)] bg-[var(--bg-main)] px-3 py-1 rounded-full border border-[var(--border-color)]">
              Step {step} of 3
            </span>
          </div>

          {/* Stepper Bar */}
          <div className="grid grid-cols-3 gap-2 pt-1">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-1.5 rounded-full transition-all ${
                  step >= s ? "bg-purple-600" : "bg-[var(--bg-main)]"
                }`}
              />
            ))}
          </div>
        </div>

        <form onSubmit={handleNextStep} className="space-y-5 text-xs">
          {/* STEP 1: PERSONALIZATION */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-[var(--bg-main)] border border-[var(--border-color)]">
                <p className="text-xs text-[var(--text-primary)] font-medium leading-relaxed">
                  We built this portal to make your content production completely seamless. Tell us how you'd like to be addressed across our team and project reports.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-mono text-[var(--text-muted)] uppercase font-bold mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-2xl px-4 py-3 text-xs text-[var(--text-primary)] focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-[var(--text-muted)] uppercase font-bold mb-1">
                    Preferred Nickname / Call Sign
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Anand"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-2xl px-4 py-3 text-xs text-[var(--text-primary)] focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-mono text-[var(--text-muted)] uppercase font-bold mb-1">
                    Your Title / Role
                  </label>
                  <input
                    type="text"
                    required
                    value={roleTitle}
                    onChange={(e) => setRoleTitle(e.target.value)}
                    className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-2xl px-4 py-3 text-xs text-[var(--text-primary)] focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-[var(--text-muted)] uppercase font-bold mb-1">
                    Direct Phone / WhatsApp
                  </label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-2xl px-4 py-3 text-xs text-[var(--text-primary)] focus:outline-none focus:border-purple-500 font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: BRAND IDENTITY & ASSETS */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-mono text-[var(--text-muted)] uppercase font-bold mb-1">
                  Registered Legal Company Name (for Invoices & Contracts)
                </label>
                <input
                  type="text"
                  required
                  value={companyLegalName}
                  onChange={(e) => setCompanyLegalName(e.target.value)}
                  className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-2xl px-4 py-3 text-xs text-[var(--text-primary)] focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono text-[var(--text-muted)] uppercase font-bold mb-1">
                  Public Brand / Trading Name
                </label>
                <input
                  type="text"
                  required
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-2xl px-4 py-3 text-xs text-[var(--text-primary)] focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono text-[var(--text-muted)] uppercase font-bold mb-1 flex items-center justify-between">
                  <span>Brand Assets / Google Drive Folder Link</span>
                  <LinkIcon className="w-3.5 h-3.5 text-purple-500" />
                </label>
                <input
                  type="url"
                  placeholder="https://drive.google.com/drive/folders/..."
                  value={brandDriveLink}
                  onChange={(e) => setBrandDriveLink(e.target.value)}
                  className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-2xl px-4 py-3 text-xs text-[var(--text-primary)] focus:outline-none focus:border-purple-500 font-mono"
                />
              </div>
            </div>
          )}

          {/* STEP 3: OPERATIONAL PREFERENCES */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-mono text-[var(--text-muted)] uppercase font-bold mb-2">
                  Billing Currency Preference
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "INR", label: "₹ INR (Domestic)", desc: "GST Invoicing & Wire" },
                    { id: "USD", label: "$ USD (International)", desc: "Wise / SWIFT Wire" },
                    { id: "EUR", label: "€ EUR (Europe)", desc: "SEPA / SWIFT Wire" },
                  ].map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setPreferredCurrency(c.id)}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                        preferredCurrency === c.id
                          ? "border-purple-500 bg-purple-500/10 text-purple-500 font-bold"
                          : "border-[var(--border-color)] bg-[var(--bg-main)] text-[var(--text-muted)]"
                      }`}
                    >
                      <span className="text-xs font-mono font-bold block">{c.label}</span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">{c.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono text-[var(--text-muted)] uppercase font-bold mb-2">
                  Preferred Communication Cadence
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: "milestone", label: "Milestone-Based", desc: "Updates on major video cuts & phase releases" },
                    { id: "daily", label: "Daily Operational Brief", desc: "End-of-day production digest & status updates" },
                  ].map((cad) => (
                    <button
                      key={cad.id}
                      type="button"
                      onClick={() => setUpdateFrequency(cad.id)}
                      className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                        updateFrequency === cad.id
                          ? "border-purple-500 bg-purple-500/10 text-purple-500 font-bold"
                          : "border-[var(--border-color)] bg-[var(--bg-main)] text-[var(--text-muted)]"
                      }`}
                    >
                      <span className="text-xs font-mono font-bold block">{cad.label}</span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">{cad.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Footer Action Buttons */}
          <div className="pt-4 border-t border-[var(--border-color)] flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep((prev) => (prev - 1) as any)}
                className="px-4 py-2.5 rounded-2xl border border-[var(--border-color)] text-[var(--text-muted)] text-xs font-mono uppercase font-bold cursor-pointer"
              >
                Back
              </button>
            ) : (
              <div />
            )}

            <button
              type="submit"
              className="px-6 py-3 black-pill-btn text-xs font-mono font-bold uppercase flex items-center gap-2 cursor-pointer shadow-lg"
            >
              <span>{step === 3 ? "Complete Workspace Setup 🎉" : "Continue →"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

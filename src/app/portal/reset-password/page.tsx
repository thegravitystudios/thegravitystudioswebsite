"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Logo } from "@/components/Logo";
import { Lock, CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) {
        setError(updateError.message);
      } else {
        setSuccess(true);
        setTimeout(() => {
          router.push("/portal/login");
        }, 2500);
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0C] text-white flex flex-col items-center justify-center p-4 sm:p-6 relative select-none font-sans">
      <div className="w-full max-w-md relative z-10 flex flex-col items-center">
        <div className="mb-8 text-center flex flex-col items-center">
          <Logo size="lg" forceVariant="white" showBadge={false} />
          <p className="text-xs font-mono text-zinc-400 mt-3 tracking-widest uppercase">
            SET NEW PASSWORD
          </p>
        </div>

        <div className="w-full bg-[#111015] border border-white/10 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-xl">
          <div className="h-[2px] w-full bg-gradient-to-r from-purple-600 via-purple-400 to-fuchsia-500" />

          <div className="p-6 sm:p-8">
            <h1 className="text-xl sm:text-2xl font-bold font-headline text-white mb-2">
              Create New Password
            </h1>
            <p className="text-xs text-zinc-400 mb-6">
              Enter your new account password below to update your security credentials.
            </p>

            {error && (
              <div className="mb-5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {success ? (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-emerald-300 mb-1">Password updated successfully!</p>
                  <p className="text-zinc-300">
                    Redirecting you to the portal login page...
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handlePasswordReset} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-mono text-zinc-400 mb-1.5 uppercase tracking-wider">
                    New Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full bg-[#18171E] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-purple-500/70"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-zinc-400 mb-1.5 uppercase tracking-wider">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full bg-[#18171E] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-purple-500/70"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 py-3.5 px-6 rounded-xl tgs-gradient-bg text-white font-bold text-xs tracking-wider uppercase hover:scale-[1.02] transition-all shadow-[0_0_20px_rgba(168,85,247,0.35)] flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  <span>{loading ? "Updating Password..." : "Update Password"}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

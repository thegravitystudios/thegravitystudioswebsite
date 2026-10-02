"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Lock, Mail, Key, Eye, EyeOff, ArrowRight, CheckCircle2, AlertCircle, Sparkles } from "lucide-react";

export default function ClientPortalLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  // Check if session already exists
  useEffect(() => {
    async function checkSession() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .single();

        if (profile?.role === "admin" || profile?.role === "team") {
          router.push("/portal/admin/dashboard");
        } else {
          router.push("/portal/dashboard");
        }
      }
    }
    checkSession();
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      // Demo Fallback Check for immediate manual testing
      if (email.trim() === "admin@thegravitystudios.com" && password === "GravityAdmin2026!") {
        localStorage.setItem(
          "gravity_portal_user",
          JSON.stringify({
            id: "temp-admin-id",
            email: "admin@thegravitystudios.com",
            role: "admin",
            full_name: "Prameet Patani (Admin)",
          })
        );
        router.push("/portal/admin/dashboard");
        return;
      }

      if (email.trim() === "client@thegravitystudios.com" && password === "GravityClient2026!") {
        localStorage.setItem(
          "gravity_portal_user",
          JSON.stringify({
            id: "temp-client-id",
            email: "client@thegravitystudios.com",
            role: "client",
            full_name: "Anand Verma",
            company_name: "Hero Motors",
          })
        );
        router.push("/portal/dashboard");
        return;
      }

      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError(authError.message || "Invalid credentials");
        setLoading(false);
        return;
      }

      if (data.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role, full_name")
          .eq("id", data.user.id)
          .single();

        const userRole = profile?.role || "client";
        localStorage.setItem(
          "gravity_portal_user",
          JSON.stringify({
            id: data.user.id,
            email: data.user.email,
            role: userRole,
            full_name: profile?.full_name || data.user.email,
          })
        );

        if (userRole === "admin" || userRole === "team") {
          router.push("/portal/admin/dashboard");
        } else {
          router.push("/portal/dashboard");
        }
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  const handleDemoAdmin = () => {
    setEmail("admin@thegravitystudios.com");
    setPassword("GravityAdmin2026!");
    localStorage.setItem(
      "gravity_portal_user",
      JSON.stringify({
        id: "temp-admin-id",
        email: "admin@thegravitystudios.com",
        role: "admin",
        full_name: "Prameet Patani (Admin)",
      })
    );
    router.push("/portal/admin/dashboard");
  };

  const handleDemoClient = () => {
    setEmail("client@thegravitystudios.com");
    setPassword("GravityClient2026!");
    localStorage.setItem(
      "gravity_portal_user",
      JSON.stringify({
        id: "temp-client-id",
        email: "client@thegravitystudios.com",
        role: "client",
        full_name: "Anand Verma",
        company_name: "Hero Motors",
      })
    );
    router.push("/portal/dashboard");
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setResetLoading(true);
    setResetSuccess(false);

    try {
      const redirectUrl =
        typeof window !== "undefined"
          ? `${window.location.origin}/portal/reset-password`
          : "https://www.thegravitystudios.com/portal/reset-password";

      const { error: resetErr } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: redirectUrl,
      });

      if (resetErr) {
        setError(resetErr.message);
      } else {
        setResetSuccess(true);
      }
    } catch (err) {
      setError("Failed to send password reset email. Please try again.");
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-primary)] flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8 relative overflow-hidden select-none font-sans">
      <div className="w-full max-w-md space-y-8 z-10">
        {/* Header Branding (Gravity Outreach Exact Pattern) */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center p-1.5 rounded-3xl bg-[#09090B] border border-slate-800 shadow-2xl mb-2 w-20 h-20 overflow-hidden">
            <img
              src="/favicon-withbg.png"
              alt="The Gravity Studios Logo"
              className="w-full h-full object-contain rounded-2xl"
            />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[var(--text-primary)]">
              Gravity Portal OS
            </h1>
            <p className="text-xs font-mono text-[var(--text-muted)] mt-1.5 tracking-wider uppercase font-bold">
              Client & Admin Security Portal
            </p>
          </div>
        </div>

        {/* Login Card (Exact Gravity Outreach Card Styling) */}
        <div className="saas-card p-8 sm:p-10 rounded-[2rem] space-y-6">
          <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-4">
            <span className="text-xs font-mono font-bold text-[var(--text-primary)] uppercase tracking-wider flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-purple-500" />
              Restricted Workspace Access
            </span>
            <span className="text-[10px] font-mono text-[var(--text-muted)] bg-[var(--bg-main)] px-2.5 py-1 rounded-full border border-[var(--border-color)]">
              v2.0 Protected
            </span>
          </div>

          {/* Error & Success Messages */}
          {error && (
            <div className="p-4 rounded-2xl bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300 text-xs flex items-start gap-3 border border-red-200 dark:border-red-800 font-mono">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <p className="leading-relaxed font-medium">{error}</p>
            </div>
          )}

          {message && (
            <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 text-xs flex items-start gap-3 border border-emerald-200 dark:border-emerald-800 font-mono">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <p className="leading-relaxed font-medium">{message}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5 text-xs">
            {/* Email Input */}
            <div className="space-y-2">
              <label className="text-[11px] font-mono uppercase font-bold text-[var(--text-muted)] block">
                Login Email
              </label>
              <div className="relative flex items-center">
                <Mail className="w-4 h-4 text-slate-400 absolute left-4 pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@yourbrand.com"
                  autoComplete="username"
                  required
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-[var(--bg-main)] border border-[var(--border-color)] text-[var(--text-primary)] text-xs font-mono focus:outline-none focus:border-purple-500 transition-all"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-mono uppercase font-bold text-[var(--text-muted)] block">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setResetEmail(email);
                    setResetModalOpen(true);
                    setError("");
                    setResetSuccess(false);
                  }}
                  className="text-xs font-mono text-purple-500 hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative flex items-center">
                <Key className="w-4 h-4 text-slate-400 absolute left-4 pointer-events-none" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••••••"
                  autoComplete="current-password"
                  required
                  className="w-full pl-11 pr-12 py-3.5 rounded-2xl bg-[var(--bg-main)] border border-[var(--border-color)] text-[var(--text-primary)] text-xs font-mono focus:outline-none focus:border-purple-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 text-slate-400 hover:text-[var(--text-primary)] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 black-pill-btn text-xs uppercase tracking-wider flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-2 cursor-pointer shadow-md"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Authenticate & Enter Workspace</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Instant 1-Click Demo Logins */}
          <div className="pt-4 border-t border-[var(--border-color)] space-y-2">
            <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-wider block text-center font-bold">
              ⚡ Instant 1-Click Demo Login
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleDemoClient}
                className="py-2.5 px-3 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] hover:border-purple-500 text-[11px] font-mono font-bold text-[var(--text-primary)] flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <span>👤 Client Demo</span>
              </button>
              <button
                type="button"
                onClick={handleDemoAdmin}
                className="py-2.5 px-3 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] hover:border-purple-500 text-[11px] font-mono font-bold text-[var(--text-primary)] flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <span>🔑 Admin Demo</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <p className="text-center text-[10px] font-mono text-[var(--text-muted)] tracking-wider">
          The Gravity Studios • Client & Admin Operations OS
        </p>
      </div>

      {/* Forgot Password Modal */}
      {resetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setResetModalOpen(false)} />
          <div className="relative w-full max-w-md bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-[2rem] p-6 shadow-2xl z-50 space-y-4 font-sans text-xs">
            <h3 className="text-base font-bold text-[var(--text-primary)]">Reset Your Password</h3>
            <p className="text-xs text-[var(--text-muted)]">
              Enter your account email address to receive a secure password reset link.
            </p>

            {resetSuccess ? (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 text-xs flex items-start gap-3 border border-emerald-200">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold mb-1">Reset email sent!</p>
                    <p>Check your inbox at {resetEmail} for instructions to reset your password.</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setResetModalOpen(false)}
                  className="w-full py-3 black-pill-btn text-xs font-mono font-bold uppercase"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-mono text-[var(--text-muted)] uppercase mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="name@yourbrand.com"
                    className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-2xl px-4 py-3 text-xs text-[var(--text-primary)] focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="flex gap-2 justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setResetModalOpen(false)}
                    className="px-4 py-2.5 rounded-2xl border border-[var(--border-color)] text-[var(--text-muted)] text-xs font-mono uppercase font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={resetLoading}
                    className="px-5 py-2.5 black-pill-btn text-xs font-mono uppercase font-bold disabled:opacity-50"
                  >
                    {resetLoading ? "Sending..." : "Send Reset Link"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

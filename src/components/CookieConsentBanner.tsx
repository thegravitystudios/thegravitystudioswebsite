"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

export function CookieConsentBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem("tgs_cookie_consent");
      if (!consent) {
        setIsVisible(true);
      }
    } catch (e) {
      setIsVisible(true);
    }
  }, []);

  const handleConsent = (choice: "accepted" | "declined") => {
    try {
      localStorage.setItem("tgs_cookie_consent", choice);
    } catch (e) {}
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-2xl bg-[#121118]/95 backdrop-blur-xl border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.8)] rounded-2xl p-4 sm:p-5 text-white flex flex-col sm:flex-row items-center justify-between gap-4 transition-all duration-500 animate-word-reveal">
      <p className="type-body text-xs sm:text-sm text-zinc-300 leading-relaxed text-center sm:text-left">
        We use cookies to understand how visitors use this site. See our{" "}
        <Link href="/cookie-policy" className="text-purple-400 hover:underline font-medium">
          Cookie Policy
        </Link>{" "}
        for details.
      </p>

      <div className="flex items-center gap-3 flex-shrink-0">
        <button
          onClick={() => handleConsent("declined")}
          className="px-4 py-2 rounded-full border border-white/30 hover:border-white text-zinc-300 hover:text-white text-xs font-medium transition-all cursor-pointer"
        >
          Decline
        </button>
        <button
          onClick={() => handleConsent("accepted")}
          className="px-5 py-2 rounded-full tgs-gradient-bg text-white font-bold text-xs hover:scale-105 transition-all shadow-md cursor-pointer"
        >
          Accept
        </button>
      </div>
    </div>
  );
}

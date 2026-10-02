"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/Logo";
import { InstagramIcon, YoutubeIcon } from "@/components/SocialIcons";
import { Mail, ArrowUpRight } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { GMAIL_COMPOSE_URL } from "@/lib/constants";

export function Footer() {
  const pathname = usePathname();
  const { theme } = useTheme();
  const isAiProductionPage = pathname === "/ai-production";
  const isLight = theme === "light" && !isAiProductionPage;

  // Strategic logo variant for footer (Always white on dark pages like AI Production)
  const logoVariant = isAiProductionPage ? "white" : isLight ? "black" : "white";

  return (
    <footer id="footer" className="border-t border-[var(--border-color)] bg-[var(--bg-main)] py-12 sm:py-16 text-[var(--text-primary)]">
      {/* Full-width container with peak edge padding */}
      <div className="w-full px-6 sm:px-10 lg:px-16">
        {/* Streamlined 3-Column Horizontal Row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center pb-10 border-b border-[var(--border-color)] text-left">
          {/* COLUMN 1: Logo (Peak Left of the Page) */}
          <div className="md:col-span-4 flex items-center justify-start">
            <Logo size="lg" showBadge={false} forceVariant={logoVariant} className="p-0 m-0 -ml-1 sm:-ml-2" />
          </div>

          {/* COLUMN 2: Horizontal Navigation Links */}
          <div className="md:col-span-4 flex items-center justify-center">
            <ul className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 type-body text-xs sm:text-sm font-medium">
              <li>
                <Link href="/" className="hover:text-purple-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/work" className="hover:text-purple-400 transition-colors">
                  Work & Projects
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-purple-400 transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-purple-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-purple-400 transition-colors">
                  Contact & Book
                </Link>
              </li>
              <li>
                <Link href="/ai-production" className="hover:text-red-400 text-red-500 font-bold transition-colors">
                  AI Production
                </Link>
              </li>
            </ul>
          </div>

          {/* COLUMN 3: Direct Contact & Social Buttons (Flush Right) */}
          <div className="md:col-span-4 flex flex-col items-start md:items-end gap-3">
            <a
              href={GMAIL_COMPOSE_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center type-body text-xs sm:text-sm font-bold tgs-gradient-text hover:underline gap-1.5"
            >
              business@thegravitystudios.com
              <ArrowUpRight className="w-4 h-4 text-purple-400" />
            </a>

            {/* Social Buttons */}
            <div className="flex items-center gap-2.5">
              <a
                href="https://www.instagram.com/thegravitystudios.mov"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-full border border-[var(--border-color)] bg-[var(--bg-surface)] flex items-center justify-center text-[var(--text-muted)] hover:text-purple-400 hover:border-purple-500/40 transition-all hover:scale-105"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
              <a
                href="https://www.youtube.com/@officialgravitystudios/videos"
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube"
                className="w-9 h-9 rounded-full border border-[var(--border-color)] bg-[var(--bg-surface)] flex items-center justify-center text-[var(--text-muted)] hover:text-purple-400 hover:border-purple-500/40 transition-all hover:scale-105"
              >
                <YoutubeIcon className="w-4 h-4" />
              </a>
              <a
                href={GMAIL_COMPOSE_URL}
                target="_blank"
                rel="noreferrer"
                aria-label="Email"
                className="w-9 h-9 rounded-full border border-[var(--border-color)] bg-[var(--bg-surface)] flex items-center justify-center text-[var(--text-muted)] hover:text-purple-400 hover:border-purple-500/40 transition-all hover:scale-105"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Copyright Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 type-eyebrow text-xs text-[var(--text-muted)] border-t border-[var(--border-color)]/30 mt-8">
          <p>© 2026 The Gravity Studios. All rights reserved.</p>
          <div className="flex items-center gap-4 sm:gap-6 flex-wrap justify-center">
            <Link href="/privacy-policy" className="hover:text-purple-400 transition-colors">
              Privacy Policy
            </Link>
            <span>•</span>
            <Link href="/terms-of-service" className="hover:text-purple-400 transition-colors">
              Terms of Service
            </Link>
            <span>•</span>
            <Link href="/cookie-policy" className="hover:text-purple-400 transition-colors">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

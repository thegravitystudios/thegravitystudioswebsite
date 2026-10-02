import React from "react";
import { Section } from "@/components/Section";
import { GMAIL_COMPOSE_URL } from "@/lib/constants";

export const metadata = {
  title: "Cookie Policy — The Gravity Studios",
  description: "Cookie Policy for The Gravity Studios website.",
};

export default function CookiePolicyPage() {
  return (
    <div className="flex flex-col min-h-screen pt-28 sm:pt-36 pb-24 select-text">
      <Section className="w-full">
        <div className="max-w-3xl mx-auto px-6 sm:px-8 text-left">
          {/* PAGE TITLE */}
          <h1 className="text-3xl sm:text-5xl font-headline font-bold text-[var(--text-primary)] tracking-tight mb-3">
            Cookie Policy
          </h1>

          {/* LAST UPDATED DATE */}
          <p className="text-sm font-mono text-[var(--text-muted)] mb-10 pb-6 border-b border-[var(--border-color)]">
            Last updated: August 28, 2026
          </p>

          {/* BODY CONTENT */}
          <div className="space-y-6 text-sm sm:text-base text-[var(--text-muted)] leading-relaxed font-sans">
            <p>
              This Cookie Policy explains how The Gravity Studios uses cookies and similar tracking technologies on thegravitystudios.com.
            </p>

            <h2 className="text-xl sm:text-2xl font-headline font-bold text-[var(--text-primary)] pt-4">
              What Are Cookies
            </h2>
            <p>
              Cookies are small text files stored on your device that help websites function and collect information about how they&apos;re used.
            </p>

            <h2 className="text-xl sm:text-2xl font-headline font-bold text-[var(--text-primary)] pt-4">
              Cookies We Use
            </h2>
            <p>
              Essential cookies, required for the site to function properly (e.g., remembering your light/dark mode preference). Analytics cookies, which help us understand how visitors use the site, via Google Analytics. Advertising cookies, used by us and our advertising partners (e.g., Meta Pixel, LinkedIn Insight Tag) to measure the performance of our own ad campaigns and show relevant ads to people who&apos;ve visited our site.
            </p>

            <h2 className="text-xl sm:text-2xl font-headline font-bold text-[var(--text-primary)] pt-4">
              Your Choices
            </h2>
            <p>
              When you first visit the site, you&apos;ll be asked to accept or decline non-essential cookies. You can also control cookies through your browser settings at any time. Declining cookies may affect certain site features but will not prevent you from browsing or contacting us.
            </p>

            <h2 className="text-xl sm:text-2xl font-headline font-bold text-[var(--text-primary)] pt-4">
              Third-Party Cookies
            </h2>
            <p>
              Some cookies are set by third-party services we use (Google, Meta, LinkedIn). These third parties have their own privacy and cookie policies, which we encourage you to review.
            </p>

            <h2 className="text-xl sm:text-2xl font-headline font-bold text-[var(--text-primary)] pt-4">
              Changes to This Policy
            </h2>
            <p>
              We may update this Cookie Policy as our use of cookies changes. The effective date above reflects the latest revision.
            </p>

            <h2 className="text-xl sm:text-2xl font-headline font-bold text-[var(--text-primary)] pt-4">
              Contact
            </h2>
            <p>
              <a href={GMAIL_COMPOSE_URL} target="_blank" rel="noreferrer" className="text-[var(--text-primary)] underline underline-offset-4 hover:text-purple-400">
                business@thegravitystudios.com
              </a>
            </p>
          </div>
        </div>
      </Section>
    </div>
  );
}

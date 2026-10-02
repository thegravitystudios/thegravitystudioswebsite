import React from "react";
import { Section } from "@/components/Section";
import { GMAIL_COMPOSE_URL } from "@/lib/constants";

export const metadata = {
  title: "Privacy Policy — The Gravity Studios",
  description: "Privacy Policy for The Gravity Studios website and services.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="flex flex-col min-h-screen pt-28 sm:pt-36 pb-24 select-text">
      <Section className="w-full">
        <div className="max-w-3xl mx-auto px-6 sm:px-8 text-left">
          {/* PAGE TITLE */}
          <h1 className="text-3xl sm:text-5xl font-headline font-bold text-[var(--text-primary)] tracking-tight mb-3">
            Privacy Policy
          </h1>

          {/* LAST UPDATED DATE */}
          <p className="text-sm font-mono text-[var(--text-muted)] mb-10 pb-6 border-b border-[var(--border-color)]">
            Last updated: August 28, 2026
          </p>

          {/* BODY CONTENT */}
          <div className="space-y-6 text-sm sm:text-base text-[var(--text-muted)] leading-relaxed font-sans">
            <p>
              The Gravity Studios (&quot;we,&quot; &quot;us,&quot; &quot;our,&quot; &quot;the Studio&quot;) operates thegravitystudios.com. This Privacy Policy explains what information we collect, how we use it, and your rights regarding that information.
            </p>

            <h2 className="text-xl sm:text-2xl font-headline font-bold text-[var(--text-primary)] pt-4">
              Information We Collect
            </h2>
            <p>
              When you contact us via email, our Contact page, or Book a Call, you may provide your name, email address, company name, and details about your project. When you use the Build Your Base Strategy tool, you may enter your brand name, website or social handle, industry, and related project details.
            </p>
            <p>
              Like most websites, we use cookies and similar technologies to collect standard analytics data — pages visited, time on site, browser and device type, and general location — via tools such as Google Analytics and advertising pixels (e.g., Meta Pixel, LinkedIn Insight Tag). See our Cookie Policy for details.
            </p>

            <h2 className="text-xl sm:text-2xl font-headline font-bold text-[var(--text-primary)] pt-4">
              How We Use Information
            </h2>
            <p>
              To respond to inquiries and discovery call requests; to understand how visitors use our site and improve it; to measure the performance of our own marketing and advertising.
            </p>

            <h2 className="text-xl sm:text-2xl font-headline font-bold text-[var(--text-primary)] pt-4">
              The Build Your Base Strategy Tool
            </h2>
            <p>
              This tool currently runs entirely in your browser. The information you enter is not transmitted to or stored on our servers, and is not shared with any third party — it exists only for the duration of your session to generate your on-screen result.
            </p>

            <h2 className="text-xl sm:text-2xl font-headline font-bold text-[var(--text-primary)] pt-4">
              Data Sharing
            </h2>
            <p>
              We do not sell your personal information. We may share information with service providers who help us operate the site (e.g., analytics providers, hosting providers), each bound to use it only for that purpose. We may disclose information if required by law.
            </p>

            <h2 className="text-xl sm:text-2xl font-headline font-bold text-[var(--text-primary)] pt-4">
              International Visitors
            </h2>
            <p>
              We work with clients based in India and internationally. If you are located outside India, your information may be processed in India. By using this site, you consent to this processing.
            </p>

            <h2 className="text-xl sm:text-2xl font-headline font-bold text-[var(--text-primary)] pt-4">
              Your Rights
            </h2>
            <p>
              Depending on your location, you may have rights to access, correct, or request deletion of your personal information. To exercise these rights, contact us at{" "}
              <a href={GMAIL_COMPOSE_URL} target="_blank" rel="noreferrer" className="text-[var(--text-primary)] underline underline-offset-4 hover:text-purple-400">
                business@thegravitystudios.com
              </a>.
            </p>

            <h2 className="text-xl sm:text-2xl font-headline font-bold text-[var(--text-primary)] pt-4">
              Data Retention
            </h2>
            <p>
              We retain correspondence and inquiry information for as long as reasonably necessary to respond to you and maintain business records, and delete it when no longer needed.
            </p>

            <h2 className="text-xl sm:text-2xl font-headline font-bold text-[var(--text-primary)] pt-4">
              Changes to This Policy
            </h2>
            <p>
              We may update this Privacy Policy from time to time. The effective date at the top reflects the latest revision.
            </p>

            <h2 className="text-xl sm:text-2xl font-headline font-bold text-[var(--text-primary)] pt-4">
              Contact
            </h2>
            <p>
              Questions about this policy:{" "}
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

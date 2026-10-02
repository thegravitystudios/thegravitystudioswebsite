"use client";

import React, { useState, useEffect, useRef } from "react";
import { Section } from "@/components/Section";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { PlaceholderBadge } from "@/components/PlaceholderBadge";
import { InstagramIcon, YoutubeIcon } from "@/components/SocialIcons";
import { Mail, Calendar, Clock, Check, ArrowRight, Search, Compass, Target } from "lucide-react";
import { GMAIL_COMPOSE_URL } from "@/lib/constants";

/**
 * TypewriterText Component — Re-triggers character typewriter reveal on scroll
 */
function TypewriterText({
  text,
  speed = 10,
  className = "",
  as = "p",
  delay = 0,
  showCursor = false,
}: {
  text: string;
  speed?: number;
  className?: string;
  as?: "span" | "p" | "h1" | "h2" | "div";
  delay?: number;
  showCursor?: boolean;
}) {
  const [displayedText, setDisplayedText] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let startTimer: NodeJS.Timeout | null = null;
    let typeInterval: NodeJS.Timeout | null = null;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setDisplayedText("");
            setIsComplete(false);

            startTimer = setTimeout(() => {
              let index = 0;
              const stepSize = text.length > 80 ? 3 : text.length > 30 ? 2 : 1;
              typeInterval = setInterval(() => {
                if (index <= text.length) {
                  setDisplayedText(text.slice(0, index));
                  index += stepSize;
                } else {
                  setDisplayedText(text);
                  if (typeInterval) clearInterval(typeInterval);
                  setIsComplete(true);
                }
              }, Math.max(speed, 6));
            }, delay);
          } else {
            if (startTimer) clearTimeout(startTimer);
            if (typeInterval) clearInterval(typeInterval);
            setDisplayedText("");
            setIsComplete(false);
          }
        });
      },
      { threshold: 0.05 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) observer.unobserve(containerRef.current);
      if (startTimer) clearTimeout(startTimer);
      if (typeInterval) clearInterval(typeInterval);
    };
  }, [text, speed, delay]);

  const hasEndDot = displayedText.endsWith(".");
  const renderText = hasEndDot ? displayedText.slice(0, -1) : displayedText;

  const Component = as;

  return (
    <Component ref={containerRef as any} className={className}>
      {renderText}
      {hasEndDot && <span className="tgs-gradient-text">.</span>}
      {showCursor && !isComplete && (
        <span className="inline-block w-[2px] sm:w-[3px] h-[0.8em] bg-purple-400 align-middle ml-1 animate-pulse" />
      )}
    </Component>
  );
}

/**
 * CardAnimatedDrop Component — Staggered 3D entrance reveal with scroll re-triggering
 */
function CardAnimatedDrop({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(false);
            timer = setTimeout(() => setIsVisible(true), delay);
          } else {
            setIsVisible(false);
            if (timer) clearTimeout(timer);
          }
        });
      },
      { threshold: 0.05 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => {
      if (ref.current) observer.unobserve(ref.current);
      if (timer) clearTimeout(timer);
    };
  }, [delay]);

  return (
    <div
      ref={ref}
      className={`transition-all duration-300 ease-out transform-gpu ${
        isVisible
          ? "opacity-100 translate-y-0 scale-100"
          : "opacity-0 translate-y-8 scale-95"
      }`}
    >
      {children}
    </div>
  );
}

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen pt-20 overflow-hidden">
      {/* INTRO SECTION (Left-aligned & 12-column grid with Ambient Radial Glow Canvas) */}
      <Section className="py-20 lg:py-28 relative overflow-hidden">
        {/* AMBIENT RADIAL GLOW CANVAS BEHIND HERO — Seamless radial gradient without box edge cropping */}
        <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[550px] sm:w-[800px] h-[300px] rounded-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-600/30 via-fuchsia-600/15 to-transparent blur-[110px] pointer-events-none z-0 animate-pulse" />

        <div className="grid grid-cols-12 gap-6 lg:gap-8 relative z-10">
          <div className="col-span-12 lg:col-span-8 text-left">
            <div className="mb-4 flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-ping shadow-[0_0_12px_#a855f7]" />
              <TypewriterText
                text="DIRECT BOOKING & INTAKE"
                speed={8}
                delay={0}
                as="span"
                className="type-eyebrow text-[9px] sm:text-xs tracking-wider sm:tracking-widest font-mono uppercase px-2.5 sm:px-3.5 py-0.5 sm:py-1 rounded-full border shadow-[0_0_20px_rgba(168,85,247,0.25)] text-purple-400 bg-purple-950/70 border-purple-500/35"
              />
            </div>

            <TypewriterText
              text="Book a Discovery Call."
              speed={10}
              delay={30}
              showCursor={true}
              as="h1"
              className="type-section-h1 text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black font-headline tracking-tight text-[var(--text-primary)] mb-6 drop-shadow-[0_0_35px_rgba(168,85,247,0.35)]"
            />

            <TypewriterText
              text="Direct intro with The Gravity Studios leadership team. Tell us your goals and we'll evaluate system fit."
              speed={8}
              delay={80}
              as="p"
              className="type-body-large text-[15px] sm:text-lg md:text-xl text-[var(--text-muted)] leading-relaxed max-w-3xl font-normal"
            />
          </div>
        </div>
      </Section>

      {/* MASTER BOOKING EMBED SECTION */}
      <Section className="pt-8 sm:pt-12 lg:pt-16 pb-32 sm:pb-40 lg:pb-48 relative overflow-hidden">
        <div className="max-w-[1280px] mx-auto space-y-16 relative z-10">

          {/* BEFORE YOU SECTION */}
          <div className="text-left space-y-8 pt-4 pb-2 relative">
            {/* AMBIENT GLOW BEHIND BEFORE YOU SECTION — Smooth radial ellipse gradient */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[800px] h-[300px] rounded-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-600/20 via-pink-600/10 to-transparent blur-[110px] pointer-events-none z-0 animate-pulse" />

            <div className="relative z-10">
              <div className="mb-2 flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping shadow-[0_0_10px_#a855f7]" />
                <TypewriterText
                  text="BEFORE YOU"
                  speed={8}
                  delay={0}
                  as="span"
                  className="type-eyebrow text-purple-400 font-mono tracking-widest uppercase block font-bold text-xs shadow-[0_0_15px_rgba(168,85,247,0.3)]"
                />
              </div>

              <TypewriterText
                text="Book a Discovery Call."
                speed={10}
                delay={30}
                showCursor={true}
                as="h2"
                className="type-section-h2 text-3xl sm:text-5xl font-headline font-bold text-[var(--text-primary)] tracking-tight mb-3 drop-shadow-[0_0_35px_rgba(168,85,247,0.35)]"
              />
              <TypewriterText
                text="45 minutes, directly with the founder. No deck, no pitch — just a real conversation about where your content is now and what it would take to fix it."
                speed={8}
                delay={80}
                as="p"
                className="type-body text-sm sm:text-base text-[var(--text-muted)] max-w-3xl leading-relaxed font-normal"
              />
            </div>

            {/* Three Numbered Items */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 relative z-10">
              {/* Item 01 */}
              <CardAnimatedDrop delay={0}>
                <div className="p-6 sm:p-8 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-surface)]/90 backdrop-blur-md flex flex-col justify-between hover:border-purple-500/60 hover:shadow-[0_20px_50px_rgba(168,85,247,0.25)] hover:-translate-y-1 hover:scale-[1.01] transition-all duration-300 shadow-md h-full group">
                  <div>
                    <div className="flex items-center justify-between gap-4 mb-4">
                      <div className="w-12 h-12 rounded-2xl border border-purple-500/30 bg-purple-500/10 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                        <Search className="w-6 h-6" />
                      </div>
                      <span className="type-eyebrow text-xs font-mono text-purple-400 font-bold group-hover:text-purple-300">01</span>
                    </div>
                    <h3 className="text-lg font-bold font-headline text-[var(--text-primary)] mb-2 group-hover:text-purple-300 transition-colors">
                      We learn about your brand
                    </h3>
                    <p className="type-body text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
                      What's working, what isn't, and why — in your own words, not from a form.
                    </p>
                  </div>
                </div>
              </CardAnimatedDrop>

              {/* Item 02 */}
              <CardAnimatedDrop delay={50}>
                <div className="p-6 sm:p-8 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-surface)]/90 backdrop-blur-md flex flex-col justify-between hover:border-purple-500/60 hover:shadow-[0_20px_50px_rgba(168,85,247,0.25)] hover:-translate-y-1 hover:scale-[1.01] transition-all duration-300 shadow-md h-full group">
                  <div>
                    <div className="flex items-center justify-between gap-4 mb-4">
                      <div className="w-12 h-12 rounded-2xl border border-purple-500/30 bg-purple-500/10 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                        <Compass className="w-6 h-6" />
                      </div>
                      <span className="type-eyebrow text-xs font-mono text-purple-400 font-bold group-hover:text-purple-300">02</span>
                    </div>
                    <h3 className="text-lg font-bold font-headline text-[var(--text-primary)] mb-2 group-hover:text-purple-300 transition-colors">
                      We map the gap
                    </h3>
                    <p className="type-body text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
                      Where your current content is breaking down, and which phase of the system actually needs to start first.
                    </p>
                  </div>
                </div>
              </CardAnimatedDrop>

              {/* Item 03 */}
              <CardAnimatedDrop delay={100}>
                <div className="p-6 sm:p-8 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-surface)]/90 backdrop-blur-md flex flex-col justify-between hover:border-purple-500/60 hover:shadow-[0_20px_50px_rgba(168,85,247,0.25)] hover:-translate-y-1 hover:scale-[1.01] transition-all duration-300 shadow-md h-full group">
                  <div>
                    <div className="flex items-center justify-between gap-4 mb-4">
                      <div className="w-12 h-12 rounded-2xl border border-purple-500/30 bg-purple-500/10 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                        <Target className="w-6 h-6" />
                      </div>
                      <span className="type-eyebrow text-xs font-mono text-purple-400 font-bold group-hover:text-purple-300">03</span>
                    </div>
                    <h3 className="text-lg font-bold font-headline text-[var(--text-primary)] mb-2 group-hover:text-purple-300 transition-colors">
                      We tell you what's next
                    </h3>
                    <p className="type-body text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
                      A clear, specific read on where to begin — before you've committed to anything.
                    </p>
                  </div>
                </div>
              </CardAnimatedDrop>
            </div>

            {/* Closing Line */}
            <div className="relative z-10 pt-2">
              <TypewriterText
                text="That's it. No obligation, no sales script — just clarity on whether this is the right fit."
                speed={8}
                delay={120}
                as="p"
                className="type-eyebrow text-xs sm:text-sm text-[var(--text-muted)] font-mono"
              />
            </div>
          </div>

          {/* IN-HOUSE MASTER BOOKING ENGINE EMBED */}
          <CardAnimatedDrop delay={0}>
            <Card className="p-0 overflow-hidden border-2 border-purple-500/40 bg-[var(--bg-surface)] text-left shadow-2xl backdrop-blur-md">
              <div className="p-6 bg-[var(--bg-main)] border-b border-[var(--border-color)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Calendar className="w-6 h-6 text-purple-400" />
                  <div>
                    <h2 className="type-card-h3 text-lg sm:text-xl text-[var(--text-primary)] font-bold">
                      Schedule Your Discovery Call
                    </h2>
                    <p className="type-eyebrow text-xs text-[var(--text-muted)] mt-0.5">
                      45-Minute Strategy Intake with Founder Prameet Patani
                    </p>
                  </div>
                </div>
                <a
                  href="/book"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full tgs-gradient-bg text-white font-bold text-xs tracking-wider uppercase hover:scale-105 transition-all shadow-[0_0_20px_rgba(168,85,247,0.4)] self-start sm:self-auto"
                >
                  <span>Open Full Scheduler Page</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Live Master Booking Engine Embed Container */}
              <div className="w-full bg-[var(--bg-surface)] min-h-[680px]">
                <iframe
                  src="/book?embed=true"
                  width="100%"
                  height="700"
                  frameBorder="0"
                  className="w-full min-h-[700px] border-0 rounded-b-2xl"
                  title="Schedule a Discovery Call with The Gravity Studios"
                />
              </div>
            </Card>
          </CardAnimatedDrop>

          {/* DIRECT EMAIL & SOCIAL FALLBACK */}
          <div className="grid grid-cols-12 gap-6 pt-4">
            <div className="col-span-12 md:col-span-6">
              <CardAnimatedDrop delay={0}>
                <Card className="border border-[var(--border-color)] flex items-start gap-4 p-8 text-left h-full hover:border-purple-500/50 hover:shadow-[0_15px_40px_rgba(168,85,247,0.2)] transition-all">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 flex-shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="type-card-h3 text-[var(--text-primary)] mb-2 font-bold">
                      Direct Email Fallback
                    </h4>
                    <p className="type-body text-xs text-[var(--text-muted)] mb-4">
                      Prefer direct email communication without a calendar booking?
                    </p>
                    <a
                      href={GMAIL_COMPOSE_URL}
                      target="_blank"
                      rel="noreferrer"
                      className="type-body text-sm font-bold tgs-gradient-text hover:underline inline-flex items-center gap-1.5"
                    >
                      business@thegravitystudios.com
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  </div>
                </Card>
              </CardAnimatedDrop>
            </div>

            <div className="col-span-12 md:col-span-6">
              <CardAnimatedDrop delay={50}>
                <Card className="border border-[var(--border-color)] flex items-start gap-4 p-8 text-left h-full hover:border-purple-500/50 hover:shadow-[0_15px_40px_rgba(168,85,247,0.2)] transition-all">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 flex-shrink-0">
                    <InstagramIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="type-card-h3 text-[var(--text-primary)] mb-2 font-bold">
                      Social Channels
                    </h4>
                    <p className="type-body text-xs text-[var(--text-muted)] mb-4">
                      Follow and reach out across social platforms.
                    </p>
                    <div className="flex items-center gap-6 type-eyebrow text-xs text-purple-400 font-mono">
                      <a href="https://www.instagram.com/thegravitystudios.mov" target="_blank" rel="noreferrer" className="hover:underline flex items-center gap-1.5">
                        <InstagramIcon className="w-4 h-4" />
                        <span>INSTAGRAM ↗</span>
                      </a>
                      <a href="https://www.youtube.com/@officialgravitystudios/videos" target="_blank" rel="noreferrer" className="hover:underline flex items-center gap-1.5">
                        <YoutubeIcon className="w-4 h-4" />
                        <span>YOUTUBE ↗</span>
                      </a>
                    </div>
                  </div>
                </Card>
              </CardAnimatedDrop>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}

"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Plus, Minus, ArrowRight, Sparkles } from "lucide-react";

interface FaqItem {
  id: string;
  question: React.ReactNode;
  answer: string;
  isCta?: boolean;
}

const faqs: FaqItem[] = [
  {
    id: "faq-1",
    question: "Who is The Gravity Studios built for?",
    answer:
      "We work with two kinds of brands. Established brands who've outgrown their current vendors — content that's inconsistent, slow, or scattered across too many agencies to coordinate. And fast-growing, founder-led brands entering a new market or building an identity from scratch, who need a real content system in place before they scale, not after.",
  },
  {
    id: "faq-2",
    question: "What execution models do you offer?",
    answer:
      "Three ways in, all run by the same team: The Whole Content System (strategy through analysis, run end-to-end), Content Production (treatments, shoots, and post, built to one craft standard), and Campaign & Ad Design (campaign concept and paid distribution, connected). All three run through the same six-phase process.",
  },
  {
    id: "faq-3",
    question: "How fast is your content turnaround time?",
    answer:
      "Turnaround depends on scope — a single content batch moves faster than a full campaign build. What stays consistent is that every phase, from planning to delivery, is run in-house by one team, so nothing waits on an external vendor's calendar.",
  },
  {
    id: "faq-4",
    question: "How do we get started working with you?",
    answer:
      "Simply click 'Book a Call' to schedule a 45-minute discovery session with our founder, Prameet Patani. We'll talk through your brand, your goals, and map out what a real engagement would look like.",
  },
  {
    id: "faq-cta",
    question: (
      <span>
        Ready to build your <span className="tgs-gradient-text font-black">content system</span>?
      </span>
    ),
    answer:
      "Book a call with The Gravity Studios team to map your brand's content system requirements.",
    isCta: true,
  },
];

/**
 * TypewriterText Component — Character-by-character typewriter reveal with scroll re-triggering
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
 * FaqAnimatedCard Component — Staggered 3D entrance reveal & scroll re-triggering
 */
function FaqAnimatedCard({
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

export function FaqSection() {
  const [openId, setOpenId] = useState<string | null>("faq-cta");

  const toggleFaq = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className="w-full py-16 sm:py-24 border-t border-[var(--border-color)] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-950/20 via-[var(--bg-main)] to-[var(--bg-main)] relative overflow-hidden">
      {/* AMBIENT RADIAL GLOW CANVAS BEHIND FAQ HEADER */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1200px] h-[450px] pointer-events-none z-0 overflow-hidden">
        {/* Primary Breathing Radial Bloom */}
        <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[700px] sm:w-[900px] h-[300px] sm:h-[400px] rounded-full bg-purple-600/25 blur-[120px] animate-pulse" />
        {/* Secondary Fuchsia Ambient Bloom */}
        <div className="absolute top-20 left-1/3 -translate-x-1/2 w-[500px] h-[250px] rounded-full bg-fuchsia-600/15 blur-[130px] opacity-70" />
      </div>

      <div className="max-w-[1000px] mx-auto px-6 sm:px-8 text-center flex flex-col items-center relative z-10">
        {/* EYEBROW */}
        <TypewriterText
          text="FREQUENTLY ASKED QUESTIONS"
          speed={8}
          delay={0}
          as="span"
          className="type-eyebrow text-purple-400 mb-2 block font-mono uppercase tracking-widest text-xs shadow-[0_0_15px_rgba(168,85,247,0.3)]"
        />

        {/* HEADING */}
        <TypewriterText
          text="Got Questions? We Have Answers."
          speed={10}
          delay={30}
          showCursor={true}
          as="h2"
          className="text-3xl sm:text-5xl font-headline font-bold text-[var(--text-primary)] tracking-tight mb-4 drop-shadow-[0_0_35px_rgba(168,85,247,0.35)]"
        />

        {/* SUBTITLE */}
        <TypewriterText
          text="Everything you need to know about our execution models, workflow speed, and brand partnership fit."
          speed={8}
          delay={80}
          as="p"
          className="type-body text-[var(--text-muted)] text-sm sm:text-base max-w-xl mb-12 leading-relaxed"
        />

        {/* ACCORDION CONTAINER */}
        <div className="w-full space-y-5 text-left">
          {faqs.map((faq, idx) => {
            const isOpen = openId === faq.id;

            if (faq.isCta) {
              return (
                <FaqAnimatedCard key={faq.id} delay={idx * 100}>
                  <div className="relative rounded-2xl border-2 border-purple-500 bg-gradient-to-r from-purple-950/30 via-[var(--bg-surface)] to-purple-950/30 shadow-[0_0_40px_rgba(168,85,247,0.25)] transition-all duration-500 overflow-hidden">
                    <div className="w-full px-6 pt-6 pb-2 text-left select-none">
                      <span className="type-eyebrow text-[10px] font-mono text-purple-400 tracking-widest uppercase font-semibold block mb-1.5">
                        NEXT STEPS
                      </span>
                      <span className="text-lg sm:text-2xl font-black font-headline text-[var(--text-primary)] leading-tight block">
                        {faq.question}
                      </span>
                    </div>

                    <div className="px-6 pb-8 pt-3 border-t border-purple-500/30">
                      <p className="type-body text-base sm:text-lg text-[var(--text-primary)] font-medium leading-relaxed max-w-2xl mb-6">
                        {faq.answer}
                      </p>

                      {/* EMBEDDED CTA BUTTONS */}
                      <div className="flex flex-wrap items-center gap-4">
                        <Link
                          href="/contact"
                          className="inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full bg-gradient-to-r from-purple-600 via-purple-500 to-fuchsia-500 text-white font-bold text-xs sm:text-sm tracking-wider uppercase hover:scale-105 transition-all shadow-[0_10px_25px_rgba(168,85,247,0.4)] group"
                        >
                          <span>BOOK A CALL</span>
                          <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link
                          href="/work"
                          className="inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full bg-[#121118] border border-white/20 hover:border-purple-500/50 text-white font-bold text-xs sm:text-sm tracking-wider uppercase hover:scale-105 transition-all group"
                        >
                          <span>SEE OUR WORK</span>
                          <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </FaqAnimatedCard>
              );
            }

            return (
              <FaqAnimatedCard key={faq.id} delay={idx * 100}>
                <div
                  className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                    isOpen
                      ? "border-purple-500/50 bg-[var(--bg-surface)] shadow-[0_10px_30px_rgba(168,85,247,0.1)]"
                      : "border-[var(--border-color)] bg-[var(--bg-surface)]/60 hover:border-purple-500/30"
                  }`}
                >
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full px-6 py-5 flex items-center justify-between gap-4 text-left cursor-pointer focus:outline-none select-none"
                  >
                    <span className="text-base sm:text-lg font-bold font-headline text-[var(--text-primary)] leading-tight">
                      {faq.question}
                    </span>
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-transform duration-300 ${
                        isOpen
                          ? "bg-purple-600 text-white rotate-180"
                          : "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                      }`}
                    >
                      {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-6 pt-2 border-t border-[var(--border-color)]/50">
                      <p className="type-body text-sm sm:text-base text-[var(--text-muted)] leading-relaxed whitespace-pre-line">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              </FaqAnimatedCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}

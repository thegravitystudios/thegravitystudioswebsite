"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Section } from "@/components/Section";
import { Button } from "@/components/Button";
import {
  Camera,
  Film,
  Zap,
  Clapperboard,
  ArrowRight,
  User,
  Building,
} from "lucide-react";

/**
 * Hero Background Push-In Animation Component — Smooth 6s subtle zoom clipped to container
 */
function HeroBackgroundPushIn() {
  const [isZoomed, setIsZoomed] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsZoomed(false);
            const timer = setTimeout(() => setIsZoomed(true), 80);
            return () => clearTimeout(timer);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, []);

  return (
    <div ref={ref} className="relative w-full h-full bg-[#0B0B0E] overflow-hidden">
      {/* Real Black & White Cinematic Studio Shoot Image with Subtle Smooth Push-In */}
      <img
        src="https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?q=80&w=2000&auto=format&fit=crop"
        alt="The Gravity Studios on set"
        className={`w-full h-full object-cover object-center grayscale contrast-125 brightness-75 opacity-40 transform-gpu transition-transform duration-[6000ms] ease-out ${
          isZoomed ? "scale-112" : "scale-100"
        }`}
      />
    </div>
  );
}

/**
 * Subtle Fade In Component for text elements
 */
function SubtleFadeIn({
  children,
  delay = 0,
  direction = "up",
}: {
  children: React.ReactNode;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
}) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(false);
            const timer = setTimeout(() => setIsVisible(true), delay);
            return () => clearTimeout(timer);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, [delay]);

  const transformInitial =
    direction === "up"
      ? "translate-y-6"
      : direction === "down"
      ? "-translate-y-4"
      : direction === "left"
      ? "translate-x-6"
      : "-translate-x-6";

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ease-out transform-gpu ${
        isVisible
          ? "opacity-100 translate-x-0 translate-y-0"
          : `opacity-0 ${transformInitial}`
      }`}
    >
      {children}
    </div>
  );
}

/**
 * Founder Photo Reveal Component — Smooth Bottom-to-Top reveal on scroll
 */
function FounderPhotoReveal({ children }: { children: React.ReactNode }) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(false);
            const timer = setTimeout(() => setIsVisible(true), 60);
            return () => clearTimeout(timer);
          }
        });
      },
      { threshold: 0.15 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ease-out transform-gpu ${
        isVisible
          ? "opacity-100 translate-y-0 scale-100"
          : "opacity-0 translate-y-16 scale-95"
      }`}
    >
      {children}
    </div>
  );
}

/**
 * Word-By-Word Title Component — Words slide up sequentially with ambient radial glow behind text
 */
function WordByWordTitle({ text }: { text: string }) {
  const [visibleWords, setVisibleWords] = useState<number>(0);
  const [isGlowing, setIsGlowing] = useState(false);
  const ref = useRef<HTMLHeadingElement>(null);
  const words = text.split(" ");

  useEffect(() => {
    let timeouts: NodeJS.Timeout[] = [];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleWords(0);
            setIsGlowing(false);

            const glowTimer = setTimeout(() => setIsGlowing(true), 80);
            timeouts.push(glowTimer);

            words.forEach((_, i) => {
              const wordTimer = setTimeout(() => {
                setVisibleWords((prev) => Math.max(prev, i + 1));
              }, i * 220);
              timeouts.push(wordTimer);
            });
          } else {
            setVisibleWords(0);
            setIsGlowing(false);
            timeouts.forEach((t) => clearTimeout(t));
            timeouts = [];
          }
        });
      },
      { threshold: 0.15 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => {
      if (ref.current) observer.unobserve(ref.current);
      timeouts.forEach((t) => clearTimeout(t));
    };
  }, [text]);

  return (
    <div className="relative inline-block w-full">
      {/* Ambient Glow behind Prameet Patani */}
      <div
        className={`absolute -inset-4 max-w-lg rounded-full bg-gradient-to-r from-purple-600/35 via-pink-600/25 to-indigo-600/35 blur-2xl pointer-events-none transition-all duration-1000 transform-gpu ${
          isGlowing ? "opacity-100 scale-105" : "opacity-0 scale-90"
        }`}
      />

      <h2
        ref={ref}
        className="type-section-h1 text-[var(--text-primary)] font-black tracking-tight text-4xl sm:text-5xl lg:text-6xl leading-tight min-h-[1.2em] relative z-10 drop-shadow-[0_0_20px_rgba(168,85,247,0.25)]"
      >
        {words.map((word, idx) => {
          const hasDot = word.endsWith(".");
          const cleanWord = hasDot ? word.slice(0, -1) : word;
          return (
            <span
              key={idx}
              className={`inline-block transition-all duration-500 mr-3 transform ${
                idx < visibleWords
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-6"
              }`}
            >
              {cleanWord}
              {hasDot && <span className="tgs-gradient-text">.</span>}
            </span>
          );
        })}
      </h2>
    </div>
  );
}

/**
 * Linear Bio Text Reveal Component (Cascades linearly from 1st line of Para 1 to last line of Para 4, 10% -> 100% opacity)
 */
function LinearBioTextReveal({ paragraphs }: { paragraphs: string[] }) {
  const [revealedChars, setRevealedChars] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const totalLength = paragraphs.reduce((sum, p) => sum + p.length, 0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setRevealedChars(0);
            let current = 0;

            const interval = setInterval(() => {
              if (current <= totalLength) {
                setRevealedChars(current);
                current += 3;
              } else {
                clearInterval(interval);
              }
            }, 12);
          }
        });
      },
      { threshold: 0.15 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, [totalLength]);

  let globalOffset = 0;

  return (
    <div ref={ref} className="space-y-4 type-body text-sm sm:text-base leading-relaxed font-normal">
      {paragraphs.map((p, pIdx) => {
        const paragraphStart = globalOffset;
        globalOffset += p.length;

        return (
          <p key={pIdx}>
            {p.split("").map((char, charIdx) => {
              const charGlobalIdx = paragraphStart + charIdx;
              const isRevealed = charGlobalIdx < revealedChars;

              return (
                <span
                  key={charIdx}
                  className={`transition-opacity duration-300 ${
                    isRevealed
                      ? "opacity-100 text-[var(--text-muted)] font-normal"
                      : "opacity-10 text-[var(--text-muted)] font-normal"
                  }`}
                >
                  {char}
                </span>
              );
            })}
          </p>
        );
      })}
    </div>
  );
}

/**
 * Glowing Statement Component — Blooms with ambient radial glow & text drop-shadow when scrolled into view
 */
function GlowingStatement({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  const [isGlowing, setIsGlowing] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsGlowing(false);
            const timer = setTimeout(() => setIsGlowing(true), 80);
            return () => clearTimeout(timer);
          }
        });
      },
      { threshold: 0.15 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, []);

  const hasEndDot = title.endsWith(".");
  const cleanTitle = hasEndDot ? title.slice(0, -1) : title;

  return (
    <div ref={ref} className="relative pt-12 sm:pt-16 pb-6 text-center max-w-6xl mx-auto">
      {/* Ambient Radial Gradient Background Glow */}
      <div
        className={`absolute inset-0 max-w-4xl mx-auto rounded-full bg-gradient-to-r from-purple-600/30 via-pink-600/25 to-indigo-600/30 blur-3xl pointer-events-none transition-all duration-1000 transform-gpu ${
          isGlowing ? "opacity-100 scale-105" : "opacity-0 scale-90"
        }`}
      />

      {/* Small Horizontal Glowing Gradient Accent Line */}
      <div
        className={`w-12 h-[2px] mx-auto rounded-full tgs-gradient-bg mb-6 transition-all duration-1000 transform-gpu ${
          isGlowing
            ? "opacity-100 scale-100 shadow-[0_0_20px_rgba(168,85,247,0.9)]"
            : "opacity-0 scale-50"
        }`}
      />

      {/* Title — Extra Bold with Glowing Text Atmosphere */}
      <h3
        className={`text-xl sm:text-3xl lg:text-4xl font-black font-headline text-[var(--text-primary)] leading-tight tracking-tight whitespace-normal lg:whitespace-nowrap relative z-10 transition-all duration-1000 transform-gpu ${
          isGlowing
            ? "opacity-100 translate-y-0 drop-shadow-[0_0_25px_rgba(168,85,247,0.35)]"
            : "opacity-0 translate-y-4"
        }`}
      >
        {cleanTitle}
        {hasEndDot && <span className="tgs-gradient-text">.</span>}
      </h3>

      {/* Description Subhead — Soft Glow Transition */}
      <p
        className={`text-sm sm:text-base lg:text-lg text-[var(--text-muted)] leading-normal font-medium max-w-5xl mx-auto whitespace-normal lg:whitespace-nowrap pt-2 relative z-10 transition-all duration-1000 delay-200 transform-gpu ${
          isGlowing ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        {description}
      </p>
    </div>
  );
}

/**
 * Animated Gallery Card Component with Re-Triggering Entrance, Real Image & Hover Zoom
 */
function GalleryCard({
  colSpanClass,
  aspectClass,
  badgeText,
  icon: Icon,
  imageSrc,
  title,
  subtitle,
  delay = 0,
}: {
  colSpanClass: string;
  aspectClass: string;
  badgeText: string;
  icon: React.ElementType;
  imageSrc: string;
  title: string;
  subtitle: string;
  delay?: number;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(false);
            const timer = setTimeout(() => setIsVisible(true), delay);
            return () => clearTimeout(timer);
          }
        });
      },
      { threshold: 0.15 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, [delay]);

  return (
    <div
      ref={ref}
      className={`${colSpanClass} ${aspectClass} rounded-3xl border border-white/15 bg-[var(--bg-surface)] p-6 flex flex-col justify-between relative group hover:border-purple-500/60 transition-all duration-700 shadow-2xl overflow-hidden min-h-[220px] transform-gpu ${
        isVisible
          ? "opacity-100 translate-y-0 scale-100"
          : "opacity-0 translate-y-16 scale-95"
      }`}
    >
      {/* Real High-Res Reference Background Image with Smooth Hover Zoom */}
      <img
        src={imageSrc}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover object-center grayscale contrast-125 brightness-[0.7] group-hover:brightness-90 group-hover:scale-110 transition-all duration-700 ease-out z-0"
      />

      {/* Dark Gradient Overlay for Crisp Text Legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/30 z-0 pointer-events-none" />

      {/* Top Header Badge & Icon */}
      <div className="flex items-center justify-between z-10">
        <span className="type-eyebrow text-xs font-mono text-purple-300 font-bold bg-purple-950/80 backdrop-blur-md px-3 py-1 rounded-full border border-purple-500/40 shadow-lg">
          {badgeText}
        </span>
        <div className="p-2 rounded-full bg-black/50 backdrop-blur-md border border-white/15 shadow-md">
          <Icon className="w-4 h-4 text-purple-400" />
        </div>
      </div>

      {/* Bottom Text Overlay */}
      <div className="z-10 space-y-1 mt-auto">
        <span className="type-eyebrow text-white font-mono text-xs uppercase block font-black tracking-wider drop-shadow-md">
          {title}
        </span>
        <p className="type-body text-xs text-zinc-300 font-mono leading-relaxed drop-shadow">
          {subtitle}
        </p>
      </div>
    </div>
  );
}

interface QAItem {
  id: string;
  question: string;
  answer: string;
}

const HOW_WE_THINK_QA: QAItem[] = [
  {
    id: "q1",
    question: "Why stories, not content?",
    answer:
      "\"Content occupies space. A story earns attention. Every project we take on starts as the latter — a shape, a tension, a reason to keep watching — before a single frame gets shot.\"",
  },
  {
    id: "q2",
    question: "What's the actual vision here?",
    answer:
      "\"That a brand's content should operate the way a film set operates — one team, one standard, everyone accountable to the same outcome. Not six vendors assembling fragments and hoping they cohere.\"",
  },
  {
    id: "q3",
    question: "What do you believe about craft?",
    answer:
      "\"That it is never negotiable. A deadline can move. The standard doesn't. We would rather deliver later than deliver something forgettable.\"",
  },
  {
    id: "q4",
    question: "How do you measure success?",
    answer:
      "\"Not in impressions or a single viral moment, but in whether a brand is sharper, more recognizable, and harder to imitate a year after we started than the day we met.\"",
  },
  {
    id: "q5",
    question: "Why is Prameet still involved in every department?",
    answer:
      "\"Because standards erode the moment nobody senior is close enough to the work to catch it. He stays in strategy, on set, and in the edit bay — not as oversight, but because the craft is still personally his.\"",
  },
  {
    id: "q6",
    question: "Why one team instead of specialized vendors?",
    answer:
      "\"Specialization sounds efficient until the reasoning behind an idea has to survive four separate handoffs. One team means the person who built the strategy is still in the room when it's being cut.\"",
  },
  {
    id: "q7",
    question: "What do you refuse to do, even if a client asks?",
    answer:
      "\"Ship something we know is average because the timeline demands it. We'll renegotiate the timeline before we lower the standard.\"",
  },
  {
    id: "q8",
    question: "Why does speed matter here more than at most studios?",
    answer:
      "\"Because a brand's advantage rarely survives being early to a moment by six weeks instead of six months. Full in-house capability means we're not waiting on anyone else's calendar to move.\"",
  },
  {
    id: "q9",
    question: "What's a mistake most brands make with their content?",
    answer:
      "\"Treating it as a series of assets instead of a system. A brand doesn't need more posts. It needs the same idea, told with enough consistency that people recognize it before they've finished reading the caption.\"",
  },
  {
    id: "q10",
    question: "Why does the studio turn down work sometimes?",
    answer:
      "\"When the brief only wants execution, not judgment. We're not the right studio for a brand that already knows exactly what it wants made — we're built for brands that want to be told the truth first.\"",
  },
];

/**
 * How We Think Section Component — 2-Column Questions Grid with Staggered Entrance Animations & Highlighted Answer Box
 */
function HowWeThinkSection() {
  const [activeId, setActiveId] = useState("q1");
  const [isFading, setIsFading] = useState(false);
  const [currentAnswer, setCurrentAnswer] = useState(HOW_WE_THINK_QA[0].answer);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(false);
            timer = setTimeout(() => setIsVisible(true), 60);
          } else {
            setIsVisible(false);
            if (timer) clearTimeout(timer);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
      if (timer) clearTimeout(timer);
    };
  }, []);

  const handleSelect = (id: string) => {
    if (id === activeId) return;
    setIsFading(true);
    setActiveId(id);

    setTimeout(() => {
      const selected = HOW_WE_THINK_QA.find((item) => item.id === id);
      if (selected) {
        setCurrentAnswer(selected.answer);
      }
      setIsFading(false);
    }, 180);
  };

  const col1Questions = HOW_WE_THINK_QA.slice(0, 5);
  const col2Questions = HOW_WE_THINK_QA.slice(5, 10);

  return (
    <Section className="py-20 sm:py-28 bg-[var(--bg-surface)] border-y border-[var(--border-color)] overflow-hidden">
      <div ref={sectionRef} className="max-w-[1280px] mx-auto text-left space-y-12">
        <div>
          <SubtleFadeIn delay={100} direction="down">
            <span className="type-eyebrow text-purple-400 font-mono tracking-widest uppercase block mb-3 font-bold">
              HOW WE THINK
            </span>
          </SubtleFadeIn>

          <WordByWordTitle text="Ask us what we actually believe." />

          <SubtleFadeIn delay={300} direction="up">
            <p className="type-body text-sm sm:text-base text-[var(--text-muted)] max-w-2xl leading-relaxed mt-4">
              Pick a question. Get a real answer, not a mission statement.
            </p>
          </SubtleFadeIn>
        </div>

        {/* 2-Column Questions Grid with Staggered Entrance Animations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 pt-2">
          {/* Left Column (Q1 - Q5) */}
          <div className="flex flex-col gap-3">
            {col1Questions.map((item, idx) => {
              const isActive = item.id === activeId;
              const delayMs = idx * 60;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item.id)}
                  style={{ transitionDelay: `${delayMs}ms` }}
                  className={`text-left text-sm sm:text-base font-semibold px-5 py-4 rounded-2xl transition-all duration-500 transform-gpu cursor-pointer ${
                    isVisible
                      ? "opacity-100 translate-y-0 scale-100"
                      : "opacity-0 translate-y-8 scale-95"
                  } ${
                    isActive
                      ? "tgs-gradient-bg text-white shadow-[0_0_30px_rgba(168,85,247,0.4)] scale-[1.02] border border-white/20"
                      : "bg-[var(--bg-main)]/60 border border-white/5 text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-white/5 hover:border-purple-500/20"
                  }`}
                >
                  {item.question}
                </button>
              );
            })}
          </div>

          {/* Right Column (Q6 - Q10) */}
          <div className="flex flex-col gap-3">
            {col2Questions.map((item, idx) => {
              const isActive = item.id === activeId;
              const delayMs = (idx + 1) * 60;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item.id)}
                  style={{ transitionDelay: `${delayMs}ms` }}
                  className={`text-left text-sm sm:text-base font-semibold px-5 py-4 rounded-2xl transition-all duration-500 transform-gpu cursor-pointer ${
                    isVisible
                      ? "opacity-100 translate-y-0 scale-100"
                      : "opacity-0 translate-y-8 scale-95"
                  } ${
                    isActive
                      ? "tgs-gradient-bg text-white shadow-[0_0_30px_rgba(168,85,247,0.4)] scale-[1.02] border border-white/20"
                      : "bg-[var(--bg-main)]/60 border border-white/5 text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-white/5 hover:border-purple-500/20"
                  }`}
                >
                  {item.question}
                </button>
              );
            })}
          </div>
        </div>

        {/* Highlighted Answer Card Container Below with Smooth Spring Drop Entrance & Pulsing Glow */}
        <div
          className={`relative p-8 sm:p-10 lg:p-12 rounded-3xl bg-[var(--bg-main)] border border-purple-500/35 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden transition-all duration-700 ease-out transform-gpu ${
            isVisible
              ? "opacity-100 translate-y-0 scale-100 shadow-[0_20px_60px_rgba(168,85,247,0.15)]"
              : "opacity-0 translate-y-12 scale-95"
          }`}
          style={{ transitionDelay: "420ms" }}
        >
          {/* Ambient Glow Atmosphere Behind Answer */}
          <div
            className={`absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-600/20 via-pink-600/15 to-indigo-600/20 blur-2xl pointer-events-none transition-all duration-700 ${
              isFading ? "opacity-30 scale-95" : "opacity-100 scale-105"
            }`}
          />

          {/* Small Horizontal Gradient Accent Rule (~48px wide, 2px tall) */}
          <div className="w-12 h-[2px] rounded-full tgs-gradient-bg mb-6 shadow-[0_0_20px_rgba(168,85,247,0.9)] relative z-10" />

          {/* Answer Copy with Smooth 180ms Crossfade Transition */}
          <div
            className={`transition-all duration-200 transform relative z-10 ${
              isFading
                ? "opacity-0 translate-y-2"
                : "opacity-100 translate-y-0"
            }`}
          >
            <p className="text-xl sm:text-2xl lg:text-3xl text-[var(--text-primary)] leading-relaxed font-bold tracking-tight">
              {currentAnswer}
            </p>
          </div>
        </div>
      </div>
    </Section>
  );
}

/**
 * Typewriter Headline Component — Triggers every time scrolled into view
 */
function TypewriterHeadline({ text, speed = 35 }: { text: string; speed?: number }) {
  const [displayedText, setDisplayedText] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const containerRef = useRef<HTMLHeadingElement>(null);
  const animationRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Reset and start typewriter animation whenever scrolled into view
            if (animationRef.current) clearInterval(animationRef.current);
            setDisplayedText("");
            setIsComplete(false);
            let index = 0;

            animationRef.current = setInterval(() => {
              if (index <= text.length) {
                setDisplayedText(text.slice(0, index));
                index++;
              } else {
                if (animationRef.current) clearInterval(animationRef.current);
                setIsComplete(true);
              }
            }, speed);
          }
        });
      },
      { threshold: 0.15 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) observer.unobserve(containerRef.current);
      if (animationRef.current) clearInterval(animationRef.current);
    };
  }, [text, speed]);

  // Check if text ends with a period for the gradient dot accent treatment
  const hasEndDot = displayedText.endsWith(".");
  const renderText = hasEndDot ? displayedText.slice(0, -1) : displayedText;

  return (
    <h1
      ref={containerRef}
      className="type-section-h1 text-white font-extrabold tracking-tight text-3xl sm:text-5xl lg:text-6xl leading-[1.1] min-h-[2.4em]"
    >
      {renderText}
      {hasEndDot && <span className="tgs-gradient-text">.</span>}
      {!isComplete && (
        <span className="inline-block w-[3px] h-[0.8em] bg-purple-400 align-middle ml-1 animate-pulse" />
      )}
    </h1>
  );
}

/**
 * Tilted Stat Card Component with Re-Triggering 3D Spring Entrance, Count-Up Motion & Neon Drop Shadows
 */
function TiltedStatCard({
  value,
  suffix = "",
  label,
  description,
  bgColor,
  tiltClass,
  delay = 0,
  zIndexClass = "z-10",
}: {
  value: number;
  suffix?: string;
  label: string;
  description: string;
  bgColor: string;
  tiltClass: string;
  delay?: number;
  zIndexClass?: string;
}) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Reset & re-trigger every time it comes into view
            setIsVisible(false);
            setCount(0);

            const entranceTimer = setTimeout(() => {
              setIsVisible(true);
            }, delay);

            const countTimer = setTimeout(() => {
              const duration = 1400; // 1.4s duration
              const startTime = performance.now();

              const animate = (now: number) => {
                const elapsed = now - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const easeOut = 1 - Math.pow(1 - progress, 3);
                setCount(Math.floor(easeOut * value));

                if (progress < 1) {
                  requestAnimationFrame(animate);
                }
              };

              requestAnimationFrame(animate);
            }, delay + 100);

            return () => {
              clearTimeout(entranceTimer);
              clearTimeout(countTimer);
            };
          }
        });
      },
      { threshold: 0.15 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [value, delay]);

  return (
    <div
      ref={ref}
      className={`group relative p-8 sm:p-10 lg:p-12 rounded-3xl ${bgColor} text-white ${tiltClass} ${zIndexClass} shadow-2xl hover:rotate-0 hover:-translate-y-4 hover:scale-105 hover:z-40 hover:shadow-[0_35px_80px_rgba(0,0,0,0.7)] transition-all duration-700 ease-out flex flex-col justify-between transform-gpu cursor-default border border-white/15 ${
        isVisible
          ? "opacity-100 translate-y-0 scale-100"
          : "opacity-0 translate-y-24 scale-80"
      }`}
    >
      <div>
        {/* Huge Ultra-Bold Number with 3D Drop Shadow & Glow */}
        <div className="font-headline font-black text-6xl sm:text-7xl lg:text-8xl tracking-tight text-white leading-none mb-3 drop-shadow-[0_12px_24px_rgba(0,0,0,0.6)] group-hover:scale-105 transition-transform duration-500">
          {count}
          {suffix && <span className="text-white/95 drop-shadow-[0_8px_16px_rgba(0,0,0,0.5)]">{suffix}</span>}
        </div>

        {/* Small Caps Label */}
        <div className="type-eyebrow text-xs font-mono font-black tracking-widest uppercase text-white/90 leading-tight drop-shadow-sm">
          {label}
        </div>
      </div>

      <div>
        {/* White Divider */}
        <div className="border-t border-white/30 my-6 group-hover:border-white/50 transition-colors" />

        {/* Description */}
        <p className="type-body text-xs sm:text-sm text-white/85 font-semibold leading-relaxed italic drop-shadow-sm">
          "{description}"
        </p>
      </div>
    </div>
  );
}

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen pt-20">
      {/* 1. HERO — PERMANENT DARK CINEMATIC HERO */}
      <Section className="py-24 sm:py-32 lg:py-40 -mt-20 pt-32 sm:pt-40 lg:pt-48 relative overflow-hidden bg-[#0B0B0E] text-white border-b border-[#24242D] flex items-center min-h-screen">
        {/* Full-Spread Black & White Background Image Container */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <HeroBackgroundPushIn />

          {/* Seamless Top Fade Out under Navbar */}
          <div className="absolute top-0 inset-x-0 h-44 bg-gradient-to-b from-[#0B0B0E] via-[#0B0B0E]/85 to-transparent z-10" />

          {/* Left Vignette Fade for 100% Crisp Headline Contrast */}
          <div className="absolute inset-y-0 left-0 w-full lg:w-3/4 bg-gradient-to-r from-black via-black/90 to-transparent z-10" />

          {/* Bottom Fade Out into next section */}
          <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-[#0B0B0E] via-[#0B0B0E]/80 to-transparent z-10" />

          {/* Overall Neutral Dark Scrim */}
          <div className="absolute inset-0 bg-black/50 z-10" />
        </div>

        {/* Hero Text Overlaid on Full-Spread Background Image — Permanently Crisp White */}
        <div className="max-w-[1280px] mx-auto w-full text-left relative z-20">
          <div className="max-w-3xl space-y-6">
            <SubtleFadeIn delay={100} direction="down">
              <span className="type-eyebrow text-purple-400 font-mono tracking-widest uppercase block mb-3 font-bold">
                WHO WE ARE
              </span>
            </SubtleFadeIn>

            <TypewriterHeadline
              text="Content fills a feed. A story is the only thing that stops someone in it."
              speed={35}
            />

            <SubtleFadeIn delay={400} direction="up">
              <p className="type-body-large text-zinc-400 text-base sm:text-xl lg:text-2xl leading-relaxed font-normal max-w-2xl">
                The Gravity Studios builds stories, not filler — the same discipline a film demands, applied to every brand we work with.
              </p>
            </SubtleFadeIn>
          </div>
        </div>
      </Section>

      {/* 2. THE FOUNDER — PORTRAIT + NARRATIVE BIO */}
      <Section className="py-20 sm:py-28 bg-[var(--bg-surface)] border-y border-[var(--border-color)]">
        <div className="max-w-[1280px] mx-auto text-left space-y-16">
          <div className="grid grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column — Founder Portrait with Perfect Facial Framing */}
            <div className="col-span-12 lg:col-span-5 order-2 lg:order-1">
              <FounderPhotoReveal>
                <div className="relative aspect-[4/5] sm:aspect-[3/4] lg:aspect-[4/5] rounded-3xl overflow-hidden border border-purple-500/30 bg-[#0B0B0E] shadow-2xl group hover:border-purple-500/60 transition-all duration-700">
                  <img
                    src="/founder-prameet.png"
                    alt="Prameet Patani — Founder of The Gravity Studios"
                    className="w-full h-full object-cover object-[center_30%] scale-105 group-hover:scale-110 transition-transform duration-700 ease-out"
                  />
                  {/* Subtle Dark Gradient Overlay at Bottom */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />
                  
                  {/* Caption Badge at Bottom */}
                  <div className="absolute bottom-6 left-6 right-6">
                    <span className="type-eyebrow text-white font-mono text-sm font-black uppercase tracking-widest block drop-shadow-md">
                      Prameet Patani
                    </span>
                    <span className="text-xs text-purple-300 font-mono font-semibold block mt-0.5 drop-shadow-sm">
                      Founder & Creative Director
                    </span>
                  </div>
                </div>
              </FounderPhotoReveal>
            </div>

            {/* Right Column — Founder Copy */}
            <div className="col-span-12 lg:col-span-7 order-1 lg:order-2 space-y-6">
              <span className="type-eyebrow text-purple-400 font-mono tracking-widest uppercase block mb-2 font-bold">
                THE FOUNDER
              </span>
              <WordByWordTitle text="Prameet Patani." />
              <p className="type-body-large text-purple-400 dark:text-purple-400 font-mono text-base sm:text-lg lg:text-xl font-bold">
                Filmmaker, Storyteller, Musician
              </p>

              <LinearBioTextReveal
                paragraphs={[
                  "Prameet Patani began making films almost no one watched. Long before The Gravity Studios existed, he was already working, building his craft in practice, professionally, from 2021 onward, learning sound, editing, and storytelling through the work itself rather than in a classroom.",
                  "Formal film education came later, at Whistling Woods International, adding depth and structure to a practice he had already built. During that time, he took on a documentary project few believed in, eventually overseeing most of its departments himself. The film went on to become one of the strongest on the board that year. By his third year, he was producing the three highest-budget films his college had ever seen, a decision made against considerable advice to the contrary.",
                  "That same conviction became the foundation of The Gravity Studios, not a business plan first, but a belief that story deserves more discipline than most brands give it, and that craft is never optional.",
                  "Today, Prameet leads two companies, remaining directly involved in direction and editing. The same instincts that shaped his earliest work now shape everything the studio builds."
                ]}
              />
            </div>
          </div>

          {/* Glowing Statement Component */}
          <GlowingStatement
            title="We'd rather lose the pitch than ship something mediocre."
            description="We don't measure ourselves against other agencies. We measure against whether the brand actually grows."
          />
        </div>
      </Section>

      {/* WHISTLING WOODS FILMMAKING PEDIGREE SECTION */}
      <Section className="py-20 sm:py-28 bg-[var(--bg-main)] border-b border-[var(--border-color)]">
        <div className="max-w-[1280px] mx-auto text-left space-y-12">
          <div>
            <SubtleFadeIn delay={100} direction="down">
              <span className="type-eyebrow text-purple-400 font-mono tracking-widest uppercase block mb-3 font-bold text-xs">
                ASIA'S PREMIER FILM SCHOOL HERITAGE
              </span>
            </SubtleFadeIn>

            <WordByWordTitle text="Filmmaker directors, not social media editors." />
          </div>

          <div className="p-8 sm:p-12 rounded-3xl border border-purple-500/30 bg-[var(--bg-surface)] shadow-2xl space-y-6">
            <p className="type-body text-base sm:text-lg lg:text-xl text-white leading-relaxed font-semibold">
              We are not social media editors or traditional ad managers. The core of The Gravity Studios is built by filmmaker directors graduated from Whistling Woods International—Asia’s premier film school.
            </p>
            <p className="type-body text-sm sm:text-base text-[var(--text-muted)] leading-relaxed font-normal">
              Having directed and produced the largest short films in college history (currently under international festival distribution), we apply cinema-grade storytelling, director-level narrative pacing, lighting, color grading, and sound masterclasses to new-age business media.
            </p>
          </div>

          {/* THE 4-STEP COLLABORATIVE FILMMAKING METHOD */}
          <div className="pt-12">
            <div className="mb-10">
              <span className="type-eyebrow text-purple-400 font-mono tracking-widest uppercase block mb-3 font-bold text-xs">
                OUR WORKFLOW
              </span>
              <WordByWordTitle text="The 4-Step Collaborative Filmmaking Method." />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 sm:p-8 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-surface)] space-y-4 hover:border-purple-500/50 transition-all">
                <span className="type-eyebrow text-xl font-mono text-purple-400 font-black block">01</span>
                <h4 className="text-lg font-bold font-headline text-white">Brand Immersion & Soul Discovery</h4>
                <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
                  A deep-dive session where we uncover the core vision, founder personality, product differentiators, and target audience psychology.
                </p>
              </div>

              <div className="p-6 sm:p-8 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-surface)] space-y-4 hover:border-purple-500/50 transition-all">
                <span className="type-eyebrow text-xl font-mono text-purple-400 font-black block">02</span>
                <h4 className="text-lg font-bold font-headline text-white">Creative Brainstorm & Visual Briefing</h4>
                <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
                  Our team of film directors brainstorms script hooks, narrative arcs, lighting moods, and visual styleboards tailored specifically to your brand.
                </p>
              </div>

              <div className="p-6 sm:p-8 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-surface)] space-y-4 hover:border-purple-500/50 transition-all">
                <span className="type-eyebrow text-xl font-mono text-purple-400 font-black block">03</span>
                <h4 className="text-lg font-bold font-headline text-white">Collaborative Exchange & Master Plan</h4>
                <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
                  We present the full creative brief and master plan, exchanging ideas with your leadership team until the vision is 100% locked.
                </p>
              </div>

              <div className="p-6 sm:p-8 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-surface)] space-y-4 hover:border-purple-500/50 transition-all">
                <span className="type-eyebrow text-xl font-mono text-purple-400 font-black block">04</span>
                <h4 className="text-lg font-bold font-headline text-white">Cinema Production & Distribution</h4>
                <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
                  We execute the shoot, post-production, color grading, sound design, and media deployment—delivering a complete cinematic asset system.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* 3. BY THE NUMBERS — HIGH-IMPACT TILTED SOLID-COLOR CARDS MOMENT */}
      <Section className="py-24 sm:py-32 lg:py-40 bg-[var(--bg-main)] border-b border-[var(--border-color)] overflow-hidden">
        <div className="max-w-[1280px] mx-auto text-left space-y-16">
          <div>
            <SubtleFadeIn delay={100} direction="down">
              <span className="type-eyebrow text-purple-400 font-mono tracking-widest uppercase block mb-3 font-bold">
                BY THE NUMBERS
              </span>
            </SubtleFadeIn>

            <WordByWordTitle text="What five years actually adds up to." />
          </div>

          {/* Three Bold Tilted Solid-Color Cards (Gravity Gradient Color Stops: Indigo #2E1E9B, Violet #9B27D4, Magenta #F51CA6) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-6 py-4">
            {/* Card 1: Solid Indigo #2E1E9B */}
            <TiltedStatCard
              value={200}
              suffix="+"
              label="Projects Delivered End-to-End"
              description="Brand films, campaigns, and full content systems"
              bgColor="bg-[#2E1E9B]"
              tiltClass="-rotate-2 md:-rotate-4"
              delay={0}
              zIndexClass="z-10"
            />

            {/* Card 2: Solid Violet #9B27D4 */}
            <TiltedStatCard
              value={100}
              suffix="M+"
              label="Impressions Generated"
              description="Across campaigns and content, cumulative"
              bgColor="bg-[#9B27D4]"
              tiltClass="rotate-1 md:rotate-[3deg]"
              delay={150}
              zIndexClass="z-20"
            />

            {/* Card 3: Solid Magenta #F51CA6 */}
            <TiltedStatCard
              value={50}
              suffix="+"
              label="Brands Partnered With"
              description="Premium and growing brands, since 2021"
              bgColor="bg-[#F51CA6]"
              tiltClass="-rotate-1 md:-rotate-3"
              delay={300}
              zIndexClass="z-10"
            />
          </div>
        </div>
      </Section>

      {/* 3.5 HOW WE THINK — INTERACTIVE 2-COLUMN Q&A SECTION */}
      <HowWeThinkSection />



      {/* 4. CLOSING CTA — TEXT-ONLY */}
      <Section className="pt-20 sm:pt-28 lg:pt-32 pb-32 sm:pb-40 lg:pb-48 border-t border-[var(--border-color)] bg-[var(--bg-surface)]">
        <div className="max-w-[1280px] mx-auto grid grid-cols-12 gap-8 items-center text-left">
          <div className="col-span-12 lg:col-span-8">
            <span className="type-eyebrow text-black dark:text-purple-400 font-mono tracking-widest uppercase block mb-3 font-extrabold">
              THE NEXT STEP
            </span>
            <h2 className="type-section-h1 text-[var(--text-primary)] font-extrabold tracking-tight mb-4 text-3xl sm:text-4xl lg:text-5xl">
              Ready to build your system<span className="tgs-gradient-text">?</span>
            </h2>
            <p className="type-body-large text-[var(--text-muted)] text-base sm:text-xl leading-relaxed font-normal">
              Every engagement starts with a 45-minute discovery call with the founder — strategy, the brand, and what the next steps actually look like. No deck, no pitch. Just the conversation.
            </p>
          </div>
          <div className="col-span-12 lg:col-span-4 lg:flex lg:justify-end">
            <Button
              href="/book"
              target="_blank"
              rel="noopener noreferrer"
              size="lg"
              variant="primary"
              className="w-full sm:w-auto px-9 py-4 text-xs sm:text-sm font-extrabold tracking-widest uppercase shadow-[0_0_35px_rgba(168,85,247,0.4)]"
            >
              BOOK A CALL
            </Button>
          </div>
        </div>
      </Section>
    </div>
  );
}

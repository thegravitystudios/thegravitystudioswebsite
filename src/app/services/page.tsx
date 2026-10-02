"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Section } from "@/components/Section";
import { Button } from "@/components/Button";
import {
  CheckCircle2,
  Compass,
  FileCheck,
  Camera,
  Film,
  TrendingUp,
  LineChart,
  Sparkles,
  Layers,
  ChevronDown,
  ChevronUp,
  Loader2,
  RefreshCw,
  Mail,
  Globe,
  AtSign,
  Lock,
  Unlock,
} from "lucide-react";

/**
 * SubtleFadeIn Component — Triggers every time scrolled into view
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
      { threshold: 0.1 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => {
      if (ref.current) observer.unobserve(ref.current);
      if (timer) clearTimeout(timer);
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
      {/* Ambient Glow behind text */}
      <div
        className={`absolute -inset-4 max-w-lg rounded-full bg-gradient-to-r from-purple-600/35 via-pink-600/25 to-indigo-600/35 blur-2xl pointer-events-none transition-all duration-1000 transform-gpu ${
          isGlowing ? "opacity-100 scale-105" : "opacity-0 scale-90"
        }`}
      />

      <h2
        ref={ref}
        className="type-section-h1 text-[var(--text-primary)] font-black tracking-tight text-3xl sm:text-4xl lg:text-5xl leading-tight min-h-[1.2em] relative z-10 drop-shadow-[0_0_20px_rgba(168,85,247,0.25)]"
      >
        {words.map((word, idx) => {
          const hasDot = word.endsWith(".");
          const cleanWord = hasDot ? word.slice(0, -1) : word;
          return (
            <span
              key={idx}
              className={`inline-block transition-all duration-500 mr-2.5 sm:mr-3 transform ${
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
 * TypewriterText Component — Types out text with customizable speed, delay & HTML element tag
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
 * InsightAnimatedCard Component — Staggered 3D entrance with subtle internal text reveal & re-triggering on scroll
 */
function InsightAnimatedCard({
  number,
  title,
  bodyContent,
  delay = 0,
}: {
  number: string;
  title: string;
  bodyContent: React.ReactNode;
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
      { threshold: 0.15 }
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
      className={`p-8 sm:p-10 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-main)] flex flex-col justify-between transition-all duration-700 ease-out transform-gpu hover:border-purple-500/40 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(168,85,247,0.15)] h-full ${
        isVisible
          ? "opacity-100 translate-y-0 scale-100"
          : "opacity-0 translate-y-12 scale-95"
      }`}
    >
      <div>
        {/* Eyebrow Reveal */}
        <span
          className={`type-eyebrow text-purple-400 font-mono block mb-3 font-bold transition-all duration-500 delay-100 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
          }`}
        >
          {number}
        </span>

        {/* Title Reveal */}
        <h3
          className={`text-xl sm:text-2xl font-bold font-headline text-[var(--text-primary)] mb-4 transition-all duration-700 delay-200 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
          }`}
        >
          {title}
          <span className="tgs-gradient-text">.</span>
        </h3>

        {/* Body Paragraph Subtle Fade & Lift */}
        <div
          className={`type-body text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed font-normal transition-all duration-700 delay-300 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          {bodyContent}
        </div>
      </div>
    </div>
  );
}

/**
 * SubtleCardDrop Component — 3D spring entrance card that re-triggers on scroll
 */
function SubtleCardDrop({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
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
      { threshold: 0.1 }
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
      className={`transition-all duration-700 ease-out transform-gpu ${
        isVisible
          ? "opacity-100 translate-y-0 scale-100"
          : "opacity-0 translate-y-12 scale-95"
      } ${className}`}
    >
      {children}
    </div>
  );
}

/**
 * GlowingStatement Component — Centered statement with 3D lift & seamless radial purple glow blooming behind text
 */
function GlowingStatement({ text, wordToHighlight = "breaks." }: { text: string; wordToHighlight?: string }) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

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
      { threshold: 0.15 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => {
      if (ref.current) observer.unobserve(ref.current);
      if (timer) clearTimeout(timer);
    };
  }, []);

  return (
    <div ref={ref} className="relative inline-block w-full text-center py-6">
      {/* Seamless Soft Radial Ambient Glow (No Box / No Rectangular Edge) */}
      <div
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] sm:w-[700px] h-[300px] rounded-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-600/25 via-pink-600/10 to-transparent blur-[100px] pointer-events-none transition-all duration-1000 transform-gpu ${
          isVisible ? "opacity-100 scale-110" : "opacity-0 scale-90"
        }`}
      />

      {/* Small Top Gradient Line Accent */}
      <div
        className={`w-12 h-[2px] rounded-full tgs-gradient-bg mx-auto mb-6 shadow-[0_0_20px_rgba(168,85,247,0.8)] transition-all duration-700 delay-100 relative z-10 ${
          isVisible ? "opacity-100 scale-100" : "opacity-0 scale-50"
        }`}
      />

      {/* Main Statement text with 3D fade up */}
      <p
        className={`text-2xl sm:text-3xl lg:text-4xl font-extrabold font-headline text-[var(--text-primary)] leading-tight relative z-10 transition-all duration-800 delay-200 transform-gpu ${
          isVisible
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 translate-y-8 scale-95"
        }`}
      >
        {text}{" "}
        <span className="tgs-gradient-text font-black drop-shadow-[0_0_25px_rgba(168,85,247,0.6)]">
          {wordToHighlight}
        </span>
      </p>
    </div>
  );
}

export default function ServicesPage() {
  // 1. System Map Expanded State — All 6 phase nodes OPENED BY DEFAULT per user spec
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({
    "01": true,
    "02": true,
    "03": true,
    "04": true,
    "05": true,
    "06": true,
  });

  // 2. Form Inputs State (Department field removed per spec)
  const [brandName, setBrandName] = useState("");
  const [websiteLink, setWebsiteLink] = useState("");
  const [socialLink, setSocialLink] = useState("");
  const [industry, setIndustry] = useState("Food & Beverage");
  const [customIndustry, setCustomIndustry] = useState("");
  const [whatYouNeed, setWhatYouNeed] = useState("An End-to-End Content System");
  const [bottleneck, setBottleneck] = useState("Our Message Isn't Landing");
  const [timeline, setTimeline] = useState("Immediate (< 1 Month)");

  // 3. Email Gate & Lead Capture State
  const [unlockEmail, setUnlockEmail] = useState("");
  const [isUnlockingAnimation, setIsUnlockingAnimation] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);

  // 4. Generation Sequence States
  const [isGenerating, setIsGenerating] = useState(false);
  const [statusLineIndex, setStatusLineIndex] = useState(0);
  const [activePhaseStep, setActivePhaseStep] = useState(0);
  const [hasCompletedSequence, setHasCompletedSequence] = useState(false);
  const [revealedView, setRevealedView] = useState(false);

  // Status Lines cycling during 10s generation sequence
  const statusMessages = [
    `Reading ${brandName || "your brand"}'s brand...`,
    "Mapping your bottleneck...",
    "Running it against the system...",
    "Finalizing your blueprint...",
  ];

  // Six Phases for loading sequence animation
  const pipelinePhases = [
    "Strategy",
    "Pre-Production",
    "Production",
    "Post-Production",
    "Marketing",
    "Analysis",
  ];

  // Comprehensive Expanded Industry Options
  const industryOptions = [
    "Food & Beverage",
    "Fashion & Apparel",
    "Beauty & Skincare",
    "Health & Wellness / Supplements",
    "Jewelry & Accessories",
    "Home & Furniture",
    "Fitness & Sports",
    "Travel & Hospitality",
    "Pet Brands",
    "Kids & Family",
    "SaaS & Tech / B2B",
    "Personal Brand / Creator",
    "Finance & Fintech",
    "Automotive & Luxury",
    "Electronics & Consumer Hardware",
    "Footwear & Outdoor Gear",
    "Alcohol, Wine & Spirits",
    "Real Estate, Interior & Architecture",
    "Agencies & B2B Services",
    "Hospitality, Dining & Venues",
    "Gaming & Esports",
    "EdTech & Online Courses",
    "Media, Publishing & Entertainment",
    "Web3, AI & DeepTech",
    "Medical, Dental & Specialty Clinics",
    "Mental Health & Wellness Practices",
    "Non-Profit & Social Impact",
    "Other",
  ];

  const whatYouNeedOptions = [
    "An End-to-End Content System",
    "Content Production",
    "Campaign & Ad Design",
    "Not Sure Yet",
  ];

  const bottleneckOptions = [
    "Our Message Isn't Landing",
    "Content Takes Too Long to Make",
    "Our Ads Aren't Performing",
    "Too Many Vendors Not Enough Coordination",
    "Not Sure Something's Just Off",
  ];

  const timelineOptions = [
    "Immediate (< 1 Month)",
    "1–3 Months",
    "Ongoing System Partner",
  ];

  // --- Content Bank Assembled Logic ---

  const getIndustryInsight = (ind: string): string => {
    switch (ind) {
      case "Food & Beverage":
      case "Alcohol, Wine & Spirits":
        return "Food and beverage brands aren't losing to bigger budgets anymore — they're losing to brands that show up as real people instead of ad units. The category is shifting hard toward ingredient transparency and creator-led storytelling, and brands still running separate content, ad, and retail plans read as disconnected the moment a customer looks closely.";
      case "Fashion & Apparel":
      case "Footwear & Outdoor Gear":
      case "Jewelry & Accessories":
        return "Fashion is a consistency game before it's a creativity game. Brands posting daily grow engagement over 2x faster than brands that post in bursts, and a consistent visual identity across channels measurably lifts recall and revenue. Most fashion brands don't have a taste problem — they have a cadence problem.";
      case "Beauty & Skincare":
        return "Beauty audiences reward brands that teach as much as they sell — the accounts winning right now pair trend-relevant, entertaining content with real education, not just product shots. That mix is hard to sustain without a system, which is exactly where most beauty brands stall out.";
      case "Health & Wellness / Supplements":
      case "Medical, Dental & Specialty Clinics":
      case "Mental Health & Wellness Practices":
        return "Wellness is a trust category before it's a content category — physicians and certified professionals are trusted far more than influencers on health claims, which means the brands winning aren't the loudest, they're the most credible. Educational, discovery-driven content consistently outperforms product-first posting here.";
      case "Home & Furniture":
      case "Real Estate, Interior & Architecture":
        return "Home and lifestyle brands compete on feeling as much as function — the visual world a brand builds around a product often matters more than the product page itself. Without a system connecting strategy to what actually gets shot, that world gets inconsistent fast.";
      case "SaaS & Tech / B2B":
      case "Finance & Fintech":
      case "Web3, AI & DeepTech":
      case "Agencies & B2B Services":
        return "Content creation stopped being the hard part for B2B and tech years ago — the real gap is content that actually moves a buyer, and only about a third of teams have anything resembling a repeatable system for making it. The rest are producing ad hoc and wondering why it doesn't compound.";
      case "Personal Brand / Creator":
      case "EdTech & Online Courses":
        return "Personal brands live or die on consistency and trust, not production value alone. The creators actually building businesses, not just followings, are the ones treating content as a system rather than a stream of one-offs — that shift is what separates a following from a business.";
      case "Other":
        return "Whatever the category, the pattern holds: brands that treat strategy, production, and distribution as one connected system outperform brands running them as three separate relationships.";
      default:
        return "The D2C and modern consumer brands actually growing right now aren't running separate content, ad, and retail plans — they're running one system that says the same thing everywhere a customer sees them. Everyone else is competing against that with fragments.";
    }
  };

  const getBottleneckDiagnosis = (btn: string, brand: string): string => {
    const name = brand || "your brand";
    switch (btn) {
      case "Our Message Isn't Landing":
        return `For ${name}, the likely leak point is the handoff between strategy and what actually gets made — a plan that never fully reaches production isn't really a plan, it's a guess.`;
      case "Content Takes Too Long to Make":
        return `For ${name}, the likely leak point is production capacity — sustaining real creative testing takes 15-50+ fresh variants a month at real ad spend, which most in-house or single-vendor setups can't produce without the craft dropping.`;
      case "Our Ads Aren't Performing":
        return `For ${name}, the likely leak point is testing volume — on Meta, only 4-8% of creative tested actually wins, and the average creative fatigues in about 8 days, so accounts that aren't refreshing constantly are running on expired creative more often than they realize.`;
      case "Too Many Vendors Not Enough Coordination":
        return `For ${name}, the likely leak point is exactly what it sounds like — separate vendors for content, ads, and production means the reasoning behind a campaign rarely survives the handoff between them.`;
      case "Not Sure Something's Just Off":
      default:
        return `For ${name}, the likely leak point isn't obvious from the outside either — that's normal, and usually means the gap is systemic rather than any one phase. Worth a real look rather than a guess.`;
    }
  };

  const getWhatYouNeedMapping = (need: string) => {
    switch (need) {
      case "Content Production":
        return {
          tag: "Phase 02-04 (Pre-Production–Post-Production)",
          bullet: "Prioritize Phase 02-04 — treatments, mood boards, and a consistent visual system before chasing volume.",
        };
      case "Campaign & Ad Design":
        return {
          tag: "Phase 01 & Phase 05 (Strategy & Marketing)",
          bullet: "Prioritize Phase 01 & 05 — the campaign idea and its distribution, built by the same team so nothing gets lost between them.",
        };
      case "Not Sure Yet":
        return {
          tag: "Phase 01 (Strategy)",
          bullet: "Start at Phase 01 — a real diagnostic is the fastest way to find out what you actually need first.",
        };
      case "An End-to-End Content System":
      default:
        return {
          tag: "Phase 01 (Strategy) & Phase 06 (Analysis)",
          bullet: "Prioritize all six phases — strategy through analysis, run as one connected system, not six vendors.",
        };
    }
  };

  const getBottleneckTakeaways = (btn: string): [string, string] => {
    switch (btn) {
      case "Our Message Isn't Landing":
        return [
          "Establish a brand & audience diagnostic before any content gets planned (Phase 01).",
          "Connect performance reporting directly back to the original strategy goals (Phase 06).",
        ];
      case "Content Takes Too Long to Make":
        return [
          "Lock treatments and shot lists before production starts, so speed doesn't cost craft (Phase 02).",
          "Build a repeatable production pipeline instead of starting from scratch each time (Phase 03).",
        ];
      case "Our Ads Aren't Performing":
        return [
          "Increase creative variant volume — the data shows most winners come from testing more, not guessing better (Phase 05).",
          "Track performance against strategy, not just spend, to know which variants are actually working (Phase 06).",
        ];
      case "Too Many Vendors Not Enough Coordination":
        return [
          "Consolidate strategy, production, and distribution under one team so nothing gets lost in translation (Phases 01-06).",
          "Assign one dedicated account lead who carries context across every phase (Phase 06).",
        ];
      case "Not Sure Something's Just Off":
      default:
        return [
          "Start with a real brand & audience diagnostic rather than guessing at the fix (Phase 01).",
          "Use the discovery call to actually pinpoint the gap before committing to a direction.",
        ];
    }
  };

  const getHowWeHelpPhases = (btn: string, need: string) => {
    const allPhases: Record<string, { phase: string; desc: string }> = {
      Strategy: {
        phase: "Phase 01 — Strategy",
        desc: "We start with a real read on the brand and audience — not a content calendar, a diagnostic.",
      },
      PreProduction: {
        phase: "Phase 02 — Pre-Production",
        desc: "Every idea gets built out on paper — treatment, mood board, shot list — before a camera turns on.",
      },
      Production: {
        phase: "Phase 03 — Production",
        desc: "Full in-house crew, one craft standard, whether it's a brand film or a week of social content.",
      },
      PostProduction: {
        phase: "Phase 04 — Post-Production",
        desc: "Edit, color, sound, and motion — delivered in every format the campaign actually needs, not reformatted after the fact.",
      },
      Marketing: {
        phase: "Phase 05 — Marketing",
        desc: "Meta ads and AI-generated variants, run by the same team that built the strategy, tracked against it.",
      },
      Analysis: {
        phase: "Phase 06 — Analysis",
        desc: "One dedicated account lead, ongoing reporting, and fast turnaround on whatever comes next.",
      },
    };

    if (btn === "Our Ads Aren't Performing" || need === "Campaign & Ad Design") {
      return [allPhases.Strategy, allPhases.Marketing, allPhases.Analysis];
    }
    if (btn === "Content Takes Too Long to Make" || need === "Content Production") {
      return [allPhases.PreProduction, allPhases.Production, allPhases.PostProduction];
    }
    if (btn === "Our Message Isn't Landing") {
      return [allPhases.Strategy, allPhases.PreProduction, allPhases.Analysis];
    }
    return [allPhases.Strategy, allPhases.Production, allPhases.Marketing];
  };

  // Active Industry Display Value
  const activeIndustryLabel = industry === "Other" ? customIndustry || "Custom Industry" : industry;

  const industryText = getIndustryInsight(activeIndustryLabel);
  const bottleneckText = getBottleneckDiagnosis(bottleneck, brandName);
  const combinedParagraph = `${industryText} ${bottleneckText}`;

  const needObj = getWhatYouNeedMapping(whatYouNeed);
  const btnBullets = getBottleneckTakeaways(bottleneck);
  const takeawaysList = [btnBullets[0], btnBullets[1], needObj.bullet];

  const howWeHelpCards = getHowWeHelpPhases(bottleneck, whatYouNeed);

  // Toggle System Map Phase Node Expand
  const toggleNodeExpand = (num: string) => {
    setExpandedNodes((prev) => ({
      ...prev,
      [num]: prev[num] === false ? true : false,
    }));
  };

  // 10-Second Generation Sequence Handler
  const handleStartGeneration = (e: React.FormEvent) => {
    e.preventDefault();
    if (!brandName.trim()) return;

    setIsGenerating(true);
    setHasCompletedSequence(false);
    setRevealedView(false);
    setIsUnlocked(false);
    setIsUnlockingAnimation(false);
    setStatusLineIndex(0);
    setActivePhaseStep(0);

    // Cycle Status Lines & Phase Accent Steps every 2.5s
    const intervalId = setInterval(() => {
      setStatusLineIndex((prev) => Math.min(prev + 1, statusMessages.length - 1));
      setActivePhaseStep((prev) => (prev + 1) % pipelinePhases.length);
    }, 2500);

    // Exactly 10 Seconds Floor
    setTimeout(() => {
      clearInterval(intervalId);
      setActivePhaseStep(pipelinePhases.length - 1);
      setStatusLineIndex(statusMessages.length - 1);
      setHasCompletedSequence(true);
    }, 10000);
  };

  // Unlock Handler with Lead Capture API & 1.5s Animation Sequence
  const handleUnlockStrategy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!unlockEmail.trim()) return;

    // 1. Capture Lead Payload
    const leadPayload = {
      brandName,
      email: unlockEmail,
      websiteLink,
      socialLink,
      industry: activeIndustryLabel,
      whatYouNeed,
      bottleneck,
      timeline,
      submittedAt: new Date().toISOString(),
    };

    // Save lead in localStorage for local persistence
    try {
      const existing = JSON.parse(localStorage.getItem("tgs_base_strategy_leads") || "[]");
      existing.push(leadPayload);
      localStorage.setItem("tgs_base_strategy_leads", JSON.stringify(existing));
    } catch (err) {
      console.error("Local lead save error:", err);
    }

    // Send lead to server API endpoint silently
    fetch("/api/lead-capture", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(leadPayload),
    }).catch((err) => console.error("Lead API capture error:", err));

    // 2. Trigger Unlocking Animation (1.5 seconds)
    setIsUnlockingAnimation(true);

    setTimeout(() => {
      setIsUnlockingAnimation(false);
      setIsUnlocked(true);
      setRevealedView(true);
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }, 1500);
  };

  // Reset to Services Page Form
  const handleResetToServices = () => {
    setRevealedView(false);
    setIsUnlocked(false);
    setIsGenerating(false);
    setHasCompletedSequence(false);
    setIsUnlockingAnimation(false);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const bookingUrl = `/book?brandName=${encodeURIComponent(
    brandName
  )}&email=${encodeURIComponent(unlockEmail)}&website=${encodeURIComponent(
    websiteLink
  )}&social=${encodeURIComponent(socialLink)}&industry=${encodeURIComponent(
    activeIndustryLabel
  )}&need=${encodeURIComponent(whatYouNeed)}&bottleneck=${encodeURIComponent(
    bottleneck
  )}&timeline=${encodeURIComponent(timeline)}`;

  const phases = [
    {
      number: "01",
      title: "Strategy",
      tagline: "The read on the brand, and the plan that follows from it.",
      icon: Compass,
      bullets: [
        {
          title: "Brand & audience diagnostic",
          desc: "a direct read on where the content is actually falling flat, and why.",
        },
        {
          title: "Content system architecture",
          desc: "the long-term structure the brand runs on, not a one-off plan.",
        },
        {
          title: "Campaign & narrative design",
          desc: "the specific ideas and story arcs that carry the strategy into real production.",
        },
      ],
    },
    {
      number: "02",
      title: "Pre-Production",
      tagline: "Every idea built out before a camera turns on.",
      icon: FileCheck,
      bullets: [
        {
          title: "Treatments & creative direction",
          desc: "the concept locked on paper before it's locked on set.",
        },
        {
          title: "Mood boards & visual references",
          desc: "the exact look, tone, and reference points, agreed before production starts.",
        },
        {
          title: "Shot lists, call sheets & scheduling",
          desc: "the operational groundwork that keeps a shoot day from running on guesswork.",
        },
      ],
    },
    {
      number: "03",
      title: "Production",
      tagline: "Full in-house crew, one craft standard.",
      icon: Camera,
      bullets: [
        {
          title: "Brand films & commercials",
          desc: "the flagship, high-craft work.",
        },
        {
          title: "Social & campaign content",
          desc: "built for volume without dropping the craft bar.",
        },
        {
          title: "On-location and studio production",
          desc: "managed start to finish by the same team that planned it.",
        },
      ],
    },
    {
      number: "04",
      title: "Post-Production",
      tagline: "Where footage becomes the actual asset.",
      icon: Film,
      bullets: [
        {
          title: "Edit, color & sound design",
          desc: "the pass that turns raw footage into a finished piece.",
        },
        {
          title: "Motion graphics & titling",
          desc: "where the brand's visual identity actually shows up on screen.",
        },
        {
          title: "Multi-format delivery",
          desc: "vertical, horizontal, and platform-specific cuts, delivered ready to run, not reformatted after the fact.",
        },
      ],
    },
    {
      number: "05",
      title: "Marketing",
      tagline: "Getting the work in front of the right audience.",
      icon: TrendingUp,
      bullets: [
        {
          title: "Meta ads",
          desc: "media buying & optimization, run in-house by the same team.",
        },
        {
          title: "AI production",
          desc: "faster testing, more variants.",
          link: "/ai-production",
          linkText: "→ explore AI production",
        },
        {
          title: "Performance tracking",
          desc: "measured against the original strategy set in phase one, not a vanity-metrics report.",
        },
      ],
    },
    {
      number: "06",
      title: "Analysis",
      tagline: "One point of contact, for the life of the engagement.",
      icon: LineChart,
      bullets: [
        {
          title: "Dedicated account lead",
          desc: "a single person who knows the brand, not a rotating account team.",
        },
        {
          title: "Ongoing reporting & strategy check-ins",
          desc: "a standing read on what's working and what changes next.",
        },
        {
          title: "Fast turnaround",
          desc: "on revisions and next steps.",
        },
      ],
    },
  ];

  return (
    <div className="flex flex-col min-h-screen pt-20">
      {/* If Result View Revealed & Unlocked — Dedicated Full-Width Blueprint View */}
      {revealedView && isUnlocked ? (
        <div className="animate-fadeIn py-16 sm:py-24 max-w-[1280px] mx-auto px-6 sm:px-8 lg:px-12 text-left">
          {/* Header & Badge Bar */}
          <div className="mb-10 pb-8 border-b border-[var(--border-color)]">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <span className="type-eyebrow text-xs font-mono text-purple-300 bg-purple-950/90 px-4 py-1.5 rounded-full border border-purple-500/40 uppercase tracking-widest">
                {timeline.toUpperCase()}
              </span>
              <span className="type-eyebrow text-xs font-mono text-purple-400 font-bold bg-purple-500/10 px-4 py-1.5 rounded-full border border-purple-500/30">
                🎯 {needObj.tag}
              </span>
            </div>

            {/* Prominent Brand Name Header */}
            <h1 className="type-section-h1 text-[var(--text-primary)] font-bold tracking-tight mb-4 leading-tight">
              {brandName}'s Content System Blueprint<span className="tgs-gradient-text">.</span>
            </h1>
            <p className="type-body text-xs sm:text-sm text-[var(--text-muted)] font-mono">
              Unlocked for: <span className="text-purple-300 font-bold">{unlockEmail}</span> ({activeIndustryLabel})
            </p>
          </div>

          {/* Combined Diagnosis Paragraph */}
          <div className="p-8 sm:p-10 rounded-3xl border border-purple-500/40 bg-[var(--bg-surface)] mb-12 shadow-[0_15px_50px_rgba(168,85,247,0.15)]">
            <span className="type-eyebrow text-purple-400 font-mono tracking-widest uppercase block mb-3">
              SYSTEM DIAGNOSTIC READ
            </span>
            <p className="type-body text-base sm:text-lg text-[var(--text-primary)] leading-relaxed font-normal">
              {combinedParagraph}
            </p>
          </div>

          {/* Recommended System Takeaways (3 Bullets) */}
          <div className="mb-14">
            <h2 className="text-2xl font-bold font-headline text-[var(--text-primary)] mb-6">
              Recommended System Takeaways<span className="tgs-gradient-text">.</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {takeawaysList.map((takeaway, idx) => (
                <div
                  key={idx}
                  className="p-6 sm:p-8 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-main)] text-left flex items-start gap-4"
                >
                  <CheckCircle2 className="w-5 h-5 text-purple-400 flex-shrink-0 mt-1" />
                  <p className="type-body text-xs sm:text-sm text-[var(--text-primary)] leading-relaxed">
                    {takeaway}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Mid-Page CTA */}
          <div className="p-8 rounded-3xl border border-purple-500/30 bg-purple-500/5 mb-16 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-lg sm:text-xl font-bold font-headline text-[var(--text-primary)] mb-1">
                Review this strategy directly with the founder
              </h3>
              <p className="type-body text-xs sm:text-sm text-[var(--text-muted)]">
                Discuss your custom blueprint on a 45-minute discovery call — no pitch, just context.
              </p>
            </div>
            <Button
              href={bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              size="sm"
              variant="primary"
              className="px-7 py-3 text-xs font-extrabold uppercase tracking-widest flex-shrink-0"
            >
              BOOK A CALL
            </Button>
          </div>

          {/* "How We'd Help [Brand Name]" Section */}
          <div className="mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold font-headline text-[var(--text-primary)] mb-8">
              How We'd Help {brandName}<span className="tgs-gradient-text">.</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {howWeHelpCards.map((item, idx) => (
                <div
                  key={idx}
                  className="p-8 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-surface)] text-left"
                >
                  <span className="type-eyebrow text-purple-400 font-mono block mb-2 font-bold">
                    {item.phase}
                  </span>
                  <p className="type-body text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Re-Configure Option (Cleanly Returns to Services Page Form) */}
          <div className="mb-16 text-center">
            <button
              onClick={handleResetToServices}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] text-xs text-[var(--text-muted)] hover:text-white transition-colors cursor-pointer font-mono uppercase"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Configure Another Brand Strategy</span>
            </button>
          </div>

          {/* Closing CTA */}
          <Section className="pt-16 pb-24 border-t border-[var(--border-color)] bg-[var(--bg-main)]">
            <div className="max-w-[1280px] mx-auto grid grid-cols-12 gap-8 items-center text-left">
              <div className="col-span-12 lg:col-span-8">
                <span className="type-eyebrow text-purple-400 font-mono tracking-widest uppercase block mb-3 font-bold">
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
                  href={bookingUrl}
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
      ) : (
        /* Default Services Page Flow */
        <>
          {/* SECTION 1: HERO */}
          <Section className="py-12 sm:py-20 lg:py-24">
            <div className="max-w-[1280px] mx-auto grid grid-cols-12 gap-6 lg:gap-8">
              <div className="col-span-12 lg:col-span-11 text-left space-y-2">
                {/* Eyebrow with Typewriter Animation */}
                <div>
                  <TypewriterText
                    as="span"
                    text="HOW WE THINK ABOUT CONTENT"
                    speed={8}
                    delay={0}
                    className="type-eyebrow text-purple-400 font-mono tracking-widest uppercase font-bold block mb-1.5"
                  />
                </div>

                {/* Title with Typewriter Animation & Tight Gap */}
                <TypewriterText
                  as="h1"
                  text="Most content fails before anyone hits record."
                  speed={10}
                  delay={30}
                  showCursor={true}
                  className="type-section-h1 text-[var(--text-primary)] font-extrabold tracking-tight text-3xl sm:text-5xl lg:text-6xl leading-[1.1] mb-3"
                />

                {/* Collectively 2 Lines Total Description with Typewriter Animation */}
                <div className="pt-1 pb-4 max-w-6xl">
                  <TypewriterText
                    as="p"
                    text="Not from a bad idea, or a bad shoot. From the gap between the people who plan a brand's content and the people who make it. The Gravity Studios closes that gap — one system, one team, from the first strategy conversation to the report that tells you it worked."
                    speed={8}
                    delay={80}
                    className="type-body-large text-[var(--text-muted)] text-base sm:text-lg lg:text-xl leading-relaxed font-normal"
                  />
                </div>

                {/* Instant Scroll Anchor Button */}
                <SubtleFadeIn delay={120} direction="up">
                  <button
                    onClick={() => {
                      document.getElementById("base-strategy-form")?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 text-white text-xs sm:text-sm font-extrabold tracking-widest uppercase hover:scale-[1.02] transition-all shadow-[0_0_35px_rgba(168,85,247,0.4)] cursor-pointer mt-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>CUSTOMIZE YOUR BASE STRATEGY ↓</span>
                  </button>
                </SubtleFadeIn>
              </div>
            </div>
          </Section>

          {/* SECTION 2: THESIS (THREE INSIGHTS) */}
          <Section className="py-20 sm:py-28 bg-[var(--bg-surface)]/60 border-y border-[var(--border-color)]">
            <div className="max-w-[1280px] mx-auto text-left">
              <div className="mb-14">
                <SubtleFadeIn delay={100} direction="down">
                  <span className="type-eyebrow text-purple-400 font-mono tracking-widest uppercase block mb-2 font-bold">
                    THE ARGUMENT
                  </span>
                </SubtleFadeIn>

                <WordByWordTitle text="Why most content doesn't compound." />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
                {/* Insight 01 */}
                <InsightAnimatedCard
                  number="INSIGHT 01"
                  title="The handoff is where it dies"
                  delay={0}
                  bodyContent={
                    <p>
                      A strategy deck can be right and the content can still fail — because by the time it reaches production, the reasoning behind it didn't make the trip. A shot list doesn't know why a campaign exists. When strategy, production, and distribution sit with different people, <strong className="text-[var(--text-primary)] font-bold drop-shadow-[0_0_12px_rgba(168,85,247,0.3)]">that knowledge gets lost at every handoff</strong>, and what ships is a guess dressed up as a plan.
                    </p>
                  }
                />

                {/* Insight 02 */}
                <InsightAnimatedCard
                  number="INSIGHT 02"
                  title="A good video is not the same as a system"
                  delay={150}
                  bodyContent={
                    <p>
                      Any capable production house can make one great piece of content. What most brands are actually missing isn't a great video — it's the second one, and the tenth, built on what the first one taught. <strong className="text-[var(--text-primary)] font-bold drop-shadow-[0_0_12px_rgba(168,85,247,0.3)]">A system remembers. A vendor starts over.</strong>
                    </p>
                  }
                />

                {/* Insight 03 */}
                <InsightAnimatedCard
                  number="INSIGHT 03"
                  title="Consistency is the actual growth lever"
                  delay={300}
                  bodyContent={
                    <p>
                      <strong className="text-[var(--text-primary)] font-bold drop-shadow-[0_0_12px_rgba(168,85,247,0.3)]">The brands that grow aren't the ones with one viral moment.</strong> They're the ones that show up at the same standard, on the same cadence, without reinventing their process every quarter. That's not a creative problem. It's an operating one — which is exactly what a system is built to solve.
                    </p>
                  }
                />
              </div>
            </div>
          </Section>

          {/* NEW SECTION: WHAT WE OFFER (ELEVATED VISUAL & MOTION MOMENT) */}
          <Section className="py-20 sm:py-28 lg:py-36 bg-[var(--bg-main)] relative overflow-hidden border-b border-[var(--border-color)]">
            {/* TECHNICAL ARCHITECTURAL GRID BACKGROUND PATTERN */}
            <div className="absolute inset-0 bg-architectural-grid pointer-events-none z-0 opacity-60" />

            {/* ROTATING SOLAR SYSTEM BACKGROUND ATMOSPHERE */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 flex items-center justify-center">
              {/* Central Glowing Gravity Star Core */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] rounded-full bg-gradient-to-r from-purple-600/25 via-pink-600/25 to-indigo-600/25 blur-[110px] animate-pulse pointer-events-none" />

              {/* Solar System Orbit SVG Container */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1400px] h-[800px] pointer-events-none opacity-35 sm:opacity-45">
                <svg
                  viewBox="0 0 1400 800"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-full h-full"
                >
                  <defs>
                    <linearGradient id="solar-orbit-grad-1" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#a855f7" stopOpacity="0.85" />
                      <stop offset="50%" stopColor="#ec4899" stopOpacity="0.35" />
                      <stop offset="100%" stopColor="#6366f1" stopOpacity="0.75" />
                    </linearGradient>
                    <linearGradient id="solar-orbit-grad-2" x1="100%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#ec4899" stopOpacity="0.75" />
                      <stop offset="50%" stopColor="#818cf8" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#c084fc" stopOpacity="0.85" />
                    </linearGradient>
                    <filter id="solar-glow" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="4" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                  </defs>

                  {/* Concentric Elliptical Orbital Tracks */}
                  {/* Orbit Track 1 (Inner) */}
                  <ellipse
                    cx="700"
                    cy="400"
                    rx="300"
                    ry="140"
                    stroke="url(#solar-orbit-grad-1)"
                    strokeWidth="1.2"
                    strokeDasharray="6 6"
                    className="opacity-70"
                  />

                  {/* Orbit Track 2 (Middle) */}
                  <ellipse
                    cx="700"
                    cy="400"
                    rx="480"
                    ry="220"
                    stroke="url(#solar-orbit-grad-2)"
                    strokeWidth="1.5"
                    className="opacity-80"
                  />

                  {/* Orbit Track 3 (Outer) */}
                  <ellipse
                    cx="700"
                    cy="400"
                    rx="640"
                    ry="290"
                    stroke="url(#solar-orbit-grad-1)"
                    strokeWidth="1"
                    strokeDasharray="12 8"
                    className="opacity-60"
                  />

                  {/* Orbit Track 4 (Far Outer) */}
                  <ellipse
                    cx="700"
                    cy="400"
                    rx="780"
                    ry="350"
                    stroke="url(#solar-orbit-grad-2)"
                    strokeWidth="0.8"
                    strokeDasharray="4 4"
                    className="opacity-40"
                  />

                  {/* Sun / Core Gravity Star Graphic */}
                  <circle cx="700" cy="400" r="14" fill="#c084fc" filter="url(#solar-glow)" opacity="0.9" />
                  <circle cx="700" cy="400" r="6" fill="#ffffff" />
                  <circle cx="700" cy="400" r="30" stroke="#a855f7" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.6" />
                </svg>
              </div>

              {/* Revolving Solar System Planets / Orbiting Nodes */}
              {/* Inner Planet (25s rotation) */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[280px] pointer-events-none animate-[spin_25s_linear_infinite]">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
                  <div className="w-4 h-4 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 shadow-[0_0_20px_#a855f7] border border-white/60" />
                  <div className="absolute w-8 h-8 rounded-full border border-purple-400/40 animate-ping" />
                </div>
              </div>

              {/* Middle Planet with Ring (45s reverse rotation) */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[960px] h-[440px] pointer-events-none animate-[spin_45s_linear_infinite_reverse]">
                <div className="absolute bottom-0 right-1/4 translate-x-1/2 translate-y-1/2 flex items-center justify-center">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-r from-pink-400 to-purple-500 shadow-[0_0_25px_#ec4899] border border-white/80" />
                  {/* Planetary Ring */}
                  <div className="absolute w-10 h-3 rounded-full border border-pink-300/70 rotate-[-25deg]" />
                </div>
              </div>

              {/* Outer Planet (70s rotation) */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1280px] h-[580px] pointer-events-none animate-[spin_70s_linear_infinite]">
                <div className="absolute top-1/3 right-0 translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
                  <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-r from-indigo-400 to-cyan-400 shadow-[0_0_18px_#818cf8] border border-white/70" />
                </div>
              </div>

              {/* Far Outer Particle Node (95s reverse rotation) */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1560px] h-[700px] pointer-events-none animate-[spin_95s_linear_infinite_reverse]">
                <div className="absolute top-1/4 left-0 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-purple-300 shadow-[0_0_15px_#c084fc]" />
                </div>
              </div>
            </div>

            <div className="max-w-[1280px] mx-auto text-left relative z-10 space-y-14">
              {/* Header block */}
              <div>
                <SubtleFadeIn delay={100} direction="down">
                  <span className="type-eyebrow text-purple-400 font-mono tracking-widest uppercase block mb-3 font-bold">
                    OUR CORE PILLARS
                  </span>
                </SubtleFadeIn>

                <WordByWordTitle text="The 4 New-Age Storytelling Engines." />

                <SubtleFadeIn delay={300} direction="up">
                  <p className="type-body-large text-[var(--text-muted)] text-base sm:text-lg max-w-3xl leading-relaxed font-normal mt-4">
                    We replace fragmented single-vendor agencies with four specialized storytelling pillars designed for modern brand building and cinema-grade execution.
                  </p>
                </SubtleFadeIn>
              </div>

              {/* Four Core Storytelling Engine Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
                {/* Engine I */}
                <SubtleCardDrop delay={0}>
                  <div className="group relative p-8 sm:p-10 rounded-3xl border border-purple-500/30 bg-[var(--bg-surface)] hover:border-purple-500/80 transition-all duration-500 hover:-translate-y-2 shadow-2xl hover:shadow-[0_0_50px_rgba(168,85,247,0.35)] flex flex-col justify-between h-full">
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <span className="type-eyebrow text-[11px] font-mono text-purple-400 font-bold uppercase tracking-wider">
                          PILLAR I
                        </span>
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-950/80 border border-purple-500/30 text-[10px] font-mono text-purple-300 font-bold">
                          <Sparkles className="w-3 h-3 text-purple-400" />
                          <span>EXECUTIVE BRANDING</span>
                        </div>
                      </div>

                      <h3 className="text-2xl sm:text-3xl font-extrabold font-headline leading-tight tracking-tight text-[var(--text-primary)] mb-4 group-hover:text-white transition-colors">
                        I. Founder & Executive <span className="tgs-gradient-text font-black drop-shadow-[0_0_20px_rgba(168,85,247,0.7)]">Story Engine</span>
                      </h3>
                      <p className="type-body text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed font-normal mb-6">
                        People buy from people, not logo graphics. We turn founders and CEOs into category icons through narrative brand documentaries, authentic founder vlogs, thought-leadership Reels/Shorts, and origin story films.
                      </p>
                    </div>

                    <ul className="space-y-2.5 pt-6 border-t border-[var(--border-color)]">
                      <li className="flex items-start gap-2.5 text-xs text-[var(--text-primary)] font-medium leading-normal">
                        <CheckCircle2 className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                        <span>Origin story documentaries & brand films</span>
                      </li>
                      <li className="flex items-start gap-2.5 text-xs text-[var(--text-primary)] font-medium leading-normal">
                        <CheckCircle2 className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                        <span>Founder vlogs & executive thought leadership</span>
                      </li>
                    </ul>
                  </div>
                </SubtleCardDrop>

                {/* Engine II */}
                <SubtleCardDrop delay={150}>
                  <div className="group relative p-8 sm:p-10 rounded-3xl border border-purple-500/30 bg-[var(--bg-surface)] hover:border-purple-500/80 transition-all duration-500 hover:-translate-y-2 shadow-2xl hover:shadow-[0_0_50px_rgba(168,85,247,0.35)] flex flex-col justify-between h-full">
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <span className="type-eyebrow text-[11px] font-mono text-purple-400 font-bold uppercase tracking-wider">
                          PILLAR II
                        </span>
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-950/80 border border-purple-500/30 text-[10px] font-mono text-purple-300 font-bold">
                          <Layers className="w-3 h-3 text-purple-400" />
                          <span>CONVERSATIONAL MEDIA</span>
                        </div>
                      </div>

                      <h3 className="text-2xl sm:text-3xl font-extrabold font-headline leading-tight tracking-tight text-[var(--text-primary)] mb-4 group-hover:text-white transition-colors">
                        II. Podcast & Conversational <span className="tgs-gradient-text font-black drop-shadow-[0_0_20px_rgba(168,85,247,0.7)]">Media Studio</span>
                      </h3>
                      <p className="type-body text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed font-normal mb-6">
                        We build full video podcast setups and conversational content engines—directing multi-cam audio/video, crafting storytelling micro-clips, and creating high-impact narrative moments for YouTube, Spotify, and social feeds.
                      </p>
                    </div>

                    <ul className="space-y-2.5 pt-6 border-t border-[var(--border-color)]">
                      <li className="flex items-start gap-2.5 text-xs text-[var(--text-primary)] font-medium leading-normal">
                        <CheckCircle2 className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                        <span>Multi-cam video podcast direction & audio engineering</span>
                      </li>
                      <li className="flex items-start gap-2.5 text-xs text-[var(--text-primary)] font-medium leading-normal">
                        <CheckCircle2 className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                        <span>Storytelling micro-clips for YouTube, Spotify & social</span>
                      </li>
                    </ul>
                  </div>
                </SubtleCardDrop>

                {/* Engine III */}
                <SubtleCardDrop delay={300}>
                  <div className="group relative p-8 sm:p-10 rounded-3xl border border-purple-500/30 bg-[var(--bg-surface)] hover:border-purple-500/80 transition-all duration-500 hover:-translate-y-2 shadow-2xl hover:shadow-[0_0_50px_rgba(168,85,247,0.35)] flex flex-col justify-between h-full">
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <span className="type-eyebrow text-[11px] font-mono text-purple-400 font-bold uppercase tracking-wider">
                          PILLAR III
                        </span>
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-950/80 border border-purple-500/30 text-[10px] font-mono text-purple-300 font-bold">
                          <Camera className="w-3 h-3 text-purple-400" />
                          <span>HIGH-CONCEPT CINEMA</span>
                        </div>
                      </div>

                      <h3 className="text-2xl sm:text-3xl font-extrabold font-headline leading-tight tracking-tight text-[var(--text-primary)] mb-4 group-hover:text-white transition-colors">
                        III. Cinematic Brand <span className="tgs-gradient-text font-black drop-shadow-[0_0_20px_rgba(168,85,247,0.7)]">Launch Campaigns</span>
                      </h3>
                      <p className="type-body text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed font-normal mb-6">
                        For flagship product drops, luxury fashion, automotive, or corporate manifestos. High-concept cinematic films with 4K camera setups, professional color grading, and original sound design to elevate brand valuation.
                      </p>
                    </div>

                    <ul className="space-y-2.5 pt-6 border-t border-[var(--border-color)]">
                      <li className="flex items-start gap-2.5 text-xs text-[var(--text-primary)] font-medium leading-normal">
                        <CheckCircle2 className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                        <span>Flagship product launches, fashion & corporate manifestos</span>
                      </li>
                      <li className="flex items-start gap-2.5 text-xs text-[var(--text-primary)] font-medium leading-normal">
                        <CheckCircle2 className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                        <span>4K cinema camera setups, color grading & sound design</span>
                      </li>
                    </ul>
                  </div>
                </SubtleCardDrop>

                {/* Engine IV */}
                <SubtleCardDrop delay={450}>
                  <div className="group relative p-8 sm:p-10 rounded-3xl border border-purple-500/30 bg-[var(--bg-surface)] hover:border-purple-500/80 transition-all duration-500 hover:-translate-y-2 shadow-2xl hover:shadow-[0_0_50px_rgba(168,85,247,0.35)] flex flex-col justify-between h-full">
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <span className="type-eyebrow text-[11px] font-mono text-purple-400 font-bold uppercase tracking-wider">
                          PILLAR IV
                        </span>
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-950/80 border border-purple-500/30 text-[10px] font-mono text-purple-300 font-bold">
                          <TrendingUp className="w-3 h-3 text-purple-400" />
                          <span>PAID MEDIA CREATIVE</span>
                        </div>
                      </div>

                      <h3 className="text-2xl sm:text-3xl font-extrabold font-headline leading-tight tracking-tight text-[var(--text-primary)] mb-4 group-hover:text-white transition-colors">
                        IV. Story-Driven Performance <span className="tgs-gradient-text font-black drop-shadow-[0_0_20px_rgba(168,85,247,0.7)]">Creative & UGC</span>
                      </h3>
                      <p className="type-body text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed font-normal mb-6">
                        Performance ads that don't look like cheap ads. We take UGC and direct-response formats and inject director-level hook pacing, color correction, and sound design to lower acquisition CAC on Meta & TikTok.
                      </p>
                    </div>

                    <ul className="space-y-2.5 pt-6 border-t border-[var(--border-color)]">
                      <li className="flex items-start gap-2.5 text-xs text-[var(--text-primary)] font-medium leading-normal">
                        <CheckCircle2 className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                        <span>Director-level hook pacing & sound correction</span>
                      </li>
                      <li className="flex items-start gap-2.5 text-xs text-[var(--text-primary)] font-medium leading-normal">
                        <CheckCircle2 className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                        <span>Lower acquisition CAC on Meta & TikTok ad spend</span>
                      </li>
                    </ul>
                  </div>
                </SubtleCardDrop>
              </div>

              {/* THE 4-STEP COLLABORATIVE FILMMAKING METHOD */}
              <div className="pt-16 sm:pt-24 border-t border-[var(--border-color)]">
                <div className="mb-12">
                  <span className="type-eyebrow text-purple-400 font-mono tracking-widest uppercase block mb-3 font-bold text-xs">
                    OUR PROCESS
                  </span>
                  <WordByWordTitle text="The 4-Step Collaborative Filmmaking Method." />
                  <p className="type-body-large text-[var(--text-muted)] text-base sm:text-lg max-w-3xl leading-relaxed font-normal mt-4">
                    How we partner with leadership teams from initial immersion to final distribution masterclass.
                  </p>
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

              {/* Connective Link Below Cards */}
              <div className="text-center pt-4">
                <p className="type-body text-xs sm:text-sm text-[var(--text-muted)] font-mono">
                  Not sure which one fits?{" "}
                  <button
                    onClick={() => {
                      document.getElementById("base-strategy-form")?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="text-purple-400 font-bold hover:underline hover:text-purple-300 transition-colors cursor-pointer"
                  >
                    Run the Base Strategy tool below
                  </button>{" "}
                  and we'll tell you.
                </p>
              </div>
            </div>
          </Section>

          {/* STANDALONE LINE 1 (BETWEEN THESIS/OFFER & TOOL) */}
          <Section className="py-16 sm:py-20 bg-[var(--bg-main)] text-center border-b border-[var(--border-color)] relative z-10">
            <div className="max-w-4xl mx-auto px-6">
              <GlowingStatement
                text="You've read the argument. Now see where your own content"
                wordToHighlight="breaks."
              />
            </div>
          </Section>

          {/* SECTION 3: BUILD YOUR BASE STRATEGY TOOL */}
          <Section id="base-strategy-form" className="py-20 sm:py-28 bg-[var(--bg-surface)] border-b border-[var(--border-color)]">
            <div className="max-w-[1280px] mx-auto text-left space-y-12">
              <div className="max-w-3xl">
                <SubtleFadeIn delay={100} direction="down">
                  <span className="type-eyebrow text-purple-400 font-mono tracking-widest uppercase block mb-2 font-bold">
                    BUILD YOUR BASE STRATEGY
                  </span>
                </SubtleFadeIn>

                <WordByWordTitle text="Select your parameters. Hit enter to generate." />

                <SubtleFadeIn delay={300} direction="up">
                  <p className="type-body text-sm sm:text-base text-[var(--text-muted)] leading-relaxed font-normal mt-4">
                    Two minutes of real inputs, not a lead form. Tell us your industry and where things are actually stuck, and you'll get the same first read we'd open a discovery call with — where your system breaks, and where it should start. No email, no sales call. Just the read.
                  </p>
                </SubtleFadeIn>
              </div>

              {/* 2-COLUMN SPLIT FORM CARD */}
              <SubtleCardDrop delay={150}>
                <div className="p-8 sm:p-12 lg:p-14 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-main)] shadow-2xl space-y-8">
                  <form onSubmit={handleStartGeneration} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                      {/* LEFT COLUMN (PART 1: BRAND IDENTITY & MEDIA) */}
                      <div className="space-y-7">
                        <div className="pb-3 border-b border-[var(--border-color)]">
                          <span className="type-eyebrow text-purple-400 font-mono uppercase font-bold text-xs tracking-wider">
                            PART 1: BRAND IDENTITY & MEDIA
                          </span>
                        </div>

                        {/* Field 1: Brand Name (Required) */}
                        <div>
                          <label className="block type-eyebrow text-[var(--text-muted)] mb-2.5 font-mono uppercase">
                            BRAND NAME <span className="text-purple-400">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            value={brandName}
                            onChange={(e) => setBrandName(e.target.value)}
                            placeholder="e.g. Acquia Athletics"
                            className="w-full px-4 py-3.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.15)] transition-all duration-300 placeholder:text-zinc-600"
                          />
                        </div>

                        {/* Field 2: Website Link (Optional) */}
                        <div>
                          <label className="block type-eyebrow text-[var(--text-muted)] mb-2.5 font-mono uppercase">
                            WEBSITE LINK
                          </label>
                          <div className="relative">
                            <input
                              type="url"
                              value={websiteLink}
                              onChange={(e) => setWebsiteLink(e.target.value)}
                              placeholder="https://yourbrand.com"
                              className="w-full px-4 py-3.5 pl-11 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.15)] transition-all duration-300 placeholder:text-zinc-600"
                            />
                            <Globe className="w-4 h-4 text-purple-400 absolute left-4 top-4 pointer-events-none" />
                          </div>
                        </div>

                        {/* Field 3: Social Media Link / Handle (Optional) */}
                        <div>
                          <label className="block type-eyebrow text-[var(--text-muted)] mb-2.5 font-mono uppercase">
                            SOCIAL MEDIA LINK OR HANDLE
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              value={socialLink}
                              onChange={(e) => setSocialLink(e.target.value)}
                              placeholder="e.g. @yourbrand or instagram.com/yourbrand"
                              className="w-full px-4 py-3.5 pl-11 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.15)] transition-all duration-300 placeholder:text-zinc-600"
                            />
                            <AtSign className="w-4 h-4 text-purple-400 absolute left-4 top-4 pointer-events-none" />
                          </div>
                        </div>

                        {/* Field 4: Industry / Category (Required Dropdown + Custom Input) */}
                        <div>
                          <label className="block type-eyebrow text-[var(--text-muted)] mb-2.5 font-mono uppercase">
                            INDUSTRY / CATEGORY <span className="text-purple-400">*</span>
                          </label>
                          <select
                            value={industry}
                            onChange={(e) => setIndustry(e.target.value)}
                            className="w-full px-4 py-3.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm font-medium focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.15)] transition-all duration-300 cursor-pointer"
                          >
                            {industryOptions.map((opt) => (
                              <option key={opt} value={opt} className="bg-[#0B0B0E] text-white">
                                {opt}
                              </option>
                            ))}
                          </select>

                          {/* If Other -> Show Custom Input */}
                          {industry === "Other" && (
                            <div className="mt-3 animate-fadeIn">
                              <label className="block type-eyebrow text-xs text-purple-400 mb-1.5 font-mono">
                                PLEASE SPECIFY YOUR INDUSTRY <span className="text-purple-400">*</span>
                              </label>
                              <input
                                type="text"
                                required
                                value={customIndustry}
                                onChange={(e) => setCustomIndustry(e.target.value)}
                                placeholder="Specify your industry..."
                                className="w-full px-4 py-3 rounded-xl bg-[var(--bg-surface)] border border-purple-500/50 text-[var(--text-primary)] text-sm focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 transition-all"
                              />
                            </div>
                          )}
                        </div>
                      </div>

                      {/* RIGHT COLUMN (PART 2: BOTTLENECK & OBJECTIVES) */}
                      <div className="space-y-7">
                        <div className="pb-3 border-b border-[var(--border-color)]">
                          <span className="type-eyebrow text-purple-400 font-mono uppercase font-bold text-xs tracking-wider">
                            PART 2: BOTTLENECK & OBJECTIVES
                          </span>
                        </div>

                        {/* Field 5: What You Need (Required Dropdown) */}
                        <div>
                          <label className="block type-eyebrow text-[var(--text-muted)] mb-2.5 font-mono uppercase">
                            WHAT YOU NEED <span className="text-purple-400">*</span>
                          </label>
                          <select
                            value={whatYouNeed}
                            onChange={(e) => setWhatYouNeed(e.target.value)}
                            className="w-full px-4 py-3.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm font-medium focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.15)] transition-all duration-300 cursor-pointer"
                          >
                            {whatYouNeedOptions.map((opt) => (
                              <option key={opt} value={opt} className="bg-[#0B0B0E] text-white">
                                {opt}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Field 6: Current Content Bottleneck (Required Dropdown) */}
                        <div>
                          <label className="block type-eyebrow text-[var(--text-muted)] mb-2.5 font-mono uppercase">
                            CURRENT CONTENT BOTTLENECK <span className="text-purple-400">*</span>
                          </label>
                          <select
                            value={bottleneck}
                            onChange={(e) => setBottleneck(e.target.value)}
                            className="w-full px-4 py-3.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm font-medium focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.15)] transition-all duration-300 cursor-pointer"
                          >
                            {bottleneckOptions.map((opt) => (
                              <option key={opt} value={opt} className="bg-[#0B0B0E] text-white">
                                {opt}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Field 7: Target Timeline & Cadence (Required Dropdown) */}
                        <div>
                          <label className="block type-eyebrow text-[var(--text-muted)] mb-2.5 font-mono uppercase">
                            TARGET TIMELINE & CADENCE <span className="text-purple-400">*</span>
                          </label>
                          <select
                            value={timeline}
                            onChange={(e) => setTimeline(e.target.value)}
                            className="w-full px-4 py-3.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm font-medium focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.15)] transition-all duration-300 cursor-pointer"
                          >
                            {timelineOptions.map((opt) => (
                              <option key={opt} value={opt} className="bg-[#0B0B0E] text-white">
                                {opt}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Centered Form Submit Button & Friction-Reducing Line Across Bottom */}
                    <div className="pt-6 border-t border-[var(--border-color)] flex flex-col items-center">
                      <button
                        type="submit"
                        disabled={isGenerating}
                        className="w-full md:w-2/3 lg:w-1/2 py-4 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 text-white font-extrabold text-xs sm:text-sm tracking-widest uppercase hover:scale-[1.01] transition-all shadow-[0_0_35px_rgba(168,85,247,0.4)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                      >
                        <Sparkles className="w-4 h-4" />
                        <span>{isGenerating ? "Analyzing System..." : "Generate Base Strategy"}</span>
                      </button>
                      {/* Small Centered Friction-Reducing Trust Line */}
                      <p className="text-xs text-[var(--text-muted)] font-mono text-center mt-3.5">
                        Takes about 90 seconds. No email, no sales call — just where your system needs to start.
                      </p>
                    </div>
                  </form>
                </div>
              </SubtleCardDrop>

              {/* SYSTEM DIAGNOSTIC OUTPUT & EMAIL UNLOCK GATE (PREVIEW ANTICIPATION STATE) */}
              <div className="p-8 sm:p-12 rounded-3xl border border-purple-500/40 bg-[var(--bg-main)] shadow-2xl">
                {isGenerating ? (
                  <div className="space-y-8">
                    {/* Status Header */}
                    <div className="flex items-center justify-between pb-6 border-b border-[var(--border-color)]">
                      <div className="flex items-center gap-3">
                        <Loader2 className="w-6 h-6 text-purple-400 animate-spin" />
                        <span className="type-eyebrow text-purple-300 font-mono text-sm sm:text-base uppercase tracking-wider">
                          {statusMessages[statusLineIndex]}
                        </span>
                      </div>
                      <span className="type-eyebrow text-xs font-mono text-purple-400 bg-purple-950 px-3 py-1 rounded-full border border-purple-500/30">
                        DIAGNOSTIC IN PROGRESS
                      </span>
                    </div>

                    {/* Animated Phase Sequence */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                      {pipelinePhases.map((pName, pIdx) => {
                        const isCurrentActive = pIdx === activePhaseStep;
                        const isPastActive = pIdx <= activePhaseStep;
                        return (
                          <div
                            key={pName}
                            className={`p-4 rounded-2xl border text-center transition-all duration-500 flex flex-col items-center justify-center gap-2 ${
                              isCurrentActive
                                ? "border-purple-500 bg-purple-500/20 text-white shadow-[0_0_25px_rgba(168,85,247,0.5)] scale-[1.04]"
                                : isPastActive
                                ? "border-purple-500/40 bg-purple-500/10 text-purple-200"
                                : "border-[var(--border-color)] bg-[var(--bg-surface)]/40 text-zinc-600"
                            }`}
                          >
                            <span className="type-eyebrow text-[11px] font-mono">0{pIdx + 1}</span>
                            <span className="text-xs font-bold font-headline">{pName}</span>
                            {isPastActive && <CheckCircle2 className="w-4 h-4 text-purple-400 mt-1" />}
                          </div>
                        );
                      })}
                    </div>

                    {/* Email Gate Input & 1.5s Unlocking Animation */}
                    {hasCompletedSequence && (
                      <div className="pt-8 border-t border-[var(--border-color)] max-w-xl mx-auto text-center space-y-6 animate-fadeIn">
                        {isUnlockingAnimation ? (
                          /* 1.5-Second Smooth Unlocking Animation View */
                          <div className="p-8 rounded-3xl bg-purple-950/40 border border-purple-500/60 shadow-[0_0_50px_rgba(168,85,247,0.3)] space-y-4 animate-pulse">
                            <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-400 mx-auto flex items-center justify-center text-purple-300">
                              <Unlock className="w-6 h-6 animate-spin" />
                            </div>
                            <h4 className="text-lg font-bold font-headline text-[var(--text-primary)]">
                              Decrypting & Unlocking {brandName}'s Strategy...
                            </h4>
                            <p className="type-body text-xs text-purple-300 font-mono">
                              Capturing lead & formatting your personalized diagnostic...
                            </p>
                            <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                              <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-full w-full animate-pulse" />
                            </div>
                          </div>
                        ) : (
                          /* Email Unlock Gate Card */
                          <>
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-950/80 border border-purple-500/40 text-purple-300 text-xs font-mono">
                              <Lock className="w-3.5 h-3.5 text-purple-400" />
                              <span>STRATEGY BLUEPRINT READY TO UNLOCK</span>
                            </div>

                            <div>
                              <h3 className="text-xl sm:text-2xl font-bold font-headline text-[var(--text-primary)] mb-2">
                                Enter your work email to view {brandName}'s blueprint
                              </h3>
                              <p className="type-body text-xs sm:text-sm text-[var(--text-muted)]">
                                Your diagnostic report and 3 key system takeaways are prepared.
                              </p>
                            </div>

                            <form onSubmit={handleUnlockStrategy} className="space-y-4">
                              <div className="relative">
                                <input
                                  type="email"
                                  required
                                  value={unlockEmail}
                                  onChange={(e) => setUnlockEmail(e.target.value)}
                                  placeholder="name@yourbrand.com"
                                  className="w-full px-5 py-4 pl-12 rounded-2xl bg-[var(--bg-surface)] border border-purple-500/50 text-[var(--text-primary)] text-sm focus:outline-none focus:border-purple-400 shadow-xl transition-all"
                                />
                                <Mail className="w-5 h-5 text-purple-400 absolute left-4 top-4.5 pointer-events-none" />
                              </div>

                              <button
                                type="submit"
                                className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 text-white font-extrabold text-xs sm:text-sm tracking-widest uppercase hover:scale-[1.01] transition-all shadow-[0_0_35px_rgba(168,85,247,0.5)] flex items-center justify-center gap-2 cursor-pointer"
                              >
                                <span>UNLOCK STRATEGY BLUEPRINT →</span>
                              </button>
                            </form>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  /* Initial Preview Anticipation State */
                  <div className="flex flex-col items-center justify-center text-center py-10 px-6 space-y-4">
                    <div className="w-14 h-14 rounded-2xl border border-purple-500/30 bg-purple-500/10 flex items-center justify-center text-purple-400 mb-1">
                      <Layers className="w-7 h-7" />
                    </div>
                    <div>
                      <span className="type-eyebrow text-xs text-purple-400 font-mono tracking-widest uppercase block mb-3 font-bold">
                        WHAT YOU'LL GET
                      </span>
                      <ul className="text-left space-y-2.5 max-w-md mx-auto text-xs sm:text-sm text-[var(--text-primary)] font-medium mb-4">
                        <li className="flex items-center gap-2.5">
                          <span className="text-purple-400 font-bold">•</span> Your primary content bottleneck, named
                        </li>
                        <li className="flex items-center gap-2.5">
                          <span className="text-purple-400 font-bold">•</span> The phase your system should start from
                        </li>
                        <li className="flex items-center gap-2.5">
                          <span className="text-purple-400 font-bold">•</span> What we'd build first, and why
                        </li>
                      </ul>
                      <p className="type-body text-xs text-[var(--text-muted)] font-mono">
                        Fill in both sections above, then hit Generate.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Section>

          {/* SECTION 4: THE SYSTEM MAP */}
          <Section className="py-20 sm:py-28 bg-[var(--bg-main)]">
            <div className="max-w-[1280px] mx-auto text-left">
              <div className="mb-14">
                <SubtleFadeIn delay={100} direction="down">
                  <span className="type-eyebrow text-purple-400 font-mono tracking-widest uppercase block mb-2 font-bold">
                    SYSTEM PIPELINE MAP
                  </span>
                </SubtleFadeIn>

                <WordByWordTitle text="The Connected 6-Phase System." />

                <SubtleFadeIn delay={300} direction="up">
                  <p className="type-body text-sm sm:text-base text-[var(--text-muted)] mt-3 font-normal">
                    Six connected phases, run in-house end-to-end under one team. Click any phase to view details.
                  </p>
                </SubtleFadeIn>
              </div>

              {/* Connected Pipeline Layout */}
              <div className="relative pl-8 sm:pl-12 space-y-6 sm:space-y-8">
                {/* Running Vertical Dotted Thread Line with Ambient Purple Glow */}
                <div className="absolute left-[11px] top-6 bottom-6 w-0 border-l-2 border-dotted border-purple-400/80 shadow-[0_0_15px_rgba(168,85,247,0.7)] pointer-events-none" />

                {phases.map((phase, pIdx) => {
                  const IconComp = phase.icon;
                  const isExpanded = expandedNodes[phase.number] !== false;

                  return (
                    <SubtleCardDrop key={phase.number} delay={pIdx * 80}>
                      <div className="relative transition-all duration-500 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-surface)] hover:border-purple-500/60 shadow-[0_10px_35px_rgba(0,0,0,0.2)]">
                        {/* Pipeline Node Connector Dot Marker — Centered on Dotted Line */}
                        <div className="absolute -left-[33px] sm:-left-[49px] top-8 w-6 h-6 rounded-full border-2 border-purple-400/90 bg-[#0B0B0E] shadow-[0_0_18px_rgba(168,85,247,0.9)] flex items-center justify-center z-10">
                          <div className="w-2.5 h-2.5 rounded-full bg-purple-300 shadow-[0_0_8px_rgba(216,180,254,1)]" />
                        </div>

                        {/* Compact Collapsed Card Header */}
                        <div
                          onClick={() => toggleNodeExpand(phase.number)}
                          className="p-6 sm:p-8 flex items-center justify-between cursor-pointer select-none"
                        >
                          <div className="flex items-center gap-4 sm:gap-6">
                            <span className="text-2xl sm:text-4xl font-extrabold font-headline tgs-gradient-text">
                              {phase.number}
                            </span>
                            <div className="w-10 h-10 rounded-xl border border-purple-500/30 bg-purple-500/10 flex items-center justify-center text-purple-400 flex-shrink-0">
                              <IconComp className="w-5 h-5" />
                            </div>
                            <div>
                              <h3 className="text-xl sm:text-2xl font-bold font-headline text-[var(--text-primary)]">
                                {phase.title}
                              </h3>
                              <p className="type-body text-xs sm:text-sm text-[var(--text-muted)] mt-0.5">
                                {phase.tagline}
                              </p>
                            </div>
                          </div>

                          <button className="w-9 h-9 rounded-xl border border-[var(--border-color)] bg-[var(--bg-main)] flex items-center justify-center text-[var(--text-muted)] hover:text-white transition-colors">
                            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                          </button>
                        </div>

                        {/* Expandable Denser Pointers (Shown on Click) */}
                        {isExpanded && (
                          <div className="px-6 pb-8 sm:px-8 sm:pb-8 pt-2 border-t border-[var(--border-color)] text-left animate-fadeIn">
                            <ul className="space-y-3">
                              {phase.bullets.map((bullet, bIdx) => (
                                <li key={bIdx} className="flex items-start gap-3 text-xs sm:text-sm leading-relaxed text-[var(--text-primary)]">
                                  <CheckCircle2 className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                                  <div>
                                    <strong className="font-bold text-[var(--text-primary)]">
                                      {bullet.title}
                                    </strong>{" "}
                                    — <span className="text-[var(--text-muted)]">{bullet.desc}</span>
                                    {bullet.link && (
                                      <Link
                                        href={bullet.link}
                                        className="ml-2 inline-flex items-center gap-1 text-purple-400 font-mono text-[11px] hover:underline hover:text-purple-300 font-bold"
                                      >
                                        {bullet.linkText}
                                      </Link>
                                    )}
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </SubtleCardDrop>
                  );
                })}
              </div>
            </div>
          </Section>

          {/* STANDALONE LINE 2 */}
          <Section className="py-16 sm:py-20 bg-[var(--bg-surface)] text-center border-t border-[var(--border-color)]">
            <div className="max-w-4xl mx-auto px-6">
              <SubtleFadeIn delay={100} direction="up">
                <p className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-headline text-[var(--text-primary)] leading-relaxed">
                  Every phase above runs under one roof, with one team watching the whole thing — not six vendors comparing notes over <span className="tgs-gradient-text">email.</span>
                </p>
              </SubtleFadeIn>
            </div>
          </Section>

          {/* SECTION 5: CLOSING DISCOVERY CALL CTA SECTION */}
          <Section className="pt-20 sm:pt-28 lg:pt-32 pb-32 sm:pb-40 lg:pb-48 border-t border-[var(--border-color)] bg-[var(--bg-main)]">
            <div className="max-w-[1280px] mx-auto grid grid-cols-12 gap-8 items-center text-left">
              <div className="col-span-12 lg:col-span-8">
                <SubtleFadeIn delay={100} direction="down">
                  <span className="type-eyebrow text-purple-400 font-mono tracking-widest uppercase block mb-3 font-bold">
                    THE NEXT STEP
                  </span>
                </SubtleFadeIn>

                <SubtleFadeIn delay={200} direction="up">
                  <h2 className="type-section-h1 text-[var(--text-primary)] font-extrabold tracking-tight mb-4 text-3xl sm:text-4xl lg:text-5xl">
                    Ready to build your system<span className="tgs-gradient-text">?</span>
                  </h2>
                  <p className="type-body-large text-[var(--text-muted)] text-base sm:text-xl leading-relaxed font-normal">
                    Every engagement starts with a 45-minute discovery call with the founder — strategy, the brand, and what the next steps actually look like. No deck, no pitch. Just the conversation.
                  </p>
                </SubtleFadeIn>
              </div>
              <div className="col-span-12 lg:col-span-4 lg:flex lg:justify-end">
                <SubtleFadeIn delay={300} direction="up">
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
                </SubtleFadeIn>
              </div>
            </div>
          </Section>
        </>
      )}
    </div>
  );
}

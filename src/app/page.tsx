"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useTheme } from "@/context/ThemeContext";
import { Section } from "@/components/Section";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { FounderVisionSection } from "@/components/FounderVisionSection";
import { FaqSection } from "@/components/FaqSection";
import { PlaceholderBadge } from "@/components/PlaceholderBadge";
import {
  VolumeX,
  Volume2,
  ChevronDown,
  ArrowRight,
  Quote,
  ArrowUpRight,
  Target,
  Sparkles,
  Clapperboard,
  Mic,
  TrendingUp,
  Scissors,
  Users,
  ExternalLink,
  PenTool,
  Zap,
  Music,
  Rocket,
  Heart,
} from "lucide-react";

export default function HomePage() {
  const [isMuted, setIsMuted] = useState(true);
  const userMutedRef = useRef(true);
  const [isHeroIdle, setIsHeroIdle] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showreelVideoId] = useState("3KAgsO0guuM");
  const [origin, setOrigin] = useState("");
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);
    }
  }, []);

  // Hero Scroll Observer: Automatically mute sound when scrolling down past hero, unmute when scrolling back
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        const isHeroVisible = entry.isIntersecting;
        if (!isHeroVisible) {
          // Mute sound when user scrolls down past hero
          if (iframeRef.current && iframeRef.current.contentWindow) {
            iframeRef.current.contentWindow.postMessage(
              JSON.stringify({ event: "command", func: "mute", args: [] }),
              "*"
            );
          }
        } else {
          // Unmute sound when user scrolls back to hero (only if user hasn't explicitly muted)
          if (!userMutedRef.current && iframeRef.current && iframeRef.current.contentWindow) {
            iframeRef.current.contentWindow.postMessage(
              JSON.stringify({ event: "command", func: "unMute", args: [] }),
              "*"
            );
            iframeRef.current.contentWindow.postMessage(
              JSON.stringify({ event: "command", func: "setVolume", args: [100] }),
              "*"
            );
          }
        }
      },
      { threshold: 0.2 }
    );

    if (heroRef.current) observer.observe(heroRef.current);
    return () => {
      if (heroRef.current) observer.unobserve(heroRef.current);
    };
  }, []);

  // Re-triggering Scroll Observer State for Section 2 Tagline Animation & Solar Orbit Burst
  const [taglineInView, setTaglineInView] = useState(false);
  const taglineRef = useRef<HTMLDivElement>(null);

  // Random Tag Highlight Interval State (Picks 1 of the 7 agency service tags to highlight every 2.8s)
  const [highlightedTagIndex, setHighlightedTagIndex] = useState<number>(0);

  // Typewriter state for Master Credibility Section
  const [trustText, setTrustText] = useState("");
  const [trustVisible, setTrustVisible] = useState(false);
  const trustRef = useRef<HTMLDivElement>(null);
  const fullTrustText = "Trusted by Ambitious Brands & Category Leaders.";

  const [workVisible, setWorkVisible] = useState(false);
  const workRef = useRef<HTMLDivElement>(null);

  const [fitVisible, setFitVisible] = useState(false);
  const fitRef = useRef<HTMLDivElement>(null);

  const [ctaVisible, setCtaVisible] = useState(false);
  const ctaRef = useRef<HTMLDivElement>(null);

  // Randomly cycle highlighted tag index every 2.8 seconds to naturally draw viewer eyes
  useEffect(() => {
    const interval = setInterval(() => {
      setHighlightedTagIndex(Math.floor(Math.random() * 7));
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  // Scroll listener for hero idle behavior
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Idle Timer for Hero Controls
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const resetIdleTimer = () => {
      setIsHeroIdle(false);
      clearTimeout(timeoutId);
      if (!isScrolled) {
        timeoutId = setTimeout(() => {
          setIsHeroIdle(true);
        }, 3500);
      }
    };

    resetIdleTimer();

    window.addEventListener("mousemove", resetIdleTimer);
    window.addEventListener("mousedown", resetIdleTimer);
    window.addEventListener("keydown", resetIdleTimer);
    window.addEventListener("touchstart", resetIdleTimer);
    window.addEventListener("scroll", resetIdleTimer);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("mousemove", resetIdleTimer);
      window.removeEventListener("mousedown", resetIdleTimer);
      window.removeEventListener("keydown", resetIdleTimer);
      window.removeEventListener("touchstart", resetIdleTimer);
      window.removeEventListener("scroll", resetIdleTimer);
    };
  }, [isScrolled]);

  // Toggle sound without reloading iframe or restarting video timestamp
  const toggleSound = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    const nextMuteState = !isMuted;
    setIsMuted(nextMuteState);
    userMutedRef.current = nextMuteState;

    if (iframeRef.current && iframeRef.current.contentWindow) {
      const win = iframeRef.current.contentWindow;
      const command = nextMuteState ? "mute" : "unMute";

      win.postMessage(JSON.stringify({ event: "command", func: command, args: [] }), "*");
      win.postMessage(JSON.stringify({ event: "command", func: command }), "*");
      win.postMessage(JSON.stringify({ id: 1, method: command }), "*");

      if (!nextMuteState) {
        win.postMessage(JSON.stringify({ event: "command", func: "setVolume", args: [100] }), "*");
        win.postMessage(JSON.stringify({ event: "command", func: "playVideo", args: [] }), "*");
      }
    }
  };

  // Section 2: Re-triggering Scroll Observer (Triggers EVERY TIME user enters Section 2)
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setTaglineInView(entry.isIntersecting);
      },
      { threshold: 0.15 }
    );

    if (taglineRef.current) observer.observe(taglineRef.current);
    return () => {
      if (taglineRef.current) observer.unobserve(taglineRef.current);
    };
  }, []);

  // Section 3: Scroll Observer & Typewriter Effect for Master Credibility Section
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTrustVisible(true);
        } else {
          setTrustVisible(false);
          setTrustText("");
        }
      },
      { threshold: 0.15 }
    );

    if (trustRef.current) observer.observe(trustRef.current);
    return () => {
      if (trustRef.current) observer.unobserve(trustRef.current);
    };
  }, []);

  useEffect(() => {
    if (!trustVisible) return;

    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex <= fullTrustText.length) {
        setTrustText(fullTrustText.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, 35);

    return () => clearInterval(interval);
  }, [trustVisible]);

  // Section 4: Featured Work Header Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setWorkVisible(entry.isIntersecting),
      { threshold: 0.15 }
    );

    if (workRef.current) observer.observe(workRef.current);
    return () => {
      if (workRef.current) observer.unobserve(workRef.current);
    };
  }, []);

  // Section 5: Who It's For Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setFitVisible(entry.isIntersecting),
      { threshold: 0.15 }
    );

    if (fitRef.current) observer.observe(fitRef.current);
    return () => {
      if (fitRef.current) observer.unobserve(fitRef.current);
    };
  }, []);

  // Section 6: Final CTA Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setCtaVisible(entry.isIntersecting),
      { threshold: 0.15 }
    );

    if (ctaRef.current) observer.observe(ctaRef.current);
    return () => {
      if (ctaRef.current) observer.unobserve(ctaRef.current);
    };
  }, []);

  const { theme } = useTheme();

  // 6th & 7th Logos: Tata Cliq Luxury & Hero Motors + Jumbled Mix with per-logo visual scaling
  const clientLogos = [
    { id: "15repmax", name: "15RepMax", darkLogo: "/client-logos/dark/15RepMax - Dark Version.png", lightLogo: "/client-logos/light/15RepMax - Light Version.png", scale: "scale-[1.4]" },
    { id: "ad-nib", name: "AD NIB", darkLogo: "/client-logos/dark/AD NIB - Dark Version.png", lightLogo: "/client-logos/light/AD NIB - Light Version.png", scale: "scale-[1.45]" },
    { id: "ananth-anand", name: "ANANTH ANAND", isText: true },
    { id: "conscious-food", name: "Conscious Food", darkLogo: "/client-logos/dark/Conscious Food - Dark Version.png", lightLogo: "/client-logos/light/Conscious Food - Light Version.png", scale: "scale-[1.4]" },
    { id: "ciscon", name: "Ciscon", darkLogo: "/client-logos/dark/CIscon - Dark Version.png", lightLogo: "/client-logos/light/Ciscon - Light Version.png", scale: "scale-[1.45]" },
    
    // 6th & 7th LOGOS AS REQUESTED BY USER
    { id: "tata-cliq", name: "Tata Cliq Luxury", darkLogo: "/client-logos/dark/Tata Cliq Luxury - Dark Version.png", lightLogo: "/client-logos/light/Tata Cliq Luxury - Light Version.png", scale: "scale-[1.55]" },
    { id: "hero-motors", name: "Hero Motors", darkLogo: "/client-logos/dark/Hero Motors - Dark Version.png", lightLogo: "/client-logos/light/Hero Motors - Light Version.png", scale: "scale-[1.8]" },
    
    // Interleaved mix of remaining client logos & text-based brands
    { id: "fabgehna", name: "FABGEHNA", isText: true },
    { id: "crossfit", name: "Crossfit Culture", darkLogo: "/client-logos/dark/Crossfit - Dark Version.png", lightLogo: "/client-logos/light/Crossfit - Light Version.png", scale: "scale-[1.5]" },
    { id: "digibeast", name: "Digibeast", darkLogo: "/client-logos/dark/Digibeast - Dark Version.png", lightLogo: "/client-logos/light/Digitbeast - Light Version.png", scale: "scale-[1.45]" },
    { id: "rajshree-builders", name: "RAJSHREE BUILDERS", isText: true },
    { id: "eurotrend", name: "Eurotrend", darkLogo: "/client-logos/dark/Eurotrend - Dark Version.png", lightLogo: "/client-logos/light/Eurotrend - Light Version.png", scale: "scale-[1.4]" },
    { id: "fitness-den", name: "Fitness Den", darkLogo: "/client-logos/dark/Fitness Den - Dark Version.png", lightLogo: "/client-logos/light/Fitness Den - Light Version.png", scale: "scale-[1.4]" },
    { id: "riddhi-khosla-jalan", name: "RIDDHI KHOSLA JALAN", isText: true },
    { id: "genoa", name: "Genoa", darkLogo: "/client-logos/dark/Genoa - Dark Version.png", lightLogo: "/client-logos/light/Genoa - Light Version.png", scale: "scale-[1.9]" },
    { id: "humming-bird", name: "Humming Bird", darkLogo: "/client-logos/dark/Humming Bird - Dark Version.png", lightLogo: "/client-logos/light/Humming Bird - Light Version.png", scale: "scale-[1.05]" }, // Baseline Humming Bird!
    { id: "the-testing-academy", name: "THE TESTING ACADEMY", isText: true },
    { id: "maverick-media", name: "Maverick Media", darkLogo: "/client-logos/dark/Maverick Media - Dark Version.png", lightLogo: "/client-logos/light/Maverick Media - Light Version.png", scale: "scale-[1.4]" },
    { id: "mystic-mann", name: "Mystic Mann", darkLogo: "/client-logos/dark/Mystic Mann - Dark Version.png", lightLogo: "/client-logos/light/Mystic Mann - Light Version.png", scale: "scale-[1.85]" },
    { id: "sakshisayys", name: "SAKSHISAYYS", isText: true },
    { id: "natural-veneers", name: "Natural Veneers", darkLogo: "/client-logos/dark/Natural Veneers - Dark Version.png", lightLogo: "/client-logos/light/Natural Veneers - Light Version.png", scale: "scale-[1.45]" },
    { id: "robinhood-army", name: "Robinhood Army", darkLogo: "/client-logos/dark/Robinhood Army - Dark Version.png", lightLogo: "/client-logos/light/Robinhood Army - Light Version.png", scale: "scale-[1.45]" },
    { id: "shalina-gupta", name: "SHALINA GUPTA", isText: true },
    { id: "sasha-rj", name: "Sasha RJ", darkLogo: "/client-logos/dark/SashaRJ - Dark Version.png", lightLogo: "/client-logos/light/SashaRj - Light Version.png", scale: "scale-[1.75]" },
    { id: "somaiya", name: "Somaiya", darkLogo: "/client-logos/dark/Somaiya - Dark Version.png", lightLogo: "/client-logos/light/Somaiya - Light Version.png", scale: "scale-[1.5]" },
    { id: "baithack-india", name: "BAITHACK INDIA", isText: true },
    { id: "ultimo", name: "Ultimo", darkLogo: "/client-logos/dark/Ultimo - Dark Version.png", lightLogo: "/client-logos/light/Ultimo - Light Version.png", scale: "scale-[1.4]" },
    { id: "wingman", name: "Wingman", darkLogo: "/client-logos/dark/Wingman - Dark Version.png", lightLogo: "/client-logos/light/Wingman - Light Version.png", scale: "scale-[1.45]" },
  ];

  const logosLine1 = clientLogos.slice(0, Math.ceil(clientLogos.length / 2));
  const logosLine2 = clientLogos.slice(Math.ceil(clientLogos.length / 2));

  const marqueeLogosLine1 = [...logosLine1, ...logosLine1];
  const marqueeLogosLine2 = [...logosLine2, ...logosLine2];

  // Testimonials array — strictly Quote Icon, Testimonial Text, Name, and Role/Company
  const testimonials = [
    {
      id: "quote-1",
      quote: "Prameet and his team have been in this game for years it shows. They know exactly what they're doing, and you can feel that experience in every step of the process.",
      author: "Vivek Sevra",
      title: "Digibeast",
      company: "Digibeast",
    },
    {
      id: "quote-2",
      quote: "It's been an absolute pleasure, and I'd love to work together again. I told Zoebb the same thing you're a rare breed in this industry: professional, efficient, responsive, and punctual, every single time.",
      author: "Ramona Arena",
      title: "Creator",
      company: "Creator",
    },
    {
      id: "quote-3",
      quote: "One-of-a-kind people. They came in fast and got straight to work and once the campaign was done, the impact was undeniable. Our board members and the entire team were genuinely impressed.",
      author: "Vivek Kumar",
      title: "Hero Motors",
      company: "Hero Motors",
    },
    {
      id: "quote-4",
      quote: "Their approach to curating and putting things together was unlike anything I'd worked with before and it got me real results.",
      author: "Ananth Anand",
      title: "Professor",
      company: "Professor",
    },
    {
      id: "quote-5",
      quote: "We've been working together for years now, and somehow every single piece they make still feels fresh and exciting. It's brought real results to the company, consistently.",
      author: "Himanshu Sancheti",
      title: "Eurotrend",
      company: "Eurotrend",
    },
    {
      id: "quote-6",
      quote: "The results speak for themselves this is the kind of return that makes you stop shopping around for other studios.",
      author: "Akash Gelda",
      title: "Ultimo",
      company: "Ultimo",
    },
    {
      id: "quote-7",
      quote: "We've seen insane results working with them. I've also watched Prameet's own journey from freelancing to building this into what it is today and that growth shows in the level of work they deliver now.",
      author: "Monil Parikh",
      title: "Mystic Mann",
      company: "Mystic Mann",
    },
    {
      id: "quote-8",
      quote: "The conceptualization and the teamwork these guys bring to the table is insane. You don't see that combination often.",
      author: "Rakesh Ranjan",
      title: "Sound Designer",
      company: "Sound Designer",
    },
    {
      id: "quote-9",
      quote: "Working with The Gravity Studios changed how we think about content entirely it's not just a video anymore, it's a system that keeps working for the brand long after the shoot wraps.",
      author: "Chintan Turakhi",
      title: "Natural Veneers",
      company: "Natural Veneers",
    },
    {
      id: "quote-10",
      quote: "What impressed us most wasn't a single video it was realizing they'd built us an entire content system. Strategy, production, everything connected, everything on time. That's rare.",
      author: "Sweety Agarwal & Sunidhi Goel",
      title: "Humming Bird",
      company: "Humming Bird",
    },
    {
      id: "quote-11",
      quote: "They actually understood the market before we even got into production where the sound needed to sit, who it was for, what would land. That kind of insight is hard to find outside the label system.",
      author: "SashaRJ",
      title: "Music Producer",
      company: "Music Producer",
    },
    {
      id: "quote-12",
      quote: "They understood exactly what we needed almost immediately, and the execution matched that understanding start to finish. Nothing got lost between the plan and what actually got delivered.",
      author: "Preeti",
      title: "Somaiya University",
      company: "Somaiya University",
    },
    {
      id: "quote-13",
      quote: "The conceptualization alone told me I was working with people who think like filmmakers, not just a production house. That's rare to find, and it changes everything about how a project turns out.",
      author: "Anuj Gulati",
      title: "Film Director",
      company: "Film Director",
    },
    {
      id: "quote-14",
      quote: "The production value alone caught me off guard this wasn't the usual creator-content setup. It felt like a proper film shoot, and it showed in the final result.",
      author: "Sakshi Parab",
      title: "Creator",
      company: "Creator",
    },
  ];

  const marqueeTestimonials = [...testimonials, ...testimonials];

  const headlineWords = [
    { text: "We", highlight: false },
    { text: "Build", highlight: false },
    { text: "Content", highlight: true },
    { text: "Systems", highlight: true },
    { text: "that", highlight: false },
    { text: "grow", highlight: false },
    { text: "brands.", highlight: false },
  ];

  // Ultra-Minimal Case Studies Array
  const featuredWork = [
    {
      id: "fp-1",
      client: "CONSCIOUS FOOD",
      brandName: "CONSCIOUS FOOD",
      department: "Full Production",
      category: "Full Production",
      videoUrl: "",
    },
    {
      id: "wcs-1",
      client: "THE PRED EDIT / HUMMING BIRD",
      brandName: "HUMMING BIRD",
      department: "Whole Content Systems",
      category: "Whole Content Systems",
      videoUrl: "",
    },
    {
      id: "cc-1",
      client: "PSA - EVERY BITE MATTERS",
      brandName: "EVERY BITE MATTERS",
      department: "Commercials/Campaigns",
      category: "Commercials/Campaigns",
      videoUrl: "",
    },
    {
      id: "mv-1",
      client: "BEFORE THE FALL (PRMT 1.0)",
      brandName: "PRMT",
      department: "Music Videos",
      category: "Music Videos",
      videoUrl: "",
    },
    {
      id: "flm-1",
      client: "OUTFLOW",
      brandName: "OUTFLOW",
      department: "Films",
      category: "Films",
      videoUrl: "",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. SECTION 01: FULL-VIEWPORT HERO SHOWREEL VIDEO (TEMPORARILY REMOVED AS REQUESTED — READY TO RESTORE ANYTIME) */}
      {/*
      <section ref={heroRef} className="relative w-full h-screen h-[100vh] h-[100svh] min-h-[600px] overflow-hidden flex items-center justify-center bg-black select-none">
        <div className="absolute inset-0 z-0 w-full h-full overflow-hidden pointer-events-none flex items-center justify-center">
          <iframe
            ref={iframeRef}
            src={`https://www.youtube-nocookie.com/embed/${showreelVideoId}?autoplay=1&mute=1&playsinline=1&loop=1&playlist=${showreelVideoId}&controls=0&disablekb=1&fs=0&iv_load_policy=3&modestbranding=1&rel=0&enablejsapi=1${origin ? `&origin=${encodeURIComponent(origin)}` : ""}`}
            title="The Gravity Studios Showreel"
            allow="accelerometer; autoplay *; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-[100vw] h-[56.25vw] min-h-[100vh] min-w-[177.77vh] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 object-cover pointer-events-none"
            style={{ border: 0 }}
          />
        </div>

        <div className="absolute bottom-8 right-6 sm:bottom-10 sm:right-8 z-20 transition-all duration-300">
          <button
            onClick={toggleSound}
            aria-label={isMuted ? "Unmute video sound" : "Mute video sound"}
            className="flex items-center gap-2 px-4 py-2.5 sm:px-5 sm:py-3 rounded-full backdrop-blur-md bg-purple-950/80 border border-purple-500/50 text-white hover:bg-purple-900/90 transition-all duration-300 shadow-[0_0_25px_rgba(168,85,247,0.5)] cursor-pointer select-none group"
          >
            {isMuted ? (
              <>
                <VolumeX className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
                <span className="type-eyebrow text-xs font-mono font-bold tracking-wider text-purple-300">SOUND OFF</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4 text-emerald-400 animate-pulse group-hover:scale-110 transition-transform" />
                <span className="type-eyebrow text-xs font-mono font-bold tracking-wider text-emerald-300">SOUND ON</span>
              </>
            )}
          </button>
        </div>

        <div
          className={`absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1 transition-all duration-700 ease-in-out ${
            !isScrolled && isHeroIdle
              ? "opacity-0 pointer-events-none"
              : "opacity-80 hover:opacity-100"
          }`}
        >
          <span className="type-eyebrow text-[9px] sm:text-[10px] tracking-[0.15em] text-white/90">SCROLL</span>
          <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white/90 animate-bounce-slow" />
        </div>
      </section>
      */}

      {/* 2. SECTION 02: FULL-VIEWPORT TAGLINE STATEMENT WITH 100% VIBRANT FULL OPACITY REVOLVING TAGS */}
      <section className="relative min-h-[100vh] w-full flex flex-col justify-center items-center pt-32 pb-12 sm:pt-44 sm:pb-16 bg-[var(--bg-main)] transition-colors duration-500 overflow-hidden select-none">
        
        {/* EXPANSIVE CIRCULAR AGENCY SOLAR SYSTEM GRAVITY ORBIT UNIVERSE BACKGROUND (100% Crisp Full Opacity) */}
        <div
          className={`absolute inset-0 z-0 pointer-events-none flex items-center justify-center overflow-hidden transition-all duration-1000 ease-out transform ${
            taglineInView ? "scale-100 opacity-100" : "scale-40 opacity-0"
          }`}
          style={{
            transform: taglineInView ? "translateY(2rem) scale(1)" : "translateY(2rem) scale(0.4)",
          }}
        >
          {/* Central Gravity Core Radial Nucleus Glow */}
          <div
            className={`w-[550px] h-[550px] sm:w-[850px] sm:h-[850px] rounded-full bg-purple-600/15 dark:bg-purple-600/15 light:bg-purple-500/20 blur-[140px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-1000 ${
              taglineInView ? "scale-100 opacity-100" : "scale-50 opacity-0"
            }`}
          />

          {/* Inner Circular Orbit Ring (Diameter 620px) — WE WRITE IT & WE LIGHT IT */}
          <div className="absolute w-[440px] h-[440px] sm:w-[620px] sm:h-[620px] rounded-full border border-purple-500/25 dark:border-purple-500/30 light:border-purple-600/40 animate-spin-ultra-slow">
            {/* Planet Node 0: WE WRITE IT */}
            <div
              className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 px-3.5 py-1.5 rounded-full border transition-all duration-700 backdrop-blur-md text-[10px] sm:text-xs font-mono whitespace-nowrap ${
                highlightedTagIndex === 0
                  ? "scale-110 ring-2 ring-indigo-400 border-indigo-400 bg-indigo-900 text-white shadow-[0_0_35px_rgba(99,102,241,0.85)] z-30"
                  : "border-indigo-500/40 light:border-indigo-400 bg-indigo-950/90 dark:bg-indigo-950/90 light:bg-indigo-100/95 text-indigo-200 dark:text-indigo-200 light:text-indigo-900 shadow-[0_0_25px_rgba(99,102,241,0.4)]"
              }`}
            >
              <PenTool className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${highlightedTagIndex === 0 ? "text-white animate-bounce" : "text-indigo-400 dark:text-indigo-400 light:text-indigo-700 animate-pulse"}`} />
              <span className="animate-text-blink font-bold">WE WRITE IT</span>
            </div>
            {/* Planet Node 1: WE LIGHT IT */}
            <div
              className={`absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 flex items-center gap-2 px-3.5 py-1.5 rounded-full border transition-all duration-700 backdrop-blur-md text-[10px] sm:text-xs font-mono whitespace-nowrap ${
                highlightedTagIndex === 1
                  ? "scale-110 ring-2 ring-amber-400 border-amber-400 bg-amber-900 text-white shadow-[0_0_35px_rgba(245,158,11,0.85)] z-30"
                  : "border-amber-500/40 light:border-amber-400 bg-amber-950/90 dark:bg-amber-950/90 light:bg-amber-100/95 text-amber-200 dark:text-amber-200 light:text-amber-900 shadow-[0_0_25px_rgba(245,158,11,0.4)]"
              }`}
            >
              <Zap className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${highlightedTagIndex === 1 ? "text-white animate-bounce" : "text-amber-400 dark:text-amber-400 light:text-amber-700 animate-pulse"}`} />
              <span className="animate-text-blink font-bold">WE LIGHT IT</span>
            </div>
          </div>

          {/* Middle Circular Orbit Ring (Diameter 920px) — WE SHOOT IT & WE SCORE IT */}
          <div className="absolute w-[660px] h-[660px] sm:w-[920px] sm:h-[920px] rounded-full border border-purple-500/20 dark:border-purple-500/20 light:border-purple-600/30 animate-spin-reverse-ultra-slow">
            {/* Planet Node 2: WE SHOOT IT */}
            <div
              className={`absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 px-3.5 py-1.5 rounded-full border transition-all duration-700 backdrop-blur-md text-[10px] sm:text-xs font-mono whitespace-nowrap ${
                highlightedTagIndex === 2
                  ? "scale-110 ring-2 ring-red-400 border-red-400 bg-red-900 text-white shadow-[0_0_35px_rgba(239,68,68,0.85)] z-30"
                  : "border-red-500/40 light:border-red-400 bg-red-950/90 dark:bg-red-950/90 light:bg-red-100/95 text-red-200 dark:text-red-200 light:text-red-900 shadow-[0_0_25px_rgba(239,68,68,0.4)]"
              }`}
            >
              <Clapperboard className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${highlightedTagIndex === 2 ? "text-white animate-bounce" : "text-red-400 dark:text-red-400 light:text-red-700 animate-pulse"}`} />
              <span className="animate-text-blink font-bold">WE SHOOT IT</span>
            </div>
            {/* Planet Node 3: WE SCORE IT */}
            <div
              className={`absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 flex items-center gap-2 px-3.5 py-1.5 rounded-full border transition-all duration-700 backdrop-blur-md text-[10px] sm:text-xs font-mono whitespace-nowrap ${
                highlightedTagIndex === 3
                  ? "scale-110 ring-2 ring-emerald-400 border-emerald-400 bg-emerald-900 text-white shadow-[0_0_35px_rgba(16,185,129,0.85)] z-30"
                  : "border-emerald-500/40 light:border-emerald-400 bg-emerald-950/90 dark:bg-emerald-950/90 light:bg-emerald-100/95 text-emerald-200 dark:text-emerald-200 light:text-emerald-900 shadow-[0_0_25px_rgba(16,185,129,0.4)]"
              }`}
            >
              <Music className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${highlightedTagIndex === 3 ? "text-white animate-bounce" : "text-emerald-400 dark:text-emerald-400 light:text-emerald-700 animate-pulse"}`} />
              <span className="animate-text-blink font-bold">WE SCORE IT</span>
            </div>
          </div>

          {/* Outer Circular Orbit Ring (Diameter 1220px) — WE CUT IT, WE LAUNCH IT & WE MAKE THEM FEEL IT */}
          <div className="absolute w-[880px] h-[880px] sm:w-[1220px] sm:h-[1220px] rounded-full border border-purple-500/15 dark:border-purple-500/15 light:border-purple-600/25 animate-spin-ultra-slow">
            {/* Planet Node 4: WE CUT IT */}
            <div
              className={`absolute top-[14.6%] right-[14.6%] translate-x-1/2 -translate-y-1/2 flex items-center gap-2 px-3.5 py-1.5 rounded-full border transition-all duration-700 backdrop-blur-md text-[10px] sm:text-xs font-mono whitespace-nowrap ${
                highlightedTagIndex === 4
                  ? "scale-110 ring-2 ring-cyan-400 border-cyan-400 bg-cyan-900 text-white shadow-[0_0_35px_rgba(6,182,212,0.85)] z-30"
                  : "border-cyan-500/40 light:border-cyan-400 bg-cyan-950/90 dark:bg-cyan-950/90 light:bg-cyan-100/95 text-cyan-200 dark:text-cyan-200 light:text-cyan-900 shadow-[0_0_25px_rgba(6,182,212,0.4)]"
              }`}
            >
              <Scissors className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${highlightedTagIndex === 4 ? "text-white animate-bounce" : "text-cyan-400 dark:text-cyan-400 light:text-cyan-700 animate-pulse"}`} />
              <span className="animate-text-blink font-bold">WE CUT IT</span>
            </div>
            {/* Planet Node 5: WE LAUNCH IT */}
            <div
              className={`absolute bottom-[14.6%] left-[14.6%] -translate-x-1/2 translate-y-1/2 flex items-center gap-2 px-3.5 py-1.5 rounded-full border transition-all duration-700 backdrop-blur-md text-[10px] sm:text-xs font-mono whitespace-nowrap ${
                highlightedTagIndex === 5
                  ? "scale-110 ring-2 ring-pink-400 border-pink-400 bg-pink-900 text-white shadow-[0_0_35px_rgba(236,72,153,0.85)] z-30"
                  : "border-pink-500/40 light:border-pink-400 bg-pink-950/90 dark:bg-pink-950/90 light:bg-pink-100/95 text-pink-200 dark:text-pink-200 light:text-pink-900 shadow-[0_0_25px_rgba(236,72,153,0.4)]"
              }`}
            >
              <Rocket className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${highlightedTagIndex === 5 ? "text-white animate-bounce" : "text-pink-400 dark:text-pink-400 light:text-pink-700 animate-pulse"}`} />
              <span className="animate-text-blink font-bold">WE LAUNCH IT</span>
            </div>
            {/* Planet Node 6: WE MAKE THEM FEEL IT */}
            <div
              className={`absolute top-[14.6%] left-[14.6%] -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 px-3.5 py-1.5 rounded-full border transition-all duration-700 backdrop-blur-md text-[10px] sm:text-xs font-mono whitespace-nowrap ${
                highlightedTagIndex === 6
                  ? "scale-110 ring-2 ring-violet-400 border-violet-400 bg-violet-900 text-white shadow-[0_0_35px_rgba(139,92,246,0.85)] z-30"
                  : "border-violet-500/40 light:border-violet-400 bg-violet-950/90 dark:bg-violet-950/90 light:bg-violet-100/95 text-violet-200 dark:text-violet-200 light:text-violet-900 shadow-[0_0_25px_rgba(139,92,246,0.4)]"
              }`}
            >
              <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${highlightedTagIndex === 6 ? "text-white animate-bounce" : "text-violet-400 dark:text-violet-400 light:text-violet-700 animate-pulse"}`} />
              <span className="animate-text-blink font-bold">WE MAKE THEM FEEL IT</span>
            </div>
          </div>
        </div>

        {/* Fine Small Grid Overlay — Dual Theme Adaptive Contrast (Dark: White Grid, Light: Dark Grid) */}
        <div
          className="absolute inset-0 z-0 pointer-events-none opacity-[0.05] dark:opacity-[0.05] light:opacity-[0.12] bg-[linear-gradient(to_right,var(--border-color)_1px,transparent_1px),linear-gradient(to_bottom,var(--border-color)_1px,transparent_1px)] bg-[size:2rem_2rem]"
          style={{
            maskImage: "radial-gradient(circle at 50% 45%, transparent 30%, black 90%)",
            WebkitMaskImage: "radial-gradient(circle at 50% 45%, transparent 30%, black 90%)",
          }}
        />

        {/* Smooth Gradient Mask to Bleed Seamlessly Down into Section 3 Logo Section */}
        <div className="absolute bottom-0 left-0 right-0 h-28 sm:h-36 bg-gradient-to-b from-transparent via-[var(--bg-main)]/80 to-[var(--bg-main)] z-10 pointer-events-none" />

        <div ref={taglineRef} className="relative z-20 max-w-[1280px] mx-auto px-6 sm:px-8 lg:px-12 w-full flex flex-col items-center text-center pt-12 sm:pt-20">
          {/* Tagline Headline — Brand New Hero Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold font-headline tracking-tight leading-[1.15] sm:leading-[1.12] text-[var(--text-primary)] max-w-5xl mb-6 sm:mb-8 transition-all duration-700 ease-out">
            We turn your brand into a <span className="tgs-gradient-text font-black tracking-tight drop-shadow-[0_0_30px_rgba(198,16,189,0.4)]">cinematic world</span> you haven't imagined<span className="tgs-gradient-text">.</span>
          </h1>

          {/* Subhead — Founded by Whistling Woods Directors */}
          <p
            className={`type-body-large text-[var(--text-muted)] font-normal text-center max-w-4xl mb-8 sm:mb-10 leading-relaxed text-sm sm:text-lg lg:text-xl transition-all duration-1000 ease-out ${
              taglineInView ? "opacity-100 translate-y-0 delay-300" : "opacity-0 translate-y-4 delay-0"
            }`}
          >
            Founded by Whistling Woods film directors. We combine cinema-grade storytelling, high-concept production, and new-age media engines — run by one accountable studio.
          </p>

          {/* Dual Action CTAs */}
          <div
            className={`flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto transition-all duration-1000 ease-out ${
              taglineInView ? "opacity-100 translate-y-0 delay-500" : "opacity-0 translate-y-4 delay-0"
            }`}
          >
            <Button href="/book" target="_blank" rel="noopener noreferrer" size="sm" variant="primary" className="w-full sm:w-auto px-8 py-3.5 text-xs sm:text-sm font-extrabold tracking-widest uppercase shadow-[0_0_25px_rgba(168,85,247,0.4)]">
              BOOK A CALL
            </Button>
            <Button href="/work" size="sm" variant="secondary" className="w-full sm:w-auto px-8 py-3.5 text-xs sm:text-sm font-extrabold tracking-widest uppercase">
              SEE THE WORK
            </Button>
          </div>
        </div>
      </section>

      {/* 3. SECTION 03: CLIENTS WE'VE WORKED WITH (2 FLOATING LOGO MARQUEE LINES) */}
      <section className="w-full flex flex-col justify-center py-16 sm:py-24 border-b border-[var(--border-color)] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-950/15 via-[var(--bg-main)] to-[var(--bg-main)] overflow-hidden">
        {/* Section Header */}
        <div ref={trustRef} className="max-w-[1280px] mx-auto px-6 sm:px-8 lg:px-12 mb-8 sm:mb-12 w-full text-center">
          <span className="type-eyebrow text-purple-400 mb-2 block font-mono">Proof of Impact & Trust</span>
          <h2 className="type-section-h1 text-[var(--text-primary)] font-bold tracking-tight">
            {trustText.endsWith(".") ? (
              <>
                {trustText.slice(0, -1)}
                <span className="tgs-gradient-text">.</span>
              </>
            ) : (
              trustText
            )}
          </h2>
        </div>

        {/* Line 1: Continuous Horizontal Logo Marquee (Left Movement) */}
        <div className="relative w-full overflow-hidden mask-gradient-x py-2 sm:py-3 mb-4 sm:mb-6">
          <div className="animate-marquee-continuous flex items-center gap-4 sm:gap-6">
            {marqueeLogosLine1.map((logo, idx) => (
              <Link
                key={`${logo.id}-l1-${idx}`}
                href="/work"
                className="w-44 sm:w-56 lg:w-60 h-16 sm:h-20 lg:h-24 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)]/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 flex-shrink-0 transition-all duration-500 hover:border-purple-500/60 hover:shadow-[0_20px_50px_rgba(107,33,168,0.2)] hover:-translate-y-1 hover:scale-[1.01] group cursor-pointer"
              >
                {logo.isText ? (
                  <span className="type-eyebrow text-xs sm:text-sm font-black tracking-widest uppercase text-center font-headline text-[var(--text-primary)] group-hover:text-purple-300 transition-colors px-2 py-1 leading-tight select-none">
                    {logo.name}
                  </span>
                ) : (
                  <img
                    src={theme === "light" ? logo.darkLogo : logo.lightLogo}
                    alt={logo.name}
                    className={`w-full h-full max-h-[85%] max-w-[90%] object-contain filter drop-shadow-sm transition-transform duration-300 group-hover:scale-[1.08] select-none pointer-events-none ${logo.scale || "scale-100"}`}
                  />
                )}
              </Link>
            ))}
          </div>
        </div>

        {/* Line 2: Continuous Horizontal Logo Marquee (Right Reverse Movement) */}
        <div className="relative w-full overflow-hidden mask-gradient-x py-2 sm:py-3 mb-12">
          <div className="animate-marquee-reverse flex items-center gap-4 sm:gap-6">
            {marqueeLogosLine2.map((logo, idx) => (
              <Link
                key={`${logo.id}-l2-${idx}`}
                href="/work"
                className="w-44 sm:w-56 lg:w-60 h-16 sm:h-20 lg:h-24 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)]/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 flex-shrink-0 transition-all duration-500 hover:border-purple-500/60 hover:shadow-[0_20px_50px_rgba(107,33,168,0.2)] hover:-translate-y-1 hover:scale-[1.01] group cursor-pointer"
              >
                {logo.isText ? (
                  <span className="type-eyebrow text-xs sm:text-sm font-black tracking-widest uppercase text-center font-headline text-[var(--text-primary)] group-hover:text-purple-300 transition-colors px-2 py-1 leading-tight select-none">
                    {logo.name}
                  </span>
                ) : (
                  <img
                    src={theme === "light" ? logo.darkLogo : logo.lightLogo}
                    alt={logo.name}
                    className={`w-full h-full max-h-[85%] max-w-[90%] object-contain filter drop-shadow-sm transition-transform duration-300 group-hover:scale-[1.08] select-none pointer-events-none ${logo.scale || "scale-100"}`}
                  />
                )}
              </Link>
            ))}
          </div>
        </div>

        {/* 3-STAT IMPACT PROOF BAR (Positioned right below the client logo marquee) */}
        <div className="max-w-[1280px] mx-auto px-6 sm:px-8 lg:px-12 w-full pt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-8 sm:p-10 rounded-3xl border border-purple-500/30 bg-[var(--bg-surface)]/90 backdrop-blur-md shadow-2xl">
            <div className="text-center md:text-left space-y-1 border-b md:border-b-0 md:border-r border-white/10 pb-6 md:pb-0 md:pr-6">
              <div className="text-4xl sm:text-5xl font-black font-headline text-white tracking-tight drop-shadow-[0_0_20px_rgba(168,85,247,0.4)]">
                100M<span className="tgs-gradient-text">+</span>
              </div>
              <div className="type-eyebrow text-xs font-mono font-bold uppercase tracking-widest text-purple-400">
                Views Generated
              </div>
              <p className="text-xs text-[var(--text-muted)] font-normal">
                Across organic short-form reels, brand documentaries, and campaigns.
              </p>
            </div>

            <div className="text-center md:text-left space-y-1 border-b md:border-b-0 md:border-r border-white/10 pb-6 md:pb-0 md:pr-6">
              <div className="text-4xl sm:text-5xl font-black font-headline text-white tracking-tight drop-shadow-[0_0_20px_rgba(168,85,247,0.4)]">
                3.5x<span className="tgs-gradient-text"> Lift</span>
              </div>
              <div className="type-eyebrow text-xs font-mono font-bold uppercase tracking-widest text-purple-400">
                Average ROAS Lift
              </div>
              <p className="text-xs text-[var(--text-muted)] font-normal">
                For performance creatives on Meta and TikTok direct-response ads.
              </p>
            </div>

            <div className="text-center md:text-left space-y-1">
              <div className="text-4xl sm:text-5xl font-black font-headline text-white tracking-tight drop-shadow-[0_0_20px_rgba(168,85,247,0.4)]">
                50<span className="tgs-gradient-text">+</span>
              </div>
              <div className="type-eyebrow text-xs font-mono font-bold uppercase tracking-widest text-purple-400">
                Brand Campaigns Delivered
              </div>
              <p className="text-xs text-[var(--text-muted)] font-normal">
                End-to-end strategy, cinema production, and media engine deployment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FOUNDER VISION & SHOWREEL SECTION (TEMPORARILY REMOVED AS REQUESTED) */}
      {/* <FounderVisionSection /> */}

      {/* WHISTLING WOODS FILMMAKING PEDIGREE SECTION (HOMEPAGE) */}
      <Section className="py-20 sm:py-28 bg-[var(--bg-surface)] border-b border-[var(--border-color)]">
        <div className="max-w-[1280px] mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="col-span-12 lg:col-span-6 space-y-6">
              <span className="type-eyebrow text-purple-400 font-mono tracking-widest uppercase block font-bold text-xs">
                ASIA'S PREMIER FILM SCHOOL HERITAGE
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-headline text-[var(--text-primary)] tracking-tight leading-tight">
                Filmmaker directors, not social media editors<span className="tgs-gradient-text">.</span>
              </h2>
              <p className="type-body text-sm sm:text-base lg:text-lg text-[var(--text-muted)] leading-relaxed font-normal">
                We are not social media editors or traditional ad managers. The core of The Gravity Studios is built by filmmaker directors graduated from Whistling Woods International—Asia’s premier film school. Having directed and produced the largest short films in college history (currently under international festival distribution), we apply cinema-grade storytelling, director-level narrative pacing, lighting, color grading, and sound masterclasses to new-age business media.
              </p>
              <div className="pt-2">
                <Button href="/about" size="sm" variant="secondary" className="px-6 py-3 text-xs font-extrabold tracking-widest uppercase">
                  LEARN OUR STORY
                </Button>
              </div>
            </div>

            <div className="col-span-12 lg:col-span-6">
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-purple-500/30 bg-[#0B0B0E] p-8 shadow-2xl flex flex-col justify-between group hover:border-purple-500/60 transition-all duration-500">
                <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                  <Clapperboard className="w-7 h-7" />
                </div>
                <div className="space-y-3 relative z-10">
                  <span className="type-eyebrow text-purple-400 font-mono text-xs uppercase font-bold tracking-widest block">
                    WHISTLING WOODS INTERNATIONAL
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold font-headline text-white">
                    Cinema Discipline Applied to Brand Engines
                  </h3>
                  <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
                    Short films under international festival distribution, cinematic 4K workflows, and high-concept storytelling.
                  </p>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* 5. TESTIMONIALS SECTION (SLIM CONTINUOUS MARQUEE DIRECTLY BELOW FOUNDER VIDEO) */}
      <section className="w-full flex flex-col justify-center py-10 sm:py-14 border-b border-[var(--border-color)] bg-[var(--bg-main)] overflow-hidden">
        {/* Testimonials Continuous Marquee Flow (Compact Cards + Wider Gap) */}
        <div className="relative w-full overflow-hidden mask-gradient-x py-2 sm:py-3">
          <div className="animate-marquee-reverse flex items-center gap-10 sm:gap-14 lg:gap-16">
            {marqueeTestimonials.map((t, idx) => (
              <div
                key={`${t.id}-${idx}`}
                className="w-[88vw] sm:w-[580px] lg:w-[660px] rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)]/90 backdrop-blur-md px-6 py-4 sm:px-8 sm:py-5 text-left flex flex-col justify-between flex-shrink-0 transition-all duration-500 hover:bg-[#1E1E24] hover:border-purple-500/80 hover:shadow-[0_20px_50px_rgba(168,85,247,0.35)] hover:-translate-y-1 hover:scale-[1.01] group cursor-pointer"
              >
                <div>
                  <Quote className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400/60 mb-2 group-hover:text-purple-400 group-hover:scale-110 transition-all" />
                  <p className="type-body text-xs sm:text-sm text-[var(--text-primary)] mb-3 leading-relaxed italic group-hover:text-white transition-colors">
                    "{t.quote}"
                  </p>
                </div>

                <div className="pt-2.5 border-t border-[var(--border-color)] group-hover:border-purple-500/40 transition-colors flex items-center justify-between gap-4">
                  <div>
                    <h4 className="type-card-h3 text-xs sm:text-sm text-[var(--text-primary)] font-bold group-hover:text-purple-300 transition-colors">
                      {t.author}
                    </h4>
                    <p className="type-eyebrow text-[10px] sm:text-[11px] text-[var(--text-muted)] mt-0.5 group-hover:text-zinc-300 transition-colors">
                      {t.company && t.company !== t.title ? `${t.title} • ${t.company}` : t.title}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. FAQ SECTION (REPLACES WHO IT'S FOR) */}
      <FaqSection />



      {/* 6. AI PRODUCTION SPOTLIGHT SECTION (COMPACT VERTICAL HEIGHT) */}
      <section className="relative w-full py-10 sm:py-14 px-6 sm:px-8 lg:px-12 bg-[#0A0A0C] border-t border-red-950/60 overflow-hidden select-none">
        {/* Background Crimson Radial Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[300px] sm:w-[600px] sm:h-[400px] rounded-full bg-red-600/10 blur-[100px] pointer-events-none z-0" />

        <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center justify-center text-center w-full">
          {/* Title First */}
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-semibold font-headline tracking-tight text-white mb-3 sm:mb-4 text-center">
            AI Ad Production Engine<span className="text-red-500">.</span>
          </h2>

          {/* Sub-badge Box Below Title */}
          <div className="flex items-center justify-center w-full mb-6 sm:mb-8">
            <span className="type-eyebrow text-[10px] sm:text-xs font-mono font-medium text-red-400 bg-red-950/60 border border-red-500/40 px-4 py-1.5 rounded-full uppercase tracking-widest text-center">
              AI Commercials • Brand Films • Campaigns
            </span>
          </div>

          <p className="type-body-large text-zinc-400 text-xs sm:text-base max-w-2xl mx-auto mb-6 sm:mb-8 leading-relaxed text-center">
            Looking for high-velocity generative ad creative and synthetic video production? Explore our dedicated AI Production partner.
          </p>

          <div className="flex items-center justify-center w-full mb-5 sm:mb-6">
            <a
              href="https://www.worstisbetterr.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full bg-gradient-to-r from-[#D90429] via-[#E51937] to-[#FF4D4D] text-white font-extrabold text-xs sm:text-sm tracking-widest uppercase hover:scale-105 transition-all shadow-[0_0_30px_rgba(217,4,41,0.6)] group"
            >
              <span>VISIT WORSTISBETTERR.COM</span>
              <ExternalLink className="w-4 h-4 text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          </div>

          {/* Official WORSTISBETTERR Logo Below Button */}
          <div className="flex items-center justify-center w-full mt-2 sm:mt-3">
            <img
              src="/worstisbetterr-logo-official.png"
              alt="WORSTISBETTERR Logo"
              className="h-6 sm:h-8 lg:h-9 max-w-[280px] w-auto object-contain mx-auto block drop-shadow-[0_0_15px_rgba(217,4,41,0.5)]"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

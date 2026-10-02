"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { PlaceholderBadge } from "@/components/PlaceholderBadge";
import {
  VolumeX,
  Volume2,
  ChevronDown,
  ArrowRight,
  ExternalLink,
  Cpu,
  Zap,
  Sparkles,
  Layers,
  Wand2,
  Film,
} from "lucide-react";

export default function AIProductionPage() {
  const [isMuted, setIsMuted] = useState(true);
  const [isHeroIdle, setIsHeroIdle] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showreelVideoId] = useState("KAPGtfF4-oQ");
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const [taglineInView, setTaglineInView] = useState(false);
  const taglineRef = useRef<HTMLDivElement>(null);

  // Strictly enforce Dark Mode exclusively for AI Production page
  useEffect(() => {
    const root = document.documentElement;
    const previousTheme = root.classList.contains("light") ? "light" : "dark";
    root.classList.remove("light");
    root.classList.add("dark");

    return () => {
      if (previousTheme === "light") {
        root.classList.remove("dark");
        root.classList.add("light");
      }
    };
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

  // Section Observer for Tagline animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setTaglineInView(entry.isIntersecting),
      { threshold: 0.15 }
    );

    if (taglineRef.current) observer.observe(taglineRef.current);
    return () => {
      if (taglineRef.current) observer.unobserve(taglineRef.current);
    };
  }, []);

  // Toggle sound on user click
  const toggleSound = () => {
    const nextMuteState = !isMuted;
    setIsMuted(nextMuteState);

    if (iframeRef.current && iframeRef.current.contentWindow) {
      const command = nextMuteState ? "mute" : "unMute";
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({ event: "command", func: command, args: [] }),
        "*"
      );
      if (!nextMuteState) {
        iframeRef.current.contentWindow.postMessage(
          JSON.stringify({ event: "command", func: "setVolume", args: [100] }),
          "*"
        );
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#0A0A0C] text-white">
      {/* 1. HERO SHOWREEL VIDEO SECTION — FRAMELESS BACKGROUND VIDEO */}
      <section className="relative w-full h-screen h-[100vh] h-[100svh] min-h-[600px] overflow-hidden flex items-center justify-center bg-black select-none">
        {/* Invisible Frameless 16:9 Ratio YouTube Video Container */}
        <div className="absolute inset-0 z-0 w-full h-full overflow-hidden pointer-events-none flex items-center justify-center">
          <iframe
            ref={iframeRef}
            src={`https://www.youtube-nocookie.com/embed/${showreelVideoId}?autoplay=1&mute=1&playsinline=1&loop=1&playlist=${showreelVideoId}&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&enablejsapi=1&disablekb=1&fs=0`}
            title="AI Production Showreel"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            className="w-[100vw] h-[56.25vw] min-h-[100vh] min-w-[177.77vh] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 object-cover opacity-90 pointer-events-none"
            style={{ border: 0 }}
          />
          {/* Crimson Red Vignette Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-[#0A0A0C] pointer-events-none" />
        </div>

        {/* Sound Toggle Button (Default Muted / Turn On Audio Control) */}
        <div className="absolute bottom-8 right-6 sm:bottom-10 sm:right-8 z-20 transition-all duration-300">
          <button
            onClick={toggleSound}
            aria-label={isMuted ? "Unmute video sound" : "Mute video sound"}
            className="flex items-center gap-2 px-4 py-2.5 sm:px-5 sm:py-3 rounded-full backdrop-blur-md bg-red-950/80 border border-red-500/50 text-white hover:bg-red-900/90 transition-all duration-300 shadow-[0_0_25px_rgba(217,4,41,0.5)] cursor-pointer select-none group"
          >
            {isMuted ? (
              <>
                <VolumeX className="w-4 h-4 text-red-400 group-hover:scale-110 transition-transform" />
                <span className="type-eyebrow text-xs font-mono font-bold tracking-wider text-red-300">SOUND OFF</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4 text-red-500 animate-pulse group-hover:scale-110 transition-transform" />
                <span className="type-eyebrow text-xs font-mono font-bold tracking-wider text-red-300">SOUND ON</span>
              </>
            )}
          </button>
        </div>

        {/* Scroll Indicator */}
        <div
          className={`absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1 transition-all duration-700 ease-in-out ${
            !isScrolled && isHeroIdle
              ? "opacity-0 pointer-events-none"
              : "opacity-80 hover:opacity-100"
          }`}
        >
          <span className="type-eyebrow text-[9px] sm:text-[10px] tracking-[0.15em] text-red-400 font-mono">DISCOVER AI PRODUCTION</span>
          <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-400 animate-bounce-slow" />
        </div>
      </section>

      {/* 2. TAGLINE SECTION & EXTERNAL LINK TO WORSTISBETTERR.COM */}
      <section ref={taglineRef} className="relative min-h-[90vh] w-full flex flex-col justify-center items-center py-20 px-6 sm:px-8 lg:px-12 bg-[#0A0A0C] border-b border-red-950/60 overflow-hidden select-none">
        
        {/* Background Crimson Radial Aura Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] sm:w-[950px] sm:h-[950px] rounded-full bg-red-600/10 blur-[150px] pointer-events-none z-0" />

        {/* Cyberpunk Grid Lines Background */}
        <div
          className="absolute inset-0 z-0 pointer-events-none opacity-[0.08] bg-[linear-gradient(to_right,#D90429_1px,transparent_1px),linear-gradient(to_bottom,#D90429_1px,transparent_1px)] bg-[size:2.5rem_2.5rem]"
          style={{
            maskImage: "radial-gradient(circle at 50% 50%, black 40%, transparent 80%)",
            WebkitMaskImage: "radial-gradient(circle at 50% 50%, black 40%, transparent 80%)",
          }}
        />

        <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center text-center">
          
          {/* Uploaded Single Red Chevron Symbol Logo Asset < (Tight Lockup) */}
          <div
            className={`flex items-center justify-center mt-4 sm:mt-6 -mb-4 sm:-mb-8 md:-mb-10 transition-all duration-700 ${
              taglineInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <img
              src="/worstisbetterr-single-chevron.png"
              alt="WORSTISBETTERR Red Chevron Symbol"
              className="h-12 sm:h-16 lg:h-20 w-auto object-contain drop-shadow-[0_0_35px_rgba(217,4,41,0.9)] z-10 relative"
            />
          </div>

          {/* Main Headline — Massive Authentic Logo Graphic Asset */}
          <div
            className={`mb-2 sm:mb-3 flex justify-center items-center transition-all duration-900 delay-200 ${
              taglineInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            <img
              src="/worstisbetterr-logo-white.png"
              alt="WORSTISBETTERR logo"
              className="h-44 sm:h-72 lg:h-96 w-auto object-contain max-w-full drop-shadow-[0_0_50px_rgba(217,4,41,0.8)] hover:scale-[1.03] transition-transform duration-500"
            />
          </div>

          {/* Tagline Paragraph (Pulled Upper Right Below Main Logo) */}
          <p
            className={`type-body-large text-zinc-300 text-base sm:text-xl lg:text-2xl max-w-3xl -mt-1 sm:-mt-2 mb-10 leading-relaxed font-normal transition-all duration-1000 delay-350 ${
              taglineInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            Our specialized AI Production agency built for high-velocity generative ad creative, rapid performance testing, and synthetic campaign scaling.
          </p>

          {/* External Link Button to https://www.worstisbetterr.com */}
          <div
            className={`flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto transition-all duration-1000 delay-500 ${
              taglineInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <a
              href="https://www.worstisbetterr.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 px-9 py-4 rounded-full bg-gradient-to-r from-[#D90429] via-[#E51937] to-[#FF4D4D] text-white font-extrabold text-sm tracking-widest uppercase hover:scale-105 transition-all shadow-[0_0_40px_rgba(217,4,41,0.6)] hover:shadow-[0_0_60px_rgba(217,4,41,0.9)] group"
            >
              <span>VISIT WORSTISBETTERR.COM</span>
              <ExternalLink className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform" />
            </a>

            <a
              href="/book"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-white/10 border border-white/20 text-white font-extrabold text-sm tracking-widest uppercase hover:bg-white/20 transition-all hover:scale-105"
            >
              <span>BOOK AI CONSULTATION</span>
              <ArrowRight className="w-4 h-4 text-red-400" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

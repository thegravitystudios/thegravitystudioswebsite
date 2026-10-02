"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { VolumeX, Volume2, ArrowRight } from "lucide-react";

export function FounderVisionSection() {
  const [isMuted, setIsMuted] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const youtubeId = "cG4g0ogEA1A";

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, []);

  const toggleSound = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    const nextMuteState = !isMuted;
    setIsMuted(nextMuteState);

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

  const titleWords = [
    { text: "WHAT", isGradient: false },
    { text: "OUR", isGradient: false },
    { text: "FOUNDER", isGradient: true, isBold: true },
    { text: "HAS", isGradient: false },
    { text: "TO", isGradient: false },
    { text: "SAY", isGradient: false, hasPeriod: true },
  ];

  const nameWords = ["Prameet", "Patani", "—", "Founder"];
  const roleWords = ["(FILMMAKER,", "STORYTELLER,", "MUSICIAN)"];

  return (
    <section
      ref={sectionRef}
      className="relative py-16 sm:py-24 border-b border-[var(--border-color)] bg-[var(--bg-main)] overflow-hidden text-center select-none"
    >
      {/* ARCHITECTURAL GRID BACKGROUND */}
      <div className="absolute inset-0 bg-architectural-grid pointer-events-none z-0" />

      <div className="relative z-10 max-w-[1280px] mx-auto px-6 flex flex-col items-center justify-center">
        {/* WORD-BY-WORD SEAMLESS HEADING ANIMATION (ALL CAPS) */}
        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-headline font-black uppercase text-[var(--text-primary)] tracking-tight leading-none mb-8 flex flex-wrap justify-center items-baseline gap-x-[0.28em] gap-y-[0.1em]">
          {titleWords.map((word, idx) => (
            <span
              key={idx}
              style={{ transitionDelay: `${idx * 110}ms` }}
              className={`inline-block transition-all duration-700 ease-out ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
              }`}
            >
              {word.isGradient ? (
                <span className="font-black text-3xl sm:text-5xl lg:text-6xl tgs-gradient-text uppercase tracking-tight">{word.text}</span>
              ) : (
                <span className="font-black text-[var(--text-primary)]">{word.text}</span>
              )}
              {word.hasPeriod && <span className="tgs-gradient-text font-black">.</span>}
            </span>
          ))}
        </h2>

        {/* SEAMLESS ANIMATED VIDEO FRAME */}
        <div
          className={`relative w-full max-w-4xl mx-auto mb-6 group p-3 sm:p-4 transition-all duration-800 ease-out ${
            isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-[0.97]"
          }`}
        >
          {/* HORIZONTAL CROSSHAIR LINE TOP */}
          <div className="absolute top-3 sm:top-4 -left-3 -right-3 h-[1px] bg-gradient-to-r from-transparent via-purple-500/60 to-transparent pointer-events-none z-10" />

          {/* HORIZONTAL CROSSHAIR LINE BOTTOM */}
          <div className="absolute bottom-3 sm:bottom-4 -left-3 -right-3 h-[1px] bg-gradient-to-r from-transparent via-purple-500/60 to-transparent pointer-events-none z-10" />

          {/* VERTICAL CROSSHAIR LINE LEFT */}
          <div className="absolute -top-3 -bottom-3 left-3 sm:left-4 w-[1px] bg-gradient-to-b from-transparent via-purple-500/60 to-transparent pointer-events-none z-10" />

          {/* VERTICAL CROSSHAIR LINE RIGHT */}
          <div className="absolute -top-3 -bottom-3 right-3 sm:right-4 w-[1px] bg-gradient-to-b from-transparent via-purple-500/60 to-transparent pointer-events-none z-10" />

          {/* 4 PURPLE BRAND SQUARE CORNER NODE BOXES */}
          <span className="w-2.5 h-2.5 bg-purple-600 border border-purple-300 shadow-[0_0_12px_rgba(168,85,247,0.95)] z-30 absolute top-3 sm:top-4 left-3 sm:left-4 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
          <span className="w-2.5 h-2.5 bg-purple-600 border border-purple-300 shadow-[0_0_12px_rgba(168,85,247,0.95)] z-30 absolute top-3 sm:top-4 right-3 sm:right-4 translate-x-1/2 -translate-y-1/2 pointer-events-none" />
          <span className="w-2.5 h-2.5 bg-purple-600 border border-purple-300 shadow-[0_0_12px_rgba(168,85,247,0.95)] z-30 absolute bottom-3 sm:bottom-4 left-3 sm:left-4 -translate-x-1/2 translate-y-1/2 pointer-events-none" />
          <span className="w-2.5 h-2.5 bg-purple-600 border border-purple-300 shadow-[0_0_12px_rgba(168,85,247,0.95)] z-30 absolute bottom-3 sm:bottom-4 right-3 sm:right-4 translate-x-1/2 translate-y-1/2 pointer-events-none" />

          {/* VIDEO FRAME (AUTOPLAYING, NO CONTROLS, SOUND BUTTON ON TOP) */}
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black border border-purple-500/40 transition-all duration-300 shadow-[0_0_35px_rgba(168,85,247,0.15)]">
            <iframe
              ref={iframeRef}
              src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&mute=1&playsinline=1&loop=1&playlist=${youtubeId}&controls=0&disablekb=1&fs=0&iv_load_policy=3&modestbranding=1&rel=0&enablejsapi=1`}
              className="w-full h-full border-0 pointer-events-none rounded-none bg-black scale-[1.03]"
              allow="accelerometer; autoplay *; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="Prameet Patani — Founder Video"
            />

            {/* SOUND TOGGLE BUTTON */}
            <div className="absolute bottom-4 right-4 z-30">
              <button
                onClick={toggleSound}
                aria-label={isMuted ? "Unmute video sound" : "Mute video sound"}
                className="flex items-center gap-2 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-full backdrop-blur-md bg-purple-950/85 border border-purple-500/50 text-white hover:bg-purple-900 transition-all duration-300 shadow-[0_0_20px_rgba(168,85,247,0.5)] cursor-pointer select-none group"
              >
                {isMuted ? (
                  <>
                    <VolumeX className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
                    <span className="type-eyebrow text-[11px] font-mono font-bold tracking-wider text-purple-300">SOUND OFF</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-4 h-4 text-emerald-400 animate-pulse group-hover:scale-110 transition-transform" />
                    <span className="type-eyebrow text-[11px] font-mono font-bold tracking-wider text-emerald-300">SOUND ON</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* WORD-BY-WORD ANIMATED FOUNDER NAME & ROLES */}
        <div className="mb-8 text-center min-h-[4rem]">
          <h3 className="text-lg sm:text-xl font-bold text-[var(--text-primary)] tracking-wide font-headline whitespace-nowrap flex items-center justify-center gap-1.5 mb-1">
            {nameWords.map((word, idx) => (
              <span
                key={idx}
                style={{ transitionDelay: `${500 + idx * 120}ms` }}
                className={`inline-block transition-all duration-600 ease-out ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
                }`}
              >
                {word}
              </span>
            ))}
          </h3>

          <div className="type-eyebrow text-xs sm:text-sm font-mono text-purple-400 tracking-widest uppercase flex items-center justify-center gap-1.5 font-semibold">
            {roleWords.map((word, idx) => (
              <span
                key={idx}
                style={{ transitionDelay: `${1000 + idx * 120}ms` }}
                className={`inline-block transition-all duration-600 ease-out ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
                }`}
              >
                {word}
              </span>
            ))}
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div
          style={{ transitionDelay: "1400ms" }}
          className={`flex flex-wrap items-center justify-center gap-4 sm:gap-6 transition-all duration-800 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
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
            <span>SEE THE WORK</span>
            <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}

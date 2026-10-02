"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Section } from "@/components/Section";
import { projectsData, Project, getProjectSlug } from "@/data/projectsData";
import { useTheme } from "@/context/ThemeContext";
import { soundEngine } from "@/utils/audio";
import {
  Play,
  Filter,
  ExternalLink,
  ArrowRight,
  ArrowUpRight,
  Maximize2,
  X,
  Sparkles,
  Video,
  ChevronRight,
  TrendingUp,
  Compass,
  Volume2,
  VolumeX,
} from "lucide-react";

function getProjectThumbnail(project: any): string {
  if (!project) return "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1200&q=80";

  // 1. First priority: Explicit poster on showcaseVideos[0]
  if (project.showcaseVideos && project.showcaseVideos[0]?.poster) {
    return project.showcaseVideos[0].poster;
  }

  // 2. Second priority: Extract YouTube thumbnail from showcaseVideos[0].src or videoUrl
  const videoSrc = project.showcaseVideos?.[0]?.src || project.videoUrl || "";
  if (videoSrc) {
    const shortsMatch = videoSrc.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/);
    const watchMatch = videoSrc.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]+)/);
    const youtubeId = shortsMatch?.[1] || watchMatch?.[1];
    if (youtubeId) {
      return `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`;
    }
  }

  // 3. Third priority: Extract from videoId
  if (project.videoId) {
    return `https://i.ytimg.com/vi/${project.videoId}/maxresdefault.jpg`;
  }

  // 4. Fourth priority: project.thumbnail
  if (project.thumbnail) {
    return project.thumbnail;
  }

  // 5. Fallback image
  return "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1200&q=80";
}

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
 * WorkAnimatedCardTile Component — Staggered 3D entrance with internal text reveals & scroll re-triggering
 */
function WorkAnimatedCardTile({
  project,
  isLight,
  delay = 0,
  onHoverVideo,
}: {
  project: Project;
  isLight: boolean;
  delay?: number;
  onHoverVideo?: (hovering: boolean) => void;
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
    <div ref={ref} className="w-full h-full">
      <Link
        href={`/work/${getProjectSlug(project)}`}
        onClick={() => {
          try {
            soundEngine.playWhooshSound();
          } catch (e) {}
        }}
        onMouseEnter={() => {
          if (onHoverVideo) onHoverVideo(true);
          try {
            soundEngine.fadeAmbientMusic(0, 0.5);
          } catch (e) {}
        }}
        onMouseLeave={() => {
          if (onHoverVideo) onHoverVideo(false);
          try {
            soundEngine.fadeAmbientMusic(1.0, 1.0);
          } catch (e) {}
        }}
        className={`w-full h-full rounded-3xl overflow-hidden border transition-all duration-700 ease-out transform-gpu group flex flex-col justify-between cursor-pointer ${
          isVisible
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 translate-y-12 scale-95"
        } ${
          isLight
            ? "bg-white border-zinc-200 hover:border-purple-500/60 shadow-lg hover:shadow-2xl hover:-translate-y-1.5"
            : "bg-[#0A0A0C]/90 border-zinc-800 hover:border-purple-500/60 hover:shadow-[0_15px_60px_rgba(168,85,247,0.25)] hover:-translate-y-1.5"
        }`}
      >
        {/* MEDIA THUMBNAIL CONTAINER */}
        {(() => {
          const hasVideo = Boolean(project.videoUrl || project.videoId || project.showcaseVideos?.some((v) => Boolean(v.src && v.src !== "")));
          return (
            <div className="relative w-full aspect-video bg-[#0A0A0C] overflow-hidden select-none">
              <img
                src={getProjectThumbnail(project)}
                alt={`${project.brandName} - ${project.title}`}
                onError={(e) => {
                  const target = e.currentTarget;
                  if (!target.src.includes("unsplash.com")) {
                    target.src = "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1200&q=80";
                  }
                }}
                className={`w-full h-full ${
                  hasVideo
                    ? "object-cover grayscale contrast-125 brightness-75 group-hover:grayscale-0 group-hover:contrast-100 group-hover:brightness-100"
                    : "object-contain p-2 grayscale-0 contrast-100 brightness-100"
                } group-hover:scale-105 transition-all duration-700 opacity-95 group-hover:opacity-100 ${
                  isVisible ? "scale-100 opacity-95" : "scale-105 opacity-0"
                }`}
              />

              {hasVideo && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/20 group-hover:via-black/10 transition-all duration-500" />
              )}

              <div className={`absolute top-4 right-4 z-10 transition-all duration-500 delay-100 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
              }`}>
                <span className="type-eyebrow text-[10px] sm:text-[11px] font-mono text-purple-300 bg-purple-950/85 backdrop-blur-md px-3 py-1 rounded-full border border-purple-500/40 uppercase shadow-md">
                  {project.department}
                </span>
              </div>

              <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
                <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/10 border border-white/30 backdrop-blur-md flex items-center justify-center group-hover:scale-110 group-hover:bg-purple-600 group-hover:border-purple-400 transition-all duration-500 shadow-[0_0_35px_rgba(168,85,247,0.6)] ${
                  isVisible ? "opacity-100 scale-100" : "opacity-0 scale-75"
                }`}>
                  {hasVideo ? (
                    <Play className="w-5 h-5 sm:w-6 sm:h-6 text-white fill-white ml-0.5" />
                  ) : (
                    <ArrowUpRight className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  )}
                </div>
              </div>

              {/* 1-Sentence Performance & Outcome Badge */}
              <div className="absolute bottom-0 inset-x-0 px-4 py-2 bg-purple-950/90 border-t border-purple-500/40 flex items-center gap-2 text-xs font-mono text-purple-300 font-bold z-20">
                <Sparkles className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
                <span className="truncate">
                  {(() => {
                    if (project.metrics && project.metrics[0]) {
                      return `${project.department || "Campaign"} — ${project.metrics[0].value} ${project.metrics[0].label}`;
                    }
                    switch (project.id) {
                      case "fp-1":
                        return "Founder Story Reels — 2.4M Organic Views";
                      case "wcs-1":
                        return "Whole Content System — 4.2x ROAS Lift";
                      case "cc-1":
                        return "Cinematic Collection Drop — Flagship Launch";
                      case "mv-1":
                        return "Music Video Production — 1.8M Views";
                      case "flm-1":
                        return "Film Production — Festival Distribution";
                      default:
                        return `${project.department || "Campaign"} — Category Impact`;
                    }
                  })()}
                </span>
              </div>
            </div>
          );
        })()}

        <div className="p-6 sm:p-7 flex flex-col justify-between flex-grow text-left">
          <div>
            <div className={`flex items-center gap-2 mb-2 text-[11px] sm:text-xs font-mono overflow-hidden transition-all duration-500 delay-150 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1"
            }`}>
              <span className="text-purple-600 dark:text-purple-400 font-bold uppercase tracking-wider truncate">
                {project.industry || "Brand & Content"} • {project.executionModel || project.department}
              </span>
            </div>

            <h3 className={`text-xl sm:text-2xl font-bold font-headline mb-3 transition-all duration-500 delay-200 leading-tight ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
            } ${
              isLight
                ? "text-zinc-950 group-hover:text-purple-600"
                : "text-white group-hover:text-purple-300"
            }`}>
              {project.title}
            </h3>

            <p className={`type-body text-xs sm:text-sm leading-relaxed mb-6 line-clamp-2 transition-all duration-500 delay-300 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
            } ${
              isLight ? "text-zinc-600" : "text-zinc-400"
            }`}>
              {project.description}
            </p>
          </div>

          <div className={`pt-4 border-t transition-all duration-500 delay-350 ${
            isLight ? "border-zinc-200" : "border-zinc-800"
          }`}>
            <div className={`flex items-center justify-between py-1 text-xs font-mono font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 group-hover:translate-x-1 transition-all ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"
            }`}>
              <span>VIEW PROJECT & CASE STUDY</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default function WorkPage() {
  const { theme } = useTheme();
  const isLight = theme === "light";

  const [activeTab, setActiveTab] = useState("All");
  const [isAudioActive, setIsAudioActive] = useState(false);
  const [isHoveringAnyVideo, setIsHoveringAnyVideo] = useState(false);
  const [isHoveringAudioControl, setIsHoveringAudioControl] = useState(false);
  const [ambientVolume, setAmbientVolumeState] = useState(0.15);

  const departments = [
    "All",
    "Content Production",
    "Whole Content System",
    "Commercials/Campaigns",
    "Music Videos",
    "Films",
  ];

  // Complete official showcase list matching exact user requested order
  const projectsList = [
    projectsData["cc-1"],  // 1. Hero Motors
    projectsData["wcs-3"], // 2. Mystic Mann
    projectsData["fp-2"],  // 3. Natural Veneers
    projectsData["mv-1"],  // 4. Before The Fall (PRMT 1.O)
    projectsData["wcs-2"], // 5. Sakshisayys
    projectsData["cc-2"],  // 6. Ultimo
    projectsData["wcs-1"], // 7. Humming Bird
    projectsData["flm-1"], // 8. Outflow
    projectsData["wcs-5"], // 9. Shalina Gupta
    projectsData["cc-4"],  // 10. Riddhi Khosla Jalan
    projectsData["wcs-4"], // 11. Eurotrend
    projectsData["fp-1"],  // 12. Conscious Food
    projectsData["cc-3"],  // 13. Tata Cliq Luxury
    projectsData["cc-6"],  // 14. PSA - Every Bite Matters
    projectsData["cc-5"],  // 15. 15RepMax
    projectsData["mv-2"],  // 16. Gardish
    projectsData["mv-3"],  // 17. Birthday Freestyle
    projectsData["flm-2"], // 18. The Testing Academy
    projectsData["flm-5"], // 19. First Friend
    projectsData["flm-4"], // 20. Duvidha
    projectsData["mv-4"],  // 21. Superstar
    projectsData["cc-7"],  // 22. Wingman
    projectsData["flm-3"], // 23. A Second Chance
    projectsData["flm-6"], // 24. Enfance
  ].filter(Boolean);

  const filteredProjects =
    activeTab === "All"
      ? projectsList
      : projectsList.filter(
          (p) =>
            p.department === activeTab ||
            p.category === activeTab ||
            (p.department && p.department.replace(/s$/, "").toLowerCase() === activeTab.replace(/s$/, "").toLowerCase()) ||
            (p.category && p.category.replace(/s$/, "").toLowerCase() === activeTab.replace(/s$/, "").toLowerCase())
        );

  // Helper to count projects per segment
  const getCount = (dept: string) => {
    if (dept === "All") return projectsList.length;
    return projectsList.filter(
      (p) =>
        p.department === dept ||
        p.category === dept ||
        (p.department && p.department.replace(/s$/, "").toLowerCase() === dept.replace(/s$/, "").toLowerCase()) ||
        (p.category && p.category.replace(/s$/, "").toLowerCase() === dept.replace(/s$/, "").toLowerCase())
    ).length;
  };

  // 🎵 AUTOMATIC AUDIOCONTEXT UNLOCK & AMBIENT FADE MANAGEMENT
  useEffect(() => {
    const handleFirstUserInteraction = () => {
      soundEngine.init();
      if (!isAudioActive && !soundEngine.isMusicPlaying()) {
        soundEngine.startAmbientSpaceMusic();
        setIsAudioActive(true);
      }
    };

    window.addEventListener("click", handleFirstUserInteraction, { once: true });
    window.addEventListener("keydown", handleFirstUserInteraction, { once: true });
    window.addEventListener("touchstart", handleFirstUserInteraction, { once: true });

    return () => {
      window.removeEventListener("click", handleFirstUserInteraction);
      window.removeEventListener("keydown", handleFirstUserInteraction);
      window.removeEventListener("touchstart", handleFirstUserInteraction);
    };
  }, [isAudioActive]);

  useEffect(() => {
    if (isAudioActive && !isHoveringAnyVideo) {
      soundEngine.fadeAmbientMusic(1.0, 1.2);
    }
  }, [isAudioActive, isHoveringAnyVideo]);

  // Toggle Ambient Audio Engine
  const toggleAmbientAudio = (e?: React.SyntheticEvent) => {
    if (e) e.stopPropagation();
    soundEngine.init();
    const newState = soundEngine.toggleMute();
    setIsAudioActive(newState);
  };

  // Dynamic Volume Slider Handler
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setAmbientVolumeState(val);
    soundEngine.setAmbientVolume(val);
    if (val > 0) {
      setIsAudioActive(true);
    } else {
      setIsAudioActive(false);
    }
  };

  // 32 randomly shining star nodes across the project feed grid
  const randomStars = [
    { top: "6%", left: "15%", size: "w-1 h-1", delay: "0.2s" },
    { top: "12%", left: "82%", size: "w-1.5 h-1.5", delay: "1.4s" },
    { top: "18%", left: "45%", size: "w-1 h-1", delay: "2.8s" },
    { top: "24%", left: "72%", size: "w-2 h-2", delay: "0.7s" },
    { top: "30%", left: "22%", size: "w-1 h-1", delay: "1.9s" },
    { top: "36%", left: "90%", size: "w-1.5 h-1.5", delay: "3.2s" },
    { top: "42%", left: "34%", size: "w-1 h-1", delay: "0.5s" },
    { top: "48%", left: "68%", size: "w-2 h-2", delay: "2.3s" },
    { top: "54%", left: "11%", size: "w-1 h-1", delay: "1.6s" },
    { top: "60%", left: "85%", size: "w-1.5 h-1.5", delay: "2.9s" },
    { top: "66%", left: "52%", size: "w-1 h-1", delay: "1.1s" },
    { top: "72%", left: "28%", size: "w-2 h-2", delay: "3.7s" },
    { top: "78%", left: "74%", size: "w-1 h-1", delay: "1.3s" },
    { top: "84%", left: "18%", size: "w-1.5 h-1.5", delay: "2.5s" },
    { top: "10%", left: "58%", size: "w-1.5 h-1.5", delay: "1.8s" },
    { top: "22%", left: "93%", size: "w-1 h-1", delay: "0.4s" },
    { top: "34%", left: "8%", size: "w-2 h-2", delay: "3.0s" },
    { top: "46%", left: "48%", size: "w-1 h-1", delay: "1.5s" },
    { top: "58%", left: "24%", size: "w-1 h-1", delay: "0.9s" },
    { top: "70%", left: "92%", size: "w-1 h-1", delay: "3.4s" },
    { top: "82%", left: "41%", size: "w-2 h-2", delay: "2.1s" },
    { top: "16%", left: "31%", size: "w-1 h-1", delay: "2.7s" },
    { top: "40%", left: "79%", size: "w-1.5 h-1.5", delay: "0.6s" },
    { top: "52%", left: "95%", size: "w-1 h-1", delay: "3.1s" },
    { top: "64%", left: "12%", size: "w-2 h-2", delay: "1.4s" },
    { top: "76%", left: "63%", size: "w-1 h-1", delay: "2.8s" },
    { top: "88%", left: "87%", size: "w-1.5 h-1.5", delay: "0.3s" },
    { top: "94%", left: "48%", size: "w-1 h-1", delay: "3.6s" },
    { top: "28%", left: "60%", size: "w-1 h-1", delay: "1.0s" },
    { top: "56%", left: "40%", size: "w-1.5 h-1.5", delay: "2.2s" },
    { top: "75%", left: "75%", size: "w-1 h-1", delay: "0.8s" },
    { top: "91%", left: "33%", size: "w-2 h-2", delay: "2.6s" },
  ];

  return (
    <div className={`flex flex-col min-h-screen pt-28 sm:pt-32 pb-32 select-none relative overflow-hidden transition-colors duration-300 ${
      isLight ? "bg-white text-zinc-950" : "bg-[#0A0A0C] text-white"
    }`}>

      {/* 1. UPPER HERO & FILTER SECTION (100% SOLID BACKGROUND — ZERO GRIDS BEHIND HEADER) */}
      <div className={`w-full relative z-20 border-b shadow-md ${
        isLight ? "bg-white border-zinc-200" : "bg-[#0A0A0C] border-zinc-800"
      }`}>
        {/* HERO HEADER */}
        <Section className="py-12 lg:py-20 relative overflow-hidden">
          {/* AMBIENT RADIAL GLOW CANVAS BEHIND TITLE */}
          <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
            {/* Primary Center Breathing Radial Bloom */}
            <div
              className={`absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[800px] lg:w-[900px] h-[300px] sm:h-[400px] rounded-full blur-[140px] transition-opacity duration-1000 animate-pulse ${
                isLight ? "bg-purple-500/18" : "bg-purple-600/25"
              }`}
            />
            {/* Secondary Pink Glow Aura */}
            <div
              className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] sm:w-[600px] h-[200px] sm:h-[300px] rounded-full blur-[150px] opacity-60 ${
                isLight ? "bg-pink-400/12" : "bg-fuchsia-600/18"
              }`}
            />
          </div>

          <div className="max-w-[1280px] mx-auto text-left relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <span className={`w-2.5 h-2.5 rounded-full animate-ping shadow-[0_0_12px_#a855f7] ${
                isLight ? "bg-purple-600" : "bg-purple-400"
              }`} />
              <TypewriterText
                text="PRODUCTION ARCHIVE // 2026"
                speed={8}
                delay={0}
                as="span"
                className={`type-eyebrow text-[9px] sm:text-xs tracking-wider sm:tracking-widest font-mono uppercase px-2.5 sm:px-3.5 py-0.5 sm:py-1 rounded-full border shadow-[0_0_20px_rgba(168,85,247,0.25)] ${
                  isLight
                    ? "text-purple-700 bg-purple-50 border-purple-200"
                    : "text-purple-400 bg-purple-950/70 border-purple-500/35"
                }`}
              />
            </div>

            <TypewriterText
              text="Selected Work."
              speed={10}
              delay={30}
              showCursor={true}
              as="h1"
              className={`text-3xl sm:text-6xl md:text-7xl lg:text-8xl font-black font-headline tracking-tight mb-3 sm:mb-6 leading-none drop-shadow-[0_0_35px_rgba(168,85,247,0.35)] ${
                isLight ? "text-zinc-950" : "text-white"
              }`}
            />

            <TypewriterText
              text="A curated showcase of whole content systems, commercial campaigns, music videos, and films produced by The Gravity Studios."
              speed={8}
              delay={80}
              as="p"
              className={`type-body-large text-[13px] sm:text-lg md:text-xl max-w-3xl leading-snug sm:leading-relaxed font-normal ${
                isLight ? "text-zinc-600" : "text-zinc-400"
              }`}
            />
          </div>
        </Section>

        {/* CATEGORY FILTER TABS */}
        <Section className={`py-4 sm:py-6 border-t ${
          isLight ? "border-zinc-200 bg-white" : "border-zinc-800 bg-[#0A0A0C]"
        }`}>
          <div className="max-w-[1280px] mx-auto w-full">
            {/* 2-ROW UNIFIED HORIZONTAL SCROLLABLE DECK ON PHONE (< sm:) */}
            <div className="sm:hidden overflow-x-auto no-scrollbar pb-2 select-none w-full">
              <div className="grid grid-rows-2 grid-flow-col gap-2.5 w-max">
                {departments.map((dept) => {
                  const isSelected = activeTab === dept;
                  const count = getCount(dept);
                  return (
                    <button
                      key={dept}
                      onClick={() => {
                        soundEngine.playClickSound();
                        setActiveTab(dept);
                      }}
                      className={`px-4 py-2.5 rounded-xl type-eyebrow text-[11px] tracking-wider transition-all cursor-pointer flex items-center justify-between font-mono border whitespace-nowrap ${
                        isSelected
                          ? isLight
                            ? "bg-zinc-950 text-white border-zinc-950 shadow-md scale-[1.01]"
                            : "bg-zinc-200 text-zinc-950 border-zinc-300 shadow-md scale-[1.01]"
                          : isLight
                          ? "bg-zinc-50 text-zinc-700 border-zinc-200 hover:text-zinc-950 hover:border-purple-500/40 hover:bg-purple-50 font-medium"
                          : "bg-[#0A0A0C]/50 text-zinc-400 border-zinc-800 hover:text-white hover:border-purple-500/40 hover:bg-purple-500/5 font-medium"
                      }`}
                    >
                      <span className={`whitespace-nowrap ${isSelected ? "font-black tracking-widest" : "font-medium"}`}>
                        {dept}
                      </span>
                      <span
                        className={`text-[9px] px-2 py-0.5 rounded-full ml-2 flex-shrink-0 font-bold ${
                          isSelected
                            ? isLight
                              ? "bg-purple-600 text-white"
                              : "bg-black text-white"
                            : isLight
                            ? "bg-purple-50 text-purple-700 border border-purple-200"
                            : "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                        }`}
                      >
                        {String(count).padStart(2, "0")}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* DESKTOP 3-COLUMN GRID (>= sm:) */}
            <div className="hidden sm:grid sm:grid-cols-3 sm:gap-4 w-full select-none">
              {departments.map((dept) => {
                const isSelected = activeTab === dept;
                const count = getCount(dept);
                return (
                  <button
                    key={dept}
                    onClick={() => {
                      soundEngine.playClickSound();
                      setActiveTab(dept);
                    }}
                    className={`w-full px-6 py-3.5 rounded-2xl type-eyebrow text-xs md:text-sm tracking-wider transition-all cursor-pointer flex items-center justify-between font-mono border whitespace-nowrap ${
                      isSelected
                        ? isLight
                          ? "bg-zinc-950 text-white border-zinc-950 shadow-md scale-[1.01]"
                          : "bg-zinc-200 text-zinc-950 border-zinc-300 shadow-md scale-[1.01]"
                        : isLight
                        ? "bg-zinc-50 text-zinc-700 border-zinc-200 hover:text-zinc-950 hover:border-purple-500/40 hover:bg-purple-50 font-medium"
                        : "bg-[#0A0A0C]/50 text-zinc-400 border-zinc-800 hover:text-white hover:border-purple-500/40 hover:bg-purple-500/5 font-medium"
                    }`}
                  >
                    <span className={`whitespace-nowrap ${isSelected ? "font-black tracking-widest" : "font-medium"}`}>
                      {dept}
                    </span>
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full ml-2 flex-shrink-0 font-bold ${
                        isSelected
                          ? isLight
                            ? "bg-purple-600 text-white"
                            : "bg-black text-white"
                          : isLight
                          ? "bg-purple-50 text-purple-700 border border-purple-200"
                          : "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                      }`}
                    >
                      {String(count).padStart(2, "0")}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </Section>
      </div>

      {/* 2. LOWER PROJECT FEED SECTION */}
      <div className="relative w-full z-10 flex-grow">
        {/* AMBIENT GRADIENTS & ULTRA-SUBTLE SMALL GRID CANVAS */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div className={`absolute top-[5%] left-1/2 -translate-x-1/2 w-[950px] h-[950px] rounded-full blur-[200px] ${
            isLight ? "bg-purple-400/12" : "bg-purple-900/18"
          }`} />
          <div className={`absolute top-[35%] left-[8%] w-[800px] h-[800px] rounded-full blur-[180px] ${
            isLight ? "bg-pink-400/10" : "bg-pink-900/15"
          }`} />
          <div className={`absolute top-[65%] right-[5%] w-[850px] h-[850px] rounded-full blur-[190px] ${
            isLight ? "bg-indigo-400/10" : "bg-indigo-900/15"
          }`} />
          <div className={`absolute top-[88%] left-[20%] w-[900px] h-[900px] rounded-full blur-[210px] ${
            isLight ? "bg-purple-400/12" : "bg-red-900/15"
          }`} />

          <div
            className={`absolute inset-0 bg-[size:1.75rem_1.75rem] ${
              isLight
                ? "opacity-[0.04] bg-[linear-gradient(to_right,rgba(0,0,0,0.85)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.85)_1px,transparent_1px)]"
                : "opacity-[0.06] bg-[linear-gradient(to_right,rgba(255,255,255,0.85)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.85)_1px,transparent_1px)]"
            }`}
            style={{
              maskImage: "radial-gradient(circle at 50% 40%, black 85%, transparent 100%)",
              WebkitMaskImage: "radial-gradient(circle at 50% 40%, black 85%, transparent 100%)",
            }}
          />

          {randomStars.map((star, idx) => (
            <div
              key={idx}
              className={`absolute rounded-full animate-pulse ${star.size} ${
                isLight ? "bg-purple-600" : "bg-white"
              }`}
              style={{
                top: star.top,
                left: star.left,
                animationDelay: star.delay,
                opacity: 0.85,
                boxShadow: isLight
                  ? "0 0 10px rgba(147, 51, 234, 0.8), 0 0 18px rgba(147, 51, 234, 0.4)"
                  : "0 0 10px rgba(255, 255, 255, 0.9), 0 0 18px rgba(168, 85, 247, 0.5)",
              }}
            />
          ))}
        </div>

        {/* 2-COLUMN SIDE-BY-SIDE MAIN PROJECT FEED GRID */}
        <Section className="py-12 lg:py-16 relative z-10">
          <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
            {filteredProjects.map((project, idx) => (
              <WorkAnimatedCardTile
                key={project.id}
                project={project}
                isLight={isLight}
                delay={idx % 2 === 0 ? 0 : 150}
                onHoverVideo={(hovering) => setIsHoveringAnyVideo(hovering)}
              />
            ))}
          </div>
        </Section>
      </div>
    </div>
  );
}

"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Section } from "@/components/Section";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { PlaceholderBadge } from "@/components/PlaceholderBadge";
import { projectsData, getProjectBySlugOrId } from "@/data/projectsData";
import { soundEngine } from "@/utils/audio";
import {
  ArrowLeft,
  VolumeX,
  Volume2,
  CheckCircle2,
  TrendingUp,
  SlidersHorizontal,
  Compass,
  Film,
  ArrowUpRight,
  Play,
  Pause,
  Maximize2,
  RotateCcw,
  ExternalLink,
  X,
} from "lucide-react";

interface InteractiveVideoBlockProps {
  src: string;
  poster?: string;
  aspectRatio: "reel" | "landscape" | "square";
  borderColor: "purple" | "pink" | "red";
  autoPlay?: boolean;
  overlayTitle?: string;
}

function getVimeoId(src: string): string | null {
  if (!src) return null;
  const match = src.match(/(?:vimeo\.com\/|player\.vimeo\.com\/video\/)(\d+)/);
  if (match && match[1]) return match[1];
  if (/^\d+$/.test(src.trim())) return src.trim();
  return null;
}

function getYouTubeId(src: string): string | null {
  if (!src) return null;
  const shortsMatch = src.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/);
  if (shortsMatch && shortsMatch[1]) return shortsMatch[1];
  const watchMatch = src.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]+)/);
  if (watchMatch && watchMatch[1]) return watchMatch[1];
  if (/^[a-zA-Z0-9_-]{11}$/.test(src.trim())) return src.trim();
  return null;
}

function InteractiveVideoBlock({ src, poster, aspectRatio, overlayTitle }: InteractiveVideoBlockProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isActivated, setIsActivated] = useState(false);

  const youtubeId = getYouTubeId(src);
  const vimeoId = getVimeoId(src);
  const hasVideo = Boolean(src && (youtubeId || vimeoId || src.endsWith(".mp4") || src.includes("youtube") || src.includes("vimeo")));

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (hasVideo && videoRef.current) {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (hasVideo && videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleCardClick = () => {
    if (hasVideo) {
      if (youtubeId) {
        setIsActivated(true);
        setIsPlaying(true);
      } else if (vimeoId) {
        setIsActivated(true);
        setIsPlaying(true);
      } else if (videoRef.current) {
        if (videoRef.current.paused) {
          videoRef.current.play().catch(() => {});
          setIsPlaying(true);
        } else {
          videoRef.current.pause();
          setIsPlaying(false);
        }
      }
    }
  };

  const displayPoster = poster || (youtubeId ? `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg` : "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1200&q=80");

  return (
    <>
      <div className="relative group p-3 sm:p-4 w-full">
        {/* HORIZONTAL CROSSHAIR LINE TOP */}
        <div className="absolute top-3 sm:top-4 -left-3 -right-3 h-[1px] bg-gradient-to-r from-transparent via-purple-500/60 to-transparent pointer-events-none z-10" />

        {/* HORIZONTAL CROSSHAIR LINE BOTTOM */}
        <div className="absolute bottom-3 sm:bottom-4 -left-3 -right-3 h-[1px] bg-gradient-to-r from-transparent via-purple-500/60 to-transparent pointer-events-none z-10" />

        {/* VERTICAL CROSSHAIR LINE LEFT */}
        <div className="absolute left-3 sm:left-4 -top-3 -bottom-3 w-[1px] bg-gradient-to-b from-transparent via-purple-500/60 to-transparent pointer-events-none z-10" />

        {/* VERTICAL CROSSHAIR LINE RIGHT */}
        <div className="absolute right-3 sm:right-4 -top-3 -bottom-3 w-[1px] bg-gradient-to-b from-transparent via-purple-500/60 to-transparent pointer-events-none z-10" />

        {/* FOUR CORNER + TARGET MARKERS */}
        <div className="absolute top-1.5 left-1.5 z-20 text-purple-400 font-mono text-[10px] font-extrabold select-none opacity-80 group-hover:opacity-100 group-hover:text-purple-300 transition-all">+</div>
        <div className="absolute top-1.5 right-1.5 z-20 text-purple-400 font-mono text-[10px] font-extrabold select-none opacity-80 group-hover:opacity-100 group-hover:text-purple-300 transition-all">+</div>
        <div className="absolute bottom-1.5 left-1.5 z-20 text-purple-400 font-mono text-[10px] font-extrabold select-none opacity-80 group-hover:opacity-100 group-hover:text-purple-300 transition-all">+</div>
        <div className="absolute bottom-1.5 right-1.5 z-20 text-purple-400 font-mono text-[10px] font-extrabold select-none opacity-80 group-hover:opacity-100 group-hover:text-purple-300 transition-all">+</div>

        {/* INNER MEDIA CONTAINER */}
        <div
          onClick={handleCardClick}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className={`relative w-full rounded-2xl overflow-hidden bg-[#0A0A0C] border border-purple-500/30 group-hover:border-purple-500/80 transition-all duration-500 shadow-2xl group-hover:shadow-[0_0_40px_rgba(168,85,247,0.3)] cursor-pointer ${
            aspectRatio === "square"
              ? "aspect-square"
              : aspectRatio === "reel"
              ? "aspect-[9/16]"
              : "aspect-video"
          }`}
        >
          {hasVideo && isActivated && youtubeId ? (
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1&controls=1&enablejsapi=1`}
              title={overlayTitle || "Video player"}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full border-0 rounded-none"
            />
          ) : hasVideo && isActivated && vimeoId ? (
            <iframe
              src={`https://player.vimeo.com/video/${vimeoId}?autoplay=1&autopause=0`}
              title={overlayTitle || "Video player"}
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              className="w-full h-full border-0 rounded-none"
            />
          ) : hasVideo && src ? (
            <video
              ref={videoRef}
              src={src}
              poster={poster}
              muted={isMuted}
              loop
              playsInline
              preload="metadata"
              className="w-full h-full object-cover rounded-none"
            />
          ) : null}

          {/* COVER: VIDEO PREVIEW OR PHOTO DISPLAY */}
          {(!isActivated || !hasVideo) && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-[#08080A]">
              <img
                src={displayPoster}
                alt={overlayTitle || "Showcase content"}
                onError={(e) => {
                  const target = e.currentTarget;
                  if (!target.src.includes("unsplash.com")) {
                    target.src = "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1200&q=80";
                  }
                }}
                className={`w-full h-full ${
                  hasVideo
                    ? "object-cover grayscale contrast-110 brightness-90 group-hover:scale-105"
                    : "object-cover grayscale-0 contrast-100 brightness-100"
                } transition-all duration-500 rounded-none`}
              />

              {/* GRADIENT OVERLAY ONLY FOR VIDEO PREVIEWS */}
              {hasVideo && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10 rounded-none" />
              )}

              {/* PLAY BUTTON FOR VIDEOS ONLY */}
              {hasVideo && (
                <div className="absolute inset-0 flex items-center justify-center z-20">
                  <div className="w-14 h-14 rounded-full bg-purple-600/90 text-white flex items-center justify-center group-hover:scale-115 transition-transform duration-300 shadow-[0_0_20px_rgba(168,85,247,0.8)]">
                    <Play className="w-6 h-6 text-white fill-white ml-0.5" />
                  </div>
                </div>
              )}

              {overlayTitle && (
                <div className="absolute bottom-3 left-3 right-3 z-20 text-left pointer-events-none">
                  <span className="type-eyebrow text-[10px] font-mono text-purple-300 bg-purple-950/90 backdrop-blur-md px-2.5 py-1 rounded-md border border-purple-500/40 uppercase shadow-lg">
                    {overlayTitle}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function WordFadeInText({ text, delayOffset = 0 }: { text: string; delayOffset?: number }) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          } else {
            setIsVisible(false);
          }
        });
      },
      { threshold: 0.05 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, []);

  const words = text.split(" ");

  return (
    <span ref={ref} className="inline">
      {words.map((word, i) => (
        <span
          key={i}
          className="inline-block transition-all duration-200 ease-out transform-gpu mr-[0.25em]"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(6px)",
            transitionDelay: isVisible ? `${delayOffset + i * 0.01}s` : "0s",
          }}
        >
          {word}
        </span>
      ))}
    </span>
  );
}

function ScrollReveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
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
        isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-95"
      } ${className}`}
    >
      {children}
    </div>
  );
}

export default function WorkDetailPage() {
  const params = useParams();
  const rawId = params?.id;
  const slugOrId = Array.isArray(rawId) ? rawId[0] : (rawId as string);

  const isInvalidSlug = !slugOrId || slugOrId.toLowerCase() === "work" || slugOrId.toLowerCase() === "index";
  const project = isInvalidSlug ? undefined : getProjectBySlugOrId(slugOrId);

  React.useEffect(() => {
    if (project) {
      soundEngine.playWhooshSound();
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }
  }, [slugOrId, project]);

  if (isInvalidSlug || !project) {
    return (
      <div className="flex flex-col min-h-screen pt-36 pb-32 items-center justify-center text-center px-4 select-none">
        <h1 className="text-3xl sm:text-5xl font-extrabold font-headline text-white mb-4">
          Selected Work Archive
        </h1>
        <p className="text-zinc-400 mb-8 max-w-md text-sm sm:text-base">
          Exploring creative systems, commercial campaigns, and cinema production.
        </p>
        <Link
          href="/work"
          className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-purple-600 hover:bg-purple-500 text-white font-mono text-xs font-bold transition-all shadow-[0_0_25px_rgba(168,85,247,0.5)]"
        >
          ← View All Selected Work
        </Link>
      </div>
    );
  }

  const [isMuted, setIsMuted] = useState(false);

  return (
    <div className="flex flex-col min-h-screen pt-28 sm:pt-32 pb-20 select-none">
      {/* 1. TOP HEADER & BREADCRUMB */}
      <Section className="pt-8 pb-12">
        <div className="max-w-[1720px] mx-auto text-left px-4 sm:px-8 lg:px-12">
          <Link
            href="/work"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-purple-500/40 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 hover:text-purple-300 font-mono text-xs font-bold transition-all duration-300 shadow-sm hover:scale-[1.02] mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>BACK TO ALL WORK</span>
          </Link>

          <h1 className="type-section-h1 text-[var(--text-primary)] mb-6 max-w-5xl font-headline font-black">
            <WordFadeInText text={project.title} />
            <span className="tgs-gradient-text">.</span>
          </h1>

          <div className="space-y-4 mb-10 max-w-5xl text-[var(--text-muted)] text-sm sm:text-base leading-relaxed font-sans">
            {project.description && (
              <p>
                <WordFadeInText delayOffset={0.05} text={project.description} />
              </p>
            )}
            {project.paragraph2 && (
              <p>
                <WordFadeInText delayOffset={0.12} text={project.paragraph2} />
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-start gap-8 sm:gap-16 pt-6 border-t border-[var(--border-color)] text-left font-mono">
            <div>
              <span className="type-eyebrow text-[11px] text-[var(--text-muted)] block mb-1">
                CLIENT INDUSTRY
              </span>
              <span className="type-body text-sm font-medium text-[var(--text-primary)] whitespace-nowrap block">
                {project.industry || project.client}
              </span>
            </div>
            <div>
              <span className="type-eyebrow text-[11px] text-[var(--text-muted)] block mb-1">
                DELIVERABLES
              </span>
              <span className="type-body text-sm font-medium text-[var(--text-primary)] whitespace-nowrap block">
                {project.deliverablesText || project.duration}
              </span>
            </div>
            <div>
              <span className="type-eyebrow text-[11px] text-[var(--text-muted)] block mb-1">
                EXECUTION MODEL
              </span>
              <span className="type-body text-sm font-medium tgs-gradient-text font-bold whitespace-nowrap block">
                {project.executionModel || project.department || "Whole Production"}
              </span>
            </div>
          </div>
        </div>
      </Section>

      {/* 🎬 DYNAMIC MULTI-VIDEO SHOWCASE */}
      <Section className="relative py-16 border-y border-[var(--border-color)] bg-[var(--bg-main)] overflow-hidden">
        <div className="absolute inset-0 bg-architectural-grid pointer-events-none z-0" />

        <div className="relative z-10 max-w-[1720px] mx-auto space-y-12 sm:space-y-16 text-left px-4 sm:px-8 lg:px-12">
          {(() => {
            const showcaseList = project.showcaseVideos && project.showcaseVideos.length > 0
              ? project.showcaseVideos
              : project.videoUrl
              ? [{ src: project.videoUrl, title: project.title, aspectRatio: project.aspectRatio || "landscape" }]
              : [];

            const sections: { title: string; subtitle: string; aspectRatio: "reel" | "landscape" | "square"; videos: typeof showcaseList }[] = [];
            showcaseList.forEach((v) => {
              const secTitle = v.sectionTitle || (v.aspectRatio === "reel" ? project.department.toUpperCase() : "POST PRODUCTION");
              const secSub = v.sectionSubtitle || (v.aspectRatio === "reel" ? "Instagram" : "YouTube");
              const lastSec = sections[sections.length - 1];

              if (lastSec && lastSec.title === secTitle && lastSec.subtitle === secSub && lastSec.aspectRatio === v.aspectRatio) {
                lastSec.videos.push(v);
              } else {
                sections.push({ title: secTitle, subtitle: secSub, aspectRatio: v.aspectRatio, videos: [v] });
              }
            });

            return (
              <>
                {sections.map((sec, secIdx) => (
                  <ScrollReveal key={secIdx} className={`py-2 ${secIdx > 0 ? "border-t border-[var(--border-color)]/20 pt-8 sm:pt-12" : ""}`}>
                    {sec.aspectRatio === "square" ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto">
                        {sec.videos.map((video, idx) => (
                          <ScrollReveal key={idx} delay={idx * 150}>
                            <InteractiveVideoBlock
                              src={video.src}
                              poster={video.poster}
                              aspectRatio="square"
                              borderColor={idx % 2 === 0 ? "purple" : "pink"}
                              autoPlay={false}
                              overlayTitle={video.title}
                            />
                          </ScrollReveal>
                        ))}
                      </div>
                    ) : sec.aspectRatio === "reel" ? (
                      <div className="flex flex-wrap justify-center -mx-4">
                        {sec.videos.map((video, idx) => (
                          <div key={idx} className="w-full sm:w-1/2 md:w-1/3 px-4 mb-8 sm:mb-12 flex justify-center">
                            <ScrollReveal delay={(idx % 3) * 150} className="w-full">
                              <InteractiveVideoBlock
                                src={video.src}
                                poster={video.poster}
                                aspectRatio="reel"
                                borderColor={idx % 2 === 0 ? "purple" : "pink"}
                                autoPlay={false}
                                overlayTitle={video.title}
                              />
                            </ScrollReveal>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-12">
                        {sec.videos.map((video, idx) => (
                          <ScrollReveal key={idx} delay={200} className="max-w-6xl mx-auto">
                            <InteractiveVideoBlock
                              src={video.src}
                              poster={video.poster}
                              aspectRatio="landscape"
                              borderColor="red"
                              autoPlay={false}
                              overlayTitle={video.title}
                            />
                          </ScrollReveal>
                        ))}
                      </div>
                    )}
                  </ScrollReveal>
                ))}
              </>
            );
          })()}
        </div>
      </Section>
    </div>
  );
}

"use client";

import React, { useState, useEffect, useRef, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { PortalHeader } from "@/components/PortalHeader";
import { PortalBreadcrumbs } from "@/components/PortalBreadcrumbs";
import { useToast } from "@/context/ToastContext";
import { getVideoStatusBadge, formatDate } from "@/lib/portalConstants";
import {
  ArrowLeft,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Send,
  Check,
  Upload,
  RefreshCw,
  Clock,
  User,
  CheckSquare,
  Square,
  ExternalLink,
  ShieldCheck,
  Lock,
} from "lucide-react";

interface VideoData {
  id: string;
  project_id: string;
  name: string;
  file_url: string;
  master_file_url?: string;
  revision_round: number;
  max_revisions: number;
  status: string;
  uploaded_by?: string;
  created_at: string;
}

interface CommentData {
  id: string;
  video_id: string;
  user_id?: string;
  timestamp_seconds: number;
  comment_text: string;
  resolved: boolean;
  created_at: string;
  profiles?: {
    full_name: string;
    role: string;
  };
}

interface ProjectData {
  id: string;
  name: string;
  clients?: any;
}

export default function VideoReviewPage({
  params,
}: {
  params: Promise<{ id: string; videoId: string }>;
}) {
  const resolvedParams = use(params);
  const projectId = resolvedParams.id;
  const videoId = resolvedParams.videoId;

  const router = useRouter();
  const { addToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState("");
  const [userName, setUserName] = useState("User");
  const [userRole, setUserRole] = useState<"client" | "admin" | "team">("client");
  const [companyName, setCompanyName] = useState("");

  const [video, setVideo] = useState<VideoData | null>(null);
  const [project, setProject] = useState<ProjectData | null>(null);
  const [comments, setComments] = useState<CommentData[]>([]);

  // Video HTML5 Player state
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [highlightedCommentId, setHighlightedCommentId] = useState<string | null>(null);

  // New Comment Form state
  const [commentInput, setCommentInput] = useState("");
  const [isAddingComment, setIsAddingComment] = useState(false);
  const [submittingComment, setSubmittingComment] = useState(false);

  // Admin New Version Upload Modal state
  const [versionModalOpen, setVersionModalOpen] = useState(false);
  const [newVersionTitle, setNewVersionTitle] = useState("");
  const [newVersionUrl, setNewVersionUrl] = useState("");
  const [newMasterUrl, setNewMasterUrl] = useState("");
  const [versionLoading, setVersionLoading] = useState(false);

  // Action status messages
  const [actionMessage, setActionMessage] = useState("");
  const [actionError, setActionError] = useState("");

  useEffect(() => {
    async function loadReviewData() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const localUserRaw = typeof window !== "undefined" ? localStorage.getItem("gravity_portal_user") : null;
        const localUser = localUserRaw ? JSON.parse(localUserRaw) : null;

        if (!session?.user && !localUser) {
          router.replace("/portal/login");
          return;
        }

        if (localUser && (!session?.user || localUser.id.startsWith("temp-"))) {
          setCurrentUserId(localUser.id);
          setUserName(localUser.full_name || "User");
          setUserRole(localUser.role as any);
          setCompanyName(localUser.company_name || "Hero Motors");
          setVideo({
            id: videoId,
            project_id: projectId,
            name: "Hero Motors Commercial Cut v1",
            file_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
            revision_round: 1,
            max_revisions: 2,
            status: "pending_review",
            created_at: new Date().toISOString(),
          });
          setProject({
            id: projectId,
            name: "Hero Motors Commercial Campaign 2026",
            clients: { company_name: "Hero Motors" },
          });
          setComments([
            {
              id: "comm-1",
              video_id: videoId,
              user_id: "user-1",
              timestamp_seconds: 4,
              comment_text: "Adjust color grade on vehicle reflections in opening shot.",
              resolved: false,
              created_at: new Date().toISOString(),
              profiles: { full_name: "Anand Verma", role: "client" },
            },
            {
              id: "comm-2",
              video_id: videoId,
              user_id: "user-2",
              timestamp_seconds: 12,
              comment_text: "Sound mix level on background score locked.",
              resolved: true,
              created_at: new Date().toISOString(),
              profiles: { full_name: "Prameet Patani", role: "admin" },
            },
          ]);
          setLoading(false);
          return;
        }

        if (!session?.user) return;

        setCurrentUserId(session.user.id);

        // Fetch User Profile & Role
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name, role")
          .eq("id", session.user.id)
          .single();

        if (profile) {
          setUserName(profile.full_name || session.user.email || "User");
          setUserRole(profile.role as any);
        }

        // Fetch Client Membership
        const { data: clientMembers } = await supabase
          .from("client_members")
          .select("client_id, clients(company_name)")
          .eq("user_id", session.user.id);

        if (clientMembers && clientMembers.length > 0) {
          setCompanyName((clientMembers[0].clients as any)?.company_name || "");
        }

        // Fetch Video Data
        const { data: vidData, error: vidErr } = await supabase
          .from("videos")
          .select("*")
          .eq("id", videoId)
          .single();

        if (vidErr || !vidData) {
          console.error("Video fetch error:", vidErr);
          setLoading(false);
          return;
        }

        const vData = vidData as VideoData;
        setVideo(vData);
        setNewVersionTitle(`${vData.name} (New Cut)`);

        // Fetch Project Info
        const { data: projData } = await supabase
          .from("projects")
          .select("id, name, clients(company_name)")
          .eq("id", projectId)
          .single();
        if (projData) setProject(projData as ProjectData);

        // Fetch Timecoded Comments
        const { data: commData } = await supabase
          .from("video_comments")
          .select("*, profiles(full_name, role)")
          .eq("video_id", videoId)
          .order("timestamp_seconds", { ascending: true });

        if (commData) setComments(commData as CommentData[]);
      } catch (err) {
        console.error("Error loading video review page:", err);
      } finally {
        setLoading(false);
      }
    }

    loadReviewData();
  }, [projectId, videoId, router]);

  // Video Player Event Handlers
  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const seekToTime = (seconds: number, commentId?: string) => {
    if (videoRef.current) {
      videoRef.current.currentTime = seconds;
      setCurrentTime(seconds);
      if (commentId) {
        setHighlightedCommentId(commentId);
        const el = document.getElementById(`comment-${commentId}`);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    }
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return "00:00";
    const mins = Math.floor(secs / 60);
    const remainder = Math.floor(secs % 60);
    return `${mins.toString().padStart(2, "0")}:${remainder.toString().padStart(2, "0")}`;
  };

  // Add Timecoded Comment
  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim() || !video) return;
    setSubmittingComment(true);

    const ts = Math.floor(currentTime);

    try {
      const { data, error } = await supabase
        .from("video_comments")
        .insert({
          video_id: videoId,
          user_id: currentUserId,
          timestamp_seconds: ts,
          comment_text: commentInput.trim(),
          resolved: false,
        })
        .select("*, profiles(full_name, role)")
        .single();

      if (!error && data) {
        setComments((prev) =>
          [...prev, data as CommentData].sort(
            (a, b) => a.timestamp_seconds - b.timestamp_seconds
          )
        );
        setCommentInput("");
        setIsAddingComment(false);
        addToast("Comment pinned", "Timecoded comment added to video timeline.", "success");

        await supabase.from("activity_log").insert({
          project_id: projectId,
          action: `Timecoded comment added on "${video.name}" at ${formatTime(ts)} by ${userName}`,
        });
      }
    } catch (err) {
      console.error("Add comment error:", err);
    } finally {
      setSubmittingComment(false);
    }
  };

  // Toggle Comment Resolved Status (Admin / Team action)
  const handleToggleResolved = async (commentId: string, currentResolved: boolean) => {
    if (userRole === "client") return; // Resolution is a team action

    const nextResolved = !currentResolved;
    try {
      const { error } = await supabase
        .from("video_comments")
        .update({ resolved: nextResolved })
        .eq("id", commentId);

      if (!error) {
        setComments((prev) =>
          prev.map((c) => (c.id === commentId ? { ...c, resolved: nextResolved } : c))
        );
      }
    } catch (err) {
      console.error("Toggle resolved error:", err);
    }
  };

  // Client Action 1: Approve Deliverable
  const handleApproveVideo = async () => {
    if (!video) return;
    setActionMessage("");
    setActionError("");

    try {
      const { error } = await supabase
        .from("videos")
        .update({ status: "approved" })
        .eq("id", videoId);

      if (error) {
        setActionError(error.message);
      } else {
        setVideo((prev) => (prev ? { ...prev, status: "approved" } : null));
        setActionMessage("Deliverable approved successfully! Thank you.");
        addToast("Deliverable approved!", "Video cut marked as approved.", "success");

        await supabase.from("activity_log").insert({
          project_id: projectId,
          action: `Deliverable approved: "${video.name}" by Client (${userName})`,
        });
      }
    } catch (err: any) {
      setActionError(err.message || "Failed to approve deliverable.");
    }
  };

  // Client Action 2: Request Changes (Increments revision_round)
  const handleRequestChanges = async () => {
    if (!video) return;
    setActionMessage("");
    setActionError("");

    if (video.revision_round >= video.max_revisions) {
      setActionError("You have used all included revision rounds for this deliverable.");
      return;
    }

    const nextRound = video.revision_round + 1;

    try {
      const { error } = await supabase
        .from("videos")
        .update({
          status: "changes_requested",
          revision_round: nextRound,
        })
        .eq("id", videoId);

      if (error) {
        setActionError(error.message);
      } else {
        setVideo((prev) =>
          prev ? { ...prev, status: "changes_requested", revision_round: nextRound } : null
        );
        setActionMessage(`Changes requested. Revision round updated to ${nextRound} of ${video.max_revisions}.`);

        await supabase.from("activity_log").insert({
          project_id: projectId,
          action: `Changes requested on "${video.name}" by Client (${userName}) — Revision round ${nextRound} of ${video.max_revisions}`,
        });
      }
    } catch (err: any) {
      setActionError(err.message || "Failed to request changes.");
    }
  };

  // Admin Action: Upload New Video Version
  const handleUploadNewVersion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVersionTitle || !newVersionUrl || !video) return;
    setVersionLoading(true);

    try {
      const { data, error } = await supabase
        .from("videos")
        .update({
          name: newVersionTitle,
          file_url: newVersionUrl,
          master_file_url: newMasterUrl || video.master_file_url || null,
          status: "pending_review",
        })
        .eq("id", videoId)
        .select("*")
        .single();

      if (!error && data) {
        setVideo(data as VideoData);
        setVersionModalOpen(false);
        setActionMessage("New video version uploaded successfully!");

        await supabase.from("activity_log").insert({
          project_id: projectId,
          action: `New video version uploaded: "${newVersionTitle}" by Admin (${userName})`,
        });
      }
    } catch (err: any) {
      setActionError(err.message || "Failed to upload new video version.");
    } finally {
      setVersionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-primary)] flex items-center justify-center font-mono text-xs">
        <div className="flex items-center gap-3 px-6 py-4 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)]">
          <div className="w-4 h-4 rounded-full border-2 border-purple-500 border-t-transparent animate-spin" />
          <span>INITIALIZING VIDEO REVIEW PLAYER...</span>
        </div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-primary)] flex flex-col font-sans">
        <PortalHeader userName={userName} companyName={companyName} userRole={userRole} />
        <main className="flex-grow max-w-[1280px] w-full mx-auto px-4 sm:px-8 py-16 text-center">
          <div className="p-12 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-surface)] max-w-lg mx-auto">
            <AlertCircle className="w-12 h-12 text-rose-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold font-headline text-[var(--text-primary)] mb-2">
              Deliverable Not Found
            </h2>
            <Link
              href={`/portal/projects/${projectId}`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full tgs-gradient-bg text-white font-mono text-xs font-bold uppercase"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Project</span>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const statusBadge = getVideoStatusBadge(video.status);
  const isMaxRevisionsReached = video.revision_round >= video.max_revisions;

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-primary)] flex flex-col font-sans transition-colors">
      <PortalHeader userName={userName} companyName={companyName} userRole={userRole} />

      <main className="flex-grow max-w-[1280px] w-full mx-auto px-4 sm:px-8 py-8 space-y-6">
        {/* Back Navigation Bar */}
        <div className="flex items-center justify-between">
          <Link
            href={`/portal/projects/${projectId}`}
            className="inline-flex items-center gap-2 text-xs font-mono text-[var(--text-muted)] hover:text-purple-400 transition-colors uppercase tracking-wider"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Project</span>
          </Link>

          {/* Admin/Team: Upload New Version Button */}
          {(userRole === "admin" || userRole === "team") && (
            <button
              onClick={() => setVersionModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-mono text-xs font-bold uppercase transition-all shadow-[0_0_15px_rgba(168,85,247,0.3)] cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload New Version</span>
            </button>
          )}
        </div>

        {/* Video Title & Status Header Banner */}
        <div className="p-6 sm:p-7 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-surface)] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <span className="type-eyebrow text-xs font-mono text-purple-400 font-bold uppercase tracking-widest">
                TIMECODED VIDEO REVIEW
              </span>
              <span className={`px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase border ${statusBadge.className}`}>
                {statusBadge.label}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold font-headline text-[var(--text-primary)] tracking-tight">
              {video.name}
            </h1>
          </div>

          {/* REVISION ROUND INDICATOR */}
          <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-[var(--bg-main)] border border-purple-500/30 shrink-0 self-start md:self-auto">
            <RefreshCw className="w-4 h-4 text-purple-400" />
            <div className="flex flex-col">
              <span className="type-eyebrow text-[9px] font-mono text-[var(--text-muted)] uppercase">REVISION ROUND</span>
              <span className="text-xs font-mono font-bold text-purple-300">
                Revision {video.revision_round} of {video.max_revisions} Used
              </span>
            </div>
          </div>
        </div>

        {/* Status Action Messages */}
        {actionMessage && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{actionMessage}</span>
          </div>
        )}

        {actionError && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{actionError}</span>
          </div>
        )}

        {/* 1. CUSTOM HTML5 <VIDEO> PLAYER & CONTROLS */}
        <div className="rounded-3xl border border-[var(--border-color)] bg-black overflow-hidden shadow-2xl relative">
          <div className="relative aspect-video w-full bg-black flex items-center justify-center">
            <video
              ref={videoRef}
              src={video.file_url}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onEnded={() => setIsPlaying(false)}
              className="w-full h-full object-contain cursor-pointer"
              onClick={togglePlay}
              playsInline
            />

            {/* Big Play Overlay Button when Paused */}
            {!isPlaying && (
              <button
                onClick={togglePlay}
                aria-label="Play Video"
                className="absolute w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-purple-600/90 text-white flex items-center justify-center hover:scale-110 transition-transform shadow-[0_0_30px_rgba(168,85,247,0.7)] cursor-pointer"
              >
                <Play className="w-8 h-8 fill-white ml-1" />
              </button>
            )}
          </div>

          {/* Player Custom Control Bar */}
          <div className="p-4 bg-[#0e0e13] border-t border-white/10 flex items-center justify-between gap-4 font-mono text-xs text-white">
            <div className="flex items-center gap-3">
              <button
                onClick={togglePlay}
                className="p-2 rounded-xl bg-purple-600/30 hover:bg-purple-600 text-white transition-colors cursor-pointer"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
              </button>

              <button
                onClick={toggleMute}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 transition-colors cursor-pointer"
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
              </button>

              <span className="text-zinc-400 text-xs">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            {/* "Add Comment at Current Time" Action */}
            <button
              onClick={() => {
                if (videoRef.current) videoRef.current.pause();
                setIsPlaying(false);
                setIsAddingComment(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl tgs-gradient-bg text-white font-bold text-xs uppercase hover:scale-105 transition-all shadow-[0_0_15px_rgba(168,85,247,0.3)] cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>+ Pin Comment at {formatTime(currentTime)}</span>
            </button>
          </div>

          {/* 2. HORIZONTAL TIMELINE STRIP WITH TIMECODED COMMENT MARKERS */}
          <div className="relative w-full h-8 bg-[#14131A] border-t border-white/10 flex items-center px-2 select-none group">
            {/* Clickable Progress Scrub Track */}
            <div
              className="relative w-full h-2.5 bg-zinc-800 rounded-full cursor-pointer overflow-visible"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const ratio = Math.max(0, Math.min(1, clickX / rect.width));
                if (duration > 0) seekToTime(ratio * duration);
              }}
            >
              {/* Playhead Filled Line */}
              <div
                className="h-full bg-gradient-to-r from-purple-600 to-fuchsia-500 rounded-full relative"
                style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
              />

              {/* TIMECODED COMMENT MARKERS / PINS */}
              {duration > 0 &&
                comments.map((comm) => {
                  const leftPercent = (comm.timestamp_seconds / duration) * 100;
                  const isHighlighted = comm.id === highlightedCommentId;
                  return (
                    <button
                      key={comm.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        seekToTime(comm.timestamp_seconds, comm.id);
                      }}
                      title={`${formatTime(comm.timestamp_seconds)} — ${comm.profiles?.full_name || "Comment"}: ${comm.comment_text}`}
                      className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 transition-transform cursor-pointer group/pin ${
                        isHighlighted
                          ? "w-4 h-4 bg-amber-400 border-2 border-white z-30 scale-125 rounded-full shadow-[0_0_10px_rgba(251,191,36,0.9)]"
                          : comm.resolved
                          ? "w-3 h-3 bg-emerald-500 border border-white z-20 rounded-full"
                          : "w-3.5 h-3.5 bg-purple-400 border border-white z-20 hover:scale-125 rounded-full shadow-[0_0_8px_rgba(168,85,247,0.8)]"
                      }`}
                      style={{ left: `${leftPercent}%` }}
                    >
                      {/* Hover Tooltip */}
                      <div className="opacity-0 group-hover/pin:opacity-100 pointer-events-none absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-lg bg-black/95 text-[10px] font-mono font-bold text-white whitespace-nowrap border border-purple-500/40 shadow-xl transition-opacity z-40">
                        {formatTime(comm.timestamp_seconds)} • {comm.profiles?.full_name || "User"}
                      </div>
                    </button>
                  );
                })}
            </div>
          </div>
        </div>

        {/* ADD COMMENT INLINE FORM */}
        {isAddingComment && (
          <div className="p-5 rounded-2xl border border-purple-500/50 bg-[#111015] shadow-2xl animate-fade-in font-mono text-xs">
            <div className="flex items-center justify-between mb-3">
              <span className="font-bold text-purple-300 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-purple-400" />
                <span>Pin Comment at {formatTime(currentTime)}</span>
              </span>
              <button
                type="button"
                onClick={() => setIsAddingComment(false)}
                className="text-zinc-500 hover:text-white"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleAddComment} className="space-y-3">
              <textarea
                rows={3}
                required
                autoFocus
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                placeholder="Describe your feedback at this specific timestamp..."
                className="w-full bg-[#18171E] border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder:text-zinc-600 focus:outline-none focus:border-purple-500"
              />

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddingComment(false)}
                  className="px-4 py-2 rounded-xl bg-white/10 text-white font-bold uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingComment}
                  className="px-5 py-2 rounded-xl tgs-gradient-bg text-white font-bold uppercase hover:scale-105 transition-all disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{submittingComment ? "Saving..." : "Post Comment"}</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* CLIENT APPROVAL / REVISION ACTION BUTTONS (VISIBLE WHEN PENDING REVIEW) */}
        {userRole === "client" && video.status === "pending_review" && (
          <div className="p-6 rounded-3xl border border-purple-500/30 bg-[var(--bg-surface)]">
            <h3 className="type-eyebrow text-xs font-mono text-purple-400 uppercase tracking-widest mb-2 font-bold">
              DELIVERABLE ACTION & APPROVAL
            </h3>
            <p className="text-xs text-[var(--text-muted)] mb-6">
              Review the video cut above. You can either approve the deliverable or request changes.
            </p>

            {/* MAX REVISIONS EXCEEDED WARNING */}
            {isMaxRevisionsReached ? (
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono flex items-start gap-3 mb-4">
                <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-amber-300 mb-1">Included Revision Limit Reached</p>
                  <p className="text-zinc-300">
                    You've used both included revision rounds for this deliverable. Please reach out to discuss next steps.
                  </p>
                </div>
              </div>
            ) : null}

            <div className="flex flex-wrap items-center gap-4">
              {/* Request Changes Button */}
              {!isMaxRevisionsReached && (
                <button
                  onClick={handleRequestChanges}
                  className="px-6 py-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/40 text-amber-300 font-mono text-xs font-bold uppercase tracking-wider hover:bg-amber-500/20 hover:scale-105 transition-all cursor-pointer"
                >
                  Request Changes (Use Revision Round {video.revision_round + 1})
                </button>
              )}

              {/* Approve Button */}
              <button
                onClick={handleApproveVideo}
                className="px-8 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold uppercase tracking-wider hover:scale-105 transition-all shadow-[0_0_20px_rgba(16,185,129,0.4)] flex items-center gap-2 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Approve Deliverable</span>
              </button>
            </div>
          </div>
        )}

        {/* 3. TIMECODED COMMENT LIST BELOW PLAYER */}
        <div className="p-6 sm:p-8 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-surface)]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="type-eyebrow text-xs font-mono text-purple-400 uppercase tracking-widest font-bold flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              <span>TIMECODED COMMENTS ({comments.length})</span>
            </h3>

            <span className="type-eyebrow text-[10px] font-mono text-[var(--text-muted)]">
              Click timestamp to seek video
            </span>
          </div>

          {comments.length === 0 ? (
            <div className="py-12 text-center text-xs font-mono text-[var(--text-muted)] border border-dashed border-[var(--border-color)] rounded-2xl">
              No timecoded comments pinned yet. Use the "+ Pin Comment" button on the player control bar to leave feedback.
            </div>
          ) : (
            <div className="space-y-4 font-mono text-xs">
              {comments.map((comm) => {
                const isHighlighted = comm.id === highlightedCommentId;
                const authorRole = comm.profiles?.role || "client";
                return (
                  <div
                    id={`comment-${comm.id}`}
                    key={comm.id}
                    className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                      isHighlighted
                        ? "border-amber-400 bg-amber-500/10 shadow-[0_0_20px_rgba(251,191,36,0.15)]"
                        : comm.resolved
                        ? "border-[var(--border-color)] bg-[var(--bg-main)] opacity-60"
                        : "border-[var(--border-color)] bg-[var(--bg-main)] hover:border-purple-500/40"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        {/* Pinned Timestamp Seek Button */}
                        <button
                          onClick={() => seekToTime(comm.timestamp_seconds, comm.id)}
                          className="px-3 py-1 rounded-xl bg-purple-600/30 hover:bg-purple-600 border border-purple-400/40 text-purple-300 hover:text-white font-bold text-xs shrink-0 transition-all cursor-pointer flex items-center gap-1.5"
                        >
                          <Clock className="w-3.5 h-3.5" />
                          <span>{formatTime(comm.timestamp_seconds)}</span>
                        </button>

                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-[var(--text-primary)]">
                              {comm.profiles?.full_name || "User"}
                            </span>
                            <span className="type-eyebrow text-[9px] text-purple-400 px-2 py-0.5 rounded-full bg-purple-500/10 uppercase">
                              {authorRole}
                            </span>
                          </div>
                          <p className="text-xs text-[var(--text-muted)] mt-1 leading-relaxed">
                            {comm.comment_text}
                          </p>
                        </div>
                      </div>

                      {/* RESOLVED CHECKBOX (Admin/Team can toggle; Client views status) */}
                      <div className="shrink-0">
                        <button
                          type="button"
                          onClick={() => handleToggleResolved(comm.id, comm.resolved)}
                          disabled={userRole === "client"}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[10px] font-bold uppercase transition-all ${
                            comm.resolved
                              ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-300"
                              : "bg-zinc-800/40 border-zinc-700/50 text-zinc-400"
                          } ${userRole !== "client" ? "cursor-pointer hover:scale-105" : "cursor-default"}`}
                        >
                          {comm.resolved ? (
                            <>
                              <CheckSquare className="w-3.5 h-3.5 text-emerald-400" />
                              <span>RESOLVED</span>
                            </>
                          ) : (
                            <>
                              <Square className="w-3.5 h-3.5" />
                              <span>UNRESOLVED</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* ADMIN / TEAM: UPLOAD NEW VERSION MODAL */}
      {versionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#111015] border border-white/10 rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative font-mono text-xs">
            <div className="h-[2px] w-full bg-gradient-to-r from-purple-600 via-purple-400 to-fuchsia-500 absolute top-0 left-0 right-0 rounded-t-2xl" />

            <h3 className="text-xl font-bold font-headline text-white mb-2 mt-1">
              Upload New Video Version
            </h3>
            <p className="text-xs text-zinc-400 mb-6">
              Update the review copy asset URL and version title for this deliverable.
            </p>

            <form onSubmit={handleUploadNewVersion} className="space-y-4">
              <div>
                <label className="block text-zinc-400 mb-1 uppercase tracking-wider text-[10px]">
                  Version Title *
                </label>
                <input
                  type="text"
                  required
                  value={newVersionTitle}
                  onChange={(e) => setNewVersionTitle(e.target.value)}
                  className="w-full bg-[#18171E] border border-white/10 rounded-xl px-4 py-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 uppercase tracking-wider text-[10px]">
                  New Review Copy Video URL *
                </label>
                <input
                  type="text"
                  required
                  value={newVersionUrl}
                  onChange={(e) => setNewVersionUrl(e.target.value)}
                  placeholder="Supabase Storage path or video URL"
                  className="w-full bg-[#18171E] border border-white/10 rounded-xl px-4 py-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 uppercase tracking-wider text-[10px]">
                  Master File Drive Link (Optional)
                </label>
                <input
                  type="text"
                  value={newMasterUrl}
                  onChange={(e) => setNewMasterUrl(e.target.value)}
                  placeholder="Google Drive link for full-res master"
                  className="w-full bg-[#18171E] border border-white/10 rounded-xl px-4 py-2.5 text-white"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setVersionModalOpen(false)}
                  className="w-1/2 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold uppercase transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={versionLoading}
                  className="w-1/2 py-3 rounded-xl tgs-gradient-bg text-white font-bold uppercase hover:scale-[1.02] transition-all disabled:opacity-50"
                >
                  {versionLoading ? "Saving..." : "Save Version"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

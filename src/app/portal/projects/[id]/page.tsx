"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { PortalTopHeader } from "@/components/PortalTopHeader";
import { PortalSidebar } from "@/components/PortalSidebar";
import { PortalRightSidebar } from "@/components/PortalRightSidebar";
import { PortalBreadcrumbs } from "@/components/PortalBreadcrumbs";
import { PortalEmptyState } from "@/components/PortalEmptyState";
import { SkeletonCard, SkeletonList } from "@/components/PortalSkeletons";
import { useToast } from "@/context/ToastContext";
import {
  SIX_PHASES,
  getPhaseInfo,
  getStatusBadge,
  formatDate,
} from "@/lib/portalConstants";
import {
  ArrowLeft,
  FileText,
  Video as VideoIcon,
  Receipt,
  Download,
  CheckCircle2,
  AlertCircle,
  Activity,
  ChevronRight,
} from "lucide-react";

interface ProjectData {
  id: string;
  client_id: string;
  name: string;
  description?: string;
  phase: string;
  status: string;
  start_date?: string;
  target_end_date?: string;
  created_at: string;
}

interface DocumentItem {
  id: string;
  project_id: string;
  name: string;
  file_url: string;
  version: number;
  created_at: string;
}

interface VideoItem {
  id: string;
  project_id: string;
  name: string;
  file_url: string;
  master_file_url?: string;
  revision_round: number;
  max_revisions: number;
  status: string;
  created_at: string;
}

interface InvoiceItem {
  id: string;
  project_id: string;
  invoice_number: string;
  amount: number;
  currency: string;
  due_date: string;
  status: string;
  file_url?: string;
  created_at: string;
}

interface ActivityItem {
  id: string;
  project_id: string;
  user_id?: string;
  action: string;
  created_at: string;
}

export default function SingleProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const projectId = resolvedParams.id;
  const router = useRouter();
  const { addToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("Client");
  const [companyName, setCompanyName] = useState("");
  const [project, setProject] = useState<ProjectData | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "documents" | "videos" | "invoices">("overview");

  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [invoices, setInvoices] = useState<InvoiceItem[]>([]);
  const [activities, setActivities] = useState<ActivityItem[]>([]);

  useEffect(() => {
    async function loadProjectData() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const localUserRaw = typeof window !== "undefined" ? localStorage.getItem("gravity_portal_user") : null;
        const localUser = localUserRaw ? JSON.parse(localUserRaw) : null;

        if (!session?.user && !localUser) {
          router.replace("/portal/login");
          return;
        }

        if (localUser && (!session?.user || localUser.id.startsWith("temp-"))) {
          setUserName(localUser.full_name || "Anand Verma");
          setCompanyName(localUser.company_name || "Hero Motors");
          setProject({
            id: projectId,
            client_id: "demo-client",
            name: "Hero Motors Commercial Campaign 2026",
            description: "Full-scale brand film and social content pipeline for upcoming vehicle launch.",
            phase: "production",
            status: "on_track",
            start_date: "2026-09-01",
            target_end_date: "2026-10-31",
            created_at: new Date().toISOString(),
          });
          setActivities([
            { id: "act-1", project_id: projectId, action: "Project initialized and scope locked.", created_at: new Date().toISOString() },
            { id: "act-2", project_id: projectId, action: "Video cut v1 uploaded for client review.", created_at: new Date().toISOString() },
          ]);
          setDocuments([
            { id: "doc-1", project_id: projectId, name: "Brand Creative Brief & Treatments", file_url: "#", version: 1, created_at: new Date().toISOString() },
          ]);
          setVideos([
            { id: "demo-vid", project_id: projectId, name: "Hero Motors Commercial Cut v1", file_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4", revision_round: 1, max_revisions: 2, status: "pending_review", created_at: new Date().toISOString() },
          ]);
          setInvoices([
            { id: "inv-1", project_id: projectId, invoice_number: "TGS-2026-001", amount: 250000, currency: "INR", due_date: "2026-09-15", status: "unpaid", created_at: new Date().toISOString() },
          ]);
          setLoading(false);
          return;
        }

        if (!session?.user) return;

        // Fetch User Profile
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name, role")
          .eq("id", session.user.id)
          .single();

        if (profile) {
          setUserName(profile.full_name || session.user.email || "Client");
          if (profile.role === "admin" || profile.role === "team") {
            router.replace("/portal/admin/dashboard");
            return;
          }
        }

        // Fetch Client Company
        const { data: clientMembers } = await supabase
          .from("client_members")
          .select("client_id, clients(company_name)")
          .eq("user_id", session.user.id);

        if (clientMembers && clientMembers.length > 0) {
          setCompanyName((clientMembers[0].clients as any)?.company_name || "");
        }

        // Fetch Project
        const { data: projData, error: projErr } = await supabase
          .from("projects")
          .select("*")
          .eq("id", projectId)
          .single();

        if (projErr || !projData) {
          console.error("Project fetch error:", projErr);
          setLoading(false);
          return;
        }

        setProject(projData as ProjectData);

        // Fetch Activity Log
        const { data: actData } = await supabase
          .from("activity_log")
          .select("*")
          .eq("project_id", projectId)
          .order("created_at", { ascending: false })
          .limit(10);
        if (actData) setActivities(actData as ActivityItem[]);

        // Fetch Documents
        const { data: docData } = await supabase
          .from("documents")
          .select("*")
          .eq("project_id", projectId)
          .order("version", { ascending: false });
        if (docData) setDocuments(docData as DocumentItem[]);

        // Fetch Videos
        const { data: vidData } = await supabase
          .from("videos")
          .select("*")
          .eq("project_id", projectId)
          .order("created_at", { ascending: false });
        if (vidData) setVideos(vidData as VideoItem[]);

        // Fetch Invoices
        const { data: invData } = await supabase
          .from("invoices")
          .select("*")
          .eq("project_id", projectId)
          .order("due_date", { ascending: false });
        if (invData) setInvoices(invData as InvoiceItem[]);
      } catch (err) {
        console.error("Error loading project:", err);
      } finally {
        setLoading(false);
      }
    }

    loadProjectData();
  }, [projectId, router]);

  const handleDownloadDoc = (docName: string) => {
    addToast("File download initiated", `Downloading "${docName}".`, "success");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-primary)] flex flex-col font-sans">
        <PortalTopHeader userName={userName} companyName={companyName} userRole="client" />
        <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-8 py-12 flex flex-col lg:flex-row gap-6">
          <PortalSidebar companyName={companyName} userRole="client" />
          <main className="flex-grow space-y-6">
            <SkeletonCard />
            <SkeletonList />
          </main>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-primary)] flex flex-col font-sans">
        <PortalTopHeader userName={userName} companyName={companyName} userRole="client" />
        <main className="flex-grow max-w-[1400px] w-full mx-auto px-4 sm:px-8 py-16 text-center">
          <div className="p-12 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-surface)] max-w-lg mx-auto">
            <AlertCircle className="w-12 h-12 text-rose-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold font-headline text-[var(--text-primary)] mb-2">Project Not Found</h2>
            <Link
              href="/portal/dashboard"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full tgs-gradient-bg text-white font-mono text-xs font-bold uppercase"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const currentPhaseInfo = getPhaseInfo(project.phase);
  const statusBadge = getStatusBadge(project.status);

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-primary)] flex flex-col font-sans transition-colors">
      <PortalTopHeader userName={userName} companyName={companyName} userRole="client" />

      <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-8 pb-12 flex flex-col lg:flex-row gap-6">
        <PortalSidebar companyName={companyName} projectName={project.name} userRole="client" />

        <main className="flex-grow space-y-6">
          <PortalBreadcrumbs
            items={[
              { label: "Projects", href: "/portal/dashboard" },
              { label: companyName || "Hero Motors" },
              { label: project.name },
            ]}
          />

          {/* Project Header Banner */}
          <div className="p-6 sm:p-7 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-surface)] shadow-[0_10px_30px_rgba(0,0,0,0.03)]">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
              <div>
                <div className="flex items-center gap-3 flex-wrap mb-2">
                  <span className="type-eyebrow text-xs font-mono text-purple-400 tracking-widest uppercase font-bold">
                    PROJECT VIEW
                  </span>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-mono font-bold uppercase ${statusBadge.className}`}>
                    {statusBadge.label}
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-extrabold font-headline tracking-tight text-[var(--text-primary)]">
                  {project.name}
                </h1>

                {project.description && (
                  <p className="type-body text-xs sm:text-sm text-[var(--text-muted)] mt-2 leading-relaxed">
                    {project.description}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-3 bg-[var(--bg-main)] border border-purple-500/30 px-4 py-3 rounded-2xl shrink-0">
                <div className="w-8 h-8 rounded-xl bg-purple-600/30 border border-purple-400/40 flex items-center justify-center text-xs font-mono font-bold text-purple-300">
                  {currentPhaseInfo.number}
                </div>
                <div className="flex flex-col">
                  <span className="type-eyebrow text-[9px] font-mono text-[var(--text-muted)] uppercase">CURRENT PHASE</span>
                  <span className="text-xs font-bold text-purple-300 font-headline uppercase">{currentPhaseInfo.name}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tab Navigation Controls */}
          <div className="flex items-center gap-2 border-b border-[var(--border-color)] pb-1">
            <button
              onClick={() => setActiveTab("overview")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl font-mono text-xs font-bold uppercase tracking-wider transition-all border-b-2 cursor-pointer ${
                activeTab === "overview"
                  ? "border-purple-500 text-purple-400 bg-purple-500/10"
                  : "border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>Overview</span>
            </button>

            <button
              onClick={() => setActiveTab("documents")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl font-mono text-xs font-bold uppercase tracking-wider transition-all border-b-2 cursor-pointer ${
                activeTab === "documents"
                  ? "border-purple-500 text-purple-400 bg-purple-500/10"
                  : "border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Documents ({documents.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("videos")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl font-mono text-xs font-bold uppercase tracking-wider transition-all border-b-2 cursor-pointer ${
                activeTab === "videos"
                  ? "border-purple-500 text-purple-400 bg-purple-500/10"
                  : "border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              }`}
            >
              <VideoIcon className="w-4 h-4" />
              <span>Videos ({videos.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("invoices")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl font-mono text-xs font-bold uppercase tracking-wider transition-all border-b-2 cursor-pointer ${
                activeTab === "invoices"
                  ? "border-purple-500 text-purple-400 bg-purple-500/10"
                  : "border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              }`}
            >
              <Receipt className="w-4 h-4" />
              <span>Invoices ({invoices.length})</span>
            </button>
          </div>

          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Six Phase Tracker */}
              <div className="p-6 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-surface)]">
                <h3 className="type-eyebrow text-xs font-mono text-purple-400 uppercase tracking-widest mb-6 font-bold">
                  SIX-PHASE SYSTEM TRACKER
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                  {SIX_PHASES.map((p) => {
                    const isCurrent = p.id === project.phase;
                    const isCompleted = p.stepIndex < currentPhaseInfo.stepIndex;

                    return (
                      <div
                        key={p.id}
                        className={`p-3.5 rounded-2xl border flex flex-col justify-between transition-all ${
                          isCurrent
                            ? "border-purple-500 bg-purple-500/15 shadow-md scale-[1.02]"
                            : isCompleted
                            ? "border-purple-500/30 bg-[var(--bg-main)]"
                            : "border-[var(--border-color)] bg-[var(--bg-main)] opacity-50"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-mono font-bold text-purple-300">{p.number}</span>
                          {isCompleted && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                        </div>
                        <span className="text-xs font-bold uppercase">{p.name}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Timeline & Activity Feed */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-surface)]">
                  <h3 className="type-eyebrow text-xs font-mono text-purple-400 uppercase tracking-widest mb-4 font-bold">
                    TIMELINE
                  </h3>
                  <div className="space-y-3 font-mono text-xs">
                    <div className="flex justify-between p-3 rounded-2xl bg-[var(--bg-main)] border border-[var(--border-color)]">
                      <span className="text-[var(--text-muted)]">Start Date</span>
                      <span className="font-bold">{formatDate(project.start_date)}</span>
                    </div>
                    <div className="flex justify-between p-3 rounded-2xl bg-[var(--bg-main)] border border-[var(--border-color)]">
                      <span className="text-[var(--text-muted)]">Target End</span>
                      <span className="font-bold text-purple-300">{formatDate(project.target_end_date)}</span>
                    </div>
                  </div>
                </div>

                <div className="p-6 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-surface)]">
                  <h3 className="type-eyebrow text-xs font-mono text-purple-400 uppercase tracking-widest mb-4 font-bold">
                    RECENT ACTIVITY
                  </h3>
                  <div className="space-y-2 font-sans text-xs">
                    {activities.map((act) => (
                      <div key={act.id} className="p-3 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] flex justify-between">
                        <span>{act.action}</span>
                        <span className="font-mono text-[10px] text-[var(--text-muted)]">{formatDate(act.created_at)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: DOCUMENTS */}
          {activeTab === "documents" && (
            <div className="p-6 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-surface)] space-y-4">
              <h3 className="type-eyebrow text-xs font-mono text-purple-400 uppercase tracking-widest font-bold">
                DOCUMENTS & ASSETS
              </h3>
              {documents.length === 0 ? (
                <PortalEmptyState type="docs" />
              ) : (
                documents.map((doc) => (
                  <div key={doc.id} className="p-4 rounded-2xl bg-[var(--bg-main)] border border-[var(--border-color)] flex justify-between items-center text-xs">
                    <div>
                      <span className="font-bold block">{doc.name}</span>
                      <span className="text-[10px] text-[var(--text-muted)]">v{doc.version} • {formatDate(doc.created_at)}</span>
                    </div>
                    <button
                      onClick={() => handleDownloadDoc(doc.name)}
                      className="text-purple-400 flex items-center gap-1 font-mono font-bold hover:underline cursor-pointer"
                    >
                      <span>Download</span>
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 3: VIDEOS */}
          {activeTab === "videos" && (
            <div className="p-6 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-surface)] space-y-4">
              <h3 className="type-eyebrow text-xs font-mono text-purple-400 uppercase tracking-widest font-bold">
                VIDEO DELIVERABLES
              </h3>
              {videos.length === 0 ? (
                <PortalEmptyState type="videos" />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {videos.map((vid) => (
                    <div key={vid.id} className="p-4 rounded-2xl bg-[var(--bg-main)] border border-[var(--border-color)] flex flex-col justify-between">
                      <div>
                        <h4 className="font-bold text-sm mb-1">{vid.name}</h4>
                        <span className="text-[10px] font-mono text-purple-400">Revision {vid.revision_round} of {vid.max_revisions}</span>
                      </div>
                      <Link
                        href={`/portal/projects/${projectId}/videos/${vid.id}`}
                        className="mt-4 w-full inline-flex items-center justify-center gap-2 py-2 rounded-xl tgs-gradient-bg text-white text-xs font-mono font-bold uppercase"
                      >
                        <span>Review Video</span>
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: INVOICES */}
          {activeTab === "invoices" && (
            <div className="p-6 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-surface)] space-y-4">
              <h3 className="type-eyebrow text-xs font-mono text-purple-400 uppercase tracking-widest font-bold">
                INVOICES & BILLING
              </h3>
              {invoices.length === 0 ? (
                <PortalEmptyState type="general" title="No invoices issued" message="No pending or paid invoices recorded for this project." />
              ) : (
                invoices.map((inv) => (
                  <div key={inv.id} className="p-4 rounded-2xl bg-[var(--bg-main)] border border-[var(--border-color)] flex justify-between items-center text-xs font-mono">
                    <div>
                      <span className="font-bold">{inv.invoice_number}</span>
                      <span className="text-purple-300 block">INR {inv.amount.toLocaleString()} • Due {formatDate(inv.due_date)}</span>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30">
                      {inv.status.toUpperCase()}
                    </span>
                  </div>
                ))
              )}
            </div>
          )}
        </main>

        <PortalRightSidebar documents={documents} activities={activities} />
      </div>
    </div>
  );
}

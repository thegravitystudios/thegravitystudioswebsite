"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { AdminHeader } from "@/components/AdminHeader";
import {
  SIX_PHASES,
  getPhaseInfo,
  getStatusBadge,
  getVideoStatusBadge,
  formatDate,
} from "@/lib/portalConstants";
import {
  ArrowLeft,
  Save,
  UserPlus,
  FilePlus,
  Video,
  Receipt,
  CheckCircle2,
  AlertCircle,
  Activity,
  Trash2,
  Lock,
  Download,
  ExternalLink,
  Plus,
  FileText,
  Clock,
  ShieldCheck,
  Check,
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
  internal_notes?: string;
  created_at: string;
  clients?: {
    company_name: string;
  };
}

interface TeamMemberProfile {
  id: string;
  full_name: string;
  role: string;
}

interface ProjectTeamItem {
  project_id: string;
  user_id: string;
  role_on_project: string;
  profiles?: {
    full_name: string;
    role: string;
  };
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

export default function AdminSingleProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const projectId = resolvedParams.id;
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("Admin");
  const [userRole, setUserRole] = useState("admin");

  const [project, setProject] = useState<ProjectData | null>(null);
  const [teamProfiles, setTeamProfiles] = useState<TeamMemberProfile[]>([]);
  const [projectTeam, setProjectTeam] = useState<ProjectTeamItem[]>([]);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [invoices, setInvoices] = useState<InvoiceItem[]>([]);
  const [activities, setActivities] = useState<ActivityItem[]>([]);

  // Project Edit Form state
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editPhase, setEditPhase] = useState("strategy");
  const [editStatus, setEditStatus] = useState("on_track");
  const [editStart, setEditStart] = useState("");
  const [editTarget, setEditTarget] = useState("");
  const [editInternalNotes, setEditInternalNotes] = useState("");
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  // Assign Team state
  const [assignUser, setAssignUser] = useState("");
  const [assignRole, setAssignRole] = useState("Producer");

  // Document Upload state
  const [docName, setDocName] = useState("");
  const [docUrl, setDocUrl] = useState("");
  const [docVersion, setDocVersion] = useState(1);

  // Video Upload state
  const [vidName, setVidName] = useState("");
  const [vidUrl, setVidUrl] = useState("");
  const [vidMasterUrl, setVidMasterUrl] = useState("");
  const [vidRevision, setVidRevision] = useState(1);
  const [vidMaxRevision, setVidMaxRevision] = useState(2);
  const [vidStatus, setVidStatus] = useState("pending_review");

  // Invoice Create state
  const [invNumber, setInvNumber] = useState("");
  const [invAmount, setInvAmount] = useState<number | "">("");
  const [invDueDate, setInvDueDate] = useState("");
  const [invPdfUrl, setInvPdfUrl] = useState("");

  useEffect(() => {
    async function loadAdminProject() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const localUserRaw = typeof window !== "undefined" ? localStorage.getItem("gravity_portal_user") : null;
        const localUser = localUserRaw ? JSON.parse(localUserRaw) : null;

        if (!session?.user && !localUser) {
          router.replace("/portal/login");
          return;
        }

        if (localUser && (!session?.user || localUser.id === "temp-admin-id")) {
          setUserName(localUser.full_name || "Prameet Patani (Admin)");
          setUserRole("admin");
          const demoProj: ProjectData = {
            id: "demo",
            client_id: "c-demo-1",
            name: "Hero Motors Brand & Website Redesign",
            description: "Full-scale brand film and social content pipeline for upcoming vehicle launch.",
            phase: "production",
            status: "on_track",
            start_date: "2026-09-01",
            target_end_date: "2026-10-31",
            internal_notes: "Client requested cinematic lighting and 4K ProRes 422 HQ master files.",
            created_at: new Date().toISOString(),
            clients: { company_name: "Hero Motors" },
          };
          setProject(demoProj);
          setEditName(demoProj.name);
          setEditDesc(demoProj.description || "");
          setEditPhase(demoProj.phase);
          setEditStatus(demoProj.status);
          setEditStart(demoProj.start_date || "");
          setEditTarget(demoProj.target_end_date || "");
          setEditInternalNotes(demoProj.internal_notes || "");

          setVideos([
            {
              id: "demo-vid",
              project_id: "demo",
              name: "Hero Motors Commercial Director's Cut v1",
              file_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
              master_file_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
              revision_round: 1,
              max_revisions: 2,
              status: "pending_review",
              created_at: new Date().toISOString(),
            },
          ]);

          setInvoices([
            {
              id: "i1",
              project_id: "demo",
              invoice_number: "TGS-2026-001",
              amount: 250000,
              currency: "INR",
              due_date: "2026-09-15",
              status: "unpaid",
              created_at: new Date().toISOString(),
            },
          ]);

          setLoading(false);
          return;
        }

        if (!session?.user) return;

        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name, role")
          .eq("id", session.user.id)
          .single();

        if (!profile || (profile.role !== "admin" && profile.role !== "team")) {
          router.replace("/portal/dashboard");
          return;
        }

        setUserName(profile.full_name || session.user.email || "Admin");
        setUserRole(profile.role);

        // Fetch Available Team Profiles
        const { data: teamData } = await supabase
          .from("profiles")
          .select("id, full_name, role")
          .in("role", ["admin", "team"]);
        if (teamData) {
          setTeamProfiles(teamData);
          if (teamData.length > 0) setAssignUser(teamData[0].id);
        }

        // Fetch Project Details
        const { data: projData, error: projErr } = await supabase
          .from("projects")
          .select("*, clients(company_name)")
          .eq("id", projectId)
          .single();

        if (projErr || !projData) {
          console.error("Project fetch error:", projErr);
          setLoading(false);
          return;
        }

        const proj = projData as ProjectData;
        setProject(proj);
        setEditName(proj.name || "");
        setEditDesc(proj.description || "");
        setEditPhase(proj.phase || "strategy");
        setEditStatus(proj.status || "on_track");
        setEditStart(proj.start_date || "");
        setEditTarget(proj.target_end_date || "");
        setEditInternalNotes(proj.internal_notes || "");

        // Fetch Assigned Team
        const { data: ptData } = await supabase
          .from("project_team")
          .select("*, profiles(full_name, role)")
          .eq("project_id", projectId);
        if (ptData) setProjectTeam(ptData as ProjectTeamItem[]);

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

        // Fetch Activity Log
        const { data: actData } = await supabase
          .from("activity_log")
          .select("*")
          .eq("project_id", projectId)
          .order("created_at", { ascending: false })
          .limit(10);
        if (actData) setActivities(actData as ActivityItem[]);
      } catch (err) {
        console.error("Error loading project details:", err);
      } finally {
        setLoading(false);
      }
    }

    loadAdminProject();
  }, [projectId, router]);

  // Handle Update Project Details
  const handleSaveProjectDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveLoading(true);
    setSaveMessage("");

    try {
      const { error } = await supabase
        .from("projects")
        .update({
          name: editName,
          description: editDesc,
          phase: editPhase,
          status: editStatus,
          start_date: editStart || null,
          target_end_date: editTarget || null,
          internal_notes: editInternalNotes,
        })
        .eq("id", projectId);

      if (error) {
        setSaveMessage(`Error: ${error.message}`);
      } else {
        setSaveMessage("Project details updated successfully!");

        // Log Activity
        await supabase.from("activity_log").insert({
          project_id: projectId,
          action: `Project updated by Admin (${userName}) — Phase: ${editPhase.toUpperCase()}, Status: ${editStatus.toUpperCase()}`,
        });

        // Refresh project state
        setProject((prev) =>
          prev
            ? {
                ...prev,
                name: editName,
                description: editDesc,
                phase: editPhase,
                status: editStatus,
                start_date: editStart,
                target_end_date: editTarget,
                internal_notes: editInternalNotes,
              }
            : null
        );
      }
    } catch (err: any) {
      setSaveMessage(`Error: ${err.message}`);
    } finally {
      setSaveLoading(false);
    }
  };

  // Handle Assign Team Member
  const handleAssignTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignUser) return;

    try {
      const { data, error } = await supabase
        .from("project_team")
        .insert({
          project_id: projectId,
          user_id: assignUser,
          role_on_project: assignRole,
        })
        .select("*, profiles(full_name, role)")
        .single();

      if (!error && data) {
        setProjectTeam((prev) => [...prev, data as ProjectTeamItem]);

        await supabase.from("activity_log").insert({
          project_id: projectId,
          action: `Team member assigned: ${(data.profiles as any)?.full_name || "Team Member"} as ${assignRole}`,
        });
      }
    } catch (err) {
      console.error("Assign team error:", err);
    }
  };

  // Handle Document Upload
  const handleAddDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docName || !docUrl) return;

    try {
      const { data, error } = await supabase
        .from("documents")
        .insert({
          project_id: projectId,
          name: docName,
          file_url: docUrl,
          version: docVersion,
        })
        .select("*")
        .single();

      if (!error && data) {
        setDocuments((prev) => [data as DocumentItem, ...prev]);
        setDocName("");
        setDocUrl("");
        setDocVersion(1);

        await supabase.from("activity_log").insert({
          project_id: projectId,
          action: `Document uploaded: "${docName}" (v${docVersion})`,
        });
      }
    } catch (err) {
      console.error("Document add error:", err);
    }
  };

  // Handle Video Upload
  const handleAddVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vidName || !vidUrl) return;

    try {
      const { data, error } = await supabase
        .from("videos")
        .insert({
          project_id: projectId,
          name: vidName,
          file_url: vidUrl,
          master_file_url: vidMasterUrl || null,
          revision_round: vidRevision,
          max_revisions: vidMaxRevision,
          status: vidStatus,
        })
        .select("*")
        .single();

      if (!error && data) {
        setVideos((prev) => [data as VideoItem, ...prev]);
        setVidName("");
        setVidUrl("");
        setVidMasterUrl("");

        await supabase.from("activity_log").insert({
          project_id: projectId,
          action: `Video review asset uploaded: "${vidName}" (Round ${vidRevision}/${vidMaxRevision})`,
        });
      }
    } catch (err) {
      console.error("Video add error:", err);
    }
  };

  // Handle Invoice Creation
  const handleAddInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!invNumber || !invAmount || !invDueDate) return;

    try {
      const { data, error } = await supabase
        .from("invoices")
        .insert({
          project_id: projectId,
          invoice_number: invNumber,
          amount: Number(invAmount),
          currency: "INR",
          due_date: invDueDate,
          status: "unpaid",
          file_url: invPdfUrl || null,
        })
        .select("*")
        .single();

      if (!error && data) {
        setInvoices((prev) => [data as InvoiceItem, ...prev]);
        setInvNumber("");
        setInvAmount("");
        setInvDueDate("");
        setInvPdfUrl("");

        await supabase.from("activity_log").insert({
          project_id: projectId,
          action: `Invoice issued: ${invNumber} for INR ${Number(invAmount).toLocaleString()}`,
        });
      }
    } catch (err) {
      console.error("Invoice add error:", err);
    }
  };

  // Handle Invoice Status Toggle (Mark as Paid / Unpaid)
  const handleToggleInvoiceStatus = async (invoiceId: string, currentStatus: string) => {
    const nextStatus = currentStatus === "paid" ? "unpaid" : "paid";
    try {
      const { error } = await supabase
        .from("invoices")
        .update({ status: nextStatus })
        .eq("id", invoiceId);

      if (!error) {
        setInvoices((prev) =>
          prev.map((inv) => (inv.id === invoiceId ? { ...inv, status: nextStatus } : inv))
        );

        await supabase.from("activity_log").insert({
          project_id: projectId,
          action: `Invoice status updated to ${nextStatus.toUpperCase()} by Admin (${userName})`,
        });
      }
    } catch (err) {
      console.error("Invoice status update error:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-primary)] flex items-center justify-center font-mono text-xs">
        <div className="flex items-center gap-3 px-6 py-4 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)]">
          <div className="w-4 h-4 rounded-full border-2 border-rose-500 border-t-transparent animate-spin" />
          <span>LOADING PROJECT DETAILS...</span>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-primary)] flex flex-col font-sans">
        <AdminHeader userName={userName} userRole={userRole} />
        <main className="flex-grow max-w-[1400px] w-full mx-auto px-4 sm:px-8 py-16 text-center">
          <div className="p-12 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-surface)] max-w-lg mx-auto">
            <AlertCircle className="w-12 h-12 text-rose-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold font-headline text-[var(--text-primary)] mb-2">
              Project Not Found
            </h2>
            <Link
              href="/portal/admin/dashboard"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full tgs-gradient-bg text-white font-mono text-xs font-bold uppercase"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Admin Dashboard</span>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const phaseInfo = getPhaseInfo(project.phase);
  const statusBadge = getStatusBadge(project.status);

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-primary)] flex flex-col font-sans transition-colors">
      <AdminHeader userName={userName} userRole={userRole} />

      <main className="flex-grow max-w-[1400px] w-full mx-auto px-4 sm:px-8 py-8 space-y-8">
        {/* Back Link & Header Bar */}
        <div>
          <Link
            href="/portal/admin/dashboard"
            className="inline-flex items-center gap-2 text-xs font-mono text-[var(--text-muted)] hover:text-rose-400 transition-colors uppercase tracking-wider mb-4"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Dashboard</span>
          </Link>

          <div className="p-6 sm:p-7 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-surface)] flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className="type-eyebrow text-xs font-mono text-rose-400 font-bold uppercase tracking-wider">
                  {project.clients?.company_name || "CLIENT PROJECT"}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full border text-[10px] font-mono font-bold uppercase ${statusBadge.className}`}>
                  {statusBadge.label}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold font-headline text-[var(--text-primary)] tracking-tight">
                {project.name}
              </h1>
            </div>

            <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-[var(--bg-main)] border border-purple-500/30 self-start md:self-auto">
              <span className="type-eyebrow text-xs font-mono text-purple-400 font-bold">
                Phase {phaseInfo.number} — {phaseInfo.name}
              </span>
            </div>
          </div>
        </div>

        {/* 1. EDIT PROJECT DETAILS & INTERNAL NOTES */}
        <div className="p-6 sm:p-8 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-surface)]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold font-headline text-[var(--text-primary)] flex items-center gap-2">
              <Save className="w-4 h-4 text-purple-400" />
              <span>Project Details & Status Control</span>
            </h2>
          </div>

          {saveMessage && (
            <div className={`mb-6 p-3.5 rounded-xl text-xs font-mono border ${
              saveMessage.startsWith("Error")
                ? "bg-red-500/10 border-red-500/30 text-red-300"
                : "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
            }`}>
              {saveMessage}
            </div>
          )}

          <form onSubmit={handleSaveProjectDetails} className="space-y-4 font-mono text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] text-zinc-400 uppercase tracking-wider mb-1">
                  Project Name
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl px-4 py-2.5 text-[var(--text-primary)] focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-[10px] text-zinc-400 uppercase tracking-wider mb-1">
                  Phase
                </label>
                <select
                  value={editPhase}
                  onChange={(e) => setEditPhase(e.target.value)}
                  className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl px-4 py-2.5 text-[var(--text-primary)] focus:border-purple-500"
                >
                  {SIX_PHASES.map((p) => (
                    <option key={p.id} value={p.id}>
                      Phase {p.number} — {p.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-[10px] text-zinc-400 uppercase tracking-wider mb-1">
                  Status
                </label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl px-4 py-2.5 text-[var(--text-primary)] focus:border-purple-500"
                >
                  <option value="on_track">On Track</option>
                  <option value="at_risk">At Risk</option>
                  <option value="delayed">Delayed</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] text-zinc-400 uppercase tracking-wider mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={editStart}
                  onChange={(e) => setEditStart(e.target.value)}
                  className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl px-4 py-2.5 text-[var(--text-primary)] focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-[10px] text-zinc-400 uppercase tracking-wider mb-1">
                  Target End Date
                </label>
                <input
                  type="date"
                  value={editTarget}
                  onChange={(e) => setEditTarget(e.target.value)}
                  className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl px-4 py-2.5 text-[var(--text-primary)] focus:border-purple-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] text-zinc-400 uppercase tracking-wider mb-1">
                Client-Facing Description
              </label>
              <textarea
                rows={2}
                value={editDesc}
                onChange={(e) => setEditDesc(e.target.value)}
                className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl px-4 py-2.5 text-[var(--text-primary)] focus:border-purple-500"
              />
            </div>

            {/* INTERNAL-ONLY NOTES (ADMIN/TEAM ONLY) */}
            <div className="p-4 rounded-2xl bg-rose-500/5 border border-rose-500/30">
              <label className="block text-[10px] font-bold text-rose-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" />
                <span>Internal Notes (Admin & Team Only — Never Exposed to Client View)</span>
              </label>
              <textarea
                rows={3}
                value={editInternalNotes}
                onChange={(e) => setEditInternalNotes(e.target.value)}
                placeholder="Private team notes, budget notes, vendor dependencies..."
                className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl px-4 py-2.5 text-[var(--text-primary)] focus:border-rose-500/70"
              />
            </div>

            <button
              type="submit"
              disabled={saveLoading}
              className="px-6 py-3 rounded-xl tgs-gradient-bg text-white font-bold text-xs uppercase hover:scale-[1.02] transition-all disabled:opacity-50 cursor-pointer"
            >
              {saveLoading ? "Saving..." : "Save Project Changes"}
            </button>
          </form>
        </div>

        {/* 2. TEAM ASSIGNMENT (`project_team`) */}
        <div className="p-6 sm:p-8 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-surface)]">
          <h2 className="text-lg font-bold font-headline text-[var(--text-primary)] mb-4 flex items-center gap-2">
            <UserPlus className="w-4 h-4 text-purple-400" />
            <span>Assigned Team Members</span>
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Form to Assign Team */}
            <form onSubmit={handleAssignTeam} className="p-5 rounded-2xl bg-[var(--bg-main)] border border-[var(--border-color)] space-y-3 font-mono text-xs">
              <h3 className="font-bold text-[var(--text-primary)] uppercase text-[11px]">Assign New Team Member</h3>
              <div>
                <label className="block text-[10px] text-zinc-400 uppercase mb-1">Select Profile</label>
                <select
                  value={assignUser}
                  onChange={(e) => setAssignUser(e.target.value)}
                  className="w-full bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl px-3 py-2 text-[var(--text-primary)]"
                >
                  {teamProfiles.map((tp) => (
                    <option key={tp.id} value={tp.id}>
                      {tp.full_name} ({tp.role})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] text-zinc-400 uppercase mb-1">Role on Project</label>
                <input
                  type="text"
                  required
                  value={assignRole}
                  onChange={(e) => setAssignRole(e.target.value)}
                  placeholder="e.g. Lead Editor, Shooter, Producer"
                  className="w-full bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl px-3 py-2 text-[var(--text-primary)]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold uppercase transition-all"
              >
                Assign Member
              </button>
            </form>

            {/* List of Current Team */}
            <div className="lg:col-span-2 space-y-3">
              {projectTeam.length === 0 ? (
                <div className="p-8 text-center text-xs font-mono text-[var(--text-muted)] border border-dashed border-[var(--border-color)] rounded-2xl">
                  No internal team members assigned yet.
                </div>
              ) : (
                projectTeam.map((pt, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-[var(--bg-main)] border border-[var(--border-color)] flex items-center justify-between font-mono text-xs"
                  >
                    <div>
                      <div className="font-bold text-[var(--text-primary)]">
                        {pt.profiles?.full_name || "Team Member"}
                      </div>
                      <div className="type-eyebrow text-[10px] text-purple-400">
                        {pt.role_on_project}
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20 text-[10px] uppercase font-bold">
                      {pt.profiles?.role || "team"}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* 3. UPLOAD DOCUMENTS & STORAGE */}
        <div className="p-6 sm:p-8 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-surface)]">
          <h2 className="text-lg font-bold font-headline text-[var(--text-primary)] mb-4 flex items-center gap-2">
            <FilePlus className="w-4 h-4 text-purple-400" />
            <span>Project Documents Management</span>
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <form onSubmit={handleAddDocument} className="p-5 rounded-2xl bg-[var(--bg-main)] border border-[var(--border-color)] space-y-3 font-mono text-xs">
              <h3 className="font-bold text-[var(--text-primary)] uppercase text-[11px]">Upload / Add Document</h3>

              <div>
                <label className="block text-[10px] text-zinc-400 uppercase mb-1">Document Name *</label>
                <input
                  type="text"
                  required
                  value={docName}
                  onChange={(e) => setDocName(e.target.value)}
                  placeholder="e.g. Brand Script & Moodboard v2"
                  className="w-full bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl px-3 py-2 text-[var(--text-primary)]"
                />
              </div>

              <div>
                <label className="block text-[10px] text-zinc-400 uppercase mb-1">File URL / Storage Path *</label>
                <input
                  type="text"
                  required
                  value={docUrl}
                  onChange={(e) => setDocUrl(e.target.value)}
                  placeholder="https://drive.google.com/... or storage path"
                  className="w-full bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl px-3 py-2 text-[var(--text-primary)]"
                />
              </div>

              <div>
                <label className="block text-[10px] text-zinc-400 uppercase mb-1">Version Number</label>
                <input
                  type="number"
                  min={1}
                  value={docVersion}
                  onChange={(e) => setDocVersion(Number(e.target.value))}
                  className="w-full bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl px-3 py-2 text-[var(--text-primary)]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold uppercase transition-all"
              >
                Add Document Record
              </button>
            </form>

            <div className="lg:col-span-2 space-y-3 font-mono text-xs">
              {documents.length === 0 ? (
                <div className="p-8 text-center text-[var(--text-muted)] border border-dashed border-[var(--border-color)] rounded-2xl">
                  No documents recorded.
                </div>
              ) : (
                documents.map((doc) => (
                  <div key={doc.id} className="p-4 rounded-2xl bg-[var(--bg-main)] border border-[var(--border-color)] flex items-center justify-between">
                    <div>
                      <div className="font-bold text-[var(--text-primary)]">{doc.name}</div>
                      <div className="text-[10px] text-[var(--text-muted)]">v{doc.version} • {formatDate(doc.created_at)}</div>
                    </div>
                    <a href={doc.file_url} target="_blank" rel="noreferrer" className="text-purple-400 hover:underline flex items-center gap-1">
                      <span>Download</span>
                      <Download className="w-3.5 h-3.5" />
                    </a>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* 4. UPLOAD VIDEOS (REVIEW COPY & MASTER DRIVE LINK) */}
        <div className="p-6 sm:p-8 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-surface)]">
          <h2 className="text-lg font-bold font-headline text-[var(--text-primary)] mb-4 flex items-center gap-2">
            <Video className="w-4 h-4 text-purple-400" />
            <span>Video Deliverables Upload</span>
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <form onSubmit={handleAddVideo} className="p-5 rounded-2xl bg-[var(--bg-main)] border border-[var(--border-color)] space-y-3 font-mono text-xs">
              <h3 className="font-bold text-[var(--text-primary)] uppercase text-[11px]">Add Video Deliverable</h3>

              <div>
                <label className="block text-[10px] text-zinc-400 uppercase mb-1">Video Title *</label>
                <input
                  type="text"
                  required
                  value={vidName}
                  onChange={(e) => setVidName(e.target.value)}
                  placeholder="e.g. Hero Brand Film Cut v1"
                  className="w-full bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl px-3 py-2 text-[var(--text-primary)]"
                />
              </div>

              <div>
                <label className="block text-[10px] text-zinc-400 uppercase mb-1">Review Copy Video URL *</label>
                <input
                  type="text"
                  required
                  value={vidUrl}
                  onChange={(e) => setVidUrl(e.target.value)}
                  placeholder="Storage URL or review video link"
                  className="w-full bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl px-3 py-2 text-[var(--text-primary)]"
                />
              </div>

              <div>
                <label className="block text-[10px] text-zinc-400 uppercase mb-1">Master File Drive Link (Optional)</label>
                <input
                  type="text"
                  value={vidMasterUrl}
                  onChange={(e) => setVidMasterUrl(e.target.value)}
                  placeholder="Google Drive link for full-res master"
                  className="w-full bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl px-3 py-2 text-[var(--text-primary)]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] text-zinc-400 uppercase mb-1">Round</label>
                  <input
                    type="number"
                    min={1}
                    value={vidRevision}
                    onChange={(e) => setVidRevision(Number(e.target.value))}
                    className="w-full bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl px-2.5 py-2 text-[var(--text-primary)]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-zinc-400 uppercase mb-1">Max Rounds</label>
                  <input
                    type="number"
                    min={1}
                    value={vidMaxRevision}
                    onChange={(e) => setVidMaxRevision(Number(e.target.value))}
                    className="w-full bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl px-2.5 py-2 text-[var(--text-primary)]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] text-zinc-400 uppercase mb-1">Status</label>
                <select
                  value={vidStatus}
                  onChange={(e) => setVidStatus(e.target.value)}
                  className="w-full bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl px-3 py-2 text-[var(--text-primary)]"
                >
                  <option value="pending_review">Pending Review</option>
                  <option value="changes_requested">Changes Requested</option>
                  <option value="approved">Approved</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold uppercase transition-all"
              >
                Add Video Asset
              </button>
            </form>

            <div className="lg:col-span-2 space-y-3 font-mono text-xs">
              {videos.length === 0 ? (
                <div className="p-8 text-center text-[var(--text-muted)] border border-dashed border-[var(--border-color)] rounded-2xl">
                  No video deliverables added.
                </div>
              ) : (
                videos.map((v) => {
                  const statusInfo = getVideoStatusBadge(v.status);
                  return (
                    <div key={v.id} className="p-4 rounded-2xl bg-[var(--bg-main)] border border-[var(--border-color)] flex items-center justify-between">
                      <div>
                        <div className="font-bold text-[var(--text-primary)]">{v.name}</div>
                        <div className="text-[10px] text-[var(--text-muted)] mt-0.5">
                          Round {v.revision_round} of {v.max_revisions} • {formatDate(v.created_at)}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold border ${statusInfo.className}`}>
                          {statusInfo.label}
                        </span>
                        <Link href={`/portal/projects/${projectId}/videos/${v.id}`} className="text-purple-400 hover:underline">
                          Review
                        </Link>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* 5. CREATE INVOICES & MANUAL "MARK AS PAID" TOGGLE */}
        <div className="p-6 sm:p-8 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-surface)]">
          <h2 className="text-lg font-bold font-headline text-[var(--text-primary)] mb-4 flex items-center gap-2">
            <Receipt className="w-4 h-4 text-purple-400" />
            <span>Invoices & Bank Transfer Manual Verification</span>
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <form onSubmit={handleAddInvoice} className="p-5 rounded-2xl bg-[var(--bg-main)] border border-[var(--border-color)] space-y-3 font-mono text-xs">
              <h3 className="font-bold text-[var(--text-primary)] uppercase text-[11px]">Issue New Invoice</h3>

              <div>
                <label className="block text-[10px] text-zinc-400 uppercase mb-1">Invoice Number *</label>
                <input
                  type="text"
                  required
                  value={invNumber}
                  onChange={(e) => setInvNumber(e.target.value)}
                  placeholder="e.g. TGS-2026-089"
                  className="w-full bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl px-3 py-2 text-[var(--text-primary)]"
                />
              </div>

              <div>
                <label className="block text-[10px] text-zinc-400 uppercase mb-1">Amount (INR) *</label>
                <input
                  type="number"
                  required
                  value={invAmount}
                  onChange={(e) => setInvAmount(e.target.value === "" ? "" : Number(e.target.value))}
                  placeholder="e.g. 150000"
                  className="w-full bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl px-3 py-2 text-[var(--text-primary)]"
                />
              </div>

              <div>
                <label className="block text-[10px] text-zinc-400 uppercase mb-1">Due Date *</label>
                <input
                  type="date"
                  required
                  value={invDueDate}
                  onChange={(e) => setInvDueDate(e.target.value)}
                  className="w-full bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl px-3 py-2 text-[var(--text-primary)]"
                />
              </div>

              <div>
                <label className="block text-[10px] text-zinc-400 uppercase mb-1">PDF URL (Optional)</label>
                <input
                  type="text"
                  value={invPdfUrl}
                  onChange={(e) => setInvPdfUrl(e.target.value)}
                  placeholder="Invoice PDF link"
                  className="w-full bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl px-3 py-2 text-[var(--text-primary)]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold uppercase transition-all"
              >
                Create Invoice Record
              </button>
            </form>

            <div className="lg:col-span-2 space-y-3 font-mono text-xs">
              {invoices.length === 0 ? (
                <div className="p-8 text-center text-[var(--text-muted)] border border-dashed border-[var(--border-color)] rounded-2xl">
                  No invoices created yet.
                </div>
              ) : (
                invoices.map((inv) => (
                  <div key={inv.id} className="p-4 rounded-2xl bg-[var(--bg-main)] border border-[var(--border-color)] flex items-center justify-between gap-4">
                    <div>
                      <div className="font-bold text-[var(--text-primary)]">{inv.invoice_number}</div>
                      <div className="text-[10px] text-purple-300 font-bold">
                        INR {inv.amount.toLocaleString()} • Due {formatDate(inv.due_date)}
                      </div>
                    </div>

                    {/* MANUAL "MARK AS PAID" TOGGLE FLIP */}
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleToggleInvoiceStatus(inv.id, inv.status)}
                        className={`px-3 py-1.5 rounded-xl font-bold text-[10px] uppercase transition-all flex items-center gap-1.5 cursor-pointer ${
                          inv.status === "paid"
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-rose-500/20 hover:text-rose-300 hover:border-rose-500/40"
                            : "bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-emerald-500/20 hover:text-emerald-300 hover:border-emerald-500/40"
                        }`}
                      >
                        {inv.status === "paid" ? (
                          <>
                            <Check className="w-3 h-3" />
                            <span>PAID (Click to unmark)</span>
                          </>
                        ) : (
                          <>
                            <Clock className="w-3 h-3" />
                            <span>UNPAID (Click to mark paid)</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* 6. ACTIVITY LOG & INTERNAL TEAM FEED */}
        <div className="p-6 sm:p-8 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-surface)]">
          <h2 className="text-lg font-bold font-headline text-[var(--text-primary)] mb-4 flex items-center gap-2">
            <Activity className="w-4 h-4 text-purple-400" />
            <span>Audit Activity Log</span>
          </h2>

          <div className="space-y-3 font-mono text-xs">
            {activities.length === 0 ? (
              <div className="py-6 text-center text-[var(--text-muted)]">No activity logged.</div>
            ) : (
              activities.map((act) => (
                <div key={act.id} className="p-3 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] flex items-center justify-between">
                  <span className="text-[var(--text-primary)]">{act.action}</span>
                  <span className="text-[10px] text-[var(--text-muted)]">{formatDate(act.created_at)}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { AdminHeader } from "@/components/AdminHeader";
import { SIX_PHASES, getPhaseInfo, getStatusBadge, formatDate } from "@/lib/portalConstants";
import {
  FolderKanban,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Filter,
  Search,
  Plus,
  ArrowRight,
  Building2,
  Calendar,
  Layers,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";

interface AdminProjectItem {
  id: string;
  client_id: string;
  name: string;
  description?: string;
  phase: string;
  status: string;
  start_date?: string;
  target_end_date?: string;
  created_at: string;
  clients?: {
    company_name: string;
  };
}

interface ClientItem {
  id: string;
  company_name: string;
}

interface BookingItem {
  id: string;
  eventType: string;
  date: string;
  timeSlot: string;
  leadName: string;
  leadEmail: string;
  companyName: string;
  projectScope: string;
  leadSource: string;
  timezone: string;
  meetUrl?: string;
  created_at: string;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("Admin");
  const [userRole, setUserRole] = useState("admin");

  const [projects, setProjects] = useState<AdminProjectItem[]>([]);
  const [clients, setClients] = useState<ClientItem[]>([]);
  const [bookings, setBookings] = useState<BookingItem[]>([]);

  // Filter & Search states
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [phaseFilter, setPhaseFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Create Project Modal state
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newProjectClient, setNewProjectClient] = useState("");
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDesc, setNewProjectDesc] = useState("");
  const [newProjectPhase, setNewProjectPhase] = useState("strategy");
  const [newProjectStatus, setNewProjectStatus] = useState("on_track");
  const [newProjectStart, setNewProjectStart] = useState("");
  const [newProjectTarget, setNewProjectTarget] = useState("");
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState("");

  useEffect(() => {
    async function loadAdminData() {
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
          setClients([
            { id: "demo-client-1", company_name: "Hero Motors" },
            { id: "demo-client-2", company_name: "Natural Veneers" },
          ]);
          setProjects([
            {
              id: "demo",
              client_id: "demo-client-1",
              name: "Hero Motors Commercial Campaign 2026",
              description: "Full-scale brand film and social content pipeline for upcoming vehicle launch.",
              phase: "production",
              status: "on_track",
              start_date: "2026-09-01",
              target_end_date: "2026-10-31",
              created_at: new Date().toISOString(),
              clients: { company_name: "Hero Motors" },
            },
            {
              id: "demo-2",
              client_id: "demo-client-2",
              name: "Natural Veneers Architectural Showcase",
              description: "Pre-production 3D renders and brand video asset creation.",
              phase: "pre_production",
              status: "at_risk",
              start_date: "2026-08-15",
              target_end_date: "2026-11-15",
              created_at: new Date().toISOString(),
              clients: { company_name: "Natural Veneers" },
            },
          ]);
          setBookings([
            {
              id: "bk-1",
              eventType: "45-min High-Ticket Strategy Session",
              date: "2026-09-12",
              timeSlot: "04:30 PM",
              leadName: "Rahul Sharma",
              leadEmail: "rahul@luxurymotors.com",
              companyName: "Luxury Motors International",
              projectScope: "Automotive commercial campaign with 3D VFX integration.",
              leadSource: "The Gravity Studios",
              timezone: "Asia/Kolkata (IST)",
              meetUrl: "https://meet.google.com/abc-defg-hij",
              created_at: new Date().toISOString(),
            },
            {
              id: "bk-2",
              eventType: "15-min Quick Alignment Call",
              date: "2026-09-14",
              timeSlot: "11:00 AM",
              leadName: "Emily Watson",
              leadEmail: "emily@brandvanguard.io",
              companyName: "Vanguard Studios US",
              projectScope: "Growth media engine and recurring video production retainer.",
              leadSource: "Secondary Agency Site",
              timezone: "America/New_York (EDT)",
              meetUrl: "https://meet.google.com/xyz-uvwx-rst",
              created_at: new Date().toISOString(),
            },
          ]);
          setLoading(false);
          return;
        }

        // Fetch User Profile & verify admin/team role
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

        // Fetch Clients for dropdown
        const { data: clientData } = await supabase
          .from("clients")
          .select("id, company_name")
          .order("company_name", { ascending: true });
        if (clientData) {
          setClients(clientData);
          if (clientData.length > 0) setNewProjectClient(clientData[0].id);
        }

        // Fetch All Projects with joined Client company names
        const { data: projData, error: projErr } = await supabase
          .from("projects")
          .select("*, clients(company_name)")
          .order("created_at", { ascending: false });

        if (!projErr && projData) {
          setProjects(projData as AdminProjectItem[]);
        }

        // Fetch Bookings from API endpoint
        try {
          const res = await fetch("/api/book");
          const resData = await res.json();
          if (resData.success && Array.isArray(resData.data) && resData.data.length > 0) {
            setBookings(resData.data);
          } else {
            setBookings([
              {
                id: "bk-1",
                eventType: "45-min High-Ticket Strategy Session",
                date: "2026-09-12",
                timeSlot: "04:30 PM",
                leadName: "Rahul Sharma",
                leadEmail: "rahul@luxurymotors.com",
                companyName: "Luxury Motors International",
                projectScope: "Automotive commercial campaign with 3D VFX integration.",
                leadSource: "The Gravity Studios",
                timezone: "Asia/Kolkata (IST)",
                meetUrl: "https://meet.google.com/abc-defg-hij",
                created_at: new Date().toISOString(),
              },
              {
                id: "bk-2",
                eventType: "15-min Quick Alignment Call",
                date: "2026-09-14",
                timeSlot: "11:00 AM",
                leadName: "Emily Watson",
                leadEmail: "emily@brandvanguard.io",
                companyName: "Vanguard Studios US",
                projectScope: "Growth media engine and recurring video production retainer.",
                leadSource: "Secondary Agency Site",
                timezone: "America/New_York (EDT)",
                meetUrl: "https://meet.google.com/xyz-uvwx-rst",
                created_at: new Date().toISOString(),
              },
            ]);
          }
        } catch {
          // keep existing default demo bookings if API call fails
        }
      } catch (err) {
        console.error("Admin dashboard load error:", err);
      } finally {
        setLoading(false);
      }
    }

    loadAdminData();
  }, [router]);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError("");
    setCreateLoading(true);

    try {
      const { data, error } = await supabase
        .from("projects")
        .insert({
          client_id: newProjectClient,
          name: newProjectName,
          description: newProjectDesc,
          phase: newProjectPhase,
          status: newProjectStatus,
          start_date: newProjectStart || null,
          target_end_date: newProjectTarget || null,
        })
        .select("*, clients(company_name)")
        .single();

      if (error) {
        setCreateError(error.message);
      } else if (data) {
        setProjects((prev) => [data as AdminProjectItem, ...prev]);
        setCreateModalOpen(false);
        setNewProjectName("");
        setNewProjectDesc("");
      }
    } catch (err: any) {
      setCreateError(err.message || "Failed to create project");
    } finally {
      setCreateLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-primary)] flex items-center justify-center font-mono text-xs">
        <div className="flex items-center gap-3 px-6 py-4 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)]">
          <div className="w-4 h-4 rounded-full border-2 border-rose-500 border-t-transparent animate-spin" />
          <span>LOADING INTERNAL ADMIN SYSTEM...</span>
        </div>
      </div>
    );
  }

  // Health Metrics
  const totalProjects = projects.length;
  const atRiskCount = projects.filter((p) => p.status === "at_risk").length;
  const delayedCount = projects.filter((p) => p.status === "delayed").length;
  const onTrackCount = projects.filter((p) => p.status === "on_track").length;
  const completedCount = projects.filter((p) => p.status === "completed").length;

  // Filtered Projects List
  const filteredProjects = projects.filter((p) => {
    const matchesStatus = statusFilter === "all" || p.status === statusFilter;
    const matchesPhase = phaseFilter === "all" || p.phase === phaseFilter;
    const matchesSearch =
      searchQuery === "" ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.clients?.company_name || "").toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesPhase && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-primary)] flex flex-col font-sans transition-colors">
      <AdminHeader userName={userName} userRole={userRole} />

      <main className="flex-grow max-w-[1400px] w-full mx-auto px-4 sm:px-8 py-8">
        {/* Top Control Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="type-eyebrow text-xs font-mono text-rose-400 tracking-widest uppercase mb-1 font-bold">
              INTERNAL OVERVIEW
            </div>
            <h1 className="text-2xl sm:text-3xl font-black font-headline text-[var(--text-primary)] tracking-tight">
              Production Operations Dashboard
            </h1>
          </div>

          <button
            onClick={() => setCreateModalOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl tgs-gradient-bg text-white font-mono text-xs font-bold uppercase tracking-wider hover:scale-105 transition-all shadow-[0_0_20px_rgba(168,85,247,0.3)] self-start sm:self-auto cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Project</span>
          </button>
        </div>

        {/* PROMINENT QUICK HEALTH VIEW CARDS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          {/* Total Projects Card */}
          <div className="p-5 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] flex items-center justify-between">
            <div>
              <div className="type-eyebrow text-[10px] font-mono text-[var(--text-muted)] uppercase">TOTAL PROJECTS</div>
              <div className="text-2xl sm:text-3xl font-extrabold font-mono text-[var(--text-primary)] mt-1">{totalProjects}</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <FolderKanban className="w-5 h-5" />
            </div>
          </div>

          {/* AT-RISK PROJECTS CARD (PROMINENTLY SURFACED) */}
          <div className={`p-5 rounded-2xl border flex items-center justify-between ${
            atRiskCount > 0
              ? "border-amber-500/50 bg-amber-500/10 shadow-[0_0_20px_rgba(245,158,11,0.2)]"
              : "border-[var(--border-color)] bg-[var(--bg-surface)]"
          }`}>
            <div>
              <div className="type-eyebrow text-[10px] font-mono text-amber-400 font-bold uppercase">AT-RISK PROJECTS</div>
              <div className="text-2xl sm:text-3xl font-extrabold font-mono text-amber-400 mt-1">{atRiskCount}</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>

          {/* DELAYED PROJECTS CARD (PROMINENTLY SURFACED) */}
          <div className={`p-5 rounded-2xl border flex items-center justify-between ${
            delayedCount > 0
              ? "border-rose-500/50 bg-rose-500/10 shadow-[0_0_20px_rgba(244,63,94,0.2)]"
              : "border-[var(--border-color)] bg-[var(--bg-surface)]"
          }`}>
            <div>
              <div className="type-eyebrow text-[10px] font-mono text-rose-400 font-bold uppercase">DELAYED PROJECTS</div>
              <div className="text-2xl sm:text-3xl font-extrabold font-mono text-rose-400 mt-1">{delayedCount}</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
              <Clock className="w-5 h-5" />
            </div>
          </div>

          {/* ON TRACK CARD */}
          <div className="p-5 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] flex items-center justify-between">
            <div>
              <div className="type-eyebrow text-[10px] font-mono text-emerald-400 font-bold uppercase">ON TRACK</div>
              <div className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-400 mt-1">{onTrackCount}</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* FILTER & SEARCH BAR (INFORMATION-DENSE) */}
        <div className="p-4 sm:p-5 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative flex-grow max-w-md">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by project or client name..."
              className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl pl-10 pr-4 py-2.5 text-xs font-mono text-[var(--text-primary)] placeholder:text-zinc-500 focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* Dropdown Filters */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <span className="type-eyebrow text-[10px] font-mono text-[var(--text-muted)] uppercase">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-[var(--bg-main)] border border-[var(--border-color)] text-[var(--text-primary)] text-xs font-mono rounded-xl px-3 py-2 focus:outline-none focus:border-purple-500"
              >
                <option value="all">All Statuses</option>
                <option value="on_track">On Track</option>
                <option value="at_risk">At Risk</option>
                <option value="delayed">Delayed</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            {/* Phase Filter */}
            <div className="flex items-center gap-2">
              <span className="type-eyebrow text-[10px] font-mono text-[var(--text-muted)] uppercase">Phase:</span>
              <select
                value={phaseFilter}
                onChange={(e) => setPhaseFilter(e.target.value)}
                className="bg-[var(--bg-main)] border border-[var(--border-color)] text-[var(--text-primary)] text-xs font-mono rounded-xl px-3 py-2 focus:outline-none focus:border-purple-500"
              >
                <option value="all">All Phases</option>
                {SIX_PHASES.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.number} — {p.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* SCHEDULED DISCOVERY CALLS (MASTER CALENDAR SUITE) */}
        <div className="rounded-3xl border border-purple-500/20 bg-[var(--bg-surface)] overflow-hidden shadow-xl mb-8">
          <div className="px-6 py-5 border-b border-[var(--border-color)] flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-purple-950/20 via-transparent to-transparent">
            <div>
              <div className="type-eyebrow text-[10px] font-mono text-purple-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>CROSS-AGENCY MASTER SCHEDULER</span>
              </div>
              <h2 className="text-lg font-bold font-headline text-[var(--text-primary)] mt-0.5">
                Scheduled Discovery Calls
              </h2>
            </div>
            <Link
              href="/book"
              target="_blank"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-300 hover:bg-purple-500/20 text-xs font-mono font-bold transition-all self-start sm:self-auto"
            >
              <span>View Live Booking Engine</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {bookings.length === 0 ? (
            <div className="p-8 text-center text-xs font-mono text-[var(--text-muted)]">
              No discovery calls currently scheduled.
            </div>
          ) : (
            <div className="divide-y divide-[var(--border-color)] font-mono text-xs">
              {bookings.map((b) => (
                <div key={b.id} className="p-6 hover:bg-[var(--bg-main)]/50 transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div className="space-y-2 flex-grow">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-1 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 text-[10px] font-bold uppercase tracking-wider">
                        {b.eventType}
                      </span>
                      <span className="px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                        <span>🏷️ Lead Source:</span>
                        <span className="font-extrabold">{b.leadSource}</span>
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm font-bold text-[var(--text-primary)] pt-1">
                      <span>{b.leadName}</span>
                      <span className="text-zinc-500 text-xs font-normal">({b.leadEmail})</span>
                      <span className="text-purple-400 text-xs font-semibold">• {b.companyName}</span>
                    </div>

                    <p className="text-xs text-[var(--text-muted)] font-normal line-clamp-2 max-w-3xl">
                      &quot;{b.projectScope}&quot;
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end justify-between gap-3 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-[var(--border-color)]">
                    <div className="text-left sm:text-right">
                      <div className="text-sm font-extrabold text-white flex items-center gap-1.5 lg:justify-end">
                        <Clock className="w-4 h-4 text-purple-400" />
                        <span>{b.date} @ {b.timeSlot}</span>
                      </div>
                      <div className="text-[10px] text-zinc-400 mt-0.5">{b.timezone}</div>
                    </div>

                    {b.meetUrl && (
                      <a
                        href={b.meetUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 text-xs font-bold transition-all"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Join Google Meet</span>
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* OVERVIEW TABLE OF ALL ACTIVE PROJECTS */}
        <div className="rounded-3xl border border-[var(--border-color)] bg-[var(--bg-surface)] overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-[var(--border-color)] flex items-center justify-between">
            <h2 className="text-base font-bold font-headline text-[var(--text-primary)] flex items-center gap-2">
              <span>All Projects</span>
              <span className="text-xs font-mono text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded-full">
                {filteredProjects.length}
              </span>
            </h2>
          </div>

          {filteredProjects.length === 0 ? (
            <div className="p-12 text-center text-xs font-mono text-[var(--text-muted)]">
              No projects match the selected filters.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs">
                <thead>
                  <tr className="border-b border-[var(--border-color)] bg-[var(--bg-main)] text-[var(--text-muted)] uppercase text-[10px]">
                    <th className="py-3 px-6">Client Company</th>
                    <th className="py-3 px-6">Project Name</th>
                    <th className="py-3 px-6">Current Phase</th>
                    <th className="py-3 px-6">Status</th>
                    <th className="py-3 px-6">Target End Date</th>
                    <th className="py-3 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-color)]">
                  {filteredProjects.map((proj) => {
                    const phaseInfo = getPhaseInfo(proj.phase);
                    const statusBadge = getStatusBadge(proj.status);
                    return (
                      <tr key={proj.id} className="hover:bg-[var(--bg-main)]/60 transition-colors">
                        <td className="py-4 px-6 font-bold text-[var(--text-primary)] flex items-center gap-2">
                          <Building2 className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                          <span>{proj.clients?.company_name || "Unassigned"}</span>
                        </td>
                        <td className="py-4 px-6 font-bold text-purple-300">
                          <Link href={`/portal/admin/projects/${proj.id}`} className="hover:underline">
                            {proj.name}
                          </Link>
                        </td>
                        <td className="py-4 px-6">
                          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-300">
                            <span className="font-bold text-[10px] text-purple-400">{phaseInfo.number}</span>
                            <span className="text-[10px] uppercase font-bold">{phaseInfo.name}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-bold uppercase ${statusBadge.className}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${statusBadge.dotColor}`} />
                            <span>{statusBadge.label}</span>
                          </span>
                        </td>
                        <td className="py-4 px-6 text-[var(--text-muted)]">
                          {formatDate(proj.target_end_date)}
                        </td>
                        <td className="py-4 px-6 text-right">
                          <Link
                            href={`/portal/admin/projects/${proj.id}`}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-300 hover:bg-purple-500/20 text-[11px] font-bold uppercase transition-all"
                          >
                            <span>Manage</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* CREATE NEW PROJECT MODAL */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#111015] border border-white/10 rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative">
            <div className="h-[2px] w-full bg-gradient-to-r from-purple-600 via-purple-400 to-fuchsia-500 absolute top-0 left-0 right-0 rounded-t-2xl" />

            <h3 className="text-xl font-bold font-headline text-white mb-2 mt-1">
              Create New Project
            </h3>
            <p className="text-xs text-zinc-400 mb-6">
              Initialize a project for an existing client company.
            </p>

            {createError && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs">
                {createError}
              </div>
            )}

            <form onSubmit={handleCreateProject} className="space-y-4 font-mono text-xs">
              <div>
                <label className="block text-zinc-400 mb-1 uppercase tracking-wider text-[10px]">
                  Client Company *
                </label>
                <select
                  required
                  value={newProjectClient}
                  onChange={(e) => setNewProjectClient(e.target.value)}
                  className="w-full bg-[#18171E] border border-white/10 rounded-xl px-4 py-2.5 text-white"
                >
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.company_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 uppercase tracking-wider text-[10px]">
                  Project Name *
                </label>
                <input
                  type="text"
                  required
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  placeholder="e.g. Autumn Commercial Campaign 2026"
                  className="w-full bg-[#18171E] border border-white/10 rounded-xl px-4 py-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 uppercase tracking-wider text-[10px]">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={newProjectDesc}
                  onChange={(e) => setNewProjectDesc(e.target.value)}
                  placeholder="Brief scope summary..."
                  className="w-full bg-[#18171E] border border-white/10 rounded-xl px-4 py-2.5 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 mb-1 uppercase tracking-wider text-[10px]">
                    Current Phase
                  </label>
                  <select
                    value={newProjectPhase}
                    onChange={(e) => setNewProjectPhase(e.target.value)}
                    className="w-full bg-[#18171E] border border-white/10 rounded-xl px-3 py-2 text-white"
                  >
                    {SIX_PHASES.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.number} {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1 uppercase tracking-wider text-[10px]">
                    Initial Status
                  </label>
                  <select
                    value={newProjectStatus}
                    onChange={(e) => setNewProjectStatus(e.target.value)}
                    className="w-full bg-[#18171E] border border-white/10 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="on_track">On Track</option>
                    <option value="at_risk">At Risk</option>
                    <option value="delayed">Delayed</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 mb-1 uppercase tracking-wider text-[10px]">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={newProjectStart}
                    onChange={(e) => setNewProjectStart(e.target.value)}
                    className="w-full bg-[#18171E] border border-white/10 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1 uppercase tracking-wider text-[10px]">
                    Target End Date
                  </label>
                  <input
                    type="date"
                    value={newProjectTarget}
                    onChange={(e) => setNewProjectTarget(e.target.value)}
                    className="w-full bg-[#18171E] border border-white/10 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="w-1/2 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold uppercase transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createLoading}
                  className="w-1/2 py-3 rounded-xl tgs-gradient-bg text-white font-bold uppercase hover:scale-[1.02] transition-all disabled:opacity-50"
                >
                  {createLoading ? "Creating..." : "Save Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

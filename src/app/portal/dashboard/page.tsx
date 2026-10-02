"use client";

import React, { useState, useEffect } from "react";
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
import { SIX_PHASES, getPhaseInfo, getStatusBadge, formatDate } from "@/lib/portalConstants";
import {
  Folder,
  CheckSquare,
  BarChart2,
  CheckCircle2,
  Circle,
  MoreVertical,
  ChevronRight,
} from "lucide-react";

import { WelcomeOnboardModal } from "@/components/WelcomeOnboardModal";

interface ProjectItem {
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

export default function ClientDashboardPage() {
  const router = useRouter();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("Client");
  const [companyName, setCompanyName] = useState("");
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [welcomeModalOpen, setWelcomeModalOpen] = useState(false);

  const [tasks, setTasks] = useState([
    { id: 1, title: "Define the target market and audience", tag: "Analytics", date: "08/12/2026", completed: true },
    { id: 2, title: "Handover the design assets and specifications", tag: "", date: "08/12/2026", completed: true },
    { id: 3, title: "Conduct competitor analysis", tag: "Analytics", priority: "High", date: "08/18/2026", completed: false },
    { id: 4, title: "Update KPIs & campaign goals", tag: "", date: "08/18/2026", completed: false },
  ]);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const localUserRaw = typeof window !== "undefined" ? localStorage.getItem("gravity_portal_user") : null;
        const localUser = localUserRaw ? JSON.parse(localUserRaw) : null;

        if (!session?.user && !localUser) {
          router.replace("/portal/login");
          return;
        }

        if (localUser && (!session?.user || localUser.id === "temp-client-id")) {
          setUserName(localUser.full_name || "Anand Verma");
          setCompanyName(localUser.company_name || "Hero Motors");
          setProjects([
            {
              id: "demo",
              client_id: "demo-client",
              name: "Hero Motors Brand & Website Redesign",
              description: "Full-scale brand film and social content pipeline for upcoming vehicle launch.",
              phase: "production",
              status: "on_track",
              start_date: "2026-09-01",
              target_end_date: "2026-10-31",
              created_at: new Date().toISOString(),
            },
          ]);
          // Check if first-time onboarding completed
          const onboardingDone = localStorage.getItem("tgs_onboarding_completed");
          if (!onboardingDone) {
            setWelcomeModalOpen(true);
          }

          setLoading(false);
          return;
        }

        if (!session?.user) return;

        // Fetch Profile
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

        const onboardingDone = localStorage.getItem("tgs_onboarding_completed");
        if (!onboardingDone) {
          setWelcomeModalOpen(true);
        }

        // Fetch Client Membership & Company Name
        const { data: clientMembers } = await supabase
          .from("client_members")
          .select("client_id, clients(company_name)")
          .eq("user_id", session.user.id);

        if (clientMembers && clientMembers.length > 0) {
          const clientObj = clientMembers[0];
          const cName = (clientObj.clients as any)?.company_name || "";
          setCompanyName(cName);

          const clientIds = clientMembers.map((cm) => cm.client_id);

          const { data: projData, error: projErr } = await supabase
            .from("projects")
            .select("*")
            .in("client_id", clientIds)
            .order("created_at", { ascending: false });

          if (!projErr && projData) {
            setProjects(projData as ProjectItem[]);
          }
        }
      } catch (err) {
        console.error("Error loading dashboard:", err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, [router]);

  const toggleTask = (id: number) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const nextState = !t.completed;
          addToast(
            nextState ? "Task completed" : "Task marked pending",
            `"${t.title}" status updated.`,
            nextState ? "success" : "info"
          );
          return { ...t, completed: nextState };
        }
        return t;
      })
    );
  };

  const mainProject = projects.length > 0 ? projects[0] : null;

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-primary)] flex flex-col font-sans transition-colors">
      <PortalTopHeader userName={userName} companyName={companyName} userRole="client" />

      <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-8 pb-12 flex flex-col lg:flex-row gap-6">
        <PortalSidebar companyName={companyName} projectName={mainProject?.name} userRole="client" />

        <main className="flex-grow space-y-6">
          <PortalBreadcrumbs items={[{ label: "Dashboard" }]} />

          {/* A. THREE QUICK SHORTCUT CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link
              href="#files"
              className="p-6 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-surface)] hover:border-purple-500/50 hover:shadow-[0_10px_30px_rgba(0,0,0,0.04)] transition-all flex flex-col items-center justify-center text-center group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-2xl bg-[var(--bg-main)] border border-[var(--border-color)] flex items-center justify-center text-[var(--text-primary)] mb-3 group-hover:scale-110 transition-transform">
                <Folder className="w-6 h-6 text-purple-400 fill-purple-500/20" />
              </div>
              <span className="text-sm font-bold font-headline text-[var(--text-primary)]">Files</span>
            </Link>

            <Link
              href="#tasks"
              className="p-6 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-surface)] hover:border-purple-500/50 hover:shadow-[0_10px_30px_rgba(0,0,0,0.04)] transition-all flex flex-col items-center justify-center text-center group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-2xl bg-[var(--bg-main)] border border-[var(--border-color)] flex items-center justify-center text-[var(--text-primary)] mb-3 group-hover:scale-110 transition-transform">
                <CheckSquare className="w-6 h-6 text-purple-400" />
              </div>
              <span className="text-sm font-bold font-headline text-[var(--text-primary)]">Tasks & Progress</span>
            </Link>

            <Link
              href="#reports"
              className="p-6 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-surface)] hover:border-purple-500/50 hover:shadow-[0_10px_30px_rgba(0,0,0,0.04)] transition-all flex flex-col items-center justify-center text-center group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-2xl bg-[var(--bg-main)] border border-[var(--border-color)] flex items-center justify-center text-[var(--text-primary)] mb-3 group-hover:scale-110 transition-transform">
                <BarChart2 className="w-6 h-6 text-purple-400" />
              </div>
              <span className="text-sm font-bold font-headline text-[var(--text-primary)]">Reports</span>
            </Link>
          </div>

          {/* B. PROJECT PROGRESS TIMELINE CARD */}
          {loading ? (
            <SkeletonCard />
          ) : (
            <div className="p-6 sm:p-7 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-surface)] shadow-[0_10px_30px_rgba(0,0,0,0.03)]">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-base font-bold font-headline text-[var(--text-primary)]">Project Progress</h2>
              </div>
              <p className="text-xs text-[var(--text-muted)] mb-6">
                {mainProject ? `${mainProject.name} - Project Status` : "Brand & Content System Redesign - Project Status"}
              </p>

              {/* CONNECTED TIMELINE PROGRESS BAR */}
              <div className="relative py-4">
                <div className="absolute top-1/2 left-4 right-4 -translate-y-1/2 h-1 bg-zinc-200 dark:bg-zinc-800 rounded-full" />
                <div className="absolute top-1/2 left-4 w-2/3 -translate-y-1/2 h-1 bg-zinc-900 dark:bg-purple-500 rounded-full" />

                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-7 h-7 rounded-full bg-zinc-900 dark:bg-purple-600 text-white flex items-center justify-center text-xs font-bold shadow-md">
                      ✓
                    </div>
                    <span className="text-xs font-medium text-[var(--text-primary)] mt-3">Getting started</span>
                  </div>

                  <div className="flex flex-col items-center text-center">
                    <div className="w-7 h-7 rounded-full bg-zinc-900 dark:bg-purple-600 text-white flex items-center justify-center text-xs font-bold shadow-md">
                      2
                    </div>
                    <span className="text-xs font-medium text-[var(--text-primary)] mt-3">Research and Briefing</span>
                  </div>

                  <div className="flex flex-col items-center text-center">
                    <div className="w-7 h-7 rounded-full bg-zinc-200 dark:bg-zinc-800 border-2 border-zinc-400 text-zinc-600 dark:text-zinc-400 flex items-center justify-center text-xs font-bold">
                      3
                    </div>
                    <span className="text-xs font-medium text-[var(--text-muted)] mt-3">Launch Stage</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* C. CLIENT TASKS TABLE WITH TOAST MICRO-INTERACTION */}
          <div id="tasks" className="p-6 sm:p-7 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-surface)] shadow-[0_10px_30px_rgba(0,0,0,0.03)]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-base font-bold font-headline text-[var(--text-primary)]">Client Tasks</h2>
              <button className="text-zinc-400 hover:text-[var(--text-primary)]">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>

            {tasks.length === 0 ? (
              <PortalEmptyState type="tasks" />
            ) : (
              <div className="space-y-4 font-sans text-xs">
                {tasks.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => toggleTask(t.id)}
                    className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all cursor-pointer select-none ${
                      t.completed
                        ? "border-[var(--border-color)] bg-[var(--bg-main)]/50 opacity-60 line-through text-[var(--text-muted)]"
                        : "border-[var(--border-color)] bg-[var(--bg-main)] text-[var(--text-primary)] hover:border-purple-500/40"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {t.completed ? (
                        <CheckCircle2 className="w-4 h-4 text-purple-500 shrink-0 transition-transform scale-110" />
                      ) : (
                        <Circle className="w-4 h-4 text-zinc-400 shrink-0" />
                      )}
                      <span className="font-medium">{t.title}</span>

                      {t.tag && (
                        <span className="px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 font-mono text-[9px] uppercase">
                          {t.tag}
                        </span>
                      )}

                      {t.priority && (
                        <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 font-mono text-[9px] uppercase">
                          {t.priority}
                        </span>
                      )}
                    </div>

                    <span className="type-eyebrow text-[10px] font-mono text-[var(--text-muted)] shrink-0">
                      {t.date}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* D. ACTIVE PROJECTS LIST WITH SKELETON & EMPTY STATE */}
          <div className="p-6 sm:p-7 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-surface)] shadow-[0_10px_30px_rgba(0,0,0,0.03)] space-y-4">
            <h2 className="text-base font-bold font-headline text-[var(--text-primary)]">Active Projects</h2>

            {loading ? (
              <SkeletonList />
            ) : projects.length === 0 ? (
              <PortalEmptyState
                type="general"
                title="No active projects assigned"
                message="Your brand company does not currently have any active projects initialized in the studio pipeline."
              />
            ) : (
              projects.map((p) => {
                const statusBadge = getStatusBadge(p.status);
                const phaseInfo = getPhaseInfo(p.phase);
                return (
                  <div
                    key={p.id}
                    className="p-5 rounded-2xl bg-[var(--bg-main)] border border-[var(--border-color)] flex items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono text-purple-400 font-bold uppercase">
                          Phase {phaseInfo.number} — {phaseInfo.name}
                        </span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase border ${statusBadge.className}`}>
                          {statusBadge.label}
                        </span>
                      </div>
                      <h3 className="text-base font-bold font-headline text-[var(--text-primary)]">{p.name}</h3>
                    </div>

                    <Link
                      href={`/portal/projects/${p.id}`}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl tgs-gradient-bg text-white text-xs font-mono font-bold uppercase hover:scale-105 transition-all"
                    >
                      <span>View Project</span>
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                );
              })
            )}
          </div>
        </main>

        <PortalRightSidebar />
      </div>

      {/* FIRST-TIME CLIENT WELCOME ONBOARDING WIZARD */}
      <WelcomeOnboardModal
        isOpen={welcomeModalOpen}
        initialName={userName}
        initialCompany={companyName}
        onComplete={(data) => {
          setUserName(data.nickname || data.fullName);
          if (data.brandName) setCompanyName(data.brandName);
          localStorage.setItem("tgs_onboarding_completed", "true");
          localStorage.setItem("tgs_client_preferences", JSON.stringify(data));
          setWelcomeModalOpen(false);
        }}
      />
    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { AdminHeader } from "@/components/AdminHeader";
import { formatDate } from "@/lib/portalConstants";
import {
  Building2,
  Users,
  UserPlus,
  Mail,
  User,
  FolderKanban,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
} from "lucide-react";

interface ClientRecord {
  id: string;
  company_name: string;
  created_at: string;
  projects_count?: number;
  members?: {
    user_id: string;
    profiles?: {
      full_name: string;
      id: string;
    };
  }[];
}

export default function AdminClientsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("Admin");
  const [userRole, setUserRole] = useState("admin");

  const [clients, setClients] = useState<ClientRecord[]>([]);

  // Invite Modal states
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteError, setInviteError] = useState("");
  const [inviteSuccess, setInviteSuccess] = useState("");

  useEffect(() => {
    async function loadClientsData() {
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
            {
              id: "c-demo-1",
              company_name: "Hero Motors",
              created_at: new Date().toISOString(),
              projects_count: 1,
              members: [
                {
                  user_id: "u-1",
                  profiles: { full_name: "Anand Verma", id: "u-1" },
                },
              ],
            },
            {
              id: "c-demo-2",
              company_name: "Natural Veneers",
              created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
              projects_count: 1,
              members: [
                {
                  user_id: "u-2",
                  profiles: { full_name: "Wei Chen", id: "u-2" },
                },
              ],
            },
            {
              id: "c-demo-3",
              company_name: "Aura Apparel",
              created_at: new Date(Date.now() - 86400000 * 12).toISOString(),
              projects_count: 1,
              members: [
                {
                  user_id: "u-3",
                  profiles: { full_name: "Miya Chen", id: "u-3" },
                },
              ],
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

        // Fetch Clients with projects count
        const { data: clientData, error } = await supabase
          .from("clients")
          .select("*, projects(id), client_members(user_id, profiles(full_name))")
          .order("created_at", { ascending: false });

        if (!error && clientData) {
          const formatted = clientData.map((c: any) => ({
            id: c.id,
            company_name: c.company_name,
            created_at: c.created_at,
            projects_count: c.projects ? c.projects.length : 0,
            members: c.client_members || [],
          }));
          setClients(formatted);
        }
      } catch (err) {
        console.error("Error loading clients:", err);
      } finally {
        setLoading(false);
      }
    }

    loadClientsData();
  }, [router]);

  const handleInviteClient = async (e: React.FormEvent) => {
    e.preventDefault();
    setInviteError("");
    setInviteSuccess("");
    setInviteLoading(true);

    try {
      const res = await fetch("/api/portal/admin/invite-client", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company_name: companyName,
          contact_name: contactName,
          contact_email: contactEmail,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setInviteError(data.error || "Failed to invite client");
      } else {
        setInviteSuccess(data.message || "Invitation email sent successfully!");
        setCompanyName("");
        setContactName("");
        setContactEmail("");

        // Refresh clients list after 1.5s
        setTimeout(async () => {
          const { data: refreshed } = await supabase
            .from("clients")
            .select("*, projects(id), client_members(user_id, profiles(full_name))")
            .order("created_at", { ascending: false });
          if (refreshed) {
            setClients(
              refreshed.map((c: any) => ({
                id: c.id,
                company_name: c.company_name,
                created_at: c.created_at,
                projects_count: c.projects ? c.projects.length : 0,
                members: c.client_members || [],
              }))
            );
          }
          setInviteModalOpen(false);
        }, 1500);
      }
    } catch (err: any) {
      setInviteError(err.message || "Failed to send invitation email");
    } finally {
      setInviteLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-primary)] flex items-center justify-center font-mono text-xs">
        <div className="flex items-center gap-3 px-6 py-4 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)]">
          <div className="w-4 h-4 rounded-full border-2 border-rose-500 border-t-transparent animate-spin" />
          <span>LOADING CLIENT DIRECTORY...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-primary)] flex flex-col font-sans transition-colors">
      <AdminHeader userName={userName} userRole={userRole} />

      <main className="flex-grow max-w-[1400px] w-full mx-auto px-4 sm:px-8 py-8">
        {/* Top Control Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="type-eyebrow text-xs font-mono text-rose-400 tracking-widest uppercase mb-1 font-bold">
              CLIENT MANAGEMENT
            </div>
            <h1 className="text-2xl sm:text-3xl font-black font-headline text-[var(--text-primary)] tracking-tight">
              Client Directory & Invites
            </h1>
          </div>

          <button
            onClick={() => {
              setInviteModalOpen(true);
              setInviteError("");
              setInviteSuccess("");
            }}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl tgs-gradient-bg text-white font-mono text-xs font-bold uppercase tracking-wider hover:scale-105 transition-all shadow-[0_0_20px_rgba(168,85,247,0.3)] self-start sm:self-auto cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Invite New Client</span>
          </button>
        </div>

        {/* STATS OVERVIEW */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8 max-w-xl">
          <div className="p-5 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] flex items-center justify-between">
            <div>
              <div className="type-eyebrow text-[10px] font-mono text-[var(--text-muted)] uppercase">TOTAL CLIENT COMPANIES</div>
              <div className="text-2xl font-extrabold font-mono text-[var(--text-primary)] mt-1">{clients.length}</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Building2 className="w-5 h-5" />
            </div>
          </div>

          <div className="p-5 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] flex items-center justify-between">
            <div>
              <div className="type-eyebrow text-[10px] font-mono text-[var(--text-muted)] uppercase">ACTIVE CLIENT WORKSPACES</div>
              <div className="text-2xl font-extrabold font-mono text-purple-300 mt-1">
                {clients.filter((c) => (c.projects_count || 0) > 0).length}
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Users className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* CLIENT DIRECTORY TABLE */}
        <div className="rounded-3xl border border-[var(--border-color)] bg-[var(--bg-surface)] overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-[var(--border-color)] flex items-center justify-between">
            <h2 className="text-base font-bold font-headline text-[var(--text-primary)] flex items-center gap-2">
              <span>Client Companies</span>
              <span className="text-xs font-mono text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded-full">
                {clients.length}
              </span>
            </h2>
          </div>

          {clients.length === 0 ? (
            <div className="p-12 text-center text-xs font-mono text-[var(--text-muted)]">
              No client companies added yet. Click "Invite New Client" to get started.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs">
                <thead>
                  <tr className="border-b border-[var(--border-color)] bg-[var(--bg-main)] text-[var(--text-muted)] uppercase text-[10px]">
                    <th className="py-3 px-6">Company Name</th>
                    <th className="py-3 px-6">Assigned Users</th>
                    <th className="py-3 px-6">Active Projects</th>
                    <th className="py-3 px-6">Date Added</th>
                    <th className="py-3 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-color)]">
                  {clients.map((client) => (
                    <tr key={client.id} className="hover:bg-[var(--bg-main)]/60 transition-colors">
                      <td className="py-4 px-6 font-bold text-[var(--text-primary)] flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-purple-400 shrink-0" />
                        <span>{client.company_name}</span>
                      </td>

                      <td className="py-4 px-6 text-[var(--text-muted)]">
                        {client.members && client.members.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {client.members.map((m, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-0.5 rounded-lg bg-[var(--bg-main)] border border-[var(--border-color)] text-[10px] text-purple-300"
                              >
                                {m.profiles?.full_name || "User"}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-zinc-500">No users linked</span>
                        )}
                      </td>

                      <td className="py-4 px-6 font-bold text-purple-300">
                        <span className="px-2.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 font-bold">
                          {client.projects_count} Projects
                        </span>
                      </td>

                      <td className="py-4 px-6 text-[var(--text-muted)]">
                        {formatDate(client.created_at)}
                      </td>

                      <td className="py-4 px-6 text-right">
                        <Link
                          href={`/portal/admin/dashboard`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-300 hover:bg-purple-500/20 text-[11px] font-bold uppercase transition-all"
                        >
                          <span>View Projects</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* INVITE NEW CLIENT MODAL */}
      {inviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#111015] border border-white/10 rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative">
            <div className="h-[2px] w-full bg-gradient-to-r from-purple-600 via-purple-400 to-fuchsia-500 absolute top-0 left-0 right-0 rounded-t-2xl" />

            <h3 className="text-xl font-bold font-headline text-white mb-2 mt-1">
              Invite New Client
            </h3>
            <p className="text-xs text-zinc-400 mb-6">
              Create the client company, linked member account, and trigger a Supabase invite email.
            </p>

            {inviteError && (
              <div className="mb-4 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{inviteError}</span>
              </div>
            )}

            {inviteSuccess && (
              <div className="mb-4 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{inviteSuccess}</span>
              </div>
            )}

            <form onSubmit={handleInviteClient} className="space-y-4 font-mono text-xs">
              <div>
                <label className="block text-zinc-400 mb-1.5 uppercase tracking-wider text-[10px]">
                  Company / Brand Name *
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. Hero Motors"
                    className="w-full bg-[#18171E] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder:text-zinc-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 mb-1.5 uppercase tracking-wider text-[10px]">
                  Contact Person Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="e.g. Anand Verma"
                    className="w-full bg-[#18171E] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder:text-zinc-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 mb-1.5 uppercase tracking-wider text-[10px]">
                  Contact Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="e.g. anand@heromotors.com"
                    className="w-full bg-[#18171E] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder:text-zinc-600"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setInviteModalOpen(false)}
                  className="w-1/2 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold uppercase transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={inviteLoading}
                  className="w-1/2 py-3 rounded-xl tgs-gradient-bg text-white font-bold uppercase hover:scale-[1.02] transition-all disabled:opacity-50"
                >
                  {inviteLoading ? "Sending..." : "Send Invite"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

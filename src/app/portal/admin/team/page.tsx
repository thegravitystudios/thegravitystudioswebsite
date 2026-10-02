"use client";

import React, { useState } from "react";
import Link from "next/link";
import { PortalTopHeader } from "@/components/PortalTopHeader";
import { PortalSidebar } from "@/components/PortalSidebar";
import { PortalRightSidebar } from "@/components/PortalRightSidebar";
import { PortalBreadcrumbs } from "@/components/PortalBreadcrumbs";
import { useToast } from "@/context/ToastContext";
import {
  Users,
  Plus,
  ShieldCheck,
  Briefcase,
  Clock,
  MoreVertical,
  X,
  CheckCircle2,
  Mail,
  Layers,
} from "lucide-react";

interface TeamMemberRecord {
  id: string;
  name: string;
  roleTitle: string;
  email: string;
  portalRole: "admin" | "team";
  assignedProjects: number;
  loggedHours: number;
  status: "active" | "away";
}

export default function AdminTeamPage() {
  const { addToast } = useToast();
  const [selectedStaff, setSelectedStaff] = useState<TeamMemberRecord | null>(null);
  const [addModalOpen, setAddModalOpen] = useState(false);

  // Form states
  const [formName, setFormName] = useState("");
  const [formTitle, setFormTitle] = useState("Lead Producer");
  const [formEmail, setFormEmail] = useState("");
  const [formRole, setFormRole] = useState<"admin" | "team">("team");

  const [staffList, setStaffList] = useState<TeamMemberRecord[]>([
    { id: "tm1", name: "Prameet Patani", roleTitle: "Founder & Creative Director", email: "prameet@thegravitystudios.com", portalRole: "admin", assignedProjects: 4, loggedHours: 42, status: "active" },
    { id: "tm2", name: "Alex Lovter", roleTitle: "Lead Video Producer", email: "alex@thegravitystudios.com", portalRole: "team", assignedProjects: 3, loggedHours: 38, status: "active" },
    { id: "tm3", name: "Sara Jenkins", roleTitle: "Senior Colorist & Editor", email: "sara@thegravitystudios.com", portalRole: "team", assignedProjects: 2, loggedHours: 35, status: "active" },
    { id: "tm4", name: "Vikram Malhotra", roleTitle: "Paid Media Lead", email: "vikram@thegravitystudios.com", portalRole: "team", assignedProjects: 3, loggedHours: 40, status: "away" },
  ]);

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formEmail) return;

    const newStaff: TeamMemberRecord = {
      id: Date.now().toString(),
      name: formName,
      roleTitle: formTitle,
      email: formEmail,
      portalRole: formRole,
      assignedProjects: 1,
      loggedHours: 0,
      status: "active",
    };

    setStaffList((prev) => [newStaff, ...prev]);
    addToast("Staff Member Added", `${formName} (${formTitle}) joined agency roster.`);
    setFormName("");
    setFormEmail("");
    setAddModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-primary)] flex flex-col font-sans transition-colors select-none">
      <PortalTopHeader userName="Prameet Patani" companyName="Agency OS" userRole="admin" />

      <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-8 pb-12 flex flex-col lg:flex-row gap-6">
        <PortalSidebar companyName="Agency Admin" userRole="admin" />

        <main className="flex-grow space-y-6">
          <PortalBreadcrumbs items={[{ label: "Agency Team Roster" }]} />

          {/* Header Bar */}
          <div className="p-6 sm:p-7 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-surface)] shadow-[0_10px_30px_rgba(0,0,0,0.03)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold font-headline text-[var(--text-primary)] flex items-center gap-3">
                  <Users className="w-6 h-6 text-purple-400" />
                  <span>Agency Staff & Capacity Roster</span>
                </h1>
              </div>
              <p className="text-xs text-[var(--text-muted)] mt-1">
                Internal team producers, video editors, strategists, and active workload capacity.
              </p>
            </div>

            <button
              onClick={() => setAddModalOpen(true)}
              className="px-5 py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-md transition-all shrink-0 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add Staff Member</span>
            </button>
          </div>

          {/* STAFF ROSTER GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {staffList.map((staff) => (
              <div
                key={staff.id}
                onClick={() => setSelectedStaff(staff)}
                className="p-5 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-surface)] hover:border-purple-500/50 shadow-[0_10px_30px_rgba(0,0,0,0.03)] transition-all flex flex-col justify-between space-y-4 cursor-pointer group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-600 to-fuchsia-500 text-white font-bold text-xs flex items-center justify-center shadow-md">
                        {staff.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold font-headline text-[var(--text-primary)] group-hover:text-purple-300 transition-colors">
                          {staff.name}
                        </h3>
                        <span className="text-[10px] font-mono text-purple-400 font-bold block">{staff.roleTitle}</span>
                      </div>
                    </div>

                    <span
                      className={`px-2.5 py-0.5 rounded-full font-mono text-[9px] font-bold uppercase border ${
                        staff.portalRole === "admin"
                          ? "bg-purple-500/10 text-purple-300 border-purple-500/20"
                          : "bg-sky-500/10 text-sky-300 border-sky-500/20"
                      }`}
                    >
                      {staff.portalRole}
                    </span>
                  </div>

                  <div className="space-y-1 text-[11px] font-mono text-[var(--text-muted)] pt-2 border-t border-[var(--border-color)]">
                    <div className="flex justify-between">
                      <span>Assigned Workloads</span>
                      <strong className="text-[var(--text-primary)]">{staff.assignedProjects} Projects</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Hours Logged This Week</span>
                      <strong className="text-purple-300">{staff.loggedHours} hrs</strong>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs font-mono text-purple-400 font-bold pt-3 border-t border-[var(--border-color)]">
                  <span>View Capacity Drawer</span>
                  <span className="group-hover:underline">Manage →</span>
                </div>
              </div>
            ))}
          </div>
        </main>

        <PortalRightSidebar />
      </div>

      {/* STAFF CAPACITY DRAWER */}
      {selectedStaff && (
        <div className="fixed inset-0 z-50 flex justify-end select-none">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedStaff(null)} />
          <div className="relative w-full max-w-md bg-[var(--bg-surface)] border-l border-[var(--border-color)] shadow-2xl h-full overflow-y-auto p-6 space-y-6 z-50 font-sans text-xs">
            <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
              <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-mono text-[10px] uppercase font-bold">
                STAFF WORKLOAD
              </span>
              <button onClick={() => setSelectedStaff(null)} className="text-zinc-500 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-purple-600 to-fuchsia-500 text-white font-bold text-base flex items-center justify-center shadow-md">
                {selectedStaff.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-base font-bold font-headline text-[var(--text-primary)]">{selectedStaff.name}</h3>
                <span className="text-xs font-mono text-purple-400 font-bold">{selectedStaff.roleTitle}</span>
              </div>
            </div>

            <div className="space-y-2 font-mono text-xs bg-[var(--bg-main)] p-4 rounded-2xl border border-[var(--border-color)]">
              <div className="flex justify-between">
                <span className="text-[var(--text-muted)]">Direct Email</span>
                <span className="font-bold text-[var(--text-primary)]">{selectedStaff.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-muted)]">System Role</span>
                <span className="font-bold text-purple-300 uppercase">{selectedStaff.portalRole}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ADD STAFF MODAL */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setAddModalOpen(false)} />
          <form onSubmit={handleAddStaff} className="relative w-full max-w-md bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-3xl p-6 shadow-2xl z-50 space-y-4 font-sans text-xs">
            <h3 className="text-base font-bold font-headline text-[var(--text-primary)]">+ Onboard Staff Member</h3>
            <div>
              <label className="block font-mono text-[10px] text-[var(--text-muted)] uppercase mb-1">Full Name</label>
              <input
                type="text"
                required
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="e.g. Alex Lovter"
                className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-2xl px-4 py-3 text-xs text-[var(--text-primary)] focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block font-mono text-[10px] text-[var(--text-muted)] uppercase mb-1">Job Title</label>
              <input
                type="text"
                required
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="e.g. Senior Colorist"
                className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-2xl px-4 py-3 text-xs text-[var(--text-primary)] focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block font-mono text-[10px] text-[var(--text-muted)] uppercase mb-1">Studio Email</label>
              <input
                type="email"
                required
                value={formEmail}
                onChange={(e) => setFormEmail(e.target.value)}
                placeholder="alex@thegravitystudios.com"
                className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-2xl px-4 py-3 text-xs text-[var(--text-primary)] focus:outline-none focus:border-purple-500"
              />
            </div>
            <div className="flex gap-2 justify-end pt-2">
              <button
                type="button"
                onClick={() => setAddModalOpen(false)}
                className="px-4 py-2.5 rounded-2xl border border-[var(--border-color)] text-[var(--text-muted)] text-xs font-mono uppercase font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-2xl bg-purple-600 text-white text-xs font-mono uppercase font-bold"
              >
                Add Staff Member
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

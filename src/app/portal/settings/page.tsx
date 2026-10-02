"use client";

import React, { useState } from "react";
import Link from "next/link";
import { PortalTopHeader } from "@/components/PortalTopHeader";
import { PortalSidebar } from "@/components/PortalSidebar";
import { PortalRightSidebar } from "@/components/PortalRightSidebar";
import { PortalBreadcrumbs } from "@/components/PortalBreadcrumbs";
import { useTheme } from "@/context/ThemeContext";
import { useToast } from "@/context/ToastContext";
import {
  User,
  Bell,
  ShieldCheck,
  Users,
  Sliders,
  Database,
  ArrowLeft,
  Upload,
  Check,
  Smartphone,
  Key,
  QrCode,
  Download,
  Trash2,
  Plus,
  Moon,
  Sun,
  Lock,
} from "lucide-react";

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme();
  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState<
    "profile" | "notifications" | "security" | "team" | "preferences" | "privacy"
  >("profile");

  // Profile Tab state
  const [fullName, setFullName] = useState("Anand Verma");
  const [email] = useState("client@thegravitystudios.com");
  const [phone, setPhone] = useState("+91 98765 43210");
  const [savingProfile, setSavingProfile] = useState(false);

  // Notifications Tab state (toggles)
  const [notifToggles, setNotifToggles] = useState({
    deliverableEmail: true,
    deliverableApp: true,
    revisionEmail: true,
    revisionApp: true,
    approvalEmail: true,
    approvalApp: true,
    invoiceEmail: true,
    invoiceApp: true,
    commentEmail: true,
    commentApp: true,
  });

  // Security Tab state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [activeSessions, setActiveSessions] = useState([
    { id: "s1", device: "MacBook Pro (macOS)", location: "Mumbai, India", lastActive: "Active Now", isCurrent: true },
    { id: "s2", device: "iPhone 15 Pro (iOS)", location: "Mumbai, India", lastActive: "2 hours ago", isCurrent: false },
  ]);

  // Team Tab state
  const [teamMembers, setTeamMembers] = useState([
    { id: "tm1", name: "Anand Verma", email: "anand@heromotors.com", role: "approver" },
    { id: "tm2", name: "Rohan Mehta", email: "rohan@heromotors.com", role: "viewer" },
  ]);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [inviteName, setInviteName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("viewer");

  // Preferences Tab state
  const [landingTab, setLandingTab] = useState("Home");
  const [timezone, setTimezone] = useState("Asia/Kolkata (IST - UTC+05:30)");

  // Save Profile Handler
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setTimeout(() => {
      setSavingProfile(false);
      addToast("Profile updated successfully", "Your personal details have been saved.");
    }, 600);
  };

  // Change Password Handler
  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      addToast("Password mismatch", "New password and confirmation do not match.", "error");
      return;
    }
    addToast("Password updated", "Your account password has been changed successfully.");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  // Invite Team Member Handler
  const handleInviteTeam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteName || !inviteEmail) return;
    setTeamMembers((prev) => [
      ...prev,
      { id: Date.now().toString(), name: inviteName, email: inviteEmail, role: inviteRole },
    ]);
    addToast("Team invite sent", `An invitation has been sent to ${inviteEmail}.`);
    setInviteName("");
    setInviteEmail("");
    setInviteModalOpen(false);
  };

  // Remove Team Member Handler
  const handleRemoveTeam = (id: string, name: string) => {
    setTeamMembers((prev) => prev.filter((m) => m.id !== id));
    addToast("Access revoked", `Removed ${name} from portal access.`, "info");
  };

  // Export Data Handler
  const handleExportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(
      JSON.stringify({ company: "Hero Motors", exportDate: new Date().toISOString(), team: teamMembers })
    );
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "gravity-portal-data-export.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    addToast("Data export generated", "Your workspace data package has been downloaded.");
  };

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-primary)] flex flex-col font-sans transition-colors">
      <PortalTopHeader userName={fullName} userEmail={email} companyName="Hero Motors" userRole="client" />

      <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-8 pb-12 flex flex-col lg:flex-row gap-6">
        <PortalSidebar companyName="Hero Motors" userRole="client" />

        <main className="flex-grow space-y-6">
          <PortalBreadcrumbs items={[{ label: "Account Settings" }]} />

          {/* Header Banner */}
          <div className="p-6 sm:p-7 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-surface)] shadow-[0_10px_30px_rgba(0,0,0,0.03)]">
            <h1 className="text-2xl font-bold font-headline text-[var(--text-primary)]">
              Account & Portal Settings
            </h1>
            <p className="text-xs text-[var(--text-muted)] mt-1">
              Manage your personal profile, notification matrix, security preferences, team access, and data privacy.
            </p>
          </div>

          {/* Settings Tab Bar */}
          <div className="flex items-center gap-1.5 border-b border-[var(--border-color)] overflow-x-auto pb-1">
            <button
              onClick={() => setActiveTab("profile")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-t-2xl font-mono text-xs font-bold uppercase transition-all border-b-2 shrink-0 cursor-pointer ${
                activeTab === "profile"
                  ? "border-purple-500 text-purple-400 bg-purple-500/10"
                  : "border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Profile</span>
            </button>

            <button
              onClick={() => setActiveTab("notifications")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-t-2xl font-mono text-xs font-bold uppercase transition-all border-b-2 shrink-0 cursor-pointer ${
                activeTab === "notifications"
                  ? "border-purple-500 text-purple-400 bg-purple-500/10"
                  : "border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              }`}
            >
              <Bell className="w-3.5 h-3.5" />
              <span>Notifications</span>
            </button>

            <button
              onClick={() => setActiveTab("security")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-t-2xl font-mono text-xs font-bold uppercase transition-all border-b-2 shrink-0 cursor-pointer ${
                activeTab === "security"
                  ? "border-purple-500 text-purple-400 bg-purple-500/10"
                  : "border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Security</span>
            </button>

            <button
              onClick={() => setActiveTab("team")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-t-2xl font-mono text-xs font-bold uppercase transition-all border-b-2 shrink-0 cursor-pointer ${
                activeTab === "team"
                  ? "border-purple-500 text-purple-400 bg-purple-500/10"
                  : "border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Team Access</span>
            </button>

            <button
              onClick={() => setActiveTab("preferences")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-t-2xl font-mono text-xs font-bold uppercase transition-all border-b-2 shrink-0 cursor-pointer ${
                activeTab === "preferences"
                  ? "border-purple-500 text-purple-400 bg-purple-500/10"
                  : "border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Preferences</span>
            </button>

            <button
              onClick={() => setActiveTab("privacy")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-t-2xl font-mono text-xs font-bold uppercase transition-all border-b-2 shrink-0 cursor-pointer ${
                activeTab === "privacy"
                  ? "border-purple-500 text-purple-400 bg-purple-500/10"
                  : "border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>Data & Privacy</span>
            </button>
          </div>

          {/* TAB 1: PROFILE */}
          {activeTab === "profile" && (
            <form onSubmit={handleSaveProfile} className="p-6 sm:p-7 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-surface)] space-y-6">
              <h3 className="text-base font-bold font-headline text-[var(--text-primary)]">Profile Details</h3>

              {/* Avatar section with sensible initials fallback */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-purple-600 to-fuchsia-500 flex items-center justify-center text-white font-bold text-xl shadow-md border-2 border-purple-400/40">
                  {fullName ? fullName.charAt(0).toUpperCase() : "A"}
                </div>
                <div>
                  <button
                    type="button"
                    onClick={() => addToast("Avatar upload simulation", "Avatar image selector opened.", "info")}
                    className="px-4 py-2 rounded-2xl bg-[var(--bg-main)] border border-[var(--border-color)] hover:border-purple-500/50 text-xs font-mono text-[var(--text-primary)] font-bold uppercase flex items-center gap-2 transition-all cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5 text-purple-400" />
                    <span>Upload New Avatar</span>
                  </button>
                  <p className="text-[10px] text-[var(--text-muted)] mt-1.5 font-mono">
                    PNG or JPG up to 2MB. Solid color initials used by default.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-mono text-[10px] text-[var(--text-muted)] uppercase mb-1.5">Display Name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-2xl px-4 py-3 text-xs text-[var(--text-primary)] focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[10px] text-[var(--text-muted)] uppercase mb-1.5">
                    Email Address <span className="text-zinc-500">(Read-Only)</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    readOnly
                    className="w-full bg-[var(--bg-main)]/60 border border-[var(--border-color)] rounded-2xl px-4 py-3 text-xs text-zinc-400 cursor-not-allowed"
                  />
                  <p className="text-[9px] text-zinc-500 mt-1 font-mono">Contact studio producer to update email.</p>
                </div>

                <div>
                  <label className="block font-mono text-[10px] text-[var(--text-muted)] uppercase mb-1.5">Phone Number (Optional)</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 00000 00000"
                    className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-2xl px-4 py-3 text-xs text-[var(--text-primary)] focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="px-6 py-3 rounded-2xl tgs-gradient-bg text-white font-mono text-xs font-bold uppercase hover:scale-105 transition-all cursor-pointer"
                >
                  {savingProfile ? "Saving..." : "Save Profile Changes"}
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: NOTIFICATIONS MATRIX */}
          {activeTab === "notifications" && (
            <div className="p-6 sm:p-7 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-surface)] space-y-6">
              <div>
                <h3 className="text-base font-bold font-headline text-[var(--text-primary)]">Notification Matrix</h3>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">Control how you receive project alerts across Email and In-App channels.</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-sans border-collapse">
                  <thead>
                    <tr className="border-b border-[var(--border-color)] font-mono text-[10px] text-[var(--text-muted)] uppercase">
                      <th className="py-3 px-2">Notification Type</th>
                      <th className="py-3 px-4 text-center">Email</th>
                      <th className="py-3 px-4 text-center">In-App</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border-color)]">
                    {[
                      { key: "deliverable", title: "New deliverable ready" },
                      { key: "revision", title: "Revision requested" },
                      { key: "approval", title: "Approval needed" },
                      { key: "invoice", title: "Invoice due" },
                      { key: "comment", title: "New comment on a project" },
                    ].map((row) => (
                      <tr key={row.key} className="hover:bg-[var(--bg-main)]/50 transition-colors">
                        <td className="py-3.5 px-2 font-medium text-[var(--text-primary)]">{row.title}</td>
                        <td className="py-3.5 px-4 text-center">
                          <input
                            type="checkbox"
                            defaultChecked
                            className="w-4 h-4 rounded accent-purple-600 cursor-pointer"
                            onChange={() => addToast("Preference updated", `${row.title} email toggle saved.`, "info")}
                          />
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <input
                            type="checkbox"
                            defaultChecked
                            className="w-4 h-4 rounded accent-purple-600 cursor-pointer"
                            onChange={() => addToast("Preference updated", `${row.title} in-app toggle saved.`, "info")}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: SECURITY */}
          {activeTab === "security" && (
            <div className="space-y-6">
              {/* Quiet Trust Signal Line */}
              <div className="px-4 py-2.5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-[11px] font-mono text-[var(--text-muted)]">
                🔒 Last login: Saturday, Aug 29, 2026 at 07:15 PM IST (Mumbai, IN)
              </div>

              {/* Change Password Form */}
              <form onSubmit={handleChangePassword} className="p-6 sm:p-7 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-surface)] space-y-4">
                <h3 className="text-base font-bold font-headline text-[var(--text-primary)]">Change Password</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <label className="block font-mono text-[10px] text-[var(--text-muted)] uppercase mb-1">Current Password</label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-2xl px-4 py-3 text-xs text-[var(--text-primary)] focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-[10px] text-[var(--text-muted)] uppercase mb-1">New Password</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-2xl px-4 py-3 text-xs text-[var(--text-primary)] focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-[10px] text-[var(--text-muted)] uppercase mb-1">Confirm New Password</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-2xl px-4 py-3 text-xs text-[var(--text-primary)] focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-2xl bg-purple-600 text-white font-mono text-xs font-bold uppercase hover:bg-purple-500 transition-all cursor-pointer"
                >
                  Update Password
                </button>
              </form>

              {/* Active Sessions */}
              <div className="p-6 sm:p-7 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-surface)] space-y-4">
                <h3 className="text-base font-bold font-headline text-[var(--text-primary)]">Active Sessions</h3>
                <div className="space-y-3 font-sans text-xs">
                  {activeSessions.map((s) => (
                    <div key={s.id} className="p-4 rounded-2xl bg-[var(--bg-main)] border border-[var(--border-color)] flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Smartphone className="w-5 h-5 text-purple-400 shrink-0" />
                        <div>
                          <div className="font-bold text-[var(--text-primary)] flex items-center gap-2">
                            <span>{s.device}</span>
                            {s.isCurrent && (
                              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono text-[9px]">
                                THIS DEVICE
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] font-mono text-[var(--text-muted)]">{s.location} • {s.lastActive}</div>
                        </div>
                      </div>
                      {!s.isCurrent && (
                        <button
                          onClick={() => {
                            setActiveSessions((prev) => prev.filter((item) => item.id !== s.id));
                            addToast("Session logged out", `Revoked access for ${s.device}.`, "info");
                          }}
                          className="px-3 py-1.5 rounded-xl border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 text-xs font-mono font-bold uppercase transition-all cursor-pointer"
                        >
                          Log out
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Two-Factor Authentication TOTP Setup */}
              <div className="p-6 sm:p-7 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-surface)] space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold font-headline text-[var(--text-primary)]">Two-Factor Authentication (2FA)</h3>
                    <p className="text-xs text-[var(--text-muted)]">Protect your client portal account with TOTP authenticator apps.</p>
                  </div>
                  <button
                    onClick={() => {
                      setTwoFactorEnabled(!twoFactorEnabled);
                      addToast(
                        twoFactorEnabled ? "2FA Disabled" : "2FA Configured",
                        twoFactorEnabled ? "Two-factor auth has been turned off." : "Scan the QR code in your authenticator app.",
                        twoFactorEnabled ? "info" : "success"
                      );
                    }}
                    className={`px-4 py-2 rounded-2xl font-mono text-xs font-bold uppercase transition-all cursor-pointer ${
                      twoFactorEnabled
                        ? "bg-rose-500/20 border border-rose-500/40 text-rose-300"
                        : "bg-purple-600 text-white shadow-md"
                    }`}
                  >
                    {twoFactorEnabled ? "Disable 2FA" : "Set Up 2FA"}
                  </button>
                </div>

                {twoFactorEnabled && (
                  <div className="mt-4 p-5 rounded-2xl bg-[var(--bg-main)] border border-[var(--border-color)] space-y-4 text-xs font-sans">
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                      <div className="w-32 h-32 rounded-2xl bg-white p-2 flex items-center justify-center shrink-0 shadow-md">
                        <QrCode className="w-28 h-28 text-black" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-[var(--text-primary)] mb-1">Scan QR Code</h4>
                        <p className="text-[11px] text-[var(--text-muted)] mb-3 leading-relaxed">
                          Scan this QR code with Google Authenticator, 1Password, or Authy.
                        </p>
                        <div className="font-mono text-xs font-bold text-purple-300 bg-[var(--bg-surface)] px-3 py-2 rounded-xl border border-[var(--border-color)] inline-block select-all">
                          Manual Key: G7X9-K2M4-P9L1-T8R3
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-[var(--border-color)]">
                      <h5 className="font-mono text-[10px] text-[var(--text-muted)] uppercase font-bold mb-2">
                        Backup Recovery Codes (Save these securely)
                      </h5>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-[11px] text-zinc-300 bg-[var(--bg-surface)] p-3 rounded-xl border border-[var(--border-color)]">
                        <span>8921-4401</span>
                        <span>3319-0291</span>
                        <span>7104-5820</span>
                        <span>4921-8831</span>
                        <span>1290-6712</span>
                        <span>9021-3419</span>
                        <span>5610-8921</span>
                        <span>3481-9012</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: TEAM ACCESS */}
          {activeTab === "team" && (
            <div className="p-6 sm:p-7 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-surface)] space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold font-headline text-[var(--text-primary)]">Company Team Access</h3>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">Manage colleagues from Hero Motors with portal access.</p>
                </div>
                <button
                  onClick={() => setInviteModalOpen(true)}
                  className="px-4 py-2.5 rounded-2xl bg-purple-600 text-white font-mono text-xs font-bold uppercase hover:bg-purple-500 transition-all flex items-center gap-2 shrink-0 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Invite Team Member</span>
                </button>
              </div>

              <div className="space-y-3 font-sans text-xs">
                {teamMembers.map((tm) => (
                  <div key={tm.id} className="p-4 rounded-2xl bg-[var(--bg-main)] border border-[var(--border-color)] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-purple-600/20 text-purple-300 font-bold flex items-center justify-center text-xs">
                        {tm.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-[var(--text-primary)]">{tm.name}</div>
                        <div className="text-[10px] font-mono text-[var(--text-muted)]">{tm.email}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="px-2.5 py-1 rounded-full bg-zinc-800 text-zinc-300 font-mono text-[10px] uppercase font-bold">
                        {tm.role}
                      </span>
                      {tm.email !== email && (
                        <button
                          onClick={() => handleRemoveTeam(tm.id, tm.name)}
                          className="p-2 rounded-xl text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                          title="Revoke access"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Invite Modal */}
              {inviteModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setInviteModalOpen(false)} />
                  <form onSubmit={handleInviteTeam} className="relative w-full max-w-md bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-3xl p-6 shadow-2xl z-50 space-y-4 font-sans text-xs">
                    <h4 className="text-base font-bold font-headline text-[var(--text-primary)]">Invite Team Member</h4>
                    <div>
                      <label className="block font-mono text-[10px] text-[var(--text-muted)] uppercase mb-1">Full Name</label>
                      <input
                        type="text"
                        required
                        value={inviteName}
                        onChange={(e) => setInviteName(e.target.value)}
                        placeholder="e.g. Priyesh Shah"
                        className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-2xl px-4 py-3 text-xs text-[var(--text-primary)] focus:outline-none focus:border-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block font-mono text-[10px] text-[var(--text-muted)] uppercase mb-1">Email Address</label>
                      <input
                        type="email"
                        required
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        placeholder="colleague@heromotors.com"
                        className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-2xl px-4 py-3 text-xs text-[var(--text-primary)] focus:outline-none focus:border-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block font-mono text-[10px] text-[var(--text-muted)] uppercase mb-1">Portal Role</label>
                      <select
                        value={inviteRole}
                        onChange={(e) => setInviteRole(e.target.value)}
                        className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-2xl px-4 py-3 text-xs text-[var(--text-primary)] focus:outline-none focus:border-purple-500"
                      >
                        <option value="approver">Approver (Can sign off cuts & deliverables)</option>
                        <option value="viewer">Viewer (Read-only access)</option>
                      </select>
                    </div>
                    <div className="flex gap-2 justify-end pt-2">
                      <button
                        type="button"
                        onClick={() => setInviteModalOpen(false)}
                        className="px-4 py-2.5 rounded-2xl border border-[var(--border-color)] text-[var(--text-muted)] text-xs font-mono uppercase font-bold"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2.5 rounded-2xl bg-purple-600 text-white text-xs font-mono uppercase font-bold"
                      >
                        Send Invitation
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: PREFERENCES */}
          {activeTab === "preferences" && (
            <div className="p-6 sm:p-7 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-surface)] space-y-6">
              <h3 className="text-base font-bold font-headline text-[var(--text-primary)]">Portal Preferences</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-mono text-[10px] text-[var(--text-muted)] uppercase mb-1.5">
                    Default Landing Tab
                  </label>
                  <select
                    value={landingTab}
                    onChange={(e) => {
                      setLandingTab(e.target.value);
                      addToast("Preference saved", `Default landing set to ${e.target.value}.`, "info");
                    }}
                    className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-2xl px-4 py-3 text-xs text-[var(--text-primary)] focus:outline-none focus:border-purple-500"
                  >
                    <option value="Home">Home Dashboard</option>
                    <option value="Tasks">Tasks & Deliverables</option>
                    <option value="Files">Files & Documents</option>
                  </select>
                </div>

                <div>
                  <label className="block font-mono text-[10px] text-[var(--text-muted)] uppercase mb-1.5">
                    Workspace Timezone
                  </label>
                  <select
                    value={timezone}
                    onChange={(e) => {
                      setTimezone(e.target.value);
                      addToast("Timezone saved", `Deadlines adjusted to ${e.target.value}.`, "info");
                    }}
                    className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-2xl px-4 py-3 text-xs text-[var(--text-primary)] focus:outline-none focus:border-purple-500"
                  >
                    <option value="Asia/Kolkata (IST - UTC+05:30)">Asia/Kolkata (IST - UTC+05:30)</option>
                    <option value="America/New_York (EST - UTC-05:00)">America/New_York (EST - UTC-05:00)</option>
                    <option value="Europe/London (GMT - UTC+00:00)">Europe/London (GMT - UTC+00:00)</option>
                  </select>
                </div>
              </div>

              {/* Duplicated Light / Dark Mode Toggle for discoverability */}
              <div className="pt-4 border-t border-[var(--border-color)] flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-xs text-[var(--text-primary)]">Interface Theme</h4>
                  <p className="text-[11px] text-[var(--text-muted)]">Switch between Light Mode and Dark Mode.</p>
                </div>
                <button
                  onClick={(e) => {
                    toggleTheme(e);
                    addToast("Theme toggled", `Switched to ${theme === "light" ? "Dark" : "Light"} Mode.`, "info");
                  }}
                  className="px-4 py-2.5 rounded-2xl bg-[var(--bg-main)] border border-[var(--border-color)] hover:border-purple-500/50 text-xs font-mono font-bold text-[var(--text-primary)] uppercase flex items-center gap-2 transition-all cursor-pointer"
                >
                  {theme === "light" ? <Moon className="w-4 h-4 text-purple-400" /> : <Sun className="w-4 h-4 text-amber-400" />}
                  <span>{theme === "light" ? "Enable Dark Mode" : "Enable Light Mode"}</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 6: DATA & PRIVACY */}
          {activeTab === "privacy" && (
            <div className="p-6 sm:p-7 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-surface)] space-y-6">
              <div>
                <h3 className="text-base font-bold font-headline text-[var(--text-primary)]">Data Ownership & Privacy</h3>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">Download your workspace records and review data hosting details.</p>
              </div>

              <div className="p-5 rounded-2xl bg-[var(--bg-main)] border border-[var(--border-color)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h4 className="font-bold text-xs text-[var(--text-primary)] mb-1">Export Workspace Data</h4>
                  <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
                    Download a comprehensive JSON package of all uploaded project briefs, contracts, activity logs, and invoice records.
                  </p>
                </div>
                <button
                  onClick={handleExportData}
                  className="px-5 py-2.5 rounded-2xl bg-purple-600 text-white font-mono text-xs font-bold uppercase flex items-center gap-2 hover:bg-purple-500 transition-all shrink-0 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download My Data</span>
                </button>
              </div>

              {/* Factual Storage Disclosure */}
              <div className="p-4 rounded-2xl bg-[var(--bg-main)]/50 border border-[var(--border-color)] text-xs text-[var(--text-muted)] space-y-2 leading-relaxed">
                <div className="font-bold text-[var(--text-primary)] font-mono text-[10px] uppercase tracking-wider">
                  DATA STORAGE DISCLOSURE
                </div>
                <p>
                  Client workspace data and uploaded assets are stored in Supabase PostgreSQL databases and encrypted at rest using AES-256 standards. Row-Level Security (RLS) policies strictly restrict access to authorized team members of your brand company.
                </p>
              </div>
            </div>
          )}
        </main>

        <PortalRightSidebar />
      </div>
    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Users,
  FolderPlus,
  FilePlus,
  LogOut,
  ShieldCheck,
  Plus,
  CheckCircle2,
  ExternalLink,
  Sparkles,
} from "lucide-react";

export default function AdminControlCenterPage() {
  const router = useRouter();
  const [adminUser, setAdminUser] = useState<any>(null);
  const [clients, setClients] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"clients" | "links" | "generator">("clients");

  // Form states
  // 1. New Client Form
  const [clientName, setClientName] = useState("");
  const [brandName, setBrandName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [projectStatus, setProjectStatus] = useState("In Production");

  // 2. Link Form
  const [selectedClientId, setSelectedClientId] = useState("");
  const [linkTitle, setLinkTitle] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [linkDescription, setLinkDescription] = useState("");

  // 3. Document Generator Form
  const [docClientId, setDocClientId] = useState("");
  const [docType, setDocType] = useState("proposal");
  const [docTitle, setDocTitle] = useState("");
  const [docSummary, setDocSummary] = useState("");

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("gravity_user");
    if (!stored) {
      router.push("/portal");
      return;
    }
    const parsed = JSON.parse(stored);
    if (parsed.role !== "admin") {
      router.push("/portal/dashboard");
      return;
    }
    setAdminUser(parsed);
    fetchClients();
  }, [router]);

  const fetchClients = async () => {
    try {
      const res = await fetch("/api/portal/admin/clients");
      const data = await res.json();
      if (data.clients) {
        setClients(data.clients);
        if (data.clients.length > 0) {
          setSelectedClientId(data.clients[0].id);
          setDocClientId(data.clients[0].id);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/portal/admin/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientName, brandName, email, password, projectStatus }),
      });
      const data = await res.json();

      if (data.success) {
        setMessage(`✅ Client ${brandName} created successfully!`);
        setClientName("");
        setBrandName("");
        setEmail("");
        setPassword("");
        fetchClients();
      } else {
        setMessage(`❌ Error: ${data.error}`);
      }
    } catch (err: any) {
      setMessage(`❌ Error creating client`);
    }
    setLoading(false);
  };

  const handleAddLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/portal/admin/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientId: selectedClientId,
          title: linkTitle,
          url: linkUrl,
          description: linkDescription,
        }),
      });
      const data = await res.json();

      if (data.success) {
        setMessage(`✅ Google Drive / Asset Link added!`);
        setLinkTitle("");
        setLinkUrl("");
        setLinkDescription("");
      } else {
        setMessage(`❌ Error: ${data.error}`);
      }
    } catch (err: any) {
      setMessage(`❌ Error adding link`);
    }
    setLoading(false);
  };

  const handleGenerateDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/portal/admin/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientId: docClientId,
          docType,
          title: docTitle,
          content: {
            summary: docSummary,
            generatedBy: "The Gravity Studios Founder Admin",
            date: new Date().toLocaleDateString(),
          },
        }),
      });
      const data = await res.json();

      if (data.success) {
        setMessage(`✅ Document '${docTitle}' published to client portal!`);
        setDocTitle("");
        setDocSummary("");
      } else {
        setMessage(`❌ Error: ${data.error}`);
      }
    } catch (err: any) {
      setMessage(`❌ Error generating document`);
    }
    setLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("gravity_user");
    router.push("/portal");
  };

  return (
    <div className="min-h-screen bg-[#070709] text-white flex flex-col font-sans select-none">
      {/* Header */}
      <header className="border-b border-zinc-800/80 bg-[#0c0c10]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-purple-400" />
            <div>
              <h1 className="font-extrabold text-sm sm:text-base tracking-tight font-headline">
                FOUNDER MASTER CONTROL CENTER
              </h1>
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">
                The Gravity Studios Admin Dashboard
              </span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white transition-colors"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Body */}
      <main className="flex-grow max-w-[1400px] mx-auto w-full px-4 sm:px-8 py-8">
        {message && (
          <div className="mb-6 p-4 rounded-xl bg-purple-950/40 border border-purple-500/30 text-purple-300 text-sm font-mono">
            {message}
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-zinc-800/80 mb-8">
          <button
            onClick={() => setActiveTab("clients")}
            className={`px-5 py-3 rounded-t-xl font-mono text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
              activeTab === "clients"
                ? "border-purple-500 text-purple-400 bg-purple-500/10"
                : "border-transparent text-zinc-400 hover:text-white"
            }`}
          >
            <Users className="w-4 h-4" />
            <span>CLIENT MANAGEMENT ({clients.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("links")}
            className={`px-5 py-3 rounded-t-xl font-mono text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
              activeTab === "links"
                ? "border-purple-500 text-purple-400 bg-purple-500/10"
                : "border-transparent text-zinc-400 hover:text-white"
            }`}
          >
            <FolderPlus className="w-4 h-4" />
            <span>DRIVE & ASSET LINKS</span>
          </button>
          <button
            onClick={() => setActiveTab("generator")}
            className={`px-5 py-3 rounded-t-xl font-mono text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
              activeTab === "generator"
                ? "border-purple-500 text-purple-400 bg-purple-500/10"
                : "border-transparent text-zinc-400 hover:text-white"
            }`}
          >
            <FilePlus className="w-4 h-4" />
            <span>DOCUMENT GENERATOR</span>
          </button>
        </div>

        {/* TAB 1: CLIENT MANAGEMENT */}
        {activeTab === "clients" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Create Client Form */}
            <div className="lg:col-span-1 bg-[#0e0e12] border border-zinc-800 rounded-2xl p-6">
              <h3 className="text-base font-bold font-headline mb-4 text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-purple-400" />
                <span>Add New Client Account</span>
              </h3>

              <form onSubmit={handleCreateClient} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-mono text-zinc-400 mb-1">CLIENT NAME</label>
                  <input
                    type="text"
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="e.g. John Doe"
                    className="w-full bg-[#141419] border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-zinc-400 mb-1">BRAND / COMPANY NAME</label>
                  <input
                    type="text"
                    required
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    placeholder="e.g. Natural Veneers"
                    className="w-full bg-[#141419] border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-zinc-400 mb-1">CLIENT LOGIN EMAIL</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="client@brand.com"
                    className="w-full bg-[#141419] border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-zinc-400 mb-1">ASSIGN LOGIN PASSWORD</label>
                  <input
                    type="text"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="e.g. Brand@2026"
                    className="w-full bg-[#141419] border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-zinc-400 mb-1">PROJECT STATUS</label>
                  <select
                    value={projectStatus}
                    onChange={(e) => setProjectStatus(e.target.value)}
                    className="w-full bg-[#141419] border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="In Production">In Production</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 font-mono text-xs font-bold text-white transition-all shadow-[0_0_15px_rgba(168,85,247,0.4)]"
                >
                  {loading ? "CREATING..." : "+ CREATE CLIENT ACCOUNT"}
                </button>
              </form>
            </div>

            {/* Clients List */}
            <div className="lg:col-span-2 bg-[#0e0e12] border border-zinc-800 rounded-2xl p-6">
              <h3 className="text-base font-bold font-headline mb-4 text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-purple-400" />
                <span>Active Clients List</span>
              </h3>

              {clients.length === 0 ? (
                <div className="text-center py-12 text-zinc-500 font-mono text-xs">
                  No client accounts created yet. Use the form on the left to add your first client!
                </div>
              ) : (
                <div className="space-y-3">
                  {clients.map((c) => (
                    <div
                      key={c.id}
                      className="p-4 rounded-xl bg-[#141419] border border-zinc-800 flex items-center justify-between"
                    >
                      <div>
                        <h4 className="font-bold text-sm text-white">{c.brand_name}</h4>
                        <span className="text-xs text-zinc-400 block">{c.client_name} • {c.email}</span>
                        <span className="text-[10px] font-mono text-purple-400 mt-1 block">
                          Password: <code className="bg-zinc-900 px-1.5 py-0.5 rounded text-white">{c.password_hash}</code>
                        </span>
                      </div>
                      <span className="text-xs font-mono px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
                        {c.project_status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: DRIVE & ASSET LINKS */}
        {activeTab === "links" && (
          <div className="max-w-2xl mx-auto bg-[#0e0e12] border border-zinc-800 rounded-2xl p-6 sm:p-8">
            <h3 className="text-lg font-bold font-headline mb-2 text-white">
              Attach Google Drive & Asset Link
            </h3>
            <p className="text-zinc-400 text-xs mb-6">
              Attach Google Drive folders, Frame.io review links, or raw footage links to a specific client.
            </p>

            <form onSubmit={handleAddLink} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">SELECT CLIENT</label>
                <select
                  value={selectedClientId}
                  onChange={(e) => setSelectedClientId(e.target.value)}
                  className="w-full bg-[#141419] border border-zinc-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-purple-500"
                >
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.brand_name} ({c.client_name})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">LINK TITLE</label>
                <input
                  type="text"
                  required
                  value={linkTitle}
                  onChange={(e) => setLinkTitle(e.target.value)}
                  placeholder="e.g. Master Production Google Drive Folder"
                  className="w-full bg-[#141419] border border-zinc-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">GOOGLE DRIVE / ASSET URL</label>
                <input
                  type="url"
                  required
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://drive.google.com/drive/folders/..."
                  className="w-full bg-[#141419] border border-zinc-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-purple-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">DESCRIPTION (OPTIONAL)</label>
                <textarea
                  rows={3}
                  value={linkDescription}
                  onChange={(e) => setLinkDescription(e.target.value)}
                  placeholder="e.g. Folder containing 4K master cutdowns and raw project assets."
                  className="w-full bg-[#141419] border border-zinc-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-purple-600 hover:bg-purple-500 font-mono text-xs font-bold text-white transition-all shadow-[0_0_15px_rgba(168,85,247,0.4)]"
              >
                {loading ? "ATTACHING..." : "ATTACH TO CLIENT PORTAL"}
              </button>
            </form>
          </div>
        )}

        {/* TAB 3: DOCUMENT GENERATOR */}
        {activeTab === "generator" && (
          <div className="max-w-2xl mx-auto bg-[#0e0e12] border border-zinc-800 rounded-2xl p-6 sm:p-8">
            <h3 className="text-lg font-bold font-headline mb-2 text-white">
              Brand Document Generator
            </h3>
            <p className="text-zinc-400 text-xs mb-6">
              Generate proposals, contracts, briefs, or invoices that publish directly to the client's dashboard.
            </p>

            <form onSubmit={handleGenerateDocument} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">SELECT CLIENT</label>
                <select
                  value={docClientId}
                  onChange={(e) => setDocClientId(e.target.value)}
                  className="w-full bg-[#141419] border border-zinc-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-purple-500"
                >
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.brand_name} ({c.client_name})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">DOCUMENT TYPE</label>
                <select
                  value={docType}
                  onChange={(e) => setDocType(e.target.value)}
                  className="w-full bg-[#141419] border border-zinc-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="proposal">Proposal / Pitch Deck</option>
                  <option value="brief">Brand Strategy Brief</option>
                  <option value="contract">Production Contract / Agreement</option>
                  <option value="invoice">Official Invoice</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">DOCUMENT TITLE</label>
                <input
                  type="text"
                  required
                  value={docTitle}
                  onChange={(e) => setDocTitle(e.target.value)}
                  placeholder="e.g. Master Production Agreement 2026"
                  className="w-full bg-[#141419] border border-zinc-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">DOCUMENT SUMMARY / TERMS</label>
                <textarea
                  rows={5}
                  required
                  value={docSummary}
                  onChange={(e) => setDocSummary(e.target.value)}
                  placeholder="Enter scope of work, deliverables, payment terms, or project overview..."
                  className="w-full bg-[#141419] border border-zinc-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-purple-500 leading-relaxed"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-purple-600 hover:bg-purple-500 font-mono text-xs font-bold text-white transition-all shadow-[0_0_15px_rgba(168,85,247,0.4)]"
              >
                {loading ? "GENERATING..." : "GENERATE & PUBLISH TO CLIENT PORTAL"}
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}

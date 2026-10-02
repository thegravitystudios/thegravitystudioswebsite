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
  Search,
  MoreVertical,
  ChevronRight,
  Mail,
  Phone,
  Building2,
  X,
  FileText,
  Receipt,
  CheckCircle2,
  ExternalLink,
  Grid,
  List,
  Layers,
} from "lucide-react";

interface ClientRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  retainer: string;
  status: "active" | "onboarding" | "lead";
  avatarColor: string;
  activeProjects: number;
}

export default function ClientDirectoryPage() {
  const { addToast } = useToast();
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterTab, setFilterTab] = useState<"all" | "active">("all");

  const [selectedClient, setSelectedClient] = useState<ClientRecord | null>(null);
  const [newClientModalOpen, setNewClientModalOpen] = useState(false);

  // Form states for new client modal
  const [formCompany, setFormCompany] = useState("");
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formRetainer, setFormRetainer] = useState("₹2,50,000");

  const [clients, setClients] = useState<ClientRecord[]>([
    { id: "c1", name: "Anand Verma", email: "anand@heromotors.com", phone: "(901) 888-3019", company: "Hero Motors", retainer: "₹2,50,000 / mo", status: "active", avatarColor: "bg-purple-600", activeProjects: 2 },
    { id: "c2", name: "Wei Chen", email: "weichen@naturalveneers.com", phone: "(901) 331-2020", company: "Natural Veneers", retainer: "₹1,80,000 / mo", status: "active", avatarColor: "bg-indigo-600", activeProjects: 1 },
    { id: "c3", name: "Miya Chen", email: "miya.chen@gmail.com", phone: "(901) 332-9000", company: "Aura Apparel", retainer: "₹1,50,000 / mo", status: "active", avatarColor: "bg-fuchsia-600", activeProjects: 1 },
    { id: "c4", name: "Roger Parks", email: "roger.parks@gmail.com", phone: "(209) 111-3290", company: "Summit Tech", retainer: "₹3,00,000 / mo", status: "active", avatarColor: "bg-sky-600", activeProjects: 3 },
    { id: "c5", name: "Arthur Taylor", email: "arthur@gmail.com", phone: "(301) 481-2332", company: "Vantage Group", retainer: "₹2,00,000 / mo", status: "active", avatarColor: "bg-rose-600", activeProjects: 1 },
    { id: "c6", name: "Dianne Russell", email: "dianne@gmail.com", phone: "(909) 999-7676", company: "Pixel Craft", retainer: "₹1,20,000 / mo", status: "onboarding", avatarColor: "bg-amber-600", activeProjects: 1 },
    { id: "c7", name: "Harry Potter", email: "harry@gmail.com", phone: "(909) 999-2901", company: "Magic Labs", retainer: "₹2,20,000 / mo", status: "active", avatarColor: "bg-emerald-600", activeProjects: 2 },
    { id: "c8", name: "Mike Banner", email: "mike.banner@gmail.com", phone: "(303) 909-2390", company: "Apex Systems", retainer: "₹1,90,000 / mo", status: "active", avatarColor: "bg-teal-600", activeProjects: 1 },
  ]);

  const filteredClients = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formCompany || !formName || !formEmail) return;

    const newRecord: ClientRecord = {
      id: Date.now().toString(),
      name: formName,
      email: formEmail,
      phone: formPhone || "(901) 555-0192",
      company: formCompany,
      retainer: `${formRetainer} / mo`,
      status: "active",
      avatarColor: "bg-purple-600",
      activeProjects: 1,
    };

    setClients((prev) => [newRecord, ...prev]);
    addToast("Client added", `${formCompany} (${formName}) has been added to agency directory.`);
    setFormCompany("");
    setFormName("");
    setFormEmail("");
    setFormPhone("");
    setNewClientModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-primary)] flex flex-col font-sans transition-colors select-none">
      <PortalTopHeader userName="Prameet Patani" companyName="Agency OS" userRole="admin" />

      <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-8 pb-12 flex flex-col lg:flex-row gap-6">
        <PortalSidebar companyName="Agency Directory" userRole="admin" />

        <main className="flex-grow space-y-6">
          <PortalBreadcrumbs items={[{ label: "Client Directory" }]} />

          {/* Top Control Bar matching reference image layout */}
          <div className="p-6 sm:p-7 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-surface)] shadow-[0_10px_30px_rgba(0,0,0,0.03)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold font-headline text-[var(--text-primary)]">Clients</h1>
                <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-mono text-xs font-bold">
                  {clients.length} Total
                </span>
              </div>
              <p className="text-xs text-[var(--text-muted)] mt-1">
                Manage client accounts, retainers, contact personnel, and project workspaces.
              </p>
            </div>

            {/* "+ New Client" Primary Button matching reference image */}
            <button
              onClick={() => setNewClientModalOpen(true)}
              className="px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-md transition-all shrink-0 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ New Client</span>
            </button>
          </div>

          {/* Filter & View Switcher Bar matching reference image */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => setFilterTab("all")}
                className={`px-4 py-2 rounded-2xl text-xs font-mono font-bold uppercase transition-all cursor-pointer ${
                  filterTab === "all"
                    ? "bg-purple-600 text-white shadow-md"
                    : "bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-muted)]"
                }`}
              >
                All Clients ({clients.length})
              </button>
              <button
                onClick={() => setFilterTab("active")}
                className={`px-4 py-2 rounded-2xl text-xs font-mono font-bold uppercase transition-all cursor-pointer ${
                  filterTab === "active"
                    ? "bg-purple-600 text-white shadow-md"
                    : "bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-muted)]"
                }`}
              >
                Active Retainers ({clients.filter((c) => c.status === "active").length})
              </button>
            </div>

            {/* Search Input & Grid/List View Controls matching reference image */}
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-grow sm:w-64">
                <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search clients..."
                  className="w-full bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl pl-10 pr-4 py-2 text-xs text-[var(--text-primary)] placeholder:text-zinc-400 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="flex items-center p-1 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-color)]">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-1.5 rounded-xl transition-all cursor-pointer ${
                    viewMode === "grid" ? "bg-purple-600 text-white" : "text-zinc-400 hover:text-white"
                  }`}
                  title="Grid Card View"
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("table")}
                  className={`p-1.5 rounded-xl transition-all cursor-pointer ${
                    viewMode === "table" ? "bg-purple-600 text-white" : "text-zinc-400 hover:text-white"
                  }`}
                  title="Table View"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* GRID CARD VIEW matching reference image media_1788069415522.png */}
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredClients.map((client) => (
                <div
                  key={client.id}
                  className="p-5 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-surface)] shadow-[0_10px_30px_rgba(0,0,0,0.03)] hover:border-purple-500/40 transition-all flex flex-col justify-between space-y-4 group"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full ${client.avatarColor} text-white font-bold text-xs flex items-center justify-center shadow-md`}>
                          {client.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="text-sm font-bold font-headline text-[var(--text-primary)] truncate max-w-[130px]">
                            {client.name}
                          </h3>
                          <span className="text-[10px] font-mono text-[var(--text-muted)] block truncate max-w-[130px]">
                            {client.email}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => setSelectedClient(client)}
                        className="text-zinc-500 hover:text-[var(--text-primary)] p-1"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="space-y-1.5 text-[11px] font-mono text-[var(--text-muted)] pt-2 border-t border-[var(--border-color)]">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                        <span className="truncate text-[var(--text-primary)] font-semibold">{client.company}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                        <span>{client.phone}</span>
                      </div>
                    </div>
                  </div>

                  {/* "See details >" Button matching reference image */}
                  <div className="flex items-center justify-between pt-3 border-t border-[var(--border-color)]">
                    <span className="text-[10px] font-mono text-emerald-400 font-bold">
                      {client.retainer}
                    </span>
                    <button
                      onClick={() => setSelectedClient(client)}
                      className="text-xs font-mono font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <span>See details</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* TABLE VIEW */
            <div className="p-6 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-surface)] shadow-[0_10px_30px_rgba(0,0,0,0.03)] overflow-x-auto">
              <table className="w-full text-left text-xs font-sans border-collapse">
                <thead>
                  <tr className="border-b border-[var(--border-color)] font-mono text-[10px] text-[var(--text-muted)] uppercase">
                    <th className="py-3 px-3">Contact</th>
                    <th className="py-3 px-3">Company</th>
                    <th className="py-3 px-3">Phone</th>
                    <th className="py-3 px-3">Retainer</th>
                    <th className="py-3 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-color)]">
                  {filteredClients.map((client) => (
                    <tr key={client.id} className="hover:bg-[var(--bg-main)]/50 transition-colors">
                      <td className="py-3.5 px-3">
                        <div className="font-bold text-[var(--text-primary)]">{client.name}</div>
                        <div className="text-[10px] font-mono text-[var(--text-muted)]">{client.email}</div>
                      </td>
                      <td className="py-3.5 px-3 font-semibold text-[var(--text-primary)]">{client.company}</td>
                      <td className="py-3.5 px-3 font-mono text-zinc-400">{client.phone}</td>
                      <td className="py-3.5 px-3 font-mono text-emerald-400 font-bold">{client.retainer}</td>
                      <td className="py-3.5 px-3 text-right">
                        <button
                          onClick={() => setSelectedClient(client)}
                          className="px-3 py-1.5 rounded-xl bg-purple-600/20 text-purple-300 text-xs font-mono font-bold uppercase hover:bg-purple-600/40 cursor-pointer"
                        >
                          See Details →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>

        <PortalRightSidebar />
      </div>

      {/* SLIDE-OVER CLIENT DETAIL DRAWER */}
      {selectedClient && (
        <div className="fixed inset-0 z-50 flex justify-end select-none">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setSelectedClient(null)} />

          <div className="relative w-full max-w-md bg-[var(--bg-surface)] border-l border-[var(--border-color)] shadow-2xl h-full overflow-y-auto p-6 space-y-6 z-50 font-sans animate-fade-in">
            <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-full ${selectedClient.avatarColor} text-white font-bold text-sm flex items-center justify-center shadow-md`}>
                  {selectedClient.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-base font-bold font-headline text-[var(--text-primary)]">{selectedClient.name}</h3>
                  <span className="text-xs font-mono text-purple-400 font-bold">{selectedClient.company}</span>
                </div>
              </div>
              <button onClick={() => setSelectedClient(null)} className="p-1 text-zinc-500 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Client Metrics */}
            <div className="grid grid-cols-2 gap-3 font-mono text-xs">
              <div className="p-3.5 rounded-2xl bg-[var(--bg-main)] border border-[var(--border-color)]">
                <span className="text-[10px] text-[var(--text-muted)] block uppercase">Monthly Retainer</span>
                <span className="font-bold text-emerald-400">{selectedClient.retainer}</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-[var(--bg-main)] border border-[var(--border-color)]">
                <span className="text-[10px] text-[var(--text-muted)] block uppercase">Active Projects</span>
                <span className="font-bold text-purple-300">{selectedClient.activeProjects} Active</span>
              </div>
            </div>

            {/* Contact Details */}
            <div className="space-y-2 text-xs font-mono bg-[var(--bg-main)] p-4 rounded-2xl border border-[var(--border-color)]">
              <div className="flex justify-between">
                <span className="text-[var(--text-muted)]">Email</span>
                <span className="font-bold text-[var(--text-primary)]">{selectedClient.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-muted)]">Phone</span>
                <span className="font-bold text-[var(--text-primary)]">{selectedClient.phone}</span>
              </div>
            </div>

            {/* Quick SaaS Actions */}
            <div className="space-y-2 pt-2">
              <Link
                href="/portal/projects/demo"
                onClick={() => setSelectedClient(null)}
                className="w-full py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-mono text-xs font-bold uppercase flex items-center justify-center gap-2 shadow-md transition-all"
              >
                <Layers className="w-4 h-4" />
                <span>Open Project Workspace</span>
              </Link>
              <button
                onClick={() => {
                  addToast("Invoice created", `New draft invoice issued for ${selectedClient.company}.`);
                  setSelectedClient(null);
                }}
                className="w-full py-3 rounded-2xl bg-[var(--bg-main)] border border-[var(--border-color)] hover:border-purple-500/50 text-[var(--text-primary)] font-mono text-xs font-bold uppercase flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Receipt className="w-4 h-4 text-amber-400" />
                <span>Issue Monthly Invoice</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE NEW CLIENT MODAL */}
      {newClientModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setNewClientModalOpen(false)} />
          <form onSubmit={handleAddClient} className="relative w-full max-w-md bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-3xl p-6 shadow-2xl z-50 space-y-4 font-sans text-xs">
            <h3 className="text-base font-bold font-headline text-[var(--text-primary)]">+ Invite New Client Company</h3>
            <div>
              <label className="block font-mono text-[10px] text-[var(--text-muted)] uppercase mb-1">Company Name</label>
              <input
                type="text"
                required
                value={formCompany}
                onChange={(e) => setFormCompany(e.target.value)}
                placeholder="e.g. Hero Motors"
                className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-2xl px-4 py-3 text-xs text-[var(--text-primary)] focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block font-mono text-[10px] text-[var(--text-muted)] uppercase mb-1">Contact Person Name</label>
              <input
                type="text"
                required
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="e.g. Anand Verma"
                className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-2xl px-4 py-3 text-xs text-[var(--text-primary)] focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block font-mono text-[10px] text-[var(--text-muted)] uppercase mb-1">Email Address</label>
              <input
                type="email"
                required
                value={formEmail}
                onChange={(e) => setFormEmail(e.target.value)}
                placeholder="anand@heromotors.com"
                className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-2xl px-4 py-3 text-xs text-[var(--text-primary)] focus:outline-none focus:border-purple-500"
              />
            </div>
            <div className="flex gap-2 justify-end pt-2">
              <button
                type="button"
                onClick={() => setNewClientModalOpen(false)}
                className="px-4 py-2.5 rounded-2xl border border-[var(--border-color)] text-[var(--text-muted)] text-xs font-mono uppercase font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-2xl bg-blue-600 text-white text-xs font-mono uppercase font-bold"
              >
                Create Client & Send Invite
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

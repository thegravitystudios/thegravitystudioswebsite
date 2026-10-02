import { Compass, FileCheck, Camera, Film, Megaphone, BarChart2 } from "lucide-react";

export interface PhaseInfo {
  id: string;
  number: string;
  name: string;
  icon: any;
  stepIndex: number;
}

export const SIX_PHASES: PhaseInfo[] = [
  { id: "strategy", number: "01", name: "Strategy", icon: Compass, stepIndex: 0 },
  { id: "pre_production", number: "02", name: "Pre-Production", icon: FileCheck, stepIndex: 1 },
  { id: "production", number: "03", name: "Production", icon: Camera, stepIndex: 2 },
  { id: "post_production", number: "04", name: "Post-Production", icon: Film, stepIndex: 3 },
  { id: "marketing", number: "05", name: "Marketing", icon: Megaphone, stepIndex: 4 },
  { id: "analysis", number: "06", name: "Analysis", icon: BarChart2, stepIndex: 5 },
];

export function getPhaseInfo(phaseId: string): PhaseInfo {
  const found = SIX_PHASES.find((p) => p.id === phaseId);
  if (found) return found;
  // Default fallback
  return SIX_PHASES[0];
}

export function getStatusBadge(status: string) {
  switch (status) {
    case "on_track":
      return {
        label: "ON TRACK",
        className: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
        dotColor: "bg-emerald-400",
      };
    case "at_risk":
      return {
        label: "AT RISK",
        className: "bg-amber-500/10 text-amber-400 border-amber-500/30",
        dotColor: "bg-amber-400",
      };
    case "delayed":
      return {
        label: "DELAYED",
        className: "bg-rose-500/10 text-rose-400 border-rose-500/30",
        dotColor: "bg-rose-400",
      };
    case "completed":
      return {
        label: "COMPLETED",
        className: "bg-purple-500/10 text-purple-400 border-purple-500/30",
        dotColor: "bg-purple-400",
      };
    default:
      return {
        label: status.toUpperCase().replace("_", " "),
        className: "bg-zinc-500/10 text-zinc-400 border-zinc-500/30",
        dotColor: "bg-zinc-400",
      };
  }
}

export function getVideoStatusBadge(status: string) {
  switch (status) {
    case "pending_review":
      return {
        label: "PENDING REVIEW",
        className: "bg-amber-500/10 text-amber-400 border-amber-500/30",
      };
    case "changes_requested":
      return {
        label: "CHANGES REQUESTED",
        className: "bg-rose-500/10 text-rose-400 border-rose-500/30",
      };
    case "approved":
      return {
        label: "APPROVED",
        className: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
      };
    default:
      return {
        label: status.toUpperCase().replace("_", " "),
        className: "bg-zinc-500/10 text-zinc-400 border-zinc-500/30",
      };
  }
}

export function formatDate(dateStr?: string | null) {
  if (!dateStr) return "N/A";
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  } catch (e) {
    return dateStr;
  }
}

"use client";

import React, { useState } from "react";
import { PortalTopHeader } from "@/components/PortalTopHeader";
import { PortalSidebar } from "@/components/PortalSidebar";
import { PortalRightSidebar } from "@/components/PortalRightSidebar";
import { PortalBreadcrumbs } from "@/components/PortalBreadcrumbs";
import { useToast } from "@/context/ToastContext";
import {
  CheckSquare,
  Plus,
  Clock,
  User,
  X,
  CheckCircle2,
  Circle,
  ArrowRight,
  MoreVertical,
} from "lucide-react";

interface TaskCard {
  id: string;
  title: string;
  column: "backlog" | "in_progress" | "review" | "done";
  priority: "High" | "Medium" | "Low";
  assignee: string;
  loggedHours: number;
}

export default function KanbanTasksPage() {
  const { addToast } = useToast();
  const [selectedTask, setSelectedTask] = useState<TaskCard | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  // Form states
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState<"High" | "Medium" | "Low">("High");
  const [newTaskAssignee, setNewTaskAssignee] = useState("Prameet P.");

  const [tasks, setTasks] = useState<TaskCard[]>([
    { id: "t1", title: "Finalize Color Grade on Commercial Cut v1", column: "in_progress", priority: "High", assignee: "Prameet P.", loggedHours: 4.5 },
    { id: "t2", title: "Sound Design & Master Score Mix", column: "review", priority: "High", assignee: "Anand V.", loggedHours: 3.0 },
    { id: "t3", title: "Handover Design Assets and Specifications", column: "done", priority: "Medium", assignee: "Alex L.", loggedHours: 6.0 },
    { id: "t4", title: "Define Target Market & Persona Brief", column: "done", priority: "Medium", assignee: "Rohan M.", loggedHours: 2.0 },
    { id: "t5", title: "Prepare Q4 Campaign Media Plan", column: "backlog", priority: "Low", assignee: "Prameet P.", loggedHours: 0.0 },
  ]);

  const moveTask = (id: string, targetCol: TaskCard["column"]) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, column: targetCol } : t))
    );
    addToast("Task moved", `Shifted task to ${targetCol.replace("_", " ").toUpperCase()}.`);
    if (selectedTask?.id === id) {
      setSelectedTask((prev) => (prev ? { ...prev, column: targetCol } : null));
    }
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle) return;
    const newTask: TaskCard = {
      id: Date.now().toString(),
      title: newTaskTitle,
      column: "in_progress",
      priority: newTaskPriority,
      assignee: newTaskAssignee,
      loggedHours: 0,
    };
    setTasks((prev) => [newTask, ...prev]);
    addToast("Task created", `"${newTaskTitle}" added to In Progress board.`);
    setNewTaskTitle("");
    setCreateModalOpen(false);
  };

  const handleLogTime = (id: string, hours: number) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, loggedHours: t.loggedHours + hours } : t))
    );
    addToast("Time logged", `Recorded +${hours} hrs on task.`);
    if (selectedTask?.id === id) {
      setSelectedTask((prev) => (prev ? { ...prev, loggedHours: prev.loggedHours + hours } : null));
    }
  };

  const columns: { id: TaskCard["column"]; label: string }[] = [
    { id: "backlog", label: "Backlog" },
    { id: "in_progress", label: "In Progress" },
    { id: "review", label: "Review / QC" },
    { id: "done", label: "Done" },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-primary)] flex flex-col font-sans transition-colors select-none">
      <PortalTopHeader userName="Anand Verma" companyName="Hero Motors" userRole="client" />

      <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-8 pb-12 flex flex-col lg:flex-row gap-6">
        <PortalSidebar companyName="Hero Motors" userRole="client" />

        <main className="flex-grow space-y-6">
          <PortalBreadcrumbs items={[{ label: "Projects & Tasks" }]} />

          {/* Header Bar */}
          <div className="p-6 sm:p-7 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-surface)] shadow-[0_10px_30px_rgba(0,0,0,0.03)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold font-headline text-[var(--text-primary)] flex items-center gap-3">
                <CheckSquare className="w-6 h-6 text-purple-400" />
                <span>Kanban Task Board</span>
              </h1>
              <p className="text-xs text-[var(--text-muted)] mt-1">
                Real-time agency task management, assignees, and time tracking.
              </p>
            </div>

            <button
              onClick={() => setCreateModalOpen(true)}
              className="px-5 py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-md transition-all shrink-0 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ New Task</span>
            </button>
          </div>

          {/* KANBAN COLUMNS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {columns.map((col) => {
              const colTasks = tasks.filter((t) => t.column === col.id);

              return (
                <div
                  key={col.id}
                  className="p-4 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-surface)]/60 min-h-[500px] flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4 pb-2 border-b border-[var(--border-color)]">
                      <span className="font-headline text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider">
                        {col.label}
                      </span>
                      <span className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-300 font-mono text-[10px] font-bold flex items-center justify-center">
                        {colTasks.length}
                      </span>
                    </div>

                    <div className="space-y-3">
                      {colTasks.map((t) => (
                        <div
                          key={t.id}
                          onClick={() => setSelectedTask(t)}
                          className="p-4 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] hover:border-purple-500/50 shadow-sm transition-all space-y-3 cursor-pointer group"
                        >
                          <div className="flex items-center justify-between">
                            <span
                              className={`px-2 py-0.5 rounded-full font-mono text-[9px] font-bold uppercase border ${
                                t.priority === "High"
                                  ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                                  : "bg-zinc-800 text-zinc-300 border-zinc-700"
                              }`}
                            >
                              {t.priority}
                            </span>
                            <span className="text-[10px] font-mono text-purple-300">{t.loggedHours}h logged</span>
                          </div>

                          <h4 className="text-xs font-bold font-headline text-[var(--text-primary)] group-hover:text-purple-300 transition-colors">
                            {t.title}
                          </h4>

                          <div className="flex items-center justify-between text-[10px] font-mono text-[var(--text-muted)] pt-2 border-t border-[var(--border-color)]">
                            <div className="flex items-center gap-1.5">
                              <User className="w-3 h-3 text-purple-400" />
                              <span>{t.assignee}</span>
                            </div>
                            <span className="text-blue-400 font-bold group-hover:underline">Details →</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </main>

        <PortalRightSidebar />
      </div>

      {/* TASK DETAIL DRAWER */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 flex justify-end select-none">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedTask(null)} />
          <div className="relative w-full max-w-md bg-[var(--bg-surface)] border-l border-[var(--border-color)] shadow-2xl h-full overflow-y-auto p-6 space-y-6 z-50 font-sans text-xs">
            <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
              <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-mono text-[10px] uppercase font-bold">
                {selectedTask.column.replace("_", " ")}
              </span>
              <button onClick={() => setSelectedTask(null)} className="text-zinc-500 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <h3 className="text-lg font-bold font-headline text-[var(--text-primary)]">{selectedTask.title}</h3>

            <div className="space-y-2 font-mono text-xs bg-[var(--bg-main)] p-4 rounded-2xl border border-[var(--border-color)]">
              <div className="flex justify-between">
                <span className="text-[var(--text-muted)]">Assignee</span>
                <span className="font-bold text-[var(--text-primary)]">{selectedTask.assignee}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-muted)]">Logged Hours</span>
                <span className="font-bold text-purple-300">{selectedTask.loggedHours} hrs</span>
              </div>
            </div>

            {/* Move Task Section */}
            <div>
              <label className="block font-mono text-[10px] text-[var(--text-muted)] uppercase mb-2">Move Column</label>
              <div className="grid grid-cols-2 gap-2">
                {columns.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => moveTask(selectedTask.id, c.id)}
                    className={`p-2.5 rounded-xl border text-xs font-mono font-bold uppercase transition-all cursor-pointer ${
                      selectedTask.column === c.id
                        ? "bg-purple-600 text-white border-purple-500"
                        : "bg-[var(--bg-main)] border-[var(--border-color)] text-[var(--text-muted)] hover:text-white"
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Log Time Action */}
            <div className="pt-2">
              <button
                onClick={() => handleLogTime(selectedTask.id, 1.5)}
                className="w-full py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-mono text-xs font-bold uppercase flex items-center justify-center gap-2 shadow-md cursor-pointer"
              >
                <Clock className="w-4 h-4" />
                <span>+ Log 1.5 Hours Work</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE TASK MODAL */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setCreateModalOpen(false)} />
          <form onSubmit={handleCreateTask} className="relative w-full max-w-md bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-3xl p-6 shadow-2xl z-50 space-y-4 font-sans text-xs">
            <h3 className="text-base font-bold font-headline text-[var(--text-primary)]">+ Create New Task</h3>
            <div>
              <label className="block font-mono text-[10px] text-[var(--text-muted)] uppercase mb-1">Task Title</label>
              <input
                type="text"
                required
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="e.g. Master Audio Sound Mix"
                className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-2xl px-4 py-3 text-xs text-[var(--text-primary)] focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block font-mono text-[10px] text-[var(--text-muted)] uppercase mb-1">Assignee</label>
              <input
                type="text"
                value={newTaskAssignee}
                onChange={(e) => setNewTaskAssignee(e.target.value)}
                className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-2xl px-4 py-3 text-xs text-[var(--text-primary)] focus:outline-none focus:border-purple-500"
              />
            </div>
            <div className="flex gap-2 justify-end pt-2">
              <button
                type="button"
                onClick={() => setCreateModalOpen(false)}
                className="px-4 py-2.5 rounded-2xl border border-[var(--border-color)] text-[var(--text-muted)] text-xs font-mono uppercase font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-2xl bg-purple-600 text-white text-xs font-mono uppercase font-bold"
              >
                Add Task
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

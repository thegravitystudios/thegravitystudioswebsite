"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export interface ToastItem {
  id: string;
  title: string;
  message?: string;
  type?: "success" | "error" | "info";
}

interface ToastContextType {
  toasts: ToastItem[];
  addToast: (title: string, message?: string, type?: "success" | "error" | "info") => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    (title: string, message?: string, type: "success" | "error" | "info" = "success") => {
      const id = Date.now().toString() + Math.random().toString().slice(2, 6);
      const newToast: ToastItem = { id, title, message, type };
      setToasts((prev) => [...prev, newToast]);

      setTimeout(() => {
        removeToast(id);
      }, 3500);
    },
    [removeToast]
  );

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      {/* Toast Render Container in Bottom Right */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none select-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="pointer-events-auto p-4 rounded-2xl bg-[#121118] border border-purple-500/40 shadow-[0_10px_30px_rgba(168,85,247,0.25)] flex items-start gap-3 text-xs font-sans text-white animate-fade-in backdrop-blur-md"
          >
            {toast.type === "error" ? (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            ) : toast.type === "info" ? (
              <Info className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            )}

            <div className="flex-grow">
              <div className="font-bold text-white leading-tight">{toast.title}</div>
              {toast.message && (
                <div className="text-[11px] text-zinc-400 mt-0.5 leading-snug">{toast.message}</div>
              )}
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="text-zinc-500 hover:text-white transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

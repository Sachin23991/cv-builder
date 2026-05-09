"use client";
/**
 * components/SaveStatus.tsx
 * Fix #29: Visual indicator showing autosave state so users never wonder
 * if their work is persisted. Displays Saving… → Saved ✓ → error states.
 *
 * Usage:
 *   const [saveStatus, setSaveStatus] = useState<SaveStatusType>('idle');
 *   <SaveStatus status={saveStatus} />
 */
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export type SaveStatusType = "idle" | "saving" | "saved" | "error";

interface SaveStatusProps {
  status: SaveStatusType;
}

const STATUS_CONFIG = {
  idle:   { text: "",           color: "",                    icon: null },
  saving: { text: "Saving…",   color: "text-slate-600",      icon: "⏳" },
  saved:  { text: "Saved",     color: "text-emerald-600",    icon: "✓" },
  error:  { text: "Save failed — check connection", color: "text-red-600", icon: "⚠" },
} as const;

export function SaveStatus({ status }: SaveStatusProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (status === "idle") {
      setVisible(false);
      return;
    }
    setVisible(true);
    // Auto-hide "saved" confirmation after 3 s
    if (status === "saved") {
      const t = setTimeout(() => setVisible(false), 3000);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [status]);

  const cfg = STATUS_CONFIG[status];

  return (
    <AnimatePresence>
      {visible && status !== "idle" && (
        <motion.span
          key={status}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.2 }}
          className={`inline-flex items-center gap-1 text-xs font-medium ${cfg.color}`}
          aria-live="polite"
          aria-label={`Save status: ${cfg.text}`}
        >
          {cfg.icon && <span aria-hidden="true">{cfg.icon}</span>}
          {cfg.text}
        </motion.span>
      )}
    </AnimatePresence>
  );
}

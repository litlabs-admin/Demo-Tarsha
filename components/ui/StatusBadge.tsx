// Unified status system — light theme. One source of truth for all statuses.
export type StatusKind =
  | "completed"
  | "missed"
  | "voicemail"
  | "transferred"
  | "active"
  | "archived"
  | "draft"
  | "in-progress";

const STYLES: Record<StatusKind, { cls: string; dot: string; label: string; pulse?: boolean }> = {
  completed:     { cls: "bg-green-50 text-green-700 border-green-200",   dot: "bg-green-500",  label: "Completed" },
  missed:        { cls: "bg-red-50 text-red-700 border-red-200",         dot: "bg-red-500",    label: "Missed" },
  voicemail:     { cls: "bg-slate-100 text-slate-600 border-slate-200",  dot: "bg-slate-400",  label: "Voicemail" },
  transferred:   { cls: "bg-violet-50 text-violet-700 border-violet-200",dot: "bg-violet-500", label: "Transferred" },
  active:        { cls: "bg-green-50 text-green-700 border-green-200",   dot: "bg-green-500",  label: "Active", pulse: true },
  archived:      { cls: "bg-slate-100 text-slate-500 border-slate-200",  dot: "bg-slate-400",  label: "Archived" },
  draft:         { cls: "bg-amber-50 text-amber-700 border-amber-200",   dot: "bg-amber-500",  label: "Draft" },
  "in-progress": { cls: "bg-blue-50 text-blue-700 border-blue-200",      dot: "bg-blue-500",   label: "In Progress", pulse: true },
};

interface StatusBadgeProps {
  status: StatusKind;
  size?: "sm" | "md";
  showDot?: boolean;
}

export function StatusBadge({ status, size = "md", showDot = true }: StatusBadgeProps) {
  const s = STYLES[status] ?? STYLES.draft;
  const pad = size === "sm" ? "px-1.5 py-0.5 text-[11px]" : "px-2 py-0.5 text-xs";
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-medium border ${pad} ${s.cls}`}>
      {showDot && (
        <span className={`w-1.5 h-1.5 rounded-full ${s.dot} ${s.pulse ? "animate-pulse-dot" : ""}`} />
      )}
      {s.label}
    </span>
  );
}

// Back-compat shims used by existing components.
export function CallStatusBadge({ status }: { status: "completed" | "missed" | "voicemail" | "transferred" }) {
  return <StatusBadge status={status} />;
}

export function AgentStatusBadge({ status }: { status: "active" | "archived" | "draft" }) {
  return <StatusBadge status={status} />;
}

"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { useTarsha } from "@/context/TarshaContext";
import { AgentAvatar } from "@/components/ui/AgentAvatar";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { cn } from "@/lib/utils";
import type { CallStatus } from "@/types";

const STATUS_FILTERS: { label: string; value: "all" | CallStatus }[] = [
  { label: "All", value: "all" },
  { label: "Completed", value: "completed" },
  { label: "Missed", value: "missed" },
  { label: "Voicemail", value: "voicemail" },
  { label: "Transferred", value: "transferred" },
];

export default function LogsPage() {
  const router = useRouter();
  const { state } = useTarsha();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"all" | CallStatus>("all");

  function roleOf(name: string) {
    return state.agents.find((a) => a.name === name)?.role;
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return state.recentCalls.filter((c) => {
      if (status !== "all" && c.status !== status) return false;
      if (q && !`${c.caller} ${c.agent} ${c.outcome}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [state.recentCalls, query, status]);

  return (
    <div className="space-y-5 p-6">
      <div>
        <h2 className="font-display text-xl font-bold text-[var(--text-primary)]">Call Logs</h2>
        <p className="text-sm text-[var(--text-secondary)]">Searchable history of every handled call.</p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-[240px] flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by caller, agent, or outcome…"
            className="focus-ring w-full rounded-lg border border-[var(--surface-600)] bg-white py-2 pl-9 pr-3 text-sm placeholder:text-[var(--text-muted)]"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setStatus(f.value)}
              className={cn(
                "focus-ring interactive-press rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                status === f.value
                  ? "border-[var(--brand)] bg-[var(--brand-pale)] text-[var(--text-primary)]"
                  : "border-[var(--surface-600)] bg-white text-[var(--text-secondary)] hover:bg-[var(--surface-700)]"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <p className="text-xs text-[var(--text-muted)]">{filtered.length} calls</p>

      <div className="card-surface overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--surface-600)] text-left text-xs text-[var(--text-muted)]">
              <th className="px-5 py-2.5 font-medium">Caller</th>
              <th className="px-5 py-2.5 font-medium">Agent</th>
              <th className="px-5 py-2.5 font-medium">Duration</th>
              <th className="px-5 py-2.5 font-medium">Status</th>
              <th className="px-5 py-2.5 font-medium">Date</th>
              <th className="px-5 py-2.5 font-medium">Time</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr
                key={c.id}
                onClick={() => router.push(`/calls/${c.id}`)}
                className="cursor-pointer border-b border-[var(--surface-600)] transition-colors last:border-0 hover:bg-[var(--surface-700)]"
              >
                <td className="px-5 py-3">
                  <div className="font-medium text-[var(--text-primary)]">{c.caller}</div>
                  <div className="font-mono-id text-[var(--text-muted)]">{c.outcome}</div>
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <AgentAvatar name={c.agent} role={roleOf(c.agent)} size="xs" />
                    <span className="text-[var(--text-secondary)]">{c.agent}</span>
                  </div>
                </td>
                <td className="px-5 py-3 font-mono-id text-[var(--text-secondary)]">{c.duration}</td>
                <td className="px-5 py-3">
                  <StatusBadge status={c.status} size="sm" />
                </td>
                <td className="px-5 py-3 text-[var(--text-secondary)]">{c.date}</td>
                <td className="px-5 py-3 text-[var(--text-muted)]">{c.time}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-sm text-[var(--text-muted)]">
                  No calls match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

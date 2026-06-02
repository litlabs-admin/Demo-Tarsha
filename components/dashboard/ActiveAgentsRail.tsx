"use client";

import Link from "next/link";
import { useTarsha } from "@/context/TarshaContext";
import { AgentAvatar } from "@/components/ui/AgentAvatar";

export function ActiveAgentsRail() {
  const { state } = useTarsha();
  const active = state.agents.filter((a) => a.status === "active");

  return (
    <div className="space-y-4">
      <div className="card-surface overflow-hidden">
        <div className="border-b border-[var(--surface-600)] px-4 py-3">
          <h3 className="font-display text-base font-bold text-[var(--text-primary)]">Active Receptionists</h3>
        </div>
        <div className="p-2">
          {active.map((a) => (
            <Link
              key={a.id}
              href={`/agents/${a.id}`}
              className="focus-ring flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-[var(--surface-700)]"
            >
              <div className="relative">
                <AgentAvatar name={a.name} role={a.role} size="sm" />
                <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 animate-pulse-dot rounded-full border-2 border-white bg-green-500" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span className="truncate text-sm font-medium text-[var(--text-primary)]">{a.name}</span>
                  <span className="font-mono-id text-[var(--text-muted)]">{a.callsThisWeek}/wk</span>
                </div>
                <div className="truncate text-xs text-[var(--text-secondary)]">{a.role}</div>
                {a.recentActivity[0] && (
                  <div className="truncate text-[11px] text-[var(--text-muted)]">{a.recentActivity[0].outcome}</div>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="card-surface p-4">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 animate-pulse-dot rounded-full bg-green-500" />
          <span className="text-sm font-medium text-[var(--text-primary)]">All systems normal</span>
        </div>
        <p className="font-mono-id mt-1.5 text-[var(--text-muted)]">tarsha.co.uk · calls covered</p>
      </div>
    </div>
  );
}

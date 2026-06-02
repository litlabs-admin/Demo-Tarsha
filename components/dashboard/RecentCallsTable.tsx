"use client";

import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { useTarsha } from "@/context/TarshaContext";
import { AgentAvatar } from "@/components/ui/AgentAvatar";
import { StatusBadge } from "@/components/ui/StatusBadge";

export function RecentCallsTable({ limit = 8 }: { limit?: number }) {
  const router = useRouter();
  const { state } = useTarsha();
  const calls = state.recentCalls.slice(0, limit);

  function roleOf(agentName: string) {
    return state.agents.find((a) => a.name === agentName)?.role;
  }

  return (
    <div className="card-surface overflow-hidden">
      <div className="flex items-center justify-between border-b border-[var(--surface-600)] px-5 py-3.5">
        <h3 className="font-display text-base font-bold text-[var(--text-primary)]">Recent Calls</h3>
        <button
          onClick={() => router.push("/logs")}
          className="focus-ring flex items-center gap-1 text-xs font-medium text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
        >
          View all <ArrowRight size={12} />
        </button>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[var(--surface-600)] text-left text-xs text-[var(--text-muted)]">
            <th className="px-5 py-2 font-medium">Caller</th>
            <th className="px-5 py-2 font-medium">Agent</th>
            <th className="px-5 py-2 font-medium">Duration</th>
            <th className="px-5 py-2 font-medium">Status</th>
            <th className="px-5 py-2 font-medium">Time</th>
          </tr>
        </thead>
        <tbody>
          {calls.map((c) => (
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
              <td className="px-5 py-3 text-[var(--text-muted)]">{c.time}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { Phone, ArrowRight } from "lucide-react";
import { useTarsha } from "@/context/TarshaContext";
import { AgentAvatar } from "@/components/ui/AgentAvatar";
import { StatusBadge } from "@/components/ui/StatusBadge";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import type { Agent } from "@/types";

export function AgentCard({ agent }: { agent: Agent }) {
  const router = useRouter();
  const { openCallDemo } = useTarsha();
  const archived = agent.status === "archived";

  return (
    <div
      onClick={() => router.push(`/agents/${agent.id}`)}
      className={`card-surface hover-lift focus-ring interactive-press flex cursor-pointer flex-col p-4 ${
        archived ? "opacity-60" : ""
      }`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && router.push(`/agents/${agent.id}`)}
    >
      <div className="flex items-start justify-between">
        <AgentAvatar name={agent.name} role={agent.role} size="lg" muted={archived} />
        <StatusBadge status={agent.status} size="sm" />
      </div>

      <div className="mt-3">
        <h3 className="font-display text-base font-bold text-[var(--text-primary)]">{agent.name}</h3>
        <p className="text-sm text-[var(--text-secondary)]">{agent.role}</p>
        <p className="font-mono-id mt-1 text-[var(--text-muted)]">{agent.vapiAgentId}</p>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2 border-t border-[var(--surface-600)] pt-3 text-center">
        <div>
          <div className="text-sm font-bold text-[var(--text-primary)]">{agent.callsHandled}</div>
          <div className="text-[10px] uppercase tracking-wide text-[var(--text-muted)]">Calls</div>
        </div>
        <div>
          <div className="text-sm font-bold text-[var(--text-primary)]">{agent.successRate}%</div>
          <div className="text-[10px] uppercase tracking-wide text-[var(--text-muted)]">Success</div>
        </div>
        <div>
          <div className="text-sm font-bold text-[var(--text-primary)]">{agent.avgDuration}</div>
          <div className="text-[10px] uppercase tracking-wide text-[var(--text-muted)]">Avg</div>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {agent.callTags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-[var(--surface-500)] px-2 py-0.5 text-[11px] text-[var(--text-secondary)]"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={() => router.push(`/agents/${agent.id}`)}
          className="focus-ring interactive-press flex flex-1 items-center justify-center gap-1 rounded-lg border border-[var(--surface-600)] bg-white py-1.5 text-xs font-medium text-[var(--text-primary)] transition-colors hover:bg-[var(--surface-700)]"
        >
          View <ArrowRight size={12} />
        </button>
        {archived ? (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span>
                  <button
                    disabled
                    className="flex cursor-not-allowed items-center justify-center gap-1 rounded-lg border border-[var(--surface-600)] bg-[var(--surface-700)] px-3 py-1.5 text-xs font-medium text-[var(--text-muted)]"
                  >
                    <Phone size={12} /> Test
                  </button>
                </span>
              </TooltipTrigger>
              <TooltipContent>Agent archived</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <button
            onClick={() => openCallDemo(agent.id)}
            className="focus-ring interactive-press flex items-center justify-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold text-black transition-opacity hover:opacity-90"
            style={{ background: "var(--brand)" }}
          >
            <Phone size={12} /> Test
          </button>
        )}
      </div>
    </div>
  );
}

"use client";

import { Plus, ArrowRight, GitBranch } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTarsha } from "@/context/TarshaContext";
import { AgentAvatar } from "@/components/ui/AgentAvatar";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { SEED_SQUADS } from "@/lib/seed-data";

export default function SquadsPage() {
  const { toast } = useToast();
  const { state } = useTarsha();

  function roleOf(name: string) {
    return state.agents.find((a) => a.name === name)?.role;
  }

  return (
    <div className="space-y-5 p-6">
      <div className="anim-fade-up flex items-start justify-between gap-4">
        <div>
          <h2 className="font-display text-xl font-bold text-[var(--text-primary)]">Squads</h2>
          <p className="text-sm text-[var(--text-secondary)]">Multi-agent teams with context-preserving call handoffs.</p>
        </div>
        <button
          onClick={() => toast({ title: "Create Squad", description: "Squad creation is disabled in this demo." })}
          className="focus-ring interactive-press flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-semibold text-black transition-opacity hover:opacity-90"
          style={{ background: "var(--brand)" }}
        >
          <Plus size={15} /> Create Squad
        </button>
      </div>

      <div className="stagger-in grid grid-cols-1 gap-4 md:grid-cols-2">
        {SEED_SQUADS.map((sq) => (
          <div key={sq.id} className="card-surface hover-lift p-5">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <GitBranch size={16} className="text-[var(--brand-dim)]" />
                <p className="font-display font-bold text-[var(--text-primary)]">{sq.name}</p>
              </div>
              <StatusBadge status={sq.status === "active" ? "active" : "draft"} size="sm" />
            </div>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">{sq.description}</p>

            {/* Member handoff chain */}
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {sq.members.map((m, i) => (
                <div key={m} className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 rounded-lg border border-[var(--surface-600)] bg-white px-2 py-1 shadow-sm">
                    <AgentAvatar name={m} role={roleOf(m)} size="xs" />
                    <span className="text-xs font-medium text-[var(--text-primary)]">{m}</span>
                  </div>
                  {i < sq.members.length - 1 && <ArrowRight size={14} className="shrink-0 text-[var(--text-muted)]" />}
                </div>
              ))}
            </div>

            <p className="font-mono-id mt-3 text-[var(--text-muted)]">
              {sq.members.length} members · {sq.transferRules} transfer rules
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

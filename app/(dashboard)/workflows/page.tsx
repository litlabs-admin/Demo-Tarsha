"use client";

import { Plus, ChevronRight, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { SEED_WORKFLOWS } from "@/lib/seed-data";

export default function WorkflowsPage() {
  const { toast } = useToast();

  return (
    <div className="space-y-5 p-6">
      <div className="anim-fade-up flex items-start justify-between gap-4">
        <div>
          <h2 className="font-display text-xl font-bold text-[var(--text-primary)]">Workflows</h2>
          <p className="text-sm text-[var(--text-secondary)]">Visual call flows with branching logic and variable extraction.</p>
        </div>
        <button
          onClick={() => toast({ title: "Create Workflow", description: "The workflow builder is disabled in this demo." })}
          className="focus-ring interactive-press flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-semibold text-black transition-opacity hover:opacity-90"
          style={{ background: "var(--brand)" }}
        >
          <Plus size={15} /> Create Workflow
        </button>
      </div>

      <div className="stagger-in space-y-4">
        {SEED_WORKFLOWS.map((w) => (
          <div key={w.id} className="card-surface hover-lift p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-display font-bold text-[var(--text-primary)]">{w.name}</p>
                  <StatusBadge status={w.status === "active" ? "active" : "draft"} size="sm" />
                </div>
                <p className="mt-1 text-sm text-[var(--text-secondary)]">{w.description}</p>
              </div>
              <div className="flex items-center gap-1.5 whitespace-nowrap rounded-full border border-[var(--surface-600)] bg-[var(--surface-700)] px-2.5 py-1 text-xs text-[var(--text-secondary)]">
                <Zap size={11} className="text-[var(--brand-dim)]" /> {w.trigger}
              </div>
            </div>

            {/* Flow visual */}
            <div className="mt-4 flex flex-wrap items-center gap-1.5 overflow-x-auto">
              {w.nodes.map((node, i) => (
                <div key={node} className="flex items-center gap-1.5">
                  <span className="whitespace-nowrap rounded-lg border border-[var(--surface-600)] bg-white px-2.5 py-1.5 text-xs font-medium text-[var(--text-primary)] shadow-sm">
                    {node}
                  </span>
                  {i < w.nodes.length - 1 && <ChevronRight size={14} className="shrink-0 text-[var(--text-muted)]" />}
                </div>
              ))}
            </div>

            <p className="font-mono-id mt-3 text-[var(--text-muted)]">{w.steps} steps</p>
          </div>
        ))}
      </div>
    </div>
  );
}

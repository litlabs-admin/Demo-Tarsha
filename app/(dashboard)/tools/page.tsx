"use client";

import { useState } from "react";
import { Plus, Wrench } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { SEED_TOOLS } from "@/lib/seed-data";

export default function ToolsPage() {
  const { toast } = useToast();
  const [enabled, setEnabled] = useState<Record<string, boolean>>(
    Object.fromEntries(SEED_TOOLS.map((t) => [t.id, t.enabled]))
  );

  return (
    <div className="space-y-5 p-6">
      <div className="anim-fade-up flex items-start justify-between gap-4">
        <div>
          <h2 className="font-display text-xl font-bold text-[var(--text-primary)]">Tools</h2>
          <p className="text-sm text-[var(--text-secondary)]">No-code actions your agents can call mid-conversation.</p>
        </div>
        <button
          onClick={() => toast({ title: "Create Tool", description: "The tool builder is disabled in this demo." })}
          className="focus-ring interactive-press flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-semibold text-black transition-opacity hover:opacity-90"
          style={{ background: "var(--brand)" }}
        >
          <Plus size={15} /> Create Tool
        </button>
      </div>

      <div className="stagger-in grid grid-cols-1 gap-4 md:grid-cols-2">
        {SEED_TOOLS.map((t) => (
          <div key={t.id} className="card-surface hover-lift p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--surface-500)]">
                  <Wrench size={16} className="text-[var(--brand-dim)]" />
                </div>
                <div>
                  <p className="font-display font-bold text-[var(--text-primary)]">{t.name}</p>
                  <p className="font-mono-id text-[var(--text-muted)]">
                    {t.provider} · {t.category}
                  </p>
                </div>
              </div>
              <Switch
                checked={enabled[t.id]}
                onCheckedChange={(v) => {
                  setEnabled((e) => ({ ...e, [t.id]: v }));
                  toast({ title: v ? `${t.name} enabled` : `${t.name} disabled` });
                }}
              />
            </div>
            <p className="mt-3 text-sm text-[var(--text-secondary)]">{t.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

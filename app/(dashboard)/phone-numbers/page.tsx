"use client";

import { Plus, PhoneCall } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTarsha } from "@/context/TarshaContext";
import { AgentAvatar } from "@/components/ui/AgentAvatar";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { SEED_PHONE_NUMBERS } from "@/lib/seed-data";

export default function PhoneNumbersPage() {
  const { toast } = useToast();
  const { state } = useTarsha();

  function roleOf(name: string | null) {
    return name ? state.agents.find((a) => a.name === name)?.role : undefined;
  }

  return (
    <div className="space-y-5 p-6">
      <div className="anim-fade-up flex items-start justify-between gap-4">
        <div>
          <h2 className="font-display text-xl font-bold text-[var(--text-primary)]">Phone Numbers</h2>
          <p className="text-sm text-[var(--text-secondary)]">Provision numbers and assign them to your AI receptionists.</p>
        </div>
        <button
          onClick={() => toast({ title: "Buy a number", description: "Number provisioning is disabled in this demo." })}
          className="focus-ring interactive-press flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-semibold text-black transition-opacity hover:opacity-90"
          style={{ background: "var(--brand)" }}
        >
          <Plus size={15} /> Buy Number
        </button>
      </div>

      <div className="stagger-in grid grid-cols-1 gap-3 sm:grid-cols-3">
        {[
          { label: "Total Numbers", value: SEED_PHONE_NUMBERS.length },
          { label: "Assigned", value: SEED_PHONE_NUMBERS.filter((n) => n.assignedAgent).length },
          { label: "Unassigned", value: SEED_PHONE_NUMBERS.filter((n) => !n.assignedAgent).length },
        ].map((s) => (
          <div key={s.label} className="card-surface p-4">
            <p className="text-2xl font-bold text-[var(--text-primary)]">{s.value}</p>
            <p className="font-mono-id mt-1 text-[var(--text-muted)]">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="card-surface overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--surface-600)] text-left text-xs text-[var(--text-muted)]">
              <th className="px-5 py-2.5 font-medium">Number</th>
              <th className="px-5 py-2.5 font-medium">Provider</th>
              <th className="px-5 py-2.5 font-medium">Region</th>
              <th className="px-5 py-2.5 font-medium">Assigned Agent</th>
              <th className="px-5 py-2.5 font-medium">Direction</th>
              <th className="px-5 py-2.5 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="stagger-in">
            {SEED_PHONE_NUMBERS.map((n) => (
              <tr key={n.id} className="border-b border-[var(--surface-600)] transition-colors last:border-0 hover:bg-[var(--surface-700)]">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <PhoneCall size={14} className="text-[var(--brand-dim)]" />
                    <span className="font-mono-id text-[var(--text-primary)]">{n.number}</span>
                  </div>
                </td>
                <td className="px-5 py-3 text-[var(--text-secondary)]">{n.provider}</td>
                <td className="px-5 py-3 text-[var(--text-secondary)]">{n.region}</td>
                <td className="px-5 py-3">
                  {n.assignedAgent ? (
                    <div className="flex items-center gap-2">
                      <AgentAvatar name={n.assignedAgent} role={roleOf(n.assignedAgent)} size="xs" />
                      <span className="text-[var(--text-secondary)]">{n.assignedAgent}</span>
                    </div>
                  ) : (
                    <span className="text-[var(--text-muted)]">Unassigned</span>
                  )}
                </td>
                <td className="px-5 py-3 text-[var(--text-secondary)]">{n.direction}</td>
                <td className="px-5 py-3">
                  <StatusBadge status={n.status === "active" ? "active" : "draft"} size="sm" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

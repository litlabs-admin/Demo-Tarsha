"use client";

import { Sparkles, Users, Building2, Activity } from "lucide-react";
import { useTarsha } from "@/context/TarshaContext";

export default function AccountPage() {
  const { state } = useTarsha();
  const activeAgents = state.agents.filter((a) => a.status === "active").length;

  return (
    <div className="mx-auto max-w-3xl space-y-5 p-6">
      <div>
        <h2 className="font-display text-xl font-bold text-[var(--text-primary)]">Account</h2>
        <p className="text-sm text-[var(--text-secondary)]">Your organisation and subscription overview.</p>
      </div>

      <div className="card-surface flex items-center justify-between p-5">
        <div className="flex items-center gap-3">
          <span
            className="flex h-11 w-11 items-center justify-center rounded-xl"
            style={{ background: "var(--brand-glow)" }}
          >
            <Sparkles size={20} className="text-[var(--brand-dim)]" />
          </span>
          <div>
            <p className="font-display text-base font-bold text-[var(--text-primary)]">Tarsha Pro</p>
            <p className="text-sm text-[var(--text-secondary)]">£299 / month · renews 1 Jul 2026</p>
          </div>
        </div>
        <span
          className="rounded-full px-3 py-1 text-xs font-semibold text-black"
          style={{ background: "var(--brand)" }}
        >
          Active
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { icon: Building2, label: "Organisation", value: "Roswell IT" },
          { icon: Users, label: "Seats", value: "5 of 10 used" },
          { icon: Activity, label: "Active Agents", value: `${activeAgents} live` },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="card-surface p-5">
              <Icon size={18} className="text-[var(--text-muted)]" />
              <p className="mt-3 font-display text-lg font-bold text-[var(--text-primary)]">{s.value}</p>
              <p className="text-sm text-[var(--text-secondary)]">{s.label}</p>
            </div>
          );
        })}
      </div>

      <div className="card-surface p-5">
        <h3 className="mb-3 font-display text-base font-bold text-[var(--text-primary)]">Usage this month</h3>
        <div className="mb-1.5 flex justify-between text-sm">
          <span className="text-[var(--text-secondary)]">Call minutes</span>
          <span className="font-mono-id text-[var(--text-primary)]">847 / 2,000</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--surface-500)]">
          <div className="h-full rounded-full" style={{ width: "42.35%", background: "var(--brand)" }} />
        </div>
      </div>
    </div>
  );
}

"use client";

import dynamic from "next/dynamic";
import { TrendingUp, TrendingDown, BarChart3 } from "lucide-react";
import { SEED_REPORTS } from "@/lib/seed-data";
import { StatCard } from "@/components/ui/StatCard";
import { ChartCard } from "@/components/analytics/ChartCard";
import { AgentAvatar } from "@/components/ui/AgentAvatar";

const OutcomeDonut = dynamic(
  () => import("@/components/analytics/OutcomeDonut").then((m) => m.OutcomeDonut),
  { ssr: false, loading: () => <div className="h-full w-full rounded-lg shimmer-sweep" /> }
);

export default function ReportsPage() {
  const r = SEED_REPORTS;

  return (
    <div className="space-y-6 p-6">
      <div className="anim-fade-up">
        <h2 className="font-display text-xl font-bold text-[var(--text-primary)]">Reports</h2>
        <p className="text-sm text-[var(--text-secondary)]">Weekly and month-over-month performance summaries.</p>
      </div>

      <div className="stagger-in grid grid-cols-2 gap-4 lg:grid-cols-4">
        {r.weeklySummaries.map((s) => (
          <StatCard
            key={s.label}
            label={s.label}
            value={s.value}
            trend={s.trend}
            trendLabel={s.sub}
            icon={<BarChart3 size={18} className="text-[var(--brand-dim)]" />}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* MoM */}
        <div className="card-surface p-5">
          <h3 className="mb-4 font-display text-base font-bold text-[var(--text-primary)]">Month-over-Month</h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--surface-600)] text-left text-xs text-[var(--text-muted)]">
                <th className="py-2 font-medium">Metric</th>
                <th className="py-2 font-medium">This Month</th>
                <th className="py-2 font-medium">Last Month</th>
                <th className="py-2 text-right font-medium">Change</th>
              </tr>
            </thead>
            <tbody>
              {r.momComparisons.map((m) => {
                const up = m.trend > 0;
                return (
                  <tr key={m.metric} className="border-b border-[var(--surface-600)] last:border-0">
                    <td className="py-2.5 text-[var(--text-primary)]">{m.metric}</td>
                    <td className="py-2.5 font-medium text-[var(--text-primary)]">{m.thisMonth}</td>
                    <td className="py-2.5 text-[var(--text-secondary)]">{m.lastMonth}</td>
                    <td className="py-2.5 text-right">
                      <span className={`inline-flex items-center gap-1 text-xs font-medium ${up ? "text-green-600" : "text-amber-600"}`}>
                        {up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                        {Math.abs(m.trend)}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Outcome breakdown */}
        <ChartCard title="Outcome Breakdown" subtitle="Distribution of call outcomes">
          <OutcomeDonut />
        </ChartCard>
      </div>

      {/* Top agents */}
      <div className="card-surface p-5">
        <h3 className="mb-4 font-display text-base font-bold text-[var(--text-primary)]">Top Agents</h3>
        <div className="space-y-3">
          {r.topAgents.map((a, i) => (
            <div key={a.name} className="flex items-center gap-3">
              <span className="w-5 text-center font-mono-id text-[var(--text-muted)]">{i + 1}</span>
              <AgentAvatar name={a.name} role={a.role} size="sm" />
              <div className="w-40 shrink-0">
                <div className="text-sm font-medium text-[var(--text-primary)]">{a.name}</div>
                <div className="text-xs text-[var(--text-secondary)]">{a.role}</div>
              </div>
              <div className="hidden w-24 shrink-0 text-sm text-[var(--text-secondary)] sm:block">{a.calls} calls</div>
              <div className="flex flex-1 items-center gap-2">
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[var(--surface-500)]">
                  <div className="h-full rounded-full" style={{ width: `${a.successRate}%`, background: "var(--brand)" }} />
                </div>
                <span className="w-9 text-right font-mono-id text-[var(--text-primary)]">{a.successRate}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

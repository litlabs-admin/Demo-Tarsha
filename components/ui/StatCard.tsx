import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import React from "react";

interface StatCardProps {
  label: string;
  value: string;
  trend?: number;
  trendLabel?: string;
  icon: React.ReactNode;
}

export function StatCard({ label, value, trend, trendLabel, icon }: StatCardProps) {
  const trendPositive = trend !== undefined && trend > 0;
  const trendNegative = trend !== undefined && trend < 0;

  return (
    <div className="card-surface hover-lift p-5">
      <div className="flex items-start justify-between mb-4">
        <div className="p-2 rounded-lg bg-[var(--surface-500)] transition-transform duration-200 hover:scale-105">{icon}</div>
        {trend !== undefined && (
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${
              trendPositive
                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                : trendNegative
                ? "bg-amber-50 text-amber-700 border-amber-200"
                : "bg-slate-100 text-slate-600 border-slate-200"
            }`}
          >
            {trendPositive ? <TrendingUp size={10} /> : trendNegative ? <TrendingDown size={10} /> : <Minus size={10} />}
            {Math.abs(trend)}%
          </span>
        )}
      </div>
      <p className="font-display font-bold text-2xl text-[var(--text-primary)]">{value}</p>
      <p className="text-sm text-[var(--text-secondary)] mt-1">{label}</p>
      {trendLabel && <p className="text-xs text-[var(--text-muted)] mt-0.5">{trendLabel}</p>}
    </div>
  );
}

"use client";

import dynamic from "next/dynamic";
import { PhoneCall, TrendingUp, Clock, CheckCircle2 } from "lucide-react";
import { StatCard } from "@/components/ui/StatCard";

// Recharts is heavy — load it only after the shell + KPIs paint.
const AnalyticsCharts = dynamic(
  () => import("@/components/analytics/AnalyticsCharts").then((m) => m.AnalyticsCharts),
  {
    ssr: false,
    loading: () => (
      <div className="space-y-6">
        <div className="h-72 rounded-xl shimmer-sweep" />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-64 rounded-xl shimmer-sweep" />
          ))}
        </div>
      </div>
    ),
  }
);

export default function AnalyticsPage() {
  return (
    <div className="space-y-6 p-6">
      <div className="anim-fade-up">
        <h2 className="font-display text-xl font-bold text-[var(--text-primary)]">Analytics</h2>
        <p className="text-sm text-[var(--text-secondary)]">Call performance across all agents.</p>
      </div>

      <div className="stagger-in grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total Calls" value="1,024" trend={8.4} trendLabel="this week" icon={<PhoneCall size={18} className="text-status-blue" />} />
        <StatCard label="Success Rate" value="88%" trend={3.5} trendLabel="vs last week" icon={<CheckCircle2 size={18} className="text-status-green" />} />
        <StatCard label="Avg Duration" value="2m 48s" trend={-4.2} trendLabel="vs last week" icon={<Clock size={18} className="text-status-purple" />} />
        <StatCard label="Peak Day" value="Fri" trendLabel="204 calls" icon={<TrendingUp size={18} className="text-[var(--brand-dim)]" />} />
      </div>

      <AnalyticsCharts />
    </div>
  );
}

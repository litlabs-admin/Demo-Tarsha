"use client";

import { StatsGrid } from "@/components/dashboard/StatsGrid";
import { RecentCallsTable } from "@/components/dashboard/RecentCallsTable";
import { ActiveAgentsRail } from "@/components/dashboard/ActiveAgentsRail";
import { PerformanceSummary } from "@/components/dashboard/PerformanceSummary";

export default function DashboardPage() {
  return (
    <div className="space-y-6 p-6">
      <div className="anim-fade-up">
        <h2 className="font-display text-xl font-bold text-[var(--text-primary)]">Welcome back</h2>
        <p className="text-sm text-[var(--text-secondary)]">Here&apos;s how your AI receptionists are performing.</p>
      </div>

      <StatsGrid />

      <PerformanceSummary />

      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="min-w-0 flex-1">
          <RecentCallsTable />
        </div>
        <div className="w-full shrink-0 lg:w-[280px]">
          <ActiveAgentsRail />
        </div>
      </div>
    </div>
  );
}

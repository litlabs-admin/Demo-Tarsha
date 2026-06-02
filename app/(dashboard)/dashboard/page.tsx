"use client";

import { useEffect, useState } from "react";
import { StatsGrid } from "@/components/dashboard/StatsGrid";
import { RecentCallsTable } from "@/components/dashboard/RecentCallsTable";
import { ActiveAgentsRail } from "@/components/dashboard/ActiveAgentsRail";
import { SystemHealth } from "@/components/dashboard/SystemHealth";
import { PerformanceSummary } from "@/components/dashboard/PerformanceSummary";
import { SkeletonStatCards, SkeletonCallTable } from "@/components/ui/SkeletonShimmer";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="space-y-6 p-6">
      <div>
        <h2 className="font-display text-xl font-bold text-[var(--text-primary)]">Welcome back</h2>
        <p className="text-sm text-[var(--text-secondary)]">Here&apos;s how your AI receptionists are performing.</p>
      </div>

      {loading ? <SkeletonStatCards /> : <StatsGrid />}

      {!loading && <PerformanceSummary />}

      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="min-w-0 flex-1">
          {loading ? <SkeletonCallTable /> : <RecentCallsTable />}
        </div>
        <div className="w-full shrink-0 space-y-4 lg:w-[280px]">
          <ActiveAgentsRail />
          <SystemHealth />
        </div>
      </div>
    </div>
  );
}

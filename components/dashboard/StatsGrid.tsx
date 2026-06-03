"use client";

import { Bot, PhoneCall, CalendarClock, Timer } from "lucide-react";
import { useTarsha } from "@/context/TarshaContext";
import { StatCard } from "@/components/ui/StatCard";

export function StatsGrid() {
  const { state } = useTarsha();
  const total = state.agents.length;
  const active = state.agents.filter((a) => a.status === "active").length;
  const archived = state.agents.filter((a) => a.status === "archived").length;

  return (
    <div className="stagger-in grid grid-cols-2 gap-4 lg:grid-cols-4">
      <StatCard
        label="Total Agents"
        value={String(total)}
        trendLabel={`${active} active · ${archived} archived`}
        icon={<Bot size={18} className="text-[var(--brand-dim)]" />}
      />
      <StatCard
        label="Calls Answered"
        value="1,247"
        trend={12.4}
        trendLabel="all time"
        icon={<PhoneCall size={18} className="text-status-blue" />}
      />
      <StatCard
        label="Calls This Week"
        value="84"
        trend={3.6}
        trendLabel="vs last week"
        icon={<CalendarClock size={18} className="text-status-purple" />}
      />
      <StatCard
        label="Avg Handle Time"
        value="2m 34s"
        trend={-1.2}
        trendLabel="vs last week"
        icon={<Timer size={18} className="text-status-green" />}
      />
    </div>
  );
}

"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
} from "recharts";
import { PhoneCall, TrendingUp, Clock, CheckCircle2 } from "lucide-react";
import { SEED_ANALYTICS } from "@/lib/seed-data";
import { ChartCard } from "@/components/analytics/ChartCard";
import { StatCard } from "@/components/ui/StatCard";
import { GOLD, AXIS, GRID, SERIES, tooltipStyle, tooltipLabelStyle, tooltipItemStyle } from "@/components/analytics/chartTheme";

const axisProps = { stroke: AXIS, fontSize: 12, tickLine: false, axisLine: false };

export default function AnalyticsPage() {
  const a = SEED_ANALYTICS;

  return (
    <div className="space-y-6 p-6">
      <div>
        <h2 className="font-display text-xl font-bold text-[var(--text-primary)]">Analytics</h2>
        <p className="text-sm text-[var(--text-secondary)]">Call performance across all agents.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total Calls" value="1,024" trend={8.4} trendLabel="this week" icon={<PhoneCall size={18} className="text-status-blue" />} />
        <StatCard label="Success Rate" value="88%" trend={3.5} trendLabel="vs last week" icon={<CheckCircle2 size={18} className="text-status-green" />} />
        <StatCard label="Avg Duration" value="2m 48s" trend={-4.2} trendLabel="vs last week" icon={<Clock size={18} className="text-status-purple" />} />
        <StatCard label="Peak Day" value="Fri" trendLabel="204 calls" icon={<TrendingUp size={18} className="text-[var(--brand-dim)]" />} />
      </div>

      <ChartCard title="Call Volume" subtitle="Calls answered per day this week">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={a.callVolume} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
            <defs>
              <linearGradient id="volGold" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={GOLD} stopOpacity={0.45} />
                <stop offset="100%" stopColor={GOLD} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={GRID} vertical={false} />
            <XAxis dataKey="day" {...axisProps} />
            <YAxis {...axisProps} />
            <Tooltip contentStyle={tooltipStyle} labelStyle={tooltipLabelStyle} itemStyle={tooltipItemStyle} cursor={{ fill: "rgba(0,0,0,0.03)" }} />
            <Area type="monotone" dataKey="calls" stroke={GOLD} strokeWidth={2} fill="url(#volGold)" />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ChartCard title="Calls per Agent" subtitle="All-time call volume by agent">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={a.perAgent} layout="vertical" margin={{ top: 4, right: 16, left: 8, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={GRID} horizontal={false} />
              <XAxis type="number" {...axisProps} />
              <YAxis type="category" dataKey="agent" width={60} {...axisProps} />
              <Tooltip contentStyle={tooltipStyle} labelStyle={tooltipLabelStyle} itemStyle={tooltipItemStyle} cursor={{ fill: "rgba(0,0,0,0.03)" }} />
              <Bar dataKey="calls" radius={[0, 6, 6, 0]} fill={GOLD} barSize={16} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Success Rate Trend" subtitle="Weekly resolution rate (%)">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={a.successTrend} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={GRID} vertical={false} />
              <XAxis dataKey="week" {...axisProps} />
              <YAxis domain={[70, 95]} {...axisProps} />
              <Tooltip contentStyle={tooltipStyle} labelStyle={tooltipLabelStyle} itemStyle={tooltipItemStyle} />
              <Line type="monotone" dataKey="rate" stroke={SERIES[1]} strokeWidth={2.5} dot={{ r: 3, fill: SERIES[1] }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Avg Duration Trend" subtitle="Average handle time (seconds)">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={a.durationTrend} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
              <defs>
                <linearGradient id="durGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={SERIES[2]} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={SERIES[2]} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={GRID} vertical={false} />
              <XAxis dataKey="week" {...axisProps} />
              <YAxis {...axisProps} />
              <Tooltip contentStyle={tooltipStyle} labelStyle={tooltipLabelStyle} itemStyle={tooltipItemStyle} />
              <Area type="monotone" dataKey="avg" stroke={SERIES[2]} strokeWidth={2} fill="url(#durGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Weekly Comparison" subtitle="This week vs last week">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={a.weekly} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={GRID} vertical={false} />
              <XAxis dataKey="label" {...axisProps} />
              <YAxis {...axisProps} />
              <Tooltip contentStyle={tooltipStyle} labelStyle={tooltipLabelStyle} itemStyle={tooltipItemStyle} cursor={{ fill: "rgba(0,0,0,0.03)" }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="thisWeek" name="This week" radius={[5, 5, 0, 0]} fill={GOLD} barSize={12} />
              <Bar dataKey="lastWeek" name="Last week" radius={[5, 5, 0, 0]} fill={GRID} barSize={12}>
                {a.weekly.map((_, i) => (
                  <Cell key={i} fill="#CBD5E1" />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}

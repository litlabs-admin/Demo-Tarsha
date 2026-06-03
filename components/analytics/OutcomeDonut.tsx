"use client";

import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { SEED_REPORTS } from "@/lib/seed-data";
import { tooltipStyle, tooltipLabelStyle, tooltipItemStyle } from "@/components/analytics/chartTheme";

export function OutcomeDonut() {
  const data = SEED_REPORTS.outcomeBreakdown;
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={2}>
          {data.map((o) => (
            <Cell key={o.name} fill={o.color} />
          ))}
        </Pie>
        <Tooltip contentStyle={tooltipStyle} labelStyle={tooltipLabelStyle} itemStyle={tooltipItemStyle} formatter={(v) => `${v}%`} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
      </PieChart>
    </ResponsiveContainer>
  );
}

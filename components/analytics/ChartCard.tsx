import React from "react";

interface ChartCardProps {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  children: React.ReactNode;
  height?: number;
}

export function ChartCard({ title, subtitle, right, children, height = 280 }: ChartCardProps) {
  return (
    <div className="card-surface p-5">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-base font-bold text-[var(--text-primary)]">{title}</h3>
          {subtitle && <p className="mt-0.5 text-xs text-[var(--text-secondary)]">{subtitle}</p>}
        </div>
        {right && <div className="shrink-0">{right}</div>}
      </div>
      <div style={{ height, width: "100%" }}>{children}</div>
    </div>
  );
}

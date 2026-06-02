interface RainbowMetricBarProps {
  value: number;
  label: string;
  sublabel?: string;
}

export function RainbowMetricBar({ value, label, sublabel }: RainbowMetricBarProps) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="text-[var(--text-secondary)]">{label}</span>
        <span className="text-[var(--text-primary)] font-medium font-mono-id">{value}%</span>
      </div>
      <div className="w-full bg-[var(--surface-500)] rounded-full overflow-hidden h-[6px]">
        <div
          className="rainbow-gradient rounded-full h-full transition-all duration-700"
          style={{ width: `${value}%` }}
        />
      </div>
      {sublabel && <p className="text-xs text-[var(--text-muted)]">{sublabel}</p>}
    </div>
  );
}

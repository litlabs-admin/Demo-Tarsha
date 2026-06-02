import { RainbowMetricBar } from "@/components/ui/RainbowMetricBar";

export function PerformanceSummary() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <div className="card-surface p-5">
        <RainbowMetricBar value={86} label="Success Rate" sublabel="avg across active agents" />
      </div>
      <div className="card-surface flex flex-col justify-center p-5">
        <p className="font-display text-2xl font-bold text-[var(--text-primary)]">612</p>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">Booked Outcomes</p>
        <p className="text-xs text-[var(--text-muted)]">appointments & callbacks</p>
      </div>
      <div className="card-surface p-5">
        <RainbowMetricBar value={88} label="Resolution Rate" sublabel="resolved without transfer" />
      </div>
    </div>
  );
}

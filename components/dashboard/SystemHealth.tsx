const SERVICES = [
  { name: "Tarsha Core", color: "#16A34A" },
  { name: "Deepgram", color: "#16A34A" },
  { name: "Anthropic", color: "#16A34A" },
  { name: "ElevenLabs", color: "#16A34A" },
];

export function SystemHealth() {
  return (
    <div className="card-surface p-4">
      <h3 className="mb-3 font-display text-sm font-bold text-[var(--text-primary)]">System Health</h3>
      <div className="space-y-2">
        {SERVICES.map((s) => (
          <div key={s.name} className="flex items-center justify-between text-sm">
            <span className="text-[var(--text-secondary)]">{s.name}</span>
            <span className="flex items-center gap-1.5 text-xs font-medium text-green-700">
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: s.color }} />
              Operational
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

import { Pencil } from "lucide-react";

type ChipType = "transcriber" | "model" | "voice";

const TYPE_COLORS: Record<ChipType, string> = {
  transcriber: "#3B82F6",
  model: "#8B5CF6",
  voice: "#F59E0B",
};

const TYPE_LABELS: Record<ChipType, string> = {
  transcriber: "TRANSCRIBER",
  model: "MODEL",
  voice: "VOICE",
};

interface ServiceChipProps {
  type: ChipType;
  provider: string;
  detail: string;
  subDetail?: string;
}

export function ServiceChip({ type, provider, detail, subDetail }: ServiceChipProps) {
  const color = TYPE_COLORS[type];

  return (
    <div
      className="relative flex-1 p-3 rounded-[8px] min-w-[140px]"
      style={{ background: "var(--surface-700)", border: "1px solid var(--surface-600)" }}
    >
      <button className="absolute top-2 right-2 text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors">
        <Pencil size={11} />
      </button>
      <div className="flex items-center gap-1.5 mb-2">
        <span className="w-2 h-2 rounded-full" style={{ background: color }} />
        <span className="font-mono-id" style={{ color, fontSize: "9px" }}>{TYPE_LABELS[type]}</span>
      </div>
      <p className="text-xs font-medium text-[var(--text-primary)]">{provider}</p>
      <p className="text-xs text-[var(--text-secondary)] mt-0.5">{detail}</p>
      {subDetail && <p className="font-mono-id text-[var(--text-muted)] mt-1">{subDetail}</p>}
    </div>
  );
}

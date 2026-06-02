import { AgentRole } from "@/types";

const ROLE_COLORS: Record<string, string> = {
  "HR Assistant": "#F59E0B",
  Lender: "#3B82F6",
  Insurer: "#8B5CF6",
  "Property Guide": "#10B981",
  "Legal Guide": "#6366F1",
  "Property Manager": "#0EA5E9",
  "Franchise Guide": "#EC4899",
  Host: "#F43F5E",
  "Style Assistant": "#14B8A6",
  "Legacy Agent": "#94A3B8",
};

const FALLBACK = "#6366F1";

const SIZES = {
  xs: "w-6 h-6 text-[10px] rounded-[6px]",
  sm: "w-8 h-8 text-xs rounded-[7px]",
  md: "w-10 h-10 text-sm rounded-[9px]",
  lg: "w-14 h-14 text-xl rounded-[11px]",
  xl: "w-20 h-20 text-3xl rounded-[14px]",
};

interface AgentAvatarProps {
  name: string;
  role?: AgentRole | string;
  size?: keyof typeof SIZES;
  className?: string;
  muted?: boolean;
}

export function AgentAvatar({ name, role, size = "md", className = "", muted = false }: AgentAvatarProps) {
  const color = (role && ROLE_COLORS[role]) || FALLBACK;
  const initial = name?.charAt(0).toUpperCase() ?? "?";

  return (
    <div
      className={`flex items-center justify-center font-display font-bold shrink-0 ${SIZES[size]} ${className}`}
      style={{
        background: muted ? "#F1F5F9" : `${color}1F`,
        border: `1px solid ${muted ? "#E2E8F0" : `${color}40`}`,
        color: muted ? "#94A3B8" : color,
      }}
    >
      {initial}
    </div>
  );
}

export function roleColor(role?: string): string {
  return (role && ROLE_COLORS[role]) || FALLBACK;
}

"use client";

import { useRouter } from "next/navigation";
import {
  Bell,
  CheckCircle2,
  TrendingUp,
  PhoneMissed,
  BookOpen,
  Settings2,
  FileBarChart,
  type LucideIcon,
} from "lucide-react";
import { useTarsha } from "@/context/TarshaContext";
import type { Notification, NotificationType } from "@/types";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";

const ICONS: Record<NotificationType, { icon: LucideIcon; color: string }> = {
  deployed: { icon: CheckCircle2, color: "#16A34A" },
  spike: { icon: TrendingUp, color: "#2563EB" },
  missed: { icon: PhoneMissed, color: "#DC2626" },
  kb: { icon: BookOpen, color: "#7C3AED" },
  config: { icon: Settings2, color: "#64748B" },
  report: { icon: FileBarChart, color: "#0EA5E9" },
};

export function NotificationDropdown() {
  const router = useRouter();
  const { state, unreadCount, markRead, markAllRead } = useTarsha();

  function handleClick(n: Notification) {
    markRead(n.id);
    if (n.href) router.push(n.href);
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          aria-label="Notifications"
          className="focus-ring interactive-press relative flex h-9 w-9 items-center justify-center rounded-lg text-[var(--text-secondary)] transition-colors hover:bg-[var(--surface-700)]"
        >
          <Bell size={18} />
          {unreadCount > 0 && (
            <span
              className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full px-1 text-[10px] font-bold text-black"
              style={{ background: "var(--brand)" }}
            >
              {unreadCount}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[360px] p-0">
        <div className="flex items-center justify-between border-b border-[var(--surface-600)] px-3 py-2.5">
          <span className="font-display text-sm font-bold text-[var(--text-primary)]">Notifications</span>
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="text-xs font-medium text-[var(--brand-dim)] transition-colors hover:underline"
            >
              Mark all read
            </button>
          )}
        </div>
        <div className="max-h-[420px] overflow-y-auto py-1">
          {state.notifications.length === 0 && (
            <p className="px-3 py-6 text-center text-sm text-[var(--text-muted)]">No notifications</p>
          )}
          {state.notifications.map((n) => {
            const { icon: Icon, color } = ICONS[n.type];
            return (
              <button
                key={n.id}
                onClick={() => handleClick(n)}
                className={`flex w-full items-start gap-3 px-3 py-2.5 text-left transition-colors hover:bg-[var(--surface-700)] ${
                  !n.read ? "bg-[var(--brand-pale)]" : ""
                }`}
              >
                <span
                  className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg"
                  style={{ background: `${color}1A`, color }}
                >
                  <Icon size={14} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-1.5">
                    <span className="truncate text-sm font-medium text-[var(--text-primary)]">{n.title}</span>
                    {!n.read && (
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: "var(--brand)" }} />
                    )}
                  </span>
                  <span className="mt-0.5 line-clamp-2 block text-xs text-[var(--text-secondary)]">{n.body}</span>
                  <span className="mt-0.5 block text-[11px] text-[var(--text-muted)]">{n.time}</span>
                </span>
              </button>
            );
          })}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

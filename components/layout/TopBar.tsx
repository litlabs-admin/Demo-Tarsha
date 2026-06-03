"use client";

import { usePathname } from "next/navigation";
import { Phone } from "lucide-react";
import { useTarsha } from "@/context/TarshaContext";
import { NotificationDropdown } from "./NotificationDropdown";
import { ProfileMenu } from "./ProfileMenu";

const TITLES: { match: string; title: string; exact?: boolean }[] = [
  { match: "/dashboard", title: "Dashboard" },
  { match: "/agents/create", title: "Create Agent" },
  { match: "/agents", title: "Agents", exact: true },
  { match: "/agents/", title: "Agent" },
  { match: "/phone-numbers", title: "Phone Numbers" },
  { match: "/tools", title: "Tools" },
  { match: "/workflows", title: "Workflows" },
  { match: "/squads", title: "Squads" },
  { match: "/analytics", title: "Analytics" },
  { match: "/logs", title: "Logs" },
  { match: "/reports", title: "Reports" },
  { match: "/calls/", title: "Call Detail" },
  { match: "/demo", title: "Call Demo" },
  { match: "/settings", title: "Settings" },
  { match: "/profile", title: "Profile" },
  { match: "/account", title: "Account" },
  { match: "/billing", title: "Billing" },
  { match: "/docs", title: "Documentation" },
];

function getTitle(pathname: string): string {
  // exact matches first
  if (pathname === "/agents") return "Agents";
  if (pathname === "/agents/create") return "Create Agent";
  for (const t of TITLES) {
    if (t.exact) {
      if (pathname === t.match) return t.title;
    } else if (pathname === t.match || pathname.startsWith(t.match)) {
      return t.title;
    }
  }
  return "Tarsha";
}

export function TopBar() {
  const pathname = usePathname();
  const { openCallDemo } = useTarsha();
  const title = getTitle(pathname);

  return (
    <header
      className="sticky top-0 z-30 flex shrink-0 items-center justify-between border-b border-[var(--surface-600)] bg-[var(--surface-800)] px-5"
      style={{ height: "var(--topbar-height)" }}
    >
      <h1 className="font-display text-base font-bold text-[var(--text-primary)]">{title}</h1>

      <div className="flex items-center gap-2">
        <button
          onClick={() => openCallDemo()}
          className="focus-ring interactive-press flex items-center gap-1.5 rounded-lg border border-[var(--brand)] bg-white px-3 py-1.5 text-sm font-medium text-[var(--text-primary)] transition-colors hover:bg-[var(--brand-pale)]"
        >
          <Phone size={15} className="text-[var(--brand-dim)]" />
          Call Demo
        </button>
        <NotificationDropdown />
        <div className="mx-1 h-6 w-px bg-[var(--surface-600)]" />
        <ProfileMenu />
      </div>
    </header>
  );
}

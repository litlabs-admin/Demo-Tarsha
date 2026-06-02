"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Bot,
  Plus,
  BarChart3,
  FileText,
  ScrollText,
  Phone,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { useTarsha } from "@/context/TarshaContext";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

const SECTIONS: { label: string; items: NavItem[] }[] = [
  {
    label: "Platform",
    items: [
      { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { label: "Agents", href: "/agents", icon: Bot },
      { label: "Create Agent", href: "/agents/create", icon: Plus },
    ],
  },
  {
    label: "Analyse",
    items: [
      { label: "Analytics", href: "/analytics", icon: BarChart3 },
      { label: "Logs", href: "/logs", icon: FileText },
      { label: "Reports", href: "/reports", icon: ScrollText },
    ],
  },
];

function isActive(pathname: string, href: string): boolean {
  if (href === "/agents") {
    return pathname === "/agents" || (pathname.startsWith("/agents/") && pathname !== "/agents/create");
  }
  return pathname === href || pathname.startsWith(href + "/");
}

export function Sidebar() {
  const pathname = usePathname();
  const { state, openCallDemo } = useTarsha();
  const activeCount = state.agents.filter((a) => a.status === "active").length;

  return (
    <aside
      className="flex flex-col border-r border-[var(--surface-600)] bg-[var(--surface-800)]"
      style={{ width: "var(--sidebar-width)" }}
    >
      {/* Logo block */}
      <div
        className="flex items-center gap-2.5 border-b border-[var(--surface-600)] px-4"
        style={{ height: "var(--topbar-height)" }}
      >
        <span
          className="select-none leading-none"
          style={{
            fontFamily: "var(--font-brand), cursive",
            fontSize: "26px",
            letterSpacing: "0.01em",
            color: "#18130A",
            WebkitTextStroke: "0.8px #18130A",
            paintOrder: "stroke fill",
          }}
        >
          Tarsha.ai
        </span>
        <span className="select-none whitespace-nowrap font-sans text-[8px] font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">
          BY ROSWELL&nbsp;IT
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {SECTIONS.map((section) => (
          <div key={section.label} className="mb-5">
            <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
              {section.label}
            </p>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const active = isActive(pathname, item.href);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "focus-ring interactive-press flex items-center gap-2.5 rounded-lg border-l-2 px-2.5 py-2 text-sm transition-colors",
                      active
                        ? "border-[var(--brand)] bg-[var(--brand-pale)] font-medium text-[var(--text-primary)]"
                        : "border-transparent text-[var(--text-secondary)] hover:bg-[var(--surface-700)]"
                    )}
                  >
                    <Icon
                      size={17}
                      className={active ? "text-[var(--brand-dim)]" : "text-[var(--text-muted)]"}
                    />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}

        {/* Demo section */}
        <div className="mb-5">
          <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
            Demo
          </p>
          <button
            onClick={() => openCallDemo()}
            className="focus-ring interactive-press flex w-full items-center gap-2.5 rounded-lg border border-[var(--brand)] bg-[var(--brand-pale)] px-2.5 py-2 text-sm font-medium text-[var(--text-primary)] transition-colors hover:bg-[var(--brand-glow)]"
          >
            <Phone size={17} className="text-[var(--brand-dim)]" />
            Call Demo
          </button>
        </div>
      </nav>

      {/* Footer */}
      <div className="border-t border-[var(--surface-600)] p-3">
        <div className="rounded-lg border border-[var(--surface-600)] bg-white px-3 py-2.5">
          <div className="flex items-center gap-1.5 text-sm font-medium text-[var(--text-primary)]">
            <Sparkles size={13} className="text-[var(--brand-dim)]" />
            Tarsha Pro
          </div>
          <p className="font-mono-id mt-1 text-[var(--text-muted)]">
            {state.agents.length} agents · {activeCount} active
          </p>
        </div>
      </div>
    </aside>
  );
}

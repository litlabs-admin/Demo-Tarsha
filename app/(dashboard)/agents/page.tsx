"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Search, LayoutGrid, List, Phone } from "lucide-react";
import { useTarsha } from "@/context/TarshaContext";
import { AgentCard } from "@/components/agents/AgentCard";
import { AgentAvatar } from "@/components/ui/AgentAvatar";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { AGENT_ROLES } from "@/lib/schemas";
import { cn } from "@/lib/utils";

type View = "grid" | "list";
type StatusFilter = "all" | "active" | "archived";

export default function AgentsPage() {
  const router = useRouter();
  const { state, openCallDemo } = useTarsha();
  const [query, setQuery] = useState("");
  const [view, setView] = useState<View>("grid");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [roleFilter, setRoleFilter] = useState<string>("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return state.agents.filter((a) => {
      if (statusFilter !== "all" && a.status !== statusFilter) return false;
      if (roleFilter !== "all" && a.role !== roleFilter) return false;
      if (q && !`${a.name} ${a.role}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [state.agents, query, statusFilter, roleFilter]);

  return (
    <div className="space-y-5 p-6">
      <div className="anim-fade-up flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-xl font-bold text-[var(--text-primary)]">
            Agents <span className="text-base font-normal text-[var(--text-muted)]">({state.agents.length})</span>
          </h2>
          <p className="text-sm text-[var(--text-secondary)]">Manage your AI receptionist roster.</p>
        </div>
        <Link
          href="/agents/create"
          className="focus-ring interactive-press flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-semibold text-black transition-opacity hover:opacity-90"
          style={{ background: "var(--brand)" }}
        >
          <Plus size={16} /> New Agent
        </Link>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-[220px] flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search agents…"
            className="focus-ring w-full rounded-lg border border-[var(--surface-600)] bg-white py-2 pl-9 pr-3 text-sm placeholder:text-[var(--text-muted)]"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
          className="focus-ring rounded-lg border border-[var(--surface-600)] bg-white px-3 py-2 text-sm"
        >
          <option value="all">All statuses</option>
          <option value="active">Active</option>
          <option value="archived">Archived</option>
        </select>

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="focus-ring rounded-lg border border-[var(--surface-600)] bg-white px-3 py-2 text-sm"
        >
          <option value="all">All roles</option>
          {AGENT_ROLES.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>

        <div className="flex overflow-hidden rounded-lg border border-[var(--surface-600)]">
          <button
            onClick={() => setView("grid")}
            className={cn(
              "focus-ring flex h-9 w-9 items-center justify-center transition-colors",
              view === "grid" ? "bg-[var(--brand-pale)] text-[var(--brand-dim)]" : "bg-white text-[var(--text-muted)] hover:bg-[var(--surface-700)]"
            )}
            aria-label="Grid view"
          >
            <LayoutGrid size={16} />
          </button>
          <button
            onClick={() => setView("list")}
            className={cn(
              "focus-ring flex h-9 w-9 items-center justify-center border-l border-[var(--surface-600)] transition-colors",
              view === "list" ? "bg-[var(--brand-pale)] text-[var(--brand-dim)]" : "bg-white text-[var(--text-muted)] hover:bg-[var(--surface-700)]"
            )}
            aria-label="List view"
          >
            <List size={16} />
          </button>
        </div>
      </div>

      <p className="text-xs text-[var(--text-muted)]">{filtered.length} of {state.agents.length} agents</p>

      {filtered.length === 0 ? (
        <div className="card-surface p-10 text-center text-sm text-[var(--text-muted)]">No agents match your filters.</div>
      ) : view === "grid" ? (
        <div className="stagger-in grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((a) => (
            <AgentCard key={a.id} agent={a} />
          ))}
        </div>
      ) : (
        <div className="stagger-in card-surface overflow-hidden">
          {filtered.map((a) => {
            const archived = a.status === "archived";
            return (
              <div
                key={a.id}
                onClick={() => router.push(`/agents/${a.id}`)}
                className={cn(
                  "flex cursor-pointer items-center gap-4 border-b border-[var(--surface-600)] px-4 py-3 transition-colors last:border-0 hover:bg-[var(--surface-700)]",
                  archived && "opacity-60"
                )}
              >
                <AgentAvatar name={a.name} role={a.role} size="md" muted={archived} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-[var(--text-primary)]">{a.name}</span>
                    <StatusBadge status={a.status} size="sm" />
                  </div>
                  <div className="text-sm text-[var(--text-secondary)]">{a.role}</div>
                </div>
                <div className="hidden font-mono-id text-[var(--text-muted)] md:block">{a.agentRef}</div>
                <div className="hidden text-sm text-[var(--text-secondary)] sm:block">{a.callsHandled} calls</div>
                <div className="hidden text-sm text-[var(--text-secondary)] sm:block">{a.successRate}%</div>
                <div onClick={(e) => e.stopPropagation()}>
                  {!archived && (
                    <button
                      onClick={() => openCallDemo(a.id)}
                      className="focus-ring interactive-press flex items-center gap-1 rounded-lg border border-[var(--surface-600)] bg-white px-2.5 py-1.5 text-xs font-medium text-[var(--text-primary)] transition-colors hover:bg-[var(--brand-pale)]"
                    >
                      <Phone size={12} /> Test
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

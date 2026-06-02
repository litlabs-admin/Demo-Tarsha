"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useTarsha } from "@/context/TarshaContext";
import { AgentAvatar } from "@/components/ui/AgentAvatar";
import { StatusBadge } from "@/components/ui/StatusBadge";

function Meta({ label, value, mono }: { label: string; value: React.ReactNode; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between border-b border-[var(--surface-600)] py-2.5 text-sm last:border-0">
      <span className="text-[var(--text-secondary)]">{label}</span>
      <span className={mono ? "font-mono-id text-[var(--text-primary)]" : "font-medium text-[var(--text-primary)]"}>{value}</span>
    </div>
  );
}

export default function CallDetailPage() {
  const params = useParams();
  const { state } = useTarsha();
  const id = String(params.id);
  const call = state.recentCalls.find((c) => c.id === id);
  const agent = call ? state.agents.find((a) => a.id === call.agentId) : undefined;

  if (!call) {
    return (
      <div className="p-6">
        <div className="card-surface p-10 text-center">
          <p className="font-display text-lg font-bold text-[var(--text-primary)]">Call not found</p>
          <Link href="/logs" className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-[var(--brand-dim)] hover:underline">
            <ArrowLeft size={14} /> Back to logs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5 p-6">
      <Link href="/logs" className="inline-flex items-center gap-1 text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]">
        <ArrowLeft size={14} /> Call Logs
      </Link>

      <div className="flex flex-wrap items-center gap-3">
        <h1 className="font-display text-2xl font-bold text-[var(--text-primary)]">{call.caller}</h1>
        <StatusBadge status={call.status} />
        <span className="text-sm text-[var(--text-secondary)]">{call.outcome}</span>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[320px_1fr]">
        {/* Meta */}
        <div className="card-surface h-fit p-5">
          <h3 className="mb-2 font-display text-sm font-bold text-[var(--text-primary)]">Call Details</h3>
          <Meta label="Caller" value={call.caller} />
          <Meta label="Phone" value={call.callerPhone} mono />
          <Meta
            label="Agent"
            value={
              agent ? (
                <Link href={`/agents/${agent.id}`} className="flex items-center gap-1.5 hover:underline">
                  <AgentAvatar name={agent.name} role={agent.role} size="xs" />
                  {agent.name}
                </Link>
              ) : (
                call.agent
              )
            }
          />
          <Meta label="Duration" value={call.duration} mono />
          <Meta label="Date" value={call.date} />
          <Meta label="Time" value={call.time} />
          <Meta label="Outcome" value={call.outcome} />
          <div className="pt-3">
            <p className="mb-1.5 text-[11px] uppercase tracking-wide text-[var(--text-muted)]">Tags</p>
            <div className="flex flex-wrap gap-1.5">
              {call.tags.map((t) => (
                <span key={t} className="rounded-full bg-[var(--surface-500)] px-2.5 py-1 text-xs text-[var(--text-secondary)]">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Transcript */}
        <div className="card-surface p-5">
          <h3 className="mb-3 font-display text-sm font-bold text-[var(--text-primary)]">Transcript</h3>
          <div className="mb-4 rounded-xl border border-[var(--brand)] bg-[var(--brand-pale)] p-3 text-sm text-[var(--text-primary)]">
            <span className="mb-0.5 block text-[11px] font-semibold uppercase tracking-wide text-[var(--brand-dim)]">Summary</span>
            {call.transcriptSummary}
          </div>

          <div className="space-y-3">
            {call.snippets.map((line, i) => {
              const isAgent = line.speaker === "agent";
              return (
                <div key={i} className={`flex ${isAgent ? "justify-start" : "justify-end"}`}>
                  <div className={`max-w-[78%] ${isAgent ? "" : "text-right"}`}>
                    <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-[var(--text-muted)]">
                      {isAgent ? call.agent : call.caller}
                    </span>
                    <div
                      className={`rounded-2xl px-3.5 py-2 text-sm ${
                        isAgent
                          ? "bg-[var(--brand-pale)] text-[var(--text-primary)]"
                          : "border border-[var(--surface-600)] bg-[var(--surface-700)] text-[var(--text-primary)]"
                      }`}
                    >
                      {line.text}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Phone, Pencil, Copy, CheckCircle2 } from "lucide-react";
import { useTarsha } from "@/context/TarshaContext";
import { useToast } from "@/hooks/use-toast";
import { AgentAvatar } from "@/components/ui/AgentAvatar";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { RainbowMetricBar } from "@/components/ui/RainbowMetricBar";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";

function Field({ label, value, mono, dot }: { label: string; value: string; mono?: boolean; dot?: string }) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-wide text-[var(--text-muted)]">{label}</p>
      <p className={`mt-0.5 flex items-center gap-1.5 text-sm text-[var(--text-primary)] ${mono ? "font-mono-id !text-xs" : "font-medium"}`}>
        {dot && <span className="h-1.5 w-1.5 rounded-full" style={{ background: dot }} />}
        {value}
      </p>
    </div>
  );
}

function Tile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[var(--surface-600)] bg-[var(--surface-700)] p-4">
      <p className="text-[11px] uppercase tracking-wide text-[var(--text-muted)]">{label}</p>
      <p className="mt-1 font-display text-xl font-bold text-[var(--text-primary)]">{value}</p>
    </div>
  );
}

export default function AgentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const { state, openCallDemo } = useTarsha();
  const id = String(params.id);
  const agent = state.agents.find((a) => a.id === id);

  if (!agent) {
    return (
      <div className="p-6">
        <div className="card-surface p-10 text-center">
          <p className="font-display text-lg font-bold text-[var(--text-primary)]">Agent not found</p>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">This agent doesn&apos;t exist or has been removed.</p>
          <Link href="/agents" className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-[var(--brand-dim)] hover:underline">
            <ArrowLeft size={14} /> Back to agents
          </Link>
        </div>
      </div>
    );
  }

  const archived = agent.status === "archived";

  return (
    <div className="space-y-5 p-6">
      <Link href="/agents" className="inline-flex items-center gap-1 text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]">
        <ArrowLeft size={14} /> Agents
      </Link>

      {/* Header */}
      <div className="card-surface flex flex-wrap items-start justify-between gap-4 p-5">
        <div className="flex items-center gap-4">
          <AgentAvatar name={agent.name} role={agent.role} size="xl" muted={archived} />
          <div>
            <h1 className="font-display text-2xl font-bold text-[var(--text-primary)]">
              {agent.name} <span className="text-[var(--text-muted)]">— {agent.role}</span>
            </h1>
            <p className="font-mono-id mt-1 text-[var(--text-muted)]">{agent.vapiAgentId}</p>
            <div className="mt-2 flex items-center gap-2">
              <StatusBadge status={agent.status} size="sm" />
              {!archived && (
                <span className="inline-flex items-center gap-1 rounded-full border border-green-200 bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700">
                  <CheckCircle2 size={11} /> Published
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {archived ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span>
                    <button disabled className="flex cursor-not-allowed items-center gap-1.5 rounded-lg border border-[var(--surface-600)] bg-[var(--surface-700)] px-3 py-2 text-sm font-medium text-[var(--text-muted)]">
                      <Phone size={15} /> Test Call
                    </button>
                  </span>
                </TooltipTrigger>
                <TooltipContent>Agent archived</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <button
              onClick={() => openCallDemo(agent.id)}
              className="focus-ring interactive-press flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-semibold text-black transition-opacity hover:opacity-90"
              style={{ background: "var(--brand)" }}
            >
              <Phone size={15} /> Test Call
            </button>
          )}
          <button
            onClick={() => toast({ title: "Edit", description: "Editing is disabled in this demo." })}
            disabled={archived}
            className="focus-ring interactive-press flex items-center gap-1.5 rounded-lg border border-[var(--surface-600)] bg-white px-3 py-2 text-sm font-medium text-[var(--text-primary)] transition-colors hover:bg-[var(--surface-700)] disabled:opacity-50"
          >
            <Pencil size={14} /> Edit
          </button>
          <button
            onClick={() => toast({ title: "Duplicated", description: `${agent.name} configuration copied.` })}
            className="focus-ring interactive-press flex items-center gap-1.5 rounded-lg border border-[var(--surface-600)] bg-white px-3 py-2 text-sm font-medium text-[var(--text-primary)] transition-colors hover:bg-[var(--surface-700)]"
          >
            <Copy size={14} /> Duplicate
          </button>
        </div>
      </div>

      {/* Configuration */}
      <section className="card-surface p-5">
        <h2 className="mb-4 font-display text-base font-bold text-[var(--text-primary)]">Configuration</h2>
        <div className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3 lg:grid-cols-5">
          <Field label="Platform" value={agent.platform} dot="#16A34A" />
          <Field label="VAPI Agent ID" value={agent.vapiAgentId} mono />
          <Field label="STT Provider" value={agent.stt.provider} dot="#2563EB" />
          <Field label="STT Model" value={agent.stt.model} />
          <Field label="Language" value={agent.language} />
          <Field label="LLM Provider" value={agent.llm.provider} dot="#7C3AED" />
          <Field label="LLM Model" value={agent.llm.model} mono />
          <Field label="TTS Provider" value={agent.tts.provider} dot="#F59E0B" />
          <Field label="TTS Voice" value={agent.tts.voiceName} />
          <Field label="TTS Accent" value={agent.tts.accent} />
        </div>
      </section>

      {/* Performance */}
      <section className="card-surface p-5">
        <h2 className="mb-4 font-display text-base font-bold text-[var(--text-primary)]">Performance</h2>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <Tile label="Avg Call Duration" value={agent.avgDuration} />
          <div className="flex flex-col justify-center rounded-xl border border-[var(--surface-600)] bg-[var(--surface-700)] p-4">
            <RainbowMetricBar value={agent.successRate} label="Success Rate" />
          </div>
          <Tile label="Calls Handled" value={String(agent.callsHandled)} />
          <Tile label="Calls This Week" value={String(agent.callsThisWeek)} />
        </div>

        <div className="mt-5">
          <p className="mb-2 text-[11px] uppercase tracking-wide text-[var(--text-muted)]">Call Tags</p>
          <div className="flex flex-wrap gap-1.5">
            {agent.callTags.map((t) => (
              <span key={t} className="rounded-full bg-[var(--surface-500)] px-2.5 py-1 text-xs text-[var(--text-secondary)]">
                {t}
              </span>
            ))}
          </div>
        </div>

        {agent.commonOutcomes.length > 0 && (
          <div className="mt-5 space-y-3">
            <p className="text-[11px] uppercase tracking-wide text-[var(--text-muted)]">Common Outcomes</p>
            {agent.commonOutcomes.map((o) => (
              <div key={o.label}>
                <div className="mb-1 flex justify-between text-xs">
                  <span className="text-[var(--text-secondary)]">{o.label}</span>
                  <span className="font-mono-id text-[var(--text-primary)]">{o.pct}%</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--surface-500)]">
                  <div className="h-full rounded-full" style={{ width: `${o.pct}%`, background: "var(--brand)" }} />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Behaviour */}
      <section className="card-surface p-5">
        <h2 className="mb-4 font-display text-base font-bold text-[var(--text-primary)]">Behaviour</h2>

        <div className="space-y-4">
          <div>
            <p className="mb-1.5 text-[11px] uppercase tracking-wide text-[var(--text-muted)]">First Message</p>
            <div className="rounded-xl border border-[var(--surface-600)] bg-[var(--surface-700)] p-3 text-sm text-[var(--text-primary)]">
              {agent.firstMessage}
            </div>
          </div>

          <div>
            <p className="mb-1.5 text-[11px] uppercase tracking-wide text-[var(--text-muted)]">Summary</p>
            <p className="text-sm text-[var(--text-secondary)]">{agent.systemPromptSummary}</p>
          </div>

          <div>
            <p className="mb-1.5 text-[11px] uppercase tracking-wide text-[var(--text-muted)]">System Prompt</p>
            <pre className="max-h-64 overflow-auto whitespace-pre-wrap rounded-xl border border-[var(--surface-600)] bg-[var(--surface-700)] p-3 font-mono-id !text-xs leading-relaxed text-[var(--text-secondary)]">
              {agent.systemPrompt}
            </pre>
          </div>

          <div>
            <p className="mb-1.5 text-[11px] uppercase tracking-wide text-[var(--text-muted)]">Recent Activity</p>
            <div className="divide-y divide-[var(--surface-600)] rounded-xl border border-[var(--surface-600)]">
              {agent.recentActivity.map((r, i) => (
                <div key={i} className="flex items-center justify-between px-3 py-2.5 text-sm">
                  <span className="text-[var(--text-primary)]">{r.caller}</span>
                  <span className="text-[var(--text-secondary)]">{r.outcome}</span>
                  <span className="text-xs text-[var(--text-muted)]">{r.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

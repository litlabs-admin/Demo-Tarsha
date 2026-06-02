"use client";

import { useTarsha } from "@/context/TarshaContext";
import { AgentAvatar } from "@/components/ui/AgentAvatar";
import { DemoForm } from "@/components/demo/DemoForm";
import { Lock } from "lucide-react";

export default function DemoPage() {
  const { state } = useTarsha();
  const active = state.agents.filter((a) => a.status === "active");

  return (
    <div className="p-6">
      {/* Hero */}
      <div className="mb-8 text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-3 py-1.5 text-xs font-medium text-green-700">
          <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-green-500" />
          Live Demo Environment
        </div>
        <h1 className="mb-2 font-display text-3xl font-black text-[var(--text-primary)]">
          Experience Tarsha AI in Action
        </h1>
        <p className="text-sm text-[var(--text-secondary)]">
          Enter your details and your AI receptionist will call you within seconds.
        </p>
        <p className="font-mono-id mt-1 text-[var(--text-muted)]">Answers in under 0.4 seconds</p>
      </div>

      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Form */}
        <div>
          <div className="card-surface p-6">
            <DemoForm />
          </div>
          <div className="mt-4 flex items-center justify-center gap-3 text-xs text-[var(--text-muted)]">
            <span className="flex items-center gap-1">
              <Lock size={11} /> 256-bit encrypted
            </span>
            <span>·</span>
            <span>No spam, ever.</span>
            <span>·</span>
            <span>Answers in under 0.4s</span>
          </div>
        </div>

        {/* Info panel */}
        <div className="card-surface space-y-5 p-6">
          <h3 className="font-display text-base font-bold text-[var(--text-primary)]">How it works</h3>
          {[
            { step: "1", title: "You submit your details", desc: "Enter your name, number, and choose an AI receptionist." },
            { step: "2", title: "AI connects instantly", desc: "Your chosen receptionist calls you within seconds — 24/7." },
            { step: "3", title: "Natural conversation", desc: "Answers questions, qualifies your enquiry, books appointments." },
          ].map((s) => (
            <div key={s.step} className="flex gap-3">
              <span
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full font-display text-xs font-bold text-black"
                style={{ background: "var(--brand)" }}
              >
                {s.step}
              </span>
              <div>
                <p className="text-sm font-medium text-[var(--text-primary)]">{s.title}</p>
                <p className="mt-0.5 text-xs text-[var(--text-muted)]">{s.desc}</p>
              </div>
            </div>
          ))}

          <div>
            <p className="mb-3 text-xs font-semibold text-[var(--text-secondary)]">Available Receptionists</p>
            <div className="flex gap-3 overflow-x-auto pb-1">
              {active.map((agent) => (
                <div key={agent.id} className="flex shrink-0 flex-col items-center gap-1">
                  <AgentAvatar name={agent.name} role={agent.role} size="md" />
                  <span className="font-mono-id text-[var(--text-muted)]" style={{ fontSize: "9px" }}>
                    {agent.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

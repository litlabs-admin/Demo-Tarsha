"use client";

import { useEffect, useRef, useState } from "react";
import { Mic, MicOff, PhoneOff, Phone, RotateCcw } from "lucide-react";
import { useTarsha } from "@/context/TarshaContext";
import { AgentAvatar, roleColor } from "@/components/ui/AgentAvatar";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import type { Agent } from "@/types";

type Phase = "ringing" | "connecting" | "connected" | "in-progress" | "ended";

const PHASE_LABEL: Record<Phase, string> = {
  ringing: "Ringing…",
  connecting: "Connecting…",
  connected: "Connected",
  "in-progress": "In call",
  ended: "Call ended",
};

function fmt(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function CallDemoModal() {
  const { callDemoOpen, closeCallDemo, callDemoAgentId, state } = useTarsha();
  const activeAgents = state.agents.filter((a) => a.status === "active");

  const [agentId, setAgentId] = useState<string | null>(null);
  const [phase, setPhase] = useState<Phase>("ringing");
  const [elapsed, setElapsed] = useState(0);
  const [muted, setMuted] = useState(false);
  const [lines, setLines] = useState<{ speaker: "agent" | "caller"; text: string }[]>([]);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const transcriptRef = useRef<HTMLDivElement>(null);

  const agent: Agent | undefined =
    state.agents.find((a) => a.id === (agentId ?? callDemoAgentId)) ?? activeAgents[0];

  function clearTimers() {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;
  }

  // Drive the state machine when opened
  useEffect(() => {
    if (!callDemoOpen) return;
    setAgentId(callDemoAgentId);
    setPhase("ringing");
    setElapsed(0);
    setMuted(false);
    setLines([]);

    const t1 = setTimeout(() => setPhase("connecting"), 1200);
    const t2 = setTimeout(() => setPhase("connected"), 2200);
    const t3 = setTimeout(() => setPhase("in-progress"), 2800);
    timers.current.push(t1, t2, t3);

    return () => clearTimers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [callDemoOpen, callDemoAgentId]);

  // Timer + transcript during in-progress
  useEffect(() => {
    if (phase !== "in-progress") return;
    intervalRef.current = setInterval(() => setElapsed((e) => e + 1), 1000);

    const snippets =
      agent?.recentActivity && agent
        ? [
            { speaker: "agent" as const, text: agent.firstMessage.replace("[Company Name]", "the office") },
            { speaker: "caller" as const, text: "Hi there, I had a quick question about your services." },
            { speaker: "agent" as const, text: "Of course — I'd be glad to help with that. Could you tell me a little more?" },
            { speaker: "caller" as const, text: "Yes, I'd like to book something in for later this week." },
            { speaker: "agent" as const, text: "Perfect, I can arrange that for you right now. Let me take a few details." },
          ]
        : [];

    snippets.forEach((line, i) => {
      const t = setTimeout(() => {
        setLines((prev) => [...prev, line]);
      }, 1500 * (i + 1));
      timers.current.push(t);
    });

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  useEffect(() => {
    transcriptRef.current?.scrollTo({ top: transcriptRef.current.scrollHeight, behavior: "smooth" });
  }, [lines]);

  function endCall() {
    clearTimers();
    setPhase("ended");
  }

  function callAgain() {
    clearTimers();
    setPhase("ringing");
    setElapsed(0);
    setLines([]);
    setMuted(false);
    const t1 = setTimeout(() => setPhase("connecting"), 1200);
    const t2 = setTimeout(() => setPhase("connected"), 2200);
    const t3 = setTimeout(() => setPhase("in-progress"), 2800);
    timers.current.push(t1, t2, t3);
  }

  function handleOpenChange(open: boolean) {
    if (!open) {
      clearTimers();
      closeCallDemo();
    }
  }

  if (!agent) return null;
  const color = roleColor(agent.role);
  const ringing = phase === "ringing" || phase === "connecting";

  return (
    <Dialog open={callDemoOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md" hideClose>
        <div className="flex flex-col items-center text-center">
          {/* Agent picker (only when no preset agent and still ringing) */}
          {!callDemoAgentId && ringing && (
            <div className="mb-4 w-full text-left">
              <label className="mb-1 block text-xs font-medium text-[var(--text-secondary)]">Voice agent</label>
              <select
                value={agent.id}
                onChange={(e) => setAgentId(e.target.value)}
                className="focus-ring w-full rounded-lg border border-[var(--surface-600)] bg-[var(--surface-700)] px-3 py-2 text-sm"
              >
                {activeAgents.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name} — {a.role}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Avatar with pulse ring */}
          <div className="relative mb-4 mt-2 flex items-center justify-center">
            {ringing && (
              <>
                <span
                  className="absolute h-24 w-24 animate-ping rounded-full opacity-30"
                  style={{ background: color }}
                />
                <span
                  className="absolute h-20 w-20 rounded-full opacity-20"
                  style={{ background: color }}
                />
              </>
            )}
            <AgentAvatar name={agent.name} role={agent.role} size="xl" />
          </div>

          <h2 className="font-display text-xl font-bold text-[var(--text-primary)]">{agent.name}</h2>
          <p className="text-sm text-[var(--text-secondary)]">{agent.role}</p>

          <div className="mt-3 flex items-center gap-2">
            {phase === "in-progress" && (
              <span className="h-2 w-2 animate-pulse-dot rounded-full bg-green-500" />
            )}
            <span className="text-sm font-medium text-[var(--text-primary)]">
              {PHASE_LABEL[phase]}
              {(phase === "in-progress" || phase === "ended") && ` · ${fmt(elapsed)}`}
            </span>
          </div>

          {/* Transcript */}
          {(phase === "in-progress" || phase === "ended") && lines.length > 0 && (
            <div
              ref={transcriptRef}
              className="mt-4 max-h-48 w-full space-y-2 overflow-y-auto rounded-xl border border-[var(--surface-600)] bg-[var(--surface-700)] p-3 text-left"
            >
              {lines.map((line, i) => (
                <div key={i} className={`flex ${line.speaker === "caller" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] rounded-2xl px-3 py-1.5 text-xs ${
                      line.speaker === "agent"
                        ? "bg-[var(--brand-pale)] text-[var(--text-primary)]"
                        : "bg-white text-[var(--text-primary)] border border-[var(--surface-600)]"
                    }`}
                  >
                    <span className="mb-0.5 block text-[10px] font-semibold uppercase tracking-wide text-[var(--text-muted)]">
                      {line.speaker === "agent" ? agent.name : "You"}
                    </span>
                    {line.text}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Ended summary */}
          {phase === "ended" && (
            <div className="mt-4 w-full rounded-xl border border-[var(--surface-600)] bg-[var(--surface-700)] p-3 text-left">
              <div className="flex justify-between text-sm">
                <span className="text-[var(--text-secondary)]">Duration</span>
                <span className="font-medium text-[var(--text-primary)]">{fmt(elapsed)}</span>
              </div>
              <div className="mt-1 flex justify-between text-sm">
                <span className="text-[var(--text-secondary)]">Outcome</span>
                <span className="font-medium text-green-700">Completed</span>
              </div>
            </div>
          )}

          {/* Controls */}
          <div className="mt-6 flex items-center gap-3">
            {phase !== "ended" ? (
              <>
                <button
                  onClick={() => setMuted((m) => !m)}
                  className="focus-ring interactive-press flex h-12 w-12 items-center justify-center rounded-full border border-[var(--surface-600)] bg-white text-[var(--text-secondary)] transition-colors hover:bg-[var(--surface-700)]"
                  aria-label={muted ? "Unmute" : "Mute"}
                >
                  {muted ? <MicOff size={18} /> : <Mic size={18} />}
                </button>
                <button
                  onClick={endCall}
                  className="focus-ring interactive-press flex h-14 w-14 items-center justify-center rounded-full bg-red-600 text-white transition-colors hover:bg-red-700"
                  aria-label="End call"
                >
                  <PhoneOff size={22} />
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => handleOpenChange(false)}
                  className="focus-ring interactive-press rounded-lg border border-[var(--surface-600)] bg-white px-4 py-2 text-sm font-medium text-[var(--text-primary)] transition-colors hover:bg-[var(--surface-700)]"
                >
                  Close
                </button>
                <button
                  onClick={callAgain}
                  className="focus-ring interactive-press flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold text-black transition-opacity hover:opacity-90"
                  style={{ background: "var(--brand)" }}
                >
                  <RotateCcw size={15} />
                  Call Again
                </button>
              </>
            )}
          </div>
          {phase !== "ended" && (
            <p className="mt-3 flex items-center gap-1 text-[11px] text-[var(--text-muted)]">
              <Phone size={11} /> Simulated demo call · no real connection
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

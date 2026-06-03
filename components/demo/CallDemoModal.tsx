"use client";

import { useEffect, useState } from "react";
import { PhoneOutgoing, Loader2, Check, AlertCircle, RotateCcw } from "lucide-react";
import { useTarsha } from "@/context/TarshaContext";
import { Dialog, DialogContent } from "@/components/ui/dialog";

type Phase = "form" | "submitting" | "success" | "error";

const fieldCls =
  "focus-ring w-full rounded-lg border border-[var(--surface-600)] bg-white px-3 py-2.5 text-sm transition-colors hover:border-[#D1D5DB] placeholder:text-[var(--text-muted)]";
const labelCls = "mb-1.5 block text-sm font-medium text-[var(--text-primary)]";

export function CallDemoModal() {
  const { callDemoOpen, closeCallDemo, callDemoAgentId, state } = useTarsha();
  const activeAgents = state.agents.filter((a) => a.status === "active");

  const [phase, setPhase] = useState<Phase>("form");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [assistant, setAssistant] = useState("");
  const [touched, setTouched] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Reset the form each time the modal opens; default the assistant.
  useEffect(() => {
    if (!callDemoOpen) return;
    const preset = state.agents.find((a) => a.id === callDemoAgentId) ?? activeAgents[0];
    setPhase("form");
    setName("");
    setPhone("");
    setTouched(false);
    setErrorMsg("");
    setAssistant(preset?.name ?? "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [callDemoOpen, callDemoAgentId]);

  const phoneValid = phone.trim().length >= 5;
  const nameValid = name.trim().length >= 1;
  const formValid = phoneValid && nameValid && !!assistant;

  const selectedAgent =
    state.agents.find((a) => a.name === assistant) ?? activeAgents[0];

  function handleOpenChange(open: boolean) {
    if (!open) closeCallDemo();
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setTouched(true);
    if (!formValid) return;
    setPhase("submitting");
    try {
      const res = await fetch("/api/trigger-call", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, assistant }),
      });
      const data = await res.json().catch(() => ({ ok: false }));
      if (res.ok && data.ok) {
        setPhase("success");
      } else {
        setErrorMsg(data.error || "We couldn't place the call. Please try again.");
        setPhase("error");
      }
    } catch {
      setErrorMsg("Network error reaching the call service.");
      setPhase("error");
    }
  }

  function reset() {
    setPhase("form");
    setTouched(false);
  }

  return (
    <Dialog open={callDemoOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md p-0 overflow-hidden">
        {/* Header */}
        <div className="border-b border-[var(--surface-600)] px-6 pb-5 pt-6">
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/roswell-logo.png"
              alt="Roswell IT"
              className="h-9 w-auto shrink-0 select-none"
              draggable={false}
            />
            <div>
              <h2 className="font-display text-base font-bold leading-tight text-[var(--text-primary)]">
                Voice Agent Call
              </h2>
              <p className="text-sm text-[var(--text-secondary)]">Our AI receptionist will call you in seconds.</p>
            </div>
          </div>
          <div className="mt-3 h-1 w-10 rounded-full bg-[var(--brand)]" />
        </div>

        {/* Body */}
        <div className="p-6">
          {/* FORM */}
          {(phase === "form" || phase === "submitting") && (
            <form onSubmit={submit} className="stagger-in space-y-4">
              <div>
                <label className={labelCls}>Phone Number to call</label>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+44 7700 900000"
                  inputMode="tel"
                  autoFocus
                  className={fieldCls}
                />
                {touched && !phoneValid && (
                  <p className="anim-fade-in mt-1 text-xs text-red-600">Enter a valid phone number.</p>
                )}
              </div>

              <div>
                <label className={labelCls}>What is your name?</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alasdair MacKenzie"
                  className={fieldCls}
                />
                {touched && !nameValid && (
                  <p className="anim-fade-in mt-1 text-xs text-red-600">Please enter your name.</p>
                )}
              </div>

              <button
                type="submit"
                disabled={phase === "submitting"}
                className="focus-ring interactive-press mt-1 flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold text-black hover:opacity-90 disabled:opacity-70"
                style={{ background: "var(--brand)" }}
              >
                {phase === "submitting" ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Placing call…
                  </>
                ) : (
                  <>
                    <PhoneOutgoing size={16} /> Call Me Now
                  </>
                )}
              </button>

              <p className="flex items-center justify-center gap-1 text-[11px] text-[var(--text-muted)]">
                <PhoneOutgoing size={11} /> Places a real outbound call via Roswell&apos;s voice agent.
              </p>
            </form>
          )}

          {/* SUCCESS */}
          {phase === "success" && (
            <div className="anim-fade-up flex flex-col items-center py-4 text-center">
              <span className="anim-pop flex h-14 w-14 items-center justify-center rounded-full bg-green-50 text-green-600">
                <Check size={28} />
              </span>
              <p className="mt-4 font-display text-base font-bold text-[var(--text-primary)]">
                Your call is on its way
              </p>
              <p className="mt-1 text-sm text-[var(--text-secondary)]">
                {selectedAgent?.name ?? "Our agent"} will ring{" "}
                <span className="font-medium text-[var(--text-primary)]">{phone}</span> in a few seconds.
              </p>
              <div className="mt-6 flex w-full gap-3">
                <button
                  onClick={() => handleOpenChange(false)}
                  className="focus-ring interactive-press flex-1 rounded-lg border border-[var(--surface-600)] bg-white px-4 py-2 text-sm font-medium text-[var(--text-primary)] hover:bg-[var(--surface-700)]"
                >
                  Done
                </button>
                <button
                  onClick={reset}
                  className="focus-ring interactive-press flex flex-1 items-center justify-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold text-black hover:opacity-90"
                  style={{ background: "var(--brand)" }}
                >
                  <RotateCcw size={14} /> New Call
                </button>
              </div>
            </div>
          )}

          {/* ERROR */}
          {phase === "error" && (
            <div className="anim-fade-up flex flex-col items-center py-4 text-center">
              <span className="anim-pop flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600">
                <AlertCircle size={28} />
              </span>
              <p className="mt-4 font-display text-base font-bold text-[var(--text-primary)]">Call failed</p>
              <p className="mt-1 text-sm text-[var(--text-secondary)]">{errorMsg}</p>
              <button
                onClick={reset}
                className="focus-ring interactive-press mt-6 flex w-full items-center justify-center gap-1.5 rounded-lg px-4 py-2.5 text-sm font-semibold text-black hover:opacity-90"
                style={{ background: "var(--brand)" }}
              >
                <RotateCcw size={14} /> Try Again
              </button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Rocket,
  Loader2,
  Play,
  Sparkles,
  Cpu,
  AudioLines,
  ClipboardCheck,
  UserRound,
} from "lucide-react";
import { useTarsha } from "@/context/TarshaContext";
import { useToast } from "@/hooks/use-toast";
import { createAgentSchema, STEP_FIELDS, AGENT_ROLES, type CreateAgentSchema } from "@/lib/schemas";
import { SYSTEM_PROMPTS } from "@/lib/seed-data";
import {
  LLM_PROVIDERS,
  STT_PROVIDERS,
  LANGUAGES,
  TTS_PROVIDERS,
  ACCENTS,
  VOICES,
} from "@/lib/wizard-options";
import { cn } from "@/lib/utils";

const STEPS = [
  { label: "Info", icon: UserRound },
  { label: "AI Config", icon: Cpu },
  { label: "Voice & Behaviour", icon: AudioLines },
  { label: "Review", icon: ClipboardCheck },
];

const DEPLOY_LINES = [
  "Provisioning VAPI agent…",
  "Configuring transcriber…",
  "Loading voice model…",
  "Compiling system prompt…",
  "Finalising…",
];

const inputCls =
  "focus-ring w-full rounded-lg border border-[var(--surface-600)] bg-white px-3 py-2 text-sm transition-colors hover:border-[#D1D5DB] placeholder:text-[var(--text-muted)]";
const labelCls = "mb-1.5 block text-sm font-medium text-[var(--text-primary)]";
const errCls = "mt-1 text-xs text-red-600 anim-fade-in";

/* ---- selectable cards -------------------------------------------------- */

function ProviderCard({
  selected,
  badge,
  color,
  label,
  blurb,
  onClick,
}: {
  selected: boolean;
  badge: string;
  color: string;
  label: string;
  blurb: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "focus-ring hover-lift group relative flex items-start gap-3 rounded-xl border bg-white p-3 text-left",
        selected ? "border-[var(--brand)] ring-2 ring-[var(--brand-glow)]" : "border-[var(--surface-600)]"
      )}
    >
      <span
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xs font-bold text-white"
        style={{ background: color }}
      >
        {badge}
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-semibold text-[var(--text-primary)]">{label}</span>
        <span className="block truncate text-xs text-[var(--text-secondary)]">{blurb}</span>
      </span>
      {selected && (
        <span className="anim-pop absolute right-2 top-2 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--brand)] text-black">
          <Check size={11} />
        </span>
      )}
    </button>
  );
}

function VoiceCard({
  selected,
  name,
  descriptor,
  gender,
  accent,
  onClick,
}: {
  selected: boolean;
  name: string;
  descriptor: string;
  gender: string;
  accent: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "focus-ring hover-lift group relative flex items-center gap-3 rounded-xl border bg-white p-3 text-left",
        selected ? "border-[var(--brand)] ring-2 ring-[var(--brand-glow)]" : "border-[var(--surface-600)]"
      )}
    >
      <span
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg font-display text-sm font-bold"
        style={{ background: "var(--surface-500)", color: "var(--text-primary)" }}
      >
        {name.charAt(0)}
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-1.5">
          <span className="text-sm font-semibold text-[var(--text-primary)]">{name}</span>
          <span className="rounded-full bg-[var(--surface-500)] px-1.5 py-0.5 text-[10px] font-medium text-[var(--text-secondary)]">
            {gender}
          </span>
        </span>
        <span className="block truncate text-xs text-[var(--text-secondary)]">
          {descriptor} · {accent}
        </span>
      </span>
      <span
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[var(--surface-600)] text-[var(--text-muted)] transition-colors group-hover:border-[var(--brand)] group-hover:text-[var(--brand-dim)]"
        aria-hidden
      >
        <Play size={12} className="ml-0.5" />
      </span>
      {selected && (
        <span className="anim-pop absolute right-2 top-2 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--brand)] text-black">
          <Check size={11} />
        </span>
      )}
    </button>
  );
}

/* ---- wizard ------------------------------------------------------------ */

export function CreateAgentWizard() {
  const router = useRouter();
  const { toast } = useToast();
  const { addAgent } = useTarsha();
  const [step, setStep] = useState(0);
  const [deploying, setDeploying] = useState(false);
  const [deployLine, setDeployLine] = useState(0);

  const {
    register,
    trigger,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, dirtyFields },
  } = useForm<CreateAgentSchema>({
    resolver: zodResolver(createAgentSchema),
    mode: "onTouched",
    defaultValues: {
      name: "",
      role: "HR Assistant",
      description: "",
      llmProvider: "Anthropic",
      llmModel: "claude-sonnet-4-20250514",
      sttProvider: "Deepgram",
      sttModel: "Nova-3",
      language: "en-GB",
      ttsProvider: "ElevenLabs",
      voiceId: "",
      voiceName: "",
      accent: "Scottish",
      firstMessage: "",
      systemPrompt: SYSTEM_PROMPTS["HR Assistant"],
    },
  });

  const v = watch();
  const role = v.role;

  // Pre-fill the system prompt from the role template, unless the user has edited it.
  useEffect(() => {
    if (!dirtyFields.systemPrompt) {
      setValue("systemPrompt", SYSTEM_PROMPTS[role] ?? "", { shouldValidate: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role]);

  useEffect(() => {
    if (!deploying) return;
    const iv = setInterval(() => setDeployLine((l) => (l + 1) % DEPLOY_LINES.length), 360);
    return () => clearInterval(iv);
  }, [deploying]);

  async function next() {
    const ok = await trigger(STEP_FIELDS[step] as (keyof CreateAgentSchema)[]);
    if (ok) setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }
  function back() {
    setStep((s) => Math.max(s - 1, 0));
  }

  async function onSubmit(values: CreateAgentSchema) {
    setDeploying(true);
    try {
      const agent = await addAgent(values);
      toast({ title: "Agent deployed", description: `${agent.name} is live!` });
      router.push(`/agents/${agent.id}`);
    } catch {
      setDeploying(false);
      toast({ title: "Deployment failed", description: "Please try again." });
    }
  }

  // dependent option sets
  const llmModels = LLM_PROVIDERS.find((p) => p.id === v.llmProvider)?.models ?? [];
  const sttModels = STT_PROVIDERS.find((p) => p.id === v.sttProvider)?.models ?? [];
  const accentVoices = VOICES.filter((x) => x.accent === v.accent);
  const voiceList = accentVoices.length ? accentVoices : VOICES;

  function pickLlmProvider(id: string) {
    setValue("llmProvider", id, { shouldValidate: true });
    const first = LLM_PROVIDERS.find((p) => p.id === id)?.models[0] ?? "";
    setValue("llmModel", first, { shouldValidate: true });
  }
  function pickSttProvider(id: string) {
    setValue("sttProvider", id, { shouldValidate: true });
    const first = STT_PROVIDERS.find((p) => p.id === id)?.models[0] ?? "";
    setValue("sttModel", first, { shouldValidate: true });
  }
  function pickAccent(a: string) {
    setValue("accent", a, { shouldValidate: true });
    // clear voice if it no longer matches the chosen accent
    const stillValid = VOICES.some((x) => x.voiceId === v.voiceId && x.accent === a);
    if (!stillValid) {
      setValue("voiceId", "", { shouldValidate: false });
      setValue("voiceName", "", { shouldValidate: false });
    }
  }
  function pickVoice(voiceId: string, name: string, descriptor: string) {
    setValue("voiceId", voiceId, { shouldValidate: true });
    setValue("voiceName", `${name} — ${descriptor}`, { shouldValidate: true });
  }

  const progress = (step / (STEPS.length - 1)) * 100;

  return (
    <div className="mx-auto max-w-2xl">
      {/* Stepper */}
      <div className="mb-6">
        <div className="relative flex items-center justify-between">
          {/* track + fill */}
          <div className="absolute left-0 right-0 top-3.5 h-0.5 bg-[var(--surface-600)]" />
          <div
            className="absolute left-0 top-3.5 h-0.5 bg-[var(--brand)] transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
          {STEPS.map((s, i) => {
            const done = i < step;
            const current = i === step;
            const Icon = s.icon;
            return (
              <div key={s.label} className="relative z-10 flex flex-col items-center gap-1.5">
                <div
                  className={cn(
                    "flex h-7 w-7 items-center justify-center rounded-full border-2 transition-all duration-300",
                    done && "border-[var(--brand)] bg-[var(--brand)] text-black",
                    current && "border-[var(--brand)] bg-white text-[var(--brand-dim)] scale-110 shadow-[0_0_0_4px_var(--brand-glow)]",
                    !done && !current && "border-[var(--surface-600)] bg-white text-[var(--text-muted)]"
                  )}
                >
                  {done ? <Check size={14} className="anim-pop" /> : <Icon size={14} />}
                </div>
                <span
                  className={cn(
                    "hidden text-xs font-medium transition-colors sm:block",
                    current ? "text-[var(--text-primary)]" : "text-[var(--text-muted)]"
                  )}
                >
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="card-surface overflow-hidden p-6">
        {/* keyed wrapper re-animates on step change */}
        <div key={step} className="anim-fade-up">
          {/* Step 1 — Info */}
          {step === 0 && (
            <div className="space-y-4">
              <div>
                <label className={labelCls}>Agent name</label>
                <input {...register("name")} placeholder="e.g. Grace" className={inputCls} />
                {errors.name && <p className={errCls}>{errors.name.message}</p>}
              </div>
              <div>
                <label className={labelCls}>Role</label>
                <select {...register("role")} className={inputCls}>
                  {AGENT_ROLES.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
                {errors.role && <p className={errCls}>{errors.role.message}</p>}
              </div>
              <div>
                <label className={labelCls}>Description</label>
                <textarea
                  {...register("description")}
                  rows={4}
                  placeholder="What does this agent do?"
                  className={cn(inputCls, "resize-none")}
                />
                {errors.description && <p className={errCls}>{errors.description.message}</p>}
              </div>
            </div>
          )}

          {/* Step 2 — AI Config */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className={labelCls}>Language model</label>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 stagger-in">
                  {LLM_PROVIDERS.map((p) => (
                    <ProviderCard
                      key={p.id}
                      selected={v.llmProvider === p.id}
                      badge={p.badge}
                      color={p.color}
                      label={p.label}
                      blurb={p.blurb}
                      onClick={() => pickLlmProvider(p.id)}
                    />
                  ))}
                </div>
                <div className="mt-3">
                  <label className="mb-1.5 block text-xs font-medium text-[var(--text-secondary)]">Model</label>
                  <select {...register("llmModel")} className={inputCls}>
                    {llmModels.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="rounded-xl border border-[var(--surface-600)] bg-[var(--surface-700)] p-4">
                <p className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-[var(--text-primary)]">
                  <AudioLines size={14} className="text-[var(--brand-dim)]" /> Transcription
                </p>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-[var(--text-secondary)]">Provider</label>
                    <select
                      value={v.sttProvider}
                      onChange={(e) => pickSttProvider(e.target.value)}
                      className={inputCls}
                    >
                      {STT_PROVIDERS.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.id}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-[var(--text-secondary)]">Model</label>
                    <select {...register("sttModel")} className={inputCls}>
                      {sttModels.map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-[var(--text-secondary)]">Language</label>
                    <select {...register("language")} className={inputCls}>
                      {LANGUAGES.map((l) => (
                        <option key={l.value} value={l.value}>
                          {l.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3 — Voice & Behaviour */}
          {step === 2 && (
            <div className="space-y-5">
              <div>
                <label className={labelCls}>Voice provider</label>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 stagger-in">
                  {TTS_PROVIDERS.map((p) => (
                    <ProviderCard
                      key={p.id}
                      selected={v.ttsProvider === p.id}
                      badge={p.badge}
                      color={p.color}
                      label={p.id}
                      blurb={p.blurb}
                      onClick={() => setValue("ttsProvider", p.id, { shouldValidate: true })}
                    />
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="sm:col-span-1">
                  <label className={labelCls}>Accent</label>
                  <select value={v.accent} onChange={(e) => pickAccent(e.target.value)} className={inputCls}>
                    {ACCENTS.map((a) => (
                      <option key={a} value={a}>
                        {a}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className={labelCls}>Voice</label>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 stagger-in" key={v.accent}>
                  {voiceList.map((x) => (
                    <VoiceCard
                      key={x.voiceId}
                      selected={v.voiceId === x.voiceId}
                      name={x.name}
                      descriptor={x.descriptor}
                      gender={x.gender}
                      accent={x.accent}
                      onClick={() => pickVoice(x.voiceId, x.name, x.descriptor)}
                    />
                  ))}
                </div>
                {errors.voiceId && <p className={errCls}>{errors.voiceId.message}</p>}
              </div>

              <div>
                <label className={labelCls}>
                  First message <span className="text-[var(--text-muted)]">(optional)</span>
                </label>
                <textarea
                  {...register("firstMessage")}
                  rows={2}
                  placeholder="Hello, thanks for calling…"
                  className={cn(inputCls, "resize-none")}
                />
              </div>

              <div>
                <label className={labelCls}>System prompt</label>
                <textarea
                  {...register("systemPrompt")}
                  rows={8}
                  placeholder="Define the agent's identity, behaviour and objective…"
                  className={cn(inputCls, "font-mono-id !text-xs leading-relaxed")}
                />
                <p className="mt-1 flex items-center gap-1 text-xs text-[var(--text-muted)]">
                  <Sparkles size={11} className="text-[var(--brand-dim)]" />
                  Pre-filled from the {role} template — edit freely to tune behaviour.
                </p>
                {errors.systemPrompt && <p className={errCls}>{errors.systemPrompt.message}</p>}
              </div>
            </div>
          )}

          {/* Step 4 — Review */}
          {step === 3 && (
            <div className="space-y-4">
              <h3 className="font-display text-base font-bold text-[var(--text-primary)]">Review &amp; Deploy</h3>
              <dl className="divide-y divide-[var(--surface-600)] overflow-hidden rounded-xl border border-[var(--surface-600)]">
                {[
                  ["Name", v.name],
                  ["Role", v.role],
                  ["Description", v.description],
                  ["Model", `${v.llmProvider} · ${v.llmModel}`],
                  ["Transcriber", `${v.sttProvider} · ${v.sttModel}`],
                  ["Language", LANGUAGES.find((l) => l.value === v.language)?.label ?? v.language],
                  ["Voice", `${v.ttsProvider} · ${v.voiceName || "—"}`],
                  ["Accent", v.accent],
                  ["First message", v.firstMessage || "(default greeting)"],
                ].map(([label, value]) => (
                  <div key={label} className="flex gap-4 px-4 py-2.5 text-sm transition-colors hover:bg-[var(--surface-700)]">
                    <dt className="w-32 shrink-0 text-[var(--text-muted)]">{label}</dt>
                    <dd className="text-[var(--text-primary)]">{value}</dd>
                  </div>
                ))}
              </dl>
              <div>
                <p className="mb-1.5 text-[11px] uppercase tracking-wide text-[var(--text-muted)]">System Prompt</p>
                <pre className="max-h-40 overflow-auto whitespace-pre-wrap rounded-xl border border-[var(--surface-600)] bg-[var(--surface-700)] p-3 font-mono-id !text-xs leading-relaxed text-[var(--text-secondary)]">
                  {v.systemPrompt}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="mt-6 flex items-center justify-between border-t border-[var(--surface-600)] pt-5">
          <button
            type="button"
            onClick={() => (step === 0 ? router.push("/agents") : back())}
            className="focus-ring interactive-press flex items-center gap-1.5 rounded-lg border border-[var(--surface-600)] bg-white px-3.5 py-2 text-sm font-medium text-[var(--text-primary)] hover:bg-[var(--surface-700)]"
          >
            <ArrowLeft size={15} /> {step === 0 ? "Cancel" : "Back"}
          </button>

          {step < STEPS.length - 1 ? (
            <button
              type="button"
              onClick={next}
              className="focus-ring interactive-press group flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold text-black hover:opacity-90"
              style={{ background: "var(--brand)" }}
            >
              Next <ArrowRight size={15} className="icon-shift" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={deploying}
              className="focus-ring interactive-press flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold text-black hover:opacity-90 disabled:opacity-70"
              style={{ background: "var(--brand)" }}
            >
              <Rocket size={15} /> Deploy Agent
            </button>
          )}
        </div>
      </form>

      {/* Deployment overlay */}
      {deploying && (
        <div className="anim-fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="anim-scale-in card-surface flex w-80 flex-col items-center p-8 text-center shadow-xl">
            <span className="relative flex h-12 w-12 items-center justify-center">
              <span className="pulse-ring absolute inset-0 rounded-full" />
              <Loader2 size={36} className="animate-spin text-[var(--brand-dim)]" />
            </span>
            <p className="mt-4 font-display text-base font-bold text-[var(--text-primary)]">Deploying agent</p>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">{DEPLOY_LINES[deployLine]}</p>
          </div>
        </div>
      )}
    </div>
  );
}

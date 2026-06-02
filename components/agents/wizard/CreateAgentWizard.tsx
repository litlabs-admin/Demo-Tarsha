"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, Check, Rocket, Loader2 } from "lucide-react";
import { useTarsha } from "@/context/TarshaContext";
import { useToast } from "@/hooks/use-toast";
import { createAgentSchema, STEP_FIELDS, AGENT_ROLES, type CreateAgentSchema } from "@/lib/schemas";
import { cn } from "@/lib/utils";

const STEPS = ["Info", "AI Config", "Voice", "Review"];

const SCOTTISH_VOICES = [
  { voiceId: "scot-ailsa-01", voiceName: "Ailsa — Calm & Reassuring" },
  { voiceId: "scot-malcolm-01", voiceName: "Malcolm — Deep & Authoritative" },
  { voiceId: "scot-catriona-01", voiceName: "Catriona — Warm & Professional" },
  { voiceId: "scot-ferrol-01", voiceName: "Ferrol — Bright & Friendly" },
  { voiceId: "scot-ewan-01", voiceName: "Ewan — Steady & Practical" },
];

const LLM_MODELS = ["claude-sonnet-4-20250514", "claude-haiku-4", "gpt-4o"];

const DEPLOY_LINES = [
  "Provisioning VAPI agent…",
  "Configuring Deepgram Nova-2…",
  "Loading ElevenLabs voice…",
  "Finalising…",
];

const inputCls =
  "focus-ring w-full rounded-lg border border-[var(--surface-600)] bg-white px-3 py-2 text-sm placeholder:text-[var(--text-muted)]";
const labelCls = "mb-1.5 block text-sm font-medium text-[var(--text-primary)]";
const errCls = "mt-1 text-xs text-red-600";

export function CreateAgentWizard() {
  const router = useRouter();
  const { toast } = useToast();
  const { addAgent } = useTarsha();
  const [step, setStep] = useState(0);
  const [deploying, setDeploying] = useState(false);
  const [deployLine, setDeployLine] = useState(0);

  const {
    register,
    control,
    trigger,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateAgentSchema>({
    resolver: zodResolver(createAgentSchema),
    mode: "onTouched",
    defaultValues: {
      name: "",
      role: "HR Assistant",
      description: "",
      llmProvider: "Anthropic",
      llmModel: "claude-sonnet-4-20250514",
      ttsProvider: "ElevenLabs",
      voiceId: "",
      voiceName: "",
      accent: "Scottish",
      firstMessage: "",
    },
  });

  useEffect(() => {
    if (!deploying) return;
    const iv = setInterval(() => setDeployLine((l) => (l + 1) % DEPLOY_LINES.length), 380);
    return () => clearInterval(iv);
  }, [deploying]);

  async function next() {
    const fields = STEP_FIELDS[step];
    const ok = await trigger(fields as (keyof CreateAgentSchema)[]);
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

  const v = watch();

  return (
    <div className="mx-auto max-w-2xl">
      {/* Stepper */}
      <div className="mb-6 flex items-center">
        {STEPS.map((label, i) => {
          const done = i < step;
          const current = i === step;
          return (
            <div key={label} className="flex flex-1 items-center last:flex-none">
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    "flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-colors",
                    done && "bg-green-500 text-white",
                    current && "text-black",
                    !done && !current && "bg-[var(--surface-500)] text-[var(--text-muted)]"
                  )}
                  style={current ? { background: "var(--brand)" } : undefined}
                >
                  {done ? <Check size={14} /> : i + 1}
                </div>
                <span className={cn("text-sm font-medium", current ? "text-[var(--text-primary)]" : "text-[var(--text-muted)]")}>
                  {label}
                </span>
              </div>
              {i < STEPS.length - 1 && <div className="mx-3 h-px flex-1 bg-[var(--surface-600)]" />}
            </div>
          );
        })}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="card-surface p-6">
        {/* Step 1 */}
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
              <textarea {...register("description")} rows={4} placeholder="What does this agent do?" className={inputCls} />
              {errors.description && <p className={errCls}>{errors.description.message}</p>}
            </div>
          </div>
        )}

        {/* Step 2 */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className={labelCls}>LLM Provider</label>
              <select {...register("llmProvider")} className={inputCls}>
                <option value="Anthropic">Anthropic</option>
                <option value="OpenAI">OpenAI</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>LLM Model</label>
              <select {...register("llmModel")} className={inputCls}>
                {LLM_MODELS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
            <p className="rounded-lg border border-[var(--surface-600)] bg-[var(--surface-700)] p-3 text-xs text-[var(--text-secondary)]">
              Speech-to-text is handled by Deepgram Nova-2 with smart endpointing enabled by default. Language is set to en-GB.
            </p>
          </div>
        )}

        {/* Step 3 */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <label className={labelCls}>TTS Provider</label>
              <select {...register("ttsProvider")} className={inputCls}>
                <option value="ElevenLabs">ElevenLabs</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>Accent</label>
              <select {...register("accent")} className={inputCls}>
                <option value="Scottish">Scottish</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>Voice</label>
              <Controller
                control={control}
                name="voiceId"
                render={({ field }) => (
                  <select
                    value={field.value}
                    onChange={(e) => {
                      field.onChange(e.target.value);
                      const found = SCOTTISH_VOICES.find((x) => x.voiceId === e.target.value);
                      setValue("voiceName", found?.voiceName ?? "", { shouldValidate: true });
                    }}
                    className={inputCls}
                  >
                    <option value="">Select a voice…</option>
                    {SCOTTISH_VOICES.map((x) => (
                      <option key={x.voiceId} value={x.voiceId}>
                        {x.voiceName}
                      </option>
                    ))}
                  </select>
                )}
              />
              {errors.voiceId && <p className={errCls}>{errors.voiceId.message}</p>}
            </div>
            <div>
              <label className={labelCls}>First message <span className="text-[var(--text-muted)]">(optional)</span></label>
              <textarea {...register("firstMessage")} rows={3} placeholder="Hello, thanks for calling…" className={inputCls} />
            </div>
          </div>
        )}

        {/* Step 4 */}
        {step === 3 && (
          <div className="space-y-4">
            <h3 className="font-display text-base font-bold text-[var(--text-primary)]">Review &amp; Deploy</h3>
            <dl className="divide-y divide-[var(--surface-600)] rounded-xl border border-[var(--surface-600)]">
              {[
                ["Name", v.name],
                ["Role", v.role],
                ["Description", v.description],
                ["LLM", `${v.llmProvider} · ${v.llmModel}`],
                ["TTS", `${v.ttsProvider} · ${v.accent}`],
                ["Voice", v.voiceName || "—"],
                ["First message", v.firstMessage || "(default greeting)"],
              ].map(([label, value]) => (
                <div key={label} className="flex gap-4 px-4 py-2.5 text-sm">
                  <dt className="w-32 shrink-0 text-[var(--text-muted)]">{label}</dt>
                  <dd className="text-[var(--text-primary)]">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}

        {/* Actions */}
        <div className="mt-6 flex items-center justify-between">
          <button
            type="button"
            onClick={() => (step === 0 ? router.push("/agents") : back())}
            className="focus-ring interactive-press flex items-center gap-1.5 rounded-lg border border-[var(--surface-600)] bg-white px-3.5 py-2 text-sm font-medium text-[var(--text-primary)] transition-colors hover:bg-[var(--surface-700)]"
          >
            <ArrowLeft size={15} /> {step === 0 ? "Cancel" : "Back"}
          </button>

          {step < STEPS.length - 1 ? (
            <button
              type="button"
              onClick={next}
              className="focus-ring interactive-press flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold text-black transition-opacity hover:opacity-90"
              style={{ background: "var(--brand)" }}
            >
              Next <ArrowRight size={15} />
            </button>
          ) : (
            <button
              type="submit"
              disabled={deploying}
              className="focus-ring interactive-press flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold text-black transition-opacity hover:opacity-90 disabled:opacity-70"
              style={{ background: "var(--brand)" }}
            >
              <Rocket size={15} /> Deploy Agent
            </button>
          )}
        </div>
      </form>

      {/* Deployment overlay */}
      {deploying && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="card-surface flex w-80 flex-col items-center p-8 text-center shadow-xl">
            <Loader2 size={36} className="animate-spin text-[var(--brand-dim)]" />
            <p className="mt-4 font-display text-base font-bold text-[var(--text-primary)]">Deploying agent</p>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">{DEPLOY_LINES[deployLine]}</p>
          </div>
        </div>
      )}
    </div>
  );
}

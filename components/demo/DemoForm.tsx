"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, AlertCircle, Loader2, PhoneCall } from "lucide-react";
import { useTarsha } from "@/context/TarshaContext";
import { demoSchema } from "@/lib/schemas";
import type { DemoFormValues } from "@/types";

const inputCls =
  "focus-ring w-full rounded-lg border border-[var(--surface-600)] bg-white px-3 py-2 text-sm placeholder:text-[var(--text-muted)]";
const labelCls = "mb-1.5 block text-sm font-medium text-[var(--text-primary)]";
const errCls = "mt-1 text-xs text-red-600";

const BEST_TIMES: DemoFormValues["bestTime"][] = ["Now", "Morning", "Afternoon", "Evening"];

export function DemoForm() {
  const { state } = useTarsha();
  const active = state.agents.filter((a) => a.status === "active");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<DemoFormValues>({
    resolver: zodResolver(demoSchema),
    defaultValues: { fullName: "", phone: "", agentId: active[0]?.id ?? "", company: "", bestTime: "Now" },
  });

  const bestTime = watch("bestTime");

  async function onSubmit(values: DemoFormValues) {
    setStatus("submitting");
    await new Promise((r) => setTimeout(r, 1800));
    if (values.phone.trim().startsWith("000")) {
      setStatus("error");
      return;
    }
    setStatus("success");
  }

  if (status === "success") {
    const agent = active.find((a) => a.id === watch("agentId"));
    return (
      <div className="flex flex-col items-center py-6 text-center">
        <CheckCircle2 size={44} className="text-green-500" />
        <h3 className="mt-3 font-display text-lg font-bold text-[var(--text-primary)]">You&apos;re all set!</h3>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">
          {agent?.name ?? "Your receptionist"} will call {watch("fullName") || "you"} shortly.
        </p>
        <button
          onClick={() => {
            reset();
            setStatus("idle");
          }}
          className="focus-ring interactive-press mt-5 rounded-lg border border-[var(--surface-600)] bg-white px-4 py-2 text-sm font-medium text-[var(--text-primary)] transition-colors hover:bg-[var(--surface-700)]"
        >
          Book another call
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <h3 className="font-display text-base font-bold text-[var(--text-primary)]">Get a live demo call</h3>

      {status === "error" && (
        <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          <AlertCircle size={15} /> Something went wrong placing the call. Please try a different number.
        </div>
      )}

      <div>
        <label className={labelCls}>Full name</label>
        <input {...register("fullName")} placeholder="Jane Stewart" className={inputCls} />
        {errors.fullName && <p className={errCls}>{errors.fullName.message}</p>}
      </div>

      <div>
        <label className={labelCls}>Phone number</label>
        <input {...register("phone")} placeholder="+44 7700 900123" className={inputCls} />
        {errors.phone && <p className={errCls}>{errors.phone.message}</p>}
      </div>

      <div>
        <label className={labelCls}>Company <span className="text-[var(--text-muted)]">(optional)</span></label>
        <input {...register("company")} placeholder="Acme Ltd" className={inputCls} />
      </div>

      <div>
        <label className={labelCls}>Voice agent</label>
        <select {...register("agentId")} className={inputCls}>
          {active.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name} — {a.role}
            </option>
          ))}
        </select>
        {errors.agentId && <p className={errCls}>{errors.agentId.message}</p>}
      </div>

      <div>
        <label className={labelCls}>Best time to call</label>
        <div className="flex flex-wrap gap-2">
          {BEST_TIMES.map((t) => (
            <button
              type="button"
              key={t}
              onClick={() => setValue("bestTime", t)}
              className={`focus-ring interactive-press rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
                bestTime === t
                  ? "border-[var(--brand)] bg-[var(--brand-pale)] text-[var(--text-primary)]"
                  : "border-[var(--surface-600)] bg-white text-[var(--text-secondary)] hover:bg-[var(--surface-700)]"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="focus-ring interactive-press flex w-full items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold text-black transition-opacity hover:opacity-90 disabled:opacity-70"
        style={{ background: "var(--brand)" }}
      >
        {status === "submitting" ? (
          <>
            <Loader2 size={16} className="animate-spin" /> Connecting…
          </>
        ) : (
          <>
            <PhoneCall size={16} /> Call me now
          </>
        )}
      </button>
    </form>
  );
}

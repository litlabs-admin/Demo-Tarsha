"use client";

import { useState } from "react";
import {
  Search,
  Rocket,
  Bot,
  Mic,
  Webhook,
  Code2,
  HelpCircle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const CATEGORIES = [
  { icon: Rocket, title: "Getting Started", desc: "Set up your first AI receptionist in minutes." },
  { icon: Bot, title: "Agents", desc: "Configure roles, prompts, and behaviour." },
  { icon: Mic, title: "Voice", desc: "Choose voices, accents, and speech settings." },
  { icon: Webhook, title: "Webhooks", desc: "Stream call events to your systems." },
  { icon: Code2, title: "API Reference", desc: "Full REST API for programmatic control." },
  { icon: HelpCircle, title: "FAQ", desc: "Answers to common questions." },
];

const SIDE_LINKS = ["Quickstart", "Authentication", "Rate limits", "Changelog", "Status page", "Support"];

export default function DocsPage() {
  const { toast } = useToast();
  const [query, setQuery] = useState("");

  const filtered = CATEGORIES.filter((c) =>
    `${c.title} ${c.desc}`.toLowerCase().includes(query.trim().toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="font-display text-xl font-bold text-[var(--text-primary)]">Documentation</h2>
        <p className="text-sm text-[var(--text-secondary)]">Everything you need to build with Tarsha AI.</p>
      </div>

      <div className="relative mb-6 max-w-xl">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search documentation…"
          className="focus-ring w-full rounded-lg border border-[var(--surface-600)] bg-white py-2.5 pl-9 pr-3 text-sm placeholder:text-[var(--text-muted)]"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_220px]">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {filtered.map((c) => {
            const Icon = c.icon;
            return (
              <button
                key={c.title}
                onClick={() => toast({ title: c.title, description: "Docs section opens in the full product." })}
                className="card-surface card-hover focus-ring interactive-press flex flex-col items-start p-5 text-left"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: "var(--brand-glow)" }}>
                  <Icon size={18} className="text-[var(--brand-dim)]" />
                </span>
                <h3 className="mt-3 font-display text-base font-bold text-[var(--text-primary)]">{c.title}</h3>
                <p className="mt-1 text-sm text-[var(--text-secondary)]">{c.desc}</p>
              </button>
            );
          })}
          {filtered.length === 0 && (
            <p className="col-span-full py-8 text-center text-sm text-[var(--text-muted)]">No docs match your search.</p>
          )}
        </div>

        <aside className="card-surface h-fit p-4">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-[var(--text-muted)]">Quick Links</p>
          <ul className="space-y-1">
            {SIDE_LINKS.map((l) => (
              <li key={l}>
                <button
                  onClick={() => toast({ title: l, description: "Opens in the full product." })}
                  className="focus-ring w-full rounded-md px-2 py-1.5 text-left text-sm text-[var(--text-secondary)] transition-colors hover:bg-[var(--surface-700)] hover:text-[var(--text-primary)]"
                >
                  {l}
                </button>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </div>
  );
}

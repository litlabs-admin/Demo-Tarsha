"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function SettingsPage() {
  const inputClass = "w-full bg-[var(--surface-700)] border border-[var(--surface-600)] rounded-[8px] text-sm text-[var(--text-secondary)] px-3 py-2 outline-none";

  return (
    <div>
      <div className="mb-6">
        <h2 className="font-display font-bold text-lg text-[var(--text-primary)]">Settings</h2>
        <p className="text-sm text-[var(--text-muted)] mt-1">Manage your Tarsha AI account and preferences</p>
      </div>

      <Tabs defaultValue="account">
        <TabsList className="bg-[var(--surface-700)] border border-[var(--surface-600)] p-1 rounded-[8px] mb-6">
          {["account", "api-keys", "billing"].map((tab) => (
            <TabsTrigger
              key={tab}
              value={tab}
              className="rounded-[6px] text-xs capitalize data-[state=active]:bg-[var(--surface-500)] data-[state=active]:text-[var(--text-primary)] text-[var(--text-secondary)]"
            >
              {tab === "api-keys" ? "API Keys" : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="account" className="space-y-4 pointer-events-none opacity-70">
          <div className="card-surface p-5 space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-[var(--brand)] flex items-center justify-center font-display font-bold text-black text-xl">T</div>
              <div>
                <p className="text-sm font-medium text-[var(--text-primary)]">Tarsha Admin</p>
                <p className="text-xs text-[var(--text-muted)]">admin@tarsha.co.uk</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5">Full Name</label>
                <input defaultValue="Tarsha Admin" className={inputClass} readOnly />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5">Email</label>
                <input defaultValue="admin@tarsha.co.uk" className={inputClass} readOnly />
              </div>
            </div>
            <button className="px-4 py-2 rounded-[8px] text-sm font-medium text-black bg-[var(--brand)]">Save Changes</button>
          </div>
        </TabsContent>

        <TabsContent value="api-keys" className="space-y-4 pointer-events-none opacity-70">
          <div className="card-surface p-5 space-y-4">
            {[
              { label: "Tarsha API Key", value: "sk-tarsha-••••••••••••••••" },
              { label: "Deepgram API Key", value: "dg-••••••••••••••••••••" },
              { label: "ElevenLabs API Key", value: "xi-••••••••••••••••••••" },
            ].map((key) => (
              <div key={key.label}>
                <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5">{key.label}</label>
                <div className="flex gap-2">
                  <input defaultValue={key.value} className={`${inputClass} flex-1 font-mono-id`} readOnly />
                  <button className="px-3 py-2 rounded-[8px] text-xs font-medium border border-[var(--surface-600)] text-[var(--text-secondary)]">Copy</button>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="billing" className="space-y-4 pointer-events-none opacity-70">
          <div className="card-surface p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-display font-bold text-base text-[var(--text-primary)]">Tarsha Pro</p>
                <p className="text-xs text-[var(--text-muted)]">Renews 1 July 2025</p>
              </div>
              <span className="px-3 py-1.5 rounded-full text-xs font-medium border border-[var(--brand)]/30 bg-[var(--brand-glow)] text-[var(--brand)]">✦ Pro</span>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-[var(--text-secondary)]">Minutes Used</span>
                <span className="font-mono-id text-[var(--text-secondary)]">847 / 2,000</span>
              </div>
              <div className="w-full bg-[var(--surface-500)] rounded-full h-2">
                <div className="rainbow-gradient h-2 rounded-full" style={{ width: "42.35%" }} />
              </div>
            </div>
            <button className="px-4 py-2 rounded-[8px] text-sm font-medium text-black bg-[var(--brand)]">Manage Plan</button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

"use client";

import { useToast } from "@/hooks/use-toast";

const inputCls =
  "focus-ring w-full rounded-lg border border-[var(--surface-600)] bg-white px-3 py-2 text-sm text-[var(--text-primary)]";
const labelCls = "mb-1.5 block text-sm font-medium text-[var(--text-primary)]";

export default function ProfilePage() {
  const { toast } = useToast();

  return (
    <div className="mx-auto max-w-2xl p-6">
      <h2 className="mb-1 font-display text-xl font-bold text-[var(--text-primary)]">Profile Settings</h2>
      <p className="mb-6 text-sm text-[var(--text-secondary)]">Manage your personal details and preferences.</p>

      <div className="card-surface space-y-5 p-6">
        <div className="flex items-center gap-4">
          <div
            className="flex h-16 w-16 items-center justify-center rounded-full font-display text-2xl font-black text-black"
            style={{ background: "var(--brand)" }}
          >
            T
          </div>
          <div>
            <p className="text-sm font-medium text-[var(--text-primary)]">Tarsha Admin</p>
            <p className="text-xs text-[var(--text-secondary)]">admin@tarsha.co.uk</p>
            <button
              onClick={() => toast({ title: "Upload", description: "Avatar upload is disabled in this demo." })}
              className="focus-ring mt-1 text-xs font-medium text-[var(--brand-dim)] hover:underline"
            >
              Change avatar
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className={labelCls}>Full name</label>
            <input defaultValue="Tarsha Admin" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Email</label>
            <input defaultValue="admin@tarsha.co.uk" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Role</label>
            <input defaultValue="Administrator" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Timezone</label>
            <select defaultValue="Europe/London" className={inputCls}>
              <option>Europe/London</option>
              <option>Europe/Dublin</option>
              <option>UTC</option>
              <option>America/New_York</option>
            </select>
          </div>
        </div>

        <button
          onClick={() => toast({ title: "Saved", description: "Your profile has been updated." })}
          className="focus-ring interactive-press rounded-lg px-4 py-2 text-sm font-semibold text-black transition-opacity hover:opacity-90"
          style={{ background: "var(--brand)" }}
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}

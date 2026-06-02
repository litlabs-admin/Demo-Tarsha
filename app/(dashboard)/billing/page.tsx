"use client";

import { CreditCard, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const INVOICES = [
  { id: "INV-2026-006", date: "1 Jun 2026", amount: "£299.00", status: "Paid" },
  { id: "INV-2026-005", date: "1 May 2026", amount: "£299.00", status: "Paid" },
  { id: "INV-2026-004", date: "1 Apr 2026", amount: "£299.00", status: "Paid" },
];

export default function BillingPage() {
  const { toast } = useToast();

  return (
    <div className="mx-auto max-w-3xl space-y-5 p-6">
      <div>
        <h2 className="font-display text-xl font-bold text-[var(--text-primary)]">Billing</h2>
        <p className="text-sm text-[var(--text-secondary)]">Manage your plan, payment method, and invoices.</p>
      </div>

      <div className="card-surface flex items-center justify-between p-5">
        <div>
          <p className="font-display text-base font-bold text-[var(--text-primary)]">Tarsha Pro</p>
          <p className="text-sm text-[var(--text-secondary)]">£299 / month</p>
        </div>
        <button
          onClick={() => toast({ title: "Manage Plan", description: "Plan management is disabled in this demo." })}
          className="focus-ring interactive-press rounded-lg border border-[var(--surface-600)] bg-white px-4 py-2 text-sm font-medium text-[var(--text-primary)] transition-colors hover:bg-[var(--surface-700)]"
        >
          Manage Plan
        </button>
      </div>

      <div className="card-surface p-5">
        <h3 className="mb-3 font-display text-base font-bold text-[var(--text-primary)]">Payment Method</h3>
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-12 items-center justify-center rounded-md border border-[var(--surface-600)] bg-[var(--surface-700)]">
            <CreditCard size={18} className="text-[var(--text-muted)]" />
          </span>
          <div>
            <p className="text-sm font-medium text-[var(--text-primary)]">Visa ···· 4242</p>
            <p className="text-xs text-[var(--text-secondary)]">Expires 08/28</p>
          </div>
        </div>
      </div>

      <div className="card-surface p-5">
        <h3 className="mb-3 font-display text-base font-bold text-[var(--text-primary)]">Usage</h3>
        <div className="mb-1.5 flex justify-between text-sm">
          <span className="text-[var(--text-secondary)]">Call minutes</span>
          <span className="font-mono-id text-[var(--text-primary)]">847 / 2,000</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--surface-500)]">
          <div className="h-full rounded-full" style={{ width: "42.35%", background: "var(--brand)" }} />
        </div>
      </div>

      <div className="card-surface overflow-hidden">
        <h3 className="border-b border-[var(--surface-600)] px-5 py-3.5 font-display text-base font-bold text-[var(--text-primary)]">
          Invoices
        </h3>
        <table className="w-full text-sm">
          <tbody>
            {INVOICES.map((inv) => (
              <tr key={inv.id} className="border-b border-[var(--surface-600)] last:border-0">
                <td className="px-5 py-3 font-mono-id text-[var(--text-primary)]">{inv.id}</td>
                <td className="px-5 py-3 text-[var(--text-secondary)]">{inv.date}</td>
                <td className="px-5 py-3 text-[var(--text-primary)]">{inv.amount}</td>
                <td className="px-5 py-3">
                  <span className="rounded-full border border-green-200 bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700">
                    {inv.status}
                  </span>
                </td>
                <td className="px-5 py-3 text-right">
                  <button
                    onClick={() => toast({ title: "Download", description: `${inv.id} downloaded (demo).` })}
                    className="focus-ring inline-flex items-center gap-1 text-xs font-medium text-[var(--brand-dim)] hover:underline"
                  >
                    <Download size={12} /> Download
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

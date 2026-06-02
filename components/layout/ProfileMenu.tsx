"use client";

import { useRouter } from "next/navigation";
import { ChevronDown, User, Building2, CreditCard, BookText, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

export function ProfileMenu() {
  const router = useRouter();
  const { toast } = useToast();

  const items = [
    { label: "Profile Settings", icon: User, href: "/profile" },
    { label: "Account", icon: Building2, href: "/account", badge: "Tarsha Pro" },
    { label: "Billing", icon: CreditCard, href: "/billing" },
    { label: "Documentation", icon: BookText, href: "/docs" },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="focus-ring interactive-press flex items-center gap-2 rounded-lg py-1 pl-1 pr-2 transition-colors hover:bg-[var(--surface-700)]">
          <span
            className="flex h-7 w-7 items-center justify-center rounded-full font-display text-xs font-black text-black"
            style={{ background: "var(--brand)" }}
          >
            T
          </span>
          <span className="hidden text-sm font-medium text-[var(--text-primary)] sm:block">Tarsha Admin</span>
          <ChevronDown size={14} className="text-[var(--text-muted)]" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60">
        <div className="border-b border-[var(--surface-600)] px-2 py-2">
          <p className="text-sm font-medium text-[var(--text-primary)]">Tarsha Admin</p>
          <p className="text-xs text-[var(--text-secondary)]">admin@tarsha.co.uk</p>
        </div>
        <div className="py-1">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <DropdownMenuItem key={item.href} onSelect={() => router.push(item.href)}>
                <Icon size={15} className="text-[var(--text-muted)]" />
                <span className="flex-1">{item.label}</span>
                {item.badge && (
                  <span
                    className="rounded-full px-1.5 py-0.5 text-[10px] font-semibold text-black"
                    style={{ background: "var(--brand)" }}
                  >
                    {item.badge}
                  </span>
                )}
              </DropdownMenuItem>
            );
          })}
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={() => {
            toast({ title: "Signed out", description: "This is a demo — you remain signed in." });
            router.push("/dashboard");
          }}
        >
          <LogOut size={15} className="text-[var(--text-muted)]" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

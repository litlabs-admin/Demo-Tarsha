"use client";

import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { CallDemoModal } from "@/components/demo/CallDemoModal";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-[var(--surface-900)]">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar />
        <main className="h-[calc(100vh-56px)] flex-1 overflow-auto bg-[var(--surface-900)]">
          <div className="page-transition min-h-full">{children}</div>
        </main>
      </div>
      <CallDemoModal />
    </div>
  );
}

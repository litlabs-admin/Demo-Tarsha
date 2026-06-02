"use client";

import { CreateAgentWizard } from "@/components/agents/wizard/CreateAgentWizard";

export default function CreateAgentPage() {
  return (
    <div className="p-6">
      <div className="mx-auto mb-6 max-w-2xl">
        <h2 className="font-display text-xl font-bold text-[var(--text-primary)]">Create a new agent</h2>
        <p className="text-sm text-[var(--text-secondary)]">Configure and deploy an AI receptionist in four steps.</p>
      </div>
      <CreateAgentWizard />
    </div>
  );
}

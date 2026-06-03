import { z } from "zod";

export const AGENT_ROLES = [
  "HR Assistant",
  "Lender",
  "Insurer",
  "Property Guide",
  "Legal Guide",
  "Property Manager",
  "Franchise Guide",
  "Host",
  "Style Assistant",
] as const;

// Wizard schema — one combined object, validated per step.
export const createAgentSchema = z.object({
  // Step 1 — Agent Information
  name: z.string().min(2, "Name must be at least 2 characters").max(50),
  role: z.enum(AGENT_ROLES),
  description: z.string().min(10, "Add a short description (10+ characters)").max(400),
  // Step 2 — AI Configuration
  llmProvider: z.string().min(1),
  llmModel: z.string().min(1),
  sttProvider: z.string().min(1),
  sttModel: z.string().min(1),
  language: z.string().min(1),
  // Step 3 — Voice & Behaviour
  ttsProvider: z.string().min(1),
  voiceId: z.string().min(1, "Select a voice"),
  voiceName: z.string().min(1),
  accent: z.string().min(1),
  firstMessage: z.string().optional(),
  systemPrompt: z.string().min(20, "System prompt must be at least 20 characters"),
});

export type CreateAgentSchema = z.infer<typeof createAgentSchema>;

export const STEP_FIELDS: Record<number, (keyof CreateAgentSchema)[]> = {
  0: ["name", "role", "description"],
  1: ["llmProvider", "llmModel", "sttProvider", "sttModel", "language"],
  2: ["ttsProvider", "voiceId", "voiceName", "accent", "systemPrompt"],
  3: [],
};

export const demoSchema = z.object({
  fullName: z.string().min(1, "Name is required"),
  phone: z.string().min(5, "Phone number is required"),
  agentId: z.string().min(1, "Please select an agent"),
  company: z.string().optional(),
  bestTime: z.enum(["Now", "Morning", "Afternoon", "Evening"]),
});

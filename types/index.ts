export type AgentRole =
  | "HR Assistant"
  | "Lender"
  | "Insurer"
  | "Property Guide"
  | "Legal Guide"
  | "Property Manager"
  | "Franchise Guide"
  | "Host"
  | "Style Assistant"
  | "Legacy Agent";

export type AgentStatus = "active" | "archived" | "draft";

export interface STTConfig {
  provider: string; // "Deepgram"
  model: string; // "Nova-2"
}

export interface LLMConfig {
  provider: string; // "Anthropic"
  model: string; // "claude-sonnet-4-20250514"
}

export interface TTSConfig {
  provider: string; // "ElevenLabs"
  voiceId: string;
  voiceName: string;
  accent: string; // "Scottish"
}

export interface AgentOutcome {
  label: string;
  pct: number;
}

export interface AgentActivity {
  caller: string;
  outcome: string;
  time: string;
}

export interface Agent {
  id: string; // slug, e.g. "grace"
  name: string; // "Grace"
  role: AgentRole; // "HR Assistant"
  title: string; // display, e.g. "HR Assistant"
  status: AgentStatus;
  agentRef: string; // "Grace_HR_Assistant"
  platform: string; // "Tarsha"
  stt: STTConfig;
  language: string; // "en-GB"
  llm: LLMConfig;
  tts: TTSConfig;
  description: string;
  systemPrompt: string;
  systemPromptSummary: string;
  firstMessage: string;
  keywords: string[];
  callTags: string[];
  confidence: number;
  smartEndpointing: boolean;
  voicemailDetection: boolean;
  createdAt: string;
  callsHandled: number;
  callsThisWeek: number;
  successRate: number; // 0-100
  avgDuration: string; // "3m 12s"
  cost: number; // avg cost per min
  latency: number; // avg ms
  commonOutcomes: AgentOutcome[];
  recentActivity: AgentActivity[];
}

export type CallStatus = "completed" | "missed" | "voicemail" | "transferred";

export interface TranscriptLine {
  speaker: "caller" | "agent";
  text: string;
}

export interface CallDetail {
  id: string;
  caller: string;
  callerPhone: string;
  agent: string; // agent name
  agentId: string; // agent slug
  duration: string;
  status: CallStatus;
  time: string; // "Today, 11:42 AM"
  date: string; // "3 Jun 2026"
  outcome: string; // outcome classification
  tags: string[];
  transcriptSummary: string;
  snippets: TranscriptLine[];
}

// alias kept for legacy imports
export type RecentCall = CallDetail;

export type NotificationType =
  | "deployed"
  | "spike"
  | "missed"
  | "kb"
  | "config"
  | "report";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  time: string;
  read: boolean;
  href?: string;
}

export interface AnalyticsData {
  callVolume: { day: string; calls: number }[];
  perAgent: { agent: string; calls: number }[];
  successTrend: { week: string; rate: number }[];
  durationTrend: { week: string; avg: number }[];
  weekly: { label: string; thisWeek: number; lastWeek: number }[];
}

export interface ReportData {
  weeklySummaries: { label: string; value: string; sub: string; trend: number }[];
  momComparisons: { metric: string; thisMonth: string; lastMonth: string; trend: number }[];
  topAgents: { name: string; role: string; calls: number; successRate: number }[];
  outcomeBreakdown: { name: string; value: number; color: string }[];
}

export interface PhoneNumber {
  id: string;
  number: string;
  provider: string; // "Twilio" | "Tarsha"
  region: string; // "Edinburgh, UK"
  assignedAgent: string | null; // agent name
  direction: "Inbound" | "Outbound" | "Both";
  status: "active" | "idle";
}

export interface ToolConfig {
  id: string;
  name: string;
  provider: string;
  category: string;
  description: string;
  enabled: boolean;
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  steps: number;
  trigger: string;
  status: "active" | "draft";
  nodes: string[]; // simple node labels for the flow visual
}

export interface Squad {
  id: string;
  name: string;
  description: string;
  members: string[]; // agent names, in handoff order
  transferRules: number;
  status: "active" | "draft";
}

export interface CreateAgentFormValues {
  name: string;
  role: AgentRole;
  description: string;
  llmProvider: string;
  llmModel: string;
  sttProvider: string;
  sttModel: string;
  language: string;
  ttsProvider: string;
  voiceId: string;
  voiceName: string;
  accent: string;
  firstMessage?: string;
  systemPrompt: string;
}

export interface DemoFormValues {
  fullName: string;
  phone: string;
  agentId: string;
  company?: string;
  bestTime: "Now" | "Morning" | "Afternoon" | "Evening";
}

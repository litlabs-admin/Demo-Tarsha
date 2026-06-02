"use client";

import React, { createContext, useContext, useReducer, useState, ReactNode } from "react";
import {
  Agent,
  AgentRole,
  CallDetail,
  Notification,
  CreateAgentFormValues,
} from "@/types";
import {
  SEED_AGENTS,
  SEED_CALLS,
  SEED_NOTIFICATIONS,
  SYSTEM_PROMPTS,
} from "@/lib/seed-data";

interface TarshaState {
  agents: Agent[];
  recentCalls: CallDetail[];
  notifications: Notification[];
}

type TarshaAction =
  | { type: "ADD_AGENT"; payload: Agent }
  | { type: "ADD_NOTIFICATION"; payload: Notification }
  | { type: "MARK_NOTIFICATION_READ"; payload: string }
  | { type: "MARK_ALL_READ" };

function tarshaReducer(state: TarshaState, action: TarshaAction): TarshaState {
  switch (action.type) {
    case "ADD_AGENT":
      return { ...state, agents: [...state.agents, action.payload] };
    case "ADD_NOTIFICATION":
      return { ...state, notifications: [action.payload, ...state.notifications] };
    case "MARK_NOTIFICATION_READ":
      return {
        ...state,
        notifications: state.notifications.map((n) =>
          n.id === action.payload ? { ...n, read: true } : n
        ),
      };
    case "MARK_ALL_READ":
      return {
        ...state,
        notifications: state.notifications.map((n) => ({ ...n, read: true })),
      };
    default:
      return state;
  }
}

const initialState: TarshaState = {
  agents: SEED_AGENTS,
  recentCalls: SEED_CALLS,
  notifications: SEED_NOTIFICATIONS,
};

interface TarshaContextValue {
  state: TarshaState;
  dispatch: React.Dispatch<TarshaAction>;
  addAgent: (values: CreateAgentFormValues) => Promise<Agent>;
  markRead: (id: string) => void;
  markAllRead: () => void;
  unreadCount: number;
  // Global Call Demo modal control
  callDemoOpen: boolean;
  openCallDemo: (agentId?: string) => void;
  closeCallDemo: () => void;
  callDemoAgentId: string | null;
}

const TarshaContext = createContext<TarshaContextValue | null>(null);

function genId(): string {
  // deterministic-enough unique id without Math.random hashing collisions in demo
  return (
    Math.abs(
      Array.from(String(Date.now())).reduce((a, c) => (a * 31 + c.charCodeAt(0)) | 0, 7)
    ).toString(36) + Date.now().toString(36).slice(-4)
  );
}

export function TarshaProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(tarshaReducer, initialState);
  const [callDemoOpen, setCallDemoOpen] = useState(false);
  const [callDemoAgentId, setCallDemoAgentId] = useState<string | null>(null);

  async function addAgent(values: CreateAgentFormValues): Promise<Agent> {
    await new Promise((resolve) => setTimeout(resolve, 1400));

    const slug = `${values.name.toLowerCase().replace(/\s+/g, "-")}-${genId().slice(0, 4)}`;
    const role = values.role as AgentRole;
    const vapiAgentId = `${values.name.replace(/\s+/g, "_")}_${role.replace(/\s+/g, "_")}`;

    const newAgent: Agent = {
      id: slug,
      name: values.name,
      role,
      title: role,
      status: "active",
      vapiAgentId,
      platform: "VAPI",
      stt: { provider: "Deepgram", model: "Nova-2" },
      language: "en-GB",
      llm: { provider: values.llmProvider, model: values.llmModel },
      tts: {
        provider: values.ttsProvider,
        voiceId: values.voiceId,
        voiceName: values.voiceName,
        accent: values.accent,
      },
      description: values.description,
      systemPrompt: SYSTEM_PROMPTS[role] ?? values.description,
      systemPromptSummary: values.description,
      firstMessage:
        values.firstMessage ||
        `Hello, I'm ${values.name}, your AI receptionist. How can I help you today?`,
      keywords: [],
      callTags: ["New"],
      confidence: 0.55,
      smartEndpointing: true,
      voicemailDetection: true,
      createdAt: new Date().toISOString(),
      callsHandled: 0,
      callsThisWeek: 0,
      successRate: 0,
      avgDuration: "0m 00s",
      cost: 0.07,
      latency: 920,
      commonOutcomes: [],
      recentActivity: [{ caller: "—", outcome: "Agent deployed", time: "just now" }],
    };

    dispatch({ type: "ADD_AGENT", payload: newAgent });
    dispatch({
      type: "ADD_NOTIFICATION",
      payload: {
        id: `n-${genId()}`,
        type: "deployed",
        title: "Agent deployed successfully",
        body: `${newAgent.name} — ${newAgent.role} is now live.`,
        time: "just now",
        read: false,
        href: `/agents/${newAgent.id}`,
      },
    });

    return newAgent;
  }

  const unreadCount = state.notifications.filter((n) => !n.read).length;

  return (
    <TarshaContext.Provider
      value={{
        state,
        dispatch,
        addAgent,
        markRead: (id) => dispatch({ type: "MARK_NOTIFICATION_READ", payload: id }),
        markAllRead: () => dispatch({ type: "MARK_ALL_READ" }),
        unreadCount,
        callDemoOpen,
        openCallDemo: (agentId) => {
          setCallDemoAgentId(agentId ?? null);
          setCallDemoOpen(true);
        },
        closeCallDemo: () => setCallDemoOpen(false),
        callDemoAgentId,
      }}
    >
      {children}
    </TarshaContext.Provider>
  );
}

export function useTarsha() {
  const ctx = useContext(TarshaContext);
  if (!ctx) throw new Error("useTarsha must be used inside TarshaProvider");
  return ctx;
}

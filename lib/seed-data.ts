import {
  Agent,
  AgentRole,
  CallDetail,
  Notification,
  AnalyticsData,
  ReportData,
  PhoneNumber,
  ToolConfig,
  Workflow,
  Squad,
} from "@/types";

/* ------------------------------------------------------------------ *
 * Shared agent configuration (all Tarsha agents run on this stack)
 * ------------------------------------------------------------------ */
const SHARED = {
  platform: "VAPI",
  stt: { provider: "Deepgram", model: "Nova-2" },
  language: "en-GB",
  llm: { provider: "Anthropic", model: "claude-sonnet-4-20250514" },
  cost: 0.07,
  latency: 920,
};

export const SYSTEM_PROMPTS: Record<AgentRole, string> = {
  "HR Assistant": `[Identity] You are Grace, a warm and discreet Scottish HR assistant for [Company Name].

[Behaviour] Handle candidate enquiries, employee queries, and HR scheduling. Treat every matter with absolute discretion. Route sensitive grievance or disciplinary topics straight to a human HR adviser.

[Objective] Free the HR team from routine enquiries while ensuring every caller feels respected, heard, and directed to the right person.`,

  Lender: `[Identity] You are Callum, a knowledgeable Scottish lending specialist for [Company Name].

[Behaviour] Qualify inbound borrowing enquiries, capture caller details, and book callbacks with a qualified adviser. Never give regulated financial advice or quote specific rates.

[Objective] Convert enquiries into qualified, FCA-compliant leads while making every caller feel valued.`,

  Insurer: `[Identity] You are Isla, a trusted Scottish insurance receptionist for [Company Name].

[Behaviour] Handle policy queries, renewals, and new cover requests. On claims calls, express genuine concern first, then gather details. Route complex cases to a human agent.

[Objective] Make callers feel supported, capture accurate details, and book follow-ups with specialist advisers.`,

  "Property Guide": `[Identity] You are Fraser, a friendly Scottish property guide for [Company Name].

[Behaviour] Help buyers, sellers, landlords, and tenants. Book viewings, capture enquiry details, and answer common property questions 24/7.

[Objective] Convert enquiries into booked viewings and consultations — never miss a property lead.`,

  "Legal Guide": `[Identity] You are Gordon, a professional Scottish legal receptionist for [Company Name].

[Behaviour] Conduct initial intake for new client enquiries. Always clarify that you provide general guidance only — never regulated legal advice. Schedule consultations efficiently.

[Objective] Streamline intake, reduce the burden on fee earners, and reassure prospective clients from the first call.`,

  "Property Manager": `[Identity] You are Ross, a dependable Scottish property manager for [Company Name].

[Behaviour] Handle maintenance reports, tenancy queries, and landlord requests. Log issues accurately, prioritise emergencies, and schedule contractor visits.

[Objective] Keep tenants and landlords informed and ensure no maintenance issue slips through the cracks.`,

  "Franchise Guide": `[Identity] You are Craig, an enthusiastic Scottish franchise guide for [Company Name].

[Behaviour] Qualify prospective franchisees, explain opportunities at a high level, capture investment appetite, and book discovery calls with the franchise team.

[Objective] Identify serious prospects and route them efficiently to the franchise development team.`,

  Host: `[Identity] You are Bonnie, a cheerful Scottish hospitality host for [Company Name].

[Behaviour] Take table reservations, answer menu and dietary questions, handle event enquiries, and check availability. Confirm every booking with name, party size, date, and time.

[Objective] Maximise bookings and guest satisfaction, day or night, and make every caller feel like a valued guest.`,

  "Style Assistant": `[Identity] You are Skye, a stylish and attentive Scottish style assistant for [Company Name].

[Behaviour] Book styling appointments, answer product and availability questions, and capture client preferences for personal shopping.

[Objective] Turn enquiries into booked appointments and build a personal, on-brand rapport with every caller.`,

  "Legacy Agent": `[Identity] You are Bob, a legacy receptionist agent retained for historical reference only.

[Behaviour] This agent is archived and no longer handles live calls.

[Objective] Preserved for audit and configuration history.`,
};

const SUMMARIES: Record<AgentRole, string> = {
  "HR Assistant": "Handles HR enquiries, candidate questions, and scheduling with discretion.",
  Lender: "Qualifies lending enquiries and books adviser callbacks, FCA-compliant.",
  Insurer: "Manages policy, renewal, and claims enquiries with empathy.",
  "Property Guide": "Books viewings and answers property questions around the clock.",
  "Legal Guide": "Runs new-client intake and schedules consultations.",
  "Property Manager": "Logs maintenance issues and coordinates tenancy queries.",
  "Franchise Guide": "Qualifies franchise prospects and books discovery calls.",
  Host: "Takes reservations and handles hospitality enquiries 24/7.",
  "Style Assistant": "Books styling appointments and captures client preferences.",
  "Legacy Agent": "Archived legacy agent — no longer handling live calls.",
};

interface AgentSeed {
  id: string;
  name: string;
  role: AgentRole;
  status?: "active" | "archived";
  voiceId: string;
  voiceName: string;
  vapiAgentId: string;
  keywords: string[];
  callTags: string[];
  firstMessage: string;
  callsHandled: number;
  callsThisWeek: number;
  successRate: number;
  avgDuration: string;
  commonOutcomes: { label: string; pct: number }[];
  recentActivity: { caller: string; outcome: string; time: string }[];
}

function makeAgent(s: AgentSeed): Agent {
  return {
    id: s.id,
    name: s.name,
    role: s.role,
    title: s.role,
    status: s.status ?? "active",
    vapiAgentId: s.vapiAgentId,
    platform: SHARED.platform,
    stt: { ...SHARED.stt },
    language: SHARED.language,
    llm: { ...SHARED.llm },
    tts: {
      provider: "ElevenLabs",
      voiceId: s.voiceId,
      voiceName: s.voiceName,
      accent: "Scottish",
    },
    description: SUMMARIES[s.role],
    systemPrompt: SYSTEM_PROMPTS[s.role],
    systemPromptSummary: SUMMARIES[s.role],
    firstMessage: s.firstMessage,
    keywords: s.keywords,
    callTags: s.callTags,
    confidence: 0.72,
    smartEndpointing: true,
    voicemailDetection: true,
    createdAt: "2026-01-15T09:00:00Z",
    callsHandled: s.callsHandled,
    callsThisWeek: s.callsThisWeek,
    successRate: s.successRate,
    avgDuration: s.avgDuration,
    cost: SHARED.cost,
    latency: SHARED.latency,
    commonOutcomes: s.commonOutcomes,
    recentActivity: s.recentActivity,
  };
}

export const SEED_AGENTS: Agent[] = [
  makeAgent({
    id: "grace",
    name: "Grace",
    role: "HR Assistant",
    voiceId: "scot-ailsa-01",
    voiceName: "Ailsa — Calm & Reassuring",
    vapiAgentId: "Grace_HR_Assistant",
    keywords: ["HR", "recruitment", "holiday", "interview", "payroll"],
    callTags: ["Enquiry", "Scheduling", "Candidate"],
    firstMessage: "Hello, thanks for calling [Company Name] HR. I'm Grace — how can I help you today?",
    callsHandled: 286,
    callsThisWeek: 19,
    successRate: 88,
    avgDuration: "2m 48s",
    commonOutcomes: [
      { label: "Enquiry resolved", pct: 61 },
      { label: "Booked callback", pct: 24 },
      { label: "Transferred", pct: 15 },
    ],
    recentActivity: [
      { caller: "Eilidh Ross", outcome: "Booked interview", time: "12 min ago" },
      { caller: "Hamish Bell", outcome: "Holiday query resolved", time: "1h ago" },
      { caller: "Lorna Tait", outcome: "Transferred to adviser", time: "3h ago" },
    ],
  }),
  makeAgent({
    id: "callum",
    name: "Callum",
    role: "Lender",
    voiceId: "scot-malcolm-01",
    voiceName: "Malcolm — Deep & Authoritative",
    vapiAgentId: "Callum_the_lender",
    keywords: ["mortgage", "loan", "remortgage", "lending", "finance"],
    callTags: ["Lead", "Callback", "Qualification"],
    firstMessage: "Good day, you've reached [Company Name]. I'm Callum, your lending specialist. How can I help?",
    callsHandled: 312,
    callsThisWeek: 27,
    successRate: 84,
    avgDuration: "3m 12s",
    commonOutcomes: [
      { label: "Lead qualified", pct: 52 },
      { label: "Callback booked", pct: 33 },
      { label: "Not eligible", pct: 15 },
    ],
    recentActivity: [
      { caller: "Alasdair MacKenzie", outcome: "Lead qualified", time: "8 min ago" },
      { caller: "Mairi Gillies", outcome: "Callback booked", time: "40 min ago" },
      { caller: "Douglas Hay", outcome: "Lead qualified", time: "2h ago" },
    ],
  }),
  makeAgent({
    id: "isla",
    name: "Isla",
    role: "Insurer",
    voiceId: "scot-catriona-01",
    voiceName: "Catriona — Warm & Professional",
    vapiAgentId: "Isla_the_Insurer",
    keywords: ["insurance", "policy", "renewal", "claim", "cover"],
    callTags: ["Renewal", "Claim", "Quote"],
    firstMessage: "Hello, thanks for calling [Company Name]. I'm Isla — what can I help you with today?",
    callsHandled: 247,
    callsThisWeek: 21,
    successRate: 86,
    avgDuration: "2m 58s",
    commonOutcomes: [
      { label: "Query resolved", pct: 58 },
      { label: "Renewal booked", pct: 27 },
      { label: "Claim logged", pct: 15 },
    ],
    recentActivity: [
      { caller: "Moira Drummond", outcome: "Renewal booked", time: "18 min ago" },
      { caller: "Iain Forbes", outcome: "Claim logged", time: "1h ago" },
      { caller: "Senga Watt", outcome: "Quote provided", time: "4h ago" },
    ],
  }),
  makeAgent({
    id: "fraser",
    name: "Fraser",
    role: "Property Guide",
    voiceId: "scot-ferrol-01",
    voiceName: "Ferrol — Bright & Friendly",
    vapiAgentId: "Fraser_The_Property_Guide",
    keywords: ["property", "viewing", "house", "flat", "buy", "rent"],
    callTags: ["Viewing", "Enquiry", "Valuation"],
    firstMessage: "Hi there, you've reached [Company Name]. I'm Fraser — are you looking to buy, sell, or rent?",
    callsHandled: 198,
    callsThisWeek: 24,
    successRate: 81,
    avgDuration: "3m 04s",
    commonOutcomes: [
      { label: "Viewing booked", pct: 49 },
      { label: "Details captured", pct: 36 },
      { label: "Transferred", pct: 15 },
    ],
    recentActivity: [
      { caller: "Ruaridh Cameron", outcome: "Viewing booked", time: "22 min ago" },
      { caller: "Catherine Bruce", outcome: "Valuation requested", time: "2h ago" },
      { caller: "Niall Stewart", outcome: "Viewing booked", time: "5h ago" },
    ],
  }),
  makeAgent({
    id: "gordon",
    name: "Gordon",
    role: "Legal Guide",
    voiceId: "scot-malcolm-02",
    voiceName: "Malcolm — Deep & Authoritative",
    vapiAgentId: "Gordon_The_Legal_Guide",
    keywords: ["legal", "solicitor", "consultation", "contract", "dispute"],
    callTags: ["Intake", "Consultation", "Enquiry"],
    firstMessage: "Good morning, you've reached [Company Name]. I'm Gordon — how may I assist you today?",
    callsHandled: 156,
    callsThisWeek: 12,
    successRate: 83,
    avgDuration: "3m 28s",
    commonOutcomes: [
      { label: "Consultation booked", pct: 47 },
      { label: "Intake completed", pct: 38 },
      { label: "Referred out", pct: 15 },
    ],
    recentActivity: [
      { caller: "Shona McIntyre", outcome: "Consultation booked", time: "30 min ago" },
      { caller: "Graeme Reid", outcome: "Intake completed", time: "3h ago" },
      { caller: "Fiona Bain", outcome: "Referred to partner", time: "6h ago" },
    ],
  }),
  makeAgent({
    id: "ross",
    name: "Ross",
    role: "Property Manager",
    voiceId: "scot-ewan-01",
    voiceName: "Ewan — Steady & Practical",
    vapiAgentId: "Ross_The_Property_Manager",
    keywords: ["maintenance", "repair", "tenancy", "landlord", "contractor"],
    callTags: ["Maintenance", "Emergency", "Tenancy"],
    firstMessage: "Hello, you've reached [Company Name] property management. I'm Ross — how can I help?",
    callsHandled: 171,
    callsThisWeek: 16,
    successRate: 90,
    avgDuration: "2m 36s",
    commonOutcomes: [
      { label: "Issue logged", pct: 55 },
      { label: "Contractor booked", pct: 30 },
      { label: "Escalated", pct: 15 },
    ],
    recentActivity: [
      { caller: "Karen Aitken", outcome: "Boiler repair logged", time: "15 min ago" },
      { caller: "Stuart Black", outcome: "Contractor booked", time: "1h ago" },
      { caller: "Pauline Greer", outcome: "Tenancy query resolved", time: "4h ago" },
    ],
  }),
  makeAgent({
    id: "craig",
    name: "Craig",
    role: "Franchise Guide",
    voiceId: "scot-ferrol-02",
    voiceName: "Ferrol — Bright & Friendly",
    vapiAgentId: "Craig_The_Franchise_Guide",
    keywords: ["franchise", "investment", "opportunity", "territory", "discovery"],
    callTags: ["Prospect", "Discovery", "Qualification"],
    firstMessage: "Hi, thanks for calling [Company Name] franchising. I'm Craig — keen to hear what you're looking for!",
    callsHandled: 94,
    callsThisWeek: 11,
    successRate: 79,
    avgDuration: "4m 02s",
    commonOutcomes: [
      { label: "Discovery booked", pct: 44 },
      { label: "Info pack sent", pct: 38 },
      { label: "Not a fit", pct: 18 },
    ],
    recentActivity: [
      { caller: "Derek Logan", outcome: "Discovery booked", time: "25 min ago" },
      { caller: "Yvonne Pratt", outcome: "Info pack sent", time: "2h ago" },
      { caller: "Marc Kerr", outcome: "Discovery booked", time: "7h ago" },
    ],
  }),
  makeAgent({
    id: "bonnie",
    name: "Bonnie",
    role: "Host",
    voiceId: "scot-catriona-02",
    voiceName: "Catriona — Warm & Professional",
    vapiAgentId: "Bonnie_The_Host",
    keywords: ["reservation", "table", "booking", "menu", "event"],
    callTags: ["Reservation", "Event", "Enquiry"],
    firstMessage: "Welcome to [Company Name]! I'm Bonnie — are you calling to book a table or make an enquiry?",
    callsHandled: 412,
    callsThisWeek: 38,
    successRate: 92,
    avgDuration: "1m 54s",
    commonOutcomes: [
      { label: "Reservation made", pct: 67 },
      { label: "Enquiry answered", pct: 21 },
      { label: "Event booked", pct: 12 },
    ],
    recentActivity: [
      { caller: "Dougal Sinclair", outcome: "Table booked", time: "5 min ago" },
      { caller: "Rhona Steel", outcome: "Event enquiry", time: "50 min ago" },
      { caller: "Calum Frew", outcome: "Table booked", time: "3h ago" },
    ],
  }),
  makeAgent({
    id: "skye",
    name: "Skye",
    role: "Style Assistant",
    voiceId: "scot-ailsa-02",
    voiceName: "Ailsa — Calm & Reassuring",
    vapiAgentId: "Skye_The_Style_Assistant",
    keywords: ["styling", "appointment", "personal shopping", "fitting", "wardrobe"],
    callTags: ["Appointment", "Preferences", "Enquiry"],
    firstMessage: "Hi, lovely to hear from you! I'm Skye, your style assistant at [Company Name]. How can I help?",
    callsHandled: 88,
    callsThisWeek: 9,
    successRate: 85,
    avgDuration: "2m 22s",
    commonOutcomes: [
      { label: "Appointment booked", pct: 58 },
      { label: "Preferences captured", pct: 30 },
      { label: "Enquiry answered", pct: 12 },
    ],
    recentActivity: [
      { caller: "Beth Cowan", outcome: "Styling appointment booked", time: "20 min ago" },
      { caller: "Aimee Lyon", outcome: "Preferences captured", time: "2h ago" },
      { caller: "Jade Muir", outcome: "Appointment booked", time: "6h ago" },
    ],
  }),
  makeAgent({
    id: "bob",
    name: "Bob",
    role: "Legacy Agent",
    status: "archived",
    voiceId: "legacy-bob-01",
    voiceName: "Bob — Legacy Voice",
    vapiAgentId: "Bob_Old",
    keywords: ["legacy", "archived"],
    callTags: ["Archived"],
    firstMessage: "Hello, this is Bob. (Archived legacy agent.)",
    callsHandled: 1043,
    callsThisWeek: 0,
    successRate: 71,
    avgDuration: "3m 40s",
    commonOutcomes: [
      { label: "Completed", pct: 71 },
      { label: "Missed", pct: 19 },
      { label: "Voicemail", pct: 10 },
    ],
    recentActivity: [
      { caller: "—", outcome: "Agent archived", time: "Mar 2026" },
    ],
  }),
];

/* ------------------------------------------------------------------ *
 * Calls (rich detail with transcript snippets)
 * ------------------------------------------------------------------ */
function snip(lines: [("caller" | "agent"), string][]): { speaker: "caller" | "agent"; text: string }[] {
  return lines.map(([speaker, text]) => ({ speaker, text }));
}

export const SEED_CALLS: CallDetail[] = [
  {
    id: "c001",
    caller: "Alasdair MacKenzie",
    callerPhone: "+44 7700 900118",
    agent: "Callum",
    agentId: "callum",
    duration: "3m 12s",
    status: "completed",
    time: "Today, 11:42 AM",
    date: "3 Jun 2026",
    outcome: "Lead qualified",
    tags: ["Lead", "Qualification"],
    transcriptSummary: "Caller enquired about remortgaging a buy-to-let. Callum qualified income and equity, then booked an adviser callback for tomorrow morning.",
    snippets: snip([
      ["agent", "Good day, you've reached the office. I'm Callum, your lending specialist. How can I help?"],
      ["caller", "Hi, I'm looking to remortgage a rental flat I own in Glasgow."],
      ["agent", "Happy to help with that. Could I ask roughly what the property's worth and the outstanding balance?"],
      ["caller", "Around £180,000, and I owe about £95,000."],
      ["agent", "Brilliant — that's a healthy bit of equity. I'll book you a callback with one of our advisers for tomorrow at 9am, does that suit?"],
    ]),
  },
  {
    id: "c002",
    caller: "Moira Drummond",
    callerPhone: "+44 7700 900231",
    agent: "Isla",
    agentId: "isla",
    duration: "2m 04s",
    status: "completed",
    time: "Today, 11:18 AM",
    date: "3 Jun 2026",
    outcome: "Renewal booked",
    tags: ["Renewal"],
    transcriptSummary: "Existing customer renewed home insurance policy; Isla confirmed cover details and emailed documents.",
    snippets: snip([
      ["agent", "Hello, thanks for calling. I'm Isla — what can I help you with today?"],
      ["caller", "My home insurance is up for renewal next week."],
      ["agent", "Let me pull that up. Your cover looks the same as last year — shall I renew on the existing terms?"],
      ["caller", "Yes please, that's grand."],
    ]),
  },
  {
    id: "c003",
    caller: "Ruaridh Cameron",
    callerPhone: "+44 7700 900342",
    agent: "Fraser",
    agentId: "fraser",
    duration: "4m 31s",
    status: "transferred",
    time: "Today, 10:55 AM",
    date: "3 Jun 2026",
    outcome: "Transferred to agent",
    tags: ["Viewing", "Transfer"],
    transcriptSummary: "Buyer requested a viewing on a property under offer; Fraser transferred to a senior negotiator to discuss alternatives.",
    snippets: snip([
      ["agent", "Hi there, I'm Fraser — are you looking to buy, sell, or rent?"],
      ["caller", "Buy — the townhouse on Marchmont Road, can I view it?"],
      ["agent", "That one's just gone under offer, but we've two similar nearby. Let me put you through to a negotiator who can talk options."],
    ]),
  },
  {
    id: "c004",
    caller: "Shona McIntyre",
    callerPhone: "+44 7700 900455",
    agent: "Gordon",
    agentId: "gordon",
    duration: "1m 48s",
    status: "completed",
    time: "Today, 10:42 AM",
    date: "3 Jun 2026",
    outcome: "Consultation booked",
    tags: ["Intake", "Consultation"],
    transcriptSummary: "New client enquiry regarding a will; Gordon completed intake and booked a consultation.",
    snippets: snip([
      ["agent", "Good morning, I'm Gordon — how may I assist you today?"],
      ["caller", "I'd like to set up a will."],
      ["agent", "Of course. I can book you a 30-minute consultation with one of our private client solicitors. Are mornings or afternoons better?"],
      ["caller", "Mornings, ideally."],
    ]),
  },
  {
    id: "c005",
    caller: "Dougal Sinclair",
    callerPhone: "+44 7700 900566",
    agent: "Bonnie",
    agentId: "bonnie",
    duration: "0m 52s",
    status: "missed",
    time: "Today, 10:17 AM",
    date: "3 Jun 2026",
    outcome: "Missed — caller hung up",
    tags: ["Reservation"],
    transcriptSummary: "Caller rang during a peak window and disconnected before the greeting completed.",
    snippets: snip([
      ["agent", "Welcome to the restaurant! I'm Bonnie —"],
      ["caller", "(call disconnected)"],
    ]),
  },
  {
    id: "c006",
    caller: "Karen Aitken",
    callerPhone: "+44 7700 900677",
    agent: "Ross",
    agentId: "ross",
    duration: "5m 03s",
    status: "completed",
    time: "Today, 09:58 AM",
    date: "3 Jun 2026",
    outcome: "Maintenance logged",
    tags: ["Maintenance", "Emergency"],
    transcriptSummary: "Tenant reported a broken boiler with no hot water; Ross logged it as urgent and arranged a same-day contractor.",
    snippets: snip([
      ["agent", "Hello, you've reached property management. I'm Ross — how can I help?"],
      ["caller", "My boiler's packed in, there's no hot water at all."],
      ["agent", "I'm sorry to hear that — I'll mark this urgent and get a heating engineer out today. Can you confirm the property address?"],
    ]),
  },
  {
    id: "c007",
    caller: "Eilidh Ross",
    callerPhone: "+44 7700 900788",
    agent: "Grace",
    agentId: "grace",
    duration: "2m 27s",
    status: "voicemail",
    time: "Today, 09:34 AM",
    date: "3 Jun 2026",
    outcome: "Voicemail captured",
    tags: ["Candidate"],
    transcriptSummary: "Candidate left a voicemail regarding interview availability; Grace captured details and flagged for the recruiter.",
    snippets: snip([
      ["agent", "You've reached HR. I'm Grace — please leave your name and message after the tone."],
      ["caller", "Hi, it's Eilidh Ross about my interview — I can do Thursday or Friday afternoon."],
    ]),
  },
  {
    id: "c008",
    caller: "Derek Logan",
    callerPhone: "+44 7700 900899",
    agent: "Craig",
    agentId: "craig",
    duration: "3m 45s",
    status: "completed",
    time: "Today, 09:12 AM",
    date: "3 Jun 2026",
    outcome: "Discovery booked",
    tags: ["Prospect", "Discovery"],
    transcriptSummary: "Prospective franchisee with £50k to invest; Craig qualified interest and booked a discovery call.",
    snippets: snip([
      ["agent", "Hi, thanks for calling franchising. I'm Craig — keen to hear what you're looking for!"],
      ["caller", "I'm interested in opening a branch in Aberdeen."],
      ["agent", "Great territory. Roughly what level of investment are you considering?"],
      ["caller", "Around fifty thousand to start."],
      ["agent", "Perfect — let's get you a discovery call with our development team this week."],
    ]),
  },
  {
    id: "c009",
    caller: "Beth Cowan",
    callerPhone: "+44 7700 900910",
    agent: "Skye",
    agentId: "skye",
    duration: "1m 59s",
    status: "completed",
    time: "Yesterday, 5:48 PM",
    date: "2 Jun 2026",
    outcome: "Appointment booked",
    tags: ["Appointment"],
    transcriptSummary: "Returning client booked a personal styling session and shared colour preferences.",
    snippets: snip([
      ["agent", "Hi, lovely to hear from you! I'm Skye. How can I help?"],
      ["caller", "I'd like to book a styling session before a wedding."],
      ["agent", "How exciting! I've a slot on Saturday at 2pm — and any colours you're drawn to?"],
      ["caller", "Jewel tones, definitely."],
    ]),
  },
  {
    id: "c010",
    caller: "Mairi Gillies",
    callerPhone: "+44 7700 901021",
    agent: "Callum",
    agentId: "callum",
    duration: "6m 14s",
    status: "completed",
    time: "Yesterday, 4:22 PM",
    date: "2 Jun 2026",
    outcome: "Callback booked",
    tags: ["Lead", "Callback"],
    transcriptSummary: "First-time buyer enquiry; Callum explained the process at a high level and booked an adviser callback.",
    snippets: snip([
      ["agent", "Good afternoon, I'm Callum. How can I help?"],
      ["caller", "I'm a first-time buyer and not sure where to start."],
      ["agent", "You're in the right place. I'll book you in with an adviser who'll walk you through it step by step."],
    ]),
  },
];

/* ------------------------------------------------------------------ *
 * Notifications
 * ------------------------------------------------------------------ */
export const SEED_NOTIFICATIONS: Notification[] = [
  { id: "n1", type: "spike", title: "Call volume spike detected", body: "Bonnie handled 38 calls today — 24% above average.", time: "10 min ago", read: false, href: "/analytics" },
  { id: "n2", type: "missed", title: "Missed call alert", body: "Dougal Sinclair's call to Bonnie was missed at 10:17 AM.", time: "1h ago", read: false, href: "/logs" },
  { id: "n3", type: "deployed", title: "Agent deployed successfully", body: "Skye — Style Assistant is now live.", time: "3h ago", read: false, href: "/agents/skye" },
  { id: "n4", type: "kb", title: "Knowledge base updated", body: "Property FAQs synced to Fraser and Ross.", time: "Yesterday", read: true, href: "/agents/fraser" },
  { id: "n5", type: "config", title: "Agent configuration changed", body: "Callum's confidence threshold updated to 0.72.", time: "Yesterday", read: true, href: "/agents/callum" },
  { id: "n6", type: "report", title: "Weekly report generated", body: "Your week of 26 May–1 Jun summary is ready.", time: "2 days ago", read: true, href: "/reports" },
];

/* ------------------------------------------------------------------ *
 * Analytics
 * ------------------------------------------------------------------ */
export const SEED_ANALYTICS: AnalyticsData = {
  callVolume: [
    { day: "Mon", calls: 142 },
    { day: "Tue", calls: 168 },
    { day: "Wed", calls: 151 },
    { day: "Thu", calls: 189 },
    { day: "Fri", calls: 204 },
    { day: "Sat", calls: 96 },
    { day: "Sun", calls: 74 },
  ],
  perAgent: [
    { agent: "Bonnie", calls: 412 },
    { agent: "Callum", calls: 312 },
    { agent: "Grace", calls: 286 },
    { agent: "Isla", calls: 247 },
    { agent: "Fraser", calls: 198 },
    { agent: "Ross", calls: 171 },
    { agent: "Gordon", calls: 156 },
    { agent: "Craig", calls: 94 },
    { agent: "Skye", calls: 88 },
  ],
  successTrend: [
    { week: "W1", rate: 79 },
    { week: "W2", rate: 82 },
    { week: "W3", rate: 84 },
    { week: "W4", rate: 86 },
    { week: "W5", rate: 85 },
    { week: "W6", rate: 88 },
  ],
  durationTrend: [
    { week: "W1", avg: 198 },
    { week: "W2", avg: 192 },
    { week: "W3", avg: 184 },
    { week: "W4", avg: 176 },
    { week: "W5", avg: 171 },
    { week: "W6", avg: 168 },
  ],
  weekly: [
    { label: "Mon", thisWeek: 142, lastWeek: 128 },
    { label: "Tue", thisWeek: 168, lastWeek: 151 },
    { label: "Wed", thisWeek: 151, lastWeek: 149 },
    { label: "Thu", thisWeek: 189, lastWeek: 162 },
    { label: "Fri", thisWeek: 204, lastWeek: 188 },
    { label: "Sat", thisWeek: 96, lastWeek: 102 },
    { label: "Sun", thisWeek: 74, lastWeek: 81 },
  ],
};

/* ------------------------------------------------------------------ *
 * Reports
 * ------------------------------------------------------------------ */
export const SEED_REPORTS: ReportData = {
  weeklySummaries: [
    { label: "Total Calls", value: "1,024", sub: "this week", trend: 8.4 },
    { label: "Success Rate", value: "86%", sub: "avg across agents", trend: 2.1 },
    { label: "Avg Duration", value: "2m 48s", sub: "per call", trend: -3.2 },
    { label: "Booked Outcomes", value: "612", sub: "appointments & callbacks", trend: 11.7 },
  ],
  momComparisons: [
    { metric: "Calls Answered", thisMonth: "4,318", lastMonth: "3,902", trend: 10.7 },
    { metric: "Success Rate", thisMonth: "86%", lastMonth: "83%", trend: 3.6 },
    { metric: "Avg Handle Time", thisMonth: "2m 48s", lastMonth: "2m 59s", trend: -6.1 },
    { metric: "Missed Calls", thisMonth: "184", lastMonth: "241", trend: -23.7 },
  ],
  topAgents: [
    { name: "Bonnie", role: "Host", calls: 412, successRate: 92 },
    { name: "Callum", role: "Lender", calls: 312, successRate: 84 },
    { name: "Grace", role: "HR Assistant", calls: 286, successRate: 88 },
    { name: "Isla", role: "Insurer", calls: 247, successRate: 86 },
    { name: "Ross", role: "Property Manager", calls: 171, successRate: 90 },
  ],
  outcomeBreakdown: [
    { name: "Completed", value: 68, color: "#16A34A" },
    { name: "Transferred", value: 14, color: "#7C3AED" },
    { name: "Voicemail", value: 10, color: "#64748B" },
    { name: "Missed", value: 8, color: "#DC2626" },
  ],
};

/* ------------------------------------------------------------------ *
 * Phone Numbers
 * ------------------------------------------------------------------ */
export const SEED_PHONE_NUMBERS: PhoneNumber[] = [
  { id: "pn1", number: "+44 131 460 1188", provider: "Twilio", region: "Edinburgh, UK", assignedAgent: "Grace", direction: "Inbound", status: "active" },
  { id: "pn2", number: "+44 141 530 2247", provider: "Twilio", region: "Glasgow, UK", assignedAgent: "Callum", direction: "Both", status: "active" },
  { id: "pn3", number: "+44 1224 060 342", provider: "Vapi", region: "Aberdeen, UK", assignedAgent: "Isla", direction: "Inbound", status: "active" },
  { id: "pn4", number: "+44 1382 030 455", provider: "Twilio", region: "Dundee, UK", assignedAgent: "Fraser", direction: "Inbound", status: "active" },
  { id: "pn5", number: "+44 1463 070 566", provider: "Vapi", region: "Inverness, UK", assignedAgent: "Ross", direction: "Both", status: "active" },
  { id: "pn6", number: "+44 131 460 1190", provider: "Twilio", region: "Edinburgh, UK", assignedAgent: "Bonnie", direction: "Inbound", status: "active" },
  { id: "pn7", number: "+44 20 7946 0312", provider: "Vapi", region: "London, UK", assignedAgent: null, direction: "Outbound", status: "idle" },
];

/* ------------------------------------------------------------------ *
 * Tools
 * ------------------------------------------------------------------ */
export const SEED_TOOLS: ToolConfig[] = [
  { id: "t1", name: "Book Appointment", provider: "Google Calendar", category: "Scheduling", description: "Create calendar events and confirm booking slots during a call.", enabled: true },
  { id: "t2", name: "CRM Lookup", provider: "HubSpot", category: "Data", description: "Fetch caller history and contact details from the CRM in real time.", enabled: false },
  { id: "t3", name: "Send Follow-up SMS", provider: "Twilio", category: "Messaging", description: "Send confirmations and reminders by text after the call ends.", enabled: true },
  { id: "t4", name: "Knowledge Base", provider: "Tarsha RAG", category: "Retrieval", description: "Answer questions from your uploaded documents and FAQs.", enabled: true },
  { id: "t5", name: "Transfer Call", provider: "Twilio", category: "Routing", description: "Warm-transfer the caller to a human agent or department.", enabled: true },
  { id: "t6", name: "Take Payment", provider: "Stripe", category: "Payments", description: "Securely capture card payments over the phone (PCI compliant).", enabled: false },
];

/* ------------------------------------------------------------------ *
 * Workflows
 * ------------------------------------------------------------------ */
export const SEED_WORKFLOWS: Workflow[] = [
  { id: "wf1", name: "Appointment Scheduling", description: "Qualifies the request, checks availability, and books a slot end-to-end.", steps: 5, trigger: "Inbound call", status: "active", nodes: ["Greet", "Qualify", "Check availability", "Book slot", "Confirm"] },
  { id: "wf2", name: "Lead Qualification", description: "Scores inbound enquiries and routes hot leads to a human adviser.", steps: 4, trigger: "Inbound call", status: "active", nodes: ["Greet", "Capture details", "Score lead", "Route / book callback"] },
  { id: "wf3", name: "Out-of-Hours Routing", description: "Handles after-hours calls, takes a message, and books a callback.", steps: 3, trigger: "Schedule (after 6pm)", status: "active", nodes: ["Greet", "Capture message", "Schedule callback"] },
  { id: "wf4", name: "Complaint Escalation", description: "Detects sentiment, expresses empathy, and escalates to a manager.", steps: 4, trigger: "Sentiment < 0.3", status: "draft", nodes: ["Detect sentiment", "Acknowledge", "Capture details", "Escalate"] },
];

/* ------------------------------------------------------------------ *
 * Squads
 * ------------------------------------------------------------------ */
export const SEED_SQUADS: Squad[] = [
  { id: "sq1", name: "Property Squad", description: "Front-line property enquiries hand off to property management for tenancy issues.", members: ["Fraser", "Ross"], transferRules: 3, status: "active" },
  { id: "sq2", name: "Advisory Squad", description: "Lending enquiries route to the legal guide for regulated guidance and intake.", members: ["Callum", "Gordon"], transferRules: 2, status: "active" },
  { id: "sq3", name: "Specialist Squad", description: "Insurance reception escalates franchise and commercial enquiries to a specialist.", members: ["Isla", "Craig"], transferRules: 4, status: "active" },
  { id: "sq4", name: "Front Desk Squad", description: "Reception triages callers and hands off to the right specialist.", members: ["Grace", "Bonnie", "Skye"], transferRules: 5, status: "draft" },
];

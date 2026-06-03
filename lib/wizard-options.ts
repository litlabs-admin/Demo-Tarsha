// Rich option sets for the Create Agent wizard.

export interface ProviderOption {
  id: string;
  label: string;
  blurb: string;
  badge: string; // monogram
  color: string; // accent for the monogram
  models: string[];
}

export const LLM_PROVIDERS: ProviderOption[] = [
  {
    id: "Anthropic",
    label: "Anthropic",
    blurb: "Claude — nuanced, safe, great at instructions",
    badge: "A",
    color: "#D97757",
    models: ["claude-opus-4-20250514", "claude-sonnet-4-20250514", "claude-haiku-4"],
  },
  {
    id: "OpenAI",
    label: "OpenAI",
    blurb: "GPT — fast, versatile, widely supported",
    badge: "O",
    color: "#10A37F",
    models: ["gpt-4o", "gpt-4o-mini", "gpt-4.1", "o3-mini"],
  },
  {
    id: "Google",
    label: "Google",
    blurb: "Gemini — long context, multimodal",
    badge: "G",
    color: "#4285F4",
    models: ["gemini-2.0-flash", "gemini-1.5-pro", "gemini-1.5-flash"],
  },
  {
    id: "Groq",
    label: "Groq",
    blurb: "Open models at ultra-low latency",
    badge: "Q",
    color: "#F55036",
    models: ["llama-3.3-70b", "llama-3.1-8b", "mixtral-8x7b"],
  },
  {
    id: "Mistral",
    label: "Mistral",
    blurb: "Efficient European open-weight models",
    badge: "M",
    color: "#FF7000",
    models: ["mistral-large-2", "mistral-small-3", "ministral-8b"],
  },
  {
    id: "xAI",
    label: "xAI",
    blurb: "Grok — real-time, conversational",
    badge: "X",
    color: "#111111",
    models: ["grok-2", "grok-2-mini"],
  },
];

export interface STTProviderOption {
  id: string;
  models: string[];
}

export const STT_PROVIDERS: STTProviderOption[] = [
  { id: "Deepgram", models: ["Nova-3", "Nova-2", "Enhanced", "Base"] },
  { id: "AssemblyAI", models: ["Universal-2", "Best", "Nano"] },
  { id: "OpenAI", models: ["Whisper-1", "gpt-4o-transcribe"] },
  { id: "Gladia", models: ["Solaria-1", "Default"] },
  { id: "Speechmatics", models: ["Ursa", "Enhanced"] },
];

export const LANGUAGES: { value: string; label: string }[] = [
  { value: "en-GB", label: "English (UK)" },
  { value: "en-US", label: "English (US)" },
  { value: "en-IE", label: "English (Ireland)" },
  { value: "en-AU", label: "English (Australia)" },
  { value: "es-ES", label: "Spanish (Spain)" },
  { value: "fr-FR", label: "French" },
  { value: "de-DE", label: "German" },
  { value: "it-IT", label: "Italian" },
  { value: "nl-NL", label: "Dutch" },
  { value: "pt-PT", label: "Portuguese" },
  { value: "pl-PL", label: "Polish" },
];

export const TTS_PROVIDERS: { id: string; blurb: string; badge: string; color: string }[] = [
  { id: "ElevenLabs", blurb: "Most natural, expressive voices", badge: "11", color: "#111111" },
  { id: "Cartesia", blurb: "Ultra-low latency, real-time", badge: "C", color: "#6D4AFF" },
  { id: "PlayHT", blurb: "Large multilingual voice library", badge: "P", color: "#FF5C00" },
  { id: "OpenAI", blurb: "Clean, reliable standard voices", badge: "O", color: "#10A37F" },
  { id: "Deepgram", blurb: "Aura — fast and crisp", badge: "D", color: "#13EF93" },
  { id: "Rime", blurb: "Realistic conversational TTS", badge: "R", color: "#E11D48" },
];

export const ACCENTS = [
  "Scottish",
  "English (RP)",
  "Northern English",
  "Welsh",
  "Irish",
  "Cockney",
  "American",
  "Australian",
];

export interface VoiceOption {
  voiceId: string;
  name: string;
  descriptor: string;
  gender: "Female" | "Male";
  accent: string;
  /** Scottish sub-region label shown in the voice card subtitle */
  region?: string;
  /**
   * Public MP3 preview URL. For ElevenLabs community Scottish voices, retrieve
   * this from GET /v1/shared-voices?accent=scottish using your API key and copy
   * the `preview_url` field for each voice you want to feature.
   */
  previewUrl?: string;
}

export const VOICES: VoiceOption[] = [
  // ── Scottish — trending native voices from ElevenLabs shared library ─────
  {
    // Isla Skye — "Scottish, Soft, and Warm"
    voiceId: "TVmbglAk3F1GkiCoOq47",
    name: "Ailsa",
    descriptor: "Calm & reassuring",
    gender: "Female",
    accent: "Scottish",
    region: "Edinburgh",
    previewUrl: "https://storage.googleapis.com/eleven-public-prod/database/user/6cDV1WImonUwQcaI0lVymsrZGQ52/voices/TVmbglAk3F1GkiCoOq47/32s6eoebELgG3CvTnSUI.mp3",
  },
  {
    // Sophie — "Warm & energetic Glaswegian"
    voiceId: "iePvrB4HtMcAormXZou7",
    name: "Catriona",
    descriptor: "Warm & professional",
    gender: "Female",
    accent: "Scottish",
    region: "Glasgow",
    previewUrl: "https://storage.googleapis.com/eleven-public-prod/database/workspace/d7f1113a0fbf4d048ac84d8b5356329a/voices/iePvrB4HtMcAormXZou7/5a78fedb-da8f-4454-a6eb-8fff43e93a76.mp3",
  },
  {
    // Sean — "Authentic, Proud and Confident"
    voiceId: "ztnpYzQJyWffPj1VC5Uw",
    name: "Malcolm",
    descriptor: "Deep & authoritative",
    gender: "Male",
    accent: "Scottish",
    region: "Highland",
    previewUrl: "https://storage.googleapis.com/eleven-public-prod/database/user/feEym2GpjtR3eSyK1MP4WwIeIFs1/voices/ztnpYzQJyWffPj1VC5Uw/b3def21c-9421-4a3e-a2e7-15627fe96930.mp3",
  },
  {
    // Pete Gates — "Warm & Friendly Glaswegian"
    voiceId: "eVKQybPTL0poBPxBa8L6",
    name: "Ferrol",
    descriptor: "Bright & friendly",
    gender: "Male",
    accent: "Scottish",
    region: "Glasgow",
    previewUrl: "https://storage.googleapis.com/eleven-public-prod/database/workspace/5caf9fd4b2054041aa6a8fc520a922a6/voices/eVKQybPTL0poBPxBa8L6/kp9KmvJCLsPax88jM3Dc.mp3",
  },
  {
    // Mark — "Warm Scottish Narrator"
    voiceId: "pp4ihOlfDr2MgdTALvoR",
    name: "Ewan",
    descriptor: "Steady & practical",
    gender: "Male",
    accent: "Scottish",
    region: "Dundee",
    previewUrl: "https://storage.googleapis.com/eleven-public-prod/database/workspace/4419ed56a73d48e1b3351e5e6c7e57fc/voices/pp4ihOlfDr2MgdTALvoR/bfbef98e-8a6e-416c-b591-b9a8089871e9.mp3",
  },
  { voiceId: "rp-eleanor-01", name: "Eleanor", descriptor: "Polished & poised", gender: "Female", accent: "English (RP)" },
  { voiceId: "rp-james-01", name: "James", descriptor: "Confident & clear", gender: "Male", accent: "English (RP)" },
  { voiceId: "nth-olivia-01", name: "Olivia", descriptor: "Friendly Northern lilt", gender: "Female", accent: "Northern English" },
  { voiceId: "wel-rhys-01", name: "Rhys", descriptor: "Melodic & warm", gender: "Male", accent: "Welsh" },
  { voiceId: "ire-saoirse-01", name: "Saoirse", descriptor: "Soft & lyrical", gender: "Female", accent: "Irish" },
  { voiceId: "us-ava-01", name: "Ava", descriptor: "Upbeat & modern", gender: "Female", accent: "American" },
  { voiceId: "aus-jack-01", name: "Jack", descriptor: "Relaxed & approachable", gender: "Male", accent: "Australian" },
];

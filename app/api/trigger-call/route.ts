import { NextResponse } from "next/server";

const N8N_WEBHOOK_URL =
  "https://n8n.litlabs.agency/webhook/183eb670-6117-4f9b-bcd3-c4912170fed2";

export async function POST(request: Request) {
  let payload: { name?: string; phone?: string; assistant?: string };
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON body" }, { status: 400 });
  }

  const { name, phone, assistant } = payload;
  if (!name || !phone || !assistant) {
    return NextResponse.json(
      { ok: false, error: "name, phone and assistant are required" },
      { status: 400 }
    );
  }

  try {
    const res = await fetch(N8N_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        phone,
        assistant,
        source: "tarsha-demo",
        triggeredAt: new Date().toISOString(),
      }),
    });

    if (!res.ok) {
      return NextResponse.json(
        { ok: false, error: `Webhook responded ${res.status}` },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "Webhook request failed" },
      { status: 502 }
    );
  }
}

import { NextResponse } from "next/server";

type LeadPayload = {
  name?: string;
  company?: string;
  email?: string;
  teamSize?: string;
  role?: string;
  bottleneck?: string;
};

function sanitize(value: unknown) {
  if (typeof value !== "string") return "";
  return value.replace(/[<>]/g, "").trim().slice(0, 1200);
}

export async function POST(request: Request) {
  const payload = (await request.json()) as LeadPayload;

  const data = {
    name: sanitize(payload.name),
    company: sanitize(payload.company),
    email: sanitize(payload.email),
    teamSize: sanitize(payload.teamSize),
    role: sanitize(payload.role),
    bottleneck: sanitize(payload.bottleneck),
  };

  if (!data.name || !data.company || !data.email || !data.teamSize || !data.role || !data.bottleneck) {
    return NextResponse.json({ ok: false, error: "Missing required fields" }, { status: 400 });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    return NextResponse.json({ ok: false, error: "Invalid email" }, { status: 400 });
  }

  console.info("[lead_capture]", data);

  return NextResponse.json({ ok: true });
}

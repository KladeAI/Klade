import { NextResponse } from "next/server";

/* ── Types ── */
type WaitlistPayload = {
  email?: string;
  company?: string;
  honeypot?: string;
};

/* ── Rate limiting (same pattern as /api/lead) ── */
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 5;
const MAX_BODY_BYTES = 4_000;
const MAX_FIELD_LENGTH = 500;
const ipRequests = new Map<string, number[]>();

function jsonNoStore(body: Record<string, unknown>, init?: ResponseInit) {
  const response = NextResponse.json(body, init);
  response.headers.set("Cache-Control", "no-store");
  return response;
}

function sanitize(value: unknown) {
  if (typeof value !== "string") return "";
  return value.replace(/[<>\r\n]/g, "").trim().slice(0, MAX_FIELD_LENGTH);
}

function getClientIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() ?? "unknown";
  return request.headers.get("x-real-ip") ?? "unknown";
}

function checkRateLimit(ip: string) {
  const now = Date.now();
  const recent = (ipRequests.get(ip) ?? []).filter((time) => now - time < RATE_LIMIT_WINDOW_MS);

  if (recent.length >= RATE_LIMIT_MAX_REQUESTS) {
    ipRequests.set(ip, recent);
    return false;
  }

  recent.push(now);
  ipRequests.set(ip, recent);

  if (Math.random() < 0.02) {
    for (const [key, timestamps] of ipRequests.entries()) {
      const active = timestamps.filter((time) => now - time < RATE_LIMIT_WINDOW_MS);
      if (active.length === 0) ipRequests.delete(key);
      else ipRequests.set(key, active);
    }
  }

  return true;
}

/* ── Origin validation (same pattern as /api/lead) ── */
function getAllowedHosts() {
  const env = process.env.ALLOWED_LEAD_ORIGIN_HOSTS ?? "";
  const extra = env
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
  return new Set(["localhost", "127.0.0.1", "kladeai.com", "www.kladeai.com", ...extra]);
}

function hostMatchesAllowlist(host: string, allowlist: Set<string>) {
  return Array.from(allowlist).some((allowed) => host === allowed || host.endsWith(`.${allowed}`));
}

function hasTrustedOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return true;

  try {
    const originUrl = new URL(origin);
    const host = originUrl.hostname.toLowerCase();
    const requestHost = (request.headers.get("host") ?? "").split(":")[0].toLowerCase();
    const allowedHosts = getAllowedHosts();

    if (host.endsWith(".vercel.app") || requestHost.endsWith(".vercel.app")) {
      return host === requestHost;
    }

    if (!hostMatchesAllowlist(host, allowedHosts)) return false;

    const isLocalDev = requestHost === "localhost" || requestHost === "127.0.0.1";
    if (requestHost && !isLocalDev && host !== requestHost) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

/* ── Telegram notification ── */
function escHtml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

async function notifyTelegram(data: { email: string; company: string }) {
  const token = process.env.TG_BOT_TOKEN;
  const chatId = process.env.TG_CHAT_ID;
  if (!token || !chatId) return;

  const text = [
    "🚀 <b>New Waitlist Signup</b>",
    "",
    `<b>Email:</b> ${escHtml(data.email)}`,
    data.company ? `<b>Company:</b> ${escHtml(data.company)}` : "",
    "",
    `<i>Source: kladeai.com waitlist</i>`,
  ]
    .filter(Boolean)
    .join("\n");

  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML" }),
  }).catch(() => {});
}

/* ── Supabase insert ── */
async function storeInSupabase(data: { email: string; company: string }) {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
  if (!url || !key) {
    console.warn("[waitlist] Supabase not configured, skipping DB store");
    return { success: true, duplicate: false };
  }

  const response = await fetch(`${url}/rest/v1/waitlist`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: key,
      Authorization: `Bearer ${key}`,
      Prefer: "return=minimal",
    },
    body: JSON.stringify({
      email: data.email,
      company: data.company || null,
      source: "website",
    }),
  });

  // 409 = duplicate email (UNIQUE constraint) — treat as success
  if (response.status === 409 || response.status === 201 || response.ok) {
    return { success: true, duplicate: response.status === 409 };
  }

  console.error("[waitlist] Supabase insert failed:", response.status, await response.text().catch(() => ""));
  return { success: false, duplicate: false };
}

/* ── POST handler ── */
export async function POST(request: Request) {
  const clientIp = getClientIp(request);

  if (!checkRateLimit(clientIp)) {
    const response = jsonNoStore(
      { success: false, message: "Too many requests. Please try again shortly." },
      { status: 429 }
    );
    response.headers.set("Retry-After", "600");
    return response;
  }

  if (!hasTrustedOrigin(request)) {
    return jsonNoStore({ success: false, message: "Untrusted origin" }, { status: 403 });
  }

  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().includes("application/json")) {
    return jsonNoStore({ success: false, message: "Unsupported content type" }, { status: 415 });
  }

  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > MAX_BODY_BYTES) {
    return jsonNoStore({ success: false, message: "Payload too large" }, { status: 413 });
  }

  let payload: WaitlistPayload;
  try {
    const raw = await request.text();
    if (Buffer.byteLength(raw, "utf8") > MAX_BODY_BYTES) {
      return jsonNoStore({ success: false, message: "Payload too large" }, { status: 413 });
    }
    payload = JSON.parse(raw) as WaitlistPayload;
  } catch {
    return jsonNoStore({ success: false, message: "Invalid request body" }, { status: 400 });
  }

  // Honeypot check
  if (typeof payload.honeypot === "string" && payload.honeypot.trim().length > 0) {
    return jsonNoStore({ success: true, message: "You're on the list!" });
  }

  const email = sanitize(payload.email).toLowerCase();
  const company = sanitize(payload.company);

  if (!email) {
    return jsonNoStore({ success: false, message: "Email is required" }, { status: 400 });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return jsonNoStore({ success: false, message: "Please enter a valid email address" }, { status: 400 });
  }

  // Store in Supabase
  const dbResult = await storeInSupabase({ email, company });

  // Only notify Telegram for new signups (not duplicates)
  if (dbResult.success && !dbResult.duplicate) {
    await notifyTelegram({ email, company });
  }

  console.info("[waitlist]", {
    email,
    company: company || "(none)",
    duplicate: dbResult.duplicate,
    capturedAt: new Date().toISOString(),
    clientIp,
  });

  return jsonNoStore({
    success: true,
    message: "You're on the list! We'll be in touch soon.",
  });
}

export function OPTIONS() {
  const response = new NextResponse(null, { status: 204 });
  response.headers.set("Allow", "POST, OPTIONS");
  response.headers.set("Cache-Control", "no-store");
  return response;
}

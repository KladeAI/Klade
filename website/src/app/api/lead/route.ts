import { NextResponse } from "next/server";

type LeadPayload = {
  name?: string;
  company?: string;
  email?: string;
  teamSize?: string;
  role?: string;
  bottleneck?: string;
  website?: string;
  startedAt?: string;
  consent?: boolean;
};

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 5;
const MAX_BODY_BYTES = 12_000;
const MAX_FIELD_LENGTH = 1200;
const MIN_SUBMIT_SECONDS = 3;
const MAX_FORM_AGE_MS = 48 * 60 * 60 * 1000;
const DUPLICATE_WINDOW_MS = 10 * 60 * 1000;
const ALLOWED_TEAM_SIZES = new Set(["1-5", "6-15", "16-40", "41-100", "100+"]);
const ipRequests = new Map<string, number[]>();
const recentLeadFingerprints = new Map<string, number>();

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

  // periodic cleanup to avoid unbounded in-memory growth in long-lived runtimes
  if (Math.random() < 0.02) {
    for (const [key, timestamps] of ipRequests.entries()) {
      const active = timestamps.filter((time) => now - time < RATE_LIMIT_WINDOW_MS);
      if (active.length === 0) ipRequests.delete(key);
      else ipRequests.set(key, active);
    }
  }

  return true;
}

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

    // Vercel previews must be same-host to prevent any random *.vercel.app origin from posting.
    if (host.endsWith(".vercel.app") || requestHost.endsWith(".vercel.app")) {
      return host === requestHost;
    }

    if (!hostMatchesAllowlist(host, allowedHosts)) return false;

    // Enforce same-host when request host is present and not local dev.
    const isLocalDev = requestHost === "localhost" || requestHost === "127.0.0.1";
    if (requestHost && !isLocalDev && host !== requestHost) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

function isJsonRequest(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";
  return contentType.toLowerCase().includes("application/json");
}

function hasTrustedFetchContext(request: Request) {
  const fetchSite = (request.headers.get("sec-fetch-site") ?? "").toLowerCase();
  const fetchMode = (request.headers.get("sec-fetch-mode") ?? "").toLowerCase();

  const validSite = !fetchSite || fetchSite === "same-origin" || fetchSite === "same-site" || fetchSite === "none";
  const validMode = !fetchMode || fetchMode === "cors" || fetchMode === "same-origin";

  return validSite && validMode;
}

function parseStartedAt(raw: string | undefined) {
  if (!raw) return null;
  const timestamp = Number(raw);
  if (!Number.isFinite(timestamp)) return null;

  const now = Date.now();
  if (timestamp > now || now - timestamp > MAX_FORM_AGE_MS) return null;

  return timestamp;
}

function isTooFastSubmission(startedAt: number) {
  const elapsedSeconds = (Date.now() - startedAt) / 1000;
  return elapsedSeconds < MIN_SUBMIT_SECONDS;
}

function isDuplicateLead(data: { email: string; company: string; role: string }) {
  const now = Date.now();
  const key = `${data.email}|${data.company.toLowerCase()}|${data.role.toLowerCase()}`;

  for (const [fingerprint, seenAt] of recentLeadFingerprints.entries()) {
    if (now - seenAt > DUPLICATE_WINDOW_MS) {
      recentLeadFingerprints.delete(fingerprint);
    }
  }

  const previous = recentLeadFingerprints.get(key);
  recentLeadFingerprints.set(key, now);
  return typeof previous === "number" && now - previous < DUPLICATE_WINDOW_MS;
}

export async function POST(request: Request) {
  const clientIp = getClientIp(request);

  if (!checkRateLimit(clientIp)) {
    const response = jsonNoStore(
      { ok: false, error: "Too many requests. Please try again shortly." },
      { status: 429 }
    );
    response.headers.set("Retry-After", "600");
    return response;
  }

  if (!hasTrustedOrigin(request)) {
    return jsonNoStore({ ok: false, error: "Untrusted origin" }, { status: 403 });
  }

  if (!hasTrustedFetchContext(request)) {
    return jsonNoStore({ ok: false, error: "Untrusted request context" }, { status: 403 });
  }

  if (!isJsonRequest(request)) {
    return jsonNoStore({ ok: false, error: "Unsupported content type" }, { status: 415 });
  }

  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > MAX_BODY_BYTES) {
    return jsonNoStore({ ok: false, error: "Payload too large" }, { status: 413 });
  }

  let payload: LeadPayload;
  try {
    const raw = await request.text();
    if (Buffer.byteLength(raw, "utf8") > MAX_BODY_BYTES) {
      return jsonNoStore({ ok: false, error: "Payload too large" }, { status: 413 });
    }
    payload = JSON.parse(raw) as LeadPayload;
  } catch {
    return jsonNoStore({ ok: false, error: "Invalid request body" }, { status: 400 });
  }

  if (typeof payload.website === "string" && payload.website.trim().length > 0) {
    return jsonNoStore({ ok: true });
  }

  const startedAt = parseStartedAt(payload.startedAt);
  if (startedAt && isTooFastSubmission(startedAt)) {
    return jsonNoStore({ ok: true });
  }

  const data = {
    name: sanitize(payload.name),
    company: sanitize(payload.company),
    email: sanitize(payload.email).toLowerCase(),
    teamSize: sanitize(payload.teamSize),
    role: sanitize(payload.role),
    bottleneck: sanitize(payload.bottleneck),
  };

  if (!data.name || !data.company || !data.email || !data.teamSize || !data.role || !data.bottleneck) {
    return jsonNoStore({ ok: false, error: "Missing required fields" }, { status: 400 });
  }

  if (payload.consent !== true) {
    return jsonNoStore({ ok: false, error: "Consent required" }, { status: 400 });
  }

  if (!ALLOWED_TEAM_SIZES.has(data.teamSize)) {
    return jsonNoStore({ ok: false, error: "Invalid team size" }, { status: 400 });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    return jsonNoStore({ ok: false, error: "Invalid email" }, { status: 400 });
  }

  if (isDuplicateLead({ email: data.email, company: data.company, role: data.role })) {
    return jsonNoStore({ ok: true });
  }

  console.info("[lead_capture]", {
    ...data,
    meta: {
      source: "website-v2",
      capturedAt: new Date().toISOString(),
      clientIp,
      userAgent: request.headers.get("user-agent") ?? "unknown",
      startedAt,
    },
  });

  return jsonNoStore({ ok: true });
}

export function OPTIONS() {
  const response = new NextResponse(null, { status: 204 });
  response.headers.set("Allow", "POST, OPTIONS");
  response.headers.set("Cache-Control", "no-store");
  return response;
}

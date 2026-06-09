import { NextResponse, type NextRequest } from "next/server";

/*
 * SITE KILL SWITCH (added 2026-06-09)
 * ----------------------------------
 * The public site and all signup endpoints (waitlist, lead) are taken offline
 * in response to suspicious waitlist signups. Nothing here touches the page or
 * API source code, so the site can be brought back fully intact.
 *
 * To bring the site back: delete this file and push to main (Vercel redeploys
 * automatically). That's the entire reversal.
 *
 * This proxy runs before every page and API route. Pages get a minimal
 * holding page; API routes get a 503 so no form submission can land.
 */

const HOLDING_PAGE = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="robots" content="noindex, nofollow" />
<title>Klade</title>
<style>
  :root { color-scheme: dark; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { height: 100%; }
  body {
    display: flex; align-items: center; justify-content: center;
    min-height: 100%; padding: 24px;
    background: #0a0a0a; color: #ededed;
    font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif;
    text-align: center; line-height: 1.5;
  }
  .wrap { max-width: 420px; }
  h1 { font-size: 28px; font-weight: 600; letter-spacing: -0.01em; margin-bottom: 14px; }
  p { font-size: 15px; color: #a1a1a1; }
</style>
</head>
<body>
  <div class="wrap">
    <h1>Klade</h1>
    <p>Our site is in private development right now. Check back soon.</p>
  </div>
</body>
</html>`;

export function proxy(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/api")) {
    const res = NextResponse.json(
      { success: false, message: "This service is temporarily unavailable." },
      { status: 503 }
    );
    res.headers.set("Cache-Control", "no-store");
    res.headers.set("Retry-After", "86400");
    return res;
  }

  return new NextResponse(HOLDING_PAGE, {
    status: 503,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
      "Retry-After": "86400",
    },
  });
}

// Match everything except Next's internal static assets so the holding page
// still serves cleanly on every public route.
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

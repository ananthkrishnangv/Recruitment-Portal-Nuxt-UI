import { NextRequest, NextResponse } from "next/server";

/**
 * CSIR-SERC Recruitment Portal — Proxy (Middleware)
 *
 * Security headers, CORS, and route-level logging.
 * Authentication is handled at the layout/page level via session checks,
 * not in proxy, because Prisma cannot run in the Edge runtime.
 */
export function proxy(request: NextRequest) {
  const response = NextResponse.next();
  const { pathname } = request.nextUrl;

  // ── Security Headers (defense-in-depth) ──
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()"
  );

  // ── Request ID for tracing ──
  const requestId = crypto.randomUUID();
  response.headers.set("X-Request-Id", requestId);

  // ── Rate limiting hints for reverse proxy ──
  if (pathname.startsWith("/api/")) {
    response.headers.set("X-RateLimit-Policy", "csir-serc-api");
  }

  // ── Cache control for static assets ──
  if (pathname.startsWith("/_next/static/")) {
    response.headers.set(
      "Cache-Control",
      "public, max-age=31536000, immutable"
    );
  }

  // ── No cache for admin/applicant pages ──
  if (
    pathname.startsWith("/admin/") ||
    pathname.startsWith("/applicant/")
  ) {
    response.headers.set(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, private"
    );
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};

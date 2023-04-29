import { db, shortLink } from "@/server/drizzleDb";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import type { NextRequest, NextFetchEvent } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.cachedFixedWindow(10, "10s"),
  ephemeralCache: new Map(),
  analytics: true,
});

export default async function handler(
  request: NextRequest,
  event: NextFetchEvent
) {
  if (
    request.nextUrl.pathname === "/api/trpc/link.createLink" ||
    request.nextUrl.pathname === "/api/trpc/link.createLinkWithSlug"
  ) {
    const ip = request.ip ?? "127.0.0.1";

    const { success, pending, limit, reset, remaining } = await ratelimit.limit(
      `ratelimit_middleware_${ip}`
    );
    event.waitUntil(pending);

    if (!success) {
      const res = NextResponse.redirect(new URL("/api/blocked", request.url));
      res.headers.set("X-RateLimit-Limit", limit.toString());
      res.headers.set("X-RateLimit-Remaining", remaining.toString());
      res.headers.set("X-RateLimit-Reset", reset.toString());
      return res;
    }
  }

  const split = request.nextUrl.pathname.split("/");
  console.log("split", split);
  if (request.nextUrl.pathname === "/" || split[1] === "api") {
    return;
  }

  const slug = split.pop();
  if (!slug || typeof slug !== "string") {
    return;
  }

  const [data] = await db
    .select()
    .from(shortLink)
    .where(eq(shortLink.slug, slug));

  if (!data) {
    return NextResponse.redirect(request.nextUrl.origin);
  }

  return NextResponse.redirect(data.url);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};

import { db } from "@/server/db";
import { shortLinks } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default async function handler(request: NextRequest) {
  const split = request.nextUrl.pathname.split("/");
  if (request.nextUrl.pathname === "/" || split[1] === "api") {
    return;
  }

  const slug = split.pop();
  if (!slug || typeof slug !== "string") {
    return;
  }

  const [data] = await db
    .select()
    .from(shortLinks)
    .where(eq(shortLinks.slug, slug));

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

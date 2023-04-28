import { db, shortLink } from "@/server/drizzleDb";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export default async function handler(req: NextRequest, res: NextResponse) {
  if (req.nextUrl.pathname === "/") {
    return;
  }

  const slug = req.nextUrl.pathname.split("/").pop();
  if (!slug || typeof slug !== "string") {
    return;
  }

  const [data] = await db
    .select()
    .from(shortLink)
    .where(eq(shortLink.slug, slug));

  if (!data) {
    return NextResponse.redirect(req.nextUrl.origin);
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
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};

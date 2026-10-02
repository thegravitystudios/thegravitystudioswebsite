import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(req: NextRequest) {
  const url = req.nextUrl.clone();
  const hostname = req.headers.get("host") || "";

  // Check if request is coming from portal.thegravitystudios.com
  if (hostname.startsWith("portal.")) {
    if (
      !url.pathname.startsWith("/portal") &&
      !url.pathname.startsWith("/api") &&
      !url.pathname.startsWith("/_next")
    ) {
      url.pathname = url.pathname === "/" ? "/portal" : `/portal${url.pathname}`;
      return NextResponse.rewrite(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

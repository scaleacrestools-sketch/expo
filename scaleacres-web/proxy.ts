import { NextResponse, type NextRequest } from "next/server";
import { isProductionHost } from "@/lib/env";

/** Adds noindex to every response served on a non-production host (staging protection). */
export function proxy(req: NextRequest) {
  const res = NextResponse.next();
  if (!isProductionHost(req.headers.get("host"))) {
    res.headers.set("X-Robots-Tag", "noindex, nofollow");
  }
  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};

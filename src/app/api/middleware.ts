import { NextRequest, NextResponse } from "next/server";
import { createSupabaseReqResClient } from "@/utils/supabase/server";
// import { User } from "@supabase/supabase-js";
import logger from "@/utils/logger";

// ✅ In-Memory Rate Limiting
const rateLimitMap = new Map<string, { count: number; lastRequest: number }>();
const RATE_LIMIT = { maxRequests: 10, timeWindow: 60 * 1000 }; // 10 requests per minute

// ✅ Role Hierarchy (Admins inherit all permissions)
// const ROLE_HIERARCHY: Record<string, string[]> = {
//   admin: ["admin", "gamemaster", "member"],
//   gamemaster: ["gamemaster", "member"],
//   member: ["member"],
// };

// Function to safely extract IP from request headers
const getClientIp = (req: NextRequest): string => {
  // Try to get IP from standard "x-forwarded-for" header (proxy-aware)
  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim(); // Take the first IP in the list
  }

  // Fallback for environments without a proxy
  return req.headers.get("cf-connecting-ip") || "127.0.0.1"; // Default to localhost for safety
};

// ✅ Authentication Middleware
export async function middleware(req: NextRequest) {
  const requestId = crypto.randomUUID();
  const ip = getClientIp(req);

  // ✅ Rate Limiting
  const rateLimitKey = `${ip}-${req.nextUrl.pathname}`;
  const now = Date.now();
  const rateData = rateLimitMap.get(rateLimitKey);

  if (rateData && now - rateData.lastRequest < RATE_LIMIT.timeWindow) {
    rateData.count += 1;
    if (rateData.count > RATE_LIMIT.maxRequests) {
      logger.warn(`[${requestId}] Rate limit exceeded for IP: ${ip}`);
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }
  } else {
    rateLimitMap.set(rateLimitKey, { count: 1, lastRequest: now });
  }

  // ✅ Create Supabase Server Client
  const supabase = await createSupabaseReqResClient(req, new NextResponse());
  // ✅ Authenticate User
  const {
    data: { session },
    error: authError,
  } = await supabase.auth.getSession();

  if (authError || !session?.user) {
    logger.warn(`[${requestId}] Unauthorized request`);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // ✅ Attach user to request headers (so it's accessible in route handlers)
  const headers = new Headers(req.headers);
  headers.set("x-user-id", session.user.id);
  headers.set("x-user-email", session.user.email ?? "");

  return NextResponse.next({ headers });
}

// ✅ Apply middleware only to `/app/api/`
export const config = {
  matcher: "/app/api/:path*",
};

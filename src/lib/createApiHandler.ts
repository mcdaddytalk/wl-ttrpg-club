import { NextRequest, NextResponse } from "next/server";
// import { z } from "zod";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import { User } from "@supabase/supabase-js";
import logger from "@/utils/logger";

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
 
// ✅ Rate limiting: Simple in-memory store (consider Redis for production)
const rateLimitMap = new Map<string, { count: number; lastRequest: number }>();
const RATE_LIMIT = { maxRequests: 10, timeWindow: 60 * 1000 }; // 10 requests per minute

// ✅ Role Hierarchy for RBAC
const ROLE_HIERARCHY: Record<string, string[]> = {
  admin: ["admin", "gamemaster", "member"], // Admin inherits all
  gamemaster: ["gamemaster", "member"], // Gamemasters can do what members can
  member: ["member"], // Members have standard access
};

/**
 * Wrapper function for API handlers to ensure consistent error handling and authentication enforcement.
 * @param handler The API route function to execute.
 */
export function createApiHandler<U,T>(
    handler: (context: ApiContext<T>) => Promise<NextResponse<U>>,
    options: ApiOptions = {}
) {  
  return async (req: NextRequest, params?: Promise<T>): Promise<NextResponse<unknown | U>> => {
    const requestId = crypto.randomUUID(); // Generate a unique request ID
    const ip = getClientIp(req);
    const requestPath = req.url;
    const rateLimitKey = `${ip}-${requestPath}`;
    let user = null;
    
    const supabase = await createSupabaseServerClient();
    try {

        // ✅ Rate Limiting
      if (options.rateLimit) {
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
      }

      // ✅ Authentication Handling
      if (options.requireAuth) {
        const {
          data: { session },
          error: authError,
        } = await supabase.auth.getSession();

        if (authError || !session?.user) {
          logger.warn(`[${requestId}] Unauthorized request`);
          return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        user = session.user;
        logger.info(`[${requestId}] API call by user ${user.id} (${user.email})`, { path: req.url });
      }
      
      // ✅ Role-Based Access Control (RBAC)
      if (options.requiredRoles && user) {
        const { data: roles, error: rolesError } = await supabase
          .from("member_roles")
          .select("roles(name)")
          .eq("member_id", user.id);

        if (rolesError) throw rolesError;

        const userRoles = roles.map((r) => r.roles.name);
        const effectiveRoles = new Set<string>();

        userRoles.forEach((role) => {
          if (ROLE_HIERARCHY[role]) {
            ROLE_HIERARCHY[role].forEach((inheritedRole) => effectiveRoles.add(inheritedRole));
          }
        });

        const hasPermission = options.requiredRoles.some((role) => effectiveRoles.has(role));

        if (!hasPermission) {
          logger.warn(`[${requestId}] Permission denied for ${user.email}`, { requiredRoles: options.requiredRoles });
          return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }
      }

      // Execute the actual API function with parsed request data
      const response = await handler({
        req,
        auth: user ? { user } : null,
        params,
      });

      return NextResponse.json(response, { status: 200 });
    } catch (error: unknown) {
        logger.error(`[${requestId}] API Error: ${(error as Error).message}`, { stack: (error as Error).stack });
        return NextResponse.json(
          { error: (error as Error).message || "An unexpected error occurred" },
          { status: 500 }
        );
    }
  };
}

/**
 * Context passed to API handlers, ensuring authentication and structured request data.
 */
export type ApiContext<T> = {
  req: NextRequest;
  auth: { user: User } | null;
  params?: Promise<T>;
};

/**
 * API Options:
 * - `requiredRoles` (optional) - Array of roles required to access the endpoint.
 */
export type ApiOptions = {
    requireAuth?: boolean;
    requiredRoles?: string[];
    rateLimit?: boolean;
};

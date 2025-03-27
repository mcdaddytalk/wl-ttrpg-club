import { NextRequest , NextResponse} from "next/server"
import { updateSession } from "@/utils/supabase/middleware"
// import { createSupabaseReqResClient } from "./utils/supabase/server"
import { getInitialSession } from "./server/authActions"
import logger from "@/utils/logger"
import { getClientIp, RATE_LIMIT } from "./utils/helpers"
// import logger from "@/utils/logger"
// import { RoleData, SupabaseRoleListResponse } from "./lib/types/custom";

const protectedApiRoutes = [
  '/api/admin',
  '/api/broadcasts',
  '/api/contacts',
  '/api/gamemaster',
  '/api/games',
  '/api/locations',
  '/api/members',
  '/api/messages',
  '/api/messaging',
  '/api/roles',  
]

const rateLimitMap = new Map<string, { count: number; lastRequest: number }>();

export async function middleware(request: NextRequest) {
  await updateSession(request)
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });
 
  const { session } = await getInitialSession();

  if (protectedApiRoutes.some((path) => request.nextUrl.pathname.startsWith(path))) {
    const requestId = crypto.randomUUID();
    const ip = getClientIp(request);
    logger.debug(`[${requestId}] Incoming request from IP: ${ip}`);

    // ✅ Rate Limiting
    const rateLimitKey = `${ip}-${request.nextUrl.pathname}`;
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

    const token = session?.access_token
    // logger.debug('TOKEN', token)
    if (!token) {
      logger.error(`Unauthorized API request: ${request.nextUrl.pathname}`)
      // logger.error(`Unauthorized API request: ${request.nextUrl.pathname}`)
      response.headers.set('Authorization', '')
      return new NextResponse('unauthorized', { status: 401 })
    }
    const headers = new Headers(request.headers)
    headers.set("x-user-id", session.user.id);
    headers.set("x-user-email", session.user.email ?? "");
    headers.set('Authorization', `Bearer ${token}`);

    return NextResponse.next({ headers })
  }

  const url = request.nextUrl;
  
  // const { data: roleData, error: roleError } = await supabase.from('member_roles').select('roles(id, name)').eq('member_id', user?.id) as unknown as SupabaseRoleListResponse;
  // if (roleError) {
  //   logger.error('ROLE ERROR ', roleError)
  // }
  // if (!roleData) {
  //   logger.error('NO ROLE DATA ', roleData)
  // }
  
  // const roles = roleData ? (roleData as RoleData[])?.map((role) => role.roles.name) : [];
  
  let roles: string[] = [];
  if (session) {
    roles = session.user.user_metadata.roles || [];
  }

  // Role based redirect
  // Array of restricted paths and role requirements
  const restrictedPaths = [
    { path: '/member', role: 'member' },
    { path: '/games', role: ['member', 'gamemaster', 'admin'] },
    { path: '/gamemaster', role: ['admin', 'gamemaster'] },
    { path: '/admin', role: 'admin' },
    { path: '/account', role: 'superadmin' }
  ];

  // Check if the current path is restricted
  for (const restricted of restrictedPaths) {
    if (url.pathname.startsWith(restricted.path)) {
      // Role check for the current restricted path
      const requiredRoles = Array.isArray(restricted.role) ? restricted.role : [restricted.role];
      if (!roles || !roles.some(role => requiredRoles.includes(role))) {
        return NextResponse.redirect(new URL('/unauthorized', url));
      }
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
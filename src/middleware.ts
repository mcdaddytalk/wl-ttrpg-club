import { NextRequest , NextResponse} from "next/server"
import { updateSession } from "@/utils/supabase/middleware"
import { getInitialSession } from "./server/authActions"
import logger from "@/utils/logger"
import { getClientIp, RATE_LIMIT } from "./utils/helpers"
import { createClient } from "@supabase/supabase-js"

// ====== CONFIG ======
const LOGIN_PATH = '/login';
const CALLBACK_PATHS = ['/auth/callback', '/verify-email', '/reset-password'];
const PUBLIC_PATHS = new Set<string>([
  '/', LOGIN_PATH, ...CALLBACK_PATHS,
  '/about', '/contact', // (add any other fully public pages)
]);

const PROTECTED_PAGE_PREFIXES = [
  '/member',
  '/gamemaster',
  '/admin',
  '/games',        // adjust if some games pages are public
];

const PROTECTED_API_PREFIXES = [
  '/api/admin',
  '/api/broadcasts',
  '/api/gamemaster',
  '/api/games',
  '/api/locations',
  '/api/members',
  '/api/messages',
  '/api/messaging',
  '/api/roles',
];

// ====== RATE-LIMIT MEMORY MAP (your existing) ======
const rateLimitMap = new Map<string, { count: number; lastRequest: number }>();

function isPathMatch(pathname: string, prefixes: string[]) {
  return prefixes.some((p) => pathname === p || pathname.startsWith(p + '/'));
}

function isPublicPath(pathname: string) {
  if (pathname === '/' || PUBLIC_PATHS.has(pathname)) return true;
  if (CALLBACK_PATHS.some((p) => pathname === p || pathname.startsWith(p + '/'))) return true;
  if (pathname.startsWith('/_next/')) return true;
  if (pathname.startsWith('/.well-known/')) return true;
  if (pathname === '/robots.txt' || pathname === '/sitemap.xml' || pathname === '/manifest.json') return true;
  return false;
}

function buildLoginRedirectURL(req: NextRequest, toPath: string) {
  const url = req.nextUrl.clone();
  url.pathname = LOGIN_PATH;
  const fullTarget = toPath + (req.nextUrl.search || '');
  url.search = `?redirect=${encodeURIComponent(fullTarget)}`;
  return url;
}

export async function middleware(request: NextRequest) {
  // Let Supabase update/refresh cookies. Use its response as a base.
  const supaResp = await updateSession(request);

  // ===== 1) PROTECTED API HANDLING (unchanged, but using supaResp.headers) =====
  if (isPathMatch(request.nextUrl.pathname, PROTECTED_API_PREFIXES)) {
    const response = NextResponse.next({ request: { headers: request.headers } });

    // Copy any Set-Cookie etc. from updateSession into this API response
    supaResp.headers.forEach((val, key) => {
      if (key.toLowerCase() === 'set-cookie') {
        response.headers.append('set-cookie', val);
      } else {
        response.headers.set(key, val);
      }
    });

    const { session } = await getInitialSession();

    const { pathname } = request.nextUrl;
    logger.debug('MW hit', {
      pathname,
      isPublic: isPublicPath(pathname),
      isProtectedPage: isPathMatch(pathname, PROTECTED_PAGE_PREFIXES),
      hasSession: !!session,
    });

    // Rate limiting (as you had)
    const requestId = crypto.randomUUID();
    const ip = getClientIp(request);
    logger.debug(`[${requestId}] Incoming request from IP: ${ip}`);

    const rateLimitKey = `${ip}-${request.nextUrl.pathname}`;
    const now = Date.now();
    const rateData = rateLimitMap.get(rateLimitKey);
    if (rateData && now - rateData.lastRequest < RATE_LIMIT.timeWindow) {
      rateData.count += 1;
      if (rateData.count > RATE_LIMIT.maxRequests) {
        logger.warn(`[${requestId}] Rate limit exceeded for IP: ${ip}`);
        return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
      }
    } else {
      rateLimitMap.set(rateLimitKey, { count: 1, lastRequest: now });
    }

    const token = session?.access_token;
    if (!token) {
      logger.error(`Unauthorized API request: ${request.nextUrl.pathname}`);
      response.headers.set('Authorization', '');
      return new NextResponse('unauthorized', { status: 401 });
    }

    const headers = new Headers(request.headers);
    headers.set('x-user-id', session.user.id);
    headers.set('x-user-email', session.user.email ?? '');
    headers.set('Authorization', `Bearer ${token}`);

    return NextResponse.next({ headers });
  }

  // ===== 2) PAGE ROUTES: SESSION & REDIRECT LOGIC =====
  const { session } = await getInitialSession();
  const { pathname } = request.nextUrl;

  logger.debug('MW hit', {
    pathname,
    isPublic: isPublicPath(pathname),
    isProtectedPage: isPathMatch(pathname, PROTECTED_PAGE_PREFIXES),
    hasSession: !!session,
  });

  // If the route is public, just pass through with the supabase-updated response.
  if (isPublicPath(pathname)) {
    logger.debug('MW PublicPath Hit', {
      pathname,
      isPublic: isPublicPath(pathname),
      isProtectedPage: isPathMatch(pathname, PROTECTED_PAGE_PREFIXES),
      hasSession: !!session,
    });
    return supaResp;
  }

  // If the path is a protected page and user is NOT logged in -> redirect to /login?redirect=<full-path>
  if (isPathMatch(pathname, PROTECTED_PAGE_PREFIXES) && !session) {
    const loginURL = buildLoginRedirectURL(request, pathname);
    return NextResponse.redirect(loginURL);
  }

  if (isPathMatch(pathname, PROTECTED_PAGE_PREFIXES) && session) {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { global: { headers: { Authorization: `Bearer ${session?.access_token}` } } }
    ) 

    const { data: m } = await supabase
      .from('members')
      .select('status')
      .eq('id', session?.user.id)
      .single();

    if (m?.status === 'soft_deleted' && !pathname.startsWith('/member/account')) {
      const url = request.nextUrl.clone();
      url.pathname = '/member/account';
      url.searchParams.set('restore', '1');
      return NextResponse.redirect(url);
    }
  }

  // ===== 3) ROLE-BASED GATING (same logic as yours, after we know we have a session) =====
  let roles: string[] = [];
  if (session) {
    roles = session.user.user_metadata.roles || [];
  }

  const restrictedPaths = [
    { path: '/member', role: 'member' },
    { path: '/games', role: ['member', 'gamemaster', 'admin'] },
    { path: '/gamemaster', role: ['admin', 'gamemaster'] },
    { path: '/admin', role: 'admin' },
    { path: '/account', role: 'superadmin' },
  ];

  for (const restricted of restrictedPaths) {
    if (pathname === restricted.path || pathname.startsWith(restricted.path + '/')) {
      const requiredRoles = Array.isArray(restricted.role) ? restricted.role : [restricted.role];
      if (!roles.some((r) => requiredRoles.includes(r))) {
        const url = request.nextUrl.clone();
        url.pathname = '/unauthorized';
        url.search = '';
        return NextResponse.redirect(url);
      }
    }
  }

  // Pass through with supabase-updated response (keeps Set-Cookie headers)
  return supaResp;
}

export const config = {
  matcher: [
    // Match everything except Next internals & static assets (your existing pattern)
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|manifest.json|\\.well-known/|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

import { NextRequest , NextResponse} from "next/server"
import { updateSession } from "@/utils/supabase/middleware"
import { getInitialSession } from "./server/authActions"
import logger from "@/utils/logger"
import { getClientIp, PUBLIC_RATE_LIMIT, RATE_LIMIT, rateLimitMap } from "./utils/helpers"
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

const PUBLIC_API_EXCEPTIONS = [
  '/api/messaging/new-contact',
  '/api/messaging/contact-us',
];

const TOUCH_COOKIE = "last_login_touched_at";
const TOUCH_INTERVAL_MS = 60 * 60 * 1000; // 1 hour

let lastSweep = Date.now();
function maybeSweep() {
  const now = Date.now();
  if (now - lastSweep < 5 * 60_000) return; // every 5 min
  lastSweep = now;
  for (const [k, v] of rateLimitMap.entries()) {
    if (now - v.windowStart > 10 * 60_000) rateLimitMap.delete(k);
  }
}

function isPathMatch(pathname: string, prefixes: string[]) {
  return prefixes.some((p) => pathname === p || pathname.startsWith(p + '/'));
}

function isApiPath(pathname: string) {
  return pathname === '/api' || pathname.startsWith('/api/');
}

// Build a stable key: IP + path
function makeRateKeyPublicApi(ip: string, method: string, pathname: string) {
  // If you want coarser limiting (per-IP across all public API), drop pathname
  return `pubapi:${ip}:${method}:${pathname}`;
}

function hitPublicApiLimiter(key: string) {
  const now = Date.now();
  const entry = rateLimitMap.get(key);

  if (!entry) {
    rateLimitMap.set(key, { count: 1, windowStart: now });
    return { allowed: true, remaining: PUBLIC_RATE_LIMIT.maxRequests - 1, resetInMs: PUBLIC_RATE_LIMIT.timeWindow };
  }

  // new window?
  if (now - entry.windowStart >= PUBLIC_RATE_LIMIT.timeWindow) {
    entry.count = 1;
    entry.windowStart = now;
    return { allowed: true, remaining: PUBLIC_RATE_LIMIT.maxRequests - 1, resetInMs: PUBLIC_RATE_LIMIT.timeWindow };
  }

  // same window
  entry.count += 1;
  const remaining = Math.max(PUBLIC_RATE_LIMIT.maxRequests - entry.count, 0);
  const resetInMs = PUBLIC_RATE_LIMIT.timeWindow - (now - entry.windowStart);

  maybeSweep();

  return { allowed: entry.count <= PUBLIC_RATE_LIMIT.maxRequests, remaining, resetInMs };
}

function isProtectedApi(pathname: string) {
  if (PUBLIC_API_EXCEPTIONS.some((p) => pathname === p || pathname.startsWith(p + '/'))) {
    return false;
  }
  return isPathMatch(pathname, PROTECTED_API_PREFIXES);
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
  const { pathname } = request.nextUrl;

  // Apply rate limit to PUBLIC API endpoints only
  if (isApiPath(pathname) && !isProtectedApi(pathname)) {
    const ip = getClientIp(request);        // your helper already exists
    const key = makeRateKeyPublicApi(ip, request.method, pathname);
    const { allowed, remaining, resetInMs } = hitPublicApiLimiter(key);

    if (!allowed) {
      const retryAfter = Math.ceil(resetInMs / 1000).toString();
      const res = NextResponse.json({ error: 'Too many requests' }, { status: 429 });
      res.headers.set('Retry-After', retryAfter);
      // Optional visibility for diagnostics:
      res.headers.set('X-RateLimit-Limit', String(PUBLIC_RATE_LIMIT.maxRequests));
      res.headers.set('X-RateLimit-Remaining', '0');
      return res;
    } else {
      // (Optional) add rate headers for observability
      const res = NextResponse.next();
      res.headers.set('X-RateLimit-Limit', String(PUBLIC_RATE_LIMIT.maxRequests));
      res.headers.set('X-RateLimit-Remaining', String(remaining));
      // If you need the Set-Cookie from supaResp, merge it (same as you do below):
      supaResp.headers.forEach((val, key) => {
        if (key.toLowerCase() === 'set-cookie') res.headers.append('set-cookie', val);
      });
      return res;
    }
  }

  // ===== 1) PROTECTED API HANDLING (unchanged, but using supaResp.headers) =====
  if (isProtectedApi(pathname)) {
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

    if (session) {
      const touchedAtRaw = request.cookies.get(TOUCH_COOKIE)?.value;
      const touchedAt = touchedAtRaw ? Number(touchedAtRaw) : 0;
      const now = Date.now();
      const stale = !touchedAt || now - touchedAt > TOUCH_INTERVAL_MS;

      if (stale) {
        const headers: Record<string, string> = {};
        if (session.access_token) headers.Authorization = `Bearer ${session.access_token}`;

        // You can also send the incoming cookies if you prefer cookie auth:
        // const cookieHeader = request.headers.get("cookie");
        // if (cookieHeader) headers.cookie = cookieHeader;

        // Fire-and-forget; don’t block
        fetch(new URL("/api/auth/touch", request.url), {
          method: "POST",
          headers,
          cache: "no-store",
        }).catch(() => {});

        supaResp.cookies.set(TOUCH_COOKIE, String(now), {
          httpOnly: true,
          sameSite: "lax",
          path: "/",
          maxAge: TOUCH_INTERVAL_MS / 1000,
        });
      }
    }

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

    const rateLimitKey = `protapi:${ip}:${request.method}:${pathname}`;
    const now = Date.now();
    const rateData = rateLimitMap.get(rateLimitKey);
    if (!rateData || now - rateData.windowStart >= RATE_LIMIT.timeWindow) {
      rateLimitMap.set(rateLimitKey, { count: 1, windowStart: now });
    } else {
      rateData.count += 1;
      if (rateData.count > RATE_LIMIT.maxRequests) {
        logger.warn(`[${requestId}] Rate limit exceeded for IP: ${ip} Path: ${pathname}`);
        return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
      }
      maybeSweep();
    }

    const token = session?.access_token;
    if (!token) {
      logger.error(`Unauthorized API request: ${request.nextUrl.pathname}`);
      response.headers.set('Authorization', '');
      return new NextResponse('unauthorized', { status: 401 });
    }

    response.headers.set('x-user-id', session.user.id);
    response.headers.set('x-user-email', session.user.email ?? '');
    response.headers.set('Authorization', `Bearer ${token}`);

    return response;
  }

  // ===== 2) PAGE ROUTES: SESSION & REDIRECT LOGIC =====
  const { session } = await getInitialSession();
  
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

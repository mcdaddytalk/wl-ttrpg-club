import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/utils/supabase/server'
import { AuthError } from '@supabase/supabase-js'
import logger from '@/utils/logger'
import { ENVS } from "@/utils/constants/envs"

function getSafeNext(request: Request, target: string | null): string {
  // Default landing if something is off
  const FALLBACK = '/member/dashboard';

  try {
    const reqUrl = new URL(request.url);
    // Support both ?next= and ?redirect=
    const raw = target || FALLBACK;

    // Build absolute URL relative to this origin, then enforce same-origin
    const abs = new URL(raw, reqUrl.origin);
    if (abs.origin !== reqUrl.origin) return FALLBACK; // prevent open redirect

    // Preserve path + query + hash (e.g., /member/messages?tab=unread#top)
    return abs.pathname + abs.search + abs.hash || FALLBACK;
  } catch {
    return FALLBACK;
  }
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const { searchParams, origin } = url;
  logger.debug('GET /auth/callback');

  const code = searchParams.get('code')
  const providerError = searchParams.get('error');
  const providerErrorDesc = searchParams.get('error_description');
  const nextParam = searchParams.get('next') ?? searchParams.get('redirect'); // support both
  const next = getSafeNext(request, nextParam);

  // If the provider redirected back with an error, send the user to login with context.
  if (providerError) {
    const loginUrl = new URL('/login', origin);
    loginUrl.searchParams.set('error', providerErrorDesc || providerError);
    loginUrl.searchParams.set('redirect', next);
    return NextResponse.redirect(loginUrl);
  }

  if (code) {
    const supabase = await createSupabaseServerClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      const forwardedHost = request.headers.get('x-forwarded-host') // original origin before load balancer
      const isLocalEnv = ENVS.IS_DEV
      logger.debug('isLocalEnv', isLocalEnv)
    
      if (isLocalEnv) {
        logger.debug('redirecting to', `${origin}${next}`)
        return NextResponse.redirect(`${origin}${next}`)
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`)
      } else {
        return NextResponse.redirect(`${origin}${next}`)
      }
    }
    
    if (error instanceof AuthError) {
        logger.error(error.message)
    } else {
        logger.error(String(error))
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}
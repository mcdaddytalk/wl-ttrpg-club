import { NextResponse } from 'next/server'
// The client you created from the Server-Side Auth instructions
import { createSupabaseServerClient } from '@/utils/supabase/server'
import { AuthError } from '@supabase/supabase-js'
import logger from '@/utils/logger'
import { ENVS } from "@/utils/constants/envs"

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  logger.debug('GET /auth/callback')
// logger.log(searchParams)
  const code = searchParams.get('code')
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = await createSupabaseServerClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      const forwardedHost = request.headers.get('x-forwarded-host') // original origin before load balancer
      const isLocalEnv = ENVS.IS_DEV
      logger.debug('isLocalEnv', isLocalEnv)
      if (isLocalEnv) {
        logger.debug('redirecting to', `${origin}${next}`)
        // we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
        return NextResponse.redirect(`${origin}${next}`)
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`)
      } else {
        return NextResponse.redirect(`${origin}${next}`)
      }
    } else {
      if (error instanceof AuthError) {
        logger.error(error.message)
      }
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}
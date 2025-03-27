// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { createServerClient, type CookieOptions } from "@supabase/ssr"
import { type NextRequest, type NextResponse } from "next/server"
import { cookies } from "next/headers"
import { Database } from "@/lib/types/supabase"
import { ENVS } from "@/utils/constants/envs"



// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function createSupabaseServerClient(component: boolean = false) {
  const cookieStore = await cookies()

  return createServerClient<Database>(
    ENVS.NEXT_PUBLIC_SUPABASE_URL!,
    ENVS.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}

export async function createSupabaseServerComponentClient() {
  const cookieStore = await cookies()
  cookieStore.getAll();
  return createSupabaseServerClient(true);
}

export async function createSupabaseReqResClient(
  req: NextRequest,
  res: NextResponse
) {
  const cookieStore = await cookies()
  cookieStore.getAll();
  return createServerClient(
    ENVS.NEXT_PUBLIC_SUPABASE_URL!,
    ENVS.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            res.cookies.set(name, value, options)
          );
        },
      },
    }
  );
}
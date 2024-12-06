import { NextRequest , NextResponse} from "next/server"
import { updateSession } from "@/utils/supabase/middleware"
import { createSupabaseReqResClient } from "./utils/supabase/server"
import { RoleData, SupabaseRoleListResponse } from "./lib/types/custom";

export async function middleware(request: NextRequest) {
  await updateSession(request)
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = await createSupabaseReqResClient(request, response)

  const { data: { user }, error } = await supabase.auth.getUser()
  const { data: { session } } = await supabase.auth.getSession()

  if (error || !user || !session) {
      // if (error) console.error('AUTH ERROR ', error)
      // if (!user) console.error('NO USER DATA ')
      return NextResponse.next()
  }
  
  const url = request.nextUrl;
  
  const { data: roleData, error: roleError } = await supabase.from('member_roles').select('roles(id, name)').eq('member_id', user?.id) as unknown as SupabaseRoleListResponse;
  if (roleError) {
    console.error('ROLE ERROR ', roleError)
  }
  if (!roleData) {
    console.error('NO ROLE DATA ', roleData)
  }
  
  const roles = roleData ? (roleData as RoleData[])?.map((role) => role.roles.name) : [];
  
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
      if (!roles.some(role => requiredRoles.includes(role))) {
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
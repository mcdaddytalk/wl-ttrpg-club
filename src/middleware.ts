import { NextRequest , NextResponse} from "next/server"
import { updateSession } from "@/utils/supabase/middleware"
// import { createSupabaseReqResClient } from "./utils/supabase/server"
import { getInitialSession } from "./server/authActions"
import logger from "@/utils/logger"
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

export async function middleware(request: NextRequest) {
  await updateSession(request)
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });
 
  const { session } = await getInitialSession();

  if (protectedApiRoutes.some((path) => request.nextUrl.pathname.startsWith(path))) {
    const token = session?.access_token
    if (token) {
       response.headers.set('Authorization', `Bearer ${token}`)
       return NextResponse.next()
    } else {
       logger.error(`Unauthorized API request: ${request.nextUrl.pathname}`)
       response.headers.set('Authorization', '')
       return new NextResponse('unauthorized', { status: 401 })
    }
  }

  const url = request.nextUrl;
  
  // const { data: roleData, error: roleError } = await supabase.from('member_roles').select('roles(id, name)').eq('member_id', user?.id) as unknown as SupabaseRoleListResponse;
  // if (roleError) {
  //   console.error('ROLE ERROR ', roleError)
  // }
  // if (!roleData) {
  //   console.error('NO ROLE DATA ', roleData)
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
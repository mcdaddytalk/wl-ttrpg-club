import { NextRequest , NextResponse} from "next/server"
import { updateSession } from "@/utils/supabase/middleware"
import { createClient } from "./utils/supabase/server"

export async function middleware(request: NextRequest) {
  await updateSession(request)

  const supabase = await createClient()

/*
  if (request.nextUrl.pathname === "/" 
    || request.nextUrl.pathname === "/join-the-club"
    || request.nextUrl.pathname === "/login"
  ) {
    return NextResponse.next();
  }
  */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data, error } = await supabase.auth.getUser()

  /*
  if (error || !data.user) {
      if (error) console.error('AUTH ERROR ', error)
      if (!data.user) console.error('NO USER DATA ', data)
        return NextResponse.redirect(new URL('/login', request.nextUrl.origin))
  }
  */
  const url = request.nextUrl;
  type RoleData = {
    roles: { name: string }
  }
  type SupabaseResponse = {
    error: string | null;
    data: RoleData[];
    count: number | null;
    status: number;
    statusText: string;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data: roleData, error: roleError } = await supabase.from('member_roles').select('roles(name)').eq('member_id', data.user?.id) as unknown as SupabaseResponse;
  /*
  if (roleError) {
    console.error('ROLE ERROR ', roleError)
    return NextResponse.redirect(new URL('/', url))
  }

  if (!roleData) {
    console.error('NO ROLE DATA ', roleData)
     return NextResponse.redirect(new URL('/', url))
  }
*/
  const roles = roleData ? (roleData as RoleData[])?.map((role) => role.roles.name) : [];
  // console.log('ROLES', roles)

  // Role based redirect
  // Array of restricted paths and role requirements
  const restrictedPaths = [
    { path: '/profile', role: 'member' },
    { path: '/dashboard', role: 'member' },
    { path: '/games', role: ['member', 'gamemaster'] },
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
  
  /*
  if (url.pathname.startsWith('/profile') && !roles.includes('member')) {
      return NextResponse.redirect(new URL('/unauthorized', url))
  } else if (url.pathname.startsWith('/admin') &&!roles.includes('admin')) {
      return NextResponse.redirect(new URL('/unauthorized', url))
  } else if (url.pathname.startsWith('/games') &&!roles.includes('member') && !roles.includes('gamemaster')) {
      return NextResponse.redirect(new URL('/unauthorized', url));
  } else if (url.pathname.startsWith('/account') && !roles.includes('superadmin')) {
      return NextResponse.redirect(new URL('/unauthorized', url))
  }
      */
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
    "/admin-portal/:path*",
    "/dashboard/:path*",
    "/members/:path*",
    "/profile/:path*",
    "/games/:path*",
    "/login/:path*",
  ],
}
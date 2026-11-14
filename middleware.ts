import { NextRequest, NextResponse } from 'next/server';
import { UserRole } from '@/types';

const VALID_ROLES: UserRole[] = ['student', 'teacher', 'company', 'admin'];

function getRequiredRoleForPath(pathname: string): UserRole | null {
  if (pathname === '/student' || pathname.startsWith('/student/')) {
    return 'student';
  }
  if (pathname === '/teacher' || pathname.startsWith('/teacher/')) {
    return 'teacher';
  }
  if (pathname === '/company' || pathname.startsWith('/company/')) {
    return 'company';
  }
  if (pathname === '/admin' || pathname.startsWith('/admin/')) {
    return 'admin';
  }
  return null;
}

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  const requiredRole = getRequiredRoleForPath(pathname);

  if (!requiredRole) {
    return NextResponse.next();
  }

  // Support explicit role switch query param (?role=...) in development or from /unauthorized
  const forcedRole = searchParams.get('role') as UserRole | null;
  if (
    forcedRole &&
    VALID_ROLES.includes(forcedRole) &&
    (forcedRole !== 'admin' || process.env.NODE_ENV === 'development')
  ) {
    const cleanUrl = request.nextUrl.clone();
    cleanUrl.searchParams.delete('role');
    const response = NextResponse.redirect(cleanUrl);
    response.cookies.set('tadreebak_role', forcedRole, {
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
      sameSite: 'lax',
    });
    return response;
  }

  const roleCookie = request.cookies.get('tadreebak_role')?.value as
    | UserRole
    | undefined;

  // Admin routes strictly require roleCookie === 'admin'
  if (requiredRole === 'admin' && roleCookie !== 'admin') {
    const unauthorizedUrl = new URL('/unauthorized', request.url);
    unauthorizedUrl.searchParams.set('required', 'admin');
    unauthorizedUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(unauthorizedUrl);
  }

  // Cross-role protection: if user has a role cookie and it doesn't match the target dashboard
  if (roleCookie && roleCookie !== requiredRole) {
    const unauthorizedUrl = new URL('/unauthorized', request.url);
    unauthorizedUrl.searchParams.set('required', requiredRole);
    unauthorizedUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(unauthorizedUrl);
  }

  // If no role cookie exists yet on non-admin dashboard, initialize it to match entry dashboard
  const response = NextResponse.next();
  if (!roleCookie && requiredRole !== 'admin') {
    response.cookies.set('tadreebak_role', requiredRole, {
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
      sameSite: 'lax',
    });
  }

  return response;
}

export const config = {
  matcher: [
    '/student/:path*',
    '/teacher/:path*',
    '/company/:path*',
    '/admin/:path*',
  ],
};

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const pathname = request.nextUrl.pathname;

  // Define tus rutas protegidas
  const protectedRoutes = ['/dashboard'];
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (!token && isProtectedRoute) {
    if (!pathname.startsWith('/login') && !pathname.startsWith('/api/auth')) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  if (token && (pathname.startsWith('/login') || pathname.startsWith('/register'))) {
    return NextResponse.redirect(new URL('/dashboard/main', request.url));
  }

  // Si ninguna de las condiciones anteriores se cumple, permite que la solicitud continúe
  return NextResponse.next();
}

// Configuración del 'matcher' para el middleware
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/login',
    '/register'
  ],
};

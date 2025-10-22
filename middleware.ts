import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Rutas que requieren autenticación
  const protectedRoutes = ['/dashboard', '/pro', '/admin'];
  const isProtectedRoute = protectedRoutes.some(route => 
    req.nextUrl.pathname.startsWith(route)
  );

  // Rutas de autenticación (redirigir si ya está autenticado)
  const authRoutes = ['/auth/login', '/auth/register', '/auth/verify'];
  const isAuthRoute = authRoutes.includes(req.nextUrl.pathname);

  if (isProtectedRoute && !session) {
    // Redirigir a login si no está autenticado
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }

  if (isAuthRoute && session) {
    // Redirigir a dashboard si ya está autenticado
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  // Verificar rol para rutas específicas
  if (session && isProtectedRoute) {
    const { data: user } = await supabase
      .from('users')
      .select('role')
      .eq('id', session.user.id)
      .single();

    if (user) {
      // Redirigir según el rol
      if (req.nextUrl.pathname.startsWith('/admin') && user.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }
      
      if (req.nextUrl.pathname.startsWith('/pro') && user.role !== 'PRO') {
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }
    }
  }

  return res;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

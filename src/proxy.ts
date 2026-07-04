import { jwtVerify } from 'jose';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-default-key-change-it-in-env';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Evitar que el usuario loggeado acceda a la página de login
  if (pathname.startsWith('/login')) {
    const token = request.cookies.get('auth_token')?.value;
    if (token) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  // Rutas que requieren autenticación
  const protectedRoutes = ['/dashboard'];
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  if (isProtectedRoute) {
    const token = request.cookies.get('auth_token')?.value;

    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      const secret = new TextEncoder().encode(JWT_SECRET);
      const { payload } = await jwtVerify(token, secret);
      
      // Control de Acceso Basado en Roles (RBAC) con Permisos
      if (!payload.permissions) {
        throw new Error("Token antiguo sin permisos");
      }
      
      const permissions = (payload.permissions as string[]) || [];
      const path = request.nextUrl.pathname;

      if (!permissions.includes('manage:all')) {
        // Mapa básico de rutas a permisos requeridos
        const routePermissions: Record<string, string> = {
          '/dashboard/products': 'read:products',
          '/dashboard/categories': 'read:categories',
          '/dashboard/brands': 'read:brands',
          '/dashboard/vehicle-models': 'read:models',
          '/dashboard/vehicles': 'read:vehicles',
          '/dashboard/services': 'read:services',
          '/dashboard/galleries': 'read:gallery',
          '/dashboard/users': 'read:users',
          '/dashboard/roles': 'read:roles',
          '/dashboard/messages': 'read:messages'
        };

        for (const [route, permission] of Object.entries(routePermissions)) {
          if (path.startsWith(route) && !permissions.includes(permission)) {
            return NextResponse.redirect(new URL('/dashboard', request.url));
          }
        }
        
        // Verificación base para /dashboard
        if (path === '/dashboard' && !permissions.includes('read:dashboard')) {
          return NextResponse.redirect(new URL('/', request.url));
        }
      }

      return NextResponse.next();
    } catch (error) {
      // Token inválido o expirado
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('auth_token');
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Coincide con todas las rutas excepto:
     * - api (API routes)
     * - _next/static (archivos estáticos)
     * - _next/image (optimización de imágenes)
     * - favicon.ico (favicon)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};

import { cookies } from 'next/headers';
import * as jose from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-default-key-change-it-in-env';

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;

  if (!token) return null;

  try {
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jose.jwtVerify(token, secret);
    
    // Invalidate old tokens that don't have permissions
    if (!payload.permissions) {
      return null;
    }
    
    return payload;
  } catch (error) {
    return null;
  }
}

export async function hasPermission(permission: string): Promise<boolean> {
  const session = await getSession();
  if (!session) return false;

  const permissions = (session.permissions as string[]) || [];
  return permissions.includes(permission) || permissions.includes('manage:all');
}

export async function requirePermission(permission: string) {
  const hasPerm = await hasPermission(permission);
  if (!hasPerm) {
    throw new Error(`No autorizado. Requiere el permiso: ${permission}`);
  }
}

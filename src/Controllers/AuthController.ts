'use server';

import { User } from '@/Models/User';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';
import { cookies, headers } from 'next/headers';
import { z } from 'zod';
import { logAction } from '@/lib/audit';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-default-key-change-it-in-env';
const ALGORITHM = 'HS256';

// Schema Validation (Zod)
const loginSchema = z.object({
  email: z.string().email('Email inválido').trim(),
  password: z.string().min(6, 'Contraseña debe tener al menos 6 caracteres').trim(),
});

import { redirect } from 'next/navigation';

export async function loginAction(prevState: any, formData: FormData) {
  try {
    const rawData = Object.fromEntries(formData.entries());
    
    // 1. Sanitización y Validación con Zod
    const result = loginSchema.safeParse(rawData);
    if (!result.success) {
      return { error: result.error.errors[0].message };
    }

    const { email, password } = result.data;

    // 2. Buscar usuario
    const user = await User.findByEmail(email);
    if (!user) {
      return { error: 'Credenciales inválidas' };
    }

    // 3. Verificar contraseña encriptada (bcrypt)
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return { error: 'Credenciales inválidas' };
    }

    // 4. Generar Token JWT (jose)
    const token = await new SignJWT({ 
      id: user.user_id, 
      email: user.email, 
      role: user.role.name,
      permissions: user.role.permissions?.map((p: any) => p.permission.name) || []
    })
      .setProtectedHeader({ alg: ALGORITHM })
      .setExpirationTime('2h')
      .sign(new TextEncoder().encode(JWT_SECRET));

    // 5. Configurar Cookie segura
    const cookieStore = await cookies();
    cookieStore.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 2, // 2 horas
    });

    // Obtener el dispositivo (User-Agent)
    const headersList = await headers();
    const userAgent = headersList.get('user-agent') || 'Dispositivo desconocido';

    // Registrar en auditoría
    await logAction('LOGIN', 'User', user.user_id, { 
      email: user.email, 
      device: userAgent 
    }, user.user_id);

  } catch (error: any) {
    if (error.message === 'NEXT_REDIRECT') {
      throw error;
    }
    console.error('Error en login:', error);
    return { error: 'Ocurrió un error en el servidor' };
  }
  
  redirect('/dashboard');
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete('auth_token');
  return { success: true };
}

'use server';

import { User } from '@/Models/User';
import { revalidatePath } from 'next/cache';
import bcrypt from 'bcryptjs';
import { requirePermission } from '@/lib/auth';
import { logAction } from '@/lib/audit';

export async function createUser(formData: FormData) {
  await requirePermission('create:users');
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const role_id = Number(formData.get('role_id'));

  if (!name || !email || !password || !role_id) {
    throw new Error('Todos los campos son obligatorios');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role_id
  });
  
  await logAction('CREATE', 'User', user.user_id, { name, email, role_id });
  
  revalidatePath('/dashboard/users');
}

export async function updateUser(id: number, formData: FormData) {
  await requirePermission('update:users');
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const role_id = Number(formData.get('role_id'));

  if (!name || !email || !role_id) {
    throw new Error('Nombre, email y rol son obligatorios');
  }

  const updateData: any = {
    name,
    email,
    role_id
  };

  if (password) {
    updateData.password = await bcrypt.hash(password, 10);
  }

  await User.update(id, updateData);
  await logAction('UPDATE', 'User', id, { name, email, role_id });
  
  revalidatePath('/dashboard/users');
}

export async function updateProfile(id: number, formData: FormData) {
  await requirePermission('update:profile');
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!name || !email) {
    throw new Error('Nombre y email son obligatorios');
  }

  const updateData: any = { name, email };

  if (password) {
    updateData.password = await bcrypt.hash(password, 10);
  }

  await User.update(id, updateData);
  
  // Re-generate JWT so the session updates immediately
  const user = await User.findById(id);
  if (user) {
    const { SignJWT } = await import('jose');
    const { cookies } = await import('next/headers');
    const token = await new SignJWT({ 
      id: user.user_id, 
      name: user.name,
      email: user.email, 
      role: user.role.name,
      permissions: user.role.permissions?.map((p: any) => p.permission.name) || []
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('2h')
      .sign(new TextEncoder().encode(process.env.JWT_SECRET || 'super-secret-default-key-change-it-in-env'));

    const cookieStore = await cookies();
    cookieStore.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production' && process.env.REQUIRE_HTTPS === 'true',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 2,
    });
  }
  
  revalidatePath('/dashboard/profile');
  revalidatePath('/dashboard', 'layout');
}

export async function deleteUser(id: number) {
  await requirePermission('delete:users');
  await User.delete(id);
  await logAction('DELETE', 'User', id, null);
  revalidatePath('/dashboard/users');
}

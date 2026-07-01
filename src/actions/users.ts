'use server';

import { User } from '@/Models/User';
import { revalidatePath } from 'next/cache';
import bcrypt from 'bcryptjs';
import { requirePermission } from '@/lib/auth';

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

  await User.create({
    name,
    email,
    password: hashedPassword,
    role_id
  });
  
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
  
  revalidatePath('/dashboard/profile');
  // Optional: revalidate token by setting a new cookie (we will skip for now to keep it simple, they'll just log in again if needed)
}

export async function deleteUser(id: number) {
  await requirePermission('delete:users');
  await User.delete(id);
  revalidatePath('/dashboard/users');
}

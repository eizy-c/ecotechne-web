'use server';

import { Permission } from '@/Models/Permission';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createPermission(formData: FormData) {
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;

  if (!name) {
    throw new Error('El nombre es obligatorio');
  }

  await Permission.create({ name, description });
  
  revalidatePath('/dashboard/permissions');
  redirect('/dashboard/permissions');
}

export async function updatePermission(id: number, formData: FormData) {
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;

  if (!name) {
    throw new Error('El nombre es obligatorio');
  }

  await Permission.update(id, { name, description });
  
  revalidatePath('/dashboard/permissions');
  redirect('/dashboard/permissions');
}

export async function deletePermission(id: number) {
  await Permission.delete(id);
  revalidatePath('/dashboard/permissions');
}

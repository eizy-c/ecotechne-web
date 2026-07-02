'use server';

import { Category } from '@/Models/Category';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { requirePermission } from '@/lib/auth';

export async function createCategory(formData: FormData) {
  await requirePermission('create:categories');
  const name = formData.get('name') as string;

  if (!name) {
    throw new Error('Name is required');
  }

  await Category.create({ name });

  revalidatePath('/dashboard/categories');
}

export async function updateCategory(id: number, formData: FormData) {
  await requirePermission('update:categories');
  const name = formData.get('name') as string;

  if (!name) {
    throw new Error('Name is required');
  }

  await Category.update(id, { name });

  revalidatePath('/dashboard/categories');
}

export async function deleteCategory(id: number) {
  await requirePermission('delete:categories');
  await Category.delete(id);
  revalidatePath('/dashboard/categories');
}

'use server';

import { Brand } from '@/Models/Brand';
import { revalidatePath } from 'next/cache';
import { requirePermission } from '@/lib/auth';
import { redirect } from 'next/navigation';

export async function createBrand(formData: FormData) {
  await requirePermission('create:brands');
  const name = formData.get('name') as string;

  if (!name) {
    throw new Error('Name is required');
  }

  await Brand.create({ name });

  revalidatePath('/dashboard/brands');
  redirect('/dashboard/brands');
}

export async function updateBrand(id: number, formData: FormData) {
  await requirePermission('update:brands');
  const name = formData.get('name') as string;

  if (!name) {
    throw new Error('Name is required');
  }

  await Brand.update(id, { name });

  revalidatePath('/dashboard/brands');
  redirect('/dashboard/brands');
}

export async function deleteBrand(id: number) {
  await requirePermission('delete:brands');
  await Brand.delete(id);
  revalidatePath('/dashboard/brands');
}

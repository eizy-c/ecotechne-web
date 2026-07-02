'use server';

import { Service } from '@/Models/Service';
import { revalidatePath } from 'next/cache';
import { requirePermission } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { logAction } from '@/lib/audit';

export async function createService(formData: FormData) {
  await requirePermission('create:services');
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const icon = formData.get('icon') as string;
  const image_url = formData.get('image_url') as string;
  const active = formData.get('active') === 'on';

  if (!name) {
    throw new Error('El nombre es obligatorio');
  }

  const service = await Service.create({ name, description, icon, image_url, active });
  await logAction('CREATE', 'Service', service.service_id, { name });
  
  revalidatePath('/dashboard/services');
  redirect('/dashboard/services');
}

export async function updateService(id: number, formData: FormData) {
  await requirePermission('update:services');
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const icon = formData.get('icon') as string;
  const image_url = formData.get('image_url') as string;
  const active = formData.get('active') === 'on';

  if (!name) {
    throw new Error('El nombre es obligatorio');
  }

  await Service.update(id, { name, description, icon, image_url, active });
  await logAction('UPDATE', 'Service', id, { name, active });
  
  revalidatePath('/dashboard/services');
  redirect('/dashboard/services');
}

export async function deleteService(id: number) {
  await requirePermission('delete:services');
  await Service.delete(id);
  await logAction('DELETE', 'Service', id, null);
  revalidatePath('/dashboard/services');
}

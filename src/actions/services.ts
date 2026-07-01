'use server';

import { Service } from '@/Models/Service';
import { revalidatePath } from 'next/cache';
import { requirePermission } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { logAudit } from './audit';

export async function createService(formData: FormData) {
  await requirePermission('create:services');
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const icon = formData.get('icon') as string;
  const image_url = formData.get('image_url') as string;
  const price = Number(formData.get('price')) || 0;
  const active = formData.get('active') === 'on';

  if (!name) {
    throw new Error('El nombre es obligatorio');
  }

  const service = await Service.create({ name, description, icon, image_url, price, active });
  await logAudit('CREATE', 'Service', service.service_id, { name, price });
  
  revalidatePath('/dashboard/services');
  redirect('/dashboard/services');
}

export async function updateService(id: number, formData: FormData) {
  await requirePermission('update:services');
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const icon = formData.get('icon') as string;
  const image_url = formData.get('image_url') as string;
  const price = Number(formData.get('price')) || 0;
  const active = formData.get('active') === 'on';

  if (!name) {
    throw new Error('El nombre es obligatorio');
  }

  await Service.update(id, { name, description, icon, image_url, price, active });
  await logAudit('UPDATE', 'Service', id, { name, price, active });
  
  revalidatePath('/dashboard/services');
  redirect('/dashboard/services');
}

export async function deleteService(id: number) {
  await requirePermission('delete:services');
  await Service.delete(id);
  await logAudit('DELETE', 'Service', id, null);
  revalidatePath('/dashboard/services');
}

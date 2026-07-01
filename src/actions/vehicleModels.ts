'use server';

import { VehicleModel } from '@/Models/VehicleModel';
import { revalidatePath } from 'next/cache';
import { requirePermission } from '@/lib/auth';
import { redirect } from 'next/navigation';

export async function createVehicleModel(formData: FormData) {
  await requirePermission('create:models');
  const name = formData.get('name') as string;
  const brand_id = Number(formData.get('brand_id'));

  if (!name || isNaN(brand_id)) {
    throw new Error('Name and brand_id are required');
  }

  await VehicleModel.create({ name, brand_id });

  revalidatePath('/dashboard/vehicle-models');
  redirect('/dashboard/vehicle-models');
}

export async function updateVehicleModel(id: number, formData: FormData) {
  await requirePermission('update:models');
  const name = formData.get('name') as string;
  const brand_id = Number(formData.get('brand_id'));

  if (!name || isNaN(brand_id)) {
    throw new Error('Name and brand_id are required');
  }

  await VehicleModel.update(id, { name, brand_id });

  revalidatePath('/dashboard/vehicle-models');
  redirect('/dashboard/vehicle-models');
}

export async function deleteVehicleModel(id: number) {
  await requirePermission('delete:models');
  await VehicleModel.delete(id);
  revalidatePath('/dashboard/vehicle-models');
}

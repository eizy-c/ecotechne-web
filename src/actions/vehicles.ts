'use server';

import { Vehicle } from '@/Models/Vehicle';
import { revalidatePath } from 'next/cache';
import { requirePermission } from '@/lib/auth';
import { redirect } from 'next/navigation';

export async function createVehicle(formData: FormData) {
  await requirePermission('create:vehicles');
  const brand_id = Number(formData.get('vehicle_brand_id'));
  const vehicle_model_id = Number(formData.get('vehicle_model_id'));
  const year = formData.get('year') as string;

  if (isNaN(brand_id) || isNaN(vehicle_model_id) || !year) {
    throw new Error('Todos los campos son obligatorios');
  }

  await Vehicle.create({ brand_id, vehicle_model_id, year });
  
  revalidatePath('/dashboard/vehicles');
}

export async function updateVehicle(id: number, formData: FormData) {
  await requirePermission('update:vehicles');
  const brand_id = Number(formData.get('vehicle_brand_id'));
  const vehicle_model_id = Number(formData.get('vehicle_model_id'));
  const year = formData.get('year') as string;

  if (isNaN(brand_id) || isNaN(vehicle_model_id) || !year) {
    throw new Error('Todos los campos son obligatorios');
  }

  await Vehicle.update(id, { brand_id, vehicle_model_id, year });
  
  revalidatePath('/dashboard/vehicles');
}

export async function deleteVehicle(id: number) {
  await requirePermission('delete:vehicles');
  await Vehicle.delete(id);
  revalidatePath('/dashboard/vehicles');
}

'use server';

import { Product } from '@/Models/Product';
import { uploadImage } from '@/actions/upload';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import { requirePermission } from '@/lib/auth';

export async function createProduct(formData: FormData) {
  await requirePermission('create:products');
  const name = formData.get('name') as string;
  const price = Number(formData.get('price'));
  const stock = Number(formData.get('stock'));
  const categories = formData.getAll('categories').map(id => ({ category_id: Number(id) }));
  const vehicles = formData.getAll('vehicles').map(id => ({ vehicle_id: Number(id) }));

  if (!name || isNaN(price)) {
    throw new Error('Por favor completa todos los campos requeridos correctamente');
  }

  await Product.create({ 
    name, 
    price, 
    stock: isNaN(stock) ? 0 : stock,
    image_url: formData.get('image_url') as string || null,
    categories: { connect: categories },
    vehicles: { connect: vehicles },
  });
  
  revalidatePath('/dashboard/products');
  redirect('/dashboard/products');
}

export async function updateProduct(id: number, formData: FormData) {
  await requirePermission('update:products');
  const name = formData.get('name') as string;
  const price = Number(formData.get('price'));
  const stock = Number(formData.get('stock'));
  const categories = formData.getAll('categories').map(id => ({ category_id: Number(id) }));
  const vehicles = formData.getAll('vehicles').map(id => ({ vehicle_id: Number(id) }));

  if (!name || isNaN(price)) {
    throw new Error('Por favor completa todos los campos requeridos correctamente');
  }

  const updateData: any = { 
    name, 
    price, 
    stock: isNaN(stock) ? 0 : stock,
    categories: { set: categories },
    vehicles: { set: vehicles }
  };

  const image_url = formData.get('image_url') as string;

  if (image_url) {
    updateData.image_url = image_url;
  }

  await Product.update(id, updateData);
  
  revalidatePath('/dashboard/products');
  redirect('/dashboard/products');
}

export async function deleteProduct(id: number) {
  await requirePermission('delete:products');
  await Product.delete(id);
  revalidatePath('/dashboard/products');
}

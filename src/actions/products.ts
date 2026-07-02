'use server';

import { Product } from '@/Models/Product';
import { uploadImage } from '@/actions/upload';
import { revalidatePath } from 'next/cache';
import prisma from '@/lib/prisma';
import { requirePermission } from '@/lib/auth';
import { logAction } from '@/lib/audit';

export async function createProduct(formData: FormData) {
  await requirePermission('create:products');
  const name = formData.get('name') as string;
  const stock = Number(formData.get('stock'));
  const categories = formData.getAll('categories').map(id => ({ category_id: Number(id) }));
  const vehicles = formData.getAll('vehicles').map(id => ({ vehicle_id: Number(id) }));
  const is_featured = formData.get('is_featured') === 'true';

  if (!name) {
    throw new Error('Por favor completa todos los campos requeridos correctamente');
  }

  const product = await Product.create({ 
    name, 
    stock: isNaN(stock) ? 0 : stock,
    image_url: formData.get('image_url') as string || null,
    is_featured,
    categories: { connect: categories },
    vehicles: { connect: vehicles },
  });

  await logAction('CREATE', 'Product', product.product_id, { name });
  
  revalidatePath('/dashboard/products');
  return { success: true };
}

export async function updateProduct(id: number, formData: FormData) {
  await requirePermission('update:products');
  const name = formData.get('name') as string;
  const stock = Number(formData.get('stock'));
  const categories = formData.getAll('categories').map(id => ({ category_id: Number(id) }));
  const vehicles = formData.getAll('vehicles').map(id => ({ vehicle_id: Number(id) }));
  const is_featured = formData.get('is_featured') === 'true';

  if (!name) {
    throw new Error('Por favor completa todos los campos requeridos correctamente');
  }

  const updateData: any = { 
    name, 
    stock: isNaN(stock) ? 0 : stock,
    is_featured,
    categories: { set: categories },
    vehicles: { set: vehicles }
  };

  const image_url = formData.get('image_url') as string;

  if (image_url) {
    updateData.image_url = image_url;
  }

  await Product.update(id, updateData);
  
  await logAction('UPDATE', 'Product', id, { name });

  revalidatePath('/dashboard/products');
  return { success: true };
}

export async function deleteProduct(id: number) {
  await requirePermission('delete:products');
  await Product.delete(id);
  await logAction('DELETE', 'Product', id, null);
  revalidatePath('/dashboard/products');
}

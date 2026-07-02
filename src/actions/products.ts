'use server';

import { Product } from '@/Models/Product';
import { uploadImage } from '@/actions/upload';
import { revalidatePath } from 'next/cache';
import prisma from '@/lib/prisma';
import { requirePermission } from '@/lib/auth';
import { logAction } from '@/lib/audit';

export async function createProduct(formData: FormData) {
  function generateSlug(name: string) {
    const base = name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    return `${base}-${Math.floor(1000 + Math.random() * 9000)}`;
  }

  await requirePermission('create:products');
  const name = formData.get('name') as string;
  const description = formData.get('description') as string | null;
  const stock = Number(formData.get('stock'));
  const categories = formData.getAll('categories').map(id => ({ category_id: Number(id) }));
  const vehicles = formData.getAll('vehicles').map(id => ({ vehicle_id: Number(id) }));
  const is_featured = formData.get('is_featured') === 'true';
  const additionalImages = formData.getAll('additional_images').filter(img => img).map(url => ({ image_url: url as string }));

  if (!name) {
    throw new Error('Por favor completa todos los campos requeridos correctamente');
  }

  const product = await Product.create({ 
    name, 
    description,
    stock: isNaN(stock) ? 0 : stock,
    image_url: formData.get('image_url') as string || null,
    is_featured,
    slug: generateSlug(name),
    categoryProducts: { create: categories },
    vehicleProducts: { create: vehicles },
    images: { create: additionalImages },
  });

  await logAction('CREATE', 'Product', product.product_id, { name });
  
  revalidatePath('/dashboard/products');
  return { success: true };
}

export async function updateProduct(id: number, formData: FormData) {
  function generateSlug(name: string) {
    const base = name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    return `${base}-${Math.floor(1000 + Math.random() * 9000)}`;
  }

  await requirePermission('update:products');
  const name = formData.get('name') as string;
  const description = formData.get('description') as string | null;
  const stock = Number(formData.get('stock'));
  const categories = formData.getAll('categories').map(id => ({ category_id: Number(id) }));
  const vehicles = formData.getAll('vehicles').map(id => ({ vehicle_id: Number(id) }));
  const is_featured = formData.get('is_featured') === 'true';
  const additionalImages = formData.getAll('additional_images').filter(img => img).map(url => ({ image_url: url as string }));

  if (!name) {
    throw new Error('Por favor completa todos los campos requeridos correctamente');
  }

  const updateData: any = { 
    name, 
    description,
    stock: isNaN(stock) ? 0 : stock,
    is_featured,
    slug: generateSlug(name),
    categoryProducts: { deleteMany: {}, create: categories },
    vehicleProducts: { deleteMany: {}, create: vehicles },
  };

  // Update additional images if new ones are provided (optional logic, for now we just append or replace)
  if (additionalImages.length > 0) {
    updateData.images = { deleteMany: {}, create: additionalImages };
  }

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

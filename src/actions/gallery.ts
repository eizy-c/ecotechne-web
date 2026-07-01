'use server';

import { Gallery } from '@/Models/Gallery';
import { uploadImage } from '@/actions/upload';
import { revalidatePath } from 'next/cache';
import { requirePermission } from '@/lib/auth';

export async function getGalleries() {
  const galleries = await Gallery.findAll();
  // We stringify and parse to avoid serialization issues with Dates from Prisma to Client Components
  return JSON.parse(JSON.stringify(galleries));
}

export async function createGallery(formData: FormData) {
  await requirePermission('create:gallery');
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const image = formData.get('image') as File;

  if (!title || !image || image.size === 0) {
    throw new Error('El título y la imagen son obligatorios');
  }

  // Subir la imagen
  const image_url = await uploadImage(formData, 'gallery');

  await Gallery.create({ title, description, image_url });
  
  revalidatePath('/dashboard/galleries');
}

export async function updateGallery(id: number, formData: FormData) {
  await requirePermission('update:gallery');
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const image = formData.get('image') as File;

  if (!title) {
    throw new Error('El título es obligatorio');
  }

  const updateData: any = { title, description };

  // Si se subió una nueva imagen, procesarla y actualizarla
  if (image && image.size > 0) {
    updateData.image_url = await uploadImage(formData, 'gallery');
  }

  await Gallery.update(id, updateData);
  
  revalidatePath('/dashboard/galleries');
}

export async function deleteGallery(id: number) {
  await requirePermission('delete:gallery');
  // Opcional: Eliminar el archivo físico de 'public/uploads/gallery/'
  await Gallery.delete(id);
  revalidatePath('/dashboard/galleries');
}

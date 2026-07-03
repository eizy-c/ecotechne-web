'use server';

import { Album } from '@/Models/Album';
import { GalleryImage } from '@/Models/GalleryImage';
import { uploadImage } from '@/actions/upload';
import { revalidatePath } from 'next/cache';
import { requirePermission } from '@/lib/auth';

export async function getAlbums() {
  const albums = await Album.findAll();
  return JSON.parse(JSON.stringify(albums));
}

export async function getGalleryImages() {
  const images = await GalleryImage.findAll();
  return JSON.parse(JSON.stringify(images));
}

export async function createAlbum(formData: FormData) {
  await requirePermission('create:gallery');
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;

  if (!name) {
    throw new Error('El nombre del álbum es obligatorio');
  }

  await Album.create({ name, description });
  revalidatePath('/dashboard/galleries');
}

export async function updateAlbum(id: number, formData: FormData) {
  await requirePermission('update:gallery');
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;

  if (!name) {
    throw new Error('El nombre del álbum es obligatorio');
  }

  await Album.update(id, { name, description });
  revalidatePath('/dashboard/galleries');
}

export async function deleteAlbum(id: number) {
  await requirePermission('delete:gallery');
  await Album.delete(id);
  revalidatePath('/dashboard/galleries');
}

export async function uploadGalleryImages(formData: FormData) {
  await requirePermission('create:gallery');
  const description = formData.get('description') as string;
  const album_id_str = formData.get('album_id') as string;
  const album_id = album_id_str ? parseInt(album_id_str) : undefined;
  
  // Extraer todos los archivos 'images' del formData
  const files = formData.getAll('images') as File[];
  
  if (!files || files.length === 0) {
    throw new Error('Debes subir al menos una imagen');
  }

  // Upload each image
  for (const file of files) {
    if (file.size === 0) continue;
    
    // Crear un nuevo formData para cada archivo para usar el helper uploadImage
    const singleFormData = new FormData();
    singleFormData.append('image', file);
    
    const image_url = await uploadImage(singleFormData, 'gallery');
    
    await GalleryImage.create({
      image_url,
      description: description || undefined,
      album_id,
    });
  }

  revalidatePath('/dashboard/galleries');
}

export async function deleteGalleryImage(id: number) {
  await requirePermission('delete:gallery');
  await GalleryImage.delete(id);
  revalidatePath('/dashboard/galleries');
}

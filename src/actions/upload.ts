'use server';

import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';

export async function uploadImage(formData: FormData, folder: string = 'gallery'): Promise<string> {
  const file = formData.get('image') as File;
  
  if (!file) {
    throw new Error('No se ha proporcionado ninguna imagen');
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Generar nombre único
  const uniqueName = `${uuidv4()}.webp`;
  
  // Asegurar que el directorio existe
  const uploadDir = join(process.cwd(), 'public', 'uploads', folder);
  try {
    await mkdir(uploadDir, { recursive: true });
  } catch (error) {
    // Ignorar si ya existe
  }

  const filePath = join(uploadDir, uniqueName);

  // Procesar con Sharp (Redimensionar y convertir a WebP)
  await sharp(buffer)
    .resize(1200, 1200, {
      fit: 'inside',
      withoutEnlargement: true,
    })
    .webp({ quality: 80 })
    .toFile(filePath);

  // Retornar la ruta pública
  return `/uploads/${folder}/${uniqueName}`;
}

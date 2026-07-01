'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

const defaultPermissions = [
  // Usuarios
  { name: 'view_users', description: 'Ver listado de usuarios' },
  { name: 'create_users', description: 'Crear nuevos usuarios' },
  { name: 'edit_users', description: 'Editar usuarios existentes' },
  { name: 'delete_users', description: 'Eliminar usuarios' },
  
  // Roles
  { name: 'view_roles', description: 'Ver listado de roles' },
  { name: 'create_roles', description: 'Crear nuevos roles' },
  { name: 'edit_roles', description: 'Editar roles existentes' },
  { name: 'delete_roles', description: 'Eliminar roles' },

  // Permisos
  { name: 'view_permissions', description: 'Ver listado de permisos' },
  { name: 'create_permissions', description: 'Crear nuevos permisos' },
  { name: 'edit_permissions', description: 'Editar permisos' },
  { name: 'delete_permissions', description: 'Eliminar permisos' },

  // Productos
  { name: 'view_products', description: 'Ver catálogo de productos' },
  { name: 'create_products', description: 'Crear nuevos productos' },
  { name: 'edit_products', description: 'Editar productos' },
  { name: 'delete_products', description: 'Eliminar productos' },

  // Servicios
  { name: 'view_services', description: 'Ver servicios' },
  { name: 'create_services', description: 'Crear servicios' },
  { name: 'edit_services', description: 'Editar servicios' },
  { name: 'delete_services', description: 'Eliminar servicios' },

  // Galeria
  { name: 'view_gallery', description: 'Ver galería de imágenes' },
  { name: 'create_gallery', description: 'Subir imágenes a la galería' },
  { name: 'edit_gallery', description: 'Editar imágenes de la galería' },
  { name: 'delete_gallery', description: 'Eliminar imágenes' },

  // Mensajes
  { name: 'view_messages', description: 'Leer mensajes de contacto' },
  { name: 'delete_messages', description: 'Eliminar mensajes' },

  // Vehículos
  { name: 'view_vehicles', description: 'Ver vehículos compatibles' },
  { name: 'create_vehicles', description: 'Añadir vehículos' },
  { name: 'edit_vehicles', description: 'Editar vehículos' },
  { name: 'delete_vehicles', description: 'Eliminar vehículos' },

  // Marcas de Vehículos
  { name: 'view_vehicle_brands', description: 'Ver marcas de vehículos' },
  { name: 'create_vehicle_brands', description: 'Añadir marcas de vehículos' },
  { name: 'edit_vehicle_brands', description: 'Editar marcas de vehículos' },
  { name: 'delete_vehicle_brands', description: 'Eliminar marcas de vehículos' },

  // Modelos de Vehículos
  { name: 'view_vehicle_models', description: 'Ver modelos de vehículos' },
  { name: 'create_vehicle_models', description: 'Añadir modelos de vehículos' },
  { name: 'edit_vehicle_models', description: 'Editar modelos de vehículos' },
  { name: 'delete_vehicle_models', description: 'Eliminar modelos de vehículos' },

  // Categorías
  { name: 'view_categories', description: 'Ver categorías' },
  { name: 'create_categories', description: 'Añadir categorías' },
  { name: 'edit_categories', description: 'Editar categorías' },
  { name: 'delete_categories', description: 'Eliminar categorías' },

  // Marcas
  { name: 'view_brands', description: 'Ver marcas' },
  { name: 'create_brands', description: 'Añadir marcas' },
  { name: 'edit_brands', description: 'Editar marcas' },
  { name: 'delete_brands', description: 'Eliminar marcas' },
];

export async function seedPermissions() {
  for (const perm of defaultPermissions) {
    // Solo crea si no existe
    const exists = await prisma.permission.findUnique({ where: { name: perm.name } });
    if (!exists) {
      await prisma.permission.create({ data: perm });
    }
  }
  revalidatePath('/dashboard/permissions');
}

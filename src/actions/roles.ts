'use server';

import { Role } from '@/Models/Role';
import { revalidatePath } from 'next/cache';
import prisma from '@/lib/prisma';
import { requirePermission } from '@/lib/auth';

export async function createRole(formData: FormData) {
  await requirePermission('create:roles');
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const permissionIds = formData.getAll('permissions').map(id => Number(id));

  if (!name) {
    throw new Error('El nombre es obligatorio');
  }

  await prisma.role.create({ 
    data: { 
      name, 
      description,
      permissions: {
        create: permissionIds.map(id => ({ permission_id: id }))
      }
    } 
  });
  
  revalidatePath('/dashboard/roles');
}

export async function updateRole(id: number, formData: FormData) {
  await requirePermission('update:roles');
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const permissionIds = formData.getAll('permissions').map(id => Number(id));

  if (!name) {
    throw new Error('El nombre es obligatorio');
  }

  // Transaction to update role and recreate its permissions
  await prisma.$transaction([
    prisma.permissionRole.deleteMany({ where: { role_id: id } }),
    prisma.role.update({
      where: { role_id: id },
      data: { 
        name, 
        description,
        permissions: {
          create: permissionIds.map(permId => ({ permission_id: permId }))
        }
      }
    })
  ]);
  
  revalidatePath('/dashboard/roles');
}

export async function deleteRole(id: number) {
  await requirePermission('delete:roles');
  await Role.delete(id);
  revalidatePath('/dashboard/roles');
}

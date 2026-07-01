'use server';

import { User } from '@/Models/User';
import { revalidatePath } from 'next/cache';
import bcrypt from 'bcryptjs';

export async function createUserAction(formData: FormData) {
  try {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const role_id = parseInt(formData.get('role_id') as string);

    if (!name || !email || !password || !role_id) {
      return { success: false, error: 'Todos los campos son obligatorios' };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // TODO: Ideally wrap Prisma directly if the model method doesn't support full create yet
    // As User model might not have create yet, let's just use Prisma directly here or add it to Model.
    // For now we will add create to the User Model.
    
    await User.create({
      name,
      email,
      password: hashedPassword,
      role_id
    });

    revalidatePath('/dashboard/users');
    return { success: true };
  } catch (error: any) {
    console.error('Error creating user:', error);
    return { success: false, error: error.message || 'Error al crear usuario' };
  }
}

export async function deleteUserAction(user_id: number) {
  try {
    await User.delete(user_id);
    revalidatePath('/dashboard/users');
    return { success: true };
  } catch (error: any) {
    console.error('Error deleting user:', error);
    return { success: false, error: error.message || 'Error al eliminar usuario' };
  }
}

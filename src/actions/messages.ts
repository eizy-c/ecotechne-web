'use server';

import { ContactMessage } from '@/Models/ContactMessage';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createMessage(formData: FormData) {
  const name = formData.get('name') as string;
  const phone = formData.get('phone') as string;
  const message = formData.get('message') as string;

  if (!name || !phone || !message) {
    throw new Error('Todos los campos son obligatorios');
  }

  await ContactMessage.create({ name, phone, message });
  
  revalidatePath('/dashboard/messages');
  
  return { success: true };
}

import { requirePermission } from '@/lib/auth';

export async function markMessageAsRead(id: number) {
  await requirePermission('read:messages');
  await ContactMessage.markAsRead(id);
  revalidatePath('/dashboard/messages');
}

export async function deleteMessage(id: number) {
  await requirePermission('delete:messages');
  await ContactMessage.delete(id);
  revalidatePath('/dashboard/messages');
}

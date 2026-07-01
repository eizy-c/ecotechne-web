'use server';

import { ContactMessage } from '@/Models/ContactMessage';

export async function getUnreadCountClient() {
  return await ContactMessage.getUnreadCount();
}

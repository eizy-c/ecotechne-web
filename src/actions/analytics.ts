'use server';

import prisma from '@/lib/prisma';
import { headers } from 'next/headers';

export async function logVisit(path: string) {
  try {
    const headersList = await headers();
    const ip = headersList.get('x-forwarded-for') || '127.0.0.1';
    const userAgent = headersList.get('user-agent') || 'Unknown';
    
    // We will use an external service from the client for country, 
    // but we can register the initial visit here or we can just let the client do it.
    // For this implementation, we'll let the client call this function.
  } catch (e) {
    console.error(e);
  }
}

export async function logProductLead(productId: number, country?: string) {
  try {
    const headersList = await headers();
    const ip = headersList.get('x-forwarded-for') || '127.0.0.1';
    
    await prisma.productLead.create({
      data: {
        product_id: productId,
        ip_address: ip,
        country: country || 'Unknown',
      }
    });
  } catch (e) {
    console.error('Error logging product lead:', e);
  }
}

export async function logVisitClient(path: string, country: string) {
  try {
    const headersList = await headers();
    const ip = headersList.get('x-forwarded-for') || '127.0.0.1';
    const userAgent = headersList.get('user-agent') || 'Unknown';
    
    await prisma.visit.create({
      data: {
        ip_address: ip,
        country,
        path,
        user_agent: userAgent
      }
    });
  } catch (e) {
    console.error('Error logging visit:', e);
  }
}

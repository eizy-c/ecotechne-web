'use server';

import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export async function logAudit(action: string, entity: string, entity_id: number | null, details: any) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;
    
    let user_id = null;
    
    if (token) {
      const decoded: any = jwt.verify(token, JWT_SECRET);
      user_id = decoded.user_id;
    }

    await prisma.auditLog.create({
      data: {
        user_id,
        action,
        entity,
        entity_id,
        details: details ? JSON.stringify(details) : null,
      }
    });
  } catch (error) {
    console.error('Failed to log audit:', error);
  }
}

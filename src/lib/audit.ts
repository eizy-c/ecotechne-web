import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

/**
 * Registra una acción en el Audit Log
 * @param action 'CREATE', 'UPDATE', 'DELETE', 'LOGIN'
 * @param entity 'User', 'Product', 'Service', etc.
 * @param entity_id ID del registro afectado (opcional)
 * @param details Detalles en JSON (opcional)
 */
export async function logAction(
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'LOGOUT',
  entity: string,
  entity_id?: number | null,
  details?: any,
  explicitUserId?: number
) {
  try {
    let user_id = explicitUserId || null;
    
    if (!user_id) {
      const session = await getSession();
      user_id = session?.id ? Number(session.id) : null;
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
    console.error('Error al registrar en Audit Log:', error);
    // Fallar silenciosamente para no interrumpir el flujo principal del usuario
  }
}

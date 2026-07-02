import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const perms = [
      { name: 'read:logs', description: 'Ver historial de auditoría' }, 
      { name: 'export:excel', description: 'Exportar datos a Excel' }, 
      { name: 'export:pdf', description: 'Exportar datos a PDF' }
    ]; 
    for (const p of perms) { 
      await prisma.permission.upsert({ where: { name: p.name }, update: {}, create: p }); 
    } 
    
    for (const p of perms) {
      const perm = await prisma.permission.findUnique({ where: { name: p.name }});
      if (perm) {
        await prisma.permissionRole.upsert({
          where: {
            permission_id_role_id: {
              permission_id: perm.permission_id,
              role_id: 1
            }
          },
          update: {},
          create: {
            permission_id: perm.permission_id,
            role_id: 1
          }
        });
      }
    }
    return NextResponse.json({ success: true, message: 'Seeded' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

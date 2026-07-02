const { PrismaClient } = require('@prisma/client'); 
const prisma = new PrismaClient(); 
async function main() { 
  const perms = [
    { name: 'read:logs', description: 'Ver historial de auditoría' }, 
    { name: 'export:excel', description: 'Exportar datos a Excel' }, 
    { name: 'export:pdf', description: 'Exportar datos a PDF' }
  ]; 
  for (const p of perms) { 
    await prisma.permission.upsert({ where: { name: p.name }, update: {}, create: p }); 
  } 
  
  // also give them to role 1 (Admin) automatically so we can test
  for (const p of perms) {
    const perm = await prisma.permission.findUnique({ where: { name: p.name }});
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
  console.log('Permisos insertados y asignados al rol 1'); 
} 
main().catch(console.error).finally(() => prisma.$disconnect());

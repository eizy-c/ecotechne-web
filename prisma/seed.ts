import prisma from '../src/lib/prisma';
import bcrypt from 'bcryptjs';

const PERMISSIONS = [
  // Dashboard
  { name: 'read:dashboard', description: 'Ver el inicio del panel de control' },
  // Productos
  { name: 'create:products', description: 'Crear productos' },
  { name: 'read:products', description: 'Ver productos' },
  { name: 'update:products', description: 'Modificar productos' },
  { name: 'delete:products', description: 'Eliminar productos' },
  // Categorías
  { name: 'create:categories', description: 'Crear categorías' },
  { name: 'read:categories', description: 'Ver categorías' },
  { name: 'update:categories', description: 'Modificar categorías' },
  { name: 'delete:categories', description: 'Eliminar categorías' },
  // Marcas
  { name: 'create:brands', description: 'Crear marcas' },
  { name: 'read:brands', description: 'Ver marcas' },
  { name: 'update:brands', description: 'Modificar marcas' },
  { name: 'delete:brands', description: 'Eliminar marcas' },
  // Modelos
  { name: 'create:models', description: 'Crear modelos de vehículos' },
  { name: 'read:models', description: 'Ver modelos' },
  { name: 'update:models', description: 'Modificar modelos' },
  { name: 'delete:models', description: 'Eliminar modelos' },
  // Vehículos
  { name: 'create:vehicles', description: 'Crear vehículos (años)' },
  { name: 'read:vehicles', description: 'Ver vehículos' },
  { name: 'update:vehicles', description: 'Modificar vehículos' },
  { name: 'delete:vehicles', description: 'Eliminar vehículos' },
  // Servicios
  { name: 'create:services', description: 'Crear servicios' },
  { name: 'read:services', description: 'Ver servicios' },
  { name: 'update:services', description: 'Modificar servicios' },
  { name: 'delete:services', description: 'Eliminar servicios' },
  // Galería
  { name: 'create:gallery', description: 'Subir imágenes a la galería' },
  { name: 'read:gallery', description: 'Ver galería' },
  { name: 'update:gallery', description: 'Modificar galería' },
  { name: 'delete:gallery', description: 'Eliminar imágenes de la galería' },
  // Usuarios
  { name: 'create:users', description: 'Crear usuarios' },
  { name: 'read:users', description: 'Ver usuarios' },
  { name: 'update:users', description: 'Modificar otros usuarios y roles' },
  { name: 'delete:users', description: 'Eliminar usuarios' },
  { name: 'update:profile', description: 'Modificar sus propios datos' },
  // Roles
  { name: 'create:roles', description: 'Crear nuevos roles' },
  { name: 'read:roles', description: 'Ver roles' },
  { name: 'update:roles', description: 'Modificar roles' },
  { name: 'delete:roles', description: 'Eliminar roles' },
  // Mensajes
  { name: 'read:messages', description: 'Ver mensajes de contacto' },
  { name: 'delete:messages', description: 'Eliminar mensajes' },
];

async function main() {
  console.log('Iniciando proceso de seeder...');

  // 1. Crear todos los permisos
  const createdPermissions = await Promise.all(
    PERMISSIONS.map(p => 
      prisma.permission.upsert({
        where: { name: p.name },
        update: {},
        create: p,
      })
    )
  );
  console.log(`✅ Creados ${createdPermissions.length} permisos.`);

  // 2. Definir permisos para Admin (TODOS)
  const adminPermissionConnect = createdPermissions.map(p => ({
    permission: { connect: { permission_id: p.permission_id } }
  }));

  const roleAdmin = await prisma.role.upsert({
    where: { name: 'admin' },
    update: {},
    create: {
      name: 'admin',
      description: 'Administrador del Sistema',
      permissions: { create: adminPermissionConnect },
    },
  });

  // 3. Definir permisos para Designer
  const designPermissionNames = [
    'read:dashboard',
    'create:products', 'read:products', 'update:products',
    'read:categories', 'read:brands', 'read:models', 'read:vehicles',
    'read:services', 'update:services',
    'create:gallery', 'read:gallery', 'update:gallery', 'delete:gallery',
    'update:profile'
  ];

  const designPermissionConnect = createdPermissions
    .filter(p => designPermissionNames.includes(p.name))
    .map(p => ({
      permission: { connect: { permission_id: p.permission_id } }
    }));

  const roleDesign = await prisma.role.upsert({
    where: { name: 'design' },
    update: {},
    create: {
      name: 'design',
      description: 'Diseñador Web',
      permissions: { create: designPermissionConnect },
    },
  });

  // 4. Crear Usuarios
  const adminPassword = await bcrypt.hash('admin123*', 10);
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@admin.com' },
    update: {},
    create: {
      email: 'admin@admin.com',
      name: 'Administrador',
      password: adminPassword,
      role_id: roleAdmin.role_id,
    },
  });

  const designPassword = await bcrypt.hash('design123*', 10);
  const designUser = await prisma.user.upsert({
    where: { email: 'design@design.com' },
    update: {},
    create: {
      email: 'design@design.com',
      name: 'Diseñador',
      password: designPassword,
      role_id: roleDesign.role_id,
    },
  });

  console.log('Seeder completado con éxito:');
  console.log(`✅ Roles creados: ${roleAdmin.name}, ${roleDesign.name}`);
  console.log(`✅ Usuarios creados: ${adminUser.email}, ${designUser.email}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

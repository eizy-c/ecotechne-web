import { Role } from '@/Models/Role';
import { Permission } from '@/Models/Permission';
import RolesList from './RolesList';
import prisma from '@/lib/prisma';

export default async function RolesPage() {
  // We need to fetch roles WITH their permissions for editing
  const roles = await prisma.role.findMany({
    include: { permissions: true }
  });
  
  const allPermissions = await Permission.findAll();

  // Serialize objects from DB to pass to Client Component
  const serializedRoles = JSON.parse(JSON.stringify(roles));
  const serializedPermissions = JSON.parse(JSON.stringify(allPermissions));

  return <RolesList initialRoles={serializedRoles} allPermissions={serializedPermissions} />;
}

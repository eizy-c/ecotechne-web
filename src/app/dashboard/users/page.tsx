import { User } from '@/Models/User';
import { Role } from '@/Models/Role';
import UsersList from './UsersList';

export default async function UsersPage() {
  const users = await User.findAll();
  const roles = await Role.findAll();

  // Serialize objects from DB to pass to Client Component
  const serializedUsers = JSON.parse(JSON.stringify(users));
  const serializedRoles = JSON.parse(JSON.stringify(roles));

  return <UsersList initialUsers={serializedUsers} roles={serializedRoles} />;
}

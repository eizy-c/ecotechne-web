'use client';

import { useState } from 'react';
import { Search, Plus, Edit } from 'lucide-react';
import DeleteButton from '@/components/ui/DeleteButton';
import UserModal from './UserModal';
import toast from 'react-hot-toast';
import DataTable, { ColumnDef } from '@/components/ui/DataTable';
import { deleteUser } from '@/actions/users';

export default function UsersList({ initialUsers, roles }: { initialUsers: any[], roles: any[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any | null>(null);

  const handleCreate = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const handleEdit = (user: any) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Usuarios y Roles</h1>
          <p className="text-sm text-foreground/60 mt-1">Gestiona los accesos y permisos administrativos del sistema.</p>
        </div>
        <button 
          onClick={handleCreate}
          className="bg-brand-accent hover:bg-brand-accent/90 text-brand-dark px-4 py-2 rounded-xl text-sm font-bold shadow-[0_0_15px_rgba(255,109,36,0.2)] transition-all flex items-center gap-2 btn-glow"
        >
          <Plus size={16} />
          Nuevo Usuario
        </button>
      </div>

      <DataTable 
        data={initialUsers}
        columns={[
          {
            header: 'Usuario',
            accessorKey: 'name',
            cell: (user) => (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand-accent/10 text-brand-accent flex items-center justify-center font-bold text-lg border border-brand-accent/20">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-medium text-foreground">{user.name}</p>
                  <p className="text-xs text-foreground/50">{user.email}</p>
                </div>
              </div>
            )
          },
          {
            header: 'Rol',
            accessorKey: 'role.name',
            cell: (user) => (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-500 border border-blue-500/20">
                {user.role?.name || 'Sin Rol'}
              </span>
            )
          },
          {
            header: 'Estado',
            accessorKey: 'status',
            cell: (user) => (
              <span className="inline-flex items-center gap-1.5 text-emerald-500 text-xs font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Activo
              </span>
            )
          },
          {
            header: 'Acciones',
            sortable: false,
            cell: (user) => (
              <div className="flex items-center justify-end gap-2">
                <button 
                  onClick={() => handleEdit(user)}
                  className="p-2 text-foreground/60 hover:text-brand-accent hover:bg-brand-accent/10 rounded-lg transition-colors"
                  title="Editar"
                >
                  <Edit size={16} />
                </button>
                <DeleteButton 
                  onDelete={async () => {
                    await deleteUser(user.user_id);
                  }}
                  itemName={user.name}
                />
              </div>
            )
          }
        ]}
        searchPlaceholder="Buscar usuario por nombre o correo..."
        searchKeys={['name', 'email', 'role.name']}
        itemsPerPage={10}
        enableExport={true}
        exportFilename="Reporte_Usuarios_Ecotechne"
      />

      <UserModal 
        key={isModalOpen ? (editingUser?.user_id || 'new') : 'closed'}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={editingUser}
        roles={roles}
      />
    </div>
  );
}

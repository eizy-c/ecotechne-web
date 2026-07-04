'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, Search, Edit } from 'lucide-react';
import { deleteRole } from '@/actions/roles';
import DeleteButton from '@/components/ui/DeleteButton';
import RoleModal from './RoleModal';
import toast from 'react-hot-toast';
import DataTable, { ColumnDef } from '@/components/ui/DataTable';

export default function RolesList({ initialRoles, allPermissions }: { initialRoles: any[], allPermissions: any[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<any | null>(null);

  // Group permissions
  const groupedPermissions = allPermissions.reduce((acc: any, perm: any) => {
    const module = perm.name.split(':')[1] || 'otros';
    if (!acc[module]) acc[module] = [];
    acc[module].push(perm);
    return acc;
  }, {});

  const handleCreate = () => {
    setEditingRole(null);
    setIsModalOpen(true);
  };

  const handleEdit = (role: any) => {
    setEditingRole(role);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Roles</h2>
          <p className="text-foreground/50 mt-1">Gestiona los niveles de acceso del sistema</p>
        </div>
        <button 
          onClick={handleCreate}
          className="bg-brand-accent text-brand-dark px-6 py-2.5 rounded-xl font-bold hover:scale-105 transition-transform flex items-center gap-2 shadow-[0_0_15px_rgba(255,109,36,0.2)]"
        >
          <Plus size={20} />
          <span>Añadir</span>
        </button>
      </div>

      <DataTable 
        data={initialRoles}
        columns={[
          {
            header: 'ID',
            accessorKey: 'role_id',
            cell: (role) => <span className="text-foreground/60">#{role.role_id}</span>
          },
          {
            header: 'Nombre',
            accessorKey: 'name',
            cell: (role) => <span className="font-semibold text-foreground">{role.name}</span>
          },
          {
            header: 'Descripción',
            accessorKey: 'description',
            cell: (role) => <span className="text-foreground/70">{role.description || '-'}</span>
          },
          {
            header: 'Acciones',
            sortable: false,
            cell: (role) => (
              <div className="flex items-center justify-end gap-2">
                <button 
                  onClick={() => handleEdit(role)}
                  className="p-2 text-foreground/50 hover:text-brand-accent hover:bg-brand-accent/10 rounded-lg transition-colors"
                  title="Editar"
                >
                  <Edit size={18} />
                </button>
                <DeleteButton 
                  onDelete={async () => {
                    await deleteRole(role.role_id);
                  }}
                  itemName={`Rol: ${role.name}`}
                />
              </div>
            )
          }
        ]}
        searchPlaceholder="Buscar rol..."
        searchKeys={['name', 'description']}
        itemsPerPage={10}
      />

      <RoleModal 
        key={isModalOpen ? (editingRole?.role_id || 'new') : 'closed'}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        role={editingRole}
        groupedPermissions={groupedPermissions}
        allPermissionsLength={allPermissions.length}
      />
    </div>
  );
}

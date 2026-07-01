'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, Search, Edit } from 'lucide-react';
import { deleteRole } from '@/actions/roles';
import DeleteButton from '@/components/ui/DeleteButton';
import RoleModal from './RoleModal';
import toast from 'react-hot-toast';

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
          <span>Nuevo Rol</span>
        </button>
      </div>

      <div className="glass-card rounded-2xl border border-card-border overflow-hidden">
        <div className="p-4 border-b border-card-border flex justify-between items-center bg-card/50">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" size={18} />
            <input 
              type="text" 
              placeholder="Buscar rol..." 
              className="w-full bg-background/50 border border-card-border rounded-lg pl-10 pr-4 py-2 text-sm text-foreground focus:outline-none focus:border-brand-accent transition-colors"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-foreground/5 text-foreground/70 uppercase font-semibold text-xs tracking-wider">
              <tr>
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Nombre</th>
                <th className="px-6 py-4">Descripción</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-card-border">
              {initialRoles.map((role) => (
                <tr key={role.role_id} className="hover:bg-foreground/5 transition-colors group">
                  <td className="px-6 py-4 text-foreground/60">#{role.role_id}</td>
                  <td className="px-6 py-4 font-semibold text-foreground group-hover:text-brand-accent transition-colors">
                    {role.name}
                  </td>
                  <td className="px-6 py-4 text-foreground/70">{role.description || '-'}</td>
                  <td className="px-6 py-4 text-right">
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
                          toast.success('Rol eliminado correctamente');
                        }}
                        itemName={`Rol: ${role.name}`}
                      />
                    </div>
                  </td>
                </tr>
              ))}
              
              {initialRoles.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-foreground/50">
                    No hay roles registrados en el sistema.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <RoleModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        role={editingRole}
        groupedPermissions={groupedPermissions}
        allPermissionsLength={allPermissions.length}
      />
    </div>
  );
}

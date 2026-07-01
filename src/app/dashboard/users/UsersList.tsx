'use client';

import { useState } from 'react';
import { Search, Plus, Edit } from 'lucide-react';
import DeleteButton from '@/components/ui/DeleteButton';
import { deleteUser } from '@/actions/users';
import UserModal from './UserModal';
import toast from 'react-hot-toast';

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

      <div className="glass-card rounded-2xl overflow-hidden border border-card-border">
        {/* Table Toolbar */}
        <div className="p-4 border-b border-card-border flex justify-between items-center bg-foreground/5">
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" size={16} />
            <input 
              type="text" 
              placeholder="Buscar usuario..." 
              className="w-full bg-background border border-card-border rounded-lg pl-10 pr-4 py-2 text-sm text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-brand-accent/50 focus:ring-1 focus:ring-brand-accent/50 transition-all"
            />
          </div>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-xs uppercase tracking-wider text-foreground/50 border-b border-card-border bg-foreground/5">
                <th className="px-6 py-4 font-semibold">Usuario</th>
                <th className="px-6 py-4 font-semibold">Rol</th>
                <th className="px-6 py-4 font-semibold">Estado</th>
                <th className="px-6 py-4 font-semibold text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-card-border/50">
              {initialUsers.map((user: any) => (
                <tr key={user.user_id} className="hover:bg-foreground/5 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-brand-accent/10 text-brand-accent flex items-center justify-center font-bold text-lg border border-brand-accent/20">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{user.name}</p>
                        <p className="text-xs text-foreground/50">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-500 border border-blue-500/20">
                      {user.role?.name || 'Sin Rol'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 text-emerald-500 text-xs font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      Activo
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
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
                          toast.success('Usuario eliminado correctamente');
                        }}
                        itemName={user.name}
                      />
                    </div>
                  </td>
                </tr>
              ))}
              
              {initialUsers.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-foreground/50">
                    No se encontraron usuarios en el sistema.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <UserModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={editingUser}
        roles={roles}
      />
    </div>
  );
}

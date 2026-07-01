'use client';

import { useState } from 'react';
import Modal from '@/components/ui/Modal';
import { createRole, updateRole } from '@/actions/roles';
import { Save } from 'lucide-react';
import toast from 'react-hot-toast';

interface RoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  role?: any | null;
  groupedPermissions: any;
  allPermissionsLength: number;
}

export default function RoleModal({ isOpen, onClose, role, groupedPermissions, allPermissionsLength }: RoleModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);

    try {
      if (role) {
        await updateRole(role.role_id, formData);
        toast.success('Rol actualizado correctamente');
      } else {
        await createRole(formData);
        toast.success('Rol creado correctamente');
      }
      onClose();
    } catch (err: any) {
      if (err.message !== 'NEXT_REDIRECT') {
        setError(err.message || 'Ocurrió un error al guardar');
      }
    } finally {
      setLoading(false);
    }
  };

  const currentPermissionIds = role?.permissions?.map((p: any) => p.permission_id) || [];

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={role ? 'Editar Rol' : 'Nuevo Rol'}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="name" className="block text-sm font-semibold text-foreground mb-2">Nombre del Rol *</label>
          <input 
            type="text" 
            id="name"
            name="name"
            required
            defaultValue={role?.name || ''}
            placeholder="Ej: Editor, Moderador..."
            className="w-full bg-background/50 border border-card-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-brand-accent transition-colors"
          />
        </div>
        
        <div>
          <label htmlFor="description" className="block text-sm font-semibold text-foreground mb-2">Descripción</label>
          <textarea 
            id="description"
            name="description"
            rows={3}
            defaultValue={role?.description || ''}
            placeholder="Breve explicación..."
            className="w-full bg-background/50 border border-card-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-brand-accent transition-colors resize-none"
          ></textarea>
        </div>

        <div>
          <label className="block text-sm font-semibold text-foreground mb-4">Permisos Asignados</label>
          <div className="space-y-6 max-h-64 overflow-y-auto pr-2 rounded-xl border border-card-border p-4 bg-background/30">
            {Object.entries(groupedPermissions).map(([module, perms]: [string, any]) => (
              <div key={module} className="bg-background/50 p-4 rounded-xl border border-card-border/50">
                <h4 className="font-bold text-foreground capitalize mb-3 text-sm border-b border-card-border/50 pb-2">{module}</h4>
                <div className="grid grid-cols-1 gap-2">
                  {perms.map((perm: any) => (
                    <label key={perm.permission_id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-foreground/5 cursor-pointer transition-colors border border-transparent hover:border-card-border">
                      <input 
                        type="checkbox" 
                        name="permissions" 
                        value={perm.permission_id}
                        defaultChecked={currentPermissionIds.includes(perm.permission_id)}
                        className="mt-1 w-4 h-4 rounded border-card-border text-brand-accent focus:ring-brand-accent bg-background shrink-0"
                      />
                      <div>
                        <div className="text-sm text-foreground">{perm.description || perm.name}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            ))}
            {allPermissionsLength === 0 && (
              <div className="text-sm text-foreground/50 italic py-4 text-center">
                No hay permisos creados en el sistema.
              </div>
            )}
          </div>
        </div>

        <div className="pt-4 flex justify-end gap-3">
          <button 
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl font-semibold text-foreground hover:bg-foreground/5 transition-colors"
          >
            Cancelar
          </button>
          <button 
            type="submit"
            disabled={loading}
            className="bg-brand-accent text-brand-dark px-8 py-2.5 rounded-xl font-bold hover:scale-105 transition-transform flex items-center gap-2 shadow-[0_0_15px_rgba(255,109,36,0.2)] disabled:opacity-50 disabled:hover:scale-100"
          >
            <Save size={20} />
            <span>{loading ? 'Guardando...' : 'Guardar'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
}

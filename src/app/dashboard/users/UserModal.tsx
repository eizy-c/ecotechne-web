'use client';

import { useState } from 'react';
import Modal from '@/components/ui/Modal';
import { createUser, updateUser } from '@/actions/users';
import { Save } from 'lucide-react';
import toast from 'react-hot-toast';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user?: any | null;
  roles: any[];
}

export default function UserModal({ isOpen, onClose, user, roles }: UserModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);

    try {
      if (user) {
        await updateUser(user.user_id, formData);
        toast.success('Usuario actualizado correctamente');
      } else {
        await createUser(formData);
        toast.success('Usuario creado correctamente');
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

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={user ? 'Editar Usuario' : 'Nuevo Usuario'}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="name" className="block text-sm font-semibold text-foreground mb-2">Nombre Completo *</label>
          <input 
            type="text" 
            id="name"
            name="name"
            required
            defaultValue={user?.name || ''}
            className="w-full bg-background/50 border border-card-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-brand-accent transition-colors"
          />
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-foreground mb-2">Correo Electrónico *</label>
          <input 
            type="email" 
            id="email"
            name="email"
            required
            defaultValue={user?.email || ''}
            className="w-full bg-background/50 border border-card-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-brand-accent transition-colors"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-semibold text-foreground mb-2">
            Contraseña {user ? '(Dejar en blanco para no cambiar)' : '*'}
          </label>
          <input 
            type="password" 
            id="password"
            name="password"
            required={!user}
            placeholder={user ? "Nueva contraseña..." : "Contraseña secreta"}
            className="w-full bg-background/50 border border-card-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-brand-accent transition-colors"
          />
        </div>

        <div>
          <label htmlFor="role_id" className="block text-sm font-semibold text-foreground mb-2">Rol Asignado *</label>
          <select 
            id="role_id"
            name="role_id"
            required
            defaultValue={user?.role_id || ''}
            className="w-full bg-background/50 border border-card-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-brand-accent transition-colors"
          >
            <option value="">Selecciona un rol...</option>
            {roles.map(role => (
              <option key={role.role_id} value={role.role_id}>{role.name}</option>
            ))}
          </select>
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

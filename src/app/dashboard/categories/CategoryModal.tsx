'use client';

import { useState } from 'react';
import Modal from '@/components/ui/Modal';
import { createCategory, updateCategory } from '@/actions/categories';
import { Save } from 'lucide-react';
import toast from 'react-hot-toast';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  category?: { category_id: number; name: string } | null;
}

export default function CategoryModal({ isOpen, onClose, category }: CategoryModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);

    try {
      if (category) {
        await updateCategory(category.category_id, formData);
        toast.success('Categoría actualizada correctamente');
      } else {
        await createCategory(formData);
        toast.success('Categoría creada correctamente');
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
      title={category ? 'Editar Categoría' : 'Nueva Categoría'}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="name" className="block text-sm font-semibold text-foreground mb-2">Nombre de la Categoría *</label>
          <input 
            type="text" 
            id="name"
            name="name"
            required
            defaultValue={category?.name || ''}
            placeholder="Ej: Defensas Frontales..."
            className="w-full bg-background/50 border border-card-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-brand-accent transition-colors"
          />
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

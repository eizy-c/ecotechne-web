'use client';

import { useState } from 'react';
import { Tag, Plus, Edit } from 'lucide-react';
import DeleteButton from '@/components/ui/DeleteButton';
import { deleteCategory } from '@/actions/categories';
import CategoryModal from './CategoryModal';
import toast from 'react-hot-toast';

interface Category {
  category_id: number;
  name: string;
}

export default function CategoriesList({ initialCategories }: { initialCategories: Category[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const handleCreate = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Categorías de Productos</h2>
          <p className="text-foreground/50 mt-1">Organiza tu catálogo en diferentes secciones</p>
        </div>
        <button 
          onClick={handleCreate}
          className="bg-brand-accent text-brand-dark px-6 py-3 rounded-xl font-bold hover:scale-105 transition-transform flex items-center gap-2 shadow-[0_0_15px_rgba(255,109,36,0.2)]"
        >
          <Plus size={20} />
          <span>Nueva Categoría</span>
        </button>
      </div>

      <div className="glass-card rounded-2xl border border-card-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-card-border/50 bg-foreground/5">
                <th className="p-4 font-semibold text-foreground/80">Nombre</th>
                <th className="p-4 font-semibold text-foreground/80 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-card-border/50">
              {initialCategories.map((category) => (
                <tr key={category.category_id} className="hover:bg-foreground/5 transition-colors group">
                  <td className="p-4 font-medium text-foreground flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-brand-accent/10 flex items-center justify-center text-brand-accent">
                      <Tag size={20} />
                    </div>
                    {category.name}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleEdit(category)}
                        className="p-2 text-foreground/50 hover:text-brand-accent hover:bg-brand-accent/10 rounded-lg transition-colors"
                        title="Editar"
                      >
                        <Edit size={18} />
                      </button>
                      <DeleteButton 
                        onDelete={async () => {
                          await deleteCategory(category.category_id);
                          toast.success('Categoría eliminada correctamente');
                        }}
                        itemName={`la categoría ${category.name}`}
                      />
                    </div>
                  </td>
                </tr>
              ))}
              {initialCategories.length === 0 && (
                <tr>
                  <td colSpan={2} className="p-8 text-center text-foreground/50 italic">
                    No hay categorías registradas.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <CategoryModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        category={editingCategory}
      />
    </div>
  );
}

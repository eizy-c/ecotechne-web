'use client';

import { useState } from 'react';
import { Tag, Plus, Edit } from 'lucide-react';
import DeleteButton from '@/components/ui/DeleteButton';
import { deleteCategory } from '@/actions/categories';
import CategoryModal from './CategoryModal';
import toast from 'react-hot-toast';
import DataTable, { ColumnDef } from '@/components/ui/DataTable';

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

      <DataTable 
        data={initialCategories}
        columns={[
          {
            header: 'Nombre',
            accessorKey: 'name',
            cell: (category) => (
              <div className="font-medium text-foreground flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-brand-accent/10 flex items-center justify-center text-brand-accent">
                  <Tag size={20} />
                </div>
                {category.name}
              </div>
            )
          },
          {
            header: 'Acciones',
            sortable: false,
            cell: (category) => (
              <div className="flex items-center justify-end gap-2">
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
                  }}
                  itemName={`la categoría ${category.name}`}
                />
              </div>
            )
          }
        ]}
        searchPlaceholder="Buscar categoría..."
        searchKeys={['name']}
        itemsPerPage={10}
      />

      <CategoryModal 
        key={isModalOpen ? (editingCategory?.category_id || 'new') : 'closed'}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        category={editingCategory}
      />
    </div>
  );
}

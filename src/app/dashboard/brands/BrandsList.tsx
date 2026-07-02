'use client';

import { useState } from 'react';
import { Plus, Edit, Tag } from 'lucide-react';
import DeleteButton from '@/components/ui/DeleteButton';
import BrandModal from './BrandModal';
import toast from 'react-hot-toast';
import DataTable from '@/components/ui/DataTable';
import { deleteBrand } from '@/actions/brands';

interface Brand {
  brand_id: number;
  name: string;
}

export default function BrandsList({ initialBrands }: { initialBrands: Brand[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);

  const handleCreate = () => {
    setEditingBrand(null);
    setIsModalOpen(true);
  };

  const handleEdit = (brand: Brand) => {
    setEditingBrand(brand);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Marcas</h2>
          <p className="text-foreground/50 mt-1">Gestiona las marcas disponibles en tu tienda</p>
        </div>
        <button 
          onClick={handleCreate}
          className="bg-brand-accent text-brand-dark px-6 py-3 rounded-xl font-bold hover:scale-105 transition-transform flex items-center gap-2 shadow-[0_0_15px_rgba(255,109,36,0.2)]"
        >
          <Plus size={20} />
          <span>Nueva Marca</span>
        </button>
      </div>

      <DataTable 
        data={initialBrands}
        columns={[
          {
            header: 'Nombre',
            accessorKey: 'name',
            cell: (brand) => (
              <div className="font-medium text-foreground flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-brand-accent/10 flex items-center justify-center text-brand-accent">
                  <Tag size={20} />
                </div>
                {brand.name}
              </div>
            )
          },
          {
            header: 'Acciones',
            sortable: false,
            cell: (brand) => (
              <div className="flex items-center justify-end gap-2">
                <button 
                  onClick={() => handleEdit(brand)}
                  className="p-2 text-foreground/50 hover:text-brand-accent hover:bg-brand-accent/10 rounded-lg transition-colors"
                  title="Editar"
                >
                  <Edit size={18} />
                </button>
                <DeleteButton 
                  onDelete={async () => {
                    await deleteBrand(brand.brand_id);
                  }}
                  itemName={`la marca ${brand.name}`}
                />
              </div>
            )
          }
        ]}
        searchPlaceholder="Buscar marca..."
        searchKeys={['name']}
        itemsPerPage={10}
      />

      <BrandModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        brand={editingBrand}
      />
    </div>
  );
}

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, Search, Edit } from 'lucide-react';
import { deleteGallery } from '@/actions/gallery';
import Image from 'next/image';
import DeleteButton from '@/components/ui/DeleteButton';
import GalleryModal from './GalleryModal';
import toast from 'react-hot-toast';
import DataTable, { ColumnDef } from '@/components/ui/DataTable';
import { formatRelativeDate } from '@/lib/formatDate';

export default function GalleriesList({ initialGalleries }: { initialGalleries: any[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGallery, setEditingGallery] = useState<any | null>(null);

  const handleCreate = () => {
    setEditingGallery(null);
    setIsModalOpen(true);
  };

  const handleEdit = (gallery: any) => {
    setEditingGallery(gallery);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Galería</h2>
          <p className="text-foreground/50 mt-1">Gestiona las imágenes de tu portafolio</p>
        </div>
        <button 
          onClick={handleCreate}
          className="bg-brand-accent text-brand-dark px-6 py-2.5 rounded-xl font-bold hover:scale-105 transition-transform flex items-center gap-2 shadow-[0_0_15px_rgba(255,109,36,0.2)]"
        >
          <Plus size={20} />
          <span>Nueva Imagen</span>
        </button>
      </div>

      <DataTable 
        data={initialGalleries}
        columns={[
          {
            header: 'Imagen',
            accessorKey: 'title', // Sort by title since it's hard to sort by image
            cell: (item) => (
              <div className="w-16 h-16 rounded-xl overflow-hidden relative border border-card-border bg-background">
                <Image 
                  src={item.image_url} 
                  alt={item.title}
                  fill
                  className="object-cover"
                />
              </div>
            )
          },
          {
            header: 'Título',
            accessorKey: 'title',
            cell: (item) => <span className="font-semibold text-foreground">{item.title}</span>
          },
          {
            header: 'Descripción',
            accessorKey: 'description',
            cell: (item) => <span className="text-foreground/70 max-w-xs truncate block">{item.description || '-'}</span>
          },
          {
            header: 'Fecha',
            accessorKey: 'created_at',
            cell: (item) => <span className="text-foreground/70" title={new Date(item.created_at).toLocaleString('es-ES')}>{formatRelativeDate(item.created_at)}</span>
          },
          {
            header: 'Acciones',
            sortable: false,
            cell: (item) => (
              <div className="flex items-center justify-end gap-2">
                <button 
                  onClick={() => handleEdit(item)}
                  className="p-2 text-foreground/50 hover:text-brand-accent hover:bg-brand-accent/10 rounded-lg transition-colors"
                  title="Editar"
                >
                  <Edit size={18} />
                </button>
                <DeleteButton 
                  onDelete={async () => {
                    await deleteGallery(item.gallery_id);
                  }}
                  itemName={`Imagen: ${item.title}`}
                />
              </div>
            )
          }
        ]}
        searchPlaceholder="Buscar imagen..."
        searchKeys={['title', 'description']}
        itemsPerPage={10}
      />

      <GalleryModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        gallery={editingGallery}
      />
    </div>
  );
}

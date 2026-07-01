'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, Search, Edit } from 'lucide-react';
import { deleteGallery } from '@/actions/gallery';
import Image from 'next/image';
import DeleteButton from '@/components/ui/DeleteButton';
import GalleryModal from './GalleryModal';
import toast from 'react-hot-toast';

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

      <div className="glass-card rounded-2xl border border-card-border overflow-hidden">
        <div className="p-4 border-b border-card-border flex justify-between items-center bg-card/50">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" size={18} />
            <input 
              type="text" 
              placeholder="Buscar..." 
              className="w-full bg-background/50 border border-card-border rounded-lg pl-10 pr-4 py-2 text-sm text-foreground focus:outline-none focus:border-brand-accent transition-colors"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-foreground/5 text-foreground/70 uppercase font-semibold text-xs tracking-wider">
              <tr>
                <th className="px-6 py-4">Imagen</th>
                <th className="px-6 py-4">Título</th>
                <th className="px-6 py-4">Descripción</th>
                <th className="px-6 py-4">Fecha</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-card-border">
              {initialGalleries.map((item) => (
                <tr key={item.gallery_id} className="hover:bg-foreground/5 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="w-16 h-16 rounded-xl overflow-hidden relative border border-card-border bg-background">
                      <Image 
                        src={item.image_url} 
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4 font-semibold text-foreground group-hover:text-brand-accent transition-colors">
                    {item.title}
                  </td>
                  <td className="px-6 py-4 text-foreground/70 max-w-xs truncate">{item.description || '-'}</td>
                  <td className="px-6 py-4 text-foreground/70">
                    {new Date(item.created_at).toLocaleDateString('es-ES')}
                  </td>
                  <td className="px-6 py-4 text-right">
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
                          toast.success('Imagen de la galería eliminada');
                        }}
                        itemName={`Imagen: ${item.title}`}
                      />
                    </div>
                  </td>
                </tr>
              ))}
              
              {initialGalleries.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-foreground/50">
                    No hay imágenes en la galería. ¡Sube la primera!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <GalleryModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        gallery={editingGallery}
      />
    </div>
  );
}

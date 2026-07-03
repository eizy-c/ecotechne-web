'use client';

import { useState, useEffect } from 'react';
import Modal from '@/components/ui/Modal';
import { createAlbum, updateAlbum } from '@/actions/gallery';
import toast from 'react-hot-toast';

export default function AlbumModal({ 
  isOpen, 
  onClose, 
  album 
}: { 
  isOpen: boolean; 
  onClose: () => void;
  album?: any;
}) {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (isOpen) {
      setName(album?.name || '');
      setDescription(album?.description || '');
    }
  }, [isOpen, album]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);

      if (album) {
        await updateAlbum(album.album_id, formData);
        toast.success('Álbum actualizado correctamente');
      } else {
        await createAlbum(formData);
        toast.success('Álbum creado correctamente');
      }
      onClose();
    } catch (error: any) {
      toast.error(error.message || 'Ocurrió un error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={album ? 'Editar Álbum' : 'Nuevo Álbum'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Nombre Interno del Álbum</label>
          <input 
            type="text" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-background border border-card-border rounded-lg px-4 py-2"
            placeholder="Ej: Instalación Parachoque Toyota 2024"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Descripción</label>
          <textarea 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-background border border-card-border rounded-lg px-4 py-2 min-h-[100px]"
            placeholder="Detalles sobre este lote de fotos..."
          />
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg bg-card border border-card-border">Cancelar</button>
          <button type="submit" disabled={loading} className="px-4 py-2 rounded-lg bg-brand-accent text-brand-dark font-bold disabled:opacity-50">
            {loading ? 'Guardando...' : 'Guardar Álbum'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

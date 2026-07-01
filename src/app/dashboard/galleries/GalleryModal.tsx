'use client';

import { useState } from 'react';
import Modal from '@/components/ui/Modal';
import { createGallery, updateGallery } from '@/actions/gallery';
import { Save, Upload } from 'lucide-react';
import Image from 'next/image';
import toast from 'react-hot-toast';

interface GalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  gallery?: any | null;
}

export default function GalleryModal({ isOpen, onClose, gallery }: GalleryModalProps) {
  const [preview, setPreview] = useState<string | null>(gallery?.image_url || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
    } else {
      setPreview(gallery?.image_url || null);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);

    try {
      if (gallery) {
        await updateGallery(gallery.gallery_id, formData);
        toast.success('Imagen de galería actualizada');
      } else {
        await createGallery(formData);
        toast.success('Imagen agregada a la galería');
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
      title={gallery ? 'Editar Imagen' : 'Nueva Imagen'}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="title" className="block text-sm font-semibold text-foreground mb-2">Título *</label>
          <input 
            type="text" 
            id="title"
            name="title"
            required
            defaultValue={gallery?.title || ''}
            className="w-full bg-background/50 border border-card-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-brand-accent transition-colors"
          />
        </div>
        
        <div>
          <label htmlFor="description" className="block text-sm font-semibold text-foreground mb-2">Descripción</label>
          <textarea 
            id="description"
            name="description"
            rows={3}
            defaultValue={gallery?.description || ''}
            className="w-full bg-background/50 border border-card-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-brand-accent transition-colors resize-none"
          ></textarea>
        </div>

        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">Imagen {gallery ? '(Opcional cambiar)' : '*'}</label>
          <div className="relative border-2 border-dashed border-card-border rounded-2xl hover:border-brand-accent transition-colors bg-background/30 group overflow-hidden">
            <input 
              type="file" 
              name="image" 
              id="image" 
              accept="image/*"
              required={!gallery}
              onChange={handleImageChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div className="flex flex-col items-center justify-center p-8 text-center pointer-events-none">
              {preview ? (
                <div className="relative w-full aspect-video rounded-xl overflow-hidden">
                  <Image src={preview} alt="Vista previa" fill className="object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white font-semibold flex items-center gap-2"><Upload size={18} /> Cambiar Imagen</span>
                  </div>
                </div>
              ) : (
                <div className="py-8">
                  <Upload size={48} className="mx-auto text-foreground/30 mb-4 group-hover:text-brand-accent transition-colors" />
                  <p className="text-foreground/70 font-medium">Haz clic o arrastra una nueva imagen aquí</p>
                </div>
              )}
            </div>
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

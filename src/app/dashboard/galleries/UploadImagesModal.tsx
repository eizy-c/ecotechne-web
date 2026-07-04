'use client';

import { useState } from 'react';
import Modal from '@/components/ui/Modal';
import { uploadGalleryImages } from '@/actions/gallery';
import toast from 'react-hot-toast';
import { UploadCloud, X } from 'lucide-react';
import Image from 'next/image';

export default function UploadImagesModal({ 
  isOpen, 
  onClose, 
  albumId 
}: { 
  isOpen: boolean; 
  onClose: () => void;
  albumId?: number | null;
}) {
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setSelectedFiles(prev => [...prev, ...newFiles]);
      
      const newPreviews = newFiles.map(file => URL.createObjectURL(file));
      setPreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const removeFile = (index: number) => {
    URL.revokeObjectURL(previews[index]);
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFiles.length === 0) {
      toast.error('Debes seleccionar al menos una imagen');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('description', description);
      if (albumId) {
        formData.append('album_id', albumId.toString());
      }
      
      selectedFiles.forEach(file => {
        formData.append('images', file);
      });

      await uploadGalleryImages(formData);
      toast.success('Imágenes subidas correctamente');
      
      // Reset
      setSelectedFiles([]);
      setPreviews([]);
      setDescription('');
      onClose();
    } catch (error: any) {
      toast.error(error.message || 'Ocurrió un error al subir');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={albumId ? 'Añadir Fotos al Álbum' : 'Subir Fotos Sueltas'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Descripción para estas fotos</label>
          <textarea 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-background border border-card-border rounded-lg px-4 py-2 min-h-[80px]"
            placeholder="Ej: Vista lateral, proceso de pulido..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Imágenes</label>
          <div className="border-2 border-dashed border-brand-accent/50 rounded-xl p-8 text-center hover:bg-brand-accent/5 transition-colors cursor-pointer relative">
            <input 
              type="file" 
              multiple 
              accept="image/*" 
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <UploadCloud className="mx-auto h-12 w-12 text-brand-accent/70 mb-2" />
            <p className="text-foreground/70 font-medium">Haz clic o arrastra fotos aquí</p>
            <p className="text-xs text-foreground/50 mt-1">Puedes seleccionar múltiples archivos a la vez</p>
          </div>
        </div>

        {previews.length > 0 && (
          <div className="grid grid-cols-4 gap-2 mt-4 max-h-48 overflow-y-auto pr-2">
            {previews.map((preview, i) => (
              <div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-card-border">
                <Image src={preview} alt="Preview" fill unoptimized={true} className="object-cover" />
                <button 
                  type="button" 
                  onClick={() => removeFile(i)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 shadow-md hover:scale-110 transition-transform"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-end gap-2 pt-4">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg bg-card border border-card-border">Cancelar</button>
          <button 
            type="submit" 
            disabled={loading || selectedFiles.length === 0} 
            className="px-4 py-2 rounded-lg bg-brand-accent text-brand-dark font-bold disabled:opacity-50"
          >
            {loading ? 'Subiendo...' : `Subir ${selectedFiles.length} fotos`}
          </button>
        </div>
      </form>
    </Modal>
  );
}

'use client';

import { useState, useEffect } from 'react';
import Modal from '@/components/ui/Modal';
import { getAlbums, getGalleryImages } from '@/actions/gallery';
import Image from 'next/image';
import { CheckCircle2, Folder, Image as ImageIcon } from 'lucide-react';

export default function MediaPicker({ 
  isOpen, 
  onClose, 
  onSelect 
}: { 
  isOpen: boolean; 
  onClose: () => void;
  onSelect: (selectedImageIds: number[]) => void;
}) {
  const [albums, setAlbums] = useState<any[]>([]);
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (isOpen) {
      loadMedia();
    }
  }, [isOpen]);

  const loadMedia = async () => {
    setLoading(true);
    try {
      const fetchedAlbums = await getAlbums();
      const fetchedImages = await getGalleryImages();
      setAlbums(fetchedAlbums);
      setImages(fetchedImages);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const looseImages = images.filter((img: any) => img.album_id === null);

  const toggleImage = (id: number) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedIds(newSet);
  };

  const toggleAlbum = (album: any) => {
    const albumImageIds = album.images?.map((img: any) => img.image_id) || [];
    if (albumImageIds.length === 0) return;

    const newSet = new Set(selectedIds);
    // If all are selected, deselect all. Otherwise, select all.
    const allSelected = albumImageIds.every((id: number) => newSet.has(id));
    
    if (allSelected) {
      albumImageIds.forEach((id: number) => newSet.delete(id));
    } else {
      albumImageIds.forEach((id: number) => newSet.add(id));
    }
    
    setSelectedIds(newSet);
  };

  const handleConfirm = () => {
    onSelect(Array.from(selectedIds));
    setSelectedIds(new Set());
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Seleccionar desde Banco de Imágenes">
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-accent"></div>
        </div>
      ) : (
        <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
          
          {/* ÁLBUMES */}
          {albums.length > 0 && (
            <section>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Folder className="text-brand-accent" size={18} />
                Seleccionar por Álbum
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {albums.map((album: any) => {
                  const albumImageIds = album.images?.map((img: any) => img.image_id) || [];
                  const allSelected = albumImageIds.length > 0 && albumImageIds.every((id: number) => selectedIds.has(id));
                  
                  return (
                    <div 
                      key={album.album_id} 
                      onClick={() => toggleAlbum(album)}
                      className={`cursor-pointer border rounded-xl p-3 flex flex-col justify-between transition-colors relative
                        ${allSelected ? 'border-brand-accent bg-brand-accent/10' : 'border-card-border bg-card hover:border-brand-accent/50'}
                      `}
                    >
                      {allSelected && (
                        <CheckCircle2 className="absolute top-2 right-2 text-brand-accent" size={18} />
                      )}
                      <h4 className="font-bold text-sm truncate pr-6" title={album.name}>{album.name}</h4>
                      <p className="text-xs text-foreground/60 mt-2">{album.images?.length || 0} fotos</p>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* FOTOS SUELTAS */}
          {looseImages.length > 0 && (
            <section>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <ImageIcon className="text-brand-accent" size={18} />
                Fotos Sueltas
              </h3>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                {looseImages.map((img: any) => {
                  const isSelected = selectedIds.has(img.image_id);
                  return (
                    <div 
                      key={img.image_id} 
                      onClick={() => toggleImage(img.image_id)}
                      className={`cursor-pointer relative aspect-square rounded-lg overflow-hidden border-2 transition-all
                        ${isSelected ? 'border-brand-accent scale-95' : 'border-transparent hover:border-brand-accent/50'}
                      `}
                    >
                      <Image 
                        src={img.image_url} 
                        alt="Gallery Image"
                        fill
                        className="object-cover"
                      />
                      {isSelected && (
                        <div className="absolute inset-0 bg-brand-accent/20 flex items-center justify-center">
                          <CheckCircle2 className="text-white drop-shadow-md" size={32} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {albums.length === 0 && looseImages.length === 0 && (
            <p className="text-center text-foreground/50 py-8">Tu banco de imágenes está vacío.</p>
          )}

        </div>
      )}

      <div className="flex justify-end gap-2 pt-4 mt-4 border-t border-card-border">
        <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg bg-card border border-card-border">Cancelar</button>
        <button 
          type="button" 
          onClick={handleConfirm}
          disabled={selectedIds.size === 0} 
          className="px-4 py-2 rounded-lg bg-brand-accent text-brand-dark font-bold disabled:opacity-50"
        >
          Añadir {selectedIds.size} fotos
        </button>
      </div>
    </Modal>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { getGalleries } from '@/actions/gallery';
import Image from 'next/image';
import { Image as ImageIcon, X, CheckCircle2, Plus } from 'lucide-react';

export default function MultiMediaPickerModal({ 
  name, 
  defaultValues = [] 
}: { 
  name: string;
  defaultValues?: string[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [images, setImages] = useState<any[]>([]);
  const [selectedUrls, setSelectedUrls] = useState<string[]>(defaultValues);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && images.length === 0) {
      setLoading(true);
      getGalleries().then((data) => {
        setImages(data);
        setLoading(false);
      });
    }
  }, [isOpen]);

  const toggleSelect = (url: string) => {
    if (selectedUrls.includes(url)) {
      setSelectedUrls(selectedUrls.filter(u => u !== url));
    } else {
      setSelectedUrls([...selectedUrls, url]);
    }
  };

  const removeImage = (url: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedUrls(selectedUrls.filter(u => u !== url));
  };

  return (
    <div>
      {/* Hidden inputs to send to FormData */}
      {selectedUrls.map((url, i) => (
        <input key={i} type="hidden" name={name} value={url} />
      ))}
      {selectedUrls.length === 0 && (
        <input type="hidden" name={name} value="" /> // Empty fallback
      )}
      
      {/* Selected Images Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
        {selectedUrls.map((url, i) => (
          <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-card-border group">
            <Image src={url} alt="Selected" fill className="object-cover" />
            <button 
              type="button"
              onClick={(e) => removeImage(url, e)}
              className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110"
            >
              <X size={14} />
            </button>
          </div>
        ))}
        
        {/* Add Button */}
        <div 
          onClick={() => setIsOpen(true)}
          className="aspect-square border-2 border-dashed border-card-border rounded-xl bg-background/50 hover:bg-foreground/5 hover:border-brand-accent transition-all cursor-pointer flex flex-col items-center justify-center text-foreground/50 hover:text-brand-accent"
        >
          <Plus size={32} />
          <span className="text-sm mt-2 font-medium">Añadir Imágenes</span>
        </div>
      </div>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-background/80 backdrop-blur-md">
          <div className="bg-card border border-card-border rounded-2xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl animate-fade-in-up">
            
            {/* Modal Header */}
            <div className="p-4 border-b border-card-border flex justify-between items-center bg-background/50 rounded-t-2xl">
              <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                <ImageIcon className="text-brand-accent" />
                Seleccionar Imágenes ({selectedUrls.length})
              </h3>
              <button 
                type="button"
                onClick={() => setIsOpen(false)}
                className="bg-brand-accent text-brand-dark px-6 py-2 rounded-xl font-bold hover:scale-105 transition-transform"
              >
                Hecho
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 text-brand-accent">
                  <i className="fa-solid fa-spinner fa-spin text-4xl mb-4"></i>
                  <p>Cargando galería...</p>
                </div>
              ) : images.length === 0 ? (
                <div className="text-center py-20 text-foreground/50">
                  <ImageIcon size={48} className="mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">La galería está vacía</p>
                  <p className="text-sm mt-1">Sube imágenes desde el módulo de Galería primero.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {images.map((img) => {
                    const isSelected = selectedUrls.includes(img.image_url);
                    return (
                      <div 
                        key={img.gallery_id}
                        onClick={() => toggleSelect(img.image_url)}
                        className={`relative aspect-square rounded-xl overflow-hidden cursor-pointer border-2 transition-all group ${
                          isSelected 
                            ? 'border-brand-accent scale-95 shadow-[0_0_15px_rgba(255,109,36,0.3)]' 
                            : 'border-transparent hover:border-foreground/30'
                        }`}
                      >
                        <Image 
                          src={img.image_url} 
                          alt={img.title} 
                          fill 
                          className="object-cover"
                        />
                        <div className={`absolute inset-0 transition-opacity flex items-center justify-center ${
                          isSelected ? 'bg-brand-accent/20 opacity-100' : 'bg-background/50 opacity-0 group-hover:opacity-100'
                        }`}>
                          {isSelected ? (
                            <div className="bg-brand-accent text-white p-2 rounded-full shadow-lg">
                              <CheckCircle2 size={24} />
                            </div>
                          ) : (
                            <span className="bg-background text-foreground font-semibold px-3 py-1.5 rounded-lg text-sm">
                              Seleccionar
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

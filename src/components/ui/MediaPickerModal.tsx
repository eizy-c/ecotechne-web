'use client';

import { useState, useEffect } from 'react';
import { getGalleryImages } from '@/actions/gallery';
import Image from 'next/image';
import { Image as ImageIcon, X, CheckCircle2 } from 'lucide-react';

export default function MediaPickerModal({ 
  name, 
  defaultValue = "" 
}: { 
  name: string;
  defaultValue?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [images, setImages] = useState<any[]>([]);
  const [selectedUrl, setSelectedUrl] = useState<string>(defaultValue);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && images.length === 0) {
      setLoading(true);
      getGalleryImages().then((data) => {
        setImages(data);
        setLoading(false);
      });
    }
  }, [isOpen]);

  const handleSelect = (url: string) => {
    setSelectedUrl(url);
    setIsOpen(false);
  };

  return (
    <div>
      <input type="hidden" name={name} value={selectedUrl} />
      
      {/* Selector Trigger */}
      <div 
        onClick={() => setIsOpen(true)}
        className="w-full h-40 border-2 border-dashed border-card-border rounded-xl bg-background/50 hover:bg-foreground/5 hover:border-brand-accent transition-all cursor-pointer flex flex-col items-center justify-center relative overflow-hidden group"
      >
        {selectedUrl ? (
          <>
            <Image src={selectedUrl} alt="Selected media" fill className="object-cover" />
            <div className="absolute inset-0 bg-background/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
              <span className="text-foreground font-semibold bg-background/80 px-4 py-2 rounded-full flex items-center gap-2">
                <ImageIcon size={16} /> Cambiar Imagen
              </span>
            </div>
          </>
        ) : (
          <div className="text-foreground/50 flex flex-col items-center gap-2">
            <ImageIcon size={32} />
            <span>Haz clic para seleccionar de la Galería</span>
          </div>
        )}
      </div>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-black/80 backdrop-blur-md">
          <div className="glass-card border border-white/10 rounded-3xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl animate-fade-in-up overflow-hidden relative">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-white/10 flex justify-between items-center bg-white/5">
              <h3 className="text-xl font-bold text-foreground flex items-center gap-3">
                <ImageIcon className="text-brand-accent" size={24} />
                Banco de Imágenes
              </h3>
              <button 
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-2 text-foreground/50 hover:text-white hover:bg-white/10 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 md:p-8 overflow-y-auto flex-1 custom-scrollbar">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-24 text-brand-accent">
                  <i className="fa-solid fa-spinner fa-spin text-4xl mb-4"></i>
                  <p className="text-foreground/70 font-medium">Cargando galería...</p>
                </div>
              ) : images.length === 0 ? (
                <div className="text-center py-24 text-foreground/50">
                  <ImageIcon size={48} className="mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium text-foreground">La galería está vacía</p>
                  <p className="text-sm mt-1">Sube imágenes desde el módulo de Galería primero.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
                  {images.map((img) => (
                    <div 
                      key={img.image_id}
                      onClick={() => handleSelect(img.image_url)}
                      className={`relative aspect-square rounded-2xl overflow-hidden cursor-pointer border-2 transition-all group ${
                        selectedUrl === img.image_url 
                          ? 'border-brand-accent scale-[0.98] shadow-[0_0_20px_rgba(255,109,36,0.3)]' 
                          : 'border-white/5 hover:border-white/30'
                      }`}
                    >
                      <Image 
                        src={img.image_url} 
                        alt={img.description || 'Imagen'} 
                        fill 
                        className="object-cover"
                      />
                      <div className={`absolute inset-0 transition-all duration-300 flex items-center justify-center ${
                        selectedUrl === img.image_url ? 'bg-brand-accent/20 opacity-100 backdrop-blur-[2px]' : 'bg-black/50 opacity-0 group-hover:opacity-100 backdrop-blur-[2px]'
                      }`}>
                        {selectedUrl === img.image_url ? (
                          <div className="bg-brand-accent text-brand-dark p-3 rounded-full shadow-2xl scale-110">
                            <CheckCircle2 size={28} />
                          </div>
                        ) : (
                          <span className="bg-white/10 text-white border border-white/20 font-semibold px-4 py-2 rounded-xl text-sm shadow-xl transform translate-y-2 group-hover:translate-y-0 transition-all">
                            Seleccionar
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

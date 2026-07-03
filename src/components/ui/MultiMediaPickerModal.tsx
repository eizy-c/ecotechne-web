'use client';

import { useState, useEffect } from 'react';
import { getGalleryImages } from '@/actions/gallery';
import Image from 'next/image';
import { X, Plus, ImageIcon } from 'lucide-react';
import MediaPicker from './MediaPicker';

export default function MultiMediaPickerModal({ 
  name, 
  defaultValues = [] 
}: { 
  name: string;
  defaultValues?: number[]; // Array of image_ids
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [allImages, setAllImages] = useState<any[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>(defaultValues);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load all images to resolve URLs for previews
    setLoading(true);
    getGalleryImages().then((data) => {
      setAllImages(data);
      setLoading(false);
    });
  }, []);

  const handleSelect = (newIds: number[]) => {
    // Combine and deduplicate
    const combined = Array.from(new Set([...selectedIds, ...newIds]));
    setSelectedIds(combined);
  };

  const removeImage = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIds(selectedIds.filter(i => i !== id));
  };

  return (
    <div>
      {/* Hidden inputs to send to FormData */}
      {selectedIds.map((id, i) => (
        <input key={i} type="hidden" name={name} value={id} />
      ))}
      {selectedIds.length === 0 && (
        <input type="hidden" name={name} value="" /> // Empty fallback
      )}
      
      {/* Selected Images Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
        {selectedIds.map((id, i) => {
          const imgData = allImages.find(img => img.image_id === id);
          return (
            <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-card-border group bg-background flex items-center justify-center">
              {imgData ? (
                <Image src={imgData.image_url} alt="Selected" fill className="object-cover" />
              ) : (
                <ImageIcon className="text-foreground/20 animate-pulse" />
              )}
              <button 
                type="button"
                onClick={(e) => removeImage(id, e)}
                className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110 shadow-lg"
              >
                <X size={14} />
              </button>
            </div>
          );
        })}
        
        {/* Add Button */}
        <div 
          onClick={() => setIsOpen(true)}
          className="aspect-square border-2 border-dashed border-card-border rounded-xl bg-background/50 hover:bg-foreground/5 hover:border-brand-accent transition-all cursor-pointer flex flex-col items-center justify-center text-foreground/50 hover:text-brand-accent"
        >
          <Plus size={32} />
          <span className="text-sm mt-2 font-medium text-center leading-tight">Añadir desde<br/>Banco</span>
        </div>
      </div>

      <MediaPicker 
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSelect={handleSelect}
      />
    </div>
  );
}

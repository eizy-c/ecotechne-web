'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function ProductGallery({ images }: { images: string[] }) {
  const [mainImage, setMainImage] = useState(images[0] || '/placeholder.png');

  if (images.length === 0) {
    return (
      <div className="relative aspect-[4/3] lg:aspect-[16/9] max-w-2xl mx-auto rounded-2xl overflow-hidden bg-white/5 border border-card-border flex items-center justify-center">
        <div className="flex flex-col items-center gap-2 text-foreground/20">
          <i className="fa-solid fa-image text-5xl"></i>
          <span className="text-sm font-medium">Sin imagen</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-[4/3] lg:aspect-[16/9] max-w-2xl mx-auto rounded-2xl overflow-hidden bg-white border border-card-border shadow-lg">
        <Image 
          src={mainImage} 
          alt="Product image" 
          fill 
          className="object-contain"
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar">
          {images.map((img, i) => (
            <button 
              key={i}
              onClick={() => setMainImage(img)}
              className={`relative h-20 md:h-24 aspect-[4/3] rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 bg-white ${
                mainImage === img 
                  ? 'border-brand-accent shadow-[0_0_10px_rgba(255,109,36,0.3)] scale-95' 
                  : 'border-card-border hover:border-foreground/30 opacity-70 hover:opacity-100'
              }`}
            >
              <Image 
                src={img} 
                alt={`Thumbnail ${i + 1}`} 
                fill 
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

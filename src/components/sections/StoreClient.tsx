'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function StoreClient({ products, categories }: { products: any[], categories: any[] }) {
  const [activeCategory, setActiveCategory] = useState<number | null>(null);

  const filteredProducts = activeCategory 
    ? products.filter(p => p.categories?.some((c: any) => c.category_id === activeCategory))
    : products;

  return (
    <div>
      {/* Category Filters */}
      <div className="flex flex-wrap justify-center gap-3 mb-12">
        <button 
          onClick={() => setActiveCategory(null)}
          className={`px-6 py-2.5 rounded-full font-semibold transition-all ${
            activeCategory === null 
              ? 'bg-brand-accent text-brand-dark shadow-[0_0_15px_rgba(255,109,36,0.3)]' 
              : 'bg-foreground/5 text-foreground hover:bg-foreground/10 hover:text-brand-accent'
          }`}
        >
          Todos
        </button>
        {categories.map(cat => (
          <button 
            key={cat.category_id}
            onClick={() => setActiveCategory(cat.category_id)}
            className={`px-6 py-2.5 rounded-full font-semibold transition-all ${
              activeCategory === cat.category_id 
                ? 'bg-brand-accent text-brand-dark shadow-[0_0_15px_rgba(255,109,36,0.3)]' 
                : 'bg-foreground/5 text-foreground hover:bg-foreground/10 hover:text-brand-accent'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-20 text-foreground/50 glass-card rounded-3xl">
          <p className="text-2xl font-bold mb-2">No hay productos en esta categoría</p>
          <p>Pronto añadiremos más inventario.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts.map(product => (
            <div key={product.product_id} className="glass-card rounded-3xl overflow-hidden group hover:-translate-y-2 transition-all duration-500 flex flex-col h-full">
              <div className="relative aspect-square bg-background/50 overflow-hidden">
                {product.image_url ? (
                  <Image 
                    src={product.image_url} 
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-foreground/20">
                    <i className="fa-solid fa-box text-6xl"></i>
                  </div>
                )}
                <div className="absolute top-4 right-4 bg-brand-accent text-brand-dark px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                  ${Number(product.price).toFixed(2)}
                </div>
              </div>
              
              <div className="p-6 flex-1 flex flex-col">
                <div className="text-xs text-brand-accent font-bold mb-2 uppercase tracking-wide">
                  {product.categories?.[0]?.name || 'Genérico'}
                </div>
                <h4 className="text-lg font-bold text-foreground mb-3 leading-tight">{product.name}</h4>
                
                {product.vehicles && product.vehicles.length > 0 && (
                  <div className="mt-auto pt-4">
                    <p className="text-xs text-foreground/50 font-semibold mb-2">COMPATIBLE CON:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {product.vehicles.slice(0, 3).map((v: any) => (
                        <span key={v.vehicle_id} className="text-[10px] bg-foreground/10 px-2 py-1 rounded text-foreground/80 font-mono">
                          {v.brand?.name} {v.model?.name}
                        </span>
                      ))}
                      {product.vehicles.length > 3 && (
                        <span className="text-[10px] bg-foreground/10 px-2 py-1 rounded text-foreground/80 font-mono">
                          +{product.vehicles.length - 3} más
                        </span>
                      )}
                    </div>
                  </div>
                )}
                
                <button className="w-full mt-6 py-3 border border-brand-accent text-brand-accent font-bold rounded-xl hover:bg-brand-accent hover:text-brand-dark transition-colors flex items-center justify-center gap-2">
                  <i className="fa-brands fa-whatsapp text-lg"></i> Consultar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

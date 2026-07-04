'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { logProductLead } from '@/actions/analytics';
import toast from 'react-hot-toast';

export default function StoreClient({ 
  products, 
  categories,
  brands,
  models,
  settings
}: { 
  products: any[], 
  categories: any[],
  brands: any[],
  models: any[],
  settings?: Record<string, string>
}) {
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const [activeBrand, setActiveBrand] = useState<number | null>(null);
  const [activeModel, setActiveModel] = useState<number | null>(null);
  const [activeYear, setActiveYear] = useState<string | null>(null);

  // Generar lista de años únicos desde los vehículos
  const allYears = Array.from(new Set(products.flatMap(p => p.vehicles?.map((v: any) => v.year) || []))).filter(Boolean).sort().reverse();

  const filteredProducts = products.filter(p => {
    if (activeCategory && !p.categories?.some((c: any) => c.category_id === activeCategory)) return false;
    
    // Si hay filtros de vehículo, verificamos que el producto sea compatible
    if (activeBrand || activeModel || activeYear) {
      if (!p.vehicles || p.vehicles.length === 0) return false;
      
      const isCompatible = p.vehicles.some((v: any) => {
        const matchBrand = !activeBrand || v.brand_id === activeBrand;
        const matchModel = !activeModel || v.vehicle_model_id === activeModel;
        const matchYear = !activeYear || v.year === activeYear;
        return matchBrand && matchModel && matchYear;
      });
      
      if (!isCompatible) return false;
    }
    
    return true;
  });

  const handleWhatsAppClick = async (product: any) => {
    // Registrar el lead
    try {
      let country = typeof window !== 'undefined' ? sessionStorage.getItem('user_country') : null;
      if (!country) {
        try {
          const response = await fetch('https://ipapi.co/json/');
          const data = await response.json();
          if (data.country_name) {
            country = data.country_name;
            sessionStorage.setItem('user_country', country!);
          } else {
            country = 'Local/Desconocido';
          }
        } catch (e) {
          country = 'Desconocido';
        }
      }
      
      await logProductLead(product.product_id, country || 'Desconocido');
    } catch (e) {
      console.error(e);
    }
    
    // Redirigir a WhatsApp
    const phoneNumber = settings?.['company.phone'] || '584265549941'; 
    const companyName = settings?.['company.name'] || 'Ecotechne';
    const message = `Hola ${companyName}, estoy interesado en el producto: ${product.name} (Ref: #${product.product_id}). ¿Me pueden dar más información?`;
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div>
      {/* Advanced Filters */}
      <div className="glass-card p-6 rounded-2xl mb-12 flex flex-col md:flex-row flex-wrap gap-4 items-stretch md:items-end">
        <div className="flex-1 w-full md:w-auto min-w-[200px]">
          <label className="block text-xs font-bold text-foreground/50 uppercase tracking-wider mb-2">Tipo de producto</label>
          <select 
            className="w-full bg-background/50 border border-card-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-brand-accent transition-colors appearance-none"
            value={activeCategory || ''}
            onChange={(e) => setActiveCategory(e.target.value ? Number(e.target.value) : null)}
          >
            <option value="">Todas las categorías</option>
            {categories.map(cat => (
              <option key={cat.category_id} value={cat.category_id}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs font-bold text-foreground/50 uppercase tracking-wider mb-2">Marcas vehículos</label>
          <select 
            className="w-full bg-background/50 border border-card-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-brand-accent transition-colors appearance-none"
            value={activeBrand || ''}
            onChange={(e) => {
              setActiveBrand(e.target.value ? Number(e.target.value) : null);
              setActiveModel(null); // Reset model when brand changes
            }}
          >
            <option value="">Todas las marcas</option>
            {brands.map(brand => (
              <option key={brand.brand_id} value={brand.brand_id}>{brand.name}</option>
            ))}
          </select>
        </div>

        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs font-bold text-foreground/50 uppercase tracking-wider mb-2">Modelos</label>
          <select 
            className="w-full bg-background/50 border border-card-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-brand-accent transition-colors appearance-none"
            value={activeModel || ''}
            onChange={(e) => setActiveModel(e.target.value ? Number(e.target.value) : null)}
            disabled={!activeBrand}
          >
            <option value="">Todos los modelos</option>
            {models
              .filter(m => !activeBrand || m.brand_id === activeBrand)
              .map(model => (
                <option key={model.vehicle_model_id} value={model.vehicle_model_id}>{model.name}</option>
              ))}
          </select>
        </div>

        <div className="flex-1 min-w-[150px]">
          <label className="block text-xs font-bold text-foreground/50 uppercase tracking-wider mb-2">Año</label>
          <select 
            className="w-full bg-background/50 border border-card-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-brand-accent transition-colors appearance-none"
            value={activeYear || ''}
            onChange={(e) => setActiveYear(e.target.value || null)}
          >
            <option value="">Todos</option>
            {allYears.map(year => (
              <option key={year} value={year as string}>{year}</option>
            ))}
          </select>
        </div>

        <button 
          onClick={() => {
            setActiveCategory(null);
            setActiveBrand(null);
            setActiveModel(null);
            setActiveYear(null);
          }}
          className="w-full md:w-auto px-6 py-3 bg-brand-accent text-brand-dark rounded-xl font-bold hover:scale-105 transition-transform flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(255,109,36,0.3)] h-[50px]"
        >
          Limpiar
        </button>
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
                {product.image_url || (product.images && product.images[0]?.image?.image_url) ? (
                  <Image 
                    src={product.image_url || product.images[0].image.image_url} 
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-foreground/20">
                    <i className="fa-solid fa-image text-5xl"></i>
                  </div>
                )}

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
                
                <div className="w-full mt-6 flex gap-2">
                  <Link 
                    href={`/productos/${product.slug}`}
                    className="flex-1 py-3 bg-brand-accent text-brand-dark font-bold rounded-xl hover:scale-105 transition-transform flex items-center justify-center gap-2 shadow-lg"
                  >
                    Detalles
                  </Link>
                  <button 
                    onClick={() => handleWhatsAppClick(product)}
                    className="flex-[0.5] py-3 border border-brand-accent text-brand-accent font-bold rounded-xl hover:bg-brand-accent hover:text-brand-dark transition-colors flex items-center justify-center"
                    title="Pedir por WhatsApp"
                  >
                    <i className="fa-brands fa-whatsapp text-xl"></i>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

'use client';

import { createProduct } from '@/actions/products';
import Link from 'next/link';
import { Save } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import MediaPickerModal from '@/components/ui/MediaPickerModal';
import MultiMediaPickerModal from '@/components/ui/MultiMediaPickerModal';
import toast from 'react-hot-toast';

export default function CreateProductForm({ categories, vehicles }: { categories: any[], vehicles: any[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isUniversal, setIsUniversal] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [selectedVehicles, setSelectedVehicles] = useState<number[]>([]);

  const toggleCategory = (id: number) => {
    setSelectedCategories(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]);
  };

  const toggleVehicle = (id: number) => {
    setSelectedVehicles(prev => prev.includes(id) ? prev.filter(v => v !== id) : [...prev, id]);
  };



  return (
    <form 
      action={async (formData) => {
        setLoading(true);
        setError(null);
        try {
          await createProduct(formData);
          toast.success('Producto creado exitosamente');
          router.push('/dashboard/products');
        } catch (e: any) {
          setError(e.message);
        } finally {
          setLoading(false);
        }
      }} 
      className="glass-card rounded-2xl border border-card-border p-6 space-y-6"
    >
      {error && <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-2 rounded-xl text-sm">{error}</div>}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-foreground mb-2">Nombre del Producto *</label>
            <input 
              type="text" 
              id="name"
              name="name"
              required
              placeholder="Ej: Defensa Frontal..."
              className="w-full bg-background/50 border border-card-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-brand-accent transition-colors"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="stock" className="block text-sm font-semibold text-foreground mb-2">Stock Inicial *</label>
              <input 
                type="number" 
                id="stock"
                name="stock"
                required
                defaultValue="0"
                className="w-full bg-background/50 border border-card-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-brand-accent transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-3">Destacado en Inicio</label>
              <label className="flex items-center gap-3 p-3 rounded-xl border border-card-border bg-background/50 cursor-pointer transition-colors hover:border-brand-accent/50 group">
                <div className="relative flex items-center justify-center">
                  <input type="checkbox" name="is_featured" value="true" className="peer appearance-none w-5 h-5 rounded border border-card-border bg-background checked:bg-brand-accent checked:border-brand-accent transition-colors cursor-pointer" />
                  <svg className="absolute w-3.5 h-3.5 text-brand-dark opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                </div>
                <span className="text-sm font-medium text-foreground/80 group-hover:text-brand-accent transition-colors">Mostrar en portada</span>
              </label>
            </div>
          </div>



          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Categorías *</label>
            <div className="bg-background/50 border border-card-border rounded-xl p-3 min-h-[120px] max-h-[160px] overflow-y-auto space-y-1">
              {categories.map(cat => {
                const isSelected = selectedCategories.includes(cat.category_id);
                return (
                  <div 
                    key={cat.category_id}
                    onClick={() => toggleCategory(cat.category_id)}
                    className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${isSelected ? 'bg-brand-accent/10 text-brand-accent font-semibold' : 'hover:bg-foreground/5 text-foreground/80'}`}
                  >
                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isSelected ? 'bg-brand-accent border-brand-accent' : 'border-card-border bg-background'}`}>
                      {isSelected && <svg className="w-3.5 h-3.5 text-brand-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                    </div>
                    <span>{cat.name}</span>
                  </div>
                );
              })}
            </div>
            {/* Hidden inputs to send the data with FormData */}
            {selectedCategories.map(id => (
              <input key={id} type="hidden" name="categories" value={id} />
            ))}
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-foreground mb-3">Tipo de Accesorio *</label>
            <div className="flex flex-col sm:flex-row gap-4">
              <label className={`flex-1 flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${isUniversal ? 'border-brand-accent bg-brand-accent/5' : 'border-card-border bg-background/50 hover:border-foreground/20'}`}>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${isUniversal ? 'border-brand-accent' : 'border-card-border'}`}>
                  {isUniversal && <div className="w-2.5 h-2.5 bg-brand-accent rounded-full"></div>}
                </div>
                <input type="radio" name="isUniversal" value="true" checked={isUniversal} onChange={() => setIsUniversal(true)} className="hidden" />
                <span className={`text-sm font-medium ${isUniversal ? 'text-brand-accent' : 'text-foreground/70'}`}>Universal</span>
              </label>
              <label className={`flex-1 flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${!isUniversal ? 'border-brand-accent bg-brand-accent/5' : 'border-card-border bg-background/50 hover:border-foreground/20'}`}>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${!isUniversal ? 'border-brand-accent' : 'border-card-border'}`}>
                  {!isUniversal && <div className="w-2.5 h-2.5 bg-brand-accent rounded-full"></div>}
                </div>
                <input type="radio" name="isUniversal" value="false" checked={!isUniversal} onChange={() => setIsUniversal(false)} className="hidden" />
                <span className={`text-sm font-medium ${!isUniversal ? 'text-brand-accent' : 'text-foreground/70'}`}>Específico</span>
              </label>
            </div>
          </div>
          
          {!isUniversal && (
            <div className="animate-fade-in-up">
              <label className="block text-sm font-semibold text-foreground mb-2">Vehículos Compatibles</label>
              <div className="bg-background/50 border border-card-border rounded-xl p-3 min-h-[160px] max-h-[220px] overflow-y-auto space-y-1">
                {vehicles.map(veh => {
                  const isSelected = selectedVehicles.includes(veh.vehicle_id);
                  return (
                    <div 
                      key={veh.vehicle_id}
                      onClick={() => toggleVehicle(veh.vehicle_id)}
                      className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${isSelected ? 'bg-brand-accent/10 text-brand-accent font-semibold' : 'hover:bg-foreground/5 text-foreground/80'}`}
                    >
                      <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isSelected ? 'bg-brand-accent border-brand-accent' : 'border-card-border bg-background'}`}>
                        {isSelected && <svg className="w-3.5 h-3.5 text-brand-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                      </div>
                      <span>{veh.brand?.name} {veh.model?.name} ({veh.year})</span>
                    </div>
                  );
                })}
              </div>
              {/* Hidden inputs to send the data with FormData */}
              {selectedVehicles.map(id => (
                <input key={id} type="hidden" name="vehicles" value={id} />
              ))}
            </div>
          )}

          <div>
            <label htmlFor="description" className="block text-sm font-semibold text-foreground mb-2">Descripción Detallada</label>
            <textarea 
              id="description"
              name="description"
              rows={5}
              placeholder="Escribe todas las especificaciones, características y detalles importantes..."
              className="w-full bg-background/50 border border-card-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-brand-accent transition-colors resize-y"
            />
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Imagen Principal (Opcional)</label>
            <MediaPickerModal name="image_url" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Galería de Imágenes Adicionales</label>
            <MultiMediaPickerModal name="additional_images" />
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-card-border flex justify-end gap-3">
        <Link 
          href="/dashboard/products"
          className="px-6 py-3 rounded-xl font-semibold text-foreground hover:bg-foreground/5 transition-colors"
        >
          Cancelar
        </Link>
        <button 
          type="submit"
          disabled={loading}
          className="bg-brand-accent text-brand-dark px-8 py-3 rounded-xl font-bold hover:scale-105 transition-transform flex items-center gap-2 shadow-[0_0_15px_rgba(255,109,36,0.2)] disabled:opacity-50 disabled:hover:scale-100"
        >
          <Save size={20} />
          <span>{loading ? 'Guardando...' : 'Crear Producto'}</span>
        </button>
      </div>
    </form>
  );
}

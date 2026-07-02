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
              <label className="block text-sm font-semibold text-foreground mb-2">Destacado en Inicio</label>
              <label className="flex items-center gap-3 cursor-pointer mt-3">
                <input type="checkbox" name="is_featured" value="true" className="w-5 h-5 text-brand-accent rounded focus:ring-brand-accent" />
                <span className="text-sm">Mostrar en portada</span>
              </label>
            </div>
          </div>



          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Categorías * <span className="text-xs font-normal text-foreground/50">(Mantén presionado Ctrl/Cmd para seleccionar varias)</span></label>
            <select 
              multiple 
              name="categories" 
              required 
              className="w-full bg-background/50 border border-card-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-brand-accent transition-colors min-h-[120px]"
            >
              {categories.map(cat => (
                <option key={cat.category_id} value={cat.category_id} className="py-1">
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Tipo de Accesorio *</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="isUniversal" value="true" checked={isUniversal} onChange={() => setIsUniversal(true)} className="w-4 h-4 text-brand-accent focus:ring-brand-accent" />
                <span className="text-sm">Universal (No requiere vehículo)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="isUniversal" value="false" checked={!isUniversal} onChange={() => setIsUniversal(false)} className="w-4 h-4 text-brand-accent focus:ring-brand-accent" />
                <span className="text-sm">Para vehículo específico</span>
              </label>
            </div>
          </div>
          
          {!isUniversal && (
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Vehículos Compatibles <span className="text-xs font-normal text-foreground/50">(Mantén presionado Ctrl/Cmd para seleccionar varios)</span></label>
              <select 
                multiple 
                name="vehicles" 
                className="w-full bg-background/50 border border-card-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-brand-accent transition-colors min-h-[160px]"
              >
                {vehicles.map(veh => (
                  <option key={veh.vehicle_id} value={veh.vehicle_id} className="py-1">
                    {veh.brand?.name} {veh.model?.name} ({veh.year})
                  </option>
                ))}
              </select>
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

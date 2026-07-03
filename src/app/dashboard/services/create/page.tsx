'use client';

import { createService } from '@/actions/services';
import Link from 'next/link';
import { ArrowLeft, Save } from 'lucide-react';
import MediaPickerModal from '@/components/ui/MediaPickerModal';
import MultiMediaPickerModal from '@/components/ui/MultiMediaPickerModal';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function CreateServicePage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="max-w-full mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link 
          href="/dashboard/services"
          className="p-2 bg-foreground/5 hover:bg-foreground/10 text-foreground rounded-xl transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h2 className="text-3xl font-bold text-foreground">Crear Servicio</h2>
          <p className="text-foreground/50 mt-1">Añade un nuevo servicio a tu oferta</p>
        </div>
      </div>

      <form 
        action={async (formData) => {
          setLoading(true);
          setError(null);
          try {
            await createService(formData);
          } catch (e: any) {
            if (e.message === 'NEXT_REDIRECT') {
              toast.success('Servicio creado exitosamente');
              throw e;
            }
            setError(e.message);
          } finally {
            setLoading(false);
          }
        }} 
        className="glass-card rounded-2xl border border-card-border p-6 space-y-6"
      >
        {error && <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-2 rounded-xl text-sm">{error}</div>}
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-foreground mb-2">Nombre del Servicio *</label>
            <input 
              type="text" 
              id="name"
              name="name"
              required
              placeholder="Ej: Instalación de Defensas"
              className="w-full bg-background/50 border border-card-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-brand-accent transition-colors"
            />
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-semibold text-foreground mb-2">Descripción</label>
            <textarea 
              id="description"
              name="description"
              rows={3}
              placeholder="Detalles sobre este servicio..."
              className="w-full bg-background/50 border border-card-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-brand-accent transition-colors resize-none"
            ></textarea>
          </div>


          
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Imagen de Portada (Opcional)</label>
            <MediaPickerModal name="image_url" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Galería de Imágenes Adicionales</label>
            <MultiMediaPickerModal name="additional_images" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-3">Visibilidad del Servicio</label>
            <label className="flex items-center gap-3 p-3 rounded-xl border border-card-border bg-background/50 cursor-pointer transition-colors hover:border-brand-accent/50 group w-fit">
              <div className="relative flex items-center justify-center">
                <input 
                  type="checkbox" 
                  name="active" 
                  defaultChecked
                  className="peer appearance-none w-5 h-5 rounded border border-card-border bg-background checked:bg-brand-accent checked:border-brand-accent transition-colors cursor-pointer"
                />
                <svg className="absolute w-3.5 h-3.5 text-brand-dark opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              </div>
              <div>
                <div className="font-semibold text-sm text-foreground group-hover:text-brand-accent transition-colors">Servicio Activo</div>
                <div className="text-xs text-foreground/50">Visible para los clientes en la web principal.</div>
              </div>
            </label>
          </div>
        </div>

        <div className="pt-4 border-t border-card-border flex justify-end gap-3">
          <Link 
            href="/dashboard/services"
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
            <span>{loading ? 'Guardando...' : 'Crear Servicio'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}

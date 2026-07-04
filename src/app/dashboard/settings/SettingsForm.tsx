'use client';

import { updateSettings } from '@/actions/settings';
import { Save } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import MediaPickerModal from '@/components/ui/MediaPickerModal';

export default function SettingsForm({ settings }: { settings: Record<string, string> }) {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'hero' | 'about' | 'company'>('company');

  return (
    <form 
      action={async (formData) => {
        setLoading(true);
        try {
          await updateSettings(formData);
        } catch (e: any) {
          if (e.message === 'NEXT_REDIRECT') {
            toast.success('Configuración guardada exitosamente');
            throw e;
          }
          toast.error(e.message || 'Error guardando configuración');
        } finally {
          setLoading(false);
        }
      }} 
      className="glass-card rounded-2xl border border-card-border overflow-hidden"
    >
      <div className="flex border-b border-card-border bg-background/30">
        <button
          type="button"
          onClick={() => setActiveTab('company')}
          className={`flex-1 py-4 font-semibold text-center transition-colors ${
            activeTab === 'company' 
              ? 'text-brand-accent border-b-2 border-brand-accent bg-foreground/5' 
              : 'text-foreground/70 hover:text-foreground hover:bg-foreground/5'
          }`}
        >
          Datos de la Empresa
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('hero')}
          className={`flex-1 py-4 font-semibold text-center transition-colors ${
            activeTab === 'hero' 
              ? 'text-brand-accent border-b-2 border-brand-accent bg-foreground/5' 
              : 'text-foreground/70 hover:text-foreground hover:bg-foreground/5'
          }`}
        >
          Sección Inicio (Hero)
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('about')}
          className={`flex-1 py-4 font-semibold text-center transition-colors ${
            activeTab === 'about' 
              ? 'text-brand-accent border-b-2 border-brand-accent bg-foreground/5' 
              : 'text-foreground/70 hover:text-foreground hover:bg-foreground/5'
          }`}
        >
          Sección Nosotros
        </button>
      </div>

      <div className="p-6 space-y-6">
        {/* Tab Company */}
        {activeTab === 'company' && (
          <div className="space-y-6 animate-fade-in-up">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Nombre de la Empresa</label>
                <input 
                  type="text" 
                  name="company.name"
                  defaultValue={settings['company.name']}
                  placeholder="Ej: Ecotechne"
                  className="w-full bg-background/50 border border-card-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-brand-accent transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Correo de Contacto</label>
                <input 
                  type="email" 
                  name="company.email"
                  defaultValue={settings['company.email']}
                  placeholder="Ej: admiecotechne@gmail.com"
                  className="w-full bg-background/50 border border-card-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-brand-accent transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-brand-accent mb-2">Teléfono / WhatsApp</label>
              <input 
                type="text" 
                name="company.phone"
                defaultValue={settings['company.phone']}
                placeholder="Ej: 584265549941 (Sin +, solo números)"
                className="w-full bg-background/50 border border-card-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-brand-accent transition-colors"
              />
              <p className="text-xs text-foreground/50 mt-2">Este número se utilizará para todos los botones de "Contactar por WhatsApp".</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-card-border">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Logo Principal</label>
                <MediaPickerModal name="company.logo" defaultValue={settings['company.logo'] || '/logo-long.png'} />
                <p className="text-xs text-foreground/50 mt-2">Formato recomendado: PNG horizontal con fondo transparente.</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Favicon (Icono de pestaña)</label>
                <MediaPickerModal name="company.favicon" defaultValue={settings['company.favicon'] || '/favicon.ico'} />
                <p className="text-xs text-foreground/50 mt-2">Formato recomendado: PNG cuadrado de 64x64px.</p>
              </div>
            </div>
          </div>
        )}

        {/* Tab Hero */}
        {activeTab === 'hero' && (
          <div className="space-y-4 animate-fade-in-up">
            <div>
              <label htmlFor="hero.badge" className="block text-sm font-semibold text-foreground mb-2">Insignia (Badge)</label>
              <input 
                type="text" 
                name="hero.badge"
                defaultValue={settings['hero.badge']}
                className="w-full bg-background/50 border border-card-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-brand-accent transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-3">Visibilidad del Fondo</label>
              <label className="flex items-center gap-3 p-3 rounded-xl border border-card-border bg-background/50 cursor-pointer transition-colors hover:border-brand-accent/50 group w-fit">
                <div className="relative flex items-center justify-center">
                  <input 
                    type="checkbox" 
                    name="hero.background_enabled" 
                    value="true"
                    defaultChecked={settings['hero.background_enabled'] !== 'false'}
                    className="peer appearance-none w-5 h-5 rounded border border-card-border bg-background checked:bg-brand-accent checked:border-brand-accent transition-colors cursor-pointer"
                  />
                  <svg className="absolute w-3.5 h-3.5 text-brand-dark opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                </div>
                <div>
                  <div className="font-semibold text-sm text-foreground group-hover:text-brand-accent transition-colors">Mostrar imagen de fondo</div>
                  <div className="text-xs text-foreground/50">Si se desactiva, el fondo será oscuro y liso.</div>
                </div>
              </label>
              {/* Hidden input hack to ensure 'false' is sent when unchecked since standard checkboxes don't send anything when unchecked */}
              <input type="hidden" name="hero.background_enabled_fallback" value="false" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Imagen de Fondo (Opcional)</label>
              <MediaPickerModal name="hero.background_image" defaultValue={settings['hero.background_image'] || ''} />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Línea 1 del Título</label>
                <input 
                  type="text" 
                  name="hero.title.line1"
                  defaultValue={settings['hero.title.line1']}
                  className="w-full bg-background/50 border border-card-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-brand-accent transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-brand-accent mb-2">Línea 1 - Palabra Destacada</label>
                <input 
                  type="text" 
                  name="hero.title.highlight1"
                  defaultValue={settings['hero.title.highlight1']}
                  className="w-full bg-background/50 border border-card-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-brand-accent transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Línea 2 del Título</label>
                <input 
                  type="text" 
                  name="hero.title.line2"
                  defaultValue={settings['hero.title.line2']}
                  className="w-full bg-background/50 border border-card-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-brand-accent transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-brand-accent mb-2">Línea 2 - Palabra Destacada</label>
                <input 
                  type="text" 
                  name="hero.title.highlight2"
                  defaultValue={settings['hero.title.highlight2']}
                  className="w-full bg-background/50 border border-card-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-brand-accent transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Subtítulo</label>
              <textarea 
                name="hero.subtitle"
                rows={3}
                defaultValue={settings['hero.subtitle']}
                className="w-full bg-background/50 border border-card-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-brand-accent transition-colors resize-none"
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Texto del Botón</label>
              <input 
                type="text" 
                name="hero.button_text"
                defaultValue={settings['hero.button_text']}
                className="w-full bg-background/50 border border-card-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-brand-accent transition-colors"
              />
            </div>
          </div>
        )}

        {/* Tab About */}
        {activeTab === 'about' && (
          <div className="space-y-4 animate-fade-in-up">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Insignia (Badge)</label>
              <input 
                type="text" 
                name="about.badge"
                defaultValue={settings['about.badge']}
                className="w-full bg-background/50 border border-card-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-brand-accent transition-colors"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Título de la sección</label>
                <input 
                  type="text" 
                  name="about.title.line1"
                  defaultValue={settings['about.title.line1']}
                  className="w-full bg-background/50 border border-card-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-brand-accent transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-brand-accent mb-2">Título - Parte Destacada</label>
                <input 
                  type="text" 
                  name="about.title.highlight1"
                  defaultValue={settings['about.title.highlight1']}
                  className="w-full bg-background/50 border border-card-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-brand-accent transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Descripción (Usa *texto* para resaltar en color primario)</label>
              <textarea 
                name="about.description"
                rows={5}
                defaultValue={settings['about.description']}
                className="w-full bg-background/50 border border-card-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-brand-accent transition-colors resize-none"
              ></textarea>
            </div>
          </div>
        )}

      </div>

      <div className="p-6 bg-background/30 border-t border-card-border flex justify-end">
        <button 
          type="submit"
          disabled={loading}
          className="bg-brand-accent text-brand-dark px-8 py-3 rounded-xl font-bold hover:scale-105 transition-transform flex items-center gap-2 shadow-[0_0_15px_rgba(255,109,36,0.2)] disabled:opacity-50 disabled:hover:scale-100"
        >
          <Save size={20} />
          <span>{loading ? 'Guardando...' : 'Guardar Cambios'}</span>
        </button>
      </div>
    </form>
  );
}

'use client';

import { updateSettings } from '@/actions/settings';
import { Save } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function SettingsForm({ settings }: { settings: Record<string, string> }) {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'hero' | 'about'>('hero');

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

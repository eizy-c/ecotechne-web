'use client';

import { useState, useRef } from 'react';
import { createMessage } from '@/actions/messages';
import { toast } from 'sonner';

/**
 * Sección de Contacto (Client Component)
 * Utiliza un diseño de formulario moderno y limpio.
 */
export default function Contact() {
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    try {
      await createMessage(formData);
      toast.success('¡Mensaje enviado con éxito!', {
        description: 'Nuestro equipo se pondrá en contacto contigo muy pronto.',
      });
      formRef.current?.reset();
    } catch (error: any) {
      toast.error('Error al enviar el mensaje', {
        description: error.message || 'Por favor, intenta nuevamente más tarde.',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="contacto" className="py-24 bg-background transition-colors border-t border-card-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-card rounded-3xl p-8 lg:p-12 shadow-2xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 relative z-10">
            <div>
              <h2 className="text-3xl md:text-5xl font-bold mb-6 text-foreground italic">
                Inicia tu <span className="text-brand-accent">Proyecto</span>
              </h2>
              <p className="text-foreground/60 mb-10 text-lg">
                ¿Tienes una idea en mente o necesitas equipar tu vehículo? Cuéntanos tus requerimientos y nuestro equipo de ingeniería te brindará la mejor solución.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full border border-brand-accent/30 flex items-center justify-center text-brand-accent">
                    <i className="fa-solid fa-envelope"></i>
                  </div>
                  <a href="mailto:admiecotechne@gmail.com" className="text-foreground font-bold hover:text-brand-accent transition-colors">admiecotechne@gmail.com</a>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full border border-brand-accent/30 flex items-center justify-center text-brand-accent">
                    <i className="fa-solid fa-phone"></i>
                  </div>
                  <span className="text-foreground font-bold">+58 426-5549941</span>
                </div>
              </div>
            </div>

            <div className="bg-foreground/5 p-8 rounded-2xl border border-card-border">
              <form ref={formRef} action={handleSubmit} className="space-y-4">
                <input 
                  type="text" 
                  name="name"
                  placeholder="Nombre completo" 
                  className="w-full bg-background/50 border border-card-border rounded-2xl px-6 py-4 text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-brand-accent transition-colors" 
                  required 
                />
                <input 
                  type="tel" 
                  name="phone"
                  placeholder="Teléfono de contacto" 
                  className="w-full bg-background/50 border border-card-border rounded-2xl px-6 py-4 text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-brand-accent transition-colors" 
                  required 
                />
                <textarea 
                  name="message"
                  placeholder="Cuéntanos sobre tu necesidad..." 
                  rows={4} 
                  className="w-full bg-background/50 border border-card-border rounded-2xl px-6 py-4 text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-brand-accent resize-none transition-colors" 
                  required 
                ></textarea>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-brand-accent text-brand-dark font-black py-5 rounded-2xl hover:scale-[1.02] transition-transform shadow-2xl active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:scale-100"
                >
                  {loading ? (
                    <>
                      <i className="fa-solid fa-circle-notch fa-spin"></i> ENVIANDO...
                    </>
                  ) : (
                    'ENVIAR SOLICITUD'
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

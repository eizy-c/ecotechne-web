'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Cookie, X } from 'lucide-react';

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    // Verificamos si ya aceptó previamente
    const hasAccepted = localStorage.getItem('cookie_consent');
    if (!hasAccepted) {
      // Pequeño retraso para que no aparezca de golpe al cargar la página
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie_consent', 'accepted');
    setIsVisible(false);
    
    // Si queremos recargar la página para que el VisitTracker vuelva a correr
    // window.location.reload(); 
    // Por ahora lo dejaremos sin recargar, la próxima visita ya contará.
  };

  const handleLater = () => {
    if (!showWarning) {
      setShowWarning(true);
    } else {
      // Lo oculta temporalmente por esta vista de página, pero volverá a salir al navegar a otra página
      setIsVisible(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:bottom-8 md:left-8 md:right-auto md:max-w-md z-50 animate-in slide-in-from-bottom-5 duration-500">
      <div className="glass-card p-6 rounded-2xl shadow-2xl border border-brand-accent/20 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-accent to-brand-dark"></div>
        
        <div className="flex items-start gap-4">
          <div className="p-3 bg-brand-accent/10 rounded-xl text-brand-accent shrink-0">
            <Cookie size={24} />
          </div>
          
          <div className="flex-1">
            <h3 className="font-bold text-foreground text-lg mb-1">
              Valoramos tu experiencia
            </h3>
            
            {!showWarning ? (
              <p className="text-sm text-foreground/70 mb-4 leading-relaxed">
                Utilizamos cookies propias para mejorar tu navegación, personalizar el contenido y analizar nuestro tráfico. 
                Revisa nuestra <Link href="/politica-cookies" className="text-brand-accent hover:underline font-medium">Política de Cookies</Link> para más detalles.
              </p>
            ) : (
              <p className="text-sm text-brand-accent font-medium mb-4 leading-relaxed">
                Las cookies se utilizan para que tu experiencia sea más cómoda y personalizada. 
                Recomendamos aceptarlas para disfrutar al máximo de nuestro catálogo.
              </p>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <button 
                onClick={handleAccept}
                className="flex-1 bg-brand-accent text-brand-dark font-bold py-2 px-4 rounded-xl hover:scale-105 transition-transform text-sm shadow-[0_0_15px_rgba(255,109,36,0.3)]"
              >
                Aceptar Cookies
              </button>
              <button 
                onClick={handleLater}
                className="flex-1 border border-card-border bg-foreground/5 hover:bg-foreground/10 text-foreground font-medium py-2 px-4 rounded-xl transition-colors text-sm"
              >
                {!showWarning ? 'Más tarde' : 'Continuar sin aceptar'}
              </button>
            </div>
          </div>
          
          <button 
            onClick={() => setIsVisible(false)}
            className="absolute top-4 right-4 text-foreground/40 hover:text-foreground transition-colors"
            aria-label="Cerrar"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

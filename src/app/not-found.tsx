'use client';

import Link from 'next/link';
import { Search, Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-accent/5 rounded-full blur-[100px] pointer-events-none"></div>
      
      <div className="max-w-md w-full space-y-8 glass-card p-10 rounded-3xl relative z-10 text-center border border-card-border">
        <div className="mx-auto w-24 h-24 bg-brand-accent/10 rounded-full flex items-center justify-center mb-6">
          <Search size={48} className="text-brand-accent" />
        </div>
        
        <div className="space-y-4">
          <h2 className="text-5xl font-black text-foreground tracking-tight">
            404
          </h2>
          <h3 className="text-2xl font-bold text-foreground">
            Página no encontrada
          </h3>
          <p className="text-foreground/60 leading-relaxed">
            Lo sentimos, no pudimos encontrar la página que estás buscando. Es posible que haya sido eliminada o que la dirección sea incorrecta.
          </p>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => {
              if (typeof window !== 'undefined') window.history.back();
            }}
            className="w-full sm:w-auto px-6 py-3 bg-foreground/5 hover:bg-foreground/10 text-foreground rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors border border-card-border"
          >
            <ArrowLeft size={18} />
            Regresar
          </button>
          <Link 
            href="/"
            className="w-full sm:w-auto px-6 py-3 bg-brand-accent text-brand-dark rounded-xl font-bold flex items-center justify-center gap-2 hover:scale-105 transition-transform shadow-[0_0_15px_rgba(255,109,36,0.2)]"
          >
            <Home size={18} />
            Ir al Inicio
          </Link>
        </div>
      </div>
    </div>
  );
}

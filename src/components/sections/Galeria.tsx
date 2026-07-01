import { Gallery } from "@/Models/Gallery";
import Image from 'next/image';

/**
 * Componente Galeria - Renderizado en el Servidor (Next.js 15)
 * Este componente lee dinámicamente los proyectos desde Google Sheets vía Service Account.
 */
export default async function Galeria() {
  const proyectos = await Gallery.findAll();
  const error = !proyectos;

  if (error || proyectos.length === 0) {
    return null;
  }

  return (
    <section id="portafolio" className="py-24 bg-background transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16">
          <h2 className="text-sm font-bold text-brand-accent uppercase tracking-[0.3em] mb-4">Portafolio</h2>
          <h3 className="text-4xl md:text-5xl font-black text-foreground">Proyectos <span className="text-brand-accent italic">Destacados</span></h3>
          <div className="h-1 w-24 bg-brand-accent mt-6"></div>
        </div>

        {/* Grid Responsivo de Tarjetas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {proyectos.map((proyecto: any, index: number) => (
            <div 
              key={index} 
              className="group bg-brand-dark/20 border border-white/5 rounded-none overflow-hidden transition-all duration-500 hover:border-brand-accent/30"
            >
              {/* Imagen con Aspect Ratio 1:1 y Optimización Next.js */}
              <div className="relative aspect-square overflow-hidden bg-brand-dark">
                <Image
                  src={proyecto.image_url || '/placeholder.jpg'} // Fallback por si acaso
                  alt={proyecto.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                  sizes="(max-w-768px) 100vw, (max-w-1200px) 50vw, 33vw"
                />
              </div>

              {/* Contenido de la Tarjeta (Diseño Industrial) */}
              <div className="p-8">
                <h3 className="text-xl font-bold text-foreground mb-3 tracking-tight group-hover:text-brand-accent transition-colors">
                  {proyecto.title}
                </h3>
                <p className="text-foreground/50 text-sm leading-relaxed line-clamp-3">
                  {proyecto.description}
                </p>
                <div className="mt-6 flex items-center gap-2 text-brand-accent text-xs font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                  Ver Detalle <i className="fa-solid fa-arrow-right-long"></i>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

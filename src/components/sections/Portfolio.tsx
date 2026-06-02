/**
 * Sección de Portafolio
 * Grid tipo mosaico para mostrar trabajos terminados.
 */
export default function Portfolio() {
  return (
    <section id="portafolio" className="py-24 bg-brand-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-2xl">
            <h3 className="text-4xl md:text-5xl font-black text-brand-light uppercase">
              Trabajos <span className="text-brand-accent">Terminados</span>
            </h3>
            <p className="mt-4 text-brand-light/60">
              Una muestra visual de nuestra precisión en cortes y la robustez de nuestras instalaciones en accesorios off-road.
            </p>
          </div>
          <div className="hidden md:block h-1 flex-grow bg-white/5 mx-8 mb-4"></div>
        </div>

        {/* Mosaic Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[250px]">
          <div className="md:col-span-2 md:row-span-2 glass-card rounded-3xl flex items-center justify-center border-white/5 group relative overflow-hidden">
            <div className="absolute inset-0 bg-brand-accent/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <i className="fa-solid fa-camera text-brand-light/10 text-6xl" />
            <span className="absolute bottom-6 left-6 text-brand-light font-bold opacity-0 group-hover:opacity-100 transition-all transform translate-y-4 group-hover:translate-y-0">
              Accesorios Instalados
            </span>
          </div>
          <div className="glass-card rounded-3xl flex items-center justify-center border-white/5 group relative overflow-hidden">
            <i className="fa-solid fa-camera text-brand-light/5 text-4xl" />
          </div>
          <div className="glass-card rounded-3xl flex items-center justify-center border-white/5 group relative overflow-hidden">
            <i className="fa-solid fa-camera text-brand-light/5 text-4xl" />
          </div>
          <div className="md:col-span-2 glass-card rounded-3xl flex items-center justify-center border-white/5 group relative overflow-hidden">
            <i className="fa-solid fa-camera text-brand-light/5 text-4xl" />
            <span className="absolute bottom-6 left-6 text-xs text-brand-light/40 uppercase font-bold tracking-widest">
              Corte Láser Metal
            </span>
          </div>
          <div className="glass-card rounded-3xl flex items-center justify-center border-white/5 group relative overflow-hidden">
            <i className="fa-solid fa-camera text-brand-light/5 text-4xl" />
          </div>
          <div className="glass-card rounded-3xl flex items-center justify-center border-white/5 group relative overflow-hidden">
            <i className="fa-solid fa-camera text-brand-light/5 text-4xl" />
          </div>
        </div>
      </div>
    </section>
  );
}

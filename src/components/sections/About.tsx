/**
 * Sección Sobre Nosotros
 */
export default function About() {
  return (
    <section id="nosotros" className="py-24 bg-background transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="inline-block px-3 py-1 rounded bg-brand-accent/10 text-brand-accent text-xs font-bold uppercase tracking-tighter">Sobre Nosotros</div>
            <h2 className="text-4xl md:text-5xl font-black text-foreground leading-tight">
              Especialistas en la <br /><span className="text-brand-accent">Aventura y el Trabajo</span>
            </h2>
            <p className="text-lg text-foreground/70 leading-relaxed">
              Somos <span className="text-brand-accent">Ecotechne</span>, una empresa especializada en el diseño, fabricación y comercialización de accesorios premium para vehículos 4x4, pickup y off-road. Desarrollamos soluciones robustas, funcionales y de alta calidad combinando ingeniería de precisión con el diseño más resistente.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-64 glass-card rounded-2xl flex flex-col items-center justify-center transition-all hover:scale-105">
              <i className="fa-solid fa-gear text-brand-accent text-4xl mb-4"></i>
              <span className="text-foreground/60 text-xs font-bold uppercase tracking-widest">Maquinado CNC</span>
            </div>
            <div className="h-64 glass-card rounded-2xl mt-8 flex flex-col items-center justify-center transition-all hover:scale-105">
              <i className="fa-solid fa-truck-pickup text-brand-accent text-4xl mb-4"></i>
              <span className="text-foreground/60 text-xs font-bold uppercase tracking-widest">Equipamiento 4x4</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

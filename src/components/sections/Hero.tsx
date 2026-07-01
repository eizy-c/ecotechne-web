export default function Hero() {
  return (
    <section id="inicio" className="relative min-h-screen flex items-center pt-32 pb-20 overflow-hidden bg-brand-black">
      {/* Background with Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-brand-black/80 md:bg-gradient-to-r md:from-brand-black/95 md:via-brand-black/80 md:to-transparent z-10" />
        <div 
          className="w-full h-full bg-cover bg-center opacity-40"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1544256651-69fd13e8436b?q=80&w=2070&auto=format&fit=crop')" }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-accent/10 border border-brand-accent/20 text-brand-accent text-xs font-bold uppercase tracking-widest mb-6 animate-fade-in-up">
            <span className="w-2 h-2 rounded-full bg-brand-accent animate-pulse" />
            Ingeniería de Alto Desempeño
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-none mb-6 animate-fade-in-up text-white">
            Precisión <span className="text-brand-accent">Ingeniería</span><br />
            Innovación <span className="text-gradient">4x4</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/70 mb-10 animate-fade-in-up delay-200">
            Fabricación premium de accesorios off-road donde la ingeniería de vanguardia se une a la máxima resistencia extrema.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 animate-fade-in-up delay-500">
            <a 
              href="#contacto" 
              className="px-8 py-4 w-full sm:w-auto rounded-full bg-brand-accent text-brand-dark font-bold hover:scale-105 transition-all shadow-[0_0_25px_rgba(255,109,36,0.4)] btn-glow text-center"
            >
              Cotizar Proyecto
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

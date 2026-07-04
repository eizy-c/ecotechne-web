import Particles from '@/components/ui/Particles';

export default function Hero({ settings }: { settings?: Record<string, string> }) {
  return (
    <section id="inicio" className="relative min-h-screen flex items-center pt-32 pb-20 overflow-hidden bg-brand-black">
      {/* Background with Overlay */}
      <div className="absolute inset-0 z-0">
        {settings?.['hero.background_enabled'] !== 'false' && (
          <div 
            className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url('${settings?.['hero.background_image'] || 'https://images.unsplash.com/photo-1544256651-69fd13e8436b?q=80&w=2070&auto=format&fit=crop'}')` }}
          />
        )}
        {/* Soft overlay to ensure text readability */}
        <div className={`absolute inset-0 z-10 ${settings?.['hero.background_enabled'] !== 'false' ? 'bg-gradient-to-r from-black/80 via-black/50 to-transparent' : ''}`} />
        <div className={`absolute inset-0 z-10 md:hidden ${settings?.['hero.background_enabled'] !== 'false' ? 'bg-black/40' : ''}`} /> {/* Extra darkening on mobile */}
        
        {/* Animated Particles (z-15 to be above background/overlay but below content z-20) */}
        <div className="absolute inset-0 w-full h-full overflow-hidden z-[15] pointer-events-none">
          <Particles particleCount={50} color="#FF6D24" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-accent/10 border border-brand-accent/20 text-brand-accent text-xs font-bold uppercase tracking-widest mb-6 animate-fade-in-up">
            <span className="w-2 h-2 rounded-full bg-brand-accent animate-pulse" />
            {settings?.['hero.badge'] || 'Ingeniería de Alto Desempeño'}
          </div>
          
          <h1 className="text-4xl md:text-7xl lg:text-8xl font-black tracking-tight leading-none mb-6 animate-fade-in-up text-white drop-shadow-xl">
            {settings?.['hero.title.line1'] || 'Precisión'} <span className="text-brand-accent drop-shadow-md">{settings?.['hero.title.highlight1'] || 'Ingeniería'}</span><br />
            {settings?.['hero.title.line2'] || 'Innovación'} <span className="text-brand-accent drop-shadow-md">{settings?.['hero.title.highlight2'] || '4x4'}</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/90 font-medium mb-10 animate-fade-in-up delay-200 drop-shadow-lg max-w-2xl">
            {settings?.['hero.subtitle'] || 'Fabricación premium de accesorios off-road donde la ingeniería de vanguardia se une a la máxima resistencia extrema.'}
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 animate-fade-in-up delay-500">
            <a 
              href="#contacto" 
              className="px-8 py-4 w-full sm:w-auto rounded-full bg-brand-accent text-brand-dark font-bold hover:scale-105 transition-all shadow-[0_0_25px_rgba(255,109,36,0.4)] btn-glow text-center"
            >
              {settings?.['hero.button_text'] || 'Cotizar Proyecto'}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

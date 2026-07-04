import { Loader2 } from 'lucide-react';

export default function DashboardLoading() {
  return (
    <div className="w-full h-[60vh] flex flex-col items-center justify-center animate-fade-in">
      <div className="relative">
        <div className="absolute inset-0 bg-brand-accent/20 blur-xl rounded-full scale-150 animate-pulse"></div>
        <Loader2 className="w-12 h-12 text-brand-accent animate-spin relative z-10" />
      </div>
      <h3 className="mt-6 text-lg font-medium text-foreground tracking-wide">Cargando información...</h3>
      <p className="text-sm text-foreground/50 mt-1">Por favor espera un momento</p>
    </div>
  );
}

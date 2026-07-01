import { 
  Users, 
  Package, 
  Wrench, 
  TrendingUp,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';

// Componente para tarjeta de métrica
function StatCard({ title, value, icon: Icon, trend }: { title: string, value: string, icon: any, trend: string }) {
  return (
    <div className="glass-card p-6 rounded-2xl relative overflow-hidden group">
      <div className="absolute -right-4 -top-4 w-24 h-24 bg-brand-accent/5 rounded-full blur-xl group-hover:bg-brand-accent/10 transition-colors"></div>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-foreground/60 text-sm font-medium">{title}</p>
          <h3 className="text-3xl font-bold mt-2 text-foreground">{value}</h3>
        </div>
        <div className="p-3 bg-foreground/5 rounded-xl border border-card-border text-brand-accent">
          <Icon size={24} />
        </div>
      </div>
      <div className="mt-4 flex items-center text-sm">
        <TrendingUp size={16} className="text-emerald-500 mr-1" />
        <span className="text-emerald-500 font-medium">{trend}</span>
        <span className="text-foreground/40 ml-2">vs último mes</span>
      </div>
    </div>
  );
}

export default function DashboardIndex() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Resumen General</h1>
        <p className="text-foreground/60 mt-1">Bienvenido al panel de control de Ecotechne.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard title="Total Usuarios" value="124" icon={Users} trend="+12%" />
        <StatCard title="Productos Activos" value="45" icon={Package} trend="+5%" />
        <StatCard title="Servicios Agendados" value="18" icon={Wrench} trend="+2%" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card rounded-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Productos Recientes</h2>
            <Link href="/dashboard/products" className="text-sm text-brand-accent hover:underline flex items-center">
              Ver todos <ArrowRight size={14} className="ml-1" />
            </Link>
          </div>
          
          {/* Tabla de ejemplo estática */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-card-border text-foreground/60 text-sm">
                  <th className="pb-3 font-medium">Nombre</th>
                  <th className="pb-3 font-medium">Precio</th>
                  <th className="pb-3 font-medium">Stock</th>
                  <th className="pb-3 font-medium">Estado</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <tr className="border-b border-card-border/50 hover:bg-foreground/5 transition-colors">
                  <td className="py-4 font-medium">Parachoques 4Runner</td>
                  <td className="py-4 text-foreground/70">$850.00</td>
                  <td className="py-4">12</td>
                  <td className="py-4"><span className="px-2 py-1 bg-emerald-500/10 text-emerald-500 rounded-full text-xs font-medium">Activo</span></td>
                </tr>
                <tr className="border-b border-card-border/50 hover:bg-foreground/5 transition-colors">
                  <td className="py-4 font-medium">Snorkel Hilux</td>
                  <td className="py-4 text-foreground/70">$320.00</td>
                  <td className="py-4 text-red-500 font-medium">0</td>
                  <td className="py-4"><span className="px-2 py-1 bg-red-500/10 text-red-500 rounded-full text-xs font-medium">Agotado</span></td>
                </tr>
                <tr className="hover:bg-foreground/5 transition-colors">
                  <td className="py-4 font-medium">Luces LED Barra</td>
                  <td className="py-4 text-foreground/70">$150.00</td>
                  <td className="py-4">45</td>
                  <td className="py-4"><span className="px-2 py-1 bg-emerald-500/10 text-emerald-500 rounded-full text-xs font-medium">Activo</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-6">Acciones Rápidas</h2>
          <div className="space-y-3">
            <Link href="/dashboard/products/create" className="flex items-center p-3 rounded-xl border border-card-border hover:bg-card-border/50 transition-colors group">
              <div className="p-2 bg-brand-accent/10 rounded-lg text-brand-accent group-hover:scale-110 transition-transform">
                <Package size={20} />
              </div>
              <span className="ml-3 font-medium text-sm">Nuevo Producto</span>
            </Link>
            <Link href="/dashboard/services/create" className="flex items-center p-3 rounded-xl border border-card-border hover:bg-card-border/50 transition-colors group">
              <div className="p-2 bg-brand-neutral/10 rounded-lg text-brand-neutral group-hover:scale-110 transition-transform">
                <Wrench size={20} />
              </div>
              <span className="ml-3 font-medium text-sm">Nuevo Servicio</span>
            </Link>
            <Link href="/dashboard/users/create" className="flex items-center p-3 rounded-xl border border-card-border hover:bg-card-border/50 transition-colors group">
              <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500 group-hover:scale-110 transition-transform">
                <Users size={20} />
              </div>
              <span className="ml-3 font-medium text-sm">Crear Usuario</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

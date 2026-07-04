import { 
  Users, 
  Package, 
  Wrench, 
  TrendingUp,
  ArrowRight,
  Car,
  Tag,
  Box,
  Image as ImageIcon,
  Shield,
  Layers,
  Settings,
  BarChart3
} from 'lucide-react';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import { formatRelativeDate } from '@/lib/formatDate';

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

export default async function DashboardIndex() {
  const [userCount, productCount, serviceCount, recentProducts, recentVisits, totalVisits] = await Promise.all([
    prisma.user.count({ where: { deleted_at: null } }),
    prisma.product.count({ where: { deleted_at: null } }),
    prisma.service.count({ where: { deleted_at: null } }),
    prisma.product.findMany({
      take: 5,
      where: { deleted_at: null },
      orderBy: { product_id: 'desc' },
    }),
    prisma.visit.findMany({
      take: 5,
      orderBy: { visit_id: 'desc' }
    }),
    prisma.visit.count()
  ]);

  const mobileMenuItems = [
    { name: 'Productos', path: '/dashboard/products', icon: Package },
    { name: 'Categorías', path: '/dashboard/categories', icon: Tag },
    { name: 'Servicios', path: '/dashboard/services', icon: Wrench },
    { name: 'Directorio', path: '/dashboard/vehicles', icon: Car },
    { name: 'Marcas', path: '/dashboard/brands', icon: Box },
    { name: 'Modelos', path: '/dashboard/vehicle-models', icon: Layers },
    { name: 'Analíticas', path: '/dashboard/analytics', icon: BarChart3 },
    { name: 'Usuarios', path: '/dashboard/users', icon: Users },
    { name: 'Roles', path: '/dashboard/roles', icon: Shield },
    { name: 'Ajustes', path: '/dashboard/settings', icon: Settings },
  ];

  return (
    <div className="space-y-8">
      {/* MOBILE APP-LIKE MENU GRID */}
      <div className="md:hidden">
        <h2 className="text-lg font-bold mb-4 text-foreground tracking-tight">¿Qué deseas gestionar?</h2>
        <div className="grid grid-cols-3 gap-3">
          {mobileMenuItems.map((item) => (
            <Link 
              key={item.path} 
              href={item.path}
              className="bg-card border border-card-border p-4 rounded-2xl flex flex-col items-center justify-center gap-2 hover:bg-brand-accent/5 hover:border-brand-accent/30 transition-all shadow-sm active:scale-95"
            >
              <div className="w-10 h-10 rounded-full bg-brand-accent/10 text-brand-accent flex items-center justify-center">
                <item.icon size={22} />
              </div>
              <span className="text-[10px] font-bold text-foreground text-center truncate w-full">{item.name}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* DESKTOP SUMMARY */}
      <div className="hidden md:block space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Resumen General</h1>
          <p className="text-foreground/60 mt-1">Bienvenido al panel de control de Ecotechne.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Total Usuarios" value={userCount.toString()} icon={Users} trend="Total" />
          <StatCard title="Visitas Totales" value={totalVisits.toString()} icon={TrendingUp} trend="Global" />
          <StatCard title="Productos Activos" value={productCount.toString()} icon={Package} trend="Total" />
          <StatCard title="Servicios Activos" value={serviceCount.toString()} icon={Wrench} trend="Total" />
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
                  <th className="pb-3 font-medium">Stock</th>
                  <th className="pb-3 font-medium">Estado</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {recentProducts.map((prod) => (
                  <tr key={prod.product_id} className="border-b border-card-border/50 hover:bg-foreground/5 transition-colors">
                    <td className="py-4 font-medium">{prod.name}</td>
                    <td className="py-4 text-brand-accent font-medium">{prod.stock}</td>
                    <td className="py-4">
                      {prod.stock > 0 ? (
                        <span className="px-2 py-1 bg-emerald-500/10 text-emerald-500 rounded-full text-xs font-medium">Activo</span>
                      ) : (
                        <span className="px-2 py-1 bg-red-500/10 text-red-500 rounded-full text-xs font-medium">Agotado</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-6">Últimas Visitas</h2>
          <div className="space-y-4">
            {recentVisits.map((visit) => (
              <div key={visit.visit_id} className="flex justify-between items-center p-3 rounded-xl border border-card-border hover:bg-card-border/50 transition-colors">
                <div>
                  <p className="font-medium text-sm text-foreground">{visit.country}</p>
                  <p className="text-xs text-foreground/50" title={new Date(visit.created_at).toLocaleString()}>{formatRelativeDate(visit.created_at)}</p>
                </div>
                <div className="text-xs text-brand-accent font-mono bg-brand-accent/10 px-2 py-1 rounded">
                  {visit.path}
                </div>
              </div>
            ))}
            {recentVisits.length === 0 && (
              <div className="text-center text-foreground/50 py-4 text-sm">No hay visitas registradas aún.</div>
            )}
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}

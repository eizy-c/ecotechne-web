import { 
  Users, 
  Package, 
  Wrench, 
  TrendingUp,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import prisma from '@/lib/prisma';

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
      include: { categories: true }
    }),
    prisma.visit.findMany({
      take: 5,
      orderBy: { visit_id: 'desc' }
    }),
    prisma.visit.count()
  ]);

  return (
    <div className="space-y-8">
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
                  <th className="pb-3 font-medium">Precio</th>
                  <th className="pb-3 font-medium">Stock</th>
                  <th className="pb-3 font-medium">Estado</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {recentProducts.map((prod) => (
                  <tr key={prod.product_id} className="border-b border-card-border/50 hover:bg-foreground/5 transition-colors">
                    <td className="py-4 font-medium">{prod.name}</td>
                    <td className="py-4 text-foreground/70">${Number(prod.price).toFixed(2)}</td>
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
                  <p className="text-xs text-foreground/50">{new Date(visit.created_at).toLocaleString()}</p>
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
  );
}

import prisma from '@/lib/prisma';
import { 
  BarChart3, 
  MessageCircle, 
  Globe2, 
  PackageSearch,
  Wrench
} from 'lucide-react';
import Link from 'next/link';
import { formatRelativeDate } from '@/lib/formatDate';

export default async function AnalyticsPage() {
  const [
    totalVisits,
    totalProductLeads,
    totalServiceLeads,
    recentProductLeads,
    recentServiceLeads
  ] = await Promise.all([
    prisma.visit.count(),
    prisma.productLead.count(),
    prisma.serviceLead.count(),
    prisma.productLead.findMany({
      take: 10,
      orderBy: { created_at: 'desc' },
      include: { product: true }
    }),
    prisma.serviceLead.findMany({
      take: 10,
      orderBy: { created_at: 'desc' },
      include: { service: true }
    })
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Analíticas y Leads</h1>
        <p className="text-foreground/60 mt-1">Métricas de interacción e interesados vía WhatsApp</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 rounded-2xl relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-brand-accent/5 rounded-full blur-xl group-hover:bg-brand-accent/10 transition-colors"></div>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-foreground/60 text-sm font-medium">Visitas Totales</p>
              <h3 className="text-3xl font-bold mt-2 text-foreground">{totalVisits}</h3>
            </div>
            <div className="p-3 bg-foreground/5 rounded-xl border border-card-border text-brand-accent">
              <Globe2 size={24} />
            </div>
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-brand-accent/5 rounded-full blur-xl group-hover:bg-brand-accent/10 transition-colors"></div>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-foreground/60 text-sm font-medium">Leads de Productos</p>
              <h3 className="text-3xl font-bold mt-2 text-foreground">{totalProductLeads}</h3>
            </div>
            <div className="p-3 bg-foreground/5 rounded-xl border border-card-border text-brand-accent">
              <PackageSearch size={24} />
            </div>
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-brand-accent/5 rounded-full blur-xl group-hover:bg-brand-accent/10 transition-colors"></div>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-foreground/60 text-sm font-medium">Leads de Servicios</p>
              <h3 className="text-3xl font-bold mt-2 text-foreground">{totalServiceLeads}</h3>
            </div>
            <div className="p-3 bg-foreground/5 rounded-xl border border-card-border text-brand-accent">
              <Wrench size={24} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Product Leads Table */}
        <div className="glass-card rounded-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <MessageCircle size={20} className="text-green-500" />
              Últimos Interesados en Productos
            </h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-card-border text-foreground/60 text-sm">
                  <th className="pb-3 font-medium">Producto</th>
                  <th className="pb-3 font-medium">País</th>
                  <th className="pb-3 font-medium text-right">Fecha</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {recentProductLeads.map((lead) => (
                  <tr key={lead.lead_id} className="border-b border-card-border/50 hover:bg-foreground/5 transition-colors">
                    <td className="py-4 font-medium max-w-[200px] truncate pr-4">
                      {lead.product?.name || 'Producto Eliminado'}
                    </td>
                    <td className="py-4">
                      <span className="bg-foreground/10 px-2 py-1 rounded text-xs">
                        {lead.country || 'Desconocido'}
                      </span>
                    </td>
                    <td className="py-4 text-foreground/60 text-right text-xs" title={new Date(lead.created_at).toLocaleString()}>
                      {formatRelativeDate(lead.created_at)}
                    </td>
                  </tr>
                ))}
                {recentProductLeads.length === 0 && (
                  <tr>
                    <td colSpan={3} className="py-8 text-center text-foreground/50">
                      No hay leads de productos aún.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Service Leads Table */}
        <div className="glass-card rounded-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <MessageCircle size={20} className="text-green-500" />
              Últimos Interesados en Servicios
            </h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-card-border text-foreground/60 text-sm">
                  <th className="pb-3 font-medium">Servicio</th>
                  <th className="pb-3 font-medium">País</th>
                  <th className="pb-3 font-medium text-right">Fecha</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {recentServiceLeads.map((lead) => (
                  <tr key={lead.lead_id} className="border-b border-card-border/50 hover:bg-foreground/5 transition-colors">
                    <td className="py-4 font-medium max-w-[200px] truncate pr-4">
                      {lead.service?.name || 'Servicio Eliminado'}
                    </td>
                    <td className="py-4">
                      <span className="bg-foreground/10 px-2 py-1 rounded text-xs">
                        {lead.country || 'Desconocido'}
                      </span>
                    </td>
                    <td className="py-4 text-foreground/60 text-right text-xs" title={new Date(lead.created_at).toLocaleString()}>
                      {formatRelativeDate(lead.created_at)}
                    </td>
                  </tr>
                ))}
                {recentServiceLeads.length === 0 && (
                  <tr>
                    <td colSpan={3} className="py-8 text-center text-foreground/50">
                      No hay leads de servicios aún.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import { 
  BarChart3, 
  MessageCircle, 
  Globe2, 
  PackageSearch,
  Wrench
} from 'lucide-react';
import DataTable, { ColumnDef } from '@/components/ui/DataTable';
import { formatRelativeDate } from '@/lib/formatDate';

export default function AnalyticsClient({ 
  totalVisits, 
  totalProductLeads, 
  totalServiceLeads, 
  recentProductLeads, 
  recentServiceLeads 
}: { 
  totalVisits: number, 
  totalProductLeads: number, 
  totalServiceLeads: number, 
  recentProductLeads: any[], 
  recentServiceLeads: any[] 
}) {

  const productColumns: ColumnDef<any>[] = [
    {
      header: 'Producto',
      accessorKey: 'product.name',
      cell: (lead) => (
        <span className="font-medium max-w-[200px] truncate pr-4">
          {lead.product?.name || 'Producto Eliminado'}
        </span>
      )
    },
    {
      header: 'País',
      accessorKey: 'country',
      cell: (lead) => (
        <span className="bg-foreground/10 px-2 py-1 rounded text-xs">
          {lead.country || 'Desconocido'}
        </span>
      )
    },
    {
      header: 'Fecha',
      accessorKey: 'created_at',
      cell: (lead) => (
        <span className="text-foreground/60 text-xs" title={new Date(lead.created_at).toLocaleString()}>
          {formatRelativeDate(lead.created_at)}
        </span>
      )
    }
  ];

  const serviceColumns: ColumnDef<any>[] = [
    {
      header: 'Servicio',
      accessorKey: 'service.name',
      cell: (lead) => (
        <span className="font-medium max-w-[200px] truncate pr-4">
          {lead.service?.name || 'Servicio Eliminado'}
        </span>
      )
    },
    {
      header: 'País',
      accessorKey: 'country',
      cell: (lead) => (
        <span className="bg-foreground/10 px-2 py-1 rounded text-xs">
          {lead.country || 'Desconocido'}
        </span>
      )
    },
    {
      header: 'Fecha',
      accessorKey: 'created_at',
      cell: (lead) => (
        <span className="text-foreground/60 text-xs" title={new Date(lead.created_at).toLocaleString()}>
          {formatRelativeDate(lead.created_at)}
        </span>
      )
    }
  ];

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
        <div className="glass-card rounded-2xl overflow-hidden p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <MessageCircle size={20} className="text-green-500" />
              Interesados en Productos
            </h2>
          </div>
          
          <DataTable 
            data={recentProductLeads} 
            columns={productColumns} 
            searchPlaceholder="Buscar lead de producto..."
            searchKeys={['product.name', 'country']}
            itemsPerPage={5}
            enableExport={true}
            exportFilename="Leads_Productos_Ecotechne"
          />
        </div>

        {/* Service Leads Table */}
        <div className="glass-card rounded-2xl overflow-hidden p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <MessageCircle size={20} className="text-green-500" />
              Interesados en Servicios
            </h2>
          </div>
          
          <DataTable 
            data={recentServiceLeads} 
            columns={serviceColumns} 
            searchPlaceholder="Buscar lead de servicio..."
            searchKeys={['service.name', 'country']}
            itemsPerPage={5}
            enableExport={true}
            exportFilename="Leads_Servicios_Ecotechne"
          />
        </div>
      </div>
    </div>
  );
}

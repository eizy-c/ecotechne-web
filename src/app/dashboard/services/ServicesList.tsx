'use client';

import DataTable, { ColumnDef } from '@/components/ui/DataTable';
import Link from 'next/link';
import { Edit, ShieldCheck, ShieldAlert, Plus } from 'lucide-react';
import DeleteButton from '@/components/ui/DeleteButton';
import { deleteService } from '@/actions/services';

export default function ServicesList({ services }: { services: any[] }) {
  const columns: ColumnDef<any>[] = [
    {
      header: 'Servicio',
      accessorKey: 'name',
      cell: (service) => (
        <div>
          <div className="font-semibold text-foreground group-hover:text-brand-accent transition-colors">
            {service.name}
          </div>
          <div className="text-xs text-foreground/50 font-mono text-ellipsis overflow-hidden w-32 whitespace-nowrap" title={service.slug}>
            {service.slug}
          </div>
        </div>
      )
    },
    {
      header: 'Descripción',
      accessorKey: 'description',
      cell: (service) => (
        <div className="text-foreground/70 max-w-sm truncate">
          {service.description || '-'}
        </div>
      )
    },
    {
      header: 'Estado',
      accessorKey: 'active',
      cell: (service) => (
        service.active ? (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-500/10 text-green-500">
            <ShieldCheck size={14} /> Activo
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-500/10 text-red-500">
            <ShieldAlert size={14} /> Inactivo
          </span>
        )
      )
    },
    {
      header: 'Acciones',
      sortable: false,
      cell: (service) => (
        <div className="flex items-center justify-end gap-2">
          <Link 
            href={`/dashboard/services/${service.service_id}`}
            className="p-2 text-foreground/50 hover:text-brand-accent hover:bg-brand-accent/10 rounded-lg transition-colors"
          >
            <Edit size={18} />
          </Link>
          <DeleteButton 
            onDelete={async () => {
              await deleteService(service.service_id);
            }}
            itemName={`Servicio: ${service.name}`}
          />
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Servicios</h2>
          <p className="text-foreground/50 mt-1">Gestiona los servicios que ofreces</p>
        </div>
        <Link 
          href="/dashboard/services/create"
          className="bg-brand-accent text-brand-dark px-6 py-2.5 rounded-xl font-bold hover:scale-105 transition-transform flex items-center gap-2 shadow-[0_0_15px_rgba(255,109,36,0.2)]"
        >
          <Plus size={20} />
          <span>Añadir</span>
        </Link>
      </div>
      
      <DataTable 
        data={services} 
        columns={columns} 
        searchPlaceholder="Buscar servicio..."
        searchKeys={['name', 'slug', 'description']}
        enableExport={true}
        exportFilename="Reporte_Servicios_Ecotechne"
      />
    </div>
  );
}

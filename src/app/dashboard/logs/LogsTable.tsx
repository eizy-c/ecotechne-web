'use client';

import DataTable, { ColumnDef } from '@/components/ui/DataTable';
import { formatRelativeDate } from '@/lib/formatDate';

export default function LogsTable({ logs }: { logs: any[] }) {
  const columns: ColumnDef<any>[] = [
    {
      header: 'Usuario',
      accessorKey: 'user.name',
      cell: (item) => (
        <div>
          <p className="font-medium text-foreground">{item.user?.name || 'Sistema / Anónimo'}</p>
          {item.user?.email && <p className="text-xs text-foreground/50">{item.user.email}</p>}
        </div>
      )
    },
    {
      header: 'Acción',
      accessorKey: 'action',
      cell: (item) => {
        let color = 'bg-foreground/10 text-foreground';
        switch (item.action) {
          case 'CREATE': color = 'bg-emerald-500/10 text-emerald-500'; break;
          case 'UPDATE': color = 'bg-blue-500/10 text-blue-500'; break;
          case 'DELETE': color = 'bg-red-500/10 text-red-500'; break;
          case 'LOGIN': color = 'bg-purple-500/10 text-purple-500'; break;
        }
        return <span className={`px-2 py-1 rounded-full text-xs font-semibold ${color}`}>{item.action}</span>;
      }
    },
    {
      header: 'Módulo',
      accessorKey: 'entity',
      cell: (item) => <span className="font-mono text-xs">{item.entity} {item.entity_id ? `#${item.entity_id}` : ''}</span>
    },
    {
      header: 'Detalles',
      accessorKey: 'details',
      sortable: false,
      cell: (item) => {
        if (!item.details) return <span className="text-foreground/30">-</span>;
        try {
          const parsed = JSON.parse(item.details);
          return (
            <div className="text-xs text-foreground/60 max-w-xs truncate" title={item.details}>
              {Object.entries(parsed).map(([k, v]) => `${k}: ${v}`).join(' | ')}
            </div>
          );
        } catch {
          return <div className="text-xs text-foreground/60 max-w-xs truncate">{item.details}</div>;
        }
      }
    },
    {
      header: 'Fecha',
      accessorKey: 'created_at',
      cell: (item) => (
        <span className="text-foreground/70" title={new Date(item.created_at).toLocaleString('es-ES')}>
          {formatRelativeDate(item.created_at)}
        </span>
      )
    }
  ];

  return (
    <DataTable 
      data={logs} 
      columns={columns} 
      searchKeys={['user.name', 'user.email', 'action', 'entity', 'details']}
      searchPlaceholder="Buscar por usuario, acción, módulo..."
    />
  );
}

'use client';

import DataTable, { ColumnDef } from '@/components/ui/DataTable';
import { Check, Phone, Clock, Mail, Globe } from 'lucide-react';
import DeleteButton from '@/components/ui/DeleteButton';
import { markMessageAsRead, deleteMessage } from '@/actions/messages';
import { formatRelativeDate } from '@/lib/formatDate';

export default function MessagesTable({ messages }: { messages: any[] }) {
  const columns: ColumnDef<any>[] = [
    {
      header: 'Remitente',
      accessorKey: 'name',
      cell: (msg) => (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className={`font-bold ${msg.is_read ? 'text-foreground/70' : 'text-foreground'}`}>
              {msg.name}
            </span>
            {!msg.is_read && (
              <span className="bg-brand-accent text-brand-dark text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                Nuevo
              </span>
            )}
          </div>
          <div className="flex flex-col gap-1.5 text-xs text-foreground/60 mt-2">
            <div className="flex items-center gap-1.5">
              <Mail size={12} className="text-brand-accent" />
              <a href={`mailto:${msg.email}`} className="hover:text-brand-accent transition-colors">
                {msg.email || 'Sin correo'}
              </a>
            </div>
            <div className="flex items-center gap-1.5">
              <Phone size={12} className="text-brand-accent" />
              <a href={`https://wa.me/${msg.phone.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="hover:text-brand-accent transition-colors">
                {msg.phone}
              </a>
            </div>
            {msg.country && (
              <div className="flex items-center gap-1.5">
                <Globe size={12} className="text-brand-accent" />
                <span>{msg.country}</span>
              </div>
            )}
          </div>
        </div>
      )
    },
    {
      header: 'Mensaje',
      accessorKey: 'message',
      sortable: false,
      cell: (msg) => (
        <div className={`text-sm ${msg.is_read ? 'text-foreground/50' : 'text-foreground/80'} max-w-md break-words whitespace-pre-wrap line-clamp-3`} title={msg.message}>
          {msg.message}
        </div>
      )
    },
    {
      header: 'Fecha',
      accessorKey: 'created_at',
      cell: (msg) => (
        <div className="text-xs text-foreground/50 flex items-center gap-1 whitespace-nowrap">
          <Clock size={12} />
          <span title={new Date(msg.created_at).toLocaleString('es-ES')}>
            {formatRelativeDate(msg.created_at)}
          </span>
        </div>
      )
    },
    {
      header: 'Acciones',
      sortable: false,
      cell: (msg) => (
        <div className="flex items-center justify-end gap-2">
          {!msg.is_read && (
            <button 
              onClick={async () => {
                await markMessageAsRead(msg.message_id);
              }}
              title="Marcar como leído"
              className="p-2 bg-foreground/5 hover:bg-green-500/10 text-foreground/70 hover:text-green-500 rounded-lg transition-colors"
            >
              <Check size={16} />
            </button>
          )}
          <DeleteButton 
            onDelete={async () => {
              await deleteMessage(msg.message_id);
            }}
            itemName={`Mensaje de ${msg.name}`}
          />
        </div>
      )
    }
  ];

  return (
    <DataTable 
      data={messages} 
      columns={columns} 
      searchPlaceholder="Buscar por nombre, correo, teléfono o mensaje..."
      searchKeys={['name', 'email', 'phone', 'message', 'country']}
      itemsPerPage={10}
      rowClassName={(msg) => !msg.is_read ? 'bg-brand-accent/5 border-l-4 border-l-brand-accent relative' : 'border-l-4 border-l-transparent'}
    />
  );
}

import { ContactMessage } from '@/Models/ContactMessage';
import { Mail } from 'lucide-react';
import MessagesTable from './MessagesTable';

export default async function MessagesPage() {
  const messages = await ContactMessage.findAll();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Mensajes de Contacto</h2>
          <p className="text-foreground/50 mt-1">Leads y consultas recibidas desde la página web</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Panel Izquierdo: Lista de mensajes */}
        <div className="lg:col-span-3 glass-card rounded-2xl border border-card-border overflow-hidden">
          {messages.length === 0 ? (
            <div className="p-12 text-center text-foreground/50">
              <Mail size={48} className="mx-auto mb-4 opacity-50" />
              <p className="text-lg">Tu bandeja de entrada está limpia.</p>
              <p className="text-sm">No hay mensajes nuevos por el momento.</p>
            </div>
          ) : (
            <MessagesTable messages={messages} />
          )}
        </div>
      </div>
    </div>
  );
}

import { ContactMessage } from '@/Models/ContactMessage';
import { markMessageAsRead, deleteMessage } from '@/actions/messages';
import { Mail, Check, Trash2, Phone, Clock } from 'lucide-react';
import DeleteButton from '@/components/ui/DeleteButton';

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
            <div className="divide-y divide-card-border">
              {messages.map((msg) => (
                <div 
                  key={msg.message_id} 
                  className={`p-6 transition-colors ${msg.is_read ? 'bg-background/20 opacity-70' : 'bg-brand-accent/5 hover:bg-brand-accent/10 border-l-4 border-l-brand-accent'}`}
                >
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-3">
                        <div className="font-bold text-foreground text-lg">{msg.name}</div>
                        {!msg.is_read && (
                          <span className="bg-brand-accent text-brand-dark text-xs px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                            Nuevo
                          </span>
                        )}
                        <div className="text-foreground/40 text-sm flex items-center gap-1">
                          <Clock size={14} />
                          {new Date(msg.created_at).toLocaleString('es-ES')}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm font-medium text-foreground/70">
                        <div className="flex items-center gap-1.5">
                          <Phone size={14} className="text-brand-accent" />
                          <a href={`https://wa.me/${msg.phone.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="hover:text-brand-accent transition-colors">
                            {msg.phone}
                          </a>
                        </div>
                      </div>

                      <div className="mt-4 p-4 bg-background/50 rounded-xl text-foreground/90 leading-relaxed border border-card-border">
                        {msg.message}
                      </div>
                    </div>

                    <div className="flex items-start md:flex-col justify-end gap-2 shrink-0 border-t md:border-t-0 md:border-l border-card-border pt-4 md:pt-0 md:pl-4">
                      {!msg.is_read && (
                        <form action={async () => {
                          'use server';
                          await markMessageAsRead(msg.message_id);
                        }}>
                          <button 
                            type="submit"
                            title="Marcar como leído"
                            className="w-full flex items-center justify-center gap-2 p-2 bg-foreground/5 hover:bg-green-500/10 text-foreground/70 hover:text-green-500 rounded-lg transition-colors font-medium text-sm"
                          >
                            <Check size={16} /> <span className="md:hidden">Leído</span>
                          </button>
                        </form>
                      )}
                      <DeleteButton 
                        onDelete={async () => {
                          'use server';
                          await deleteMessage(msg.message_id);
                        }}
                        itemName={`Mensaje de ${msg.name}`}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

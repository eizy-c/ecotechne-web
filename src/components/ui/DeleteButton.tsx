'use client';

import { Trash2, AlertTriangle } from 'lucide-react';
import { useState, useTransition } from 'react';
import { toast } from 'react-hot-toast';

export default function DeleteButton({ 
  onDelete, 
  itemName = "este registro" 
}: { 
  onDelete: () => Promise<void>;
  itemName?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleConfirm = () => {
    startTransition(async () => {
      try {
        await onDelete();
        toast.success("Eliminado exitosamente");
        setIsOpen(false);
      } catch (e: any) {
        toast.error(e.message || "Error al intentar eliminar. Por favor, inténtalo de nuevo.");
      }
    });
  };

  return (
    <>
      <button 
        type="button"
        onClick={(e) => { e.preventDefault(); setIsOpen(true); }}
        className="p-2 text-foreground/50 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
        title="Eliminar"
      >
        <Trash2 size={18} />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="bg-card border border-card-border rounded-2xl p-6 w-full max-w-sm shadow-2xl animate-fade-in-up">
            <div className="flex items-center gap-4 mb-4 text-red-500">
              <div className="p-3 bg-red-500/10 rounded-full">
                <AlertTriangle size={24} />
              </div>
              <h3 className="text-xl font-bold text-foreground">Confirmar Acción</h3>
            </div>
            
            <p className="text-foreground/70 mb-6 text-sm">
              ¿Estás seguro que deseas eliminar <strong>{itemName}</strong>? Esta acción lo removerá de las vistas del sistema.
            </p>
            
            <div className="flex gap-3 justify-end">
              <button 
                type="button"
                onClick={() => setIsOpen(false)}
                disabled={isPending}
                className="px-4 py-2 rounded-xl text-foreground/70 hover:bg-foreground/5 font-medium transition-colors text-sm"
              >
                Cancelar
              </button>
              <button 
                type="button"
                onClick={handleConfirm}
                disabled={isPending}
                className="px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold transition-colors flex items-center gap-2 shadow-[0_0_15px_rgba(239,68,68,0.3)] disabled:opacity-70 text-sm"
              >
                {isPending ? <i className="fa-solid fa-spinner fa-spin"></i> : <Trash2 size={16} />}
                {isPending ? 'Procesando...' : 'Sí, eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

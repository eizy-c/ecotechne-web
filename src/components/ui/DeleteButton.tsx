'use client';

import { Trash2, AlertTriangle } from 'lucide-react';
import { useState, useTransition, useEffect } from 'react';
import { createPortal } from 'react-dom';
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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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

      {isOpen && mounted && createPortal(
        <div 
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
          onClick={() => setIsOpen(false)}
        >
          <div 
            className="bg-[#1A0F0A] border border-white/10 rounded-3xl p-6 w-full max-w-sm shadow-[0_20px_50px_rgba(0,0,0,0.5)] animate-fade-in-up relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Ambient Glow */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500/50 to-transparent"></div>
            <div className="absolute -top-10 -left-10 w-32 h-32 bg-red-500/10 blur-3xl rounded-full pointer-events-none"></div>

            <div className="flex items-center gap-4 mb-4 relative z-10">
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                <AlertTriangle size={24} />
              </div>
              <h3 className="text-xl font-bold text-foreground">Confirmar Acción</h3>
            </div>
            
            <p className="text-foreground/70 mb-8 text-sm relative z-10">
              ¿Estás seguro que deseas eliminar <strong>{itemName}</strong>? Esta acción lo removerá permanentemente del sistema.
            </p>
            
            <div className="flex gap-3 justify-end relative z-10">
              <button 
                type="button"
                onClick={() => setIsOpen(false)}
                disabled={isPending}
                className="px-5 py-2.5 rounded-xl text-foreground/70 hover:text-foreground hover:bg-white/5 border border-transparent hover:border-white/10 font-medium transition-all text-sm"
              >
                Cancelar
              </button>
              <button 
                type="button"
                onClick={handleConfirm}
                disabled={isPending}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-500 to-red-600 hover:from-red-400 hover:to-red-500 text-white font-bold transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(239,68,68,0.3)] hover:shadow-[0_0_25px_rgba(239,68,68,0.5)] disabled:opacity-70 text-sm border border-red-400/50"
              >
                {isPending ? <i className="fa-solid fa-spinner fa-spin"></i> : <Trash2 size={16} />}
                {isPending ? 'Procesando...' : 'Sí, eliminar'}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}

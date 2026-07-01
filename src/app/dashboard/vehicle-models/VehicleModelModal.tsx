'use client';

import { useState } from 'react';
import Modal from '@/components/ui/Modal';
import { createVehicleModel, updateVehicleModel } from '@/actions/vehicleModels';
import { Save } from 'lucide-react';
import toast from 'react-hot-toast';

interface VehicleModelModalProps {
  isOpen: boolean;
  onClose: () => void;
  model?: { vehicle_model_id: number; name: string; brand_id: number } | null;
  brands: { brand_id: number; name: string }[];
}

export default function VehicleModelModal({ isOpen, onClose, model, brands }: VehicleModelModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);

    try {
      if (model) {
        await updateVehicleModel(model.vehicle_model_id, formData);
        toast.success('Modelo actualizado correctamente');
      } else {
        await createVehicleModel(formData);
        toast.success('Modelo creado correctamente');
      }
      onClose();
    } catch (err: any) {
      if (err.message !== 'NEXT_REDIRECT') {
        setError(err.message || 'Ocurrió un error al guardar');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={model ? 'Editar Modelo' : 'Nuevo Modelo'}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="brand_id" className="block text-sm font-semibold text-foreground mb-2">Marca del Vehículo *</label>
          <select 
            id="brand_id"
            name="brand_id"
            required
            defaultValue={model?.brand_id || ''}
            className="w-full bg-background/50 border border-card-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-brand-accent transition-colors"
          >
            <option value="">Selecciona una marca...</option>
            {brands.map(brand => (
              <option key={brand.brand_id} value={brand.brand_id}>
                {brand.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="name" className="block text-sm font-semibold text-foreground mb-2">Nombre del Modelo *</label>
          <input 
            type="text" 
            id="name"
            name="name"
            required
            defaultValue={model?.name || ''}
            placeholder="Ej: Hilux, Ranger..."
            className="w-full bg-background/50 border border-card-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-brand-accent transition-colors"
          />
        </div>

        <div className="pt-4 flex justify-end gap-3">
          <button 
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl font-semibold text-foreground hover:bg-foreground/5 transition-colors"
          >
            Cancelar
          </button>
          <button 
            type="submit"
            disabled={loading}
            className="bg-brand-accent text-brand-dark px-8 py-2.5 rounded-xl font-bold hover:scale-105 transition-transform flex items-center gap-2 shadow-[0_0_15px_rgba(255,109,36,0.2)] disabled:opacity-50 disabled:hover:scale-100"
          >
            <Save size={20} />
            <span>{loading ? 'Guardando...' : 'Guardar'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
}

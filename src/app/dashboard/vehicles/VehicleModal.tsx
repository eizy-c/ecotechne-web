'use client';

import { useState } from 'react';
import Modal from '@/components/ui/Modal';
import { createVehicle, updateVehicle } from '@/actions/vehicles';
import { Save } from 'lucide-react';
import toast from 'react-hot-toast';
import VehicleFormSelectors from './VehicleFormSelectors';

interface VehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle?: any | null;
  brands: any[];
  models: any[];
}

export default function VehicleModal({ isOpen, onClose, vehicle, brands, models }: VehicleModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);

    try {
      if (vehicle) {
        await updateVehicle(vehicle.vehicle_id, formData);
        toast.success('Vehículo actualizado correctamente');
      } else {
        await createVehicle(formData);
        toast.success('Vehículo creado correctamente');
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
      title={vehicle ? 'Editar Vehículo' : 'Nuevo Vehículo'}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <VehicleFormSelectors 
          brands={brands} 
          models={models} 
          defaultBrandId={vehicle?.brand_id} 
          defaultModelId={vehicle?.vehicle_model_id}
        />

        <div>
          <label htmlFor="year" className="block text-sm font-semibold text-foreground mb-2">Año *</label>
          <input 
            type="text" 
            id="year"
            name="year"
            required
            defaultValue={vehicle?.year || ''}
            placeholder="Ej: 2021-2024 o 2023"
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

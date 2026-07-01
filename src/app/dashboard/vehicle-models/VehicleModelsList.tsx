'use client';

import { useState } from 'react';
import { Plus, Edit, Car } from 'lucide-react';
import DeleteButton from '@/components/ui/DeleteButton';
import { deleteVehicleModel } from '@/actions/vehicleModels';
import VehicleModelModal from './VehicleModelModal';
import toast from 'react-hot-toast';

interface Brand {
  brand_id: number;
  name: string;
}

interface VehicleModel {
  vehicle_model_id: number;
  name: string;
  brand_id: number;
  brand?: Brand;
}

export default function VehicleModelsList({ 
  initialModels, 
  brands 
}: { 
  initialModels: VehicleModel[], 
  brands: Brand[] 
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingModel, setEditingModel] = useState<VehicleModel | null>(null);

  const handleCreate = () => {
    setEditingModel(null);
    setIsModalOpen(true);
  };

  const handleEdit = (model: VehicleModel) => {
    setEditingModel(model);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Modelos de Vehículos</h2>
          <p className="text-foreground/50 mt-1">Gestiona los modelos asociados a cada marca</p>
        </div>
        <button 
          onClick={handleCreate}
          className="bg-brand-accent text-brand-dark px-6 py-3 rounded-xl font-bold hover:scale-105 transition-transform flex items-center gap-2 shadow-[0_0_15px_rgba(255,109,36,0.2)]"
        >
          <Plus size={20} />
          <span>Nuevo Modelo</span>
        </button>
      </div>

      <div className="glass-card rounded-2xl border border-card-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-card-border/50 bg-foreground/5">
                <th className="p-4 font-semibold text-foreground/80">Modelo</th>
                <th className="p-4 font-semibold text-foreground/80">Marca</th>
                <th className="p-4 font-semibold text-foreground/80 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-card-border/50">
              {initialModels.map((model) => (
                <tr key={model.vehicle_model_id} className="hover:bg-foreground/5 transition-colors group">
                  <td className="p-4 font-medium text-foreground flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-brand-accent/10 flex items-center justify-center text-brand-accent">
                      <Car size={20} />
                    </div>
                    {model.name}
                  </td>
                  <td className="p-4 text-foreground/70">
                    <span className="inline-flex items-center gap-1.5 bg-foreground/10 px-2.5 py-1 rounded-md text-sm font-medium">
                      {model.brand?.name || 'Desconocida'}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleEdit(model)}
                        className="p-2 text-foreground/50 hover:text-brand-accent hover:bg-brand-accent/10 rounded-lg transition-colors"
                        title="Editar"
                      >
                        <Edit size={18} />
                      </button>
                      <DeleteButton 
                        onDelete={async () => {
                          await deleteVehicleModel(model.vehicle_model_id);
                          toast.success('Modelo eliminado correctamente');
                        }}
                        itemName={`el modelo ${model.name}`}
                      />
                    </div>
                  </td>
                </tr>
              ))}
              {initialModels.length === 0 && (
                <tr>
                  <td colSpan={3} className="p-8 text-center text-foreground/50 italic">
                    No hay modelos de vehículos registrados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <VehicleModelModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        model={editingModel}
        brands={brands}
      />
    </div>
  );
}

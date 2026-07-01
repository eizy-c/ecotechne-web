'use client';

import { useState } from 'react';
import { Plus, Edit, CarFront } from 'lucide-react';
import DeleteButton from '@/components/ui/DeleteButton';
import { deleteVehicle } from '@/actions/vehicles';
import VehicleModal from './VehicleModal';
import toast from 'react-hot-toast';

export default function VehiclesList({ 
  initialVehicles, 
  brands,
  models
}: { 
  initialVehicles: any[], 
  brands: any[],
  models: any[]
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<any | null>(null);

  const handleCreate = () => {
    setEditingVehicle(null);
    setIsModalOpen(true);
  };

  const handleEdit = (vehicle: any) => {
    setEditingVehicle(vehicle);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Vehículos</h2>
          <p className="text-foreground/50 mt-1">Gestiona los vehículos específicos (año y modelo)</p>
        </div>
        <button 
          onClick={handleCreate}
          className="bg-brand-accent text-brand-dark px-6 py-3 rounded-xl font-bold hover:scale-105 transition-transform flex items-center gap-2 shadow-[0_0_15px_rgba(255,109,36,0.2)]"
        >
          <Plus size={20} />
          <span>Nuevo Vehículo</span>
        </button>
      </div>

      <div className="glass-card rounded-2xl border border-card-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-card-border/50 bg-foreground/5">
                <th className="p-4 font-semibold text-foreground/80">Vehículo</th>
                <th className="p-4 font-semibold text-foreground/80 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-card-border/50">
              {initialVehicles.map((vehicle) => (
                <tr key={vehicle.vehicle_id} className="hover:bg-foreground/5 transition-colors group">
                  <td className="p-4 font-medium text-foreground flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-brand-accent/10 flex items-center justify-center text-brand-accent shrink-0">
                      <CarFront size={24} />
                    </div>
                    <div>
                      <div className="font-bold text-lg">
                        {vehicle.brand?.name} {vehicle.model?.name}
                      </div>
                      <div className="text-sm text-foreground/50 font-mono">
                        Año: {vehicle.year}
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleEdit(vehicle)}
                        className="p-2 text-foreground/50 hover:text-brand-accent hover:bg-brand-accent/10 rounded-lg transition-colors"
                        title="Editar"
                      >
                        <Edit size={18} />
                      </button>
                      <DeleteButton 
                        onDelete={async () => {
                          await deleteVehicle(vehicle.vehicle_id);
                          toast.success('Vehículo eliminado correctamente');
                        }}
                        itemName={`el vehículo ${vehicle.brand?.name} ${vehicle.model?.name}`}
                      />
                    </div>
                  </td>
                </tr>
              ))}
              {initialVehicles.length === 0 && (
                <tr>
                  <td colSpan={2} className="p-8 text-center text-foreground/50 italic">
                    No hay vehículos registrados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <VehicleModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        vehicle={editingVehicle}
        brands={brands}
        models={models}
      />
    </div>
  );
}

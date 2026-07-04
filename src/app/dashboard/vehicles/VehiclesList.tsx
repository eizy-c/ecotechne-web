'use client';

import { useState } from 'react';
import { Plus, Edit, CarFront } from 'lucide-react';
import DeleteButton from '@/components/ui/DeleteButton';
import VehicleModal from './VehicleModal';
import toast from 'react-hot-toast';
import DataTable, { ColumnDef } from '@/components/ui/DataTable';
import { deleteVehicle } from '@/actions/vehicles';

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
          <span>Añadir</span>
        </button>
      </div>

      <DataTable 
        data={initialVehicles}
        columns={[
          {
            header: 'Vehículo',
            accessorKey: 'brand.name', // Sirve para el sort (usa el nombre de la marca)
            cell: (vehicle) => (
              <div className="font-medium text-foreground flex items-center gap-4">
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
              </div>
            )
          },
          {
            header: 'Acciones',
            sortable: false,
            cell: (vehicle) => (
              <div className="flex items-center justify-end gap-2">
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
                  }}
                  itemName={`el vehículo ${vehicle.brand?.name} ${vehicle.model?.name}`}
                />
              </div>
            )
          }
        ]}
        searchPlaceholder="Buscar vehículo..."
        searchKeys={['brand.name', 'model.name', 'year']}
        itemsPerPage={10}
      />

      <VehicleModal 
        key={isModalOpen ? (editingVehicle?.vehicle_id || 'new') : 'closed'}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        vehicle={editingVehicle}
        brands={brands}
        models={models}
      />
    </div>
  );
}

import { Vehicle } from '@/Models/Vehicle';
import { Brand } from '@/Models/Brand';
import { VehicleModel } from '@/Models/VehicleModel';
import VehiclesList from './VehiclesList';

export default async function VehiclesPage() {
  const [vehicles, brands, models] = await Promise.all([
    Vehicle.findAll(),
    Brand.findAll(),
    VehicleModel.findAll()
  ]);

  const serializedVehicles = JSON.parse(JSON.stringify(vehicles));
  const serializedBrands = JSON.parse(JSON.stringify(brands));
  const serializedModels = JSON.parse(JSON.stringify(models));

  return (
    <VehiclesList 
      initialVehicles={serializedVehicles}
      brands={serializedBrands}
      models={serializedModels}
    />
  );
}

import { VehicleModel } from '@/Models/VehicleModel';
import { Brand } from '@/Models/Brand';
import VehicleModelsList from './VehicleModelsList';

export default async function VehicleModelsPage() {
  const [models, brands] = await Promise.all([
    VehicleModel.findAll(),
    Brand.findAll()
  ]);

  const serializedModels = JSON.parse(JSON.stringify(models));
  const serializedBrands = JSON.parse(JSON.stringify(brands));

  return (
    <VehicleModelsList 
      initialModels={serializedModels} 
      brands={serializedBrands} 
    />
  );
}

import { Brand } from '@/Models/Brand';
import BrandsList from './BrandsList';

export default async function BrandsPage() {
  const brands = await Brand.findAll();

  // Serializar para pasar de Server a Client Component
  const serializedBrands = JSON.parse(JSON.stringify(brands));

  return <BrandsList initialBrands={serializedBrands} />;
}

import { Category } from '@/Models/Category';
import CategoriesList from './CategoriesList';

export default async function CategoriesPage() {
  const categories = await Category.findAll();

  // Serializar para pasar de Server a Client Component
  const serializedCategories = JSON.parse(JSON.stringify(categories));

  return <CategoriesList initialCategories={serializedCategories} />;
}

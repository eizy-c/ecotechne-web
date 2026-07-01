import { Category } from '@/Models/Category';
import { Vehicle } from '@/Models/Vehicle';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import CreateProductForm from './CreateProductForm';

export default async function CreateProductPage() {
  const categories = await Category.findAll();
  const vehicles = await Vehicle.findAll();

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link 
          href="/dashboard/products"
          className="p-2 bg-foreground/5 hover:bg-foreground/10 text-foreground rounded-xl transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h2 className="text-3xl font-bold text-foreground">Crear Producto</h2>
          <p className="text-foreground/50 mt-1">Añade un nuevo artículo al catálogo</p>
        </div>
      </div>

      <CreateProductForm categories={categories} vehicles={vehicles} />
    </div>
  );
}

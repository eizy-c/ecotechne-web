import { Product } from '@/Models/Product';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import ProductsTable from './ProductsTable';

export default async function ProductsPage() {
  const products = await Product.findAll();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Catálogo de Productos</h2>
          <p className="text-foreground/50 mt-1">Gestiona el inventario, precios y stock</p>
        </div>
        <Link 
          href="/dashboard/products/create"
          className="bg-brand-accent text-brand-dark px-6 py-2.5 rounded-xl font-bold hover:scale-105 transition-transform flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(255,109,36,0.2)] w-full sm:w-auto"
        >
          <Plus size={20} />
          <span>Añadir</span>
        </Link>
      </div>

      <ProductsTable products={products} />
    </div>
  );
}

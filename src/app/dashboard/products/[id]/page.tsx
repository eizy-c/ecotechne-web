import { Product } from '@/Models/Product';
import { Category } from '@/Models/Category';
import { Vehicle } from '@/Models/Vehicle';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { notFound } from 'next/navigation';
import EditProductForm from './EditProductForm';

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const productId = Number(resolvedParams.id);
  if (isNaN(productId)) notFound();

  const product = await Product.findById(productId);
  const categories = await Category.findAll();
  const vehicles = await Vehicle.findAll();
  
  if (!product) {
    notFound();
  }

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
          <h2 className="text-3xl font-bold text-foreground">Editar Producto</h2>
          <p className="text-foreground/50 mt-1">Modifica el precio, stock o datos del artículo</p>
        </div>
      </div>

      <EditProductForm product={product} categories={categories} vehicles={vehicles} />
    </div>
  );
}

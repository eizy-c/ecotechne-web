import { Product } from '@/Models/Product';
import Link from 'next/link';
import { Plus, Search, Edit, Tag, Box } from 'lucide-react';
import { deleteProduct } from '@/actions/products';
import DeleteButton from '@/components/ui/DeleteButton';
import Image from 'next/image';
import toast from 'react-hot-toast';

export default async function ProductsPage() {
  const products = await Product.findAll();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Catálogo de Productos</h2>
          <p className="text-foreground/50 mt-1">Gestiona el inventario, precios y stock</p>
        </div>
        <Link 
          href="/dashboard/products/create"
          className="bg-brand-accent text-brand-dark px-6 py-2.5 rounded-xl font-bold hover:scale-105 transition-transform flex items-center gap-2 shadow-[0_0_15px_rgba(255,109,36,0.2)]"
        >
          <Plus size={20} />
          <span>Nuevo Producto</span>
        </Link>
      </div>

      <div className="glass-card rounded-2xl border border-card-border overflow-hidden">
        <div className="p-4 border-b border-card-border flex justify-between items-center bg-card/50">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" size={18} />
            <input 
              type="text" 
              placeholder="Buscar producto..." 
              className="w-full bg-background/50 border border-card-border rounded-lg pl-10 pr-4 py-2 text-sm text-foreground focus:outline-none focus:border-brand-accent transition-colors"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-foreground/5 text-foreground/70 uppercase font-semibold text-xs tracking-wider">
              <tr>
                <th className="px-6 py-4">Producto</th>
                <th className="px-6 py-4">Categorías</th>
                <th className="px-6 py-4">Precio</th>
                <th className="px-6 py-4 text-center">Stock</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-card-border">
              {products.map((product) => (
                <tr key={product.product_id} className="hover:bg-foreground/5 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg overflow-hidden relative border border-card-border bg-background flex items-center justify-center text-foreground/20">
                        {product.image_url ? (
                          <Image 
                            src={product.image_url} 
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <Box size={24} />
                        )}
                      </div>
                      <div>
                        <div className="font-semibold text-foreground group-hover:text-brand-accent transition-colors">
                          {product.name}
                        </div>
                        <div className="text-xs text-foreground/50 font-mono text-ellipsis overflow-hidden w-32 whitespace-nowrap" title={product.slug}>
                          {product.slug}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                    <div className="flex flex-wrap gap-1">
                      {product.categories && product.categories.length > 0 ? (
                        product.categories.map((cat: any) => (
                          <span key={cat.category_id} className="inline-flex items-center gap-1.5 bg-foreground/10 px-2 py-0.5 rounded text-xs text-foreground/80 w-fit">
                            <Tag size={12} className="text-brand-accent" />
                            {cat.name}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-foreground/50">Sin Categorías</span>
                      )}
                    </div>
                    <div className="mt-2 text-xs text-foreground/60">
                      {product.vehicles && product.vehicles.length > 0 ? (
                        <span className="text-brand-accent/80 font-medium">Compatible con {product.vehicles.length} vehículo(s)</span>
                      ) : (
                        <span className="text-foreground/50 italic">Universal</span>
                      )}
                    </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-semibold text-foreground">
                    ${Number(product.price).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex items-center justify-center px-2 py-1 rounded-full text-xs font-bold ${
                      product.stock > 10 ? 'bg-green-500/20 text-green-500' :
                      product.stock > 0 ? 'bg-yellow-500/20 text-yellow-500' :
                      'bg-red-500/20 text-red-500'
                    }`}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link 
                        href={`/dashboard/products/${product.product_id}`}
                        className="p-2 text-foreground/50 hover:text-brand-accent hover:bg-brand-accent/10 rounded-lg transition-colors"
                      >
                        <Edit size={18} />
                      </Link>
                      <DeleteButton 
                        onDelete={async () => {
                          'use server';
                          await deleteProduct(product.product_id);
                          // Cannot easily toast from server action inside Server Component
                        }}
                        itemName={`Producto: ${product.name}`}
                      />
                    </div>
                  </td>
                </tr>
              ))}
              
              {products.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-foreground/50">
                    No hay productos registrados en el sistema.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

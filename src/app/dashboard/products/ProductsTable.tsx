'use client';

import DataTable, { ColumnDef } from '@/components/ui/DataTable';
import Image from 'next/image';
import { Box, Tag, Edit } from 'lucide-react';
import Link from 'next/link';
import DeleteButton from '@/components/ui/DeleteButton';
import { deleteProduct } from '@/actions/products';

export default function ProductsTable({ products }: { products: any[] }) {
  const columns: ColumnDef<any>[] = [
    {
      header: 'Producto',
      accessorKey: 'name',
      cell: (product) => (
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
      )
    },
    {
      header: 'Categorías',
      accessorKey: 'categories',
      sortable: false,
      cell: (product) => (
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
      )
    },
    {
      header: 'Stock',
      accessorKey: 'stock',
      cell: (product) => (
        <div className="text-center">
          <span className={`inline-flex items-center justify-center px-2 py-1 rounded-full text-xs font-bold ${
            product.stock > 10 ? 'bg-green-500/20 text-green-500' :
            product.stock > 0 ? 'bg-yellow-500/20 text-yellow-500' :
            'bg-red-500/20 text-red-500'
          }`}>
            {product.stock}
          </span>
        </div>
      )
    },
    {
      header: 'Acciones',
      sortable: false,
      cell: (product) => (
        <div className="flex items-center justify-end gap-2">
          <Link 
            href={`/dashboard/products/${product.product_id}`}
            className="p-2 text-foreground/50 hover:text-brand-accent hover:bg-brand-accent/10 rounded-lg transition-colors"
          >
            <Edit size={18} />
          </Link>
          <DeleteButton 
            onDelete={async () => {
              await deleteProduct(product.product_id);
            }}
            itemName={`Producto: ${product.name}`}
          />
        </div>
      )
    }
  ];

  return (
    <DataTable 
      data={products} 
      columns={columns} 
      searchPlaceholder="Buscar producto por nombre o slug..."
      searchKeys={['name', 'slug']}
      itemsPerPage={10}
      enableExport={true}
      exportFilename="Reporte_Productos_Ecotechne"
    />
  );
}

import { Product } from "@/Models/Product";
import StoreClient from "./StoreClient";
import { Category } from "@/Models/Category";
import { Brand } from "@/Models/Brand";
import { VehicleModel } from "@/Models/VehicleModel";

export default async function Store() {
  const products = await Product.findAll();
  const availableProducts = products.filter(p => p.stock > 0);
  const categories = await Category.findAll();
  const brands = await Brand.findAll();
  const models = await VehicleModel.findAll();

  if (availableProducts.length === 0) {
    return null;
  }

  // Convert to plain objects to pass to client component safely
  const serializedProducts = JSON.parse(JSON.stringify(availableProducts));
  const serializedCategories = JSON.parse(JSON.stringify(categories));
  const serializedBrands = JSON.parse(JSON.stringify(brands));
  const serializedModels = JSON.parse(JSON.stringify(models));

  return (
    <section id="tienda" className="py-24 bg-background transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-brand-accent font-bold uppercase text-sm tracking-widest mb-4">Catálogo Premium</h2>
          <h3 className="text-4xl md:text-5xl font-black text-foreground mb-6">Equipamiento 4x4</h3>
          <div className="h-1 w-20 bg-brand-accent mx-auto rounded-full"></div>
        </div>

        <StoreClient 
          products={serializedProducts} 
          categories={serializedCategories}
          brands={serializedBrands}
          models={serializedModels} 
        />
      </div>
    </section>
  );
}

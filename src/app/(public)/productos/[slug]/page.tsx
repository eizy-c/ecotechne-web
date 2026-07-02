import { Product } from '@/Models/Product';
import { notFound } from 'next/navigation';
import ProductGallery from '@/components/ui/ProductGallery';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, Calendar, CarFront, Palette, Type, CheckCircle2 } from 'lucide-react';
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const product = await Product.findBySlug(params.slug);
  if (!product) return { title: 'Producto no encontrado' };
  
  return {
    title: `${product.name} | EcoTechne`,
    description: product.description?.substring(0, 160) || `Comprar ${product.name} en EcoTechne.`,
  };
}

export default async function ProductDetailsPage({ params }: { params: { slug: string } }) {
  const product = await Product.findBySlug(params.slug);
  
  if (!product) {
    notFound();
  }

  // Combine main image and additional images for the gallery
  const allImages = [];
  if (product.image_url) allImages.push(product.image_url);
  if (product.images) {
    product.images.forEach((img: any) => {
      if (img.image_url !== product.image_url) {
        allImages.push(img.image_url);
      }
    });
  }

  // Get similar products (same category or brand) - for simplicity, just grab 4 random products for now
  const allProducts = await Product.findAll();
  const similarProducts = allProducts.filter(p => p.product_id !== product.product_id).slice(0, 4);

  // Extract specs from attached vehicles
  const vehicle = product.vehicles?.[0]; // If there are multiple, we'll just show the first one's specs or "Universal"
  
  const isUniversal = !vehicle;
  const brandName = isUniversal ? 'Universal' : vehicle?.brand?.name || 'N/A';
  const modelName = isUniversal ? 'Universal' : vehicle?.model?.name || 'N/A';
  const year = isUniversal ? 'N/A' : vehicle?.year || 'N/A';
  
  // Custom WhatsApp message
  const whatsappNumber = "584121234567"; // Default placeholder, ideally from an env var or settings
  const message = `Hola! Estoy interesado en el producto: ${product.name}. Me podrían dar más información?`;
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

  return (
    <main className="min-h-screen bg-background pt-24 pb-16">
      <div className="container mx-auto px-4 md:px-6">
        
        {/* Breadcrumbs */}
        <nav className="flex text-sm text-foreground/60 mb-8 overflow-x-auto whitespace-nowrap pb-2">
          <Link href="/" className="hover:text-brand-accent transition-colors">Inicio</Link>
          <ChevronRight size={16} className="mx-2 flex-shrink-0" />
          <Link href="/#store" className="hover:text-brand-accent transition-colors">Productos</Link>
          <ChevronRight size={16} className="mx-2 flex-shrink-0" />
          <span className="text-foreground font-medium truncate">{brandName.toUpperCase()}</span>
          <ChevronRight size={16} className="mx-2 flex-shrink-0" />
          <span className="text-foreground font-bold truncate">{product.name.toUpperCase()}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Left Column: Gallery & Details */}
          <div className="lg:col-span-8 space-y-10">
            
            {/* Header (Mobile) */}
            <div className="block lg:hidden space-y-2 mb-6">
              <h3 className="text-brand-accent font-bold tracking-widest text-sm uppercase">{brandName} {modelName}</h3>
              <h1 className="text-3xl font-black text-foreground">{product.name}</h1>
            </div>

            <ProductGallery images={allImages} />

            {/* Specifications Grid */}
            <div className="glass-card rounded-2xl p-6 border border-card-border">
              <h3 className="text-xl font-bold text-foreground mb-6">Especificaciones Principales</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-foreground/50 text-sm">
                    <Calendar size={16} /> Año
                  </div>
                  <span className="font-semibold text-foreground">{year}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-foreground/50 text-sm">
                    <CarFront size={16} /> Marca
                  </div>
                  <span className="font-semibold text-foreground">{brandName}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-foreground/50 text-sm">
                    <Type size={16} /> Modelo/Línea
                  </div>
                  <span className="font-semibold text-foreground">{modelName}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-foreground/50 text-sm">
                    <Palette size={16} /> Color
                  </div>
                  <span className="font-semibold text-foreground">N/A</span>
                </div>
              </div>
            </div>

            {/* Detailed Description */}
            {product.description && (
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-6 border-b border-card-border pb-4">Otras Características</h3>
                <div className="prose prose-invert max-w-none text-foreground/80 leading-relaxed whitespace-pre-line">
                  {product.description}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Sticky Action Card & Similar Products */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* Action Card */}
            <div className="glass-card rounded-3xl p-6 md:p-8 border border-card-border sticky top-28 shadow-2xl">
              {/* Header (Desktop) */}
              <div className="hidden lg:block space-y-2 mb-6">
                <h3 className="text-brand-accent font-bold tracking-widest text-sm uppercase">{brandName} {modelName}</h3>
                <h1 className="text-3xl md:text-4xl font-black text-foreground leading-tight">{product.name}</h1>
              </div>

              {/* Status/Stock */}
              <div className="flex items-center gap-3 mb-8">
                {product.stock > 0 ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-sm font-semibold border border-green-500/20">
                    <CheckCircle2 size={16} /> Disponible
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 text-red-500 text-sm font-semibold border border-red-500/20">
                    Agotado
                  </span>
                )}
                {product.categories?.map((c: any) => (
                  <span key={c.category_id} className="inline-flex px-3 py-1 rounded-full bg-foreground/5 text-foreground/60 text-sm border border-card-border">
                    {c.name}
                  </span>
                ))}
              </div>

              {/* Action Button */}
              <a 
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-3 bg-brand-accent text-brand-dark py-4 rounded-xl font-bold text-lg hover:scale-105 transition-transform shadow-[0_0_20px_rgba(255,109,36,0.3)] mb-4"
              >
                <i className="fa-brands fa-whatsapp text-2xl"></i>
                Solicitar Cotización
              </a>
              <p className="text-center text-xs text-foreground/50">
                Serás redirigido a WhatsApp para hablar con un asesor.
              </p>
            </div>

            {/* Similar Products */}
            {similarProducts.length > 0 && (
              <div>
                <h3 className="text-xl font-bold text-foreground mb-4 relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-16 after:h-1 after:bg-brand-accent">
                  Similares
                </h3>
                <div className="space-y-4">
                  {similarProducts.map((p) => (
                    <Link key={p.product_id} href={`/productos/${p.slug}`} className="flex gap-4 group bg-background/30 p-3 rounded-xl hover:bg-foreground/5 transition-colors border border-transparent hover:border-card-border">
                      <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-white flex-shrink-0 border border-card-border">
                        <Image src={p.image_url || '/placeholder.png'} alt={p.name} fill className="object-contain group-hover:scale-110 transition-transform duration-500" />
                      </div>
                      <div className="flex flex-col justify-center">
                        <h4 className="font-bold text-foreground line-clamp-2 group-hover:text-brand-accent transition-colors">{p.name}</h4>
                        <span className="text-sm text-brand-accent font-medium mt-1">Ver Detalles <ChevronRight size={14} className="inline" /></span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </main>
  );
}

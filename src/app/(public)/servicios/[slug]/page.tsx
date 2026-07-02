import { Service } from '@/Models/Service';
import { notFound } from 'next/navigation';
import ProductGallery from '@/components/ui/ProductGallery';
import Link from 'next/link';
import { ChevronRight, Wrench, CheckCircle2 } from 'lucide-react';
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const service = await Service.findBySlug(params.slug);
  if (!service) return { title: 'Servicio no encontrado' };
  
  return {
    title: `${service.name} | EcoTechne`,
    description: service.description?.substring(0, 160) || `Contratar ${service.name} en EcoTechne.`,
  };
}

export default async function ServiceDetailsPage({ params }: { params: { slug: string } }) {
  const service = await Service.findBySlug(params.slug);
  
  if (!service || !service.active) {
    notFound();
  }

  // Combine main image and additional images for the gallery
  const allImages = [];
  if (service.image_url) allImages.push(service.image_url);
  if (service.images) {
    service.images.forEach((img: any) => {
      if (img.image_url !== service.image_url) {
        allImages.push(img.image_url);
      }
    });
  }

  // Get similar services (active ones)
  const allServices = await Service.findAllActives();
  const similarServices = allServices.filter(s => s.service_id !== service.service_id).slice(0, 4);

  // Custom WhatsApp message
  const whatsappNumber = "584121234567"; // Default placeholder
  const message = `Hola! Estoy interesado en el servicio: ${service.name}. Me podrían dar más información?`;
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

  return (
    <main className="min-h-screen bg-background pt-24 pb-16">
      <div className="container mx-auto px-4 md:px-6">
        
        {/* Breadcrumbs */}
        <nav className="flex text-sm text-foreground/60 mb-8 overflow-x-auto whitespace-nowrap pb-2">
          <Link href="/" className="hover:text-brand-accent transition-colors">Inicio</Link>
          <ChevronRight size={16} className="mx-2 flex-shrink-0" />
          <span className="text-foreground font-medium truncate">Servicios</span>
          <ChevronRight size={16} className="mx-2 flex-shrink-0" />
          <span className="text-foreground font-bold truncate">{service.name.toUpperCase()}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Left Column: Gallery & Details */}
          <div className="lg:col-span-8 space-y-10">
            
            {/* Header (Mobile) */}
            <div className="block lg:hidden space-y-2 mb-6">
              <h3 className="text-brand-accent font-bold tracking-widest text-sm uppercase">Servicio Especializado</h3>
              <h1 className="text-3xl font-black text-foreground">{service.name}</h1>
            </div>

            <ProductGallery images={allImages} />

            {/* Detailed Description */}
            {service.description && (
              <div className="glass-card rounded-2xl p-6 md:p-8 border border-card-border mt-8">
                <h3 className="text-2xl font-bold text-foreground mb-6 border-b border-card-border pb-4 flex items-center gap-3">
                  <Wrench className="text-brand-accent" />
                  Detalles del Servicio
                </h3>
                <div className="prose prose-invert max-w-none text-foreground/80 leading-relaxed whitespace-pre-line text-lg">
                  {service.description}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Sticky Action Card & Similar Services */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* Action Card */}
            <div className="glass-card rounded-3xl p-6 md:p-8 border border-card-border sticky top-28 shadow-2xl">
              {/* Header (Desktop) */}
              <div className="hidden lg:block space-y-2 mb-6">
                <h3 className="text-brand-accent font-bold tracking-widest text-sm uppercase">Servicio Especializado</h3>
                <h1 className="text-3xl md:text-4xl font-black text-foreground leading-tight">{service.name}</h1>
              </div>

              {/* Status */}
              <div className="flex items-center gap-3 mb-8">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-sm font-semibold border border-green-500/20">
                  <CheckCircle2 size={16} /> Agenda Abierta
                </span>
              </div>

              {/* Action Button */}
              <a 
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-3 bg-brand-accent text-brand-dark py-4 rounded-xl font-bold text-lg hover:scale-105 transition-transform shadow-[0_0_20px_rgba(255,109,36,0.3)] mb-4"
              >
                <i className="fa-brands fa-whatsapp text-2xl"></i>
                Agendar Cita / Cotizar
              </a>
              <p className="text-center text-xs text-foreground/50">
                Serás redirigido a WhatsApp para hablar con un especialista.
              </p>
            </div>

            {/* Similar Services */}
            {similarServices.length > 0 && (
              <div>
                <h3 className="text-xl font-bold text-foreground mb-4 relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-16 after:h-1 after:bg-brand-accent">
                  Otros Servicios
                </h3>
                <div className="space-y-4">
                  {similarServices.map((s) => (
                    <Link key={s.service_id} href={`/servicios/${s.slug}`} className="flex gap-4 group bg-background/30 p-3 rounded-xl hover:bg-foreground/5 transition-colors border border-transparent hover:border-card-border">
                      <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-white flex-shrink-0 border border-card-border">
                        {s.image_url ? (
                          <img src={s.image_url} alt={s.name} className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-foreground/20">
                            <Wrench size={32} />
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col justify-center">
                        <h4 className="font-bold text-foreground line-clamp-2 group-hover:text-brand-accent transition-colors">{s.name}</h4>
                        <span className="text-sm text-brand-accent font-medium mt-1">Saber Más <ChevronRight size={14} className="inline" /></span>
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

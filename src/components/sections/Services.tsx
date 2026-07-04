import { Service } from "@/Models/Service";
import ServicesClient from "./ServicesClient";
import { Setting } from "@/Models/Setting";

/**
 * Sección de Servicios (Server Component)
 * Obtiene los datos directamente de Google Sheets sin cargar el bundle del cliente.
 */
export default async function Services() {
  const services = await Service.findAllActives();
  
  if (services.length === 0) {
    return null;
  }

  const displayServices = services;

  return (
    <section id="servicios" className="py-24 bg-foreground/5 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-brand-accent font-bold uppercase text-sm tracking-widest mb-4">Capacidades Técnicas</h2>
          <h3 className="text-4xl md:text-5xl font-black text-foreground mb-6">Nuestros Servicios</h3>
          <div className="h-1 w-20 bg-brand-accent mx-auto rounded-full"></div>
        </div>

        <ServicesClient services={displayServices} settings={await Setting.getMultiple([
          { key: 'company.name', defaultValue: 'Ecotechne' },
          { key: 'company.phone', defaultValue: '584265549941' }
        ])} />
      </div>
    </section>
  );
}

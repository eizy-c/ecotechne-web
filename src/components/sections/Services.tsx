import { Service } from "@/Models/Service";

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayServices.map((service, index) => (
            <div key={index} className="glass-card p-8 rounded-3xl group hover:-translate-y-2 transition-all duration-500">
              <div className="w-14 h-14 bg-brand-accent/10 rounded-2xl flex items-center justify-center text-brand-accent mb-6 group-hover:bg-brand-accent group-hover:text-brand-dark transition-all">
                <i className={`fa-solid fa-${service.icon} text-2xl`}></i>
              </div>
              <h4 className="text-xl font-bold mb-4 text-foreground">{service.name}</h4>
              <p className="text-sm text-foreground/60">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

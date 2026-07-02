'use client';

import { logServiceLead } from '@/actions/analytics';

export default function ServicesClient({ services }: { services: any[] }) {
  const handleWhatsAppClick = async (service: any) => {
    // Registrar el lead
    try {
      let country = typeof window !== 'undefined' ? sessionStorage.getItem('user_country') : null;
      if (!country) {
        try {
          const response = await fetch('http://ip-api.com/json/');
          const data = await response.json();
          if (data.status === 'success') {
            country = data.country;
            sessionStorage.setItem('user_country', country!);
          } else {
            country = 'Local/Desconocido';
          }
        } catch (e) {
          country = 'Desconocido';
        }
      }
      
      await logServiceLead(service.service_id, country || 'Desconocido');
    } catch (e) {
      console.error(e);
    }
    
    // Redirigir a WhatsApp
    const phoneNumber = '584265549941'; 
    const message = `Hola Ecotechne, me gustaría agendar o recibir más información sobre el servicio: ${service.name}.`;
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {services.map((service, index) => (
        <div key={index} className="glass-card p-8 rounded-3xl group hover:-translate-y-2 transition-all duration-500 flex flex-col h-full">
          <div className="w-14 h-14 bg-brand-accent/10 rounded-2xl flex items-center justify-center text-brand-accent mb-6 group-hover:bg-brand-accent group-hover:text-brand-dark transition-all">
            <i className={`fa-solid fa-${service.icon} text-2xl`}></i>
          </div>
          <h4 className="text-xl font-bold mb-4 text-foreground">{service.name}</h4>
          <p className="text-sm text-foreground/60 mb-6 flex-1">{service.description}</p>
          
          <div className="mt-auto">

            <button 
              onClick={() => handleWhatsAppClick(service)}
              className="w-full py-3 border border-brand-accent text-brand-accent font-bold rounded-xl hover:bg-brand-accent hover:text-brand-dark transition-colors flex items-center justify-center gap-2"
            >
              <i className="fa-brands fa-whatsapp text-lg"></i> Solicitar
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

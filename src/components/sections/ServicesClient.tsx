'use client';

import { logServiceLead } from '@/actions/analytics';
import Link from 'next/link';
import Image from 'next/image';

export default function ServicesClient({ services }: { services: any[] }) {
  const handleWhatsAppClick = async (service: any) => {
    // Registrar el lead
    try {
      let country = typeof window !== 'undefined' ? sessionStorage.getItem('user_country') : null;
      if (!country) {
        try {
          const response = await fetch('https://ipapi.co/json/');
          const data = await response.json();
          if (data.country_name) {
            country = data.country_name;
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
          <h4 className="text-xl font-bold mb-4 text-foreground">{service.name}</h4>
          <p className="text-sm text-foreground/60 mb-6 flex-1">{service.description}</p>
          
          <div className="mt-auto flex gap-2">
            <Link 
              href={`/servicios/${service.slug}`}
              className="flex-1 py-3 bg-brand-accent text-brand-dark font-bold rounded-xl hover:scale-105 transition-transform flex items-center justify-center shadow-lg"
            >
              Detalles
            </Link>
            <button 
              onClick={() => handleWhatsAppClick(service)}
              className="flex-[0.5] py-3 border border-brand-accent text-brand-accent font-bold rounded-xl hover:bg-brand-accent hover:text-brand-dark transition-colors flex items-center justify-center"
              title="Consultar por WhatsApp"
            >
              <i className="fa-brands fa-whatsapp text-xl"></i>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

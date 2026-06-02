'use client';

/**
 * Sección de Contacto (Client Component)
 * Utiliza un diseño de formulario moderno y limpio.
 */
export default function Contact() {
  async function handleSubmit(formData: FormData) {
    // Aquí podrías procesar los datos con un Server Action
    const data = {
      name: formData.get('name'),
      phone: formData.get('phone'),
      message: formData.get('message'),
    };
    
    console.log('Datos de contacto:', data);
    alert('Gracias por tu interés. En Next.js 15, esto se procesaría mediante un Server Action para máxima seguridad y eficiencia.');
  }

  return (
    <section id="contacto" className="py-24 bg-brand-black/40 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-card rounded-3xl p-8 lg:p-12 border border-white/10 shadow-2xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 relative z-10">
            <div>
              <h2 className="text-3xl md:text-5xl font-bold mb-6 text-brand-light italic">
                Inicia tu <span className="text-brand-accent">Proyecto</span>
              </h2>
              <p className="text-brand-light/60 mb-10 text-lg">
                ¿Tienes una idea en mente o necesitas equipar tu vehículo? Cuéntanos tus requerimientos y nuestro equipo de ingeniería te brindará la mejor solución.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full border border-brand-accent/30 flex items-center justify-center text-brand-accent">
                    <i className="fa-solid fa-envelope"></i>
                  </div>
                  <a href="mailto:admiecotechne@gmail.com" className="text-brand-light font-bold hover:text-brand-accent">admiecotechne@gmail.com</a>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full border border-brand-accent/30 flex items-center justify-center text-brand-accent">
                    <i className="fa-solid fa-phone"></i>
                  </div>
                  <span className="text-brand-light font-bold">+58 426-5549941</span>
                </div>
              </div>
            </div>

            <div className="bg-brand-black/40 p-8 rounded-2xl border border-white/5">
              <form action={handleSubmit} className="space-y-4">
                <input 
                  type="text" 
                  name="name"
                  placeholder="Nombre completo" 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-brand-light focus:outline-none focus:border-brand-accent transition-colors" 
                  required 
                />
                <input 
                  type="tel" 
                  name="phone"
                  placeholder="Teléfono de contacto" 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-brand-light focus:outline-none focus:border-brand-accent transition-colors" 
                  required 
                />
                <textarea 
                  name="message"
                  placeholder="Cuéntanos sobre tu necesidad..." 
                  rows={4} 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-brand-light focus:outline-none focus:border-brand-accent resize-none transition-colors" 
                  required 
                ></textarea>
                <button 
                  type="submit" 
                  className="w-full bg-brand-accent text-brand-dark font-black py-5 rounded-2xl hover:scale-[1.02] transition-transform shadow-2xl active:scale-95"
                >
                  ENVIAR SOLICITUD
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

import { ShieldCheck, Cookie, Settings } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Política de Cookies | Ecotechne',
  description: 'Política de uso de cookies y privacidad para la plataforma Ecotechne.',
};

export default function CookiesPolicyPage() {
  return (
    <main className="min-h-screen pt-24 pb-16 bg-background relative overflow-hidden">
      {/* Background Decorators */}
      <div className="absolute top-0 left-0 w-full h-96 bg-brand-accent/5 rounded-b-[100px] blur-3xl -z-10"></div>
      
      <div className="container mx-auto px-4 md:px-8 max-w-4xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-4 bg-brand-accent/10 text-brand-accent rounded-full mb-6">
            <Cookie size={40} />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-foreground mb-4">Política de Cookies</h1>
          <p className="text-lg text-foreground/60 max-w-2xl mx-auto">
            En Ecotechne valoramos tu privacidad. Conoce cómo y por qué utilizamos cookies para brindarte la mejor experiencia en nuestra plataforma.
          </p>
        </div>

        <div className="space-y-8">
          <section className="glass-card p-8 rounded-3xl">
            <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-3">
              <ShieldCheck className="text-brand-accent" size={28} />
              1. ¿Qué son las cookies?
            </h2>
            <div className="text-foreground/70 space-y-4 leading-relaxed">
              <p>
                Las cookies son pequeños archivos de texto que los sitios web que visitas colocan en tu ordenador, teléfono inteligente u otro dispositivo. Se utilizan ampliamente para hacer que los sitios web funcionen, o funcionen de manera más eficiente, así como para proporcionar información a los propietarios del sitio.
              </p>
            </div>
          </section>

          <section className="glass-card p-8 rounded-3xl">
            <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-3">
              <Settings className="text-brand-accent" size={28} />
              2. ¿Cómo utilizamos las cookies?
            </h2>
            <div className="text-foreground/70 space-y-4 leading-relaxed">
              <p>
                En Ecotechne utilizamos cookies exclusivamente con el objetivo de mejorar tu experiencia, garantizar el correcto funcionamiento de nuestras herramientas (como la sesión del usuario) y analizar estadísticamente las visitas a nuestro catálogo.
              </p>
              <h3 className="text-lg font-semibold text-foreground mt-6 mb-2">Tipos de cookies que usamos:</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong className="text-foreground">Cookies Técnicas o Necesarias:</strong> Son esenciales para que puedas navegar por nuestra web y utilizar sus funciones. Sin estas cookies, no podríamos mantener tu sesión iniciada si fueras un administrador.
                </li>
                <li>
                  <strong className="text-foreground">Cookies de Rendimiento o Analíticas:</strong> Nos permiten registrar métricas anónimas como el país desde donde nos visitas (leyendo tu dirección IP) para entender desde dónde nos buscan nuestros clientes. Esta información solo se registra si nos das tu consentimiento explícito.
                </li>
              </ul>
            </div>
          </section>

          <section className="glass-card p-8 rounded-3xl">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              3. Gestión de tu Consentimiento
            </h2>
            <div className="text-foreground/70 space-y-4 leading-relaxed">
              <p>
                Al ingresar por primera vez a nuestro sitio, se te presenta un aviso flotante (banner) donde puedes <strong>Aceptar</strong> el uso de estas cookies o elegir <strong>Más tarde</strong> para posponer la decisión. 
              </p>
              <p>
                Si no aceptas las cookies, respetaremos tu privacidad de inmediato interrumpiendo el registro de visitas y procedencias (como tu país), lo cual limitará nuestra capacidad analítica pero garantizará tu navegación privada.
              </p>
              <p>
                Puedes retirar tu consentimiento o borrar estas cookies en cualquier momento utilizando las opciones de configuración de privacidad de tu propio navegador web (Chrome, Safari, Firefox, Edge, etc). Al borrar el almacenamiento local de tu navegador para este sitio, el aviso de cookies volverá a mostrarse.
              </p>
            </div>
          </section>

          <div className="text-center pt-8">
            <Link 
              href="/"
              className="inline-flex items-center gap-2 bg-foreground/5 hover:bg-foreground/10 text-foreground px-6 py-3 rounded-xl font-medium transition-colors"
            >
              Volver al Inicio
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

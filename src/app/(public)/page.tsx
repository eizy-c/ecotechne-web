import Hero from "@/components/sections/Hero";
import Store from "@/components/sections/Store";
import Services from "@/components/sections/Services";
import About from "@/components/sections/About";
import Contact from "@/components/sections/Contact";
import { Service } from "@/Models/Service";
import { Setting } from "@/Models/Setting";

export default async function Home() {
  // Ejemplo de consulta a la base de datos con Prisma MVC (Server Component)
  let dbServices = [];
  try {
    dbServices = await Service.findAllActives();
    console.log("Servicios desde Prisma:", dbServices);
  } catch (error) {
    console.error("Error cargando servicios desde Prisma:", error);
  }

  const defaultKeys = [
    { key: 'company.name', defaultValue: 'Ecotechne' },
    { key: 'company.email', defaultValue: 'admiecotechne@gmail.com' },
    { key: 'company.phone', defaultValue: '584265549941' },
    { key: 'company.logo', defaultValue: '/logo-long.png' },
    { key: 'hero.badge', defaultValue: 'Ingeniería de Alto Desempeño' },
    { key: 'hero.title.line1', defaultValue: 'Precisión' },
    { key: 'hero.title.highlight1', defaultValue: 'Ingeniería' },
    { key: 'hero.title.line2', defaultValue: 'Innovación' },
    { key: 'hero.title.highlight2', defaultValue: '4x4' },
    { key: 'hero.subtitle', defaultValue: 'Fabricación premium de accesorios off-road donde la ingeniería de vanguardia se une a la máxima resistencia extrema.' },
    { key: 'hero.button_text', defaultValue: 'Cotizar Proyecto' },
    { key: 'hero.background_enabled', defaultValue: 'true' },
    { key: 'hero.background_image', defaultValue: 'https://images.unsplash.com/photo-1544256651-69fd13e8436b?q=80&w=2070&auto=format&fit=crop' },
    { key: 'about.badge', defaultValue: 'Sobre Nosotros' },
    { key: 'about.title.line1', defaultValue: 'Especialistas en la' },
    { key: 'about.title.highlight1', defaultValue: 'Aventura y el Trabajo' },
    { key: 'about.description', defaultValue: 'Somos *Ecotechne*, una empresa especializada en el diseño, fabricación y comercialización de accesorios premium para vehículos 4x4, pickup y off-road. Desarrollamos soluciones robustas, funcionales y de alta calidad combinando ingeniería de precisión con el diseño más resistente.' },
  ];

  const settings = await Setting.getMultiple(defaultKeys);

  return (
    <main className="flex min-h-screen flex-col">
      <Hero settings={settings} />
      <About settings={settings} />
      <Store />
      <Services />
      <Contact />
    </main>
  );
}





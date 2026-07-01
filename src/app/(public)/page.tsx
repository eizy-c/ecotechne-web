import Hero from "@/components/sections/Hero";
import Store from "@/components/sections/Store";
import Services from "@/components/sections/Services";
import About from "@/components/sections/About";
import Galeria from "@/components/sections/Galeria";
import Contact from "@/components/sections/Contact";
import { Service } from "@/Models/Service";

export default async function Home() {
  // Ejemplo de consulta a la base de datos con Prisma MVC (Server Component)
  let dbServices = [];
  try {
    dbServices = await Service.findAllActives();
    console.log("Servicios desde Prisma:", dbServices);
  } catch (error) {
    console.error("Error cargando servicios desde Prisma:", error);
  }

  return (
    <main className="flex min-h-screen flex-col">
      <Hero />
      <About />
      <Store />
      <Services />
      <Galeria />
      <Contact />
    </main>
  );
}





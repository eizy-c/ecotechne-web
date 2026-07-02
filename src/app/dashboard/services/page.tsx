import { Service } from '@/Models/Service';
import ServicesList from './ServicesList';

export const metadata = {
  title: 'Servicios | Panel de Administración',
};

export default async function ServicesPage() {
  const services = await Service.findAll();

  return <ServicesList services={services} />;
}

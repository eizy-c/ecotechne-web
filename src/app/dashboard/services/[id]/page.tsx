import { Service } from '@/Models/Service';
import { notFound } from 'next/navigation';
import EditServiceForm from './EditServiceForm';

export default async function EditServicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const serviceId = Number(id);
  if (isNaN(serviceId)) notFound();

  const service = await Service.findById(serviceId);
  
  if (!service) {
    notFound();
  }

  return (
    <div className="max-w-full mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Editar Servicio</h1>
        <p className="text-foreground/60 mt-1">Modifica los detalles del servicio.</p>
      </div>
      <EditServiceForm service={service} />
    </div>
  );
}

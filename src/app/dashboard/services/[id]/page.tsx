import { updateService } from '@/actions/services';
import { Service } from '@/Models/Service';
import Link from 'next/link';
import { ArrowLeft, Save } from 'lucide-react';
import { notFound } from 'next/navigation';
import { notFound } from 'next/navigation';
import EditServiceForm from './EditServiceForm';

export default async function EditServicePage({ params }: { params: { id: string } }) {
  const serviceId = Number(params.id);
  if (isNaN(serviceId)) notFound();

  const service = await Service.findById(serviceId);
  
  if (!service) {
    notFound();
  }

      <EditServiceForm service={service} />
    </div>
  );
}

import { Service } from '@/Models/Service';
import Link from 'next/link';
import { Plus, Search, Edit, ShieldCheck, ShieldAlert } from 'lucide-react';
import { deleteService } from '@/actions/services';
import DeleteButton from '@/components/ui/DeleteButton';

export default async function ServicesPage() {
  const services = await Service.findAll();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Servicios</h2>
          <p className="text-foreground/50 mt-1">Gestiona los servicios que ofreces</p>
        </div>
        <Link 
          href="/dashboard/services/create"
          className="bg-brand-accent text-brand-dark px-6 py-2.5 rounded-xl font-bold hover:scale-105 transition-transform flex items-center gap-2 shadow-[0_0_15px_rgba(255,109,36,0.2)]"
        >
          <Plus size={20} />
          <span>Nuevo Servicio</span>
        </Link>
      </div>

      <div className="glass-card rounded-2xl border border-card-border overflow-hidden">
        <div className="p-4 border-b border-card-border flex justify-between items-center bg-card/50">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" size={18} />
            <input 
              type="text" 
              placeholder="Buscar servicio..." 
              className="w-full bg-background/50 border border-card-border rounded-lg pl-10 pr-4 py-2 text-sm text-foreground focus:outline-none focus:border-brand-accent transition-colors"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-foreground/5 text-foreground/70 uppercase font-semibold text-xs tracking-wider">
              <tr>
                <th className="px-6 py-4">Servicio</th>
                <th className="px-6 py-4">Descripción</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-card-border">
              {services.map((service) => (
                <tr key={service.service_id} className="hover:bg-foreground/5 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-foreground group-hover:text-brand-accent transition-colors">
                      {service.name}
                    </div>
                    <div className="text-xs text-foreground/50 font-mono text-ellipsis overflow-hidden w-32 whitespace-nowrap" title={service.slug}>
                      {service.slug}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-foreground/70 max-w-sm truncate">
                    {service.description || '-'}
                  </td>
                  <td className="px-6 py-4">
                    {service.active ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-500/10 text-green-500">
                        <ShieldCheck size={14} /> Activo
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-500/10 text-red-500">
                        <ShieldAlert size={14} /> Inactivo
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link 
                        href={`/dashboard/services/${service.service_id}`}
                        className="p-2 text-foreground/50 hover:text-brand-accent hover:bg-brand-accent/10 rounded-lg transition-colors"
                      >
                        <Edit size={18} />
                      </Link>
                      <DeleteButton 
                        onDelete={async () => {
                          'use server';
                          await deleteService(service.service_id);
                        }}
                        itemName={`Servicio: ${service.name}`}
                      />
                    </div>
                  </td>
                </tr>
              ))}
              
              {services.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-foreground/50">
                    No hay servicios registrados en el sistema.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

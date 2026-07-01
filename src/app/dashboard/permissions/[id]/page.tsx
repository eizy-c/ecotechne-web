import { updatePermission } from '@/actions/permissions';
import { Permission } from '@/Models/Permission';
import Link from 'next/link';
import { ArrowLeft, Save } from 'lucide-react';
import { notFound } from 'next/navigation';

export default async function EditPermissionPage({ params }: { params: { id: string } }) {
  const permissionId = Number(params.id);
  if (isNaN(permissionId)) notFound();

  const permission = await Permission.findById(permissionId);
  
  if (!permission) {
    notFound();
  }

  // Bind the id to the server action
  const updatePermissionWithId = updatePermission.bind(null, permission.permission_id);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link 
          href="/dashboard/permissions"
          className="p-2 bg-foreground/5 hover:bg-foreground/10 text-foreground rounded-xl transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h2 className="text-3xl font-bold text-foreground">Editar Permiso</h2>
          <p className="text-foreground/50 mt-1">Actualizar la información de este permiso</p>
        </div>
      </div>

      <form action={updatePermissionWithId} className="glass-card rounded-2xl border border-card-border p-6 space-y-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-foreground mb-2">Clave del Permiso *</label>
            <input 
              type="text" 
              id="name"
              name="name"
              required
              defaultValue={permission.name}
              placeholder="Ej: create_users, delete_products..."
              className="w-full bg-background/50 border border-card-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-brand-accent transition-colors"
            />
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-semibold text-foreground mb-2">Descripción</label>
            <textarea 
              id="description"
              name="description"
              rows={3}
              defaultValue={permission.description || ''}
              placeholder="¿Qué permite hacer este permiso?"
              className="w-full bg-background/50 border border-card-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-brand-accent transition-colors resize-none"
            ></textarea>
          </div>
        </div>

        <div className="pt-4 border-t border-card-border flex justify-end gap-3">
          <Link 
            href="/dashboard/permissions"
            className="px-6 py-3 rounded-xl font-semibold text-foreground hover:bg-foreground/5 transition-colors"
          >
            Cancelar
          </Link>
          <button 
            type="submit"
            className="bg-brand-accent text-brand-dark px-8 py-3 rounded-xl font-bold hover:scale-105 transition-transform flex items-center gap-2 shadow-[0_0_15px_rgba(255,109,36,0.2)]"
          >
            <Save size={20} />
            <span>Actualizar Permiso</span>
          </button>
        </div>
      </form>
    </div>
  );
}

import { Permission } from '@/Models/Permission';
import Link from 'next/link';
import { Plus, Search, Edit, KeyRound, Sparkles } from 'lucide-react';
import { deletePermission } from '@/actions/permissions';
import { seedPermissions } from '@/actions/seedPermissions';
import DeleteButton from '@/components/ui/DeleteButton';

export default async function PermissionsPage() {
  const permissions = await Permission.findAll();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Permisos</h2>
          <p className="text-foreground/50 mt-1">Gestiona las capacidades del sistema</p>
        </div>
        <div className="flex gap-3">
          <form action={seedPermissions}>
            <button 
              type="submit"
              className="bg-background border border-card-border text-foreground px-4 py-2.5 rounded-xl font-bold hover:bg-foreground/5 transition-colors flex items-center gap-2"
              title="Autogenerar permisos básicos para todos los módulos CRUD"
            >
              <Sparkles size={18} className="text-brand-accent" />
              <span className="hidden sm:inline">Generar Básicos</span>
            </button>
          </form>
          <Link 
            href="/dashboard/permissions/create"
            className="bg-brand-accent text-brand-dark px-6 py-2.5 rounded-xl font-bold hover:scale-105 transition-transform flex items-center gap-2 shadow-[0_0_15px_rgba(255,109,36,0.2)]"
          >
            <Plus size={20} />
            <span>Añadir</span>
          </Link>
        </div>
      </div>

      <div className="glass-card rounded-2xl border border-card-border overflow-hidden">
        <div className="p-4 border-b border-card-border flex justify-between items-center bg-card/50">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" size={18} />
            <input 
              type="text" 
              placeholder="Buscar permiso..." 
              className="w-full bg-background/50 border border-card-border rounded-lg pl-10 pr-4 py-2 text-sm text-foreground focus:outline-none focus:border-brand-accent transition-colors"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-foreground/5 text-foreground/70 uppercase font-semibold text-xs tracking-wider">
              <tr>
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Clave del Permiso</th>
                <th className="px-6 py-4">Descripción</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-card-border">
              {permissions.map((permission) => (
                <tr key={permission.permission_id} className="hover:bg-foreground/5 transition-colors group">
                  <td className="px-6 py-4 text-foreground/60">#{permission.permission_id}</td>
                  <td className="px-6 py-4 font-semibold text-foreground flex items-center gap-2">
                    <KeyRound size={14} className="text-brand-accent" />
                    {permission.name}
                  </td>
                  <td className="px-6 py-4 text-foreground/70">{permission.description || '-'}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link 
                        href={`/dashboard/permissions/${permission.permission_id}`}
                        className="p-2 text-foreground/50 hover:text-brand-accent hover:bg-brand-accent/10 rounded-lg transition-colors"
                      >
                        <Edit size={18} />
                      </Link>
                      <DeleteButton 
                        onDelete={async () => {
                          'use server';
                          await deletePermission(permission.permission_id);
                        }}
                        itemName={`Permiso: ${permission.name}`}
                      />
                    </div>
                  </td>
                </tr>
              ))}
              
              {permissions.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-foreground/50">
                    No hay permisos registrados en el sistema.
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

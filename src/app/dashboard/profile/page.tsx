import { updateProfile } from '@/actions/users';
import { User } from '@/Models/User';
import { cookies } from 'next/headers';
import * as jose from 'jose';
import { notFound } from 'next/navigation';
import { Save, User as UserIcon, Shield } from 'lucide-react';

export default async function ProfilePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;
  
  if (!token) notFound();

  const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'super-secret-default-key-change-it-in-env');
  const { payload } = await jose.jwtVerify(token, secret);
  
  const userId = Number(payload.id);
  const user = await User.findById(userId);

  if (!user) notFound();

  // Bind the ID for the server action
  const updateProfileWithId = updateProfile.bind(null, userId);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Mi Perfil</h2>
        <p className="text-foreground/50 mt-1">Gestiona tu información personal y credenciales</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Tarjeta de Resumen */}
        <div className="col-span-1 glass-card border border-card-border rounded-2xl p-6 text-center space-y-4 h-fit">
          <div className="w-24 h-24 mx-auto rounded-full bg-brand-accent/20 border-2 border-brand-accent flex items-center justify-center text-brand-accent font-bold text-4xl shadow-[0_0_20px_rgba(255,109,36,0.3)]">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="font-bold text-foreground text-lg">{user.name}</h3>
            <p className="text-foreground/50 text-sm">{user.email}</p>
          </div>
          <div className="inline-flex items-center gap-2 bg-foreground/10 px-4 py-1.5 rounded-full text-sm font-semibold text-foreground/80">
            <Shield size={16} className="text-brand-accent" />
            <span>{payload.role as string}</span>
          </div>
        </div>

        {/* Formulario de Edición */}
        <div className="col-span-1 md:col-span-2 glass-card border border-card-border rounded-2xl p-6">
          <form action={updateProfileWithId} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-foreground mb-2">Nombre Completo *</label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" size={18} />
                  <input 
                    type="text" 
                    id="name"
                    name="name"
                    required
                    defaultValue={user.name}
                    className="w-full bg-background/50 border border-card-border rounded-xl pl-10 pr-4 py-3 text-foreground focus:outline-none focus:border-brand-accent transition-colors"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-foreground mb-2">Correo Electrónico *</label>
                <input 
                  type="email" 
                  id="email"
                  name="email"
                  required
                  defaultValue={user.email}
                  className="w-full bg-background/50 border border-card-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-brand-accent transition-colors"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-foreground mb-2">Nueva Contraseña</label>
                <input 
                  type="password" 
                  id="password"
                  name="password"
                  placeholder="Dejar en blanco para mantener la actual"
                  className="w-full bg-background/50 border border-card-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-brand-accent transition-colors"
                />
                <p className="text-xs text-foreground/40 mt-2">Si cambias tu contraseña, tendrás que volver a iniciar sesión.</p>
              </div>
            </div>

            <div className="pt-4 border-t border-card-border flex justify-end">
              <button 
                type="submit"
                className="bg-brand-accent text-brand-dark px-8 py-3 rounded-xl font-bold hover:scale-105 transition-transform flex items-center gap-2 shadow-[0_0_15px_rgba(255,109,36,0.2)] w-full sm:w-auto justify-center"
              >
                <Save size={20} />
                <span>Guardar Cambios</span>
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}

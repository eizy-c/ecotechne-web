'use client';

import { loginAction } from '@/Controllers/AuthController';
import { useActionState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useFormStatus } from 'react-dom';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-brand-dark bg-brand-accent hover:bg-brand-accent/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-accent disabled:opacity-50 transition-all btn-glow uppercase tracking-wider"
    >
      {pending ? 'Verificando...' : 'Iniciar Sesión'}
    </button>
  );
}

export default function LoginPage() {
  const [state, formAction] = useActionState(loginAction, null);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Si quedan restos de parámetros en la URL por el error anterior,
    // limpiamos la URL automáticamente para evitar problemas.
    if (searchParams.toString().length > 0) {
      router.replace('/login');
    }
  }, [searchParams, router]);

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 relative">
      <Link 
        href="/" 
        className="absolute top-8 left-8 flex items-center gap-2 text-foreground/60 hover:text-brand-accent transition-colors"
      >
        <ArrowLeft size={20} />
        <span className="font-medium">Volver al inicio</span>
      </Link>

      <div className="max-w-md w-full space-y-8 glass-card p-10 rounded-3xl relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-brand-accent/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative">
          <h2 className="mt-2 text-center text-3xl font-black text-foreground uppercase tracking-tight">
            Acceso <span className="text-brand-accent">Seguro</span>
          </h2>
          <p className="mt-3 text-center text-sm text-foreground/60">
            Ingresa tus credenciales para administrar Ecotechne
          </p>
        </div>
        
        {state?.error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm text-center">
            {state.error}
          </div>
        )}

        <form className="mt-8 space-y-6 relative" action={formAction}>
          <div className="rounded-xl shadow-sm -space-y-px overflow-hidden border border-card-border focus-within:border-brand-accent/50 transition-colors">
            <div>
              <label htmlFor="email-address" className="sr-only">Correo Electrónico</label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none relative block w-full px-4 py-3 bg-foreground/5 placeholder:text-foreground/40 text-foreground focus:outline-none focus:bg-foreground/10 sm:text-sm transition-colors border-b border-card-border"
                placeholder="Correo Electrónico"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Contraseña</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none relative block w-full px-4 py-3 bg-foreground/5 placeholder:text-foreground/40 text-foreground focus:outline-none focus:bg-foreground/10 sm:text-sm transition-colors"
                placeholder="Contraseña"
              />
            </div>
          </div>

          <div>
            <SubmitButton />
          </div>
        </form>
      </div>
    </div>
  );
}

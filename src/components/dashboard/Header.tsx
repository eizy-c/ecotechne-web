'use client';

import { Menu, LogOut, User, MessageSquare } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSessionStore } from '@/store/useSessionStore';

export default function Header() {
  const user = useSessionStore((state) => state.user);
  const unreadCount = useSessionStore((state) => state.unreadCount);
  const hasPermission = useSessionStore((state) => state.hasPermission);
  const router = useRouter();

  const handleLogout = async () => {
    // Aquí implementaremos la lógica real de logout después (limpiar cookie)
    // Por ahora redirigimos al login
    document.cookie = 'auth_token=; Max-Age=0; path=/;';
    router.push('/login');
    router.refresh();
  };

  return (
    <header className="h-16 border-b border-card-border bg-card/80 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-4 md:px-8">
      <div className="flex items-center">
        {/* Mobile menu button */}
        <button className="md:hidden p-2 mr-2 text-foreground/70 hover:text-foreground">
          <Menu size={24} />
        </button>
        <h1 className="text-lg font-semibold text-foreground md:hidden">Dashboard</h1>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center gap-3">
          {(hasPermission('manage:all') || hasPermission('read:messages')) && (
            <Link 
              href="/dashboard/messages" 
              className="relative p-2 text-foreground/70 hover:text-brand-accent hover:bg-brand-accent/10 rounded-full transition-colors"
              title="Mensajes"
            >
              <MessageSquare size={20} />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border border-card shadow-[0_0_10px_rgba(239,68,68,0.5)] animate-pulse">
                  {unreadCount > 99 ? '+99' : unreadCount}
                </span>
              )}
            </Link>
          )}

          <div className="w-px h-6 bg-card-border mx-1"></div>

          <Link href="/dashboard/profile" className="flex items-center gap-3 group hover:opacity-80 transition-opacity">
            <div className="hidden md:flex flex-col text-right">
              <span className="text-sm font-semibold text-foreground group-hover:text-brand-accent transition-colors">{user?.name || 'Administrador'}</span>
              <span className="text-xs text-foreground/50">{user?.email || 'admin@admin.com'}</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-brand-accent/20 border border-brand-accent flex items-center justify-center text-brand-accent font-bold text-lg shadow-[0_0_10px_rgba(255,109,36,0.2)]">
              {user?.name ? user.name.charAt(0).toUpperCase() : <User size={18} />}
            </div>
          </Link>
          <button 
            onClick={handleLogout}
            className="p-2 ml-1 text-red-500 hover:bg-red-500/10 rounded-full transition-colors"
            title="Cerrar sesión"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}

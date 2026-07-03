'use client';

import { useState, useRef, useEffect } from 'react';
import { Menu, LogOut, User, MessageSquare, Settings, Palette, ChevronDown, Shield } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useSessionStore } from '@/store/useSessionStore';
import { logoutAction } from '@/Controllers/AuthController';

export default function Header() {
  const user = useSessionStore((state) => state.user);
  const unreadCount = useSessionStore((state) => state.unreadCount);
  const hasPermission = useSessionStore((state) => state.hasPermission);
  const toggleSidebar = useSessionStore((state) => state.toggleSidebar);
  const router = useRouter();
  const pathname = usePathname();
  
  const getPageTitle = () => {
    if (pathname === '/dashboard') return 'Inicio';
    if (pathname.includes('/products')) return 'Productos';
    if (pathname.includes('/categories')) return 'Categorías';
    if (pathname.includes('/services')) return 'Servicios';
    if (pathname.includes('/brands')) return 'Marcas Automotrices';
    if (pathname.includes('/vehicle-models')) return 'Modelos de Vehículos';
    if (pathname.includes('/vehicles')) return 'Directorio Automotriz';
    if (pathname.includes('/galleries')) return 'Galería de Trabajos';
    if (pathname.includes('/users')) return 'Usuarios';
    if (pathname.includes('/roles')) return 'Roles y Permisos';
    if (pathname.includes('/logs')) return 'Auditoría';
    if (pathname.includes('/settings')) return 'Configuración del Sistema';
    if (pathname.includes('/appearance')) return 'Apariencia';
    if (pathname.includes('/profile')) return 'Mi Perfil';
    if (pathname.includes('/messages')) return 'Mensajes';
    return 'Panel de Control';
  };
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logoutAction();
      useSessionStore.getState().setUser(null);
      window.location.href = '/login';
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <header className="h-16 border-b border-card-border bg-card/80 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-4 md:px-8">
      <div className="flex items-center gap-4">
        {/* Mobile menu button */}
        <button 
          onClick={toggleSidebar}
          className="md:hidden p-2 text-foreground/70 hover:text-brand-accent transition-colors"
        >
          <Menu size={24} />
        </button>
        <div className="flex flex-col">
          <h1 className="text-xl font-bold text-foreground tracking-tight">{getPageTitle()}</h1>
          <span className="text-xs text-foreground/50 hidden md:block font-medium">
            Dashboard <span className="mx-1 text-brand-accent/50">•</span> {getPageTitle()}
          </span>
        </div>
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

          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-3 group hover:opacity-80 transition-opacity focus:outline-none"
            >
              <div className="hidden md:flex flex-col text-right">
                <span className="text-sm font-semibold text-foreground group-hover:text-brand-accent transition-colors">{user?.name || 'Administrador'}</span>
                <span className="text-xs text-foreground/50 uppercase tracking-wide font-medium">{user?.role || 'Admin'}</span>
              </div>
              <div className="w-10 h-10 rounded-full bg-brand-accent/20 border border-brand-accent flex items-center justify-center text-brand-accent font-bold text-lg shadow-[0_0_10px_rgba(255,109,36,0.2)]">
                {user?.role ? user.role.charAt(0).toUpperCase() : user?.name ? user.name.charAt(0).toUpperCase() : <User size={18} />}
              </div>
              <ChevronDown size={16} className="text-foreground/50 hidden md:block" />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-3 w-64 bg-[#1A0F0A] border border-white/5 rounded-2xl shadow-2xl overflow-hidden z-50 animate-fade-in-up">
                <div className="p-4 border-b border-white/5 bg-foreground/5">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-brand-accent/20 border border-brand-accent flex items-center justify-center text-brand-accent font-bold text-xl">
                      {user?.role ? user.role.charAt(0).toUpperCase() : user?.name ? user.name.charAt(0).toUpperCase() : <User size={24} />}
                    </div>
                    <div className="flex flex-col overflow-hidden">
                      <span className="text-sm font-bold text-foreground truncate">{user?.name || 'Administrador'}</span>
                      <span className="text-xs text-brand-accent uppercase tracking-wide font-medium truncate">{user?.role || 'Admin'}</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-2 space-y-1">
                  <Link 
                    href="/dashboard/profile" 
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-foreground/80 hover:bg-foreground/5 hover:text-foreground transition-colors"
                  >
                    <User size={18} className="text-foreground/50" />
                    Mi Perfil
                  </Link>

                  {(hasPermission('manage:all') || hasPermission('manage:settings')) && (
                    <>
                      <Link 
                        href="/dashboard/appearance" 
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-foreground/80 hover:bg-foreground/5 hover:text-foreground transition-colors"
                      >
                        <Palette size={18} className="text-foreground/50" />
                        Apariencia
                      </Link>
                      <Link 
                        href="/dashboard/settings" 
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-foreground/80 hover:bg-foreground/5 hover:text-foreground transition-colors"
                      >
                        <Settings size={18} className="text-foreground/50" />
                        Configuración del Sistema
                      </Link>
                    </>
                  )}
                </div>

                <div className="p-2 border-t border-white/5 bg-black/20">
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-red-500 hover:bg-red-500/10 transition-colors"
                  >
                    <LogOut size={18} />
                    Cerrar sesión
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

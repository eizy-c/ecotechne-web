'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSessionStore } from '@/store/useSessionStore';
import { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  ShieldCheck, 
  Package, 
  Wrench, 
  Image as ImageIcon,
  Car,
  Box,
  Tag,
  BarChart3,
  Shield,
  Palette,
  ClipboardList,
  Settings,
  ChevronDown,
  ChevronRight,
  Layers
} from 'lucide-react';
const menuItems = [
  { name: 'Inicio', path: '/dashboard', icon: LayoutDashboard, permission: 'read:dashboard' },
  { name: 'Analíticas', path: '/dashboard/analytics', icon: BarChart3, permission: 'read:dashboard' },
  { 
    name: 'Gestión Comercial', 
    icon: Package, 
    permission: 'read:products',
    subItems: [
      { name: 'Productos', path: '/dashboard/products', icon: Package, permission: 'read:products' },
      { name: 'Categorías', path: '/dashboard/categories', icon: Tag, permission: 'read:categories' },
      { name: 'Servicios', path: '/dashboard/services', icon: Wrench, permission: 'read:services' },
    ]
  },
  { 
    name: 'Directorio Automotriz', 
    icon: Car, 
    permission: 'read:vehicles',
    subItems: [
      { name: 'Marcas', path: '/dashboard/brands', icon: Box, permission: 'read:brands' },
      { name: 'Modelos', path: '/dashboard/vehicle-models', icon: Layers, permission: 'read:models' },
      { name: 'Directorio', path: '/dashboard/vehicles', icon: Car, permission: 'read:vehicles' },
    ]
  },
  { name: 'Galería', path: '/dashboard/galleries', icon: ImageIcon, permission: 'read:gallery' },
  { 
    name: 'Administración', 
    icon: Shield, 
    permission: 'read:users',
    subItems: [
      { name: 'Usuarios', path: '/dashboard/users', icon: Users, permission: 'read:users' },
      { name: 'Roles', path: '/dashboard/roles', icon: Shield, permission: 'read:roles' },
      { name: 'Auditoría', path: '/dashboard/logs', icon: ClipboardList, permission: 'read:logs' }
    ]
  }
];

export function Sidebar({ companyName = 'Ecotechne', companyLogo = '/logo-long.png' }: { companyName?: string, companyLogo?: string }) {
  const pathname = usePathname();
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['Directorio Automotriz']);
  const hasPermission = useSessionStore((state) => state.hasPermission);
  const user = useSessionStore((state) => state.user); // Suscribirse a los cambios de usuario
  const unreadCount = useSessionStore((state) => state.unreadCount);
  const isSidebarOpen = useSessionStore((state) => state.isSidebarOpen);
  const setSidebarOpen = useSessionStore((state) => state.setSidebarOpen);

  return (
    <>
      {/* Overlay para móvil (deshabilitado porque la barra no se usa en móvil) */}
      
      <aside className={`hidden md:flex w-64 h-screen fixed left-0 top-0 border-r border-card-border bg-card shadow-lg z-50 flex-col transition-transform duration-300 translate-x-0`}>
      <div className="p-6 border-b border-card-border">
        <Link href="/" className="inline-block hover:opacity-80 transition-opacity" title="Volver al inicio">
          <img src={companyLogo} alt={`${companyName} Logo`} className="h-8 w-auto" />
        </Link>
        <p className="text-xs text-foreground/50 mt-2 uppercase tracking-wider font-semibold">Panel de Control</p>
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-3">
          {menuItems.filter(item => {
            if (hasPermission('manage:all')) return true;
            if (item.subItems) {
              return item.subItems.some(sub => hasPermission(sub.permission));
            }
            return hasPermission(item.permission);
          }).map((item) => {
            const hasSubItems = item.subItems && item.subItems.length > 0;
            
            // Si tiene subitems, verificamos si hay alguno activo para mantener el acordeón abierto
            const isActive = item.path 
              ? (pathname === item.path || (pathname.startsWith(item.path) && item.path !== '/dashboard'))
              : (hasSubItems && item.subItems?.some(sub => pathname === sub.path || pathname.startsWith(sub.path)));
              
            const isExpanded = expandedMenus.includes(item.name);
            const Icon = item.icon;
            
            const toggleMenu = () => {
              if (isExpanded) {
                setExpandedMenus(expandedMenus.filter(name => name !== item.name));
              } else {
                setExpandedMenus([...expandedMenus, item.name]);
              }
            };
            
            return (
              <li key={item.name}>
                {hasSubItems ? (
                  <button 
                    onClick={toggleMenu}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                      isActive 
                        ? 'bg-foreground/10 text-brand-accent font-medium shadow-sm' 
                        : 'text-foreground/70 hover:bg-foreground/5 hover:text-foreground'
                    }`}
                  >
                    <Icon size={20} className={isActive ? 'text-brand-accent' : ''} />
                    <span className="flex-1 text-left">{item.name}</span>
                    {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  </button>
                ) : (
                  <Link 
                    href={item.path!}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                      isActive 
                        ? 'bg-foreground/10 text-brand-accent font-medium shadow-sm' 
                        : 'text-foreground/70 hover:bg-foreground/5 hover:text-foreground'
                    }`}
                  >
                    <Icon size={20} className={isActive ? 'text-brand-accent' : ''} />
                    <span className="flex-1">{item.name}</span>
                  </Link>
                )}

                {hasSubItems && isExpanded && (
                  <ul className="mt-1 space-y-1 pl-11 pr-2">
                    {item.subItems!.filter(sub => hasPermission(sub.permission)).map((sub) => {
                      const isSubActive = pathname === sub.path || pathname.startsWith(sub.path);
                      return (
                        <li key={sub.path}>
                          <Link
                            href={sub.path}
                            onClick={() => setSidebarOpen(false)}
                            className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-all duration-200 ${
                              isSubActive
                                ? 'text-brand-accent font-medium bg-foreground/5'
                                : 'text-foreground/60 hover:text-foreground hover:bg-foreground/5'
                            }`}
                          >
                            <span className="flex-1">{sub.name}</span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-card-border text-xs text-center text-foreground/40">
        &copy; {new Date().getFullYear()} {companyName}
      </div>
    </aside>
    </>
  );
}

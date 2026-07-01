'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  ShieldCheck, 
  Package, 
  Wrench, 
  Image as ImageIcon,
  MessageSquare,
  Car,
  Box,
  Tag
} from 'lucide-react';
const menuItems = [
  { name: 'Inicio', path: '/dashboard', icon: LayoutDashboard, permission: 'read:dashboard' },
  { name: 'Productos', path: '/dashboard/products', icon: Package, permission: 'read:products' },
  { name: 'Categorías', path: '/dashboard/categories', icon: Tag, permission: 'read:categories' },
  { name: 'Marcas', path: '/dashboard/brands', icon: Box, permission: 'read:brands' },
  { name: 'Modelos', path: '/dashboard/vehicle-models', icon: Car, permission: 'read:models' },
  { name: 'Vehículos', path: '/dashboard/vehicles', icon: Car, permission: 'read:vehicles' },
  { name: 'Servicios', path: '/dashboard/services', icon: Wrench, permission: 'read:services' },
  { name: 'Galería', path: '/dashboard/galleries', icon: ImageIcon, permission: 'read:gallery' },
  { name: 'Usuarios', path: '/dashboard/users', icon: Users, permission: 'read:users' },
  { name: 'Roles', path: '/dashboard/roles', icon: ShieldCheck, permission: 'read:roles' },
  { name: 'Mensajes', path: '/dashboard/messages', icon: MessageSquare, isMessages: true, permission: 'read:messages' },
];

export function Sidebar({ unreadCount = 0, permissions = [] }: { unreadCount?: number, permissions?: string[] }) {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-screen fixed left-0 top-0 border-r border-card-border bg-card shadow-lg z-40 hidden md:flex flex-col">
      <div className="p-6 border-b border-card-border">
        <Link href="/" className="inline-block hover:opacity-80 transition-opacity" title="Volver al inicio">
          <h2 className="text-2xl font-bold text-gradient">Ecotechne</h2>
        </Link>
        <p className="text-xs text-foreground/50 mt-1 uppercase tracking-wider font-semibold">Panel de Control</p>
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-3">
          {menuItems.filter(item => permissions.includes('manage:all') || permissions.includes(item.permission)).map((item) => {
            const isActive = pathname === item.path || (pathname.startsWith(item.path) && item.path !== '/dashboard');
            const Icon = item.icon;
            
            return (
              <li key={item.path}>
                <Link 
                  href={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                    isActive 
                      ? 'bg-foreground/10 text-brand-accent font-medium shadow-sm' 
                      : 'text-foreground/70 hover:bg-foreground/5 hover:text-foreground'
                  }`}
                >
                  <Icon size={20} className={isActive ? 'text-brand-accent' : ''} />
                  <span className="flex-1">{item.name}</span>
                  {item.isMessages && unreadCount > 0 && (
                    <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-card-border text-xs text-center text-foreground/40">
        &copy; {new Date().getFullYear()} Ecotechne 4x4
      </div>
    </aside>
  );
}

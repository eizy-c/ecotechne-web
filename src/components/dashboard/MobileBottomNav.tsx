'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, MessageSquare, Image as ImageIcon, User, Menu, Settings } from 'lucide-react';
import { useSessionStore } from '@/store/useSessionStore';

export default function MobileBottomNav() {
  const pathname = usePathname();
  const unreadCount = useSessionStore((state) => state.unreadCount);

  const navItems: Array<{ name: string; path: string; icon: any; badge?: number }> = [
    { name: 'Inicio', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Ajustes', path: '/dashboard/settings', icon: Settings },
    { name: 'Galería', path: '/dashboard/galleries', icon: ImageIcon },
    { name: 'Perfil', path: '/dashboard/profile', icon: User },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#1A0F0A] border-t border-card-border z-50 flex items-center justify-around px-2 pb-safe shadow-[0_-10px_20px_rgba(0,0,0,0.5)]">
      {navItems.map((item) => {
        const isActive = pathname === item.path;
        const Icon = item.icon;

        return (
          <Link 
            key={item.path} 
            href={item.path}
            className="relative flex flex-col items-center justify-center w-16 h-full gap-1"
          >
            <div className={`
              flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300
              ${isActive ? 'bg-brand-accent/20 text-brand-accent scale-110' : 'text-foreground/50 hover:text-foreground/80'}
            `}>
              <Icon size={20} className={isActive ? 'drop-shadow-[0_0_5px_rgba(255,109,36,0.8)]' : ''} />
              
              {item.badge && item.badge > 0 ? (
                <span className="absolute top-1 right-3 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border border-card shadow-[0_0_10px_rgba(239,68,68,0.5)] animate-pulse">
                  {item.badge > 99 ? '+99' : item.badge}
                </span>
              ) : null}
            </div>
            <span className={`text-[10px] font-medium transition-colors ${isActive ? 'text-brand-accent' : 'text-foreground/50'}`}>
              {item.name}
            </span>
          </Link>
        );
      })}
    </div>
  );
}

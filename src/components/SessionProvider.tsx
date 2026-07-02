'use client';

import { useEffect } from 'react';
import { useSessionStore } from '@/store/useSessionStore';

export default function SessionProvider({ 
  user, 
  unreadCount,
  children 
}: { 
  user: any; 
  unreadCount: number;
  children: React.ReactNode; 
}) {
  const setUser = useSessionStore((state) => state.setUser);
  const setUnreadCount = useSessionStore((state) => state.setUnreadCount);

  // Inicializar en el primer render para evitar desfase
  useEffect(() => {
    setUser(user);
    setUnreadCount(unreadCount);
  }, [user, unreadCount, setUser, setUnreadCount]);

  return <>{children}</>;
}

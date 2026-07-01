'use client';

import { useEffect } from 'react';
import { useSessionStore } from '@/store/useSessionStore';

export default function SessionProvider({ 
  user, 
  children 
}: { 
  user: any; 
  children: React.ReactNode; 
}) {
  const setUser = useSessionStore((state) => state.setUser);

  // Inicializar en el primer render para evitar desfase
  useEffect(() => {
    setUser(user);
  }, [user, setUser]);

  return <>{children}</>;
}

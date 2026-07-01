'use client';

import { useEffect } from 'react';
import { logVisitClient } from '@/actions/analytics';
import { usePathname } from 'next/navigation';

export default function VisitTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Solo trackear una vez por sesión para no saturar
    const hasTracked = sessionStorage.getItem('visit_tracked');
    if (hasTracked) return;

    const trackVisit = async () => {
      try {
        const response = await fetch('http://ip-api.com/json/');
        const data = await response.json();
        
        let country = 'Desconocido';
        if (data.status === 'success') {
          country = data.country;
        }

        await logVisitClient(pathname || '/', country);
        sessionStorage.setItem('visit_tracked', 'true');
      } catch (error) {
        console.error('Error tracking visit:', error);
      }
    };

    trackVisit();
  }, [pathname]);

  return null;
}

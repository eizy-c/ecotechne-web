'use client';

import { useEffect, useState, useRef } from 'react';
import toast from 'react-hot-toast';
import { getUnreadCountClient } from '@/actions/messagesClient';
import { Mail } from 'lucide-react';

export default function MessageAlerter({ initialCount }: { initialCount: number }) {
  const [count, setCount] = useState(initialCount);
  const lastToastCountRef = useRef(initialCount);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const newCount = await getUnreadCountClient();
        
        if (newCount > count) {
          const diff = newCount - count;
          toast((t) => (
            <div className="flex items-center gap-3">
              <div className="bg-brand-accent/20 p-2 rounded-full text-brand-accent">
                <Mail size={20} />
              </div>
              <div>
                <p className="font-bold text-foreground">¡Nuevo mensaje!</p>
                <p className="text-sm text-foreground/70">Tienes {diff} {diff === 1 ? 'mensaje nuevo' : 'mensajes nuevos'} en la bandeja.</p>
              </div>
            </div>
          ), { duration: 5000, position: 'top-right' });
        }
        
        setCount(newCount);
      } catch (error) {
        console.error('Error polling messages:', error);
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [count]);

  return null;
}

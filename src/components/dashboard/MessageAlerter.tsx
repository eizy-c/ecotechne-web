'use client';

import { useEffect, useState, useRef } from 'react';
import toast from 'react-hot-toast';
import { getUnreadCountClient } from '@/actions/messagesClient';
import { Mail } from 'lucide-react';
import { useSessionStore } from '@/store/useSessionStore';

export default function MessageAlerter({ initialCount }: { initialCount: number }) {
  const [count, setCount] = useState(initialCount);
  const setUnreadCount = useSessionStore((state) => state.setUnreadCount);
  const originalTitle = useRef<string>('Dashboard');

  useEffect(() => {
    // Guardar el título original al montar
    if (typeof document !== 'undefined' && !document.title.startsWith('(')) {
      originalTitle.current = document.title || 'Dashboard';
    }
  }, []);

  useEffect(() => {
    const playNotificationSound = () => {
      try {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContext) return;
        
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        // Tonos agradables (Arpegio rápido)
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1); // E5
        osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2); // G5
        
        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.5);
      } catch (e) {
        console.error('Audio not supported or blocked', e);
      }
    };

    const updateFaviconAndTitle = (unread: number) => {
      if (typeof document === 'undefined') return;
      
      // Update Title
      if (unread > 0) {
        document.title = `(${unread}) Nuevos Mensajes - Ecotechne`;
      } else {
        document.title = originalTitle.current;
      }

      // Update Favicon with Canvas
      const canvas = document.createElement('canvas');
      canvas.width = 32;
      canvas.height = 32;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const img = new Image();
      // Usar el logo como base o un círculo neutro si no carga
      img.src = '/icon.png'; 
      img.onload = () => {
        ctx.clearRect(0, 0, 32, 32);
        ctx.drawImage(img, 0, 0, 32, 32);
        
        if (unread > 0) {
          // Dibujar círculo rojo
          ctx.beginPath();
          ctx.arc(24, 8, 8, 0, 2 * Math.PI);
          ctx.fillStyle = '#EF4444'; // text-red-500
          ctx.fill();
          
          // Dibujar número
          ctx.fillStyle = '#FFFFFF';
          ctx.font = 'bold 10px Arial';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(unread > 9 ? '9+' : unread.toString(), 24, 8.5);
        }
        
        // Actualizar el DOM
        let link = document.querySelector("link[rel*='icon']") as HTMLLinkElement;
        if (!link) {
          link = document.createElement('link');
          link.rel = 'icon';
          document.head.appendChild(link);
        }
        link.type = 'image/png';
        link.href = canvas.toDataURL('image/png');
      };
      
      // Fallback por si la imagen no existe
      img.onerror = () => {
        ctx.clearRect(0, 0, 32, 32);
        ctx.beginPath();
        ctx.arc(16, 16, 14, 0, 2 * Math.PI);
        ctx.fillStyle = '#2C1810';
        ctx.fill();
        
        if (unread > 0) {
          ctx.beginPath();
          ctx.arc(24, 8, 8, 0, 2 * Math.PI);
          ctx.fillStyle = '#EF4444';
          ctx.fill();
          ctx.fillStyle = '#FFFFFF';
          ctx.font = 'bold 10px Arial';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(unread > 9 ? '9+' : unread.toString(), 24, 8.5);
        }
        
        let link = document.querySelector("link[rel*='icon']") as HTMLLinkElement;
        if (!link) {
          link = document.createElement('link');
          link.rel = 'icon';
          document.head.appendChild(link);
        }
        link.type = 'image/png';
        link.href = canvas.toDataURL('image/png');
      };
    };

    // Al montar/actualizar el componente, reflejar el badge
    updateFaviconAndTitle(count);

    const interval = setInterval(async () => {
      try {
        const newCount = await getUnreadCountClient();
        
        if (newCount > count) {
          const diff = newCount - count;
          playNotificationSound();
          
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
          ), { 
            duration: 5000, 
            position: 'top-right',
            style: {
              background: '#1A1A1A',
              color: '#FFFFFF',
              border: '1px solid #FF6D24',
              borderRadius: '12px'
            }
          });
        }
        
        if (newCount !== count) {
          updateFaviconAndTitle(newCount);
          setCount(newCount);
          setUnreadCount(newCount);
        }
      } catch (error) {
        console.error('Error polling messages:', error);
      }
    }, 10000); // Check every 10 seconds

    return () => clearInterval(interval);
  }, [count, setUnreadCount]);

  return null;
}

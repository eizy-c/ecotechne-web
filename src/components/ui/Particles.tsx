'use client';

import { useEffect, useRef } from 'react';

export default function Particles({
  particleCount = 50,
  color = '#FF6D24', // brand-accent default
}: {
  particleCount?: number;
  color?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles: Particle[] = [];
    let animationFrameId: number;
    const parent = canvas.parentElement;
    let w = canvas.width = parent ? parent.clientWidth : window.innerWidth;
    let h = canvas.height = parent ? parent.clientHeight : window.innerHeight;

    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;

      constructor() {
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        this.size = Math.random() * 3 + 1;
        this.speedX = (Math.random() * 1 - 0.5) * 0.5;
        this.speedY = (Math.random() * 1 - 0.5) * 0.5;
        this.opacity = Math.random() * 0.5 + 0.1;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > w) this.x = 0;
        else if (this.x < 0) this.x = w;
        
        if (this.y > h) this.y = 0;
        else if (this.y < 0) this.y = h;
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        
        // Convert hex to rgb for opacity handling if needed, but we can just use globalAlpha
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = color;
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    }

    const init = () => {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, w, h);
      
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
        
        // Draw lines between nearby particles
        for (let j = i; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 120) {
            ctx.beginPath();
            ctx.strokeStyle = color;
            ctx.globalAlpha = (120 - distance) / 120 * 0.3; // Fade out based on distance
            ctx.lineWidth = 1.5; // Thicker for mobile retina displays
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
            ctx.globalAlpha = 1;
          }
        }
      }
      
      animationFrameId = requestAnimationFrame(animate);
    };

    const handleResize = () => {
      const parent = canvas.parentElement;
      w = canvas.width = parent ? parent.clientWidth : window.innerWidth;
      h = canvas.height = parent ? parent.clientHeight : window.innerHeight;
      init();
    };

    window.addEventListener('resize', handleResize);
    
    init();
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [particleCount, color]);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 w-full h-full z-0 pointer-events-none"
      style={{ opacity: 0.8 }}
    />
  );
}

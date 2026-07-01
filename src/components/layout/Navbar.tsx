'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Navbar({ 
  isLoggedIn = false,
  hasServices = true,
  hasStore = true,
  hasGallery = true
}: { 
  isLoggedIn?: boolean,
  hasServices?: boolean,
  hasStore?: boolean,
  hasGallery?: boolean
}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Inicio', id: 'inicio', show: true },
    { name: 'Nosotros', id: 'nosotros', show: true },
    { name: 'Tienda', id: 'tienda', show: hasStore },
    { name: 'Servicios', id: 'servicios', show: hasServices },
    { name: 'Portafolio', id: 'portafolio', show: hasGallery },
  ].filter(item => item.show);

  return (
    <nav 
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? 'glass-nav py-4' 
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <img src="/logo-long.png" alt="Ecotechne Logo" className="h-10 w-auto" />
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8 items-center">
            {navItems.map((item) => (
              <Link
                key={item.id}
                href={`#${item.id}`}
                className={`text-sm font-medium transition-colors ${isScrolled ? 'text-foreground/80 hover:text-brand-accent' : 'text-white/80 hover:text-white'}`}
              >
                {item.name}
              </Link>
            ))}
            {isLoggedIn ? (
              <Link
                href="/dashboard"
                className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all transform hover:scale-105 shadow-[0_0_15px_rgba(0,0,0,0.1)] ${
                  isScrolled 
                    ? 'bg-foreground/10 text-foreground hover:bg-foreground/20' 
                    : 'bg-white text-brand-dark hover:bg-white/90'
                }`}
              >
                Panel de Control
              </Link>
            ) : null}
            <Link
              href="#contacto"
              className="px-6 py-2.5 rounded-full bg-brand-accent hover:bg-brand-accent/90 text-brand-dark text-sm font-bold transition-all transform hover:scale-105 shadow-[0_0_15px_rgba(255,109,36,0.3)] btn-glow"
            >
              Cotizar Proyecto
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className={`md:hidden p-2 transition-colors ${isScrolled ? 'text-foreground' : 'text-white'}`}
            onClick={() => setIsOpen(!isOpen)}
          >
            <i className={`fa-solid ${isOpen ? 'fa-xmark' : 'fa-bars'} text-2xl`}></i>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-background border-b border-card-border absolute w-full shadow-2xl">
          <div className="px-4 pt-2 pb-6 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.id}
                href={`#${item.id}`}
                onClick={() => setIsOpen(false)}
                className="block px-3 py-3 rounded-md text-base font-medium text-foreground/80 hover:bg-foreground/5 hover:text-brand-accent transition-colors"
              >
                {item.name}
              </Link>
            ))}
            <Link
              href="#contacto"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-3 rounded-md text-base font-medium text-foreground/80 hover:bg-foreground/5 hover:text-brand-accent transition-colors"
            >
              Contacto
            </Link>
            {isLoggedIn && (
              <Link
                href="/dashboard"
                onClick={() => setIsOpen(false)}
                className="block px-3 py-3 rounded-md text-base font-bold text-foreground bg-foreground/10 hover:bg-foreground/20 mt-4 text-center transition-colors"
              >
                Ir al Panel de Control
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

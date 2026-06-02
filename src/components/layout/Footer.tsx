import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-brand-black border-t border-white/5 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div>
            <img src="/logo-long.png" alt="Ecotechne Logo" className="h-8 md:h-10 mb-4" />
            <p className="text-xs text-brand-light/30 uppercase tracking-widest">
              &copy; {new Date().getFullYear()} Ecotechne. Fabricación de Élite.
            </p>
          </div>
          
          <div className="flex items-center gap-6">
            <a href="https://www.instagram.com/ecotechne/" target="_blank" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-brand-light/40 hover:text-brand-accent hover:border-brand-accent transition-all">
              <i className="fa-brands fa-instagram"></i>
            </a>
            <a href="mailto:admiecotechne@gmail.com" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-brand-light/40 hover:text-brand-accent hover:border-brand-accent transition-all">
              <i className="fa-solid fa-envelope"></i>
            </a>
          </div>

          <div className="flex gap-8">
            <Link href="#" className="text-xs text-brand-light/30 hover:text-brand-accent uppercase font-bold tracking-tighter">Privacidad</Link>
            <Link href="#" className="text-xs text-brand-light/30 hover:text-brand-accent uppercase font-bold tracking-tighter">Términos</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

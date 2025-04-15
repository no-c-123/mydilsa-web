import { useEffect, useState } from 'react';

export default function Header({ currentPath }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (href) => currentPath.startsWith(href);
  const linkClass = (href) =>
    `relative transition hover:text-mydilsa-accent ${
      isActive(href) ? 'text-mydilsa-accent font-semibold' : ''
    }`;

  return (
    <header
      className={`bg-white shadow-md sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? 'py-2' : 'py-4'
      }`}
    >
      <div className="max-w-8xl mx-auto px-6 flex items-center justify-between transition-all">
        {/* Left side: Logo and title */}
        <div className="flex items-center gap-4">
          <img src="/Logo.webp" alt="Mydilsa Logo" className="w-20 h-auto transition-all duration-300" />
          <span className="text-xl font-semibold tracking-wide">Mydilsa</span>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-8 text-sm font-medium">
          <a href="/" className={linkClass('/')}>Inicio</a>
          <a href="/servicios" className={linkClass('/servicios')}>Servicios</a>
          <a href="/productos" className={linkClass('/productos')}>Productos</a>
          <a href="/contacto" className={linkClass('/contacto')}>Contacto</a>
        </nav>

        {/* Mobile Toggle */}
        <button className="md:hidden" onClick={() => setOpen(!open)}>
          <svg className="w-6 h-6 text-mydilsa-dark" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Mobile Nav */}
      {open && (
        <div className="md:hidden px-6 pb-4 flex flex-col gap-4 text-sm font-medium bg-white border-t">
          <a href="/" onClick={() => setOpen(false)} className={linkClass('/')}>Inicio</a>
          <a href="/servicios" onClick={() => setOpen(false)} className={linkClass('/servicios')}>Servicios</a>
          <a href="/productos" onClick={() => setOpen(false)} className={linkClass('/productos')}>Productos</a>
          <a href="/contacto" onClick={() => setOpen(false)} className={linkClass('/contacto')}>Contacto</a>
        </div>
      )}
    </header>
  );
}

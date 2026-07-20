/**
 * @file components/layout/Header.tsx
 * @description Barra de navegación principal. Responsive con hamburger menu en mobile.
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '@/assets/logo.png';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const navLinks = [
    { label: 'Mascotas Perdidas', href: '/reportes?tipo=perdida' },
    { label: 'En Adopción', href: '/reportes?tipo=adopcion' },
    { label: 'Encontradas', href: '/reportes?tipo=encontrada' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-thistle-600 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* ── Logo ── */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <img
              src={logo}
              alt="Patitas del Valle"
              className="h-10 w-auto object-contain"
            />
            <span className="hidden sm:block font-bold text-lg text-thistle-200 tracking-tight leading-tight">
              Patitas<br />
              <span className="text-baby_pink-400 font-extrabold">del Valle</span>
            </span>
          </Link>

          {/* ── Nav Desktop ── */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="px-3 py-2 rounded-lg text-sm font-medium text-thistle-200 hover:bg-thistle-800 hover:text-thistle-100 transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* ── Actions Desktop ── */}
          <div className="hidden lg:flex items-center gap-3">
            <button
              onClick={() => navigate('/registro')}
              className="px-4 py-2 rounded-xl text-sm font-semibold border-2 border-thistle-400 text-thistle-200 hover:bg-thistle-800 transition-all duration-200 cursor-pointer min-h-[44px]"
            >
              Registrarse
            </button>
            <button
              onClick={() => navigate('/reportes/nuevo')}
              className="px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-baby_pink-400 to-pastel_petal-400 text-white shadow-md hover:from-baby_pink-300 hover:to-pastel_petal-300 hover:shadow-lg transition-all duration-200 cursor-pointer min-h-[44px] flex items-center gap-2"
            >
              <span className="text-base">+</span>
              Reportar mascota
            </button>
          </div>

          {/* ── Hamburger Mobile ── */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden p-2 rounded-lg text-thistle-200 hover:bg-thistle-800 transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Abrir menú"
          >
            {menuOpen ? (
              /* X icon */
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              /* Hamburger icon */
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* ── Mobile Menu ── */}
      {menuOpen && (
        <div className="lg:hidden bg-white border-t border-thistle-700 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setMenuOpen(false)}
                className="px-4 py-3 rounded-xl text-sm font-medium text-thistle-200 hover:bg-thistle-900 transition-colors min-h-[44px] flex items-center"
              >
                {link.label}
              </Link>
            ))}
            <div className="border-t border-thistle-700 mt-2 pt-3 flex flex-col gap-2">
              <button
                onClick={() => { navigate('/registro'); setMenuOpen(false); }}
                className="w-full px-4 py-3 rounded-xl text-sm font-semibold border-2 border-thistle-400 text-thistle-200 hover:bg-thistle-800 transition-all cursor-pointer min-h-[44px]"
              >
                Registrarse
              </button>
              <button
                onClick={() => { navigate('/reportes/nuevo'); setMenuOpen(false); }}
                className="w-full px-4 py-3 rounded-xl text-sm font-semibold bg-gradient-to-r from-baby_pink-400 to-pastel_petal-400 text-white shadow-md hover:from-baby_pink-300 hover:to-pastel_petal-300 transition-all cursor-pointer min-h-[44px] flex items-center justify-center gap-2"
              >
                <span className="text-base">+</span>
                Reportar mascota
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;

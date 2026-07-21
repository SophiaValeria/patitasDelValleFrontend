/**
 * @file components/layout/Header.tsx
 * @description Barra de navegación principal. Responsive con hamburger menu en mobile.
 */

import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '@/assets/logo.png';
import useAuth from '@/hooks/useAuth';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  // Cerrar menú desplegable al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);



  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    setMenuOpen(false);
    navigate('/');
  };

  // Obtener iniciales para el avatar
  const getInitials = (name: string) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return parts[0][0].toUpperCase();
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-thistle-600 shadow-sm">
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



          {/* ── Actions Desktop ── */}
          <div className="hidden lg:flex items-center gap-3">
            <button
              onClick={() => navigate('/reportes/nuevo')}
              className="px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-baby_pink-400 to-pastel_petal-400 text-white shadow-md hover:from-baby_pink-300 hover:to-pastel_petal-300 hover:shadow-lg transition-all duration-200 cursor-pointer min-h-[44px] flex items-center gap-2"
            >
              <span className="text-base font-bold">+</span>
              Reportar mascota
            </button>

            {isAuthenticated && user ? (
              /* User Menu Logged In */
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2.5 p-1.5 pr-3 rounded-2xl border-2 border-thistle-600 hover:border-baby_pink-400 hover:bg-thistle-900/40 transition-all cursor-pointer min-h-[44px]"
                  aria-expanded={userDropdownOpen}
                >
                  {user.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover border border-baby_pink-400"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-thistle-300 to-baby_pink-400 text-white font-bold text-xs flex items-center justify-center shadow-sm">
                      {getInitials(user.name)}
                    </div>
                  )}
                  <span className="text-sm font-semibold text-thistle-100 max-w-[120px] truncate">
                    {user.name.split(' ')[0]}
                  </span>
                  <svg
                    className={`w-4 h-4 text-thistle-300 transition-transform duration-200 ${
                      userDropdownOpen ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown Box */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-thistle-700/60 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-4 py-3 border-b border-thistle-800 bg-thistle-950/40">
                      <p className="text-xs font-semibold text-thistle-400 uppercase tracking-wider">
                        Sesión iniciada como
                      </p>
                      <p className="text-sm font-bold text-thistle-100 truncate mt-0.5">{user.name}</p>
                      <p className="text-xs text-thistle-300 truncate">{user.email}</p>
                    </div>

                    <div className="py-1">
                      <Link
                        to="/perfil"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-thistle-200 hover:bg-thistle-900 hover:text-thistle-100 transition-colors"
                      >
                        <svg className="w-4 h-4 text-baby_pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Mi Perfil
                      </Link>

                      <Link
                        to="/dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-thistle-200 hover:bg-thistle-900 hover:text-thistle-100 transition-colors"
                      >
                        <svg className="w-4 h-4 text-sky_blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Mis Reportes
                      </Link>

                      {user.role === 'ADMIN' && (
                        <Link
                          to="/admin/reportes"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-semibold text-baby_pink-300 hover:bg-thistle-900 transition-colors"
                        >
                          <svg className="w-4 h-4 text-baby_pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                          </svg>
                          Panel Administrador
                        </Link>
                      )}
                    </div>

                    <div className="border-t border-thistle-800 pt-1 mt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-semibold text-pastel_petal-200 hover:bg-pastel_petal-900/30 transition-colors text-left cursor-pointer"
                      >
                        <svg className="w-4 h-4 text-pastel_petal-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Cerrar Sesión
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* User Actions Unauthenticated */
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate('/login')}
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-thistle-100 hover:text-baby_pink-400 hover:bg-thistle-800/60 transition-all duration-200 cursor-pointer min-h-[44px]"
                >
                  Iniciar Sesión
                </button>
                <button
                  onClick={() => navigate('/registro')}
                  className="px-4 py-2 rounded-xl text-sm font-semibold border-2 border-thistle-400 text-thistle-200 hover:bg-thistle-800 hover:text-thistle-100 transition-all duration-200 cursor-pointer min-h-[44px]"
                >
                  Registrarse
                </button>
              </div>
            )}
          </div>

          {/* ── Hamburger Mobile ── */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden p-2 rounded-lg text-thistle-200 hover:bg-thistle-800 transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Abrir menú"
          >
            {menuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* ── Mobile Menu ── */}
      {menuOpen && (
        <div className="lg:hidden bg-white border-t border-thistle-700 shadow-lg animate-in slide-in-from-top duration-200">
          <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-2">
            
            {/* Si está autenticado, mostrar tarjeta de usuario en mobile */}
            {isAuthenticated && user && (
              <div className="p-3 bg-thistle-900/60 rounded-2xl border border-thistle-600 mb-2 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-thistle-300 to-baby_pink-400 text-white font-bold text-sm flex items-center justify-center shrink-0 shadow">
                  {getInitials(user.name)}
                </div>
                <div className="overflow-hidden">
                  <p className="font-bold text-sm text-thistle-100 truncate">{user.name}</p>
                  <p className="text-xs text-thistle-300 truncate">{user.email}</p>
                </div>
              </div>
            )}



            <div className="border-t border-thistle-700 mt-2 pt-3 flex flex-col gap-2">
              <button
                onClick={() => { navigate('/reportes/nuevo'); setMenuOpen(false); }}
                className="w-full px-4 py-3 rounded-xl text-sm font-semibold bg-gradient-to-r from-baby_pink-400 to-pastel_petal-400 text-white shadow-md hover:from-baby_pink-300 hover:to-pastel_petal-300 transition-all cursor-pointer min-h-[44px] flex items-center justify-center gap-2"
              >
                <span className="text-base font-bold">+</span>
                Reportar mascota
              </button>

              {isAuthenticated ? (
                <>
                  <Link
                    to="/perfil"
                    onClick={() => setMenuOpen(false)}
                    className="w-full px-4 py-3 rounded-xl text-sm font-semibold border-2 border-thistle-400 text-thistle-200 hover:bg-thistle-800 transition-all min-h-[44px] flex items-center justify-center gap-2"
                  >
                    Mi Perfil
                  </Link>

                  <Link
                    to="/dashboard"
                    onClick={() => setMenuOpen(false)}
                    className="w-full px-4 py-3 rounded-xl text-sm font-semibold border-2 border-thistle-400 text-thistle-200 hover:bg-thistle-800 transition-all min-h-[44px] flex items-center justify-center gap-2"
                  >
                    Mis Reportes
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-3 rounded-xl text-sm font-semibold text-pastel_petal-200 border border-pastel_petal-300/40 hover:bg-pastel_petal-900/30 transition-all cursor-pointer min-h-[44px] flex items-center justify-center gap-2"
                  >
                    Cerrar Sesión
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => { navigate('/login'); setMenuOpen(false); }}
                    className="w-full px-4 py-3 rounded-xl text-sm font-semibold bg-thistle-800 text-thistle-100 hover:bg-thistle-700 transition-all cursor-pointer min-h-[44px]"
                  >
                    Iniciar Sesión
                  </button>
                  <button
                    onClick={() => { navigate('/registro'); setMenuOpen(false); }}
                    className="w-full px-4 py-3 rounded-xl text-sm font-semibold border-2 border-thistle-400 text-thistle-200 hover:bg-thistle-800 transition-all cursor-pointer min-h-[44px]"
                  >
                    Registrarse
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;


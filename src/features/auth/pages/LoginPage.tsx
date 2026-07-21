import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuth from '@/hooks/useAuth';

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!email.trim() || !password.trim()) {
      setErrorMsg('Por favor ingresa tu correo y contraseña.');
      return;
    }

    setIsSubmitting(true);

    try {
      await login({
        email: email.trim(),
        password,
      });

      // Redirigir al inicio después de iniciar sesión
      navigate('/');
    } catch (err: any) {
      setErrorMsg(err.message || 'Error al iniciar sesión. Verifica tus credenciales.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputBaseClass =
    'w-full min-h-[44px] px-4 py-2.5 rounded-2xl border-2 border-thistle-600 bg-thistle-900 text-thistle-100 placeholder-thistle-400 outline-none transition-all duration-200 focus:border-baby_pink-400 text-sm focus:ring-2 focus:ring-baby_pink-400/20';

  return (
    <div className="min-h-screen bg-gradient-to-br from-thistle-900 via-thistle-900 to-icy_blue-900 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="w-full max-w-md bg-white border border-thistle-700/50 shadow-2xl rounded-3xl overflow-hidden transition-all duration-300">
        
        {/* Banner */}
        <div className="bg-gradient-to-r from-baby_pink-400 to-thistle-400 p-8 text-center relative">
          <div className="absolute top-4 left-4 text-xl">🐾</div>
          <div className="absolute bottom-4 right-4 text-xl">💜</div>
          <h1 className="text-2xl font-black text-white drop-shadow-sm mb-1">
            ¡Hola de nuevo!
          </h1>
          <p className="text-white/90 text-xs font-medium">
            Inicia sesión para reportar o administrar tus publicaciones.
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
          
          {/* Alerta de Error */}
          {errorMsg && (
            <div className="flex items-start gap-3 bg-pastel_petal-900 border border-pastel_petal-300 rounded-2xl p-4 animate-shake">
              <svg className="w-5 h-5 text-pastel_petal-200 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-pastel_petal-100 font-semibold">{errorMsg}</p>
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block text-xs font-bold text-thistle-200 mb-2 uppercase tracking-wide">
              Correo Electrónico
            </label>
            <input
              type="email"
              required
              placeholder="contacto@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputBaseClass}
            />
          </div>

          {/* Contraseña */}
          <div>
            <label className="block text-xs font-bold text-thistle-200 mb-2 uppercase tracking-wide">
              Contraseña
            </label>
            <input
              type="password"
              required
              placeholder="Ingresa tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputBaseClass}
            />
          </div>

          {/* Botón Iniciar Sesión */}
          <div className="pt-2 flex flex-col items-center space-y-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="
                w-full min-h-[48px] px-8 py-3.5 rounded-2xl
                bg-gradient-to-r from-baby_pink-400 to-pastel_petal-400 text-white
                font-bold text-sm shadow-md hover:shadow-lg hover:shadow-baby_pink-400/20
                hover:from-baby_pink-300 hover:to-pastel_petal-300
                transition-all duration-200 cursor-pointer flex items-center justify-center gap-2
                disabled:opacity-50 disabled:cursor-not-allowed
                hover:scale-[1.01] active:scale-[0.99]
              "
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Iniciando sesión...</span>
                </>
              ) : (
                <span>Iniciar Sesión</span>
              )}
            </button>

            <p className="text-xs text-thistle-400 pt-2">
              ¿Aún no tienes cuenta?{' '}
              <Link to="/registro" className="text-baby_pink-400 font-bold hover:underline">
                Regístrate aquí
              </Link>
            </p>
          </div>

        </form>
      </div>
    </div>
  );
};

export default LoginPage;

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuth from '@/hooks/useAuth';
import { CHILE_REGIONS } from '@/features/reports/data/chile-locations';

// ── UTILERÍA CLIENTE DE VALIDACIÓN DE RUT ──
const cleanRut = (rut: string) => rut.replace(/[^0-9kK]/g, '').toUpperCase();

const validateRut = (rut: string): boolean => {
  if (!rut || typeof rut !== 'string') return false;
  const cleaned = cleanRut(rut);
  if (cleaned.length < 8) return false;

  const dv = cleaned.slice(-1);
  const numStr = cleaned.slice(0, -1);
  if (!/^\d+$/.test(numStr)) return false;

  const num = parseInt(numStr, 10);
  
  // Algoritmo módulo 11
  let sum = 0;
  let multiplier = 2;
  let temp = num;

  while (temp > 0) {
    sum += (temp % 10) * multiplier;
    temp = Math.floor(temp / 10);
    multiplier = multiplier === 7 ? 2 : multiplier + 1;
  }

  const remainder = sum % 11;
  const result = 11 - remainder;
  const computedDv = result === 11 ? '0' : result === 10 ? 'K' : String(result);

  return computedDv === dv;
};

const formatRut = (rut: string): string => {
  const cleaned = cleanRut(rut);
  if (!cleaned) return '';
  const dv = cleaned.slice(-1);
  const body = cleaned.slice(0, -1);

  let formattedBody = '';
  let count = 0;

  for (let i = body.length - 1; i >= 0; i--) {
    formattedBody = body.charAt(i) + formattedBody;
    count++;
    if (count % 3 === 0 && i !== 0) {
      formattedBody = '.' + formattedBody;
    }
  }
  return `${formattedBody}-${dv}`;
};

const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  // Estados del Formulario
  const [name, setName] = useState('');
  const [rut, setRut] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [region, setRegion] = useState('');
  const [commune, setCommune] = useState('');
  const [address, setAddress] = useState('');
  
  // Foto de Perfil
  const [photoBase64, setPhotoBase64] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);

  // Estados UI
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Región seleccionada para cargar comunas
  const selectedRegionData = CHILE_REGIONS.find((r) => r.value === region);

  // ── MANEJO DEL ARCHIVO FOTO ──
  const processImageFile = (file: File) => {
    if (!file) return;

    // Validar tipo de imagen
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      setPhotoError('Por favor selecciona una imagen válida (JPEG, PNG, WEBP, GIF).');
      return;
    }

    // Validar tamaño máximo (2MB para perfil es más que suficiente)
    if (file.size > 2 * 1024 * 1024) {
      setPhotoError('La imagen de perfil no debe superar los 2 MB.');
      return;
    }

    setPhotoError(null);

    // Convertir a Base64
    const reader = new FileReader();
    reader.onload = (e) => {
      setPhotoBase64(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processImageFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processImageFile(e.dataTransfer.files[0]);
    }
  };

  const handleRemovePhoto = () => {
    setPhotoBase64(null);
    setPhotoError(null);
  };

  // ── MANEJO DE RUT ON BLUR (PARA FORMATEO) ──
  const handleRutBlur = () => {
    if (rut.trim()) {
      const cleaned = cleanRut(rut);
      if (cleaned) {
        setRut(formatRut(cleaned));
      }
    }
  };

  // ── SUBMIT DEL FORMULARIO ──
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // 1. Validaciones básicas
    if (
      !name.trim() ||
      !rut.trim() ||
      !phone.trim() ||
      !email.trim() ||
      !password.trim() ||
      !confirmPassword.trim() ||
      !region ||
      !commune ||
      !address.trim()
    ) {
      setErrorMsg('Por favor completa todos los campos obligatorios.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // 2. Validar RUT
    if (!validateRut(rut)) {
      setErrorMsg('El RUT ingresado no es válido. Ej: 12.345.678-K');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // 3. Validar Teléfono (ej: +56912345678 o 912345678)
    const phoneCleaned = phone.replace(/\s+/g, '');
    if (!/^\+?(\d{8,12})$/.test(phoneCleaned)) {
      setErrorMsg('Por favor ingresa un número de celular válido (ej: +56912345678 o 912345678).');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // 4. Validar Contraseña
    if (password.length < 8) {
      setErrorMsg('La contraseña debe tener al menos 8 caracteres.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Las contraseñas ingresadas no coinciden.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        name: name.trim(),
        rut: formatRut(cleanRut(rut)),
        phone: phoneCleaned,
        email: email.trim(),
        password,
        region,
        commune,
        address: address.trim(),
        ...(photoBase64 ? { avatarUrl: photoBase64 } : {}),
      };
      await register(payload);

      // Redirigir al inicio después de un registro exitoso
      navigate('/');
    } catch (err: any) {
      setErrorMsg(err.message || 'Error al crear la cuenta. Inténtalo de nuevo.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Clases utilitarias comunes para inputs
  const inputBaseClass =
    'w-full min-h-[44px] px-4 py-2.5 rounded-2xl border-2 border-thistle-600 bg-thistle-900 text-thistle-100 placeholder-thistle-400 outline-none transition-all duration-200 focus:border-baby_pink-400 text-sm focus:ring-2 focus:ring-baby_pink-400/20';

  return (
    <div className="min-h-screen bg-gradient-to-br from-thistle-900 via-thistle-900 to-icy_blue-900 py-10 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="w-full max-w-3xl bg-white border border-thistle-700/50 shadow-2xl rounded-3xl overflow-hidden transition-all duration-300">
        
        {/* Banner de Bienvenida */}
        <div className="bg-gradient-to-r from-baby_pink-400 to-thistle-400 p-8 text-center relative">
          <div className="absolute top-4 left-4 text-2xl">🐾</div>
          <div className="absolute bottom-4 right-4 text-2xl">💜</div>
          <h1 className="text-3xl font-black text-white drop-shadow-sm mb-2">
            Únete a la Comunidad
          </h1>
          <p className="text-white/90 text-sm font-medium max-w-md mx-auto">
            Crea tu cuenta en Patitas del Valle y ayúdanos a reunir a las mascotas de nuestra región con sus familias.
          </p>
        </div>

        {/* Contenido del Formulario */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-10 space-y-8">
          
          {/* Mensaje de Error Global */}
          {errorMsg && (
            <div className="flex items-start gap-3 bg-pastel_petal-900 border border-pastel_petal-300 rounded-2xl p-4 animate-shake">
              <svg className="w-5 h-5 text-pastel_petal-200 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-pastel_petal-100 font-semibold">{errorMsg}</p>
            </div>
          )}

          {/* Sección 1: Foto de Perfil */}
          <div className="flex flex-col items-center justify-center space-y-4">
            <h3 className="text-sm font-bold text-thistle-200 uppercase tracking-wider text-center">
              Foto de Perfil
            </h3>

            <div className="relative group">
              {photoBase64 ? (
                <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-baby_pink-400 shadow-md">
                  <img
                    src={photoBase64}
                    alt="Previsualización de perfil"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center text-white text-xs font-bold cursor-pointer"
                  >
                    Eliminar foto
                  </button>
                </div>
              ) : (
                <div
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById('photo-upload')?.click()}
                  className="w-32 h-32 rounded-full border-4 border-dashed border-thistle-600 bg-thistle-900 hover:border-baby_pink-400 hover:bg-thistle-800 transition-all duration-200 flex flex-col items-center justify-center cursor-pointer shadow-inner text-center p-2 group"
                >
                  <svg className="w-8 h-8 text-thistle-400 group-hover:text-baby_pink-400 transition-colors duration-200 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-[10px] font-semibold text-thistle-400 group-hover:text-baby_pink-400 transition-colors duration-200">
                    Sube tu foto
                  </span>
                </div>
              )}
              
              <input
                id="photo-upload"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
            
            <p className="text-[11px] text-thistle-400 text-center max-w-xs">
              Arrastra una imagen o haz clic sobre el círculo (JPEG, PNG, máx. 2MB).
            </p>
            
            {photoError && (
              <p className="text-xs text-pastel_petal-200 font-medium text-center">{photoError}</p>
            )}
          </div>

          <hr className="border-thistle-600/30" />

          {/* Sección 2: Datos Personales */}
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-thistle-200 uppercase tracking-wider border-l-4 border-baby_pink-400 pl-3">
              Datos Personales
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nombres y Apellidos */}
              <div>
                <label className="block text-xs font-bold text-thistle-200 mb-2">
                  NOMBRES Y APELLIDOS <span className="text-baby_pink-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Sophia Valeria"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={inputBaseClass}
                />
              </div>

              {/* RUT */}
              <div>
                <label className="block text-xs font-bold text-thistle-200 mb-2">
                  RUT <span className="text-baby_pink-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: 12.345.678-9"
                  value={rut}
                  onChange={(e) => setRut(e.target.value)}
                  onBlur={handleRutBlur}
                  className={inputBaseClass}
                />
              </div>

              {/* Celular */}
              <div>
                <label className="block text-xs font-bold text-thistle-200 mb-2">
                  CELULAR <span className="text-baby_pink-400">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="Ej: +56912345678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={inputBaseClass}
                />
              </div>

              {/* Correo Electrónico */}
              <div>
                <label className="block text-xs font-bold text-thistle-200 mb-2">
                  CORREO ELECTRÓNICO <span className="text-baby_pink-400">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="Ej: contacto@ejemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputBaseClass}
                />
              </div>
            </div>
          </div>

          <hr className="border-thistle-600/30" />

          {/* Sección 3: Dirección */}
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-thistle-200 uppercase tracking-wider border-l-4 border-sky_blue-400 pl-3">
              Ubicación de Residencia
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Región */}
              <div>
                <label className="block text-xs font-bold text-thistle-200 mb-2">
                  REGIÓN <span className="text-baby_pink-400">*</span>
                </label>
                <select
                  required
                  value={region}
                  onChange={(e) => {
                    setRegion(e.target.value);
                    setCommune('');
                  }}
                  className={`${inputBaseClass} cursor-pointer`}
                >
                  <option value="" className="bg-thistle-900">Selecciona una región</option>
                  {CHILE_REGIONS.map((r) => (
                    <option key={r.value} value={r.value} className="bg-thistle-900">
                      {r.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Comuna */}
              <div>
                <label className="block text-xs font-bold text-thistle-200 mb-2">
                  COMUNA <span className="text-baby_pink-400">*</span>
                </label>
                <select
                  required
                  disabled={!region}
                  value={commune}
                  onChange={(e) => setCommune(e.target.value)}
                  className={`${inputBaseClass} cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <option value="" className="bg-thistle-900">Selecciona una comuna</option>
                  {selectedRegionData?.comunas.map((c) => (
                    <option key={c} value={c} className="bg-thistle-900">
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Dirección */}
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-thistle-200 mb-2">
                  DIRECCIÓN COMPLETA <span className="text-baby_pink-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Calle, número, departamento o villa"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className={inputBaseClass}
                />
              </div>
            </div>
          </div>

          <hr className="border-thistle-600/30" />

          {/* Sección 4: Contraseñas */}
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-thistle-200 uppercase tracking-wider border-l-4 border-thistle-400 pl-3">
              Credenciales de Acceso
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Contraseña */}
              <div>
                <label className="block text-xs font-bold text-thistle-200 mb-2">
                  CONTRASEÑA <span className="text-baby_pink-400">*</span>
                </label>
                <input
                  type="password"
                  required
                  placeholder="Mínimo 8 caracteres"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={inputBaseClass}
                />
              </div>

              {/* Confirmar Contraseña */}
              <div>
                <label className="block text-xs font-bold text-thistle-200 mb-2">
                  CONFIRMAR CONTRASEÑA <span className="text-baby_pink-400">*</span>
                </label>
                <input
                  type="password"
                  required
                  placeholder="Repite tu contraseña"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={inputBaseClass}
                />
              </div>
            </div>
          </div>

          {/* Términos y Botón Submit */}
          <div className="pt-4 flex flex-col items-center space-y-4">
            <p className="text-xs text-thistle-400 text-center">
              Al registrarte, declaras que toda la información entregada es verídica y te comprometes a hacer un uso responsable de los reportes.
            </p>

            <button
              type="submit"
              disabled={isSubmitting}
              className="
                w-full sm:w-64 min-h-[48px] px-8 py-3.5 rounded-2xl
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
                  <span>Creando cuenta...</span>
                </>
              ) : (
                <span>Crear Cuenta</span>
              )}
            </button>

            <p className="text-xs text-thistle-400 pt-2">
              ¿Ya tienes una cuenta?{' '}
              <Link to="/login" className="text-baby_pink-400 font-bold hover:underline">
                Inicia sesión aquí
              </Link>
            </p>
          </div>

        </form>
      </div>
    </div>
  );
};

export default RegisterPage;

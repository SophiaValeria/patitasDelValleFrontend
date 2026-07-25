/**
 * @file features/reports/pages/ReportDetailPage.tsx
 * @description Vista detallada de un reporte de mascota.
 * Despliega información completa de la mascota, ubicación y contacto del autor.
 * 
 * Regla de privacidad y ofuscado:
 *  - Si el usuario NO está autenticado:
 *      * Teléfono: Se muestra de forma parcial/ofuscada (+56 9 •••• ••••).
 *      * Dirección exacta: Se oculta y muestra mensaje instando a registrarse/iniciar sesión.
 *      * WhatsApp: El botón indica al usuario que debe iniciar sesión.
 *  - Si el usuario SÍ está autenticado:
 *      * Se muestra el número completo y la dirección exacta.
 *      * El botón de WhatsApp abre directamente una conversación con mensaje preconfigurado.
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import useAuth from '@/hooks/useAuth';
import apiClient from '@/services/api';
import { ReportType, ReportStatus } from '@/types';
import { formatSpecies, formatSex, formatSize, formatImageUrl } from '@/utils/formatters';

// ---------------------------------------------------------------------------
// Interfaz interna para el detalle del reporte
// ---------------------------------------------------------------------------

interface DetailedReport {
  id: string;
  type: ReportType;
  status: ReportStatus;
  petName: string;
  species: string;
  breed: string;
  color: string;
  sex: string;
  size: string;
  distinctFeatures: string;
  region: string;
  comuna: string;
  address: string;
  phone: string;
  authorName: string;
  authorEmail?: string;
  authorAvatar?: string;
  images: string[];
  createdAt: string;
}


// ---------------------------------------------------------------------------
// Datos de respaldo / Mock por si se accede a un ID local de demostración
// ---------------------------------------------------------------------------

const MOCK_DETAILED_REPORTS: Record<string, DetailedReport> = {
  '1': {
    id: '1',
    type: ReportType.LOST,
    status: ReportStatus.ACTIVE,
    petName: 'Max',
    species: 'Perro',
    breed: 'Golden Retriever',
    color: 'Dorado / Rubio',
    sex: 'Macho',
    size: 'Grande',
    distinctFeatures: 'Tiene un collar rojo con placa y una pequeña cicatriz en la pata delantera izquierda.',
    region: 'Región Metropolitana',
    comuna: 'Providencia',
    address: 'Plaza Las Lilas, cerca de Av. Eliodoro Yáñez 1234',
    phone: '+56991234567',
    authorName: 'Camila Morales',
    authorEmail: 'camila.morales@example.com',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    images: [
      'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&q=80',
      'https://images.unsplash.com/photo-1552053831-71594a27632d?w=800&q=80',
    ],
    createdAt: '18 de julio de 2026',
  },
  '2': {
    id: '2',
    type: ReportType.ADOPTION,
    status: ReportStatus.ACTIVE,
    petName: 'Luna',
    species: 'Gata',
    breed: 'Mestizo',
    color: 'Naranja atigrado',
    sex: 'Hembra',
    size: 'Pequeño',
    distinctFeatures: 'Gatita rescatada, desparasitada y juguetona. Acostumbrada a vivir en departamento.',
    region: 'Región Metropolitana',
    comuna: 'Ñuñoa',
    address: 'Av. Irarrázaval 3100, dpto 402',
    phone: '+56987654321',
    authorName: 'Carlos Silva',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    images: [
      'https://images.unsplash.com/photo-1495360010541-f48722b34f7d?w=800&q=80',
    ],
    createdAt: '17 de julio de 2026',
  },
};

// ---------------------------------------------------------------------------
// Componente Principal
// ---------------------------------------------------------------------------

const ReportDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [report, setReport] = useState<DetailedReport | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const fetchReportDetail = async () => {
      if (!id) return;
      setIsLoading(true);
      setErrorMsg(null);

      try {
        // Intentar obtener desde backend API
        const res = await apiClient.get(`/reports/${id}`);
        if (res.data && res.data.success && res.data.data) {
          const raw = res.data.data;
          const formatted: DetailedReport = {
            id: raw._id || raw.id,
            type: raw.type || ReportType.LOST,
            status: raw.status || ReportStatus.ACTIVE,
            petName: raw.animalInfo?.name || raw.petName || 'Sin Nombre',
            species: formatSpecies(raw.animalInfo?.species || raw.species),
            breed: raw.animalInfo?.breed || raw.breed || 'Mestizo',
            color: raw.animalInfo?.color || raw.color || 'No especificado',
            sex: formatSex(raw.animalInfo?.sex || raw.sex),
            size: formatSize(raw.animalInfo?.size || raw.size),
            distinctFeatures: raw.animalInfo?.distinctFeatures || raw.distinctFeatures || raw.additionalInfo || 'Sin características adicionales registradas.',
            region: typeof raw.location === 'object' ? raw.location?.region || '' : '',
            comuna: typeof raw.location === 'object' ? raw.location?.comuna || '' : '',
            address: typeof raw.location === 'object' ? raw.location?.address || '' : String(raw.location || ''),
            phone: raw.contact?.phone || raw.phone || 'No especificado',
            authorName: raw.author?.name || 'Usuario registrado',
            authorEmail: raw.author?.email,
            authorAvatar: formatImageUrl(raw.author?.avatarUrl),
            images: Array.isArray(raw.images) && raw.images.length > 0
              ? raw.images.map((img: string) => formatImageUrl(img))
              : [formatImageUrl(raw.image, 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&q=80')],
            createdAt: raw.createdAt
              ? new Date(raw.createdAt).toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' })
              : 'Fecha reciente',
          };
          setReport(formatted);
          setIsLoading(false);
          return;
        }
      } catch {
        // Si falla la API (ej: ID mock local o sin conexión), verificar datos mock
        if (id && MOCK_DETAILED_REPORTS[id]) {
          setReport(MOCK_DETAILED_REPORTS[id]);
          setIsLoading(false);
          return;
        }
      }

      // Si no se encuentra en la API ni en los mocks
      setErrorMsg('No se pudo encontrar el reporte solicitado.');
      setIsLoading(false);
    };

    fetchReportDetail();
  }, [id]);

  // ── Helper para ofuscar teléfono ──
  const getObfuscatedPhone = (phoneStr: string) => {
    if (!phoneStr) return '+56 9 •••• ••••';
    const clean = phoneStr.replace(/\s+/g, '');
    if (clean.length > 6) {
      return `${clean.slice(0, 4)} •••• ${clean.slice(-4)}`;
    }
    return '+56 9 •••• ••••';
  };

  // ── Helper para armar link de WhatsApp ──
  const buildWhatsAppLink = (phoneStr: string, reportObj: DetailedReport) => {
    const cleanNumber = phoneStr.replace(/[^0-9]/g, '');
    const typeLabel =
      reportObj.type === ReportType.LOST
        ? 'PERDIDA'
        : reportObj.type === ReportType.FOUND
        ? 'ENCONTRADA'
        : 'EN ADOPCIÓN';

    const textMessage = `¡Hola ${reportObj.authorName}! Te escribo por tu reporte de la mascota ${reportObj.petName} (${typeLabel}) que vi en Patitas del Valle.`;

    return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(textMessage)}`;
  };

  // Badges de tipo
  const getTypeBadge = (type: ReportType) => {
    switch (type) {
      case ReportType.LOST:
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-baby_pink-300 text-white shadow-sm flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            Mascota Perdida
          </span>
        );
      case ReportType.FOUND:
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-sky_blue-400 text-white shadow-sm flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-white" />
            Mascota Encontrada
          </span>
        );
      case ReportType.ADOPTION:
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-thistle-400 text-white shadow-sm flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-white" />
            En Adopción
          </span>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-thistle-900 flex flex-col items-center justify-center p-6 space-y-4">
        <div className="w-12 h-12 border-4 border-baby_pink-400 border-t-transparent rounded-full animate-spin" />
        <p className="text-thistle-200 font-medium text-sm">Cargando información del reporte...</p>
      </div>
    );
  }

  if (errorMsg || !report) {
    return (
      <div className="min-h-screen bg-thistle-900 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-thistle-800 text-thistle-300 flex items-center justify-center text-3xl mb-4">
          🐾
        </div>
        <h2 className="text-xl font-bold text-thistle-100 mb-2">Reporte no disponible</h2>
        <p className="text-sm text-thistle-300 max-w-md mb-6">{errorMsg || 'El reporte no existe o fue eliminado.'}</p>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-baby_pink-400 to-pastel_petal-400 text-white font-bold text-sm shadow-md"
        >
          Volver a Inicio
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-thistle-900 via-thistle-900 to-icy_blue-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* ── BOTÓN NAVEGACIÓN ATRÁS Y EDITAR ── */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-sm font-semibold text-thistle-300 hover:text-white transition-colors cursor-pointer py-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Volver
          </button>

          {isAuthenticated && (
            <button
              onClick={() => navigate(`/reportes/${report.id}/editar`)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-baby_pink-400 to-pastel_petal-400 text-white font-bold text-xs shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer min-h-[40px]"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              Editar este Reporte
            </button>
          )}
        </div>

        {/* ── GRID PRINCIPAL: FOTOS Y DETALLES ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* COLUMNA IZQUIERDA: GALERÍA DE IMÁGENES & DETALLES DE LA MASCOTA */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Contenedor de Galería */}
            <div className="bg-white rounded-3xl overflow-hidden shadow-xl border border-thistle-700/60">
              
              {/* Imagen principal activa */}
              <div className="relative h-72 sm:h-96 w-full bg-thistle-950 overflow-hidden">
                <img
                  src={report.images[activeImageIndex]}
                  alt={report.petName}
                  className="w-full h-full object-cover"
                />
                
                {/* Badge flotante de estado / tipo */}
                <div className="absolute top-4 left-4">
                  {getTypeBadge(report.type)}
                </div>
              </div>

              {/* Miniaturas de la galería (si hay más de 1 imagen) */}
              {report.images.length > 1 && (
                <div className="p-4 bg-thistle-950/30 flex items-center gap-3 overflow-x-auto border-t border-thistle-800">
                  {report.images.map((imgUrl, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                        activeImageIndex === idx
                          ? 'border-baby_pink-400 scale-105 shadow-md'
                          : 'border-thistle-700 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={imgUrl} alt={`Foto ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Ficha de Detalles de la Mascota */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-thistle-700/60 space-y-6">
              
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-baby_pink-400">
                  Ficha de reporte · {report.createdAt}
                </span>
                <h1 className="text-3xl font-black text-thistle-100 mt-1">
                  {report.petName}
                </h1>
              </div>

              {/* Grid de Atributos Clave */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
                <div className="bg-thistle-950/40 p-3.5 rounded-2xl border border-thistle-800">
                  <p className="text-[11px] font-bold text-thistle-400 uppercase">Especie</p>
                  <p className="text-sm font-bold text-thistle-100 mt-0.5">{report.species}</p>
                </div>

                <div className="bg-thistle-950/40 p-3.5 rounded-2xl border border-thistle-800">
                  <p className="text-[11px] font-bold text-thistle-400 uppercase">Raza</p>
                  <p className="text-sm font-bold text-thistle-100 mt-0.5">{report.breed}</p>
                </div>

                <div className="bg-thistle-950/40 p-3.5 rounded-2xl border border-thistle-800">
                  <p className="text-[11px] font-bold text-thistle-400 uppercase">Color</p>
                  <p className="text-sm font-bold text-thistle-100 mt-0.5">{report.color}</p>
                </div>

                <div className="bg-thistle-950/40 p-3.5 rounded-2xl border border-thistle-800">
                  <p className="text-[11px] font-bold text-thistle-400 uppercase">Sexo</p>
                  <p className="text-sm font-bold text-thistle-100 mt-0.5">{report.sex}</p>
                </div>

                <div className="bg-thistle-950/40 p-3.5 rounded-2xl border border-thistle-800">
                  <p className="text-[11px] font-bold text-thistle-400 uppercase">Tamaño</p>
                  <p className="text-sm font-bold text-thistle-100 mt-0.5">{report.size}</p>
                </div>

                <div className="bg-thistle-950/40 p-3.5 rounded-2xl border border-thistle-800">
                  <p className="text-[11px] font-bold text-thistle-400 uppercase">Estado</p>
                  <p className="text-sm font-bold text-thistle-100 mt-0.5">
                    {report.status === ReportStatus.ACTIVE ? 'Publicado / Activo' : 'En proceso'}
                  </p>
                </div>
              </div>

              {/* Características Distintivas */}
              <div className="space-y-2 pt-2 border-t border-thistle-800">
                <h3 className="text-sm font-bold text-thistle-200">Características Distintivas y Notas</h3>
                <p className="text-sm text-thistle-300 leading-relaxed bg-thistle-950/20 p-4 rounded-2xl border border-thistle-800/60">
                  {report.distinctFeatures}
                </p>
              </div>

            </div>
          </div>

          {/* COLUMNA DERECHA: UBICACIÓN, CONTACTO Y BOTÓN WHATSAPP (CON REGLA DE OFUSCADO) */}
          <div className="lg:col-span-5 space-y-6 sticky top-20">

            {/* TARJETA DE UBICACIÓN Y DIRECCIÓN (OFUSCADA SI NO ESTÁ AUTENTICADO) */}
            <div className="bg-white rounded-3xl p-6 shadow-xl border border-thistle-700/60 space-y-4">
              <div className="flex items-center gap-2 text-baby_pink-400 font-bold text-sm">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Ubicación del reporte
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-xs font-bold text-thistle-400 uppercase">Comuna y Región</p>
                  <p className="text-base font-bold text-thistle-100">
                    {report.comuna ? `${report.comuna}, ${report.region}` : report.region || 'Chile'}
                  </p>
                </div>

                {/* Dirección Exacta */}
                <div className="pt-2 border-t border-thistle-800">
                  <p className="text-xs font-bold text-thistle-400 uppercase mb-1">Dirección Exacta / Sector</p>
                  
                  {isAuthenticated ? (
                    <p className="text-sm font-semibold text-thistle-100 bg-thistle-950/40 p-3 rounded-xl border border-thistle-800">
                      📍 {report.address || 'Sin dirección específica.'}
                    </p>
                  ) : (
                    <div className="bg-thistle-950/60 border border-baby_pink-500/40 p-3.5 rounded-2xl space-y-2">
                      <p className="text-sm font-mono text-thistle-400 select-none">
                        📍 ••••••••••••••••••••••••••••••
                      </p>
                      <p className="text-xs text-baby_pink-300 font-medium leading-tight">
                        🔒 La dirección exacta está oculta para proteger la seguridad.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* TARJETA DE CONTACTO Y WHATSAPP */}
            <div className="bg-white rounded-3xl p-6 shadow-xl border border-thistle-700/60 space-y-5">
              
              <div className="flex items-center gap-3">
                {report.authorAvatar ? (
                  <img
                    src={report.authorAvatar}
                    alt={report.authorName}
                    className="w-12 h-12 rounded-2xl object-cover border-2 border-thistle-500"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-baby_pink-400 to-thistle-400 text-white font-bold text-lg flex items-center justify-center shadow-md">
                    {report.authorName.charAt(0)}
                  </div>
                )}

                <div>
                  <h3 className="font-bold text-thistle-100 text-base">{report.authorName}</h3>
                  <p className="text-xs text-thistle-400 font-medium">Publicante verificado</p>
                </div>
              </div>

              {/* Teléfono y estado de ofuscación */}
              <div className="space-y-1.5 pt-2 border-t border-thistle-800">
                <p className="text-xs font-bold text-thistle-400 uppercase">Teléfono de Contacto</p>
                {isAuthenticated ? (
                  <p className="text-base font-bold text-thistle-100 tracking-wide">
                    📞 {report.phone}
                  </p>
                ) : (
                  <p className="text-base font-bold text-thistle-400 tracking-wider font-mono">
                    📞 {getObfuscatedPhone(report.phone)}
                  </p>
                )}
              </div>

              {/* ACCIONES / BOTÓN DE WHATSAPP */}
              {isAuthenticated ? (
                <a
                  href={buildWhatsAppLink(report.phone, report)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg hover:shadow-emerald-600/30 transition-all duration-200 min-h-[44px] flex items-center justify-center gap-2 cursor-pointer"
                >
                  {/* Icono de WhatsApp */}
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-1.15 4.201 4.293-1.127z"/>
                  </svg>
                  Contactar por WhatsApp
                </a>
              ) : (
                <div className="space-y-3">
                  <button
                    onClick={() => navigate('/login')}
                    className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-baby_pink-400 to-pastel_petal-400 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all duration-200 min-h-[44px] flex items-center justify-center gap-2 cursor-pointer"
                  >
                    💬 Inicia sesión para contactar por WhatsApp
                  </button>

                  {/* Banner explicativo de Ofuscado */}
                  <div className="bg-thistle-950/80 border border-thistle-700/80 p-4 rounded-2xl space-y-2 text-center">
                    <p className="text-xs font-semibold text-thistle-200">
                      🔒 ¿Quieres ver la dirección y contactar por WhatsApp?
                    </p>
                    <p className="text-[11px] text-thistle-400">
                      Para proteger la privacidad de los usuarios, la información de contacto completa solo está disponible para usuarios con sesión iniciada.
                    </p>
                    <div className="flex items-center justify-center gap-3 pt-1 text-xs font-bold">
                      <Link to="/registro" className="text-baby_pink-400 hover:underline">
                        Crear cuenta gratis
                      </Link>
                      <span className="text-thistle-600">•</span>
                      <Link to="/login" className="text-sky_blue-400 hover:underline">
                        Iniciar sesión
                      </Link>
                    </div>
                  </div>
                </div>
              )}

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default ReportDetailPage;

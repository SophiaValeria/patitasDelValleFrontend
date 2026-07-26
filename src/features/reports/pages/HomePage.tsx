/**
 * @file features/reports/pages/HomePage.tsx
 * @description Página principal de Patitas del Valle.
 *
 * Secciones:
 *  1. Hero — título, subtítulo y 3 botones de categoría (Perdidas / Adopción / Encontradas)
 *  2. Grid de 6 tarjetas de últimos reportes (2 por tipo, ordenadas por fecha)
 *  3. CTA de reporte flotante
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ReportType } from '@/types';
import apiClient from '@/services/api';
import ReportCard, { normalizeReport, type ReportCardData } from '../components/ReportCard';

// ---------------------------------------------------------------------------
// 6 tarjetas de respaldo: 2 por tipo (LOST, ADOPTION, FOUND), las más recientes
// ---------------------------------------------------------------------------

const RECENT_MOCK_REPORTS: ReportCardData[] = [
  // ── Perdidas
  {
    id: '1',
    type: ReportType.LOST,
    petName: 'Max',
    species: 'Perro',
    breed: 'Golden Retriever',
    location: 'Providencia, Metropolitana',
    date: '18 jul 2026',
    image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&q=80',
    color: 'Dorado',
  },
  {
    id: '5',
    type: ReportType.LOST,
    petName: 'Nala',
    species: 'Gata',
    breed: 'Mestizo',
    location: 'Quilicura, Metropolitana',
    date: '14 jul 2026',
    image: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400&q=80',
    color: 'Gris',
  },
  // ── Adopción
  {
    id: '2',
    type: ReportType.ADOPTION,
    petName: 'Luna',
    species: 'Gata',
    breed: 'Mestizo',
    location: 'Ñuñoa, Metropolitana',
    date: '17 jul 2026',
    image: 'https://images.unsplash.com/photo-1495360010541-f48722b34f7d?w=400&q=80',
    color: 'Naranja',
  },
  {
    id: '4',
    type: ReportType.ADOPTION,
    petName: 'Simba',
    species: 'Gato',
    breed: 'Mestizo',
    location: 'Maipú, Metropolitana',
    date: '15 jul 2026',
    image: 'https://images.unsplash.com/photo-1533743983669-94fa5c4338ec?w=400&q=80',
    color: 'Atigrado',
  },
  // ── Encontradas
  {
    id: '3',
    type: ReportType.FOUND,
    petName: 'Sin nombre',
    species: 'Perro',
    breed: 'Mestizo',
    location: 'Las Condes, Metropolitana',
    date: '16 jul 2026',
    image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&q=80',
    color: 'Blanco y negro',
  },
  {
    id: '6',
    type: ReportType.FOUND,
    petName: 'Sin nombre',
    species: 'Gata',
    breed: 'Mestizo',
    location: 'Peñalolén, Metropolitana',
    date: '13 jul 2026',
    image: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=400&q=80',
    color: 'Negra',
  },
];

// ---------------------------------------------------------------------------
// Componente principal
// ---------------------------------------------------------------------------

const HomePage = () => {
  const navigate = useNavigate();
  const [heroSearch, setHeroSearch] = useState('');
  const [recentReports, setRecentReports] = useState<ReportCardData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchRecentReports = async () => {
      setIsLoading(true);
      try {
        // Consultar 2 reportes activos de cada tipo (el endpoint GET /reports filtra estrictamente status: ACTIVE)
        const [resLost, resAdoption, resFound] = await Promise.all([
          apiClient.get('/reports', { params: { type: ReportType.LOST, limit: 2 } }),
          apiClient.get('/reports', { params: { type: ReportType.ADOPTION, limit: 2 } }),
          apiClient.get('/reports', { params: { type: ReportType.FOUND, limit: 2 } }),
        ]);

        const getItemsForType = (apiResponseData: any[], type: ReportType) => {
          const normalized = (apiResponseData || []).map(normalizeReport);
          if (normalized.length >= 2) return normalized.slice(0, 2);
          const mocksForType = RECENT_MOCK_REPORTS.filter((r) => r.type === type);
          return [...normalized, ...mocksForType].slice(0, 2);
        };

        const lostList = getItemsForType(resLost.data?.data, ReportType.LOST);
        const adoptionList = getItemsForType(resAdoption.data?.data, ReportType.ADOPTION);
        const foundList = getItemsForType(resFound.data?.data, ReportType.FOUND);

        setRecentReports([...lostList, ...adoptionList, ...foundList]);
      } catch (error) {
        console.error('Error al consultar últimos reportes:', error);
        setRecentReports(RECENT_MOCK_REPORTS);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecentReports();
  }, []);

  const categoryButtons = [
    {
      type: ReportType.LOST,
      label: 'Mascotas Perdidas',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
      btnClass: 'bg-white text-baby_pink-300 border-baby_pink-400 hover:bg-baby_pink-300 hover:text-white hover:border-baby_pink-300 hover:shadow-lg hover:shadow-baby_pink-400/30',
    },
    {
      type: ReportType.ADOPTION,
      label: 'En Adopción',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      btnClass: 'bg-white text-thistle-300 border-thistle-400 hover:bg-thistle-400 hover:text-white hover:border-thistle-400 hover:shadow-lg hover:shadow-thistle-400/30',
    },
    {
      type: ReportType.FOUND,
      label: 'Encontradas',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      btnClass: 'bg-white text-sky_blue-300 border-sky_blue-400 hover:bg-sky_blue-400 hover:text-white hover:border-sky_blue-400 hover:shadow-lg hover:shadow-sky_blue-400/30',
    },
  ];

  return (
    <>
      {/* ================================================================ */}
      {/* HERO                                                              */}
      {/* ================================================================ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-thistle-800 via-baby_pink-900 to-icy_blue-900 pt-16 pb-20 px-4">
        {/* Decorative blobs */}
        <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-thistle-700 opacity-40 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -right-10 w-80 h-80 rounded-full bg-baby_pink-800 opacity-30 blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-icy_blue-800 opacity-20 blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-4 py-1.5 mb-6 text-sm font-medium text-thistle-100">
            🐾 Plataforma de mascotas en Chile
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-4">
            Reunimos mascotas con{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-baby_pink-400 to-pastel_petal-400">
              sus familias
            </span>
          </h1>

          <p className="text-thistle-600 text-base sm:text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
            Reporta una mascota perdida, encontrada o publica una en adopción.
            Juntos construimos la red de ayuda animal más grande de Chile.
          </p>

          {/* Botones de categoría — navegan a /reportes?type=... */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {categoryButtons.map((btn) => (
              <button
                key={btn.type}
                onClick={() => navigate(`/reportes?type=${btn.type}`)}
                className={`
                  flex items-center gap-2 px-5 py-3 rounded-2xl font-semibold text-sm border-2
                  transition-all duration-200 cursor-pointer min-h-[44px]
                  ${btn.btnClass}
                `}
              >
                {btn.icon}
                {btn.label}
              </button>
            ))}
          </div>

          {/* Barra de búsqueda */}
          <div className="relative max-w-2xl mx-auto">
            <div className="flex items-center bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-white/50 focus-within:border-baby_pink-400 transition-colors duration-200">
              <div className="pl-4 text-thistle-500 shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                id="search-input"
                type="text"
                value={heroSearch}
                onChange={(e) => setHeroSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && heroSearch.trim()) {
                    navigate(`/reportes?search=${encodeURIComponent(heroSearch.trim())}`);
                  }
                }}
                placeholder="Busca por nombre, especie, sector…"
                className="flex-1 px-4 py-4 text-sm text-thistle-100 placeholder-thistle-500 bg-transparent outline-none"
              />
              <button
                onClick={() => {
                  if (heroSearch.trim()) {
                    navigate(`/reportes?search=${encodeURIComponent(heroSearch.trim())}`);
                  } else {
                    navigate('/reportes');
                  }
                }}
                className="m-2 px-5 py-2.5 bg-gradient-to-r from-baby_pink-400 to-pastel_petal-400 text-white font-semibold rounded-xl text-sm hover:from-baby_pink-300 hover:to-pastel_petal-300 transition-all duration-200 cursor-pointer min-h-[44px]"
              >
                Buscar
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* ÚLTIMOS REPORTES (6 tarjetas: 2 por tipo)                         */}
      {/* ================================================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* ── Encabezado de sección ── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
          <div>
            <h2 className="text-xl font-bold text-thistle-100">Últimos reportes</h2>
            <p className="text-sm text-thistle-500 mt-0.5">Los reportes más recientes de mascotas en Chile</p>
          </div>
          <button
            onClick={() => navigate('/reportes')}
            className="flex items-center gap-1.5 text-sm font-semibold text-thistle-300 hover:text-thistle-100 transition-colors cursor-pointer self-start sm:self-auto group"
          >
            Ver todos
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-150" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* ── Grid de 6 tarjetas ── */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden border border-thistle-700 animate-pulse h-64">
                <div className="h-40 bg-thistle-800" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-thistle-800 rounded-lg w-2/3" />
                  <div className="h-3 bg-thistle-800 rounded-lg w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {recentReports.map((report) => (
              <ReportCard key={report.id} report={report} compact />
            ))}
          </div>
        )}

        {/* ── Botón CTA centrado ── */}
        <div className="flex justify-center mt-8">
          <button
            onClick={() => navigate('/reportes')}
            className="flex items-center gap-2 px-7 py-3 rounded-2xl border-2 border-thistle-600 text-thistle-300 text-sm font-semibold hover:bg-thistle-800 hover:text-thistle-100 transition-all duration-200 cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
            Ver todos los reportes
          </button>
        </div>
      </section>

      {/* ================================================================ */}
      {/* CTA — Reportar mascota                                            */}
      {/* ================================================================ */}
      <section className="bg-gradient-to-r from-baby_pink-400 via-pastel_petal-400 to-thistle-400 py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="text-5xl mb-4">🐾</div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3 leading-tight">
            ¿Viste o perdiste una mascota?
          </h2>
          <p className="text-white/80 text-base mb-8 max-w-lg mx-auto">
            Cada reporte puede cambiar una historia. Publicar es gratis y toma menos de 2 minutos.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => navigate('/reportes/nuevo')}
              className="px-8 py-4 bg-white text-baby_pink-300 font-bold rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 cursor-pointer min-h-[44px] text-base"
            >
              + Reportar una mascota
            </button>
            <button
              onClick={() => navigate('/registro')}
              className="px-8 py-4 bg-white/20 border-2 border-white text-white font-bold rounded-2xl hover:bg-white/30 transition-all duration-200 cursor-pointer min-h-[44px] text-base backdrop-blur-sm"
            >
              Crear mi cuenta
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage;

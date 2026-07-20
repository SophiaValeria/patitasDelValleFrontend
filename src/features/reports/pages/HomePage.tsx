/**
 * @file features/reports/pages/HomePage.tsx
 * @description Página principal de Patitas del Valle.
 *
 * Secciones:
 *  1. Hero — título, subtítulo y 3 botones de categoría (Perdidas / Adopción / Encontradas)
 *  2. Barra de búsqueda + filtros colapsables (Región / Comuna / Tipo de mascota)
 *  3. Grid de tarjetas de reportes (datos mock)
 *  4. CTA de reporte flotante
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ReportType } from '@/types';

// ---------------------------------------------------------------------------
// Tipos locales
// ---------------------------------------------------------------------------

type ActiveFilter = ReportType | null;

interface MockReport {
  id: string;
  type: ReportType;
  petName: string;
  species: string;
  location: string;
  date: string;
  image: string;
  color: string;
}

// ---------------------------------------------------------------------------
// Datos mock
// ---------------------------------------------------------------------------

const MOCK_REPORTS: MockReport[] = [
  {
    id: '1',
    type: ReportType.LOST,
    petName: 'Max',
    species: 'Perro',
    location: 'Providencia, Santiago',
    date: '18 jul 2026',
    image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&q=80',
    color: 'Dorado',
  },
  {
    id: '2',
    type: ReportType.ADOPTION,
    petName: 'Luna',
    species: 'Gata',
    location: 'Ñuñoa, Santiago',
    date: '17 jul 2026',
    image: 'https://images.unsplash.com/photo-1495360010541-f48722b34f7d?w=400&q=80',
    color: 'Naranja',
  },
  {
    id: '3',
    type: ReportType.FOUND,
    petName: 'Sin nombre',
    species: 'Perro',
    location: 'Las Condes, Santiago',
    date: '16 jul 2026',
    image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&q=80',
    color: 'Blanco y negro',
  },
  {
    id: '4',
    type: ReportType.ADOPTION,
    petName: 'Simba',
    species: 'Gato',
    location: 'Maipú, Santiago',
    date: '15 jul 2026',
    image: 'https://images.unsplash.com/photo-1533743983669-94fa5c4338ec?w=400&q=80',
    color: 'Atigrado',
  },
  {
    id: '5',
    type: ReportType.LOST,
    petName: 'Coco',
    species: 'Perro',
    location: 'Vitacura, Santiago',
    date: '14 jul 2026',
    image: 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=400&q=80',
    color: 'Café',
  },
  {
    id: '6',
    type: ReportType.FOUND,
    petName: 'Sin nombre',
    species: 'Gata',
    location: 'Peñalolén, Santiago',
    date: '13 jul 2026',
    image: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=400&q=80',
    color: 'Negra',
  },
  {
    id: '7',
    type: ReportType.ADOPTION,
    petName: 'Mochi',
    species: 'Perro',
    location: 'La Florida, Santiago',
    date: '12 jul 2026',
    image: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400&q=80',
    color: 'Crema',
  },
  {
    id: '8',
    type: ReportType.LOST,
    petName: 'Nala',
    species: 'Gata',
    location: 'Quilicura, Santiago',
    date: '11 jul 2026',
    image: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400&q=80',
    color: 'Gris',
  },
];

// ---------------------------------------------------------------------------
// Helpers de presentación
// ---------------------------------------------------------------------------

const TYPE_CONFIG: Record<ReportType, { label: string; badge: string; badgeBg: string }> = {
  [ReportType.LOST]: {
    label: 'Perdida',
    badge: 'Perdida',
    badgeBg: 'bg-baby_pink-300 text-white',
  },
  [ReportType.FOUND]: {
    label: 'Encontrada',
    badge: 'Encontrada',
    badgeBg: 'bg-sky_blue-400 text-white',
  },
  [ReportType.ADOPTION]: {
    label: 'En adopción',
    badge: 'Adopción',
    badgeBg: 'bg-thistle-400 text-white',
  },
};

// ---------------------------------------------------------------------------
// Sub-componente: Tarjeta de reporte
// ---------------------------------------------------------------------------

const ReportCard = ({ report }: { report: MockReport }) => {
  const config = TYPE_CONFIG[report.type];
  return (
    <article className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer border border-thistle-700">
      <div className="relative h-48 overflow-hidden">
        <img
          src={report.image}
          alt={report.petName}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute top-3 left-3">
          <span className={`text-xs font-bold px-3 py-1 rounded-full ${config.badgeBg}`}>
            {config.badge}
          </span>
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-bold text-thistle-100 text-lg leading-tight">{report.petName}</h3>
          <span className="text-xs text-thistle-500 whitespace-nowrap">{report.date}</span>
        </div>
        <p className="text-sm text-thistle-400 mb-3">
          {report.species} · {report.color}
        </p>
        <div className="flex items-center gap-1 text-xs text-thistle-400">
          <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {report.location}
        </div>
      </div>
    </article>
  );
};

// ---------------------------------------------------------------------------
// Componente principal
// ---------------------------------------------------------------------------

const HomePage = () => {
  const navigate = useNavigate();

  // Estado de filtros
  const [activeType, setActiveType] = useState<ActiveFilter>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedComuna, setSelectedComuna] = useState('');
  const [selectedSpecies, setSelectedSpecies] = useState('');

  // Filtrado de reportes mock
  const filtered = MOCK_REPORTS.filter((r) => {
    const matchType = activeType ? r.type === activeType : true;
    const matchSearch =
      searchQuery === '' ||
      r.petName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.species.toLowerCase().includes(searchQuery.toLowerCase());
    const matchSpecies = selectedSpecies === '' || r.species === selectedSpecies;
    return matchType && matchSearch && matchSpecies;
  });

  const toggleSection = (name: string) => {
    setOpenSection((prev) => (prev === name ? null : name));
  };

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
      activeClass: 'bg-baby_pink-300 text-white shadow-lg shadow-baby_pink-400/30 border-baby_pink-300',
      inactiveClass: 'bg-white text-baby_pink-300 border-baby_pink-400 hover:bg-baby_pink-900',
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
      activeClass: 'bg-thistle-400 text-white shadow-lg shadow-thistle-400/30 border-thistle-400',
      inactiveClass: 'bg-white text-thistle-300 border-thistle-400 hover:bg-thistle-900',
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
      activeClass: 'bg-sky_blue-400 text-white shadow-lg shadow-sky_blue-400/30 border-sky_blue-400',
      inactiveClass: 'bg-white text-sky_blue-300 border-sky_blue-400 hover:bg-sky_blue-900',
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

          {/* Botones de categoría */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {categoryButtons.map((btn) => (
              <button
                key={btn.type}
                onClick={() => setActiveType(activeType === btn.type ? null : btn.type)}
                className={`
                  flex items-center gap-2 px-5 py-3 rounded-2xl font-semibold text-sm border-2
                  transition-all duration-200 cursor-pointer min-h-[44px]
                  ${activeType === btn.type ? btn.activeClass : btn.inactiveClass}
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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Busca por nombre, especie, sector…"
                className="flex-1 px-4 py-4 text-sm text-thistle-100 placeholder-thistle-500 bg-transparent outline-none"
              />
              <button
                onClick={() => {}}
                className="m-2 px-5 py-2.5 bg-gradient-to-r from-baby_pink-400 to-pastel_petal-400 text-white font-semibold rounded-xl text-sm hover:from-baby_pink-300 hover:to-pastel_petal-300 transition-all duration-200 cursor-pointer min-h-[44px]"
              >
                Buscar
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* FILTROS + GRID                                                    */}
      {/* ================================================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* ── Header de filtros ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-thistle-100">
              {activeType ? TYPE_CONFIG[activeType].label : 'Todos los reportes'}
            </h2>
            <p className="text-sm text-thistle-500 mt-0.5">
              {filtered.length} resultado{filtered.length !== 1 ? 's' : ''} encontrado{filtered.length !== 1 ? 's' : ''}
            </p>
          </div>
          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-thistle-600 text-thistle-300 text-sm font-medium hover:bg-thistle-800 transition-all duration-200 cursor-pointer min-h-[44px] self-start sm:self-auto"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filtros
            {(selectedRegion || selectedComuna || selectedSpecies) && (
              <span className="bg-baby_pink-400 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
                {[selectedRegion, selectedComuna, selectedSpecies].filter(Boolean).length}
              </span>
            )}
            <svg
              className={`w-4 h-4 transition-transform duration-200 ${filtersOpen ? 'rotate-180' : ''}`}
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {/* ── Panel de filtros colapsables ── */}
        {filtersOpen && (
          <div className="mb-6 bg-white rounded-2xl border border-thistle-700 overflow-hidden shadow-sm">

            {/* Región */}
            <div className="border-b border-thistle-800">
              <button
                onClick={() => toggleSection('region')}
                className="w-full flex items-center justify-between px-5 py-4 text-sm font-semibold text-thistle-200 hover:bg-thistle-900 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-thistle-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
                  </svg>
                  Región
                  {selectedRegion && <span className="text-baby_pink-400 font-normal">· {selectedRegion}</span>}
                </div>
                <svg className={`w-4 h-4 transition-transform duration-200 ${openSection === 'region' ? 'rotate-180' : ''}`}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openSection === 'region' && (
                <div className="px-5 pb-4">
                  <select
                    id="filter-region"
                    value={selectedRegion}
                    onChange={(e) => { setSelectedRegion(e.target.value); setSelectedComuna(''); }}
                    className="w-full sm:w-72 px-3 py-2.5 rounded-xl border border-thistle-600 text-sm text-thistle-200 bg-thistle-900 outline-none focus:border-baby_pink-400 transition-colors cursor-pointer"
                  >
                    <option value="">Todas las regiones</option>
                    <option value="Metropolitana">Región Metropolitana</option>
                    <option value="Valparaíso">Valparaíso</option>
                    <option value="Biobío">Biobío</option>
                    <option value="La Araucanía">La Araucanía</option>
                    <option value="Los Lagos">Los Lagos</option>
                    <option value="Coquimbo">Coquimbo</option>
                    <option value="Maule">Maule</option>
                  </select>
                </div>
              )}
            </div>

            {/* Comuna */}
            <div className="border-b border-thistle-800">
              <button
                onClick={() => toggleSection('comuna')}
                className="w-full flex items-center justify-between px-5 py-4 text-sm font-semibold text-thistle-200 hover:bg-thistle-900 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-thistle-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Comuna
                  {selectedComuna && <span className="text-baby_pink-400 font-normal">· {selectedComuna}</span>}
                </div>
                <svg className={`w-4 h-4 transition-transform duration-200 ${openSection === 'comuna' ? 'rotate-180' : ''}`}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openSection === 'comuna' && (
                <div className="px-5 pb-4">
                  <select
                    id="filter-comuna"
                    value={selectedComuna}
                    onChange={(e) => setSelectedComuna(e.target.value)}
                    className="w-full sm:w-72 px-3 py-2.5 rounded-xl border border-thistle-600 text-sm text-thistle-200 bg-thistle-900 outline-none focus:border-baby_pink-400 transition-colors cursor-pointer"
                  >
                    <option value="">Todas las comunas</option>
                    {selectedRegion === 'Metropolitana' || selectedRegion === '' ? (
                      <>
                        <option value="Providencia">Providencia</option>
                        <option value="Ñuñoa">Ñuñoa</option>
                        <option value="Las Condes">Las Condes</option>
                        <option value="Vitacura">Vitacura</option>
                        <option value="Maipú">Maipú</option>
                        <option value="La Florida">La Florida</option>
                        <option value="Peñalolén">Peñalolén</option>
                        <option value="Quilicura">Quilicura</option>
                        <option value="Santiago Centro">Santiago Centro</option>
                      </>
                    ) : (
                      <option value="">Sin comunas disponibles</option>
                    )}
                  </select>
                </div>
              )}
            </div>

            {/* Tipo de mascota */}
            <div>
              <button
                onClick={() => toggleSection('especie')}
                className="w-full flex items-center justify-between px-5 py-4 text-sm font-semibold text-thistle-200 hover:bg-thistle-900 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-thistle-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  Tipo de mascota
                  {selectedSpecies && <span className="text-baby_pink-400 font-normal">· {selectedSpecies}</span>}
                </div>
                <svg className={`w-4 h-4 transition-transform duration-200 ${openSection === 'especie' ? 'rotate-180' : ''}`}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openSection === 'especie' && (
                <div className="px-5 pb-4 flex flex-wrap gap-2">
                  {['Perro', 'Gato', 'Ave', 'Conejo', 'Otro'].map((sp) => (
                    <button
                      key={sp}
                      onClick={() => setSelectedSpecies(selectedSpecies === sp ? '' : sp)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium border-2 transition-all duration-200 cursor-pointer min-h-[44px] ${
                        selectedSpecies === sp
                          ? 'bg-thistle-400 text-white border-thistle-400'
                          : 'bg-white text-thistle-300 border-thistle-600 hover:bg-thistle-900'
                      }`}
                    >
                      {sp === 'Perro' ? '🐶' : sp === 'Gato' ? '🐱' : sp === 'Ave' ? '🐦' : sp === 'Conejo' ? '🐰' : '🐾'} {sp}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Grid de tarjetas ── */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((report) => (
              <ReportCard key={report.id} report={report} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="text-6xl mb-4">🐾</div>
            <h3 className="text-lg font-bold text-thistle-200 mb-2">No encontramos resultados</h3>
            <p className="text-sm text-thistle-500 max-w-xs">
              Prueba con otros filtros o sé el primero en reportar una mascota en esta zona.
            </p>
          </div>
        )}
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

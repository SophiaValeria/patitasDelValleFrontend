/**
 * @file features/reports/pages/ReportListPage.tsx
 * @description Vista de listado de reportes filtrada por categoría.
 *
 * Accedida desde:
 *  - /reportes                  → todos los reportes
 *  - /reportes?type=LOST        → mascotas perdidas
 *  - /reportes?type=ADOPTION    → en adopción
 *  - /reportes?type=FOUND       → encontradas
 *
 * Layout:
 *  - Header contextual con título dinámico y breadcrumb
 *  - Barra de búsqueda + botón de filtros (mobile)
 *  - Sidebar de filtros (desktop) / Drawer (mobile)
 *  - Grid de tarjetas con paginación
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ReportType } from '@/types';
import { useReportFilters } from '../hooks/useReportFilters';
import ReportCard from '../components/ReportCard';
import ReportFiltersPanel from '../components/ReportFiltersPanel';
import { REPORT_TYPE_CONFIG } from '../components/ReportCard';

// ---------------------------------------------------------------------------
// Config de encabezados por tipo
// ---------------------------------------------------------------------------

const TYPE_HEADER: Record<
  ReportType,
  { emoji: string; title: string; subtitle: string; gradient: string; badgeClass: string }
> = {
  [ReportType.LOST]: {
    emoji: '🔍',
    title: 'Mascotas Perdidas',
    subtitle: 'Ayuda a encontrar a estas mascotas que buscan volver a casa.',
    gradient: 'from-baby_pink-200 via-baby_pink-300 to-pastel_petal-300',
    badgeClass: 'bg-baby_pink-300 text-white',
  },
  [ReportType.ADOPTION]: {
    emoji: '💜',
    title: 'Mascotas en Adopción',
    subtitle: 'Estas mascotas buscan un hogar lleno de amor para siempre.',
    gradient: 'from-thistle-200 via-thistle-300 to-thistle-400',
    badgeClass: 'bg-thistle-400 text-white',
  },
  [ReportType.FOUND]: {
    emoji: '✅',
    title: 'Mascotas Encontradas',
    subtitle: 'Alguien encontró a estas mascotas. ¿Reconoces a alguna?',
    gradient: 'from-sky_blue-200 via-sky_blue-300 to-icy_blue-300',
    badgeClass: 'bg-sky_blue-400 text-white',
  },
};

const DEFAULT_HEADER = {
  emoji: '🐾',
  title: 'Todos los Reportes',
  subtitle: 'Explora todos los reportes de mascotas perdidas, encontradas y en adopción.',
  gradient: 'from-thistle-200 via-baby_pink-300 to-sky_blue-300',
  badgeClass: 'bg-thistle-400 text-white',
};

// ---------------------------------------------------------------------------
// Subcomponente: Paginación
// ---------------------------------------------------------------------------

const Pagination = ({
  page,
  totalPages,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  onPageChange: (p: number) => void;
}) => {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
    if (totalPages <= 7) return i + 1;
    if (page <= 4) return i + 1;
    if (page >= totalPages - 3) return totalPages - 6 + i;
    return page - 3 + i;
  });

  return (
    <div className="flex items-center justify-center gap-1 mt-10">
      <button
        type="button"
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
        className="p-2.5 rounded-xl border border-thistle-600 text-thistle-400 hover:bg-thistle-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {pages.map((p) => (
        <button
          key={p}
          type="button"
          onClick={() => onPageChange(p)}
          className={`w-10 h-10 rounded-xl text-sm font-semibold transition-all duration-150 cursor-pointer ${
            p === page
              ? 'bg-gradient-to-br from-baby_pink-400 to-pastel_petal-300 text-white shadow-md'
              : 'text-thistle-300 hover:bg-thistle-800 border border-thistle-700'
          }`}
        >
          {p}
        </button>
      ))}

      <button
        type="button"
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
        className="p-2.5 rounded-xl border border-thistle-600 text-thistle-400 hover:bg-thistle-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Subcomponente: Estado vacío
// ---------------------------------------------------------------------------

const EmptyState = ({ onReset }: { onReset: () => void }) => (
  <div className="flex flex-col items-center justify-center py-24 text-center px-4">
    <div className="text-7xl mb-5">🐾</div>
    <h3 className="text-xl font-bold text-thistle-100 mb-2">Sin resultados</h3>
    <p className="text-sm text-thistle-400 max-w-xs mb-6">
      No encontramos reportes con los filtros seleccionados. Intenta con otra combinación.
    </p>
    <button
      type="button"
      onClick={onReset}
      className="px-6 py-3 bg-gradient-to-r from-baby_pink-400 to-pastel_petal-300 text-white rounded-xl font-semibold text-sm hover:from-baby_pink-300 hover:to-pastel_petal-200 transition-all duration-200 shadow-md cursor-pointer"
    >
      Limpiar filtros
    </button>
  </div>
);

// ---------------------------------------------------------------------------
// Skeleton de carga
// ---------------------------------------------------------------------------

const ReportSkeleton = () => (
  <div className="bg-white rounded-2xl overflow-hidden border border-thistle-700 animate-pulse">
    <div className="h-52 bg-thistle-800" />
    <div className="p-4 space-y-3">
      <div className="h-4 bg-thistle-800 rounded-lg w-2/3" />
      <div className="h-3 bg-thistle-800 rounded-lg w-1/2" />
      <div className="h-3 bg-thistle-800 rounded-lg w-3/4" />
    </div>
  </div>
);

// ---------------------------------------------------------------------------
// Componente principal: ReportListPage
// ---------------------------------------------------------------------------

const ReportListPage = () => {
  const navigate = useNavigate();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const {
    filters,
    setFilter,
    resetFilters,
    reports,
    isLoading,
    totalResults,
    totalPages,
    activeFilterCount,
  } = useReportFilters();

  const activeType = filters.type as ReportType | '';
  const header = activeType ? TYPE_HEADER[activeType] : DEFAULT_HEADER;

  // Tabs de tipo
  const typeTabs = [
    { type: '' as const, label: 'Todos', emoji: '🐾' },
    { type: ReportType.LOST, label: 'Perdidas', emoji: '🔍' },
    { type: ReportType.ADOPTION, label: 'Adopción', emoji: '💜' },
    { type: ReportType.FOUND, label: 'Encontradas', emoji: '✅' },
  ];

  return (
    <div className="min-h-screen bg-thistle-900">
      {/* ================================================================ */}
      {/* HEADER CONTEXTUAL                                                 */}
      {/* ================================================================ */}
      <section
        className={`relative overflow-hidden bg-gradient-to-br ${header.gradient} py-10 px-4`}
      >
        {/* Blobs decorativos */}
        <div className="absolute -top-16 -left-16 w-64 h-64 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -right-10 w-64 h-64 rounded-full bg-white/10 blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-white/70 mb-4" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-white transition-colors font-medium">
              Inicio
            </Link>
            <span>/</span>
            <span className="text-white font-semibold">Reportes</span>
            {activeType && (
              <>
                <span>/</span>
                <span className="text-white font-semibold">{REPORT_TYPE_CONFIG[activeType].label}</span>
              </>
            )}
          </nav>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className="text-3xl">{header.emoji}</span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{header.title}</h1>
              </div>
              <p className="text-white/80 text-sm max-w-xl">{header.subtitle}</p>
            </div>

            {/* Botón reportar */}
            <button
              type="button"
              onClick={() => navigate('/reportes/nuevo')}
              className="shrink-0 flex items-center gap-2 px-5 py-3 bg-white/20 backdrop-blur-sm border-2 border-white/50 text-white font-semibold rounded-2xl text-sm hover:bg-white/30 transition-all duration-200 cursor-pointer min-h-[44px] self-start sm:self-auto"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Reportar mascota
            </button>
          </div>

          {/* Tabs de tipo */}
          <div className="flex flex-wrap gap-2 mt-6">
            {typeTabs.map((tab) => (
              <button
                key={tab.type}
                type="button"
                onClick={() => setFilter('type', tab.type as any)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-150 cursor-pointer min-h-[36px] ${
                  filters.type === tab.type
                    ? 'bg-white text-thistle-200 shadow-md'
                    : 'bg-white/20 text-white hover:bg-white/30 border border-white/30'
                }`}
              >
                <span>{tab.emoji}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* BARRA DE BÚSQUEDA + CONTROLES                                     */}
      {/* ================================================================ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className="flex gap-3">
          {/* Barra de búsqueda */}
          <div className="flex-1 flex items-center bg-white rounded-xl border-2 border-thistle-700 focus-within:border-baby_pink-400 transition-colors shadow-sm overflow-hidden">
            <div className="pl-4 text-thistle-500 shrink-0">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              id="report-search"
              type="text"
              value={filters.search}
              onChange={(e) => setFilter('search', e.target.value)}
              placeholder="Busca por nombre, especie, sector…"
              className="flex-1 px-3 py-3 text-sm text-thistle-100 placeholder-thistle-500 bg-transparent outline-none"
            />
            {filters.search && (
              <button
                type="button"
                onClick={() => setFilter('search', '')}
                className="pr-3 text-thistle-500 hover:text-thistle-300 transition-colors cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Botón filtros — solo en mobile/tablet */}
          <button
            type="button"
            id="toggle-filters-btn"
            onClick={() => setMobileFiltersOpen(true)}
            className="lg:hidden flex items-center gap-2 px-4 py-3 rounded-xl border-2 border-thistle-600 text-thistle-300 text-sm font-semibold hover:bg-thistle-800 transition-colors cursor-pointer min-h-[44px] shrink-0 bg-white shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filtros
            {activeFilterCount > 0 && (
              <span className="bg-baby_pink-400 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {/* Chips de filtros activos */}
        {activeFilterCount > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {filters.species && (
              <FilterChip label={`Especie: ${filters.species}`} onRemove={() => setFilter('species', '')} />
            )}
            {filters.region && (
              <FilterChip label={`Región: ${filters.region}`} onRemove={() => setFilter('region', '')} />
            )}
            {filters.comuna && (
              <FilterChip label={`Comuna: ${filters.comuna}`} onRemove={() => setFilter('comuna', '')} />
            )}
            {filters.size && (
              <FilterChip
                label={`Tamaño: ${{ SMALL: 'Pequeño', MEDIUM: 'Mediano', LARGE: 'Grande' }[filters.size] || filters.size}`}
                onRemove={() => setFilter('size', '')}
              />
            )}
            {filters.sex && (
              <FilterChip
                label={`Sexo: ${{ MALE: 'Macho', FEMALE: 'Hembra', UNKNOWN: 'Desconocido' }[filters.sex] || filters.sex}`}
                onRemove={() => setFilter('sex', '')}
              />
            )}
            <button
              type="button"
              onClick={resetFilters}
              className="text-xs text-baby_pink-300 hover:text-baby_pink-200 font-semibold px-2 py-1 cursor-pointer transition-colors underline underline-offset-2"
            >
              Limpiar todo
            </button>
          </div>
        )}
      </div>

      {/* ================================================================ */}
      {/* LAYOUT PRINCIPAL: Sidebar + Grid                                  */}
      {/* ================================================================ */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex gap-6 items-start">

          {/* Panel de filtros (sidebar desktop / drawer mobile) */}
          <ReportFiltersPanel
            filters={filters}
            onFilterChange={setFilter}
            onReset={resetFilters}
            activeFilterCount={activeFilterCount}
            mobileOpen={mobileFiltersOpen}
            onMobileClose={() => setMobileFiltersOpen(false)}
          />

          {/* ── Contenido principal ── */}
          <div className="flex-1 min-w-0">
            {/* Contador de resultados */}
            <div className="flex items-center justify-between mb-5">
              <p className="text-sm text-thistle-400 font-medium">
                {isLoading ? (
                  <span className="animate-pulse">Cargando...</span>
                ) : (
                  <>
                    <span className="text-thistle-200 font-bold">{totalResults}</span>{' '}
                    resultado{totalResults !== 1 ? 's' : ''} encontrado{totalResults !== 1 ? 's' : ''}
                  </>
                )}
              </p>
            </div>

            {/* Grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {Array.from({ length: 6 }).map((_, i) => (
                  <ReportSkeleton key={i} />
                ))}
              </div>
            ) : reports.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {reports.map((report) => (
                    <ReportCard key={report.id} report={report} />
                  ))}
                </div>
                <Pagination
                  page={filters.page}
                  totalPages={totalPages}
                  onPageChange={(p) => setFilter('page', p)}
                />
              </>
            ) : (
              <EmptyState onReset={resetFilters} />
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Subcomponente: chip de filtro activo
// ---------------------------------------------------------------------------

const FilterChip = ({ label, onRemove }: { label: string; onRemove: () => void }) => (
  <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-thistle-800 border border-thistle-600 text-xs text-thistle-300 font-medium">
    {label}
    <button
      type="button"
      onClick={onRemove}
      className="ml-0.5 text-thistle-500 hover:text-baby_pink-300 transition-colors cursor-pointer"
    >
      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  </span>
);

export default ReportListPage;

/**
 * @file features/reports/components/ReportFiltersPanel.tsx
 * @description Panel de filtros avanzados para ReportListPage.
 *
 * Layout:
 *  - Desktop (≥ lg): sidebar fijo a la izquierda.
 *  - Mobile/Tablet (< lg): drawer/panel colapsable con overlay.
 */

import { useState } from 'react';
import type { ReportFilters } from '../hooks/useReportFilters';
import { formatSpecies } from '@/utils/formatters';

// ---------------------------------------------------------------------------
// Datos de opciones
// ---------------------------------------------------------------------------

const REGIONES_CHILE = [
  'Arica y Parinacota',
  'Tarapacá',
  'Antofagasta',
  'Atacama',
  'Coquimbo',
  'Valparaíso',
  'Región Metropolitana de Santiago',
  "O'Higgins",
  'Maule',
  'Ñuble',
  'Biobío',
  'La Araucanía',
  'Los Ríos',
  'Los Lagos',
  'Aysén',
  'Magallanes',
];

const COMUNAS_RM = [
  'Providencia', 'Ñuñoa', 'Las Condes', 'Vitacura', 'Maipú',
  'La Florida', 'Peñalolén', 'Quilicura', 'Santiago', 'Recoleta',
  'Independencia', 'Lo Barnechea', 'Puente Alto', 'San Bernardo', 'La Pintana',
];

const SPECIES_OPTIONS = [
  { label: 'Perro', emoji: '🐶', value: 'DOG' },
  { label: 'Gato', emoji: '🐱', value: 'CAT' },
  { label: 'Ave', emoji: '🐦', value: 'BIRD' },
  { label: 'Conejo', emoji: '🐰', value: 'RABBIT' },
  { label: 'Otro', emoji: '🐾', value: 'OTHER' },
];

const SIZE_OPTIONS = [
  { label: 'Pequeño', value: 'SMALL' },
  { label: 'Mediano', value: 'MEDIUM' },
  { label: 'Grande', value: 'LARGE' },
];

const SEX_OPTIONS = [
  { label: 'Macho', value: 'MALE', emoji: '♂️' },
  { label: 'Hembra', value: 'FEMALE', emoji: '♀️' },
  { label: 'Desconocido', value: 'UNKNOWN', emoji: '❓' },
];

// ---------------------------------------------------------------------------
// Subcomponente: Sección colapsable
// ---------------------------------------------------------------------------

const FilterSection = ({
  title,
  icon,
  children,
  defaultOpen = false,
  badge,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
  badge?: string | undefined;
}) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-thistle-700 last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen((prev: boolean) => !prev)}
        className="w-full flex items-center justify-between px-4 py-3.5 text-sm font-semibold text-thistle-200 hover:bg-thistle-900 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <span className="text-thistle-400">{icon}</span>
          {title}
          {badge && (
            <span className="text-baby_pink-300 font-normal text-xs">· {badge}</span>
          )}
        </div>
        <svg
          className={`w-4 h-4 text-thistle-500 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="px-4 pb-4 pt-1 animate-[fadeIn_0.15s_ease]">
          {children}
        </div>
      )}
    </div>
  );
};

// ---------------------------------------------------------------------------
// Componente principal: ReportFiltersPanel
// ---------------------------------------------------------------------------

interface ReportFiltersPanelProps {
  filters: ReportFilters;
  onFilterChange: <K extends keyof ReportFilters>(key: K, value: ReportFilters[K]) => void;
  onReset: () => void;
  activeFilterCount: number;
  /** Para mobile: si el panel está abierto */
  mobileOpen: boolean;
  onMobileClose: () => void;
}

const ReportFiltersPanel = ({
  filters,
  onFilterChange,
  onReset,
  activeFilterCount,
  mobileOpen,
  onMobileClose,
}: ReportFiltersPanelProps) => {
  const comunasDisponibles =
    filters.region === 'Región Metropolitana de Santiago' || filters.region === ''
      ? COMUNAS_RM
      : [];

  const panelContent = (
    <div className="bg-white rounded-2xl border border-thistle-700 overflow-hidden shadow-sm">
      {/* Header del panel */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-thistle-700 bg-thistle-900">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-thistle-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          <span className="font-bold text-thistle-100 text-sm">Filtros</span>
          {activeFilterCount > 0 && (
            <span className="bg-baby_pink-400 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </div>
        {activeFilterCount > 0 && (
          <button
            type="button"
            onClick={onReset}
            className="text-xs text-baby_pink-300 hover:text-baby_pink-200 font-medium transition-colors cursor-pointer"
          >
            Limpiar todo
          </button>
        )}
      </div>

      {/* Tipo de mascota — especie */}
      <FilterSection
        title="Tipo de mascota"
        defaultOpen
        badge={filters.species ? formatSpecies(filters.species) : undefined}
        icon={
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        }
      >
        <div className="flex flex-wrap gap-2">
          {SPECIES_OPTIONS.map((sp) => (
            <button
              key={sp.value}
              type="button"
              onClick={() => onFilterChange('species', filters.species === sp.value ? '' : sp.value)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border-2 transition-all duration-150 cursor-pointer min-h-[36px] ${
                filters.species === sp.value
                  ? 'bg-thistle-300 text-white border-thistle-300 shadow-sm'
                  : 'bg-white text-thistle-300 border-thistle-600 hover:bg-thistle-900'
              }`}
            >
              <span>{sp.emoji}</span>
              {sp.label}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Región */}
      <FilterSection
        title="Región"
        badge={filters.region || undefined}
        icon={
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
          </svg>
        }
      >
        <select
          id="filter-region"
          value={filters.region}
          onChange={(e) => onFilterChange('region', e.target.value)}
          className="w-full px-3 py-2.5 rounded-xl border border-thistle-600 text-sm text-thistle-200 bg-thistle-900 outline-none focus:border-thistle-400 transition-colors cursor-pointer"
        >
          <option value="">Todas las regiones</option>
          {REGIONES_CHILE.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
      </FilterSection>

      {/* Comuna */}
      <FilterSection
        title="Comuna"
        badge={filters.comuna || undefined}
        icon={
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        }
      >
        <select
          id="filter-comuna"
          value={filters.comuna}
          onChange={(e) => onFilterChange('comuna', e.target.value)}
          disabled={comunasDisponibles.length === 0 && filters.region !== ''}
          className="w-full px-3 py-2.5 rounded-xl border border-thistle-600 text-sm text-thistle-200 bg-thistle-900 outline-none focus:border-thistle-400 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <option value="">Todas las comunas</option>
          {comunasDisponibles.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
          {comunasDisponibles.length === 0 && filters.region !== '' && (
            <option value="" disabled>Sin comunas disponibles</option>
          )}
        </select>
      </FilterSection>

      {/* Tamaño */}
      <FilterSection
        title="Tamaño"
        badge={SIZE_OPTIONS.find((s) => s.value === filters.size)?.label}
        icon={
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
          </svg>
        }
      >
        <div className="flex flex-wrap gap-2">
          {SIZE_OPTIONS.map((sz) => (
            <button
              key={sz.value}
              type="button"
              onClick={() => onFilterChange('size', filters.size === sz.value ? '' : sz.value)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold border-2 transition-all duration-150 cursor-pointer min-h-[36px] ${
                filters.size === sz.value
                  ? 'bg-icy_blue-300 text-white border-icy_blue-300 shadow-sm'
                  : 'bg-white text-icy_blue-200 border-icy_blue-600 hover:bg-icy_blue-900'
              }`}
            >
              {sz.label}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Sexo */}
      <FilterSection
        title="Sexo"
        badge={SEX_OPTIONS.find((s) => s.value === filters.sex)?.label}
        icon={
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        }
      >
        <div className="flex flex-wrap gap-2">
          {SEX_OPTIONS.map((sx) => (
            <button
              key={sx.value}
              type="button"
              onClick={() => onFilterChange('sex', filters.sex === sx.value ? '' : sx.value)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border-2 transition-all duration-150 cursor-pointer min-h-[36px] ${
                filters.sex === sx.value
                  ? 'bg-pastel_petal-300 text-white border-pastel_petal-300 shadow-sm'
                  : 'bg-white text-pastel_petal-200 border-pastel_petal-500 hover:bg-pastel_petal-900'
              }`}
            >
              <span>{sx.emoji}</span>
              {sx.label}
            </button>
          ))}
        </div>
      </FilterSection>
    </div>
  );

  return (
    <>
      {/* ── Desktop sidebar (lg+) ── */}
      <aside className="hidden lg:block w-72 shrink-0">
        {panelContent}
      </aside>

      {/* ── Mobile drawer (< lg) ── */}
      {mobileOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-sm"
            onClick={onMobileClose}
          />
          {/* Panel deslizable desde izquierda */}
          <div className="fixed inset-y-0 left-0 w-80 max-w-[90vw] z-50 overflow-y-auto lg:hidden bg-white shadow-2xl">
            <div className="flex items-center justify-between px-4 py-4 border-b border-thistle-700 bg-thistle-900 sticky top-0">
              <span className="font-bold text-thistle-100 text-sm">Filtros avanzados</span>
              <button
                type="button"
                onClick={onMobileClose}
                className="p-2 rounded-xl hover:bg-thistle-800 transition-colors cursor-pointer text-thistle-400 hover:text-thistle-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            {/* Mismo contenido sin la clase del sidebar */}
            <div className="border border-thistle-700">
              {/* Tipo de mascota */}
              <FilterSection
                title="Tipo de mascota"
                defaultOpen
                badge={filters.species ? formatSpecies(filters.species) : undefined}
                icon={
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                }
              >
                <div className="flex flex-wrap gap-2">
                  {SPECIES_OPTIONS.map((sp) => (
                    <button
                      key={sp.value}
                      type="button"
                      onClick={() => onFilterChange('species', filters.species === sp.value ? '' : sp.value)}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border-2 transition-all duration-150 cursor-pointer min-h-[36px] ${
                        filters.species === sp.value
                          ? 'bg-thistle-300 text-white border-thistle-300'
                          : 'bg-white text-thistle-300 border-thistle-600 hover:bg-thistle-900'
                      }`}
                    >
                      <span>{sp.emoji}</span>
                      {sp.label}
                    </button>
                  ))}
                </div>
              </FilterSection>

              <FilterSection
                title="Región"
                badge={filters.region || undefined}
                icon={
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
                  </svg>
                }
              >
                <select
                  value={filters.region}
                  onChange={(e) => onFilterChange('region', e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-thistle-600 text-sm text-thistle-200 bg-thistle-900 outline-none focus:border-thistle-400 transition-colors cursor-pointer"
                >
                  <option value="">Todas las regiones</option>
                  {REGIONES_CHILE.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </FilterSection>

              <FilterSection
                title="Comuna"
                badge={filters.comuna || undefined}
                icon={
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                }
              >
                <select
                  value={filters.comuna}
                  onChange={(e) => onFilterChange('comuna', e.target.value)}
                  disabled={comunasDisponibles.length === 0 && filters.region !== ''}
                  className="w-full px-3 py-2.5 rounded-xl border border-thistle-600 text-sm text-thistle-200 bg-thistle-900 outline-none focus:border-thistle-400 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">Todas las comunas</option>
                  {comunasDisponibles.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </FilterSection>

              <FilterSection
                title="Tamaño"
                badge={SIZE_OPTIONS.find((s) => s.value === filters.size)?.label}
                icon={
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                  </svg>
                }
              >
                <div className="flex flex-wrap gap-2">
                  {SIZE_OPTIONS.map((sz) => (
                    <button
                      key={sz.value}
                      type="button"
                      onClick={() => onFilterChange('size', filters.size === sz.value ? '' : sz.value)}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold border-2 transition-all duration-150 cursor-pointer min-h-[36px] ${
                        filters.size === sz.value
                          ? 'bg-icy_blue-300 text-white border-icy_blue-300'
                          : 'bg-white text-icy_blue-200 border-icy_blue-600 hover:bg-icy_blue-900'
                      }`}
                    >
                      {sz.label}
                    </button>
                  ))}
                </div>
              </FilterSection>

              <FilterSection
                title="Sexo"
                badge={SEX_OPTIONS.find((s) => s.value === filters.sex)?.label}
                icon={
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                }
              >
                <div className="flex flex-wrap gap-2">
                  {SEX_OPTIONS.map((sx) => (
                    <button
                      key={sx.value}
                      type="button"
                      onClick={() => onFilterChange('sex', filters.sex === sx.value ? '' : sx.value)}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border-2 transition-all duration-150 cursor-pointer min-h-[36px] ${
                        filters.sex === sx.value
                          ? 'bg-pastel_petal-300 text-white border-pastel_petal-300'
                          : 'bg-white text-pastel_petal-200 border-pastel_petal-500 hover:bg-pastel_petal-900'
                      }`}
                    >
                      <span>{sx.emoji}</span>
                      {sx.label}
                    </button>
                  ))}
                </div>
              </FilterSection>
            </div>

            {/* Footer del drawer mobile */}
            {activeFilterCount > 0 && (
              <div className="px-4 py-4 bg-white border-t border-thistle-700 sticky bottom-0">
                <button
                  type="button"
                  onClick={() => { onReset(); onMobileClose(); }}
                  className="w-full py-3 rounded-xl border-2 border-thistle-600 text-thistle-300 text-sm font-semibold hover:bg-thistle-900 transition-colors cursor-pointer"
                >
                  Limpiar filtros ({activeFilterCount})
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default ReportFiltersPanel;

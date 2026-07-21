/**
 * @file features/reports/hooks/useReportFilters.ts
 * @description Hook personalizado para gestión de filtros de reportes.
 *
 * Responsabilidades:
 *  - Lee el query param `?type=` del URL al montar y lo preselecciona.
 *  - Sincroniza todos los filtros con los search params del URL (navegación hacia atrás funciona).
 *  - Llama a la API con debounce en el campo `search`.
 *  - Expone el estado de loading, los reportes normalizados y las acciones de filtro.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ReportType } from '@/types';
import apiClient from '@/services/api';
import { normalizeReport, type ReportCardData } from '../components/ReportCard';

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------

export interface ReportFilters {
  type: ReportType | '';
  species: string;
  region: string;
  comuna: string;
  size: string;
  sex: string;
  search: string;
  page: number;
}

const INITIAL_FILTERS: ReportFilters = {
  type: '',
  species: '',
  region: '',
  comuna: '',
  size: '',
  sex: '',
  search: '',
  page: 1,
};

const DEBOUNCE_MS = 400;
const PAGE_SIZE = 12;

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export const useReportFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Inicializar filtros desde URL
  const initFilters = (): ReportFilters => ({
    ...INITIAL_FILTERS,
    type: (searchParams.get('type') as ReportType) || '',
    species: searchParams.get('species') || '',
    region: searchParams.get('region') || '',
    comuna: searchParams.get('comuna') || '',
    size: searchParams.get('size') || '',
    sex: searchParams.get('sex') || '',
    search: searchParams.get('search') || '',
    page: parseInt(searchParams.get('page') || '1', 10),
  });

  const [filters, setFilters] = useState<ReportFilters>(initFilters);
  const [reports, setReports] = useState<ReportCardData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalResults, setTotalResults] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Referencia para debounce del search
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Sincronizar filtros → URL ──
  const syncToUrl = useCallback(
    (f: ReportFilters) => {
      const params: Record<string, string> = {};
      if (f.type) params['type'] = f.type;
      if (f.species) params['species'] = f.species;
      if (f.region) params['region'] = f.region;
      if (f.comuna) params['comuna'] = f.comuna;
      if (f.size) params['size'] = f.size;
      if (f.sex) params['sex'] = f.sex;
      if (f.search) params['search'] = f.search;
      if (f.page > 1) params['page'] = String(f.page);
      setSearchParams(params, { replace: true });
    },
    [setSearchParams],
  );

  // ── Fetch reportes desde la API ──
  const fetchReports = useCallback(async (f: ReportFilters) => {
    setIsLoading(true);
    try {
      const params: Record<string, string | number> = {
        limit: PAGE_SIZE,
        page: f.page,
      };
      if (f.type) params['type'] = f.type;
      if (f.species) params['species'] = f.species;
      if (f.region) params['region'] = f.region;
      if (f.comuna) params['comuna'] = f.comuna;
      if (f.size) params['size'] = f.size;
      if (f.sex) params['sex'] = f.sex;
      if (f.search) params['search'] = f.search;

      const res = await apiClient.get('/reports', { params });
      if (res.data?.success) {
        const raw = Array.isArray(res.data.data) ? res.data.data : [];
        setReports(raw.map(normalizeReport));
        setTotalResults(res.data.total ?? raw.length);
        setTotalPages(res.data.totalPages ?? Math.ceil((res.data.total ?? raw.length) / PAGE_SIZE));
      }
    } catch (err) {
      console.error('Error al cargar reportes:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ── Ejecutar fetch cuando cambien los filtros (con debounce en search) ──
  useEffect(() => {
    syncToUrl(filters);

    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      fetchReports(filters);
    }, DEBOUNCE_MS);

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [filters, fetchReports, syncToUrl]);

  // ── Acciones de actualización de filtros ──
  const setFilter = useCallback(<K extends keyof ReportFilters>(key: K, value: ReportFilters[K]) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      // Resetear página y comuna cuando cambia región
      ...(key === 'region' ? { comuna: '', page: 1 } : {}),
      // Resetear página en cualquier cambio de filtro (excepto page mismo)
      ...(key !== 'page' ? { page: 1 } : {}),
    }));
  }, []);

  const resetFilters = useCallback(() => {
    // Mantener solo el tipo si está en la URL original
    setFilters({ ...INITIAL_FILTERS });
  }, []);

  const activeFilterCount = [
    filters.species,
    filters.region,
    filters.comuna,
    filters.size,
    filters.sex,
  ].filter(Boolean).length;

  return {
    filters,
    setFilter,
    resetFilters,
    reports,
    isLoading,
    totalResults,
    totalPages,
    pageSize: PAGE_SIZE,
    activeFilterCount,
  };
};

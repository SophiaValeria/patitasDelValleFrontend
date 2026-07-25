/**
 * @file features/reports/components/ReportCard.tsx
 * @description Tarjeta de reporte reutilizable.
 * Usada tanto en HomePage (últimos reportes) como en ReportListPage (grid completo).
 */

import { useNavigate } from 'react-router-dom';
import { ReportType } from '@/types';
import { formatSpecies, formatSize, formatImageUrl } from '@/utils/formatters';

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------

export interface ReportCardData {
  id: string;
  type: ReportType;
  petName: string;
  species: string;
  location: string;
  date: string;
  image: string;
  color?: string;
  breed?: string;
  size?: string;
}

// ---------------------------------------------------------------------------
// Config de tipos
// ---------------------------------------------------------------------------

export const REPORT_TYPE_CONFIG: Record<
  ReportType,
  { label: string; badge: string; badgeBg: string; dotColor: string; borderHover: string }
> = {
  [ReportType.LOST]: {
    label: 'Mascotas Perdidas',
    badge: 'Perdida',
    badgeBg: 'bg-baby_pink-300 text-white',
    dotColor: 'bg-baby_pink-300',
    borderHover: 'hover:border-baby_pink-400',
  },
  [ReportType.FOUND]: {
    label: 'Encontradas',
    badge: 'Encontrada',
    badgeBg: 'bg-sky_blue-400 text-white',
    dotColor: 'bg-sky_blue-400',
    borderHover: 'hover:border-sky_blue-400',
  },
  [ReportType.ADOPTION]: {
    label: 'En Adopción',
    badge: 'Adopción',
    badgeBg: 'bg-thistle-400 text-white',
    dotColor: 'bg-thistle-400',
    borderHover: 'hover:border-thistle-400',
  },
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export const formatLocation = (loc: any): string => {
  if (!loc) return 'Chile';
  if (typeof loc === 'string') return loc;
  const parts: string[] = [];
  if (loc.comuna) parts.push(loc.comuna);
  if (loc.region) parts.push(loc.region);
  return parts.length > 0 ? parts.join(', ') : loc.address || 'Chile';
};

export const formatDate = (dateStr: any): string => {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return String(dateStr);
    return d.toLocaleDateString('es-CL', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch {
    return String(dateStr);
  }
};

export const normalizeReport = (raw: any): ReportCardData => ({
  id: raw._id || raw.id || String(Math.random()),
  type: raw.type || ReportType.LOST,
  petName: raw.animalInfo?.name || raw.petName || 'Sin Nombre',
  species: formatSpecies(raw.animalInfo?.species || raw.species),
  breed: raw.animalInfo?.breed || raw.breed || '',
  color: raw.animalInfo?.color || raw.color || '',
  size: formatSize(raw.animalInfo?.size || raw.size),
  location: formatLocation(raw.location),
  date: formatDate(raw.updatedAt || raw.createdAt || raw.date),
  image: formatImageUrl(
    Array.isArray(raw.images) && raw.images.length > 0 ? raw.images[0] : raw.image
  ),
});

// ---------------------------------------------------------------------------
// Componente ReportCard
// ---------------------------------------------------------------------------

interface ReportCardProps {
  report: ReportCardData;
  /** Variante compacta para el home (altura de imagen menor) */
  compact?: boolean;
}

const ReportCard = ({ report, compact = false }: ReportCardProps) => {
  const navigate = useNavigate();
  const config = REPORT_TYPE_CONFIG[report.type] ?? REPORT_TYPE_CONFIG[ReportType.LOST];

  return (
    <article
      onClick={() => navigate(`/reportes/${report.id}`)}
      className={`group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer border border-thistle-700 ${config.borderHover}`}
    >
      {/* Imagen */}
      <div className={`relative overflow-hidden ${compact ? 'h-40' : 'h-52'}`}>
        <img
          src={report.image}
          alt={report.petName}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {/* Badge de tipo */}
        <div className="absolute top-3 left-3">
          <span className={`text-xs font-bold px-3 py-1 rounded-full shadow ${config.badgeBg}`}>
            {config.badge}
          </span>
        </div>
      </div>

      {/* Contenido */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-bold text-thistle-100 text-base leading-tight truncate">
            {report.petName}
          </h3>
          <span className="text-xs text-thistle-500 whitespace-nowrap shrink-0">{report.date}</span>
        </div>

        <p className="text-sm text-thistle-400 mb-3 truncate">
          {report.species}
          {report.breed ? ` · ${report.breed}` : ''}
          {report.color ? ` · ${report.color}` : ''}
        </p>

        <div className="flex items-center gap-1.5 text-xs text-thistle-500">
          <svg className="w-3.5 h-3.5 shrink-0 text-thistle-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="truncate">{report.location}</span>
        </div>
      </div>
    </article>
  );
};

export default ReportCard;

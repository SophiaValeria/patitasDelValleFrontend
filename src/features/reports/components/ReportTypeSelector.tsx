/**
 * @file features/reports/components/ReportTypeSelector.tsx
 * @description Paso 0 del flujo de creación de reportes.
 * El usuario elige el tipo de reporte con tarjetas guiadas y tooltips de orientación.
 * Énfasis visual especial en los tipos LOST y FOUND (urgencia alta).
 */

import { useState } from 'react';
import { ReportType } from '@/types';
import { REPORT_TYPE_CONFIGS } from '../types/form.types';
import type { ReportTypeConfig } from '../types/form.types';

interface ReportTypeSelectorProps {
  onSelect: (type: ReportType) => void;
}

// ---------------------------------------------------------------------------
// Sub-componente: Badge de urgencia
// ---------------------------------------------------------------------------

const UrgencyBadge = () => (
  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-baby_pink-300 text-white">
    <span className="relative flex h-2 w-2">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
      <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
    </span>
    Urgente
  </span>
);

// ---------------------------------------------------------------------------
// Sub-componente: Tarjeta de tipo de reporte
// ---------------------------------------------------------------------------

const TypeCard = ({
  config,
  onSelect,
}: {
  config: ReportTypeConfig;
  onSelect: (type: ReportType) => void;
}) => {
  const [tipOpen, setTipOpen] = useState(false);
  const isUrgent = config.urgency === 'high';

  return (
    <article
      className={`
        relative flex flex-col rounded-3xl border-2 overflow-hidden
        transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 group
        ${isUrgent ? 'lg:col-span-1' : ''}
        ${config.colorScheme.bg} ${config.colorScheme.border}
      `}
    >
      {/* Urgency indicator stripe */}
      {isUrgent && (
        <div className="h-1 w-full bg-gradient-to-r from-baby_pink-400 to-pastel_petal-400" />
      )}

      <div className="p-6 flex flex-col gap-4 flex-1">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3">
          <div className={`w-16 h-16 rounded-2xl ${config.colorScheme.iconBg} flex items-center justify-center text-3xl shadow-inner flex-shrink-0`}>
            {config.icon}
          </div>
          <div className="flex flex-col items-end gap-1.5">
            {isUrgent && <UrgencyBadge />}
          </div>
        </div>

        {/* Title & subtitle */}
        <div>
          <h3 className={`text-xl font-extrabold leading-tight ${config.colorScheme.titleColor}`}>
            {config.title}
          </h3>
          <p className="text-sm text-thistle-400 mt-0.5 font-medium">{config.subtitle}</p>
        </div>

        {/* Description */}
        <p className="text-sm text-thistle-300 leading-relaxed flex-1">
          {config.description}
        </p>

        {/* Tooltip / cuando usarlo */}
        <div className="rounded-2xl overflow-hidden border border-thistle-700">
          <button
            onClick={() => setTipOpen(!tipOpen)}
            className="w-full flex items-center justify-between px-4 py-3 text-xs font-semibold text-thistle-300 hover:bg-white/30 transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              ¿Cuándo usar este reporte?
            </span>
            <svg
              className={`w-4 h-4 transition-transform duration-200 ${tipOpen ? 'rotate-180' : ''}`}
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {tipOpen && (
            <ul className="px-4 pb-4 pt-1 space-y-2">
              {config.whenToUse.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-thistle-300">
                  <svg className="w-3.5 h-3.5 mt-0.5 text-thistle-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* CTA Button */}
        <button
          onClick={() => onSelect(config.type)}
          className={`
            w-full py-3.5 rounded-2xl font-bold text-sm
            ${config.colorScheme.btnBg} ${config.colorScheme.btnText}
            shadow-md hover:shadow-lg hover:scale-[1.02]
            transition-all duration-200 cursor-pointer min-h-[44px]
            flex items-center justify-center gap-2
          `}
        >
          Crear este reporte
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </button>
      </div>
    </article>
  );
};

// ---------------------------------------------------------------------------
// Componente principal
// ---------------------------------------------------------------------------

const ReportTypeSelector = ({ onSelect }: ReportTypeSelectorProps) => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 bg-thistle-800 border border-thistle-600 rounded-full px-4 py-1.5 mb-4 text-sm font-medium text-thistle-300">
          🐾 Nuevo reporte
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-thistle-100 leading-tight mb-3">
          ¿Qué tipo de reporte quieres crear?
        </h1>
        <p className="text-thistle-400 text-base max-w-xl mx-auto">
          Elige la opción que mejor describe tu situación. Si tienes dudas, despliega el tooltip
          de cada tarjeta para orientarte.
        </p>
      </div>

      {/* Alerta de orientación para LOST/FOUND */}
      <div className="mb-8 bg-baby_pink-900 border border-baby_pink-400/40 rounded-2xl p-4 flex gap-3">
        <div className="shrink-0 mt-0.5">
          <svg className="w-5 h-5 text-baby_pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-semibold text-baby_pink-200">
            ¿Perdiste o encontraste a una mascota?
          </p>
          <p className="text-xs text-thistle-400 mt-0.5 leading-relaxed">
            Los reportes de <strong className="text-baby_pink-300">mascota desaparecida</strong> y{' '}
            <strong className="text-sky_blue-300">mascota encontrada</strong> son los más urgentes.
            Crear el reporte lo antes posible aumenta las probabilidades de reunir a la mascota con su familia.
          </p>
        </div>
      </div>

      {/* Grid de tarjetas — LOST y FOUND en fila superior, ADOPTION centrado */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {REPORT_TYPE_CONFIGS.map((config) => (
          <TypeCard key={config.type} config={config} onSelect={onSelect} />
        ))}
      </div>
    </div>
  );
};

export default ReportTypeSelector;

/**
 * @file features/reports/components/steps/Step4Extra.tsx
 * @description Paso 4 del formulario de reporte: información adicional + resumen final.
 * El usuario puede agregar contexto extra y revisar todo antes de publicar.
 */

import React from 'react';
import type { ReportFormData } from '../../types/form.types';
import { REPORT_TYPE_CONFIGS } from '../../types/form.types';
import { ReportType } from '@/types';

interface Step4ExtraProps {
  data: ReportFormData;
  onChange: (patch: Partial<ReportFormData>) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const SEX_LABELS: Record<string, string> = {
  MALE: 'Macho ♂️',
  FEMALE: 'Hembra ♀️',
  UNKNOWN: 'No se sabe ❓',
};

const SIZE_LABELS: Record<string, string> = {
  SMALL: 'Pequeño (< 5 kg)',
  MEDIUM: 'Mediano (5–20 kg)',
  LARGE: 'Grande (> 20 kg)',
};

const inputClass =
  'w-full px-4 py-3 rounded-xl border-2 border-thistle-600 bg-thistle-900 text-thistle-100 text-sm placeholder-thistle-500 outline-none focus:border-baby_pink-400 transition-colors duration-200';

const FieldLabel = ({ children, htmlFor }: { children: React.ReactNode; htmlFor?: string }) => (
  <label htmlFor={htmlFor} className="block text-sm font-semibold text-thistle-200 mb-2">
    {children}
  </label>
);

// ---------------------------------------------------------------------------
// Sub-componente: Fila de resumen
// ---------------------------------------------------------------------------

const SummaryRow = ({ label, value }: { label: string; value: string | string[] | undefined }) => {
  if (!value || (Array.isArray(value) && value.length === 0)) return null;
  const displayValue = Array.isArray(value) ? value.join(', ') : value;

  return (
    <div className="flex items-start gap-2 py-2 border-b border-thistle-800 last:border-0">
      <span className="text-xs text-thistle-500 w-32 shrink-0 mt-0.5">{label}</span>
      <span className="text-sm text-thistle-200 font-medium flex-1">{displayValue}</span>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Componente principal
// ---------------------------------------------------------------------------

const Step4Extra = ({ data, onChange, onSubmit, isSubmitting }: Step4ExtraProps) => {
  const typeConfig = REPORT_TYPE_CONFIGS.find((c) => c.type === data.type);

  const incidentDateLabel =
    data.type === ReportType.LOST
      ? '¿Cuándo desapareció?'
      : data.type === ReportType.FOUND
      ? '¿Cuándo lo encontraste?'
      : '¿Desde cuándo está disponible?';

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-extrabold text-thistle-100 mb-1">
          Información adicional
        </h2>
        <p className="text-sm text-thistle-400">
          Agrega cualquier detalle extra que ayude a identificar o localizar a la mascota, y revisa el resumen antes de publicar.
        </p>
      </div>

      {/* Fecha del incidente */}
      <div>
        <FieldLabel htmlFor="report-date">{incidentDateLabel}</FieldLabel>
        <input
          id="report-date"
          type="date"
          value={data.incidentDate}
          max={new Date().toISOString().split('T')[0]}
          onChange={(e) => onChange({ incidentDate: e.target.value })}
          className={inputClass}
        />
      </div>

      {/* Info adicional */}
      <div>
        <FieldLabel htmlFor="report-extra">Otra información relevante</FieldLabel>
        <textarea
          id="report-extra"
          value={data.additionalInfo}
          onChange={(e) => onChange({ additionalInfo: e.target.value })}
          placeholder={
            data.type === ReportType.LOST
              ? 'Ej: Escapó por el portón trasero, tiene miedo a los petardos, fue visto cerca del supermercado…'
              : data.type === ReportType.FOUND
              ? 'Ej: Estaba solo cerca del río, estaba muy asustado, lo tengo en casa temporalmente…'
              : 'Ej: Busca familia con niños, lleva todas sus vacunas, incluye cama y comederos…'
          }
          rows={4}
          className={`${inputClass} resize-none`}
        />
        <p className="text-xs text-thistle-500 mt-1">
          Circunstancias del caso, comportamiento, condición de salud, lo que tienes del animal, etc.
        </p>
      </div>

      {/* ── Resumen del reporte ── */}
      <div className="rounded-3xl border-2 border-thistle-600 overflow-hidden">
        {/* Header del resumen */}
        <div className={`px-5 py-4 flex items-center gap-3 ${typeConfig?.colorScheme.bg ?? 'bg-thistle-800'}`}>
          <span className="text-2xl">{typeConfig?.icon}</span>
          <div>
            <p className="text-xs font-semibold text-thistle-400 uppercase tracking-wide">
              Resumen del reporte
            </p>
            <p className={`text-base font-extrabold ${typeConfig?.colorScheme.titleColor ?? 'text-thistle-100'}`}>
              {typeConfig?.title}
            </p>
          </div>
        </div>

        <div className="p-5 bg-white/5 space-y-0">

          {/* Foto principal */}
          {data.imagePreviews.length > 0 && (
            <div className="flex gap-2 mb-4 flex-wrap">
              {data.imagePreviews.slice(0, 4).map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt={`Foto ${i + 1}`}
                  className="w-16 h-16 rounded-xl object-cover border-2 border-thistle-700"
                />
              ))}
              {data.images.length > 4 && (
                <div className="w-16 h-16 rounded-xl bg-thistle-800 border-2 border-thistle-700 flex items-center justify-center text-xs text-thistle-400 font-bold">
                  +{data.images.length - 4}
                </div>
              )}
            </div>
          )}

          {/* Datos */}
          <SummaryRow label="Nombre" value={data.animalName || 'Sin nombre'} />
          <SummaryRow label="Especie" value={data.species} />
          <SummaryRow label="Raza" value={data.breed || 'Desconocida'} />
          <SummaryRow label="Sexo" value={SEX_LABELS[data.sex]} />
          <SummaryRow label="Tamaño" value={SIZE_LABELS[data.size]} />
          <SummaryRow label="Color(es)" value={data.colors} />
          <SummaryRow label="Características" value={data.characteristics} />
          <SummaryRow label="Identificativos" value={data.identifiers} />
          <SummaryRow label="Región" value={data.regionLabel} />
          <SummaryRow label="Comuna" value={data.comuna} />
          <SummaryRow label="Dirección" value={data.address} />
          <SummaryRow label="Teléfono" value={data.phone ? `+56 ${data.phone}` : undefined} />
          <SummaryRow label="Fecha" value={data.incidentDate} />
          <SummaryRow label="Info adicional" value={data.additionalInfo} />
        </div>
      </div>

      {/* Disclaimer + Botón de publicar */}
      <div className="space-y-4">
        <p className="text-xs text-thistle-500 text-center leading-relaxed">
          Al publicar este reporte confirmas que la información es verídica y aceptas los{' '}
          <a href="#" className="text-baby_pink-400 underline underline-offset-2">
            Términos de uso
          </a>{' '}
          de Patitas del Valle.
        </p>

        <button
          onClick={onSubmit}
          disabled={isSubmitting}
          className="
            w-full py-4 rounded-2xl font-extrabold text-base
            bg-gradient-to-r from-baby_pink-400 to-pastel_petal-400 text-white
            shadow-lg hover:shadow-xl hover:from-baby_pink-300 hover:to-pastel_petal-300
            transition-all duration-200 cursor-pointer
            disabled:opacity-60 disabled:cursor-not-allowed
            flex items-center justify-center gap-3
            min-h-[56px]
          "
        >
          {isSubmitting ? (
            <>
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Publicando reporte…
            </>
          ) : (
            <>
              🐾 Publicar reporte
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default Step4Extra;

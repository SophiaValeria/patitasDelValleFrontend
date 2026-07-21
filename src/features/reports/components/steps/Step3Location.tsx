/**
 * @file features/reports/components/steps/Step3Location.tsx
 * @description Paso 3 del formulario de reporte: ubicación y datos de contacto.
 * Campos: región, comuna (dinámica), dirección/sector, teléfono de contacto.
 */

import React from 'react';
import type { ReportFormData } from '../../types/form.types';
import { CHILE_REGIONS } from '../../data/chile-locations';
import { ReportType } from '@/types';

interface Step3LocationProps {
  data: ReportFormData;
  onChange: (patch: Partial<ReportFormData>) => void;
}

const inputClass =
  'w-full px-4 py-3 rounded-xl border-2 border-thistle-600 bg-thistle-900 text-thistle-100 text-sm placeholder-thistle-500 outline-none focus:border-baby_pink-400 transition-colors duration-200';

const FieldLabel = ({
  children,
  required,
  htmlFor,
}: {
  children: React.ReactNode;
  required?: boolean;
  htmlFor?: string;
}) => (
  <label htmlFor={htmlFor} className="block text-sm font-semibold text-thistle-200 mb-2">
    {children}
    {required && <span className="text-baby_pink-400 ml-1">*</span>}
  </label>
);

const Step3Location = ({ data, onChange }: Step3LocationProps) => {
  const selectedRegionData = CHILE_REGIONS.find((r) => r.value === data.region);

  const handleRegionChange = (value: string) => {
    const region = CHILE_REGIONS.find((r) => r.value === value);
    onChange({
      region: value,
      regionLabel: region?.label ?? '',
      comuna: '',
    });
  };

  const locationContext =
    data.type === ReportType.LOST
      ? 'Indica el lugar donde se perdió tu mascota.'
      : data.type === ReportType.FOUND
      ? 'Indica el lugar donde encontraste a la mascota.'
      : 'Indica el lugar desde donde puedes entregar a la mascota.';

  return (
    <div className="space-y-7">
      <div>
        <h2 className="text-2xl font-extrabold text-thistle-100 mb-1">
          Ubicación y contacto
        </h2>
        <p className="text-sm text-thistle-400">{locationContext}</p>
      </div>

      {/* Alerta de privacidad */}
      <div className="flex gap-3 bg-thistle-800 border border-thistle-600 rounded-2xl p-4">
        <svg className="w-5 h-5 text-thistle-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        <p className="text-xs text-thistle-400 leading-relaxed">
          <strong className="text-thistle-200">Privacidad:</strong> No compartas tu dirección exacta si no lo deseas.
          El nombre del barrio o sector es suficiente para que la comunidad pueda ayudarte.
        </p>
      </div>

      {/* Región */}
      <div>
        <FieldLabel htmlFor="report-region" required>Región</FieldLabel>
        <div className="relative">
          <select
            id="report-region"
            value={data.region}
            onChange={(e) => handleRegionChange(e.target.value)}
            className={`${inputClass} cursor-pointer appearance-none pr-10`}
          >
            <option value="">Selecciona tu región</option>
            {CHILE_REGIONS.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
            <svg className="w-4 h-4 text-thistle-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Comuna */}
      <div>
        <FieldLabel htmlFor="report-comuna" required>Comuna</FieldLabel>
        <div className="relative">
          <select
            id="report-comuna"
            value={data.comuna}
            onChange={(e) => onChange({ comuna: e.target.value })}
            disabled={!data.region}
            className={`${inputClass} cursor-pointer appearance-none pr-10 disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <option value="">
              {data.region ? 'Selecciona tu comuna' : 'Primero selecciona una región'}
            </option>
            {selectedRegionData?.comunas.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
            <svg className="w-4 h-4 text-thistle-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Dirección / Sector */}
      <div>
        <FieldLabel htmlFor="report-address" required>Dirección o Sector</FieldLabel>
        <input
          id="report-address"
          type="text"
          value={data.address}
          onChange={(e) => onChange({ address: e.target.value })}
          placeholder="Ej: Av. Providencia cerca del metro, Barrio Italia, Parque O'Higgins…"
          className={inputClass}
        />
        <p className="text-xs text-thistle-500 mt-1">
          Puedes indicar una referencia como parques, colegios o avenidas cercanas.
        </p>
      </div>

      {/* Separador */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-thistle-700" />
        <span className="text-xs text-thistle-500 font-medium">Datos de contacto</span>
        <div className="flex-1 h-px bg-thistle-700" />
      </div>

      {/* Teléfono */}
      <div>
        <FieldLabel htmlFor="report-phone" required>Teléfono de contacto</FieldLabel>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
            <span className="text-sm text-thistle-400 font-medium">🇨🇱 +56</span>
          </div>
          <input
            id="report-phone"
            type="tel"
            value={data.phone}
            onChange={(e) => {
              // Solo permitir números
              const val = e.target.value.replace(/[^\d\s]/g, '');
              onChange({ phone: val });
            }}
            placeholder="9 1234 5678"
            maxLength={12}
            className={`${inputClass} pl-[4.5rem]`}
          />
        </div>
        <p className="text-xs text-thistle-500 mt-1">
          Este número será visible para que quienes vean el reporte puedan contactarte.
        </p>
      </div>

      {/* Tip de contacto */}
      <div className="flex gap-3 bg-sky_blue-900 border border-sky_blue-700 rounded-2xl p-4">
        <svg className="w-5 h-5 text-sky_blue-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
        <div className="text-xs text-sky_blue-200 space-y-1">
          <p className="font-semibold">Mantén tu teléfono disponible</p>
          <p className="text-icy_blue-400 leading-relaxed">
            Una vez publicado el reporte, personas de tu zona podrían contactarte con información sobre tu mascota.
            Asegúrate de tener el teléfono activo y revisar tus mensajes.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Step3Location;

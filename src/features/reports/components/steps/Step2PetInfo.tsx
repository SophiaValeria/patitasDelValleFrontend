/**
 * @file features/reports/components/steps/Step2PetInfo.tsx
 * @description Paso 2 del formulario de reporte: información física de la mascota.
 * Campos: nombre, especie, raza, sexo, tamaño, colores, características, identificativos.
 */

import React from 'react';
import type { ReportFormData, PetSex, PetSize } from '../../types/form.types';
import { ReportType } from '@/types';

interface Step2PetInfoProps {
  data: ReportFormData;
  onChange: (patch: Partial<ReportFormData>) => void;
}

// ---------------------------------------------------------------------------
// Datos de referencia
// ---------------------------------------------------------------------------

const SPECIES = [
  { value: 'DOG', label: 'Perro' },
  { value: 'CAT', label: 'Gato' },
  { value: 'BIRD', label: 'Ave' },
  { value: 'RABBIT', label: 'Conejo' },
  { value: 'OTHER', label: 'Otro' },
];

const SEX_OPTIONS: { value: PetSex; label: string; emoji: string }[] = [
  { value: 'MALE', label: 'Macho', emoji: '♂️' },
  { value: 'FEMALE', label: 'Hembra', emoji: '♀️' },
  { value: 'UNKNOWN', label: 'No sé', emoji: '❓' },
];

const SIZE_OPTIONS: { value: PetSize; label: string; desc: string; emoji: string }[] = [
  { value: 'SMALL', label: 'Pequeño', desc: 'Menos de 5 kg', emoji: '🐹' },
  { value: 'MEDIUM', label: 'Mediano', desc: '5 – 20 kg', emoji: '🐕' },
  { value: 'LARGE', label: 'Grande', desc: 'Más de 20 kg', emoji: '🦮' },
];

const IDENTIFIER_OPTIONS = [
  { value: 'collar', label: 'Collar / Placa', emoji: '🏷️' },
  { value: 'microchip', label: 'Microchip', emoji: '📡' },
  { value: 'tattoo', label: 'Tatuaje', emoji: '✍️' },
  { value: 'none', label: 'Ninguno', emoji: '❌' },
];

// ---------------------------------------------------------------------------
// Sub-componentes
// ---------------------------------------------------------------------------

const FieldLabel = ({ children, required }: { children: React.ReactNode; required?: boolean }) => (
  <label className="block text-sm font-semibold text-thistle-200 mb-2">
    {children}
    {required && <span className="text-baby_pink-400 ml-1">*</span>}
  </label>
);

const inputClass =
  'w-full px-4 py-3 rounded-xl border-2 border-thistle-600 bg-thistle-900 text-thistle-100 text-sm placeholder-thistle-500 outline-none focus:border-baby_pink-400 transition-colors duration-200';

// ---------------------------------------------------------------------------
// Componente principal
// ---------------------------------------------------------------------------

const Step2PetInfo = ({ data, onChange }: Step2PetInfoProps) => {

  const toggleIdentifier = (id: string) => {
    if (id === 'none') {
      // Si selecciona "ninguno", desmarca todos los demás
      onChange({ identifiers: data.identifiers.includes('none') ? [] : ['none'] });
      return;
    }
    const withoutNone = data.identifiers.filter((i) => i !== 'none');
    const updated = withoutNone.includes(id)
      ? withoutNone.filter((i) => i !== id)
      : [...withoutNone, id];
    onChange({ identifiers: updated });
  };

  const namePlaceholder =
    data.type === ReportType.FOUND
      ? 'Desconocido (mascota encontrada)'
      : 'Ej: Max, Luna, Simba…';

  return (
    <div className="space-y-7">
      <div>
        <h2 className="text-2xl font-extrabold text-thistle-100 mb-1">
          Descripción de la mascota
        </h2>
        <p className="text-sm text-thistle-400">
          Completa la mayor cantidad de detalles posibles. Esto ayuda a identificar a la mascota más rápido.
        </p>
      </div>

      {/* Grid 2 columnas en tablet+ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

        {/* Nombre */}
        <div className="sm:col-span-2">
          <FieldLabel>Nombre de la mascota</FieldLabel>
          <input
            id="pet-name"
            type="text"
            value={data.animalName}
            onChange={(e) => onChange({ animalName: e.target.value })}
            placeholder={namePlaceholder}
            className={inputClass}
          />
          <p className="text-xs text-thistle-500 mt-1">Si no conoces el nombre, déjalo en blanco.</p>
        </div>

        {/* Especie */}
        <div>
          <FieldLabel required>Especie</FieldLabel>
          <select
            id="pet-species"
            value={data.species}
            onChange={(e) => onChange({ species: e.target.value })}
            className={`${inputClass} cursor-pointer`}
          >
            <option value="">Selecciona una especie</option>
            {SPECIES.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>

        {/* Raza */}
        <div>
          <FieldLabel>Raza</FieldLabel>
          <input
            id="pet-breed"
            type="text"
            value={data.breed}
            onChange={(e) => onChange({ breed: e.target.value })}
            placeholder="Ej: Labrador, Mestizo, Siamés…"
            className={inputClass}
          />
        </div>

      </div>

      {/* Sexo */}
      <div>
        <FieldLabel required>Sexo</FieldLabel>
        <div className="flex flex-wrap gap-3">
          {SEX_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onChange({ sex: opt.value })}
              className={`
                flex items-center gap-2 px-5 py-3 rounded-2xl border-2 text-sm font-semibold
                transition-all duration-200 cursor-pointer min-h-[44px]
                ${data.sex === opt.value
                  ? 'bg-thistle-400 text-white border-thistle-400 shadow-md'
                  : 'bg-thistle-900 text-thistle-300 border-thistle-600 hover:border-thistle-400 hover:bg-thistle-800'
                }
              `}
            >
              <span>{opt.emoji}</span>
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tamaño */}
      <div>
        <FieldLabel required>Tamaño</FieldLabel>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {SIZE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onChange({ size: opt.value })}
              className={`
                flex flex-col items-center gap-1 px-4 py-4 rounded-2xl border-2
                text-center transition-all duration-200 cursor-pointer min-h-[44px]
                ${data.size === opt.value
                  ? 'bg-sky_blue-800 text-sky_blue-100 border-sky_blue-400 shadow-md'
                  : 'bg-thistle-900 text-thistle-300 border-thistle-600 hover:border-sky_blue-400 hover:bg-sky_blue-900'
                }
              `}
            >
              <span className="text-2xl">{opt.emoji}</span>
              <span className="font-bold text-sm">{opt.label}</span>
              <span className="text-xs opacity-70">{opt.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Color del pelaje */}
      <div>
        <FieldLabel required>Color del pelaje</FieldLabel>
        <input
          id="pet-color"
          type="text"
          value={data.color}
          onChange={(e) => onChange({ color: e.target.value })}
          placeholder="Ej: Dorado, Negro con manchas blancas, Blanco, Tricolor…"
          className={inputClass}
        />
        <p className="text-xs text-thistle-500 mt-1">
          Escribe el color o combinación de colores de la mascota.
        </p>
      </div>

      {/* Características físicas */}
      <div>
        <FieldLabel>Características físicas</FieldLabel>
        <textarea
          id="pet-characteristics"
          value={data.characteristics}
          onChange={(e) => onChange({ characteristics: e.target.value })}
          placeholder="Ej: Tiene una mancha negra sobre el ojo izquierdo, cola corta, orejas caídas…"
          rows={3}
          className={`${inputClass} resize-none`}
        />
      </div>

      {/* Identificativos */}
      <div>
        <FieldLabel>Identificativos</FieldLabel>
        <div className="flex flex-wrap gap-3">
          {IDENTIFIER_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => toggleIdentifier(opt.value)}
              className={`
                flex items-center gap-2 px-4 py-3 rounded-2xl border-2 text-sm font-medium
                transition-all duration-200 cursor-pointer min-h-[44px]
                ${data.identifiers.includes(opt.value)
                  ? 'bg-icy_blue-800 text-icy_blue-100 border-sky_blue-400 shadow-sm'
                  : 'bg-thistle-900 text-thistle-300 border-thistle-600 hover:border-sky_blue-400 hover:bg-thistle-800'
                }
              `}
            >
              <span>{opt.emoji}</span>
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Step2PetInfo;

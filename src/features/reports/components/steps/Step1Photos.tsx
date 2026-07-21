/**
 * @file features/reports/components/steps/Step1Photos.tsx
 * @description Paso 1 del formulario de reporte: subida de imágenes de la mascota.
 * Drag & drop, preview en grilla y validación de mínimo 1 imagen.
 */

import React, { useCallback, useRef } from 'react';
import type { ReportFormData } from '../../types/form.types';

interface Step1PhotosProps {
  data: ReportFormData;
  onChange: (patch: Partial<ReportFormData>) => void;
}

const MAX_IMAGES = 6;
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

const Step1Photos = ({ data, onChange }: Step1PhotosProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const processFiles = useCallback(
    (files: FileList | File[]) => {
      const fileArray = Array.from(files);
      const remaining = MAX_IMAGES - data.images.length;
      const toAdd = fileArray
        .filter((f) => ACCEPTED_TYPES.includes(f.type))
        .slice(0, remaining);

      if (toAdd.length === 0) return;

      const newPreviews: string[] = [];
      let loaded = 0;

      toAdd.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          newPreviews.push(e.target?.result as string);
          loaded++;
          if (loaded === toAdd.length) {
            onChange({
              images: [...data.images, ...toAdd],
              imagePreviews: [...data.imagePreviews, ...newPreviews],
            });
          }
        };
        reader.readAsDataURL(file);
      });
    },
    [data.images, data.imagePreviews, onChange],
  );

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) processFiles(e.target.files);
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    processFiles(e.dataTransfer.files);
  };

  const removeImage = (index: number) => {
    const newImages = data.images.filter((_, i) => i !== index);
    const newPreviews = data.imagePreviews.filter((_, i) => i !== index);
    onChange({ images: newImages, imagePreviews: newPreviews });
  };

  const isFull = data.images.length >= MAX_IMAGES;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-thistle-100 mb-1">
          Fotos de la mascota
        </h2>
        <p className="text-sm text-thistle-400">
          Una buena foto aumenta las probabilidades de reconocimiento. Sube al menos 1 imagen,
          máximo {MAX_IMAGES}.
        </p>
      </div>

      {/* Zona de drag & drop */}
      {!isFull && (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => inputRef.current?.click()}
          className="
            relative border-2 border-dashed border-thistle-500 rounded-3xl
            bg-thistle-900 hover:bg-thistle-800 hover:border-baby_pink-400
            transition-all duration-200 cursor-pointer
            flex flex-col items-center justify-center
            py-12 px-6 text-center group
            min-h-[180px]
          "
        >
          <div className="w-14 h-14 rounded-2xl bg-thistle-800 group-hover:bg-thistle-700 flex items-center justify-center mb-4 transition-colors duration-200">
            <svg className="w-7 h-7 text-thistle-400 group-hover:text-baby_pink-400 transition-colors duration-200"
              fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
          </div>
          <p className="text-sm font-semibold text-thistle-300 group-hover:text-thistle-100 transition-colors">
            Arrastra tus fotos aquí o{' '}
            <span className="text-baby_pink-400 underline underline-offset-2">haz clic para seleccionar</span>
          </p>
          <p className="text-xs text-thistle-500 mt-2">
            JPG, PNG, WebP — Máximo {MAX_IMAGES - data.images.length} foto
            {MAX_IMAGES - data.images.length !== 1 ? 's' : ''} más
          </p>

          <input
            ref={inputRef}
            type="file"
            multiple
            accept={ACCEPTED_TYPES.join(',')}
            onChange={handleFileInput}
            className="hidden"
          />
        </div>
      )}

      {/* Grid de previews */}
      {data.imagePreviews.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-thistle-400 mb-3 uppercase tracking-wide">
            {data.imagePreviews.length} de {MAX_IMAGES} fotos
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {data.imagePreviews.map((src, i) => (
              <div
                key={i}
                className="relative aspect-square rounded-2xl overflow-hidden border-2 border-thistle-700 group/img shadow-sm"
              >
                <img
                  src={src}
                  alt={`Foto ${i + 1}`}
                  className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-300"
                />
                {/* Overlay con badge y botón eliminar */}
                <div className="absolute inset-0 bg-black/0 group-hover/img:bg-black/30 transition-all duration-200 flex items-start justify-between p-2">
                  {i === 0 && (
                    <span className="text-xs font-bold px-2 py-0.5 bg-baby_pink-400 text-white rounded-full">
                      Principal
                    </span>
                  )}
                  <button
                    onClick={(e) => { e.stopPropagation(); removeImage(i); }}
                    className="
                      ml-auto w-7 h-7 rounded-full bg-black/60 text-white
                      flex items-center justify-center
                      opacity-0 group-hover/img:opacity-100
                      transition-opacity duration-200 cursor-pointer
                      hover:bg-baby_pink-400
                    "
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}

            {/* Slot vacío para agregar más */}
            {!isFull && data.imagePreviews.length > 0 && (
              <button
                onClick={() => inputRef.current?.click()}
                className="
                  aspect-square rounded-2xl border-2 border-dashed border-thistle-600
                  hover:border-baby_pink-400 bg-thistle-900 hover:bg-thistle-800
                  flex flex-col items-center justify-center gap-1
                  transition-all duration-200 cursor-pointer
                "
              >
                <svg className="w-6 h-6 text-thistle-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span className="text-xs text-thistle-500">Agregar</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Tip */}
      <div className="flex gap-3 bg-icy_blue-900 border border-icy_blue-700 rounded-2xl p-4">
        <svg className="w-5 h-5 text-sky_blue-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div className="text-xs text-sky_blue-200 space-y-1">
          <p className="font-semibold">Consejos para mejores fotos</p>
          <ul className="text-icy_blue-400 space-y-0.5">
            <li>• Toma fotos con buena iluminación natural</li>
            <li>• Muestra la cara y el cuerpo completo si es posible</li>
            <li>• Incluye detalles como manchas, collar o cicatrices</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Step1Photos;

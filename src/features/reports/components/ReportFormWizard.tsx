/**
 * @file features/reports/components/ReportFormWizard.tsx
 * @description Wizard multi-paso para el formulario de creación de reportes.
 * Contiene la barra de progreso, navegación Atrás/Siguiente y el estado compartido del formulario.
 */

import { useState } from 'react';
import { ReportType } from '@/types';
import apiClient from '@/services/api';
import type { ReportFormData } from '../types/form.types';
import { INITIAL_FORM_DATA, REPORT_TYPE_CONFIGS } from '../types/form.types';
import Step1Photos from './steps/Step1Photos';
import Step2PetInfo from './steps/Step2PetInfo';
import Step3Location from './steps/Step3Location';
import Step4Extra from './steps/Step4Extra';

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------

interface ReportFormWizardProps {
  reportType: ReportType;
  onBack: () => void;
}

// ---------------------------------------------------------------------------
// Configuración de pasos
// ---------------------------------------------------------------------------

interface StepConfig {
  label: string;
  shortLabel: string;
  icon: string;
}

const STEPS: StepConfig[] = [
  { label: 'Fotos', shortLabel: 'Fotos', icon: '📷' },
  { label: 'Mascota', shortLabel: 'Mascota', icon: '🐾' },
  { label: 'Ubicación', shortLabel: 'Ubicación', icon: '📍' },
  { label: 'Revisar y publicar', shortLabel: 'Revisar', icon: '✅' },
];

// ---------------------------------------------------------------------------
// Sub-componente: Barra de progreso
// ---------------------------------------------------------------------------

const ProgressBar = ({
  currentStep,
  totalSteps,
}: {
  currentStep: number;
  totalSteps: number;
}) => (
  <div className="w-full bg-thistle-800 rounded-full h-1.5 mb-1">
    <div
      className="bg-gradient-to-r from-baby_pink-400 to-pastel_petal-400 h-1.5 rounded-full transition-all duration-500"
      style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
    />
  </div>
);

// ---------------------------------------------------------------------------
// Sub-componente: Cabecera del wizard
// ---------------------------------------------------------------------------

const WizardHeader = ({
  currentStep,
  reportType,
  onBack,
}: {
  currentStep: number;
  reportType: ReportType;
  onBack: () => void;
}) => {
  const typeConfig = REPORT_TYPE_CONFIGS.find((c) => c.type === reportType);
  const totalSteps = STEPS.length;

  return (
    <div className="bg-white border-b border-thistle-700 sticky top-16 z-30 shadow-sm">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4">
        {/* Tipo de reporte + volver */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-sm font-medium text-thistle-400 hover:text-thistle-200 transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Cambiar tipo
          </button>

          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold ${typeConfig?.colorScheme.badge ?? 'bg-thistle-400'} ${typeConfig?.colorScheme.badgeText ?? 'text-white'}`}>
            <span>{typeConfig?.icon}</span>
            {typeConfig?.title}
          </div>
        </div>

        {/* Barra de progreso */}
        <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
        <p className="text-xs text-thistle-500 text-right mt-1">
          Paso {currentStep + 1} de {totalSteps}
        </p>

        {/* Indicadores de pasos */}
        <div className="flex items-center justify-between mt-3">
          {STEPS.map((step, i) => (
            <div
              key={i}
              className={`flex flex-col items-center gap-1 flex-1 ${i < STEPS.length - 1 ? 'relative' : ''}`}
            >
              {/* Línea entre pasos */}
              {i < STEPS.length - 1 && (
                <div
                  className={`absolute top-3.5 left-1/2 w-full h-0.5 transition-colors duration-300 ${i < currentStep ? 'bg-baby_pink-400' : 'bg-thistle-700'}`}
                />
              )}

              {/* Círculo */}
              <div
                className={`
                  relative z-10 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold
                  border-2 transition-all duration-300
                  ${i < currentStep
                    ? 'bg-baby_pink-400 border-baby_pink-400 text-white'
                    : i === currentStep
                    ? 'bg-white border-baby_pink-400 text-baby_pink-400 shadow-md shadow-baby_pink-400/30'
                    : 'bg-white border-thistle-600 text-thistle-500'
                  }
                `}
              >
                {i < currentStep ? (
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  i + 1
                )}
              </div>

              {/* Label */}
              <span
                className={`text-[10px] font-medium hidden sm:block transition-colors duration-200 ${
                  i === currentStep ? 'text-baby_pink-400' : i < currentStep ? 'text-thistle-400' : 'text-thistle-600'
                }`}
              >
                {step.shortLabel}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Validación por paso
// ---------------------------------------------------------------------------

const validateStep = (step: number, data: ReportFormData): string | null => {
  switch (step) {
    case 0:
      if (data.images.length === 0) return 'Debes subir al menos una foto de la mascota.';
      return null;
    case 1:
      if (!data.species) return 'Debes seleccionar la especie de la mascota.';
      if (data.colors.length === 0) return 'Debes seleccionar al menos un color.';
      return null;
    case 2:
      if (!data.region) return 'Debes seleccionar una región.';
      if (!data.comuna) return 'Debes seleccionar una comuna.';
      if (!data.address.trim()) return 'Debes indicar la dirección o sector.';
      if (!data.phone.trim()) return 'Debes ingresar un teléfono de contacto.';
      return null;
    default:
      return null;
  }
};

// ---------------------------------------------------------------------------
// Componente principal
// ---------------------------------------------------------------------------

const ReportFormWizard = ({ reportType, onBack }: ReportFormWizardProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<ReportFormData>({
    type: reportType,
    ...INITIAL_FORM_DATA,
  });
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (patch: Partial<ReportFormData>) => {
    setFormData((prev) => ({ ...prev, ...patch }));
    if (validationError) setValidationError(null);
  };

  const handleNext = () => {
    const error = validateStep(currentStep, formData);
    if (error) {
      setValidationError(error);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setValidationError(null);
    setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrev = () => {
    setValidationError(null);
    setCurrentStep((prev) => Math.max(prev - 1, 0));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setValidationError(null);

      const res = await apiClient.post('/reports', formData);

      if (res.data && res.data.success) {
        setSubmitted(true);
      } else {
        setValidationError(res.data?.message || 'No se pudo crear el reporte.');
      }
    } catch (err: any) {
      console.error('Error al publicar el reporte:', err);
      setValidationError(
        err.response?.data?.message || 'Ocurrió un error al intentar guardar el reporte en la base de datos.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Pantalla de éxito ──
  if (submitted) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="text-7xl mb-6 animate-bounce">🐾</div>
        <h2 className="text-3xl font-extrabold text-thistle-100 mb-3">¡Reporte publicado!</h2>
        <p className="text-thistle-400 text-base mb-8 leading-relaxed">
          Tu reporte está siendo revisado por nuestro equipo y será visible en la plataforma en breve.
          La comunidad ya puede ayudarte.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="/"
            className="px-6 py-3.5 bg-gradient-to-r from-baby_pink-400 to-pastel_petal-400 text-white font-bold rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 min-h-[44px] flex items-center justify-center"
          >
            Ver todos los reportes
          </a>
          <a
            href="/reportes/nuevo"
            className="px-6 py-3.5 border-2 border-thistle-500 text-thistle-300 font-semibold rounded-2xl hover:bg-thistle-800 transition-all duration-200 min-h-[44px] flex items-center justify-center"
          >
            Crear otro reporte
          </a>
        </div>
      </div>
    );
  }

  return (
    <>
      <WizardHeader currentStep={currentStep} reportType={reportType} onBack={onBack} />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        {/* Error de validación */}
        {validationError && (
          <div className="mb-6 flex items-start gap-3 bg-baby_pink-900 border border-baby_pink-400/50 rounded-2xl p-4">
            <svg className="w-5 h-5 text-baby_pink-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-baby_pink-200 font-medium">{validationError}</p>
          </div>
        )}

        {/* Contenido del paso actual */}
        {currentStep === 0 && <Step1Photos data={formData} onChange={handleChange} />}
        {currentStep === 1 && <Step2PetInfo data={formData} onChange={handleChange} />}
        {currentStep === 2 && <Step3Location data={formData} onChange={handleChange} />}
        {currentStep === 3 && (
          <Step4Extra
            data={formData}
            onChange={handleChange}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        )}

        {/* Navegación inferior */}
        <div className="flex items-center justify-between gap-4 mt-10 pt-6 border-t border-thistle-700">
          <button
            onClick={handlePrev}
            disabled={currentStep === 0}
            className="
              flex items-center gap-2 px-5 py-3 rounded-2xl border-2 border-thistle-600
              text-thistle-300 font-semibold text-sm
              hover:bg-thistle-800 hover:border-thistle-500
              transition-all duration-200 cursor-pointer min-h-[44px]
              disabled:opacity-40 disabled:cursor-not-allowed
            "
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Atrás
          </button>

          {currentStep < STEPS.length - 1 && (
            <button
              onClick={handleNext}
              className="
                flex items-center gap-2 px-6 py-3 rounded-2xl
                bg-gradient-to-r from-baby_pink-400 to-pastel_petal-400 text-white
                font-bold text-sm shadow-md hover:shadow-lg
                hover:from-baby_pink-300 hover:to-pastel_petal-300
                transition-all duration-200 cursor-pointer min-h-[44px]
              "
            >
              Siguiente
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default ReportFormWizard;

/**
 * @file features/reports/types/form.types.ts
 * @description Interfaces TypeScript para el formulario de creación de reportes.
 */

import { ReportType } from '@/types';

// ---------------------------------------------------------------------------
// Enums del formulario
// ---------------------------------------------------------------------------

export type PetSex = 'MALE' | 'FEMALE' | 'UNKNOWN';
export type PetSize = 'SMALL' | 'MEDIUM' | 'LARGE';

// ---------------------------------------------------------------------------
// Datos del formulario
// ---------------------------------------------------------------------------

export interface ReportFormData {
  /** Tipo de reporte seleccionado en el paso 0 */
  type: ReportType;

  // Paso 1 — Fotos
  images: File[];
  imagePreviews: string[];

  // Paso 2 — Info mascota
  animalName: string;
  species: string;
  breed: string;
  sex: PetSex;
  size: PetSize;
  color: string;
  characteristics: string;
  identifiers: string[];

  // Paso 3 — Ubicación y contacto
  region: string;
  regionLabel: string;
  comuna: string;
  address: string;
  phone: string;

  // Paso 4 — Adicional
  incidentDate: string;
  additionalInfo: string;
}

// ---------------------------------------------------------------------------
// Valores iniciales
// ---------------------------------------------------------------------------

export const INITIAL_FORM_DATA: Omit<ReportFormData, 'type'> = {
  images: [],
  imagePreviews: [],
  animalName: '',
  species: '',
  breed: '',
  sex: 'UNKNOWN',
  size: 'MEDIUM',
  color: '',
  characteristics: '',
  identifiers: [],
  region: '',
  regionLabel: '',
  comuna: '',
  address: '',
  phone: '',
  incidentDate: '',
  additionalInfo: '',
};

// ---------------------------------------------------------------------------
// Configuración de tipos de reporte
// ---------------------------------------------------------------------------

export interface ReportTypeConfig {
  type: ReportType;
  title: string;
  subtitle: string;
  description: string;
  whenToUse: string[];
  icon: string;
  urgency: 'high' | 'low';
  colorScheme: {
    bg: string;
    border: string;
    badge: string;
    badgeText: string;
    btnBg: string;
    btnText: string;
    iconBg: string;
    titleColor: string;
  };
}

export const REPORT_TYPE_CONFIGS: ReportTypeConfig[] = [
  {
    type: ReportType.LOST,
    title: 'Mascota Desaparecida',
    subtitle: 'Mi mascota se perdió',
    description:
      'Usa este reporte si eres el dueño/a y tu mascota se perdió o escapó. Publicaremos una alerta para que la comunidad te ayude a encontrarla.',
    whenToUse: [
      'Tu perro o gato escapó de tu hogar',
      'Tu mascota no regresó después de salir',
      'Se perdió durante un paseo o traslado',
      'Desapareció hace poco y no sabes dónde está',
    ],
    icon: '🔍',
    urgency: 'high',
    colorScheme: {
      bg: 'bg-baby_pink-900',
      border: 'border-baby_pink-400',
      badge: 'bg-baby_pink-300',
      badgeText: 'text-white',
      btnBg: 'bg-gradient-to-r from-baby_pink-400 to-pastel_petal-400',
      btnText: 'text-white',
      iconBg: 'bg-baby_pink-800',
      titleColor: 'text-baby_pink-100',
    },
  },
  {
    type: ReportType.FOUND,
    title: 'Mascota Encontrada',
    subtitle: 'Encontré una mascota',
    description:
      'Usa este reporte si encontraste a un animal que parece perdido o sin dueño. Tu reporte puede reunir a la mascota con su familia.',
    whenToUse: [
      'Encontraste un animal en la calle sin collar',
      'Parece desorientado, asustado o en peligro',
      'Alguien lo abandonó o dejó amarrado',
      'Lo tienes bajo cuidado temporal mientras buscas al dueño',
    ],
    icon: '🏠',
    urgency: 'high',
    colorScheme: {
      bg: 'bg-sky_blue-900',
      border: 'border-sky_blue-400',
      badge: 'bg-sky_blue-300',
      badgeText: 'text-white',
      btnBg: 'bg-gradient-to-r from-sky_blue-400 to-icy_blue-300',
      btnText: 'text-white',
      iconBg: 'bg-sky_blue-800',
      titleColor: 'text-sky_blue-100',
    },
  },
  {
    type: ReportType.ADOPTION,
    title: 'Mascota en Adopción',
    subtitle: 'Dar a una mascota en adopción',
    description:
      'Usa este reporte para encontrar un hogar responsable para una mascota. Puedes ser el dueño actual o estar rescatando a un animal de la calle.',
    whenToUse: [
      'Quieres dar en adopción a tu mascota',
      'Rescataste un animal y buscas hogar para él',
      'Una fundación o refugio publica animales disponibles',
      'Cuidas temporalmente a un animal y necesitas adoptante',
    ],
    icon: '💜',
    urgency: 'low',
    colorScheme: {
      bg: 'bg-thistle-900',
      border: 'border-thistle-400',
      badge: 'bg-thistle-400',
      badgeText: 'text-white',
      btnBg: 'bg-gradient-to-r from-thistle-400 to-thistle-300',
      btnText: 'text-white',
      iconBg: 'bg-thistle-800',
      titleColor: 'text-thistle-100',
    },
  },
];

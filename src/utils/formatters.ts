/**
 * @file utils/formatters.ts
 * @description Utilidades de formateo para traducir valores de enums de la base de datos (en inglés)
 * a etiquetas comprensibles en español para el usuario.
 */

/**
 * Traduce el valor de especie (DB Enum: DOG, CAT, BIRD, RABBIT, OTHER) a texto en español.
 */
export const formatSpecies = (species?: string): string => {
  if (!species) return 'Mascota';
  const s = species.toUpperCase();
  switch (s) {
    case 'DOG':
    case 'PERRO':
      return 'Perro';
    case 'CAT':
    case 'GATO':
    case 'GATA':
      return 'Gato';
    case 'BIRD':
    case 'AVE':
    case 'PAJARO':
    case 'PÁJARO':
      return 'Ave';
    case 'RABBIT':
    case 'CONEJO':
      return 'Conejo';
    case 'OTHER':
    case 'OTRO':
      return 'Otro';
    default:
      return species;
  }
};

/**
 * Traduce el valor de sexo (DB Enum: MALE, FEMALE, UNKNOWN) a texto en español.
 */
export const formatSex = (sex?: string): string => {
  if (!sex) return 'No especificado';
  const s = sex.toUpperCase();
  switch (s) {
    case 'MALE':
    case 'MACHO':
      return 'Macho';
    case 'FEMALE':
    case 'HEMBRA':
      return 'Hembra';
    case 'UNKNOWN':
    case 'DESCONOCIDO':
    case 'NO SÉ':
    case 'NO SE':
      return 'Desconocido';
    default:
      return sex;
  }
};

/**
 * Traduce el valor de tamaño (DB Enum: SMALL, MEDIUM, LARGE, GIANT) a texto en español.
 */
export const formatSize = (size?: string): string => {
  if (!size) return 'Mediano';
  const s = size.toUpperCase();
  switch (s) {
    case 'SMALL':
    case 'PEQUEÑO':
    case 'PEQUENO':
      return 'Pequeño';
    case 'MEDIUM':
    case 'MEDIANO':
      return 'Mediano';
    case 'LARGE':
    case 'GRANDE':
      return 'Grande';
    case 'GIANT':
    case 'GIGANTE':
      return 'Gigante';
    default:
      return size;
  }
};

/**
 * Formatea una URL de imagen para asegurar que tenga la ruta completa del backend si es relativa (ej. /uploads/...).
 */
export const formatImageUrl = (
  url?: string,
  fallback = 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&q=80'
): string => {
  if (!url) return fallback;

  // Si ya es una URL absoluta (http, https) o datos base64
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
    return url;
  }

  // Obtener la URL base del backend desde VITE_API_URL o fallback local
  const apiUrl = import.meta.env['VITE_API_URL'] || 'http://localhost:3000/api/v1';
  let backendOrigin = 'http://localhost:3000';

  try {
    const parsed = new URL(apiUrl);
    backendOrigin = parsed.origin;
  } catch {
    backendOrigin = 'http://localhost:3000';
  }

  const cleanPath = url.startsWith('/') ? url : `/${url}`;
  return `${backendOrigin}${cleanPath}`;
};

/**
 * Traduce el estado del reporte a texto en español.
 */
export const formatStatus = (status?: string): string => {
  if (!status) return 'En revisión';
  const s = status.toUpperCase();
  switch (s) {
    case 'ACTIVE':
    case 'ACTIVO':
      return 'Activo';
    case 'PENDING_REVIEW':
    case 'PENDIENTE':
    case 'REVISIÓN':
    case 'REVISION':
      return 'En revisión';
    case 'REJECTED':
    case 'RECHAZADO':
      return 'Rechazado';
    case 'DESISTED':
    case 'DESISTIDO':
      return 'Desistido';
    case 'RESOLVED':
    case 'RESUELTO':
      return 'Resuelto';
    case 'DRAFT':
    case 'BORRADOR':
      return 'Borrador';
    default:
      return status;
  }
};

/**
 * Formatea un RUT chileno agregando puntos y guión (ej: 12.345.678-K).
 */
export const formatRut = (rut?: string): string => {
  if (!rut) return '';
  const cleaned = rut.replace(/[^0-9kK]/g, '');
  if (cleaned.length < 2) return cleaned.toUpperCase();

  const body = cleaned.slice(0, -1);
  const dv = cleaned.slice(-1).toUpperCase();

  const formattedBody = body.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `${formattedBody}-${dv}`;
};

/**
 * Dataset de regiones para mapeo rápido si es un slug o texto sin formato
 */
const REGIONES_LABEL_MAP: Record<string, string> = {
  'arica-parinacota': 'Arica y Parinacota',
  'tarapaca': 'Tarapacá',
  'antofagasta': 'Antofagasta',
  'atacama': 'Atacama',
  'coquimbo': 'Coquimbo',
  'valparaiso': 'Valparaíso',
  'region-metropolitana': 'Región Metropolitana de Santiago',
  'rm': 'Región Metropolitana de Santiago',
  'ohiggins': "O'Higgins",
  'maule': 'Maule',
  'nuble': 'Ñuble',
  'biobio': 'Biobío',
  'araucania': 'La Araucanía',
  'los-rios': 'Los Ríos',
  'los-lagos': 'Los Lagos',
  'aysen': 'Aysén',
  'magallanes': 'Magallanes',
};

/**
 * Formatea el texto de una región para asegurar que se muestre en un formato legible
 * (ej. convierte 'arica-parinacota' o 'valparaiso' -> 'Arica y Parinacota', 'Valparaíso').
 */
export const formatRegion = (region?: string): string => {
  if (!region) return '';

  const clean = region.trim().toLowerCase();

  // Buscar en el diccionario de slugs
  if (REGIONES_LABEL_MAP[clean]) {
    return REGIONES_LABEL_MAP[clean];
  }

  // Si ya tiene acentos o formato con mayúsculas/espacios
  // Reemplazar guiones/guiones bajos
  const withSpaces = region.replace(/[-_]/g, ' ');

  // Si ya es un texto legible (ej: "Región Metropolitana de Santiago" o "Valparaíso")
  if (withSpaces.match(/[A-ZÁÉÍÓÚÑa-záéíóúñ]/)) {
    return withSpaces
      .split(' ')
      .map((word) => {
        const lower = word.toLowerCase();
        if (['y', 'de', 'del', 'la', 'las', 'los'].includes(lower)) return lower;
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      })
      .join(' ')
      .replace(/^(\w)/, (m) => m.toUpperCase());
  }

  return region;
};




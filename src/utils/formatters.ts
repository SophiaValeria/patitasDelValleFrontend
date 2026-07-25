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


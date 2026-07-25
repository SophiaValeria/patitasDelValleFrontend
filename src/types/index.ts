/**
 * @file types/index.ts
 * @description Interfaces TypeScript globales y enums del dominio de negocio.
 * Alineados con MongoDB (_id) y la API del backend de Patitas del Valle.
 */

// ---------------------------------------------------------------------------
// Enums
// ---------------------------------------------------------------------------

/** Estados del ciclo de vida de un reporte */
export enum ReportStatus {
  /** Borrador — guardado localmente, no enviado a revisión */
  DRAFT = 'DRAFT',
  /** Enviado — en cola de revisión por moderadores */
  PENDING_REVIEW = 'PENDING_REVIEW',
  /** Publicado — visible para todos los usuarios */
  ACTIVE = 'ACTIVE',
  /** Rechazado — no cumple las políticas de la plataforma */
  REJECTED = 'REJECTED',
  /** Desistido — cancelado por el usuario autor mientras estaba en revisión */
  DESISTED = 'DESISTED',
  /** Resuelto — mascota encontrada / adoptada */
  RESOLVED = 'RESOLVED',
}

/** Tipo de reporte de mascota */
export enum ReportType {
  /** Mascota perdida reportada por su dueño */
  LOST = 'LOST',
  /** Mascota encontrada reportada por un ciudadano */
  FOUND = 'FOUND',
  /** Mascota disponible para adopción */
  ADOPTION = 'ADOPTION',
}

/** Rol del usuario en el sistema */
export enum UserRole {
  /** Usuario registrado estándar */
  USER = 'USER',
  /** Moderador con permisos de revisión de reportes */
  ADMIN = 'ADMIN',
}

// ---------------------------------------------------------------------------
// Interfaces de dominio
// ---------------------------------------------------------------------------

/** Representación de una imagen adjunta a un reporte */
export interface ReportImage {
  /** URL pública de la imagen (almacenada en cloud storage) */
  url: string;
  /** Clave/path en el bucket de storage para gestión interna */
  storageKey: string;
}

/** Coordenadas geográficas del lugar del incidente */
export interface Coordinates {
  /** Latitud decimal */
  lat: number;
  /** Longitud decimal */
  lng: number;
}

/** Ubicación adjunta a un reporte */
export interface ReportLocation {
  /** Descripción legible del lugar (barrio, dirección aproximada) */
  address: string;
  /** Coordenadas GPS opcionales */
  coordinates?: Coordinates;
}

/**
 * Entidad Usuario — mapeada con el modelo de MongoDB.
 * El campo _id corresponde al ObjectId de Mongo serializado como string.
 */
export interface User {
  /** ObjectId de MongoDB serializado como string */
  _id: string;
  /** Nombre completo del usuario */
  name: string;
  /** Email único utilizado para autenticación */
  email: string;
  /** Rol que determina los permisos de navegación */
  role: UserRole;
  /** RUT del usuario */
  rut: string;
  /** Celular de contacto */
  phone: string;
  /** Dirección completa */
  address: string;
  /** Región chilena */
  region: string;
  /** Comuna chilena */
  commune: string;
  /** URL del avatar del usuario (opcional, base64 o URL) */
  avatarUrl?: string;
  /** Fecha de creación de la cuenta (ISO 8601) */
  createdAt: string;
  /** Fecha de última actualización (ISO 8601) */
  updatedAt: string;
}

/**
 * Entidad Reporte — mapeada con el modelo de MongoDB.
 * Cubre los tres tipos: mascota perdida, encontrada o en adopción.
 */
export interface Report {
  /** ObjectId de MongoDB serializado como string */
  _id: string;
  /** Tipo de reporte */
  type: ReportType;
  /** Estado actual en el flujo de moderación */
  status: ReportStatus;
  /** Especie del animal (ej: "Perro", "Gato", "Ave") */
  species: string;
  /** Raza del animal (opcional) */
  breed?: string;
  /** Nombre del animal (opcional) */
  animalName?: string;
  /** Color(es) del pelaje / plumaje */
  colors: string[];
  /** Descripción detallada del animal y circunstancias */
  description: string;
  /** Imágenes adjuntas al reporte */
  images: ReportImage[];
  /** Ubicación del incidente o lugar de encuentro */
  location: ReportLocation;
  /** Fecha del incidente (ISO 8601) */
  incidentDate: string;
  /** Información de contacto del reportante */
  contactInfo: string;
  /** Usuario que creó el reporte (referencia a User._id) */
  createdBy: string | User;
  /** Motivo de rechazo, solo presente cuando status === REJECTED */
  rejectionReason?: string;
  /** Fecha de creación del documento (ISO 8601) */
  createdAt: string;
  /** Fecha de última modificación (ISO 8601) */
  updatedAt: string;
}

// ---------------------------------------------------------------------------
// Tipos de utilidad para la API
// ---------------------------------------------------------------------------

/** Respuesta estándar de la API para un recurso individual */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

/** Respuesta estándar de la API para listas paginadas */
export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/** Respuesta de error de la API */
export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}

/** Respuesta del endpoint de autenticación */
export interface AuthResponse {
  user: User;
  token: string;
}

/** Payload para login */
export interface LoginPayload {
  email: string;
  password: string;
}

/** Payload para registro */
export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  rut: string;
  phone: string;
  address: string;
  region: string;
  commune: string;
  avatarUrl?: string;
}

/** Payload para actualización de perfil */
export interface UpdateProfilePayload {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  region?: string;
  commune?: string;
  avatarUrl?: string;
}


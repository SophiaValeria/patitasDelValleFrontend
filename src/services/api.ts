/**
 * @file services/api.ts
 * @description Cliente HTTP base configurado con Axios.
 * Gestiona automáticamente:
 *  - baseURL desde la variable de entorno VITE_API_URL
 *  - Inyección del token JWT en cada request
 *  - Manejo global de errores 401 (sesión expirada)
 */

import axios, {
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
  AxiosError,
} from 'axios';

// ---------------------------------------------------------------------------
// Constantes
// ---------------------------------------------------------------------------

/** Clave usada para persistir el JWT en localStorage */
const TOKEN_KEY = 'patitas_token';

/** URL base de la API leída desde variables de entorno de Vite */
const BASE_URL = import.meta.env['VITE_API_URL'] ?? 'http://localhost:5000/api';

// ---------------------------------------------------------------------------
// Instancia de Axios
// ---------------------------------------------------------------------------

const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 15_000, // 15 segundos
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// ---------------------------------------------------------------------------
// Interceptor de REQUEST — inyecta el JWT en cada petición
// ---------------------------------------------------------------------------

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = localStorage.getItem(TOKEN_KEY);

    if (token !== null && token.length > 0) {
      config.headers.set('Authorization', `Bearer ${token}`);
    }

    return config;
  },
  (error: unknown) => Promise.reject(error),
);

// ---------------------------------------------------------------------------
// Interceptor de RESPONSE — maneja errores globales de autenticación
// ---------------------------------------------------------------------------

apiClient.interceptors.response.use(
  // Respuesta exitosa: la retorna sin transformación
  (response: AxiosResponse): AxiosResponse => response,

  // Respuesta con error
  (error: unknown) => {
    if (error instanceof AxiosError && error.response?.status === 401) {
      // Token expirado o inválido → limpiar sesión local y redirigir al login
      localStorage.removeItem(TOKEN_KEY);

      // Evitamos importar el router directamente para no crear dependencias circulares.
      // El redireccionamiento se maneja mediante un evento custom que AuthContext escucha.
      window.dispatchEvent(new CustomEvent('auth:session-expired'));
    }

    return Promise.reject(error);
  },
);

// ---------------------------------------------------------------------------
// Helpers para gestión del token (usados por AuthContext)
// ---------------------------------------------------------------------------

/** Persiste el JWT en localStorage */
export const setToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

/** Elimina el JWT de localStorage */
export const clearToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
};

/** Retorna el JWT almacenado, o null si no existe */
export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

// ---------------------------------------------------------------------------
// Exportación del cliente
// ---------------------------------------------------------------------------

export default apiClient;

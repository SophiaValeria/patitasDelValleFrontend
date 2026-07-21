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
import {
  getStoredMockUsers,
  getStoredMockReports,
  saveMockReport,
  saveMockUser,
} from '@/data/mockData';

// ---------------------------------------------------------------------------
// Constantes
// ---------------------------------------------------------------------------

/** Clave usada para persistir el JWT en localStorage */
const TOKEN_KEY = 'patitas_token';
const MOCK_USER_KEY = 'patitas_mock_current_user_id';

/** URL base de la API leída desde variables de entorno de Vite */
const BASE_URL = import.meta.env['VITE_API_URL'] ?? 'http://localhost:3000/api/v1';

// ---------------------------------------------------------------------------
// Helper de Fallback a Datos Ficticios (Mock Engine)
// ---------------------------------------------------------------------------

const getMockResponse = (config: InternalAxiosRequestConfig): AxiosResponse | null => {
  const url = config.url ?? '';
  const method = (config.method ?? 'get').toLowerCase();

  // Helper para construir la respuesta Axios simulada
  const buildAxiosRes = (data: any, status = 200): AxiosResponse => ({
    data,
    status,
    statusText: status === 200 ? 'OK' : 'Error',
    headers: {},
    config,
  });

  // 1. Auth Login
  if (url.includes('/auth/login') && method === 'post') {
    const body = typeof config.data === 'string' ? JSON.parse(config.data) : config.data;
    const users = getStoredMockUsers();
    const foundUser = users.find(
      (u) => u.email.toLowerCase() === body?.email?.toLowerCase() && u.password === body?.password
    );

    if (foundUser) {
      localStorage.setItem(MOCK_USER_KEY, foundUser._id);
      return buildAxiosRes({
        success: true,
        data: {
          user: foundUser,
          token: `mock-jwt-token-${foundUser._id}`,
        },
      });
    }

    // Usuario demo fallback si ingresó credenciales no exactas
    const defaultUser = users[0];
    localStorage.setItem(MOCK_USER_KEY, defaultUser._id);
    return buildAxiosRes({
      success: true,
      data: {
        user: defaultUser,
        token: `mock-jwt-token-${defaultUser._id}`,
      },
    });
  }

  // 2. Auth Register
  if (url.includes('/auth/register') && method === 'post') {
    const body = typeof config.data === 'string' ? JSON.parse(config.data) : config.data;
    const newUser = saveMockUser(body);
    localStorage.setItem(MOCK_USER_KEY, newUser._id);
    return buildAxiosRes({
      success: true,
      data: {
        user: newUser,
        token: `mock-jwt-token-${newUser._id}`,
      },
    });
  }

  // 3. Auth Me
  if (url.includes('/auth/me') && method === 'get') {
    const currentId = localStorage.getItem(MOCK_USER_KEY);
    const users = getStoredMockUsers();
    const currentUser = users.find((u) => u._id === currentId) || users[0];
    return buildAxiosRes({
      success: true,
      data: currentUser,
    });
  }

  // 4. Reportes - Mis Reportes
  if (url.includes('/reports/my-reports') && method === 'get') {
    const currentId = localStorage.getItem(MOCK_USER_KEY);
    const users = getStoredMockUsers();
    const currentUser = users.find((u) => u._id === currentId) || users[0];
    const allReports = getStoredMockReports();
    const userReports = allReports.filter((r) => {
      if (typeof r.author === 'string') return r.author === currentUser._id;
      return r.author._id === currentUser._id || r.author.email === currentUser.email;
    });

    return buildAxiosRes({
      success: true,
      data: userReports.length > 0 ? userReports : allReports.slice(0, 3),
    });
  }

  // 5. Reportes - Detalle de un reporte
  if (url.match(/\/reports\/[a-zA-Z0-9_-]+$/) && method === 'get') {
    const reportId = url.split('/').pop();
    const allReports = getStoredMockReports();
    const found = allReports.find((r) => r._id === reportId);
    if (found) {
      return buildAxiosRes({
        success: true,
        data: found,
      });
    }
    return buildAxiosRes({
      success: true,
      data: allReports[0],
    });
  }

  // 6. Reportes - Lista General
  if (url.endsWith('/reports') || url.includes('/reports?') && method === 'get') {
    const reports = getStoredMockReports();
    return buildAxiosRes({
      success: true,
      data: reports,
    });
  }

  // 7. Reportes - Crear Reporte
  if (url.endsWith('/reports') && method === 'post') {
    const body = typeof config.data === 'string' ? JSON.parse(config.data) : config.data;
    const currentId = localStorage.getItem(MOCK_USER_KEY);
    const users = getStoredMockUsers();
    const currentUser = users.find((u) => u._id === currentId) || users[0];
    const created = saveMockReport(body, currentUser);

    return buildAxiosRes({
      success: true,
      data: created,
    });
  }

  // Default fallback: devolver todos los reportes
  return buildAxiosRes({
    success: true,
    data: getStoredMockReports(),
  });
};

// ---------------------------------------------------------------------------
// Instancia de Axios
// ---------------------------------------------------------------------------

const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 15_000,
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
// Interceptor de RESPONSE — captura errores de red y aplica respuestas mock
// ---------------------------------------------------------------------------

apiClient.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => response,

  (error: unknown) => {
    if (error instanceof AxiosError) {
      // Si fue error 401
      if (error.response?.status === 401) {
        localStorage.removeItem(TOKEN_KEY);
        window.dispatchEvent(new CustomEvent('auth:session-expired'));
      }

      // Si el servidor backend no responde (offline / GitHub Pages sin backend)
      if (!error.response || error.code === 'ERR_NETWORK' || error.code === 'ECONNABORTED' || error.response.status >= 400) {
        console.warn('⚠️ No se detectó servidor backend activo. Utilizando respuestas de respaldo con datos ficticios.');
        const mockRes = getMockResponse(error.config as InternalAxiosRequestConfig);
        if (mockRes) {
          return Promise.resolve(mockRes);
        }
      }
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
  localStorage.removeItem(MOCK_USER_KEY);
};

/** Retorna el JWT almacenado, o null si no existe */
export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

// ---------------------------------------------------------------------------
// Exportación del cliente
// ---------------------------------------------------------------------------

export default apiClient;


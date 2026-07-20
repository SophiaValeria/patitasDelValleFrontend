/**
 * @file router/ProtectedRoute.tsx
 * @description Componente guard para proteger rutas que requieren autenticación
 * o un rol específico (admin). Si no se cumplen las condiciones, redirige al
 * usuario a la ruta apropiada sin renderizar los children.
 */

import { Navigate, Outlet, useLocation } from 'react-router-dom';
import type { UserRole } from '@/types';

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------

interface ProtectedRouteProps {
  /**
   * Indica si el usuario está autenticado.
   * Provendrá de AuthContext una vez implementado.
   */
  isAuthenticated: boolean;

  /**
   * Rol del usuario autenticado (opcional).
   * Si se especifica `requiredRole`, se valida contra este valor.
   */
  userRole?: UserRole;

  /**
   * Rol mínimo requerido para acceder a la ruta.
   * Si no se especifica, solo se valida la autenticación.
   */
  requiredRole?: UserRole;

  /**
   * Ruta a la que redirigir si no se cumplen las condiciones.
   * Por defecto redirige a '/login'.
   */
  redirectTo?: string;
}

// ---------------------------------------------------------------------------
// Componente
// ---------------------------------------------------------------------------

/**
 * ProtectedRoute
 *
 * Uso típico:
 * ```tsx
 * // Ruta que solo requiere autenticación
 * <Route element={<ProtectedRoute isAuthenticated={isAuth} />}>
 *   <Route path="/dashboard" element={<DashboardPage />} />
 * </Route>
 *
 * // Ruta que requiere rol de admin
 * <Route element={<ProtectedRoute isAuthenticated={isAuth} userRole={role} requiredRole={UserRole.ADMIN} redirectTo="/unauthorized" />}>
 *   <Route path="/admin" element={<AdminPage />} />
 * </Route>
 * ```
 */
const ProtectedRoute = ({
  isAuthenticated,
  userRole,
  requiredRole,
  redirectTo = '/login',
}: ProtectedRouteProps) => {
  const location = useLocation();

  // 1. Verificar autenticación
  if (!isAuthenticated) {
    // Guardamos la ubicación actual para redirigir de vuelta después del login
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // 2. Si hay un rol requerido, verificarlo
  if (requiredRole !== undefined && userRole !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  // 3. Acceso concedido — renderizar los children de la ruta anidada
  return <Outlet />;
};

export default ProtectedRoute;

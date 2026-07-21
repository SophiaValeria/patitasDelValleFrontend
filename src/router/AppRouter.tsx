/**
 * @file router/AppRouter.tsx
 * @description Árbol de rutas principal de la aplicación usando React Router v6.
 *
 * Zonas de navegación:
 *  - PÚBLICA: Home, listado de reportes, detalle, login, registro, página 404
 *  - PRIVADA (usuario autenticado): Dashboard, crear/editar reporte, perfil
 *  - ADMINISTRATIVA (rol ADMIN): Panel de revisión y gestión de estados
 *
 * TODO: Reemplazar las constantes `isAuthenticated` y `userRole` por los
 *       valores provenientes de AuthContext cuando esté implementado.
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { UserRole } from '@/types';
import ProtectedRoute from './ProtectedRoute';
import MainLayout from '@/components/layout/MainLayout';
import HomePage from '@/features/reports/pages/HomePage';
import CreateReportPage from '@/features/reports/pages/CreateReportPage';

// ---------------------------------------------------------------------------
// Placeholders de páginas — serán reemplazados por los componentes reales
// ---------------------------------------------------------------------------

import RegisterPage from '@/features/auth/pages/RegisterPage';
import LoginPage from '@/features/auth/pages/LoginPage';
import UserProfilePage from '@/features/user/pages/UserProfilePage';
import UserDashboardPage from '@/features/user/pages/UserDashboardPage';
import ReportDetailPage from '@/features/reports/pages/ReportDetailPage';

// Públicas
const ReportListPage = () => <div data-testid="page-report-list">ReportListPage — Placeholder</div>;
const NotFoundPage = () => <div data-testid="page-not-found">404 — Página no encontrada</div>;
const UnauthorizedPage = () => <div data-testid="page-unauthorized">403 — No autorizado</div>;

// Privadas (usuario autenticado)
const EditReportPage = () => <div data-testid="page-edit-report">EditReportPage — Placeholder</div>;

// Administrativas
const AdminDashboardPage = () => <div data-testid="page-admin-dashboard">AdminDashboardPage — Placeholder</div>;
const AdminReportReviewPage = () => <div data-testid="page-admin-review">AdminReportReviewPage — Placeholder</div>;
const AdminReportDetailPage = () => <div data-testid="page-admin-report-detail">AdminReportDetailPage — Placeholder</div>;

// ---------------------------------------------------------------------------
// AppRouter
// ---------------------------------------------------------------------------

/**
 * AppRouter
 *
 * Estructura de rutas:
 * ```
 * /                          → HomePage
 * /reportes                  → ReportListPage
 * /reportes/:id              → ReportDetailPage
 * /login                     → LoginPage
 * /registro                  → RegisterPage
 * /unauthorized              → UnauthorizedPage
 *
 * [Autenticado]
 * /dashboard                 → UserDashboardPage
 * /reportes/nuevo            → CreateReportPage
 * /reportes/:id/editar       → EditReportPage
 * /perfil                    → UserProfilePage
 *
 * [Admin]
 * /admin                     → AdminDashboardPage (redirect a /admin/reportes)
 * /admin/reportes            → AdminReportReviewPage
 * /admin/reportes/:id        → AdminReportDetailPage
 *
 * *                          → NotFoundPage (catch-all)
 * ```
 */
import useAuth from '@/hooks/useAuth';

const AppRouter = () => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const userRole = user?.role ?? UserRole.USER;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-thistle-900 flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 rounded-full border-4 border-baby_pink-400 border-t-transparent animate-spin" />
        <p className="text-thistle-200 font-medium text-sm animate-pulse">Cargando aplicación...</p>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* ---------------------------------------------------------------- */}
        {/* RUTAS EN MAIN LAYOUT (Header + Footer)                           */}
        {/* ---------------------------------------------------------------- */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/reportes" element={<ReportListPage />} />

          {/* /reportes/nuevo va ANTES que /reportes/:id para evitar conflicto de matching */}
          <Route path="/reportes/nuevo" element={<CreateReportPage />} />

          {/* Detalle público — /reportes/:id va DESPUÉS de las rutas específicas */}
          <Route path="/reportes/:id" element={<ReportDetailPage />} />

          <Route path="/login" element={<LoginPage />} />
          <Route path="/registro" element={<RegisterPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />

          {/* RUTAS PRIVADAS (con Header y Footer) */}
          <Route
            element={
              <ProtectedRoute
                isAuthenticated={isAuthenticated}
                redirectTo="/login"
              />
            }
          >
            <Route path="/dashboard" element={<UserDashboardPage />} />
            <Route path="/reportes/:id/editar" element={<EditReportPage />} />
            <Route path="/perfil" element={<UserProfilePage />} />
          </Route>
        </Route>

        {/* ---------------------------------------------------------------- */}
        {/* RUTAS ADMINISTRATIVAS — requieren rol ADMIN                       */}
        {/* ---------------------------------------------------------------- */}
        <Route
          element={
            <ProtectedRoute
              isAuthenticated={isAuthenticated}
              userRole={userRole}
              requiredRole={UserRole.ADMIN}
              redirectTo="/login"
            />
          }
        >
          {/* Redirige /admin → /admin/reportes como página principal */}
          <Route
            path="/admin"
            element={<Navigate to="/admin/reportes" replace />}
          />
          <Route path="/admin/reportes" element={<AdminReportReviewPage />} />
          <Route
            path="/admin/reportes/:id"
            element={<AdminReportDetailPage />}
          />
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
        </Route>

        {/* ---------------------------------------------------------------- */}
        {/* CATCH-ALL — 404                                                   */}
        {/* ---------------------------------------------------------------- */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;

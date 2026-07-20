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

// ---------------------------------------------------------------------------
// Placeholders de páginas — serán reemplazados por los componentes reales
// ---------------------------------------------------------------------------

// Públicas
const ReportListPage = () => <div data-testid="page-report-list">ReportListPage — Placeholder</div>;
const ReportDetailPage = () => <div data-testid="page-report-detail">ReportDetailPage — Placeholder</div>;
const LoginPage = () => <div data-testid="page-login">LoginPage — Placeholder</div>;
const RegisterPage = () => <div data-testid="page-register">RegisterPage — Placeholder</div>;
const NotFoundPage = () => <div data-testid="page-not-found">404 — Página no encontrada</div>;
const UnauthorizedPage = () => <div data-testid="page-unauthorized">403 — No autorizado</div>;

// Privadas (usuario autenticado)
const UserDashboardPage = () => <div data-testid="page-user-dashboard">UserDashboardPage — Placeholder</div>;
const CreateReportPage = () => <div data-testid="page-create-report">CreateReportPage — Placeholder</div>;
const EditReportPage = () => <div data-testid="page-edit-report">EditReportPage — Placeholder</div>;
const UserProfilePage = () => <div data-testid="page-user-profile">UserProfilePage — Placeholder</div>;

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
const AppRouter = () => {
  // TODO: Reemplazar estos valores hardcodeados con el contexto de autenticación
  // const { isAuthenticated, user } = useAuth();
  const isAuthenticated = false;
  const userRole = UserRole.USER;

  return (
    <BrowserRouter>
      <Routes>
        {/* ---------------------------------------------------------------- */}
        {/* RUTAS PÚBLICAS — envueltas en MainLayout (Header + Footer)       */}
        {/* ---------------------------------------------------------------- */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/reportes" element={<ReportListPage />} />

          {/* Detalle público — /reportes/:id DEBE ir antes que /reportes/nuevo
              para evitar que "nuevo" sea interpretado como un :id */}
          <Route path="/reportes/:id" element={<ReportDetailPage />} />

          <Route path="/login" element={<LoginPage />} />
          <Route path="/registro" element={<RegisterPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
        </Route>

        {/* ---------------------------------------------------------------- */}
        {/* RUTAS PRIVADAS — requieren autenticación                          */}
        {/* ---------------------------------------------------------------- */}
        <Route
          element={
            <ProtectedRoute
              isAuthenticated={isAuthenticated}
              redirectTo="/login"
            />
          }
        >
          <Route path="/dashboard" element={<UserDashboardPage />} />
          <Route path="/reportes/nuevo" element={<CreateReportPage />} />
          <Route path="/reportes/:id/editar" element={<EditReportPage />} />
          <Route path="/perfil" element={<UserProfilePage />} />
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

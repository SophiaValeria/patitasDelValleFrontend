import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '@/services/api';
import { ReportStatus, ReportType } from '@/types';
import { formatSpecies, formatImageUrl } from '@/utils/formatters';

interface AdminReport {
  id: string;
  type: ReportType;
  petName: string;
  species: string;
  breed?: string;
  status: ReportStatus;
  date: string;
  location: string;
  authorName: string;
  authorEmail: string;
  authorPhone?: string;
  images: string[];
}

const AdminReportReviewPage: React.FC = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState<AdminReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Estados de Filtro
  const [statusFilter, setStatusFilter] = useState<ReportStatus | 'ALL'>(ReportStatus.PENDING_REVIEW);
  const [searchTerm, setSearchTerm] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Cargar reportes para admin
  const fetchAdminReports = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await apiClient.get('/reports/admin/all');
      if (res.data && res.data.success && Array.isArray(res.data.data)) {
        const normalized: AdminReport[] = res.data.data.map((raw: any) => ({
          id: raw._id || raw.id,
          type: raw.type || ReportType.LOST,
          petName: raw.animalInfo?.name || 'Sin Nombre',
          species: formatSpecies(raw.animalInfo?.species),
          breed: raw.animalInfo?.breed,
          status: raw.status || ReportStatus.PENDING_REVIEW,
          date: raw.createdAt
            ? new Date(raw.createdAt).toLocaleDateString('es-CL', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })
            : 'Fecha desconocida',
          location: raw.location
            ? `${raw.location.comuna || ''}, ${raw.location.region || ''}`
            : 'Ubicación no disponible',
          authorName: raw.author?.name || 'Autor Desconocido',
          authorEmail: raw.author?.email || 'Sin Email',
          authorPhone: raw.author?.phone || raw.contact?.phone,
          images: (raw.images || []).map(formatImageUrl),
        }));
        setReports(normalized);
      } else {
        setReports([]);
      }
    } catch (err: any) {
      console.error('Error al cargar reportes para admin:', err);
      setError(err.response?.data?.message || 'Error al obtener la lista de reportes para administración.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminReports();
  }, []);

  // Cambiar estado del reporte
  const handleUpdateStatus = async (reportId: string, newStatus: ReportStatus) => {
    setUpdatingId(reportId);
    setError(null);
    setSuccessMessage(null);

    try {
      const res = await apiClient.put(`/reports/${reportId}`, { status: newStatus });
      if (res.data && res.data.success) {
        setSuccessMessage(`Reporte actualizado exitosamente a estado: ${newStatus.toUpperCase()}`);
        // Actualizar localmente el estado del reporte sin recargar toda la página
        setReports((prev) =>
          prev.map((r) => (r.id === reportId ? { ...r, status: newStatus } : r))
        );
        setTimeout(() => setSuccessMessage(null), 3000);
      }
    } catch (err: any) {
      console.error('Error al actualizar estado:', err);
      setError(err.response?.data?.message || 'Ocurrió un error al actualizar el estado del reporte.');
    } finally {
      setUpdatingId(null);
    }
  };

  // Filtrado de reportes
  const filteredReports = reports.filter((r) => {
    if (statusFilter !== 'ALL' && r.status !== statusFilter) return false;

    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      r.petName.toLowerCase().includes(term) ||
      r.species.toLowerCase().includes(term) ||
      (r.breed && r.breed.toLowerCase().includes(term)) ||
      r.location.toLowerCase().includes(term) ||
      r.authorName.toLowerCase().includes(term) ||
      r.authorEmail.toLowerCase().includes(term)
    );
  });

  // Conteo por estados
  const totalCount = reports.length;
  const pendingCount = reports.filter((r) => r.status === ReportStatus.PENDING_REVIEW).length;
  const activeCount = reports.filter((r) => r.status === ReportStatus.ACTIVE).length;
  const rejectedCount = reports.filter((r) => r.status === ReportStatus.REJECTED).length;
  const desistedCount = reports.filter((r) => r.status === ReportStatus.DESISTED).length;
  const resolvedCount = reports.filter((r) => r.status === ReportStatus.RESOLVED).length;

  const getStatusBadge = (status: ReportStatus) => {
    switch (status) {
      case ReportStatus.PENDING_REVIEW:
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-sky_blue-950 text-sky_blue-300 border border-sky_blue-500 flex items-center gap-1.5 w-fit">
            <span className="w-2 h-2 rounded-full bg-sky_blue-400 animate-ping" />
            En Revisión
          </span>
        );
      case ReportStatus.ACTIVE:
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-thistle-800 text-thistle-200 border border-thistle-500 flex items-center gap-1.5 w-fit">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            Activo / Publicado
          </span>
        );
      case ReportStatus.REJECTED:
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-950 text-red-300 border border-red-500 flex items-center gap-1.5 w-fit">
            <span className="w-2 h-2 rounded-full bg-red-400" />
            Rechazado
          </span>
        );
      case ReportStatus.DESISTED:
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-950 text-amber-300 border border-amber-500 flex items-center gap-1.5 w-fit">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            Desistido
          </span>
        );
      case ReportStatus.RESOLVED:
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-pastel_petal-950 text-pastel_petal-300 border border-pastel_petal-400 flex items-center gap-1.5 w-fit">
            <span className="w-2 h-2 rounded-full bg-baby_pink-400" />
            Resuelto
          </span>
        );
      default:
        return null;
    }
  };

  const getTypeBadge = (type: ReportType) => {
    switch (type) {
      case ReportType.LOST:
        return (
          <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-pastel_petal-900 text-pastel_petal-200">
            Perdida
          </span>
        );
      case ReportType.FOUND:
        return (
          <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-sky_blue-900 text-sky_blue-200">
            Encontrada
          </span>
        );
      case ReportType.ADOPTION:
        return (
          <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-thistle-800 text-thistle-200">
            Adopción
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-thistle-900 via-thistle-900 to-icy_blue-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header de Administración */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-thistle-700/60 p-6 sm:p-8 rounded-3xl shadow-xl">
          <div>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-baby_pink-900 text-baby_pink-200 text-xs font-bold uppercase tracking-wider border border-baby_pink-500/50">
                🛡️ Módulo de Administración
              </span>
              <span className="text-xs text-thistle-300 font-medium">Gestión de Estados</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-thistle-100 mt-2 tracking-tight">
              Flujo y Revisión de Reportes
            </h1>
            <p className="text-sm text-thistle-300 mt-1 font-medium">
              Aprueba, rechaza y audita el estado de todos los reportes emitidos por la comunidad.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => navigate('/admin/usuarios')}
              className="px-4 py-2.5 rounded-2xl border-2 border-thistle-600 text-thistle-100 hover:border-baby_pink-400 hover:text-baby_pink-400 font-bold text-xs transition-all cursor-pointer min-h-[44px] flex items-center gap-2"
            >
              <svg className="w-4 h-4 text-sky_blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              Gestión de Usuarios
            </button>
          </div>
        </div>

        {/* Mensajes Alerta */}
        {successMessage && (
          <div className="p-4 rounded-2xl bg-emerald-950/90 border border-emerald-500 text-emerald-200 text-sm font-bold flex items-center gap-3 shadow-lg animate-fade-in">
            <span>✓</span> {successMessage}
          </div>
        )}

        {error && (
          <div className="p-4 rounded-2xl bg-pastel_petal-950/90 border border-pastel_petal-500 text-pastel_petal-200 text-sm font-bold flex items-center gap-3 shadow-lg animate-fade-in">
            <span>⚠️</span> {error}
          </div>
        )}

        {/* Pestañas de Filtrado por Estado */}
        <div className="bg-white border border-thistle-700/60 shadow-xl rounded-3xl p-6 space-y-6">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
            
            {/* Buscador */}
            <div className="relative flex-1">
              <svg className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-thistle-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por nombre de mascota, autor, especie o ubicación..."
                className="w-full pl-11 pr-4 py-3 rounded-2xl border-2 border-thistle-600 bg-thistle-900 text-thistle-100 placeholder-thistle-400 outline-none focus:border-baby_pink-400 text-sm font-medium transition-all"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-thistle-400 hover:text-white text-xs bg-thistle-800 p-1 rounded-full cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Tabs de Estado */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
              <button
                onClick={() => setStatusFilter(ReportStatus.PENDING_REVIEW)}
                className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer shrink-0 min-h-[40px] flex items-center gap-1.5 ${
                  statusFilter === ReportStatus.PENDING_REVIEW
                    ? 'bg-sky_blue-400 text-white shadow-md'
                    : 'bg-thistle-900 text-thistle-300 hover:bg-thistle-800'
                }`}
              >
                <span>En Revisión</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-white/20">
                  {pendingCount}
                </span>
              </button>

              <button
                onClick={() => setStatusFilter(ReportStatus.ACTIVE)}
                className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer shrink-0 min-h-[40px] flex items-center gap-1.5 ${
                  statusFilter === ReportStatus.ACTIVE
                    ? 'bg-thistle-200 text-white shadow-md'
                    : 'bg-thistle-900 text-thistle-300 hover:bg-thistle-800'
                }`}
              >
                <span>Activos</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-white/20">
                  {activeCount}
                </span>
              </button>

              <button
                onClick={() => setStatusFilter(ReportStatus.REJECTED)}
                className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer shrink-0 min-h-[40px] flex items-center gap-1.5 ${
                  statusFilter === ReportStatus.REJECTED
                    ? 'bg-red-500 text-white shadow-md'
                    : 'bg-thistle-900 text-thistle-300 hover:bg-thistle-800'
                }`}
              >
                <span>Rechazados</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-white/20">
                  {rejectedCount}
                </span>
              </button>

              <button
                onClick={() => setStatusFilter(ReportStatus.DESISTED)}
                className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer shrink-0 min-h-[40px] flex items-center gap-1.5 ${
                  statusFilter === ReportStatus.DESISTED
                    ? 'bg-amber-500 text-white shadow-md'
                    : 'bg-thistle-900 text-thistle-300 hover:bg-thistle-800'
                }`}
              >
                <span>Desistidos</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-white/20">
                  {desistedCount}
                </span>
              </button>

              <button
                onClick={() => setStatusFilter(ReportStatus.RESOLVED)}
                className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer shrink-0 min-h-[40px] flex items-center gap-1.5 ${
                  statusFilter === ReportStatus.RESOLVED
                    ? 'bg-pastel_petal-400 text-white shadow-md'
                    : 'bg-thistle-900 text-thistle-300 hover:bg-thistle-800'
                }`}
              >
                <span>Resueltos</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-white/20">
                  {resolvedCount}
                </span>
              </button>

              <button
                onClick={() => setStatusFilter('ALL')}
                className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer shrink-0 min-h-[40px] ${
                  statusFilter === 'ALL'
                    ? 'bg-thistle-600 text-white shadow-md'
                    : 'bg-thistle-900 text-thistle-300 hover:bg-thistle-800'
                }`}
              >
                Todos ({totalCount})
              </button>
            </div>
          </div>

          {/* Grilla de Reportes */}
          {isLoading ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-10 h-10 border-4 border-baby_pink-400 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-sm text-thistle-300 font-medium">Cargando reportes para revisión...</p>
            </div>
          ) : filteredReports.length === 0 ? (
            /* Empty state */
            <div className="py-16 px-4 text-center max-w-md mx-auto space-y-3">
              <div className="w-16 h-16 rounded-full bg-thistle-900 text-3xl flex items-center justify-center mx-auto text-thistle-300">
                📋
              </div>
              <h3 className="text-lg font-bold text-thistle-100">No hay reportes en esta categoría</h3>
              <p className="text-xs text-thistle-300 font-medium">
                {statusFilter === ReportStatus.PENDING_REVIEW
                  ? '¡Excelente! No hay reportes pendientes de revisión en este momento.'
                  : 'No se encontraron reportes que coincidan con la búsqueda.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredReports.map((report) => {
                const isUpdatingThis = updatingId === report.id;

                return (
                  <div
                    key={report.id}
                    className="bg-thistle-950/40 border border-thistle-700/60 rounded-3xl overflow-hidden hover:border-thistle-400 transition-all duration-200 flex flex-col justify-between shadow-sm hover:shadow-md"
                  >
                    <div>
                      {/* Imagen */}
                      <div className="h-48 w-full relative overflow-hidden bg-thistle-900">
                        {report.images && report.images.length > 0 ? (
                          <img
                            src={report.images[0]}
                            alt={report.petName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-thistle-400 text-xs">
                            <span className="text-3xl mb-1">🐾</span> Sin Imagen
                          </div>
                        )}
                        <div className="absolute top-3 left-3 flex items-center gap-2">
                          {getTypeBadge(report.type)}
                        </div>
                        <div className="absolute top-3 right-3">
                          {getStatusBadge(report.status)}
                        </div>
                      </div>

                      {/* Info del Reporte */}
                      <div className="p-5 space-y-4">
                        <div>
                          <h3 className="font-black text-lg text-thistle-100">
                            {report.petName}
                          </h3>
                          <p className="text-xs font-semibold text-baby_pink-400 mt-0.5">
                            {report.species} {report.breed ? `• ${report.breed}` : ''}
                          </p>
                        </div>

                        {/* Ubicación y Fecha */}
                        <div className="space-y-1.5 text-xs text-thistle-300 font-medium bg-thistle-900/60 p-3 rounded-2xl border border-thistle-800">
                          <div className="flex items-center gap-2 truncate">
                            <svg className="w-4 h-4 text-thistle-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span className="truncate">{report.location}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-thistle-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span>Registrado el {report.date}</span>
                          </div>
                        </div>

                        {/* Datos del Autor */}
                        <div className="p-3 rounded-2xl bg-thistle-900/40 border border-thistle-800 space-y-1">
                          <p className="text-[10px] font-bold text-thistle-400 uppercase tracking-wider">
                            Autor del reporte
                          </p>
                          <p className="text-xs font-bold text-thistle-100">{report.authorName}</p>
                          <p className="text-[11px] text-thistle-300 truncate">{report.authorEmail}</p>
                          {report.authorPhone && (
                            <p className="text-[11px] text-baby_pink-400 font-semibold">{report.authorPhone}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Botones de Acción según estado */}
                    <div className="p-4 bg-thistle-900/50 border-t border-thistle-800 space-y-2">
                      <div className="flex items-center gap-2">
                        {report.status === ReportStatus.PENDING_REVIEW && (
                          <>
                            <button
                              disabled={isUpdatingThis}
                              onClick={() => handleUpdateStatus(report.id, ReportStatus.ACTIVE)}
                              className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer min-h-[40px] flex items-center justify-center gap-1.5 disabled:opacity-50"
                            >
                              ✓ Aprobar / Activar
                            </button>

                            <button
                              disabled={isUpdatingThis}
                              onClick={() => handleUpdateStatus(report.id, ReportStatus.REJECTED)}
                              className="flex-1 py-2.5 px-3 rounded-xl bg-red-600/80 hover:bg-red-600 text-white font-bold text-xs shadow-md transition-all cursor-pointer min-h-[40px] flex items-center justify-center gap-1.5 disabled:opacity-50"
                            >
                              ✕ Rechazar
                            </button>
                          </>
                        )}

                        {report.status === ReportStatus.ACTIVE && (
                          <>
                            <button
                              disabled={isUpdatingThis}
                              onClick={() => handleUpdateStatus(report.id, ReportStatus.PENDING_REVIEW)}
                              className="flex-1 py-2 px-3 rounded-xl border border-sky_blue-500 text-sky_blue-300 hover:bg-sky_blue-950 font-bold text-xs transition-all cursor-pointer min-h-[40px] flex items-center justify-center gap-1 disabled:opacity-50"
                            >
                              ↩ En Revisión
                            </button>

                            <button
                              disabled={isUpdatingThis}
                              onClick={() => handleUpdateStatus(report.id, ReportStatus.REJECTED)}
                              className="py-2 px-3 rounded-xl border border-red-500 text-red-300 hover:bg-red-950 font-bold text-xs transition-all cursor-pointer min-h-[40px] flex items-center justify-center disabled:opacity-50"
                            >
                              Rechazar
                            </button>
                          </>
                        )}

                        {(report.status === ReportStatus.REJECTED || report.status === ReportStatus.DESISTED) && (
                          <button
                            disabled={isUpdatingThis}
                            onClick={() => handleUpdateStatus(report.id, ReportStatus.ACTIVE)}
                            className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer min-h-[40px] flex items-center justify-center gap-1.5 disabled:opacity-50"
                          >
                            Re-activar Reporte
                          </button>
                        )}
                      </div>

                      <button
                        onClick={() => navigate(`/reportes/${report.id}`)}
                        className="w-full py-2 px-3 rounded-xl text-xs font-semibold text-thistle-300 hover:text-white hover:bg-thistle-800 transition-colors min-h-[36px] flex items-center justify-center gap-1"
                      >
                        Ver Detalle Completo
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminReportReviewPage;

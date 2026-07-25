/**
 * @file features/user/pages/UserProfilePage.tsx
 * @description Página de perfil de usuario con datos personales y gestión de sus reportes.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '@/hooks/useAuth';
import apiClient from '@/services/api';
import { ReportStatus, ReportType, UserRole } from '@/types';
import { formatSpecies, formatImageUrl } from '@/utils/formatters';

interface UserReport {
  id: string;
  type: ReportType;
  petName: string;
  species: string;
  breed?: string;
  status: ReportStatus;
  date: string;
  location: string;
  image: string;
}


// Datos iniciales de demostración para el usuario
const MOCK_USER_REPORTS: UserReport[] = [
  {
    id: 'usr-1',
    type: ReportType.LOST,
    petName: 'Max',
    species: 'Perro',
    breed: 'Golden Retriever',
    status: ReportStatus.ACTIVE,
    date: '18 jul 2026',
    location: 'Providencia, Región Metropolitana',
    image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&q=80',
  },
  {
    id: 'usr-2',
    type: ReportType.FOUND,
    petName: 'Sin Nombre (Gato persa)',
    species: 'Gato',
    status: ReportStatus.PENDING_REVIEW,
    date: '19 jul 2026',
    location: 'Ñuñoa, Región Metropolitana',
    image: 'https://images.unsplash.com/photo-1495360010541-f48722b34f7d?w=400&q=80',
  },
  {
    id: 'usr-3',
    type: ReportType.ADOPTION,
    petName: 'Milo',
    species: 'Perro',
    breed: 'Mestizo',
    status: ReportStatus.RESOLVED,
    date: '10 jul 2026',
    location: 'Santiago Centro, Región Metropolitana',
    image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&q=80',
  },
];

const UserProfilePage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'ALL' | ReportStatus>('ALL');
  const [reports, setReports] = useState<UserReport[]>(MOCK_USER_REPORTS);
  const [isLoadingReports, setIsLoadingReports] = useState(false);

  // Intentar cargar reportes desde la API si la ruta está disponible
  useEffect(() => {
    const formatLocation = (loc: any): string => {
      if (!loc) return 'Ubicación no especificada';
      if (typeof loc === 'string') return loc;
      const parts = [];
      if (loc.comuna) parts.push(loc.comuna);
      if (loc.region) parts.push(loc.region);
      return parts.length > 0 ? parts.join(', ') : loc.address || 'Ubicación no especificada';
    };

    const formatDate = (dateStr: any): string => {
      if (!dateStr) return 'Fecha no especificada';
      try {
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return String(dateStr);
        return d.toLocaleDateString('es-CL', { day: 'numeric', month: 'short', year: 'numeric' });
      } catch {
        return String(dateStr);
      }
    };

    const normalizeUserReport = (raw: any): UserReport => {
      return {
        id: raw._id || raw.id || String(Math.random()),
        type: raw.type || ReportType.LOST,
        petName: raw.animalInfo?.name || raw.petName || 'Sin Nombre',
        species: formatSpecies(raw.animalInfo?.species || raw.species),
        breed: raw.animalInfo?.breed || raw.breed,
        status: raw.status || ReportStatus.ACTIVE,
        date: formatDate(raw.createdAt || raw.date),
        location: formatLocation(raw.location),
        image: formatImageUrl(
          Array.isArray(raw.images) && raw.images.length > 0 ? raw.images[0] : raw.image
        ),
      };
    };

    const fetchUserReports = async () => {
      try {
        setIsLoadingReports(true);
        const res = await apiClient.get('/reports/my-reports');
        if (res.data && res.data.success && Array.isArray(res.data.data)) {
          const normalized = res.data.data.map(normalizeUserReport);
          setReports(normalized);
        }
      } catch (err) {
        // En caso de que la API de reportes propios falle o retorne error,
        // mantenemos los datos mock para que el frontend funcione fluidamente.
      } finally {
        setIsLoadingReports(false);
      }
    };

    fetchUserReports();
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen bg-thistle-900 flex flex-col items-center justify-center p-4">
        <p className="text-thistle-200 font-medium mb-4">No has iniciado sesión.</p>
        <button
          onClick={() => navigate('/login')}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-baby_pink-400 to-pastel_petal-400 text-white font-semibold shadow-md"
        >
          Ir a Iniciar Sesión
        </button>
      </div>
    );
  }

  // Filtrar reportes según la pestaña activa
  const filteredReports = reports.filter((report) => {
    if (activeTab === 'ALL') return true;
    return report.status === activeTab;
  });

  // Estadísticas
  const totalCount = reports.length;
  const activeCount = reports.filter((r) => r.status === ReportStatus.ACTIVE).length;
  const pendingCount = reports.filter((r) => r.status === ReportStatus.PENDING_REVIEW).length;
  const resolvedCount = reports.filter((r) => r.status === ReportStatus.RESOLVED).length;

  const getInitials = (name: string) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return parts[0][0].toUpperCase();
  };

  const getStatusBadge = (status: ReportStatus) => {
    switch (status) {
      case ReportStatus.ACTIVE:
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-thistle-800 text-thistle-200 border border-thistle-500 flex items-center gap-1.5 w-fit">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Publicado / Activo
          </span>
        );
      case ReportStatus.PENDING_REVIEW:
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-sky_blue-900 text-sky_blue-200 border border-sky_blue-500 flex items-center gap-1.5 w-fit">
            <span className="w-2 h-2 rounded-full bg-sky_blue-400" />
            En Revisión
          </span>
        );
      case ReportStatus.RESOLVED:
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-pastel_petal-900 text-pastel_petal-200 border border-pastel_petal-400 flex items-center gap-1.5 w-fit">
            <span className="w-2 h-2 rounded-full bg-baby_pink-400" />
            Resuelto
          </span>
        );
      case ReportStatus.REJECTED:
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-red-950 text-red-300 border border-red-500 flex items-center gap-1.5 w-fit">
            <span className="w-2 h-2 rounded-full bg-red-400" />
            Rechazado
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-thistle-900 text-thistle-300 border border-thistle-600 w-fit">
            Borrador
          </span>
        );
    }
  };

  const getTypeBadge = (type: ReportType) => {
    switch (type) {
      case ReportType.LOST:
        return (
          <span className="px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-pastel_petal-900 text-pastel_petal-200">
            Perdida
          </span>
        );
      case ReportType.FOUND:
        return (
          <span className="px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-sky_blue-900 text-sky_blue-200">
            Encontrada
          </span>
        );
      case ReportType.ADOPTION:
        return (
          <span className="px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-thistle-800 text-thistle-200">
            Adopción
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-thistle-900 via-thistle-900 to-icy_blue-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* ── TARJETA PRINCIPAL DEL PERFIL ── */}
        <div className="bg-white border border-thistle-700/60 shadow-xl rounded-3xl overflow-hidden transition-all">
          
          {/* Header Banner */}
          <div className="h-32 sm:h-40 bg-gradient-to-r from-baby_pink-400 via-thistle-400 to-sky_blue-400 relative">
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-thistle-200 text-xs font-bold uppercase tracking-wider shadow-sm">
                {user.role === UserRole.ADMIN ? '🛡️ Administrador' : '🐾 Usuario Verificado'}
              </span>
            </div>
          </div>

          {/* User Info Bar */}
          <div className="px-6 sm:px-8 pb-8 relative pt-0">
            <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between gap-4 -mt-16 sm:-mt-20 mb-6">
              
              {/* Avatar + Nombre */}
              <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl object-cover border-4 border-white shadow-xl bg-white"
                  />
                ) : (
                  <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-gradient-to-tr from-thistle-300 via-baby_pink-400 to-sky_blue-400 text-white font-black text-3xl sm:text-4xl flex items-center justify-center border-4 border-white shadow-xl">
                    {getInitials(user.name)}
                  </div>
                )}

                <div className="pt-2 sm:pt-12">
                  <h1 className="text-2xl sm:text-3xl font-black text-thistle-100 tracking-tight">
                    {user.name}
                  </h1>
                  <p className="text-sm font-semibold text-baby_pink-400 flex items-center justify-center sm:justify-start gap-1.5 mt-0.5">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {user.email}
                  </p>
                </div>
              </div>

              {/* Botón Acción Principal */}
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={() => navigate('/reportes/nuevo')}
                  className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-gradient-to-r from-baby_pink-400 to-pastel_petal-400 text-white font-bold text-sm shadow-md hover:shadow-lg hover:from-baby_pink-300 hover:to-pastel_petal-300 transition-all duration-200 cursor-pointer min-h-[44px] flex items-center justify-center gap-2"
                >
                  <span className="text-lg font-black">+</span>
                  Nuevo Reporte
                </button>
                
                <button
                  onClick={logout}
                  title="Cerrar Sesión"
                  className="p-3 rounded-2xl border-2 border-thistle-700 text-thistle-300 hover:bg-pastel_petal-900/30 hover:text-pastel_petal-200 hover:border-pastel_petal-300/50 transition-all cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Grid de Datos del Usuario */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-5 bg-thistle-950/40 rounded-2xl border border-thistle-800">
              <div className="space-y-1">
                <p className="text-xs font-bold text-thistle-400 uppercase tracking-wider">RUT</p>
                <p className="text-sm font-semibold text-thistle-100">{user.rut || 'No especificado'}</p>
              </div>

              <div className="space-y-1">
                <p className="text-xs font-bold text-thistle-400 uppercase tracking-wider">Teléfono</p>
                <p className="text-sm font-semibold text-thistle-100">{user.phone || 'No especificado'}</p>
              </div>

              <div className="space-y-1">
                <p className="text-xs font-bold text-thistle-400 uppercase tracking-wider">Región y Comuna</p>
                <p className="text-sm font-semibold text-thistle-100 truncate">
                  {user.commune && user.region ? `${user.commune}, ${user.region}` : 'Chile'}
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-xs font-bold text-thistle-400 uppercase tracking-wider">Dirección</p>
                <p className="text-sm font-semibold text-thistle-100 truncate">{user.address || 'No registrada'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── TARJETAS DE ESTADÍSTICAS RÁPIDAS ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white border border-thistle-700/50 p-5 rounded-3xl shadow-sm flex flex-col justify-between hover:border-thistle-400 transition-all">
            <p className="text-xs font-bold text-thistle-300 uppercase">Total Reportes</p>
            <p className="text-3xl font-black text-thistle-100 mt-2">{totalCount}</p>
          </div>

          <div className="bg-white border border-thistle-700/50 p-5 rounded-3xl shadow-sm flex flex-col justify-between hover:border-baby_pink-400 transition-all">
            <p className="text-xs font-bold text-thistle-300 uppercase">Activos</p>
            <p className="text-3xl font-black text-baby_pink-400 mt-2">{activeCount}</p>
          </div>

          <div className="bg-white border border-thistle-700/50 p-5 rounded-3xl shadow-sm flex flex-col justify-between hover:border-sky_blue-400 transition-all">
            <p className="text-xs font-bold text-thistle-300 uppercase">En Revisión</p>
            <p className="text-3xl font-black text-sky_blue-400 mt-2">{pendingCount}</p>
          </div>

          <div className="bg-white border border-thistle-700/50 p-5 rounded-3xl shadow-sm flex flex-col justify-between hover:border-pastel_petal-400 transition-all">
            <p className="text-xs font-bold text-thistle-300 uppercase">Resueltos</p>
            <p className="text-3xl font-black text-pastel_petal-300 mt-2">{resolvedCount}</p>
          </div>
        </div>

        {/* ── SECCIÓN "MIS REPORTES" ── */}
        <div className="bg-white border border-thistle-700/60 shadow-xl rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-thistle-800 pb-4">
            <div>
              <h2 className="text-xl font-black text-thistle-100">Mis Publicaciones y Reportes</h2>
              <p className="text-xs text-thistle-300 font-medium">
                Gestiona y revisa el estado de tus mascotas reportadas.
              </p>
            </div>

            {/* Tabs de Filtro */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
              <button
                onClick={() => setActiveTab('ALL')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                  activeTab === 'ALL'
                    ? 'bg-thistle-200 text-white shadow-sm'
                    : 'bg-thistle-900 text-thistle-300 hover:bg-thistle-800'
                }`}
              >
                Todos ({totalCount})
              </button>
              <button
                onClick={() => setActiveTab(ReportStatus.ACTIVE)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                  activeTab === ReportStatus.ACTIVE
                    ? 'bg-baby_pink-400 text-white shadow-sm'
                    : 'bg-thistle-900 text-thistle-300 hover:bg-thistle-800'
                }`}
              >
                Activos ({activeCount})
              </button>
              <button
                onClick={() => setActiveTab(ReportStatus.PENDING_REVIEW)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                  activeTab === ReportStatus.PENDING_REVIEW
                    ? 'bg-sky_blue-400 text-white shadow-sm'
                    : 'bg-thistle-900 text-thistle-300 hover:bg-thistle-800'
                }`}
              >
                En Revisión ({pendingCount})
              </button>
              <button
                onClick={() => setActiveTab(ReportStatus.RESOLVED)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                  activeTab === ReportStatus.RESOLVED
                    ? 'bg-pastel_petal-400 text-white shadow-sm'
                    : 'bg-thistle-900 text-thistle-300 hover:bg-thistle-800'
                }`}
              >
                Resueltos ({resolvedCount})
              </button>
            </div>
          </div>

          {/* Grilla de Reportes */}
          {isLoadingReports ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-10 h-10 border-4 border-baby_pink-400 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-sm text-thistle-300 font-medium">Cargando tus reportes...</p>
            </div>
          ) : filteredReports.length === 0 ? (
            /* Empty state */
            <div className="py-12 px-4 text-center max-w-md mx-auto space-y-4">
              <div className="w-16 h-16 rounded-full bg-thistle-900 text-3xl flex items-center justify-center mx-auto text-thistle-300">
                🐾
              </div>
              <h3 className="text-lg font-bold text-thistle-100">No hay publicaciones aquí</h3>
              <p className="text-xs text-thistle-300 font-medium">
                {activeTab === 'ALL'
                  ? 'Aún no has creado ningún reporte de mascota. ¡Crea uno para que la comunidad te ayude!'
                  : 'No se encontraron reportes con este estado.'}
              </p>
              <button
                onClick={() => navigate('/reportes/nuevo')}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-baby_pink-400 to-pastel_petal-400 text-white text-xs font-bold shadow-md hover:from-baby_pink-300 hover:to-pastel_petal-300 transition-all cursor-pointer inline-flex items-center gap-2"
              >
                <span>+</span> Reportar mascota ahora
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredReports.map((report) => (
                <div
                  key={report.id}
                  className="bg-thistle-950/40 border border-thistle-700/60 rounded-2xl overflow-hidden hover:border-thistle-400 transition-all duration-200 flex flex-col justify-between group shadow-sm hover:shadow-md"
                >
                  <div>
                    {/* Imagen del reporte */}
                    <div className="h-44 w-full relative overflow-hidden bg-thistle-900">
                      <img
                        src={report.image}
                        alt={report.petName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-3 left-3 flex items-center gap-2">
                        {getTypeBadge(report.type)}
                      </div>
                    </div>

                    {/* Contenido del reporte */}
                    <div className="p-5 space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-bold text-base text-thistle-100 group-hover:text-baby_pink-400 transition-colors">
                            {report.petName}
                          </h3>
                          <p className="text-xs text-thistle-300">
                            {report.species} {report.breed ? `• ${report.breed}` : ''}
                          </p>
                        </div>
                      </div>

                      {/* Estado */}
                      <div>{getStatusBadge(report.status)}</div>

                      {/* Ubicación y fecha */}
                      <div className="space-y-1 pt-2 border-t border-thistle-800/80 text-xs text-thistle-300 font-medium">
                        <div className="flex items-center gap-1.5 truncate">
                          <svg className="w-3.5 h-3.5 text-thistle-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span className="truncate">{report.location}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <svg className="w-3.5 h-3.5 text-thistle-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span>{report.date}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Acciones de la tarjeta */}
                  <div className="p-4 bg-thistle-900/50 border-t border-thistle-800 flex items-center justify-between gap-2">
                    <button
                      onClick={() => navigate(`/reportes/${report.id}`)}
                      className="px-3 py-2 rounded-xl text-xs font-semibold text-thistle-200 hover:bg-thistle-800 transition-colors min-h-[36px] flex items-center gap-1"
                    >
                      Ver detalle
                    </button>
                    
                    <button
                      onClick={() => navigate(`/reportes/${report.id}/editar`)}
                      className="px-3 py-2 rounded-xl text-xs font-semibold border border-thistle-600 text-thistle-100 hover:border-baby_pink-400 hover:text-baby_pink-400 transition-colors min-h-[36px]"
                    >
                      Editar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;

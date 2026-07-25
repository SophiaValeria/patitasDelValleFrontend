import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '@/services/api';
import { UserRole, type User } from '@/types';
import { formatRut } from '@/utils/formatters';

const AdminUsersPage: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'ALL' | UserRole>('ALL');

  // Cargar usuarios desde la API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const res = await apiClient.get('/auth/users');
        if (res.data && res.data.success && Array.isArray(res.data.data)) {
          setUsers(res.data.data);
        } else {
          setUsers([]);
        }
      } catch (err: any) {
        console.error('Error al cargar usuarios:', err);
        setError(err.response?.data?.message || 'Ocurrió un error al obtener la lista de usuarios.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Filtrado
  const filteredUsers = users.filter((u) => {
    // Filtro por rol
    if (roleFilter !== 'ALL' && u.role !== roleFilter) return false;

    // Buscador
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      (u.name && u.name.toLowerCase().includes(term)) ||
      (u.email && u.email.toLowerCase().includes(term)) ||
      (u.rut && u.rut.toLowerCase().includes(term)) ||
      (u.commune && u.commune.toLowerCase().includes(term)) ||
      (u.region && u.region.toLowerCase().includes(term))
    );
  });

  const totalUsers = users.length;
  const adminUsersCount = users.filter((u) => u.role === UserRole.ADMIN).length;
  const standardUsersCount = users.filter((u) => u.role === UserRole.USER).length;

  const getInitials = (name: string) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return parts[0][0].toUpperCase();
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
              <span className="text-xs text-thistle-300 font-medium">Panel Control</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-thistle-100 mt-2 tracking-tight">
              Gestión de Usuarios de la Plataforma
            </h1>
            <p className="text-sm text-thistle-300 mt-1 font-medium">
              Visualiza y administra la información de todos los usuarios registrados en Patitas del Valle.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => navigate('/admin/reportes')}
              className="px-4 py-2.5 rounded-2xl border-2 border-thistle-600 text-thistle-100 hover:border-baby_pink-400 hover:text-baby_pink-400 font-bold text-xs transition-all cursor-pointer min-h-[44px] flex items-center gap-2"
            >
              <svg className="w-4 h-4 text-baby_pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Ver Flujo de Reportes
            </button>
          </div>
        </div>

        {/* Tarjetas Estadísticas */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white border border-thistle-700/50 p-6 rounded-3xl shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-thistle-300 uppercase tracking-wider">Total Registrados</p>
              <p className="text-3xl font-black text-thistle-100 mt-1">{totalUsers}</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-thistle-900 border border-thistle-600 flex items-center justify-center text-xl text-thistle-200">
              👥
            </div>
          </div>

          <div className="bg-white border border-thistle-700/50 p-6 rounded-3xl shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-thistle-300 uppercase tracking-wider">Administradores</p>
              <p className="text-3xl font-black text-baby_pink-400 mt-1">{adminUsersCount}</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-baby_pink-950 border border-baby_pink-600/50 flex items-center justify-center text-xl text-baby_pink-300">
              👑
            </div>
          </div>

          <div className="bg-white border border-thistle-700/50 p-6 rounded-3xl shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-thistle-300 uppercase tracking-wider">Usuarios Estándar</p>
              <p className="text-3xl font-black text-sky_blue-400 mt-1">{standardUsersCount}</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-sky_blue-950 border border-sky_blue-600/50 flex items-center justify-center text-xl text-sky_blue-300">
              🐾
            </div>
          </div>
        </div>

        {/* Barra de Filtros y Buscador */}
        <div className="bg-white border border-thistle-700/60 shadow-xl rounded-3xl p-6 space-y-6">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            
            {/* Buscador */}
            <div className="relative flex-1">
              <svg className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-thistle-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por nombre, email, RUT o comuna..."
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

            {/* Filtro por Rol */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
              <button
                onClick={() => setRoleFilter('ALL')}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer shrink-0 min-h-[44px] ${
                  roleFilter === 'ALL'
                    ? 'bg-thistle-200 text-white shadow-md'
                    : 'bg-thistle-900 text-thistle-300 hover:bg-thistle-800'
                }`}
              >
                Todos ({totalUsers})
              </button>
              <button
                onClick={() => setRoleFilter(UserRole.ADMIN)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer shrink-0 min-h-[44px] ${
                  roleFilter === UserRole.ADMIN
                    ? 'bg-baby_pink-400 text-white shadow-md'
                    : 'bg-thistle-900 text-thistle-300 hover:bg-thistle-800'
                }`}
              >
                Admins ({adminUsersCount})
              </button>
              <button
                onClick={() => setRoleFilter(UserRole.USER)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer shrink-0 min-h-[44px] ${
                  roleFilter === UserRole.USER
                    ? 'bg-sky_blue-400 text-white shadow-md'
                    : 'bg-thistle-900 text-thistle-300 hover:bg-thistle-800'
                }`}
              >
                Usuarios ({standardUsersCount})
              </button>
            </div>
          </div>

          {/* Mensaje de Error */}
          {error && (
            <div className="p-4 rounded-2xl bg-pastel_petal-950/80 border border-pastel_petal-500 text-pastel_petal-200 text-sm font-bold flex items-center gap-2">
              <span>⚠️</span> {error}
            </div>
          )}

          {/* Estado Cargando */}
          {isLoading ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-10 h-10 border-4 border-baby_pink-400 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-sm text-thistle-300 font-medium">Cargando lista de usuarios...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            /* Empty state */
            <div className="py-16 px-4 text-center max-w-md mx-auto space-y-3">
              <div className="w-16 h-16 rounded-full bg-thistle-900 text-3xl flex items-center justify-center mx-auto text-thistle-300">
                🔍
              </div>
              <h3 className="text-lg font-bold text-thistle-100">No se encontraron usuarios</h3>
              <p className="text-xs text-thistle-300 font-medium">
                Prueba ajustando el término de búsqueda o el filtro de roles seleccionado.
              </p>
            </div>
          ) : (
            <>
              {/* Vista Tabla Desktop (>= 1024px) */}
              <div className="hidden lg:block overflow-x-auto rounded-2xl border border-thistle-800">
                <table className="w-full text-left text-sm text-thistle-200">
                  <thead className="bg-thistle-950/60 text-xs uppercase font-bold text-thistle-400 border-b border-thistle-800">
                    <tr>
                      <th className="px-6 py-4">Usuario</th>
                      <th className="px-6 py-4">RUT</th>
                      <th className="px-6 py-4">Contacto</th>
                      <th className="px-6 py-4">Ubicación</th>
                      <th className="px-6 py-4">Rol</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-thistle-800/60">
                    {filteredUsers.map((u) => (
                      <tr key={u.id || u.email} className="hover:bg-thistle-900/40 transition-colors">
                        {/* Usuario */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {u.avatarUrl ? (
                              <img
                                src={u.avatarUrl}
                                alt={u.name}
                                className="w-10 h-10 rounded-2xl object-cover border border-thistle-600 shrink-0"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-thistle-300 to-baby_pink-400 text-white font-bold text-sm flex items-center justify-center shrink-0 shadow-sm">
                                {getInitials(u.name)}
                              </div>
                            )}
                            <div>
                              <p className="font-bold text-thistle-100">{u.name}</p>
                              <p className="text-xs text-thistle-400">{u.email}</p>
                            </div>
                          </div>
                        </td>

                        {/* RUT */}
                        <td className="px-6 py-4 font-mono font-semibold text-thistle-200">
                          {formatRut(u.rut) || u.rut || 'No especificado'}
                        </td>

                        {/* Contacto */}
                        <td className="px-6 py-4 text-xs font-medium text-thistle-300">
                          <div className="flex items-center gap-1.5">
                            <svg className="w-3.5 h-3.5 text-thistle-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            {u.phone || 'No registrado'}
                          </div>
                        </td>

                        {/* Ubicación */}
                        <td className="px-6 py-4 text-xs font-medium text-thistle-300">
                          <p className="font-semibold text-thistle-200">
                            {u.commune && u.region ? `${u.commune}, ${u.region}` : u.commune || u.region || 'Chile'}
                          </p>
                          <p className="text-[11px] text-thistle-400 truncate max-w-[180px]">
                            {u.address || 'Sin dirección registrada'}
                          </p>
                        </td>

                        {/* Rol */}
                        <td className="px-6 py-4">
                          {u.role === UserRole.ADMIN ? (
                            <span className="px-3 py-1 rounded-full text-xs font-bold bg-baby_pink-950 text-baby_pink-300 border border-baby_pink-500/50 inline-flex items-center gap-1">
                              👑 Administrador
                            </span>
                          ) : (
                            <span className="px-3 py-1 rounded-full text-xs font-bold bg-sky_blue-950 text-sky_blue-300 border border-sky_blue-500/50 inline-flex items-center gap-1">
                              🐾 Usuario Estándar
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Vista Tarjetas Mobile & Tablet (< 1024px) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:hidden">
                {filteredUsers.map((u) => (
                  <div
                    key={u.id || u.email}
                    className="bg-thistle-950/40 border border-thistle-700/60 p-5 rounded-2xl space-y-4 hover:border-thistle-400 transition-all shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        {u.avatarUrl ? (
                          <img
                            src={u.avatarUrl}
                            alt={u.name}
                            className="w-12 h-12 rounded-2xl object-cover border border-thistle-600 shrink-0"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-thistle-300 to-baby_pink-400 text-white font-bold text-base flex items-center justify-center shrink-0 shadow-sm">
                            {getInitials(u.name)}
                          </div>
                        )}
                        <div>
                          <h3 className="font-bold text-base text-thistle-100">{u.name}</h3>
                          <p className="text-xs text-thistle-400">{u.email}</p>
                        </div>
                      </div>

                      {u.role === UserRole.ADMIN ? (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-baby_pink-950 text-baby_pink-300 border border-baby_pink-500/50 shrink-0">
                          👑 Admin
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-sky_blue-950 text-sky_blue-300 border border-sky_blue-500/50 shrink-0">
                          🐾 Usuario
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2 p-3 bg-thistle-900/60 rounded-xl text-xs border border-thistle-800">
                      <div>
                        <p className="text-[10px] font-bold text-thistle-400 uppercase">RUT</p>
                        <p className="font-mono font-semibold text-thistle-200 mt-0.5">{formatRut(u.rut) || u.rut || 'N/A'}</p>
                      </div>

                      <div>
                        <p className="text-[10px] font-bold text-thistle-400 uppercase">Teléfono</p>
                        <p className="font-semibold text-thistle-200 mt-0.5">{u.phone || 'N/A'}</p>
                      </div>

                      <div className="col-span-2 pt-2 border-t border-thistle-800/80">
                        <p className="text-[10px] font-bold text-thistle-400 uppercase">Residencia</p>
                        <p className="font-semibold text-thistle-200 mt-0.5">
                          {u.commune && u.region ? `${u.commune}, ${u.region}` : u.address || 'Chile'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminUsersPage;

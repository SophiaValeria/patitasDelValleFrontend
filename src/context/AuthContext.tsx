import React, { createContext, useState, useEffect, useCallback } from 'react';
import apiClient, { setToken, clearToken, getToken } from '../services/api';
import type { User, LoginPayload, RegisterPayload, UpdateProfilePayload, ApiResponse, AuthResponse } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  updateProfile: (payload: UpdateProfilePayload) => Promise<User>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setTokenState] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Cargar usuario actual si hay un token persistido
  const loadCurrentUser = useCallback(async (authToken: string) => {
    try {
      const response = await apiClient.get<ApiResponse<User>>('/auth/me');
      if (response.data.success) {
        setUser(response.data.data);
        setTokenState(authToken);
        setIsAuthenticated(true);
      } else {
        // Falló la respuesta pero no arrojó 401
        handleClearAuth();
      }
    } catch (error) {
      // El interceptor de Axios ya maneja el 401 limpiando el token,
      // pero por seguridad limpiamos el estado local aquí también.
      handleClearAuth();
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      const savedToken = getToken();
      if (savedToken) {
        await loadCurrentUser(savedToken);
      } else {
        setIsLoading(false);
      }
    };

    initAuth();

    // Escucha el evento global de sesión expirada arrojado por el interceptor de Axios
    const handleSessionExpired = () => {
      handleClearAuth();
    };

    window.addEventListener('auth:session-expired', handleSessionExpired);
    return () => {
      window.removeEventListener('auth:session-expired', handleSessionExpired);
    };
  }, [loadCurrentUser]);

  const handleClearAuth = () => {
    clearToken();
    setUser(null);
    setTokenState(null);
    setIsAuthenticated(false);
  };

  const login = async (payload: LoginPayload) => {
    setIsLoading(true);
    try {
      const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/login', payload);
      if (response.data.success) {
        const { user: loggedUser, token: authToken } = response.data.data;
        setToken(authToken);
        setUser(loggedUser);
        setTokenState(authToken);
        setIsAuthenticated(true);
      } else {
        throw new Error(response.data.message || 'Error al iniciar sesión.');
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || error.message || 'Error al iniciar sesión.';
      throw new Error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (payload: RegisterPayload) => {
    setIsLoading(true);
    try {
      const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/register', payload);
      if (response.data.success) {
        const { user: registeredUser, token: authToken } = response.data.data;
        setToken(authToken);
        setUser(registeredUser);
        setTokenState(authToken);
        setIsAuthenticated(true);
      } else {
        throw new Error(response.data.message || 'Error al registrarse.');
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || error.message || 'Error al registrarse.';
      throw new Error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (payload: UpdateProfilePayload): Promise<User> => {
    setIsLoading(true);
    try {
      const response = await apiClient.put<ApiResponse<User>>('/auth/me', payload);
      if (response.data.success) {
        const updatedUser = response.data.data;
        setUser(updatedUser);
        return updatedUser;
      } else {
        throw new Error(response.data.message || 'Error al actualizar el perfil.');
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || error.message || 'Error al actualizar el perfil.';
      throw new Error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    handleClearAuth();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isLoading,
        login,
        register,
        updateProfile,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};


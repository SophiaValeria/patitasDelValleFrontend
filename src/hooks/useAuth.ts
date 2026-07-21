import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

/**
 * Hook para consumir el contexto de autenticación global.
 * @returns El estado y acciones de autenticación
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser utilizado dentro de un AuthProvider');
  }
  return context;
};

export default useAuth;

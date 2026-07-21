/**
 * @file App.tsx
 * @description Entry point del árbol de componentes React.
 * Monta el router principal y los providers globales de contexto.
 *
 * Jerarquía de providers (de exterior a interior):
 *   <AuthProvider>          → Estado global de autenticación
 *     <AppRouter>           → Sistema de rutas
 *
 * TODO: Envolver AppRouter con AuthProvider cuando el contexto esté implementado.
 */

import AppRouter from '@/router/AppRouter';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}

export default App;

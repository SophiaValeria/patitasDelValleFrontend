/**
 * @file components/layout/MainLayout.tsx
 * @description Layout base para las rutas públicas.
 * Compone Header + <Outlet> (contenido de la ruta activa) + Footer.
 */

import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-thistle-900">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;

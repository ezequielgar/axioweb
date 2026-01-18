import { useState } from 'react';
import { useObleas } from '../context/ObleasContext';
import { useReimpresiones } from '../context/ReimpresionesContext';
import { useNavigate } from 'react-router-dom';
import FormularioOblea from './FormularioOblea';
import GridObleas from './GridObleas';
import GridObleasReimpresion from './GridObleasReimpresion';
import TabNavigation from './TabNavigation';
import NotificationsContainer from './NotificationsContainer';
import LogoutButton from './LogoutButton';
import AdminPanelButton from './AdminPanelButton';

export default function DashboardObleas() {
  const { usuario, logout } = useObleas();
  const { obtenerCantidadPendientes, obtenerSolicitudesPendientes, marcarSolicitudComoVista } = useReimpresiones();
  const navigate = useNavigate();
  const [mostrarNotificaciones, setMostrarNotificaciones] = useState(false);
  const [activeTab, setActiveTab] = useState<'obleas' | 'reimpresiones'>('obleas');

  const cantidadPendientes = obtenerCantidadPendientes();
  const solicitudesPendientes = obtenerSolicitudesPendientes().filter(s => !s.vistoPorAdmin);

  const handleLogout = () => {
    logout();
    navigate('/munismt');
  };

  const handleClickNotificacion = () => {
    if (cantidadPendientes > 0) {
      setMostrarNotificaciones(true);
    } else {
      navigate('/admin-panel/dashboard');
    }
  };

  const handleDismissNotificacion = (id: string) => {
    marcarSolicitudComoVista(id);
  };

  const handleNavigateToReimpresiones = () => {
    setMostrarNotificaciones(false);
    setActiveTab('reimpresiones');
  };

  if (!usuario) {
    navigate('/munismt');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Sistema de Gestión de Obleas</h1>
              <p className="text-slate-400 text-sm mt-1">
                {usuario.role === 'admin' ? 'Panel de Administración' : `Cliente: ${usuario.cliente}`}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-slate-300">
                {usuario.username}
              </span>
              {(usuario.role === 'admin') && (
                <div className="relative">
                  <AdminPanelButton
                    onClick={handleClickNotificacion}
                  />
                  {cantidadPendientes > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                      {cantidadPendientes}
                    </span>
                  )}
                </div>
              )}
              <LogoutButton onClick={handleLogout} />
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Formulario para solicitar obleas */}
          <FormularioOblea />

          {/* Tabs */}
          <TabNavigation
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />

          {/* Grid según tab activo */}
          {activeTab === 'obleas' ? (
            <GridObleas />
          ) : (
            <GridObleasReimpresion />
          )}
        </div>
      </main>

      {/* Toast Notifications */}
      {mostrarNotificaciones && (
        <NotificationsContainer
          notifications={solicitudesPendientes}
          onDismiss={handleDismissNotificacion}
          onNavigate={handleNavigateToReimpresiones}
        />
      )}
    </div>
  );
}

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminUsers } from '../context/AdminUsersContext';
import { useReimpresiones } from '../context/ReimpresionesContext';
import UserManagement from './UserManagement';
import NotificationsContainer from './NotificationsContainer';
import { motion } from 'motion/react';

export default function AdminDashboard() {
    const navigate = useNavigate();
    const { adminUser, logoutAdmin } = useAdminUsers();
    const { obtenerCantidadPendientes, obtenerSolicitudesPendientes, marcarSolicitudComoVista } = useReimpresiones();
    const [mostrarNotificaciones, setMostrarNotificaciones] = useState(false);

    const cantidadPendientes = obtenerCantidadPendientes();
    const solicitudesPendientes = obtenerSolicitudesPendientes().filter(s => !s.vistoPorAdmin);

    const handleLogout = () => {
        logoutAdmin();
        navigate('/admin-panel');
    };

    const handleClickNotificacion = () => {
        setMostrarNotificaciones(true);
    };

    const handleDismissNotificacion = (id: string) => {
        marcarSolicitudComoVista(id);
    };

    const handleNavigateToReimpresiones = () => {
        setMostrarNotificaciones(false);
        // Navegar a MuniSMT dashboard que tiene el tab de reimpresiones
        navigate('/munismt/dashboard');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
            {/* Background effects */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/10 via-slate-900/0 to-transparent"></div>
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIvPjwvZz48L3N2Zz4=')] opacity-20"></div>

            <div className="relative">
                {/* Navbar */}
                <motion.nav
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="bg-slate-800/50 backdrop-blur-xl border-b border-slate-700/50"
                >
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center h-16">
                            {/* Logo/Title */}
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <h1 className="text-xl font-bold text-white">Panel de Administración</h1>
                                    <p className="text-xs text-slate-400">AXIO IT Outsourcing</p>
                                </div>
                            </div>

                            {/* User Info & Logout */}
                            <div className="flex items-center gap-4">
                                <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-slate-700/50 rounded-lg">
                                    <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    <span className="text-sm text-slate-200 font-medium">{adminUser?.username}</span>
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleLogout}
                                    className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 hover:text-red-300 rounded-lg transition-all border border-red-500/30"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                    <span className="hidden sm:inline">Cerrar Sesión</span>
                                </motion.button>
                            </div>
                        </div>
                    </div>
                </motion.nav>

                {/* Main Content */}
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Notificación de Reimpresiones */}
                    {cantidadPendientes > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-8"
                        >
                            <div
                                onClick={handleClickNotificacion}
                                className="bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border border-purple-500/30 rounded-xl p-6 cursor-pointer hover:from-purple-500/20 hover:to-indigo-500/20 transition-all group"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                                            <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                                                Solicitudes de Reimpresión
                                                <span className="animate-pulse bg-red-500 text-white text-xs font-bold rounded-full px-2.5 py-0.5">
                                                    {cantidadPendientes}
                                                </span>
                                            </h3>
                                            <p className="text-slate-400 mt-1">
                                                {cantidadPendientes} solicitud{cantidadPendientes !== 1 ? 'es' : ''} pendiente{cantidadPendientes !== 1 ? 's' : ''} de revisión
                                            </p>
                                        </div>
                                    </div>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors shadow-lg shadow-purple-500/30"
                                    >
                                        Ver Notificaciones
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    <UserManagement />
                </main>
            </div>

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

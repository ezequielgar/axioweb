import { useEffect, useState } from 'react';
import type { SolicitudReimpresion } from '../types/reimpresiones';

interface NotificationToastProps {
    solicitud: SolicitudReimpresion;
    onDismiss: () => void;
    onNavigate: () => void;
}

export default function NotificationToast({ solicitud, onDismiss, onNavigate }: NotificationToastProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Animación de entrada
        setTimeout(() => setIsVisible(true), 10);

        // Auto-dismiss después de 5 segundos
        const timer = setTimeout(() => {
            handleDismiss();
        }, 5000);

        return () => clearTimeout(timer);
    }, []);

    const handleDismiss = () => {
        setIsVisible(false);
        setTimeout(onDismiss, 300); // Esperar animación de salida
    };

    const handleNavigate = () => {
        setIsVisible(false);
        setTimeout(onNavigate, 300);
    };

    return (
        <div
            className={`
                transition-all duration-300 ease-in-out
                ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
            `}
        >
            <div className="relative bg-slate-800/70 backdrop-blur-lg border border-slate-600/50 rounded-xl shadow-2xl p-4 min-w-[380px] max-w-[420px]">
                {/* Botón X */}
                <button
                    onClick={handleDismiss}
                    className="absolute top-3 right-3 text-slate-400 hover:text-white transition-colors"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* Header */}
                <div className="mb-3 pr-6">
                    <h4 className="text-white font-semibold flex items-center gap-2">
                        <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                        Nueva Solicitud de Reimpresión
                    </h4>
                </div>

                {/* Contenido */}
                <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                        <span className="text-slate-400">ID:</span>
                        <span className="text-white font-mono text-xs">{solicitud.id}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <span className="text-slate-400">Usuario:</span>
                        <span className="text-white">{solicitud.solicitadoPor}</span>
                        <span className="text-slate-500 text-xs">({solicitud.rolSolicitante})</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <span className="text-slate-400">Obleas:</span>
                        <span className="text-white font-semibold">{solicitud.obleasIds.length}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <span className="text-slate-400">Fecha:</span>
                        <span className="text-white text-xs">
                            {new Date(solicitud.fechaSolicitud).toLocaleString('es-AR', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </span>
                    </div>
                </div>

                {/* Botón de Acción */}
                <button
                    onClick={handleNavigate}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                    Ver Solicitudes de Reimpresión
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>
        </div>
    );
}

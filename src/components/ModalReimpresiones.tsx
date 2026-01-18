import { useState, useEffect } from 'react';
import { useReimpresiones } from '../context/ReimpresionesContext';
import { useObleas } from '../context/ObleasContext';

interface ModalReimpresionesProps {
    isOpen: boolean;
    onClose: () => void;
    onViewReimpresiones?: () => void;
}

export default function ModalReimpresiones({ isOpen, onClose, onViewReimpresiones }: ModalReimpresionesProps) {
    const { solicitudes, marcarSolicitudesComoVistas } = useReimpresiones();
    const { obleas } = useObleas();
    const [solicitudExpandida, setSolicitudExpandida] = useState<string | null>(null);

    // Marcar solicitudes como vistas cuando se abre el modal
    useEffect(() => {
        if (isOpen) {
            marcarSolicitudesComoVistas();
        }
    }, [isOpen, marcarSolicitudesComoVistas]);

    if (!isOpen) return null;

    const solicitudesPendientes = solicitudes.filter(s => s.estado === 'pendiente');

    const obtenerObleaPorId = (id: string) => {
        return obleas.find(o => o.id === id);
    };

    return (
        <>
            {/* Overlay */}
            <div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="fixed inset-4 md:inset-10 bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden">
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-700 flex items-center justify-between bg-slate-800/50">
                    <div>
                        <h2 className="text-2xl font-bold text-white">Notificaciones de Reimpresión</h2>
                        <p className="text-sm text-slate-400 mt-1">
                            {solicitudesPendientes.length} solicitud(es) pendiente(s) de revisión
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                    >
                        ×
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-auto p-6">
                    {solicitudesPendientes.length === 0 ? (
                        <div className="text-center py-12">
                            <svg className="w-16 h-16 mx-auto text-slate-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-slate-400 text-lg">No hay solicitudes pendientes</p>
                            <p className="text-slate-500 text-sm mt-2">Todas las solicitudes han sido procesadas</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {solicitudesPendientes.map(solicitud => (
                                <div key={solicitud.id} className="bg-slate-700/50 border border-slate-600 rounded-lg overflow-hidden">
                                    {/* Solicitud Header */}
                                    <div className="p-4">
                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                            <div>
                                                <p className="text-xs text-slate-400">ID Solicitud</p>
                                                <p className="text-sm text-white font-mono">{solicitud.id}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-400">Solicitante</p>
                                                <p className="text-sm text-white">{solicitud.solicitadoPor}</p>
                                                <p className="text-xs text-slate-500">({solicitud.rolSolicitante})</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-400">Fecha Solicitud</p>
                                                <p className="text-sm text-white">
                                                    {new Date(solicitud.fechaSolicitud).toLocaleString('es-AR')}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-400">Cantidad de Obleas</p>
                                                <p className="text-lg text-white font-bold">{solicitud.obleasIds.length}</p>
                                            </div>
                                        </div>

                                        {/* View Details Button */}
                                        <div className="mt-4">
                                            <button
                                                onClick={() => setSolicitudExpandida(solicitudExpandida === solicitud.id ? null : solicitud.id)}
                                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors"
                                            >
                                                {solicitudExpandida === solicitud.id ? 'Ocultar' : 'Ver'} Obleas
                                            </button>
                                        </div>
                                    </div>

                                    {/* Obleas Expandidas */}
                                    {solicitudExpandida === solicitud.id && (
                                        <div className="border-t border-slate-600 bg-slate-900/50 p-4">
                                            <h4 className="text-sm font-semibold text-white mb-3">Obleas Incluidas:</h4>
                                            <div className="space-y-2">
                                                {solicitud.obleasIds.map(obleaId => {
                                                    const oblea = obtenerObleaPorId(obleaId);
                                                    if (!oblea) return null;
                                                    return (
                                                        <div key={obleaId} className="bg-slate-800 p-3 rounded border border-slate-700">
                                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                                                                <div>
                                                                    <span className="text-slate-400">Nro:</span>
                                                                    <span className="text-white ml-2 font-mono">{oblea.numeroOblea || oblea.id}</span>
                                                                </div>
                                                                <div>
                                                                    <span className="text-slate-400">Dominio:</span>
                                                                    <span className="text-white ml-2 font-semibold">{oblea.dominio}</span>
                                                                </div>
                                                                <div>
                                                                    <span className="text-slate-400">Formato:</span>
                                                                    <span className="text-white ml-2">{oblea.formato}</span>
                                                                </div>
                                                                <div>
                                                                    <span className="text-slate-400">Estado:</span>
                                                                    <span className="text-white ml-2">{oblea.estado}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Action Footer */}
                    <div className="mt-6 flex gap-3">
                        <button
                            onClick={() => {
                                if (onViewReimpresiones) {
                                    onViewReimpresiones();
                                    onClose();
                                }
                            }}
                            className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                        >
                            Ver Solicitudes de Reimpresión
                        </button>
                        <button
                            onClick={onClose}
                            className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

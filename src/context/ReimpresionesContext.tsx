import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { SolicitudReimpresion, EstadoSolicitud } from '../types/reimpresiones';
import type { Oblea, EstadoOblea } from '../types/obleas';

interface ReimpresionesContextType {
    solicitudes: SolicitudReimpresion[];
    obleasReimpresion: Oblea[];
    solicitarReimpresion: (obleasIds: string[], solicitadoPor: string, rolSolicitante: 'admin' | 'cliente') => void;
    obtenerSolicitudesPendientes: () => SolicitudReimpresion[];
    obtenerCantidadPendientes: () => number;
    actualizarEstadoSolicitud: (id: string, nuevoEstado: EstadoSolicitud, motivoRechazo?: string, resueltoPor?: string) => void;
    obtenerObleasReimpresion: () => Oblea[];
    actualizarEstadoObleaReimpresion: (id: string, nuevoEstado: EstadoOblea) => void;
    eliminarObleaReimpresion: (id: string) => void;
    marcarSolicitudesComoVistas: () => void;
    marcarSolicitudComoVista: (id: string) => void; // Nueva función para marcar individual
}

const ReimpresionesContext = createContext<ReimpresionesContextType | undefined>(undefined);

export function ReimpresionesProvider({ children }: { children: ReactNode }) {
    const [solicitudes, setSolicitudes] = useState<SolicitudReimpresion[]>(() => {
        const stored = localStorage.getItem('reimpresiones_solicitudes');
        return stored ? JSON.parse(stored) : [];
    });

    const [obleasReimpresion, setObleasReimpresion] = useState<Oblea[]>(() => {
        const stored = localStorage.getItem('obleas_reimpresion');
        return stored ? JSON.parse(stored) : [];
    });

    // Guardar solicitudes en localStorage
    useEffect(() => {
        localStorage.setItem('reimpresiones_solicitudes', JSON.stringify(solicitudes));
    }, [solicitudes]);

    // Guardar obleas de reimpresión en localStorage
    useEffect(() => {
        localStorage.setItem('obleas_reimpresion', JSON.stringify(obleasReimpresion));
    }, [obleasReimpresion]);

    // Crear obleas de reimpresión a partir de obleas originales
    const crearObleasReimpresion = (obleasOriginales: Oblea[], solicitudId: string) => {
        console.log('Creando obleas de reimpresión:', obleasOriginales);

        const nuevasObleas: Oblea[] = obleasOriginales.map((obleaOriginal, index) => {
            const nuevaOblea: Oblea = {
                ...obleaOriginal,
                id: `${solicitudId}-${index}`, // ID único con índice
                numeroOblea: obleaOriginal.numeroOblea, // PRESERVAR el número original
                fechaPedido: new Date().toISOString(),
                fechaCreacion: undefined,
                fechaEntrega: undefined,
                estado: 'Pendiente' as EstadoOblea,
                creadaPor: undefined
            };
            console.log('Nueva oblea creada:', nuevaOblea);
            return nuevaOblea;
        });

        console.log('Total obleas de reimpresión a agregar:', nuevasObleas.length);
        setObleasReimpresion(prev => {
            const updated = [...prev, ...nuevasObleas];
            console.log('Estado actualizado de obleasReimpresion:', updated);
            return updated;
        });
    };

    const solicitarReimpresion = (
        obleasIds: string[],
        solicitadoPor: string,
        rolSolicitante: 'admin' | 'cliente'
    ) => {
        console.log('Solicitando reimpresión para IDs:', obleasIds);

        const nuevaSolicitud: SolicitudReimpresion = {
            id: `REI-${Date.now()}`,
            obleasIds,
            solicitadoPor,
            rolSolicitante,
            fechaSolicitud: new Date().toISOString(),
            estado: 'pendiente'
        };

        setSolicitudes(prev => [...prev, nuevaSolicitud]);

        // Crear obleas de reimpresión INMEDIATAMENTE
        const obleasStorage = localStorage.getItem('obleas');
        console.log('obleas en localStorage:', obleasStorage);

        if (obleasStorage) {
            const todasLasObleas: Oblea[] = JSON.parse(obleasStorage);
            console.log('Total obleas en storage:', todasLasObleas.length);

            const obleasOriginales = todasLasObleas.filter(o =>
                obleasIds.includes(o.id)
            );
            console.log('Obleas originales encontradas:', obleasOriginales);

            crearObleasReimpresion(obleasOriginales, nuevaSolicitud.id);
        } else {
            console.error('No se encontró obleas en localStorage');
        }
    };

    const obtenerSolicitudesPendientes = (): SolicitudReimpresion[] => {
        return solicitudes.filter(s => s.estado === 'pendiente');
    };

    const obtenerCantidadPendientes = (): number => {
        // Solo contar solicitudes pendientes que NO han sido vistas
        return solicitudes.filter(s => s.estado === 'pendiente' && !s.vistoPorAdmin).length;
    };

    const marcarSolicitudesComoVistas = () => {
        setSolicitudes(prev => prev.map(solicitud => {
            if (solicitud.estado === 'pendiente' && !solicitud.vistoPorAdmin) {
                return { ...solicitud, vistoPorAdmin: true };
            }
            return solicitud;
        }));
    };

    const marcarSolicitudComoVista = (id: string) => {
        setSolicitudes(prev => prev.map(solicitud => {
            if (solicitud.id === id) {
                return { ...solicitud, vistoPorAdmin: true };
            }
            return solicitud;
        }));
    };

    const actualizarEstadoSolicitud = (
        id: string,
        nuevoEstado: EstadoSolicitud,
        motivoRechazo?: string,
        resueltoPor?: string
    ) => {
        setSolicitudes(prev => prev.map(solicitud => {
            if (solicitud.id === id) {
                return {
                    ...solicitud,
                    estado: nuevoEstado,
                    ...(motivoRechazo && { motivoRechazo }),
                    ...(resueltoPor && { resueltoPor }),
                    fechaResolucion: new Date().toISOString()
                };
            }
            return solicitud;
        }));
    };

    const obtenerObleasReimpresion = (): Oblea[] => {
        return obleasReimpresion;
    };

    const actualizarEstadoObleaReimpresion = (id: string, nuevoEstado: EstadoOblea) => {
        setObleasReimpresion(prev => prev.map(oblea => {
            if (oblea.id === id) {
                const updates: Partial<Oblea> = { estado: nuevoEstado };

                // Si cambia a "Creada", setear fechaCreacion
                if (nuevoEstado === 'Creada' && oblea.estado !== 'Creada') {
                    updates.fechaCreacion = new Date().toISOString();
                }

                // Si cambia a "Entregada", setear fechaEntrega
                if (nuevoEstado === 'Entregada' && oblea.estado !== 'Entregada') {
                    updates.fechaEntrega = new Date().toISOString();
                }

                return { ...oblea, ...updates };
            }
            return oblea;
        }));
    };

    const eliminarObleaReimpresion = (id: string) => {
        setObleasReimpresion(prev => prev.filter(oblea => oblea.id !== id));
    };

    return (
        <ReimpresionesContext.Provider value={{
            solicitudes,
            obleasReimpresion,
            solicitarReimpresion,
            obtenerSolicitudesPendientes,
            obtenerCantidadPendientes,
            actualizarEstadoSolicitud,
            obtenerObleasReimpresion,
            actualizarEstadoObleaReimpresion,
            eliminarObleaReimpresion,
            marcarSolicitudesComoVistas,
            marcarSolicitudComoVista
        }}>
            {children}
        </ReimpresionesContext.Provider>
    );
}

export function useReimpresiones() {
    const context = useContext(ReimpresionesContext);
    if (!context) {
        throw new Error('useReimpresiones debe usarse dentro de ReimpresionesProvider');
    }
    return context;
}

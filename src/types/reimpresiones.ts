export type EstadoSolicitud = 'pendiente' | 'aprobada' | 'rechazada' | 'completada';

export interface SolicitudReimpresion {
    id: string;
    obleasIds: string[];
    solicitadoPor: string;
    rolSolicitante: 'admin' | 'cliente';
    fechaSolicitud: string;
    estado: EstadoSolicitud;
    fechaResolucion?: string;
    motivoRechazo?: string;
    resueltoPor?: string;
    vistoPorAdmin?: boolean;
}

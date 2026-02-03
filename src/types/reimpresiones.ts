export type EstadoReimpresion = "Pendiente" | "Reimprimida" | "Entregada" | "Cancelada";

export type ReimpresionOblea = {
  IdReimpresion: number;
  IdOblea: number;
  Estado: EstadoReimpresion;
  Motivo: string | null;
  SolicitadaPor: string | null;

  fechaSolicitud: string;
  fechaReimpresion: string | null;
  fechaEntrega: string | null;
  fechaCancelacion: string | null;

  nroOblea: number;
  Dominio: string;
  Formato: string;
  Cliente: "Municipalidad" | "Geogas";
};

export type CrearReimpresionBody = {
  IdOblea: number;
  Motivo?: string | null;
  SolicitadaPor?: string | null;
};

export type CambiarEstadoReimpresionBody = {
  IdReimpresion: number;
  nuevoEstado: EstadoReimpresion;
};


export type CrearReimpresionMasivoBody = {
  IdObleas: number[];
  Motivo?: string | null;
  SolicitadaPor: string;
};

export type EstadoSolicitud = 'pendiente' | 'aprobada' | 'rechazada';

export interface SolicitudReimpresion {
  id: string;
  obleasIds: string[]; // IDs de las obleas originales
  solicitadoPor: string;
  rolSolicitante: 'admin' | 'cliente';
  fechaSolicitud: string; // ISO Date
  estado: EstadoSolicitud;
  motivoRechazo?: string;
  resueltoPor?: string;
  fechaResolucion?: string;
  vistoPorAdmin?: boolean; // Nuevo campo para notificaciones
}
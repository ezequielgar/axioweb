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
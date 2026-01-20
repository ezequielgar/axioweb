export type FormatoOblea = "Interna" | "Externa" | "Tarjeta";

export type EstadoOblea = "Pendiente" | "Creada" | "Cancelada" | "Entregada";

export type ClienteType = "Municipalidad" | "Geogas";

/** Modelo de UI (lo que usás en el front) */
export interface Oblea {
  id: string;                 
  nroOblea: number;           
  dominio: string;
  formato: FormatoOblea;
  item?: string;
  reparticion?: string;
  modeloVehiculo?: string;
  estado: EstadoOblea;
  cliente: ClienteType;

  fechaPedido: string;
  fechaCreacion?: string;
  fechaEntrega?: string;
  fechaCancelada?: string;

  creadaPor?: string; 
}

/** Form del alta (crear) */
export interface ObleaFormData {
  dominio: string;
  formato: FormatoOblea;
  item?: string;
  reparticion?: string;
  modeloVehiculo?: string;
  cliente?: ClienteType;
  nroOblea: number;
  fechaPedido?: string;     
  creadaPor?: string;      
}

/** Form de edición (editar datos generales + nroOblea) */
export interface ObleaEditFormData extends ObleaFormData {
  IdOblea: number;
}

export interface Usuario {
  username: string;
  role: "admin" | "cliente";
  cliente?: ClienteType;
}

/** Lo que devuelve el backend (DB shape) */
export type ObleaApi = {
  IdOblea: number;
  nroOblea: number;
  Dominio: string;
  Formato: string;
  Cliente: string;
  Item: string | null;
  Reparticion: string | null;
  Modelo: string | null;
  Estado: string;

  fechaPedido: string;               
  fechaCreacion: string | null;      
  fechaEntrega: string | null;       
  fechaCancelada: string | null;     

  creadaPor: string | null;
};

/** BODY para crear (lo que espera el backend en crearOblea) */
export type CrearObleaApiBody = {
  Dominio: string;
  Formato: string;
  Cliente: string;
  Item: string | null;
  Reparticion: string | null;
  Modelo: string | null;
  Estado: string;
  nroOblea: number;
  fechaPedido: string;          
  creadaPor: string;            
};

/** BODY para editar (lo que espera editarOblea) */
export type EditarObleaApiBody = {
  IdOblea: number;
  Dominio: string;
  Formato: string;
  Cliente: string;
  Item: string | null;
  Reparticion: string | null;
  Modelo: string | null;
  nroOblea: number;
};

/** BODY para cambiar estado (endpoint cambiarEstado) */
export type CambiarEstadoApiBody = {
  IdOblea: number;
  nuevoEstado: EstadoOblea;
};

/** Mapper: UI -> API (crear) */
export const obleaToCreateApi = (f: ObleaFormData): CrearObleaApiBody => ({
  Dominio: f.dominio,
  Formato: f.formato,
  Cliente: f.cliente ?? "Municipalidad",
  Item: f.item?.trim() ? f.item.trim() : null,
  Reparticion: f.reparticion?.trim() ? f.reparticion.trim() : null,
  Modelo: f.modeloVehiculo?.trim() ? f.modeloVehiculo.trim() : null,
  Estado: "Pendiente",
  nroOblea: f.nroOblea,
  fechaPedido: f.fechaPedido ?? new Date().toISOString().split("T")[0],
  creadaPor: f.creadaPor ?? (f.cliente ?? "Municipalidad"),
});

/** Mapper: UI -> API (editar) */
export const obleaToEditApi = (f: ObleaEditFormData): EditarObleaApiBody => ({
  IdOblea: f.IdOblea,
  Dominio: f.dominio,
  Formato: f.formato,
  Cliente: f.cliente ?? "Municipalidad",
  Item: f.item?.trim() ? f.item.trim() : null,
  Reparticion: f.reparticion?.trim() ? f.reparticion.trim() : null,
  Modelo: f.modeloVehiculo?.trim() ? f.modeloVehiculo.trim() : null,
  nroOblea: f.nroOblea,
});

/** Mapper: API -> UI */
export const obleaFromApi = (x: ObleaApi): Oblea => ({
  id: String(x.IdOblea),
  nroOblea: x.nroOblea,
  dominio: x.Dominio,
  formato: x.Formato as FormatoOblea,
  item: x.Item ?? undefined,
  reparticion: x.Reparticion ?? undefined,
  modeloVehiculo: x.Modelo ?? undefined,
  estado: x.Estado as EstadoOblea,
  cliente: x.Cliente as ClienteType,

  fechaPedido: x.fechaPedido,
  fechaCreacion: x.fechaCreacion ?? undefined,
  fechaEntrega: x.fechaEntrega ?? undefined,
  fechaCancelada: x.fechaCancelada ?? undefined,

  creadaPor: x.creadaPor ?? undefined,
});



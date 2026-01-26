export type FormatoOblea = "Interna" | "Externa" | "Tarjeta";

export type EstadoOblea =
  | "Pendiente"
  | "Creada"
  | "Cancelada"
  | "Entregada"
  | "En reimpresion";

export type ClienteType = "Municipalidad" | "Geogas";

export interface Oblea {
  id: string; // string para UI (IdOblea convertido)
  nroOblea: number;
  dominio: string;
  formato: FormatoOblea;
  item?: string;
  numeroOblea?: string;
  reparticion?: string;
  modeloVehiculo?: string;
  estado: EstadoOblea;
  cliente: ClienteType;

  fechaPedido: string;
  fechaCreacion?: string;
  creadaPor?: string;
  fechaEntrega?: string;
  fechaCancelada?: string;
}

export interface ObleaFormData {
  dominio: string;
  formato: FormatoOblea;
  item?: string;
  numeroOblea?: string;
  reparticion?: string;
  modeloVehiculo?: string;
  cliente?: ClienteType;
  nroOblea: number;

  // opcionales (normalmente los define el backend)
  fechaPedido?: string;
  creadaPor?: string;
}

/** Form de edición */
export interface ObleaEditFormData extends ObleaFormData {
  IdOblea: number;
}

/** Usuario legacy (si aún lo usás en algún lado del front viejo) */
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

/**
 * BODY para crear (lo que espera el backend hoy).
 * Si más adelante tu back lo autogenera, podés hacerlo Partial y no mandarlo.
 */
export type CrearObleaApiBody = {
  Dominio: string;
  Formato: string;
  Cliente: string;
  Item: string | null;
  Reparticion: string | null;
  Modelo: string | null;

  // tu back hoy los espera:
  Estado: EstadoOblea;
  nroOblea: number;
  fechaPedido: string;
  creadaPor: string;
};

/** BODY para editar */
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

/** BODY para cambiar estado */
export type CambiarEstadoApiBody = {
  IdOblea: number;
  nuevoEstado: EstadoOblea;
};

/**
 * ✅ Mapper: UI -> API (crear)
 * - NO asume creadaPor por cliente
 * - fechaPedido default ISO YYYY-MM-DD
 * - Estado siempre Pendiente al crear
 */
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

  // ✅ si llega vacío acá, lo completa el hook con el usuario logueado
  creadaPor: f.creadaPor ?? "",
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

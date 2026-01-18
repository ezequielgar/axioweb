export type FormatoOblea = 'Interna' | 'Externa' | 'Tarjeta';

export type EstadoOblea = 'Pendiente' | 'Creada' | 'Cancelada' | 'Entregada';

export type ClienteType = 'Municipalidad' | 'Geogas';

export interface Oblea {
  id: string;
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
}

export interface ObleaFormData {
  dominio: string;
  formato: FormatoOblea;
  item?: string;
  numeroOblea?: string;
  reparticion?: string;
  modeloVehiculo?: string;
  cliente?: ClienteType;
}

export interface Usuario {
  username: string;
  role: 'admin' | 'cliente';
  cliente?: ClienteType;
}

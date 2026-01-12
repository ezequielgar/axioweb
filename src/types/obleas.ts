export type FormatoOblea = 'Interna' | 'Externa' | 'Tarjeta';

export type EstadoOblea = 'Pendiente' | 'Creada' | 'Cancelada';

export type ClienteType = 'Municipalidad' | 'Geogas';

export interface Oblea {
  id: string;
  dominio: string;
  formato: FormatoOblea;
  item?: string;
  reparticion?: string;
  modeloVehiculo?: string;
  estado: EstadoOblea;
  cliente: ClienteType;
  fechaPedido: string;
  fechaCreacion?: string;
  creadaPor?: string;
}

export interface ObleaFormData {
  dominio: string;
  formato: FormatoOblea;
  item?: string;
  reparticion?: string;
  modeloVehiculo?: string;
  cliente?: ClienteType;
}

export interface Usuario {
  username: string;
  role: 'admin' | 'cliente';
  cliente?: ClienteType;
}

export type EstadoTurno = "Activo" | "Inactivo";

export type Turno = {
  IdTurno: number;
  Fecha: string;
  IdPersonal: number | null;
  Estado: EstadoTurno;

  NombreCompleto?: string;
  Rol?: string;
  Telefono?: string;
};

export type CrearTurnoBody = {
  Fecha: string;
  IdPersonal: number;
  Estado?: EstadoTurno;
};

export type EditarTurnoBody = {
  IdTurno: number;
  Fecha: string;
  IdPersonal: number;
  Estado?: EstadoTurno;
};

export type EliminarTurnoParams = {
  IdTurno: string;
};

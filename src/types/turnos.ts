
export type Turno = {
  IdTurno: number;
  Fecha: string;
  Usuario: string;
  Estado: string;
};

export type CrearTurnoBody = Omit<Turno, "IdTurno">;

export type EditarTurnoBody = Turno;

export type EliminarTurnoParams = {
  IdTurno: string; 
};

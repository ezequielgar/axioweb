export type EstadoPersonal = "Activo" | "Inactivo";

export interface Personal {
  IdPersonal: number;
  NombreCompleto: string;
  Rol: string;
  Telefono: string;
  Estado: EstadoPersonal;

  whatsapp?: string;
}

export type CrearPersonalBody = Omit<Personal, "IdPersonal">;
export type EditarPersonalBody = Personal;

// ✅ ESTE ES EL QUE TE FALTA
export interface Asignacion {
  id: string;
  fecha: string;
  personalId: number;
  createdAt?: string;
}

export type AsignacionConPersonal = {
  id: string;            // IdTurno como string
  fecha: string;         // YYYY-MM-DD
  personalId: number;    // IdPersonal
  createdAt: string;     // ISO
  personal: Personal;    // objeto Personal completo
};

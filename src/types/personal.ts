// Tipos para la gestión de personal IT y turnos

export interface PersonalIT {
  id: string;
  nombre: string;
  rol: string;
  telefono: string;
  whatsapp: string; // URL completa de wa.me
  activo: boolean;
  createdAt: string;
}

export interface Asignacion {
  id: string;
  fecha: string; // ISO 'YYYY-MM-DD'
  personalId: string;
  createdAt: string;
}

// Tipo para vista combinada (asignación + datos de persona)
export interface AsignacionConPersonal extends Asignacion {
  personal: PersonalIT;
}

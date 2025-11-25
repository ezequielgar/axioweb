// Tipos para la gestión de guardias de IT
export type Guardia = {
  fecha: string; // ISO 'YYYY-MM-DD'
  nombre: string;
  rol: string;
  telefono: string;
  whatsapp?: string; // URL de wa.me
};

// Función auxiliar para generar fechas
const generarFecha = (year: number, month: number, day: number): string => {
  const fecha = new Date(year, month, day);
  return fecha.toISOString().split('T')[0];
};

// Datos de ejemplo de guardias para los próximos 3 meses (Noviembre 2025 - Enero 2026)
export const guardias: Guardia[] = [
  // Noviembre 2025
  { fecha: generarFecha(2025, 10, 25), nombre: 'Juan Pérez', rol: 'Soporte Nivel 1', telefono: '+54 9 381 440-0000', whatsapp: 'https://wa.me/5493814400000' },
  { fecha: generarFecha(2025, 10, 26), nombre: 'María García', rol: 'Soporte Nivel 2', telefono: '+54 9 381 440-0001', whatsapp: 'https://wa.me/5493814400001' },
  { fecha: generarFecha(2025, 10, 27), nombre: 'Carlos Rodríguez', rol: 'Ingeniero de Sistemas', telefono: '+54 9 381 440-0002', whatsapp: 'https://wa.me/5493814400002' },
  { fecha: generarFecha(2025, 10, 28), nombre: 'Ana Martínez', rol: 'DevOps Engineer', telefono: '+54 9 381 440-0003', whatsapp: 'https://wa.me/5493814400003' },
  { fecha: generarFecha(2025, 10, 29), nombre: 'Luis Fernández', rol: 'Soporte Nivel 1', telefono: '+54 9 381 440-0004', whatsapp: 'https://wa.me/5493814400004' },
  { fecha: generarFecha(2025, 10, 30), nombre: 'Juan Pérez', rol: 'Soporte Nivel 1', telefono: '+54 9 381 440-0000', whatsapp: 'https://wa.me/5493814400000' },
  
  // Diciembre 2025
  { fecha: generarFecha(2025, 11, 1), nombre: 'María García', rol: 'Soporte Nivel 2', telefono: '+54 9 381 440-0001', whatsapp: 'https://wa.me/5493814400001' },
  { fecha: generarFecha(2025, 11, 2), nombre: 'Carlos Rodríguez', rol: 'Ingeniero de Sistemas', telefono: '+54 9 381 440-0002', whatsapp: 'https://wa.me/5493814400002' },
  { fecha: generarFecha(2025, 11, 3), nombre: 'Ana Martínez', rol: 'DevOps Engineer', telefono: '+54 9 381 440-0003', whatsapp: 'https://wa.me/5493814400003' },
  { fecha: generarFecha(2025, 11, 4), nombre: 'Luis Fernández', rol: 'Soporte Nivel 1', telefono: '+54 9 381 440-0004', whatsapp: 'https://wa.me/5493814400004' },
  { fecha: generarFecha(2025, 11, 5), nombre: 'Juan Pérez', rol: 'Soporte Nivel 1', telefono: '+54 9 381 440-0000', whatsapp: 'https://wa.me/5493814400000' },
  { fecha: generarFecha(2025, 11, 6), nombre: 'María García', rol: 'Soporte Nivel 2', telefono: '+54 9 381 440-0001', whatsapp: 'https://wa.me/5493814400001' },
  { fecha: generarFecha(2025, 11, 7), nombre: 'Carlos Rodríguez', rol: 'Ingeniero de Sistemas', telefono: '+54 9 381 440-0002', whatsapp: 'https://wa.me/5493814400002' },
  { fecha: generarFecha(2025, 11, 8), nombre: 'Ana Martínez', rol: 'DevOps Engineer', telefono: '+54 9 381 440-0003', whatsapp: 'https://wa.me/5493814400003' },
  { fecha: generarFecha(2025, 11, 9), nombre: 'Luis Fernández', rol: 'Soporte Nivel 1', telefono: '+54 9 381 440-0004', whatsapp: 'https://wa.me/5493814400004' },
  { fecha: generarFecha(2025, 11, 10), nombre: 'Juan Pérez', rol: 'Soporte Nivel 1', telefono: '+54 9 381 440-0000', whatsapp: 'https://wa.me/5493814400000' },
  { fecha: generarFecha(2025, 11, 11), nombre: 'María García', rol: 'Soporte Nivel 2', telefono: '+54 9 381 440-0001', whatsapp: 'https://wa.me/5493814400001' },
  { fecha: generarFecha(2025, 11, 12), nombre: 'Carlos Rodríguez', rol: 'Ingeniero de Sistemas', telefono: '+54 9 381 440-0002', whatsapp: 'https://wa.me/5493814400002' },
  { fecha: generarFecha(2025, 11, 13), nombre: 'Ana Martínez', rol: 'DevOps Engineer', telefono: '+54 9 381 440-0003', whatsapp: 'https://wa.me/5493814400003' },
  { fecha: generarFecha(2025, 11, 14), nombre: 'Luis Fernández', rol: 'Soporte Nivel 1', telefono: '+54 9 381 440-0004', whatsapp: 'https://wa.me/5493814400004' },
  { fecha: generarFecha(2025, 11, 15), nombre: 'Juan Pérez', rol: 'Soporte Nivel 1', telefono: '+54 9 381 440-0000', whatsapp: 'https://wa.me/5493814400000' },
  { fecha: generarFecha(2025, 11, 16), nombre: 'María García', rol: 'Soporte Nivel 2', telefono: '+54 9 381 440-0001', whatsapp: 'https://wa.me/5493814400001' },
  { fecha: generarFecha(2025, 11, 17), nombre: 'Carlos Rodríguez', rol: 'Ingeniero de Sistemas', telefono: '+54 9 381 440-0002', whatsapp: 'https://wa.me/5493814400002' },
  { fecha: generarFecha(2025, 11, 18), nombre: 'Ana Martínez', rol: 'DevOps Engineer', telefono: '+54 9 381 440-0003', whatsapp: 'https://wa.me/5493814400003' },
  { fecha: generarFecha(2025, 11, 19), nombre: 'Luis Fernández', rol: 'Soporte Nivel 1', telefono: '+54 9 381 440-0004', whatsapp: 'https://wa.me/5493814400004' },
  { fecha: generarFecha(2025, 11, 20), nombre: 'Juan Pérez', rol: 'Soporte Nivel 1', telefono: '+54 9 381 440-0000', whatsapp: 'https://wa.me/5493814400000' },
  { fecha: generarFecha(2025, 11, 21), nombre: 'María García', rol: 'Soporte Nivel 2', telefono: '+54 9 381 440-0001', whatsapp: 'https://wa.me/5493814400001' },
  { fecha: generarFecha(2025, 11, 22), nombre: 'Carlos Rodríguez', rol: 'Ingeniero de Sistemas', telefono: '+54 9 381 440-0002', whatsapp: 'https://wa.me/5493814400002' },
  { fecha: generarFecha(2025, 11, 23), nombre: 'Ana Martínez', rol: 'DevOps Engineer', telefono: '+54 9 381 440-0003', whatsapp: 'https://wa.me/5493814400003' },
  { fecha: generarFecha(2025, 11, 24), nombre: 'Luis Fernández', rol: 'Soporte Nivel 1', telefono: '+54 9 381 440-0004', whatsapp: 'https://wa.me/5493814400004' },
  { fecha: generarFecha(2025, 11, 25), nombre: 'Juan Pérez', rol: 'Soporte Nivel 1', telefono: '+54 9 381 440-0000', whatsapp: 'https://wa.me/5493814400000' },
  { fecha: generarFecha(2025, 11, 26), nombre: 'María García', rol: 'Soporte Nivel 2', telefono: '+54 9 381 440-0001', whatsapp: 'https://wa.me/5493814400001' },
  { fecha: generarFecha(2025, 11, 27), nombre: 'Carlos Rodríguez', rol: 'Ingeniero de Sistemas', telefono: '+54 9 381 440-0002', whatsapp: 'https://wa.me/5493814400002' },
  { fecha: generarFecha(2025, 11, 28), nombre: 'Ana Martínez', rol: 'DevOps Engineer', telefono: '+54 9 381 440-0003', whatsapp: 'https://wa.me/5493814400003' },
  { fecha: generarFecha(2025, 11, 29), nombre: 'Luis Fernández', rol: 'Soporte Nivel 1', telefono: '+54 9 381 440-0004', whatsapp: 'https://wa.me/5493814400004' },
  { fecha: generarFecha(2025, 11, 30), nombre: 'Juan Pérez', rol: 'Soporte Nivel 1', telefono: '+54 9 381 440-0000', whatsapp: 'https://wa.me/5493814400000' },
  { fecha: generarFecha(2025, 11, 31), nombre: 'María García', rol: 'Soporte Nivel 2', telefono: '+54 9 381 440-0001', whatsapp: 'https://wa.me/5493814400001' },
  
  // Enero 2026
  { fecha: generarFecha(2026, 0, 1), nombre: 'Carlos Rodríguez', rol: 'Ingeniero de Sistemas', telefono: '+54 9 381 440-0002', whatsapp: 'https://wa.me/5493814400002' },
  { fecha: generarFecha(2026, 0, 2), nombre: 'Ana Martínez', rol: 'DevOps Engineer', telefono: '+54 9 381 440-0003', whatsapp: 'https://wa.me/5493814400003' },
  { fecha: generarFecha(2026, 0, 3), nombre: 'Luis Fernández', rol: 'Soporte Nivel 1', telefono: '+54 9 381 440-0004', whatsapp: 'https://wa.me/5493814400004' },
  { fecha: generarFecha(2026, 0, 4), nombre: 'Juan Pérez', rol: 'Soporte Nivel 1', telefono: '+54 9 381 440-0000', whatsapp: 'https://wa.me/5493814400000' },
  { fecha: generarFecha(2026, 0, 5), nombre: 'María García', rol: 'Soporte Nivel 2', telefono: '+54 9 381 440-0001', whatsapp: 'https://wa.me/5493814400001' },
  { fecha: generarFecha(2026, 0, 6), nombre: 'Carlos Rodríguez', rol: 'Ingeniero de Sistemas', telefono: '+54 9 381 440-0002', whatsapp: 'https://wa.me/5493814400002' },
  { fecha: generarFecha(2026, 0, 7), nombre: 'Ana Martínez', rol: 'DevOps Engineer', telefono: '+54 9 381 440-0003', whatsapp: 'https://wa.me/5493814400003' },
  { fecha: generarFecha(2026, 0, 8), nombre: 'Luis Fernández', rol: 'Soporte Nivel 1', telefono: '+54 9 381 440-0004', whatsapp: 'https://wa.me/5493814400004' },
  { fecha: generarFecha(2026, 0, 9), nombre: 'Juan Pérez', rol: 'Soporte Nivel 1', telefono: '+54 9 381 440-0000', whatsapp: 'https://wa.me/5493814400000' },
  { fecha: generarFecha(2026, 0, 10), nombre: 'María García', rol: 'Soporte Nivel 2', telefono: '+54 9 381 440-0001', whatsapp: 'https://wa.me/5493814400001' },
  { fecha: generarFecha(2026, 0, 11), nombre: 'Carlos Rodríguez', rol: 'Ingeniero de Sistemas', telefono: '+54 9 381 440-0002', whatsapp: 'https://wa.me/5493814400002' },
  { fecha: generarFecha(2026, 0, 12), nombre: 'Ana Martínez', rol: 'DevOps Engineer', telefono: '+54 9 381 440-0003', whatsapp: 'https://wa.me/5493814400003' },
  { fecha: generarFecha(2026, 0, 13), nombre: 'Luis Fernández', rol: 'Soporte Nivel 1', telefono: '+54 9 381 440-0004', whatsapp: 'https://wa.me/5493814400004' },
  { fecha: generarFecha(2026, 0, 14), nombre: 'Juan Pérez', rol: 'Soporte Nivel 1', telefono: '+54 9 381 440-0000', whatsapp: 'https://wa.me/5493814400000' },
  { fecha: generarFecha(2026, 0, 15), nombre: 'María García', rol: 'Soporte Nivel 2', telefono: '+54 9 381 440-0001', whatsapp: 'https://wa.me/5493814400001' },
  { fecha: generarFecha(2026, 0, 16), nombre: 'Carlos Rodríguez', rol: 'Ingeniero de Sistemas', telefono: '+54 9 381 440-0002', whatsapp: 'https://wa.me/5493814400002' },
  { fecha: generarFecha(2026, 0, 17), nombre: 'Ana Martínez', rol: 'DevOps Engineer', telefono: '+54 9 381 440-0003', whatsapp: 'https://wa.me/5493814400003' },
  { fecha: generarFecha(2026, 0, 18), nombre: 'Luis Fernández', rol: 'Soporte Nivel 1', telefono: '+54 9 381 440-0004', whatsapp: 'https://wa.me/5493814400004' },
  { fecha: generarFecha(2026, 0, 19), nombre: 'Juan Pérez', rol: 'Soporte Nivel 1', telefono: '+54 9 381 440-0000', whatsapp: 'https://wa.me/5493814400000' },
  { fecha: generarFecha(2026, 0, 20), nombre: 'María García', rol: 'Soporte Nivel 2', telefono: '+54 9 381 440-0001', whatsapp: 'https://wa.me/5493814400001' },
  { fecha: generarFecha(2026, 0, 21), nombre: 'Carlos Rodríguez', rol: 'Ingeniero de Sistemas', telefono: '+54 9 381 440-0002', whatsapp: 'https://wa.me/5493814400002' },
  { fecha: generarFecha(2026, 0, 22), nombre: 'Ana Martínez', rol: 'DevOps Engineer', telefono: '+54 9 381 440-0003', whatsapp: 'https://wa.me/5493814400003' },
  { fecha: generarFecha(2026, 0, 23), nombre: 'Luis Fernández', rol: 'Soporte Nivel 1', telefono: '+54 9 381 440-0004', whatsapp: 'https://wa.me/5493814400004' },
  { fecha: generarFecha(2026, 0, 24), nombre: 'Juan Pérez', rol: 'Soporte Nivel 1', telefono: '+54 9 381 440-0000', whatsapp: 'https://wa.me/5493814400000' },
  { fecha: generarFecha(2026, 0, 25), nombre: 'María García', rol: 'Soporte Nivel 2', telefono: '+54 9 381 440-0001', whatsapp: 'https://wa.me/5493814400001' },
  { fecha: generarFecha(2026, 0, 26), nombre: 'Carlos Rodríguez', rol: 'Ingeniero de Sistemas', telefono: '+54 9 381 440-0002', whatsapp: 'https://wa.me/5493814400002' },
  { fecha: generarFecha(2026, 0, 27), nombre: 'Ana Martínez', rol: 'DevOps Engineer', telefono: '+54 9 381 440-0003', whatsapp: 'https://wa.me/5493814400003' },
  { fecha: generarFecha(2026, 0, 28), nombre: 'Luis Fernández', rol: 'Soporte Nivel 1', telefono: '+54 9 381 440-0004', whatsapp: 'https://wa.me/5493814400004' },
  { fecha: generarFecha(2026, 0, 29), nombre: 'Juan Pérez', rol: 'Soporte Nivel 1', telefono: '+54 9 381 440-0000', whatsapp: 'https://wa.me/5493814400000' },
  { fecha: generarFecha(2026, 0, 30), nombre: 'María García', rol: 'Soporte Nivel 2', telefono: '+54 9 381 440-0001', whatsapp: 'https://wa.me/5493814400001' },
  { fecha: generarFecha(2026, 0, 31), nombre: 'Carlos Rodríguez', rol: 'Ingeniero de Sistemas', telefono: '+54 9 381 440-0002', whatsapp: 'https://wa.me/5493814400002' },
];

// Función para obtener la guardia de un día específico
export const obtenerGuardiaPorFecha = (fecha: string): Guardia | undefined => {
  return guardias.find(g => g.fecha === fecha);
};

// Función para obtener todas las personas únicas (para el filtro)
export const obtenerPersonasUnicas = (): string[] => {
  const nombres = guardias.map(g => g.nombre);
  return Array.from(new Set(nombres));
};

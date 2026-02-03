import { useLocalStorage } from './useLocalStorage';
import { usePersonal } from './usePersonal';
import type { Asignacion, AsignacionConPersonal } from '../types/personal';

// Hook para gestionar asignaciones de turnos
export function useAsignaciones() {
  const [asignaciones, setAsignaciones] = useLocalStorage<Asignacion[]>('axio_asignaciones', []);
  const { obtenerPersonalPorId } = usePersonal();

  const agregarAsignacion = (fecha: string, personalId: number) => {
    // Verificar si ya existe una asignación para esa fecha
    const existente = asignaciones.find(a => a.fecha === fecha);

    if (existente) {
      // Actualizar la asignación existente
      setAsignaciones(asignaciones.map(a =>
        a.fecha === fecha ? { ...a, personalId } : a
      ));
      return existente;
    } else {
      // Crear nueva asignación
      const nueva: Asignacion = {
        id: crypto.randomUUID(),
        fecha,
        personalId,
        createdAt: new Date().toISOString()
      };
      setAsignaciones([...asignaciones, nueva]);
      return nueva;
    }
  };

  const eliminarAsignacion = (fecha: string) => {
    setAsignaciones(asignaciones.filter(a => a.fecha !== fecha));
  };

  const obtenerAsignacionPorFecha = (fecha: string): AsignacionConPersonal | undefined => {
    const asignacion = asignaciones.find(a => a.fecha === fecha);
    if (!asignacion) return undefined;

    const personal = obtenerPersonalPorId(asignacion.personalId);
    if (!personal) return undefined;

    return {
      ...asignacion,
      createdAt: asignacion.createdAt ?? new Date().toISOString(),
      personal
    };
  };

  const obtenerAsignacionesConPersonal = (): AsignacionConPersonal[] => {
    return asignaciones
      .map(asignacion => {
        const personal = obtenerPersonalPorId(asignacion.personalId);
        if (!personal) return null;
        return {
          ...asignacion,
          createdAt: asignacion.createdAt ?? new Date().toISOString(),
          personal
        };
      })
      .filter((a): a is AsignacionConPersonal => a !== null);
  };

  const obtenerAsignacionesPorPersonal = (personalId: number): Asignacion[] => {
    return asignaciones.filter(a => a.personalId === personalId);
  };

  return {
    asignaciones,
    agregarAsignacion,
    eliminarAsignacion,
    obtenerAsignacionPorFecha,
    obtenerAsignacionesConPersonal,
    obtenerAsignacionesPorPersonal
  };
}

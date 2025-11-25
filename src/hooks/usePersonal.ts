import { useLocalStorage } from './useLocalStorage';
import type { PersonalIT } from '../types/personal';

// Hook para gestionar el personal IT
export function usePersonal() {
  const [personal, setPersonal] = useLocalStorage<PersonalIT[]>('axio_personal', []);

  const agregarPersonal = (nuevoPersonal: Omit<PersonalIT, 'id' | 'createdAt'>) => {
    const nuevo: PersonalIT = {
      ...nuevoPersonal,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString()
    };
    setPersonal([...personal, nuevo]);
    return nuevo;
  };

  const actualizarPersonal = (id: string, datos: Partial<Omit<PersonalIT, 'id' | 'createdAt'>>) => {
    setPersonal(personal.map(p => 
      p.id === id ? { ...p, ...datos } : p
    ));
  };

  const eliminarPersonal = (id: string) => {
    setPersonal(personal.filter(p => p.id !== id));
  };

  const obtenerPersonalPorId = (id: string) => {
    return personal.find(p => p.id === id);
  };

  const obtenerPersonalActivo = () => {
    return personal.filter(p => p.activo);
  };

  return {
    personal,
    agregarPersonal,
    actualizarPersonal,
    eliminarPersonal,
    obtenerPersonalPorId,
    obtenerPersonalActivo
  };
}

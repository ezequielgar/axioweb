import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Oblea, ObleaFormData, Usuario, EstadoOblea, ClienteType } from '../types/obleas';

interface ObleasContextType {
  obleas: Oblea[];
  usuario: Usuario | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  crearOblea: (data: ObleaFormData) => void;
  actualizarEstado: (ids: string[], nuevoEstado: EstadoOblea) => void;
  actualizarId: (idActual: string, nuevoId: string) => boolean;
  eliminarOblea: (id: string) => void;
  filtrarObleas: (estado?: EstadoOblea, cliente?: ClienteType) => Oblea[];
}

const ObleasContext = createContext<ObleasContextType | undefined>(undefined);

// Usuarios predefinidos
const usuarios: { [key: string]: Usuario & { password: string } } = {
  'admin': { username: 'admin', password: 'admin123', role: 'admin' },
  'municipalidad': { username: 'municipalidad', password: 'muni123', role: 'cliente', cliente: 'Municipalidad' },
  'geogas': { username: 'geogas', password: 'geo123', role: 'cliente', cliente: 'Geogas' }
};

export function ObleasProvider({ children }: { children: ReactNode }) {
  const [obleas, setObleas] = useState<Oblea[]>(() => {
    const stored = localStorage.getItem('obleas');
    return stored ? JSON.parse(stored) : [];
  });
  
  const [usuario, setUsuario] = useState<Usuario | null>(() => {
    const stored = localStorage.getItem('obleas_usuario');
    return stored ? JSON.parse(stored) : null;
  });

  // Guardar obleas en localStorage
  useEffect(() => {
    localStorage.setItem('obleas', JSON.stringify(obleas));
  }, [obleas]);

  const login = (username: string, password: string): boolean => {
    const user = usuarios[username];
    if (user && user.password === password) {
      const { password: _, ...userWithoutPassword } = user;
      setUsuario(userWithoutPassword);
      localStorage.setItem('obleas_usuario', JSON.stringify(userWithoutPassword));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUsuario(null);
    localStorage.removeItem('obleas_usuario');
  };

  const crearOblea = (data: ObleaFormData) => {
    if (!usuario || usuario.role !== 'cliente') return;

    const nuevaOblea: Oblea = {
      id: `OBL-${Date.now()}`,
      ...data,
      estado: 'Pendiente',
      cliente: usuario.cliente!,
      fechaPedido: new Date().toISOString(),
    };

    setObleas(prev => [...prev, nuevaOblea]);
  };

  const actualizarEstado = (ids: string[], nuevoEstado: EstadoOblea) => {
    setObleas(prev => prev.map(oblea => {
      if (ids.includes(oblea.id)) {
        return {
          ...oblea,
          estado: nuevoEstado,
          ...(nuevoEstado === 'Creada' && {
            fechaCreacion: new Date().toISOString(),
            creadaPor: usuario?.username
          })
        };
      }
      return oblea;
    }));
  };

  const actualizarId = (idActual: string, nuevoId: string): boolean => {
    // Verificar que el nuevo ID no exista ya
    if (obleas.some(oblea => oblea.id === nuevoId && oblea.id !== idActual)) {
      return false; // ID duplicado
    }

    setObleas(prev => prev.map(oblea => {
      if (oblea.id === idActual) {
        return { ...oblea, id: nuevoId };
      }
      return oblea;
    }));

    return true;
  };

  const eliminarOblea = (id: string) => {
    setObleas(prev => prev.filter(oblea => oblea.id !== id));
  };

  const filtrarObleas = (estado?: EstadoOblea, cliente?: ClienteType): Oblea[] => {
    return obleas.filter(oblea => {
      const matchEstado = !estado || oblea.estado === estado;
      const matchCliente = !cliente || oblea.cliente === cliente;
      return matchEstado && matchCliente;
    });
  };

  return (
    <ObleasContext.Provider value={{
      obleas,
      usuario,
      login,
      logout,
      crearOblea,
      actualizarEstado,
      actualizarId,
      eliminarOblea,
      filtrarObleas
    }}>
      {children}
    </ObleasContext.Provider>
  );
}

export function useObleas() {
  const context = useContext(ObleasContext);
  if (!context) {
    throw new Error('useObleas debe usarse dentro de ObleasProvider');
  }
  return context;
}

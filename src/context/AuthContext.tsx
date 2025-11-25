import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

// Tipo para roles de usuario
export type UserRole = 'admin' | 'viewer';

// Tipo para el usuario autenticado
interface User {
  email: string;
  nombre: string;
  role: UserRole;
}

// Tipo para el contexto de autenticación
interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isViewer: boolean;
}

// Crear el contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Credenciales de ejemplo (simuladas)
const VALID_CREDENTIALS = [
  {
    email: 'admin@axio.com',
    password: 'Axio2025!',
    nombre: 'Administrador AXIO',
    role: 'admin' as UserRole
  },
  {
    email: 'viewer@axio.com',
    password: 'Viewer2025!',
    nombre: 'Usuario Viewer',
    role: 'viewer' as UserRole
  }
];

// Proveedor del contexto
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  // Cargar sesión desde localStorage al iniciar
  useEffect(() => {
    const storedUser = localStorage.getItem('axio_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error al cargar usuario:', error);
        localStorage.removeItem('axio_user');
      }
    }
  }, []);

  // Función de login
  const login = (email: string, password: string): boolean => {
    const validUser = VALID_CREDENTIALS.find(
      cred => cred.email === email && cred.password === password
    );
    
    if (validUser) {
      const userData: User = {
        email: validUser.email,
        nombre: validUser.nombre,
        role: validUser.role
      };
      setUser(userData);
      localStorage.setItem('axio_user', JSON.stringify(userData));
      return true;
    }
    return false;
  };

  // Función de logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem('axio_user');
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isViewer: user?.role === 'viewer'
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook personalizado para usar el contexto de autenticación
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

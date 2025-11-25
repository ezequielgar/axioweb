import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { ReactNode } from 'react';

interface AdminRouteProps {
  children: ReactNode;
}

// Componente para proteger rutas que requieren rol de admin
const AdminRoute = ({ children }: AdminRouteProps) => {
  const { isAuthenticated, isAdmin } = useAuth();

  // Si no está autenticado, redirigir al login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Si está autenticado pero no es admin, redirigir a turnos
  if (!isAdmin) {
    return <Navigate to="/turnos" replace />;
  }

  // Si es admin, mostrar el contenido
  return <>{children}</>;
};

export default AdminRoute;

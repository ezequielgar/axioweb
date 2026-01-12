import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useObleas } from '../context/ObleasContext';

interface ProtectedRouteObleasProps {
  children: ReactNode;
  adminOnly?: boolean;
}

export default function ProtectedRouteObleas({ children, adminOnly = false }: ProtectedRouteObleasProps) {
  const { usuario } = useObleas();

  if (!usuario) {
    return <Navigate to="/munismt" replace />;
  }

  if (adminOnly && usuario.role !== 'admin') {
    return <Navigate to="/munismt/dashboard" replace />;
  }

  return <>{children}</>;
}

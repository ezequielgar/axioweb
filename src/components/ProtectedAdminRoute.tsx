import { Navigate } from 'react-router-dom';
import { useAdminUsers } from '../context/AdminUsersContext';
import type { ReactNode } from 'react';

interface ProtectedAdminRouteProps {
    children: ReactNode;
}

export default function ProtectedAdminRoute({ children }: ProtectedAdminRouteProps) {
    const { isAdminAuthenticated } = useAdminUsers();

    if (!isAdminAuthenticated) {
        return <Navigate to="/admin-panel" replace />;
    }

    return <>{children}</>;
}

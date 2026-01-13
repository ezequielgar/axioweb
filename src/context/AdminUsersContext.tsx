import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { AdminContextType, AdminUser, ClientUser } from '../types/admin';

const AdminContext = createContext<AdminContextType | undefined>(undefined);

// Credencial de super-admin (hardcoded por seguridad)
const SUPER_ADMIN_CREDENTIALS = {
    username: 'superadmin',
    password: 'Axio2025Admin!',
};

export function AdminUsersProvider({ children }: { children: ReactNode }) {
    // Estado del admin autenticado
    const [adminUser, setAdminUser] = useState<AdminUser | null>(() => {
        const stored = localStorage.getItem('admin_user');
        return stored ? JSON.parse(stored) : null;
    });

    // Estado de usuarios cliente (estos podrán acceder a /munismt)
    const [clientUsers, setClientUsers] = useState<ClientUser[]>(() => {
        const stored = localStorage.getItem('admin_client_users');
        return stored ? JSON.parse(stored) : [];
    });

    // Guardar usuarios en localStorage
    useEffect(() => {
        localStorage.setItem('admin_client_users', JSON.stringify(clientUsers));

        // Sincronizar con ObleasContext: actualizar los usuarios disponibles
        // Los usuarios creados aquí podrán hacer login en /munismt
        syncWithObleasContext();
    }, [clientUsers]);

    // Sincronizar usuarios creados con el sistema de obleas
    const syncWithObleasContext = () => {
        // Guardamos los usuarios en un formato compatible con ObleasContext
        const obleasUsers = clientUsers.reduce((acc, user) => {
            acc[user.username] = {
                username: user.username,
                password: user.password,
                role: 'cliente' as const, // Siempre 'cliente' para obleas
                cliente: user.cliente,
            };
            return acc;
        }, {} as Record<string, any>);

        localStorage.setItem('obleas_custom_users', JSON.stringify(obleasUsers));
    };

    // Login del super-admin
    const loginAdmin = (username: string, password: string): boolean => {
        if (
            username === SUPER_ADMIN_CREDENTIALS.username &&
            password === SUPER_ADMIN_CREDENTIALS.password
        ) {
            const admin: AdminUser = {
                username: SUPER_ADMIN_CREDENTIALS.username,
                role: 'super-admin',
            };
            setAdminUser(admin);
            localStorage.setItem('admin_user', JSON.stringify(admin));
            return true;
        }
        return false;
    };

    // Logout del admin
    const logoutAdmin = () => {
        setAdminUser(null);
        localStorage.removeItem('admin_user');
    };

    // Crear nuevo usuario cliente
    const createClientUser = (
        data: Omit<ClientUser, 'id' | 'fechaCreacion'>
    ): boolean => {
        // Validar que no exista el username
        if (clientUsers.some(user => user.username === data.username)) {
            return false; // Username ya existe
        }

        const newUser: ClientUser = {
            ...data,
            id: `USER-${Date.now()}`,
            fechaCreacion: new Date().toISOString(),
        };

        setClientUsers(prev => [...prev, newUser]);
        return true;
    };

    // Actualizar usuario cliente
    const updateClientUser = (id: string, data: Partial<ClientUser>): boolean => {
        // Si se intenta cambiar el username, validar que no exista
        if (data.username) {
            const existingUser = clientUsers.find(
                user => user.username === data.username && user.id !== id
            );
            if (existingUser) {
                return false; // Username ya existe
            }
        }

        setClientUsers(prev =>
            prev.map(user =>
                user.id === id
                    ? { ...user, ...data, id } // Mantener id, permitir actualizar role
                    : user
            )
        );
        return true;
    };

    // Eliminar usuario cliente
    const deleteClientUser = (id: string) => {
        setClientUsers(prev => prev.filter(user => user.id !== id));
    };

    const value: AdminContextType = {
        adminUser,
        clientUsers,
        loginAdmin,
        logoutAdmin,
        createClientUser,
        updateClientUser,
        deleteClientUser,
        isAdminAuthenticated: !!adminUser,
    };

    return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export function useAdminUsers(): AdminContextType {
    const context = useContext(AdminContext);
    if (!context) {
        throw new Error('useAdminUsers debe usarse dentro de AdminUsersProvider');
    }
    return context;
}

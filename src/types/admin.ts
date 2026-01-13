// Tipos para el panel de administración

// Usuario cliente que podrá acceder al panel de obleas
export interface ClientUser {
    id: string;
    username: string;
    password: string;
    email: string;
    telefono: string;
    comentario?: string;
    fechaCreacion: string;
    role: 'superadmin' | 'admin' | 'usuario';  // Roles del sistema
    cliente?: string;  // Cliente/Organización asignado (opcional)
}

// Usuario administrador del panel
export interface AdminUser {
    username: string;
    role: 'super-admin';
}

// Contexto de administración
export interface AdminContextType {
    adminUser: AdminUser | null;
    clientUsers: ClientUser[];
    loginAdmin: (username: string, password: string) => boolean;
    logoutAdmin: () => void;
    createClientUser: (data: Omit<ClientUser, 'id' | 'fechaCreacion'>) => boolean;
    updateClientUser: (id: string, data: Partial<ClientUser>) => boolean;
    deleteClientUser: (id: string) => void;
    isAdminAuthenticated: boolean;
}

import { useState, useEffect } from 'react';
import { useAdminUsers } from '../context/AdminUsersContext';
import { motion, AnimatePresence } from 'motion/react';
import type { ClientUser } from '../types/admin';

export default function UserManagement() {
    const { clientUsers, createClientUser, updateClientUser, deleteClientUser } = useAdminUsers();

    // Form state
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [telefono, setTelefono] = useState('');
    const [comentario, setComentario] = useState('');
    const [role, setRole] = useState<'superadmin' | 'admin' | 'usuario'>('usuario');
    const [cliente, setCliente] = useState<string>('');

    // Organization management
    const [organizationMode, setOrganizationMode] = useState<'existing' | 'new'>('existing');
    const [newOrganization, setNewOrganization] = useState('');
    const [organizations, setOrganizations] = useState<string[]>(['Municipalidad', 'Geogas']);

    // UI state
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [editingUser, setEditingUser] = useState<ClientUser | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Load organizations from localStorage
    useEffect(() => {
        const savedOrgs = localStorage.getItem('organizations');
        if (savedOrgs) {
            try {
                setOrganizations(JSON.parse(savedOrgs));
            } catch (e) {
                // Ignore parse errors
            }
        }
    }, []);

    const resetForm = () => {
        setUsername('');
        setPassword('');
        setEmail('');
        setTelefono('');
        setComentario('');
        setRole('usuario');
        setCliente('');
        setOrganizationMode('existing');
        setNewOrganization('');
        setError('');
        setSuccess('');
        setEditingUser(null);
    };

    const validateForm = (): boolean => {
        if (!username || !password || !email || !telefono) {
            setError('Usuario, contraseña, email y teléfono son obligatorios');
            return false;
        }

        if (organizationMode === 'new' && !newOrganization.trim()) {
            setError('Ingresa el nombre de la nueva organización');
            return false;
        }

        if (username.length < 3) {
            setError('El usuario debe tener al menos 3 caracteres');
            return false;
        }

        if (username.includes(' ')) {
            setError('El usuario no puede contener espacios');
            return false;
        }

        if (password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres');
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('Email inválido');
            return false;
        }

        const telefonoRegex = /^\d+$/;
        if (!telefonoRegex.test(telefono)) {
            setError('El teléfono solo debe contener números');
            return false;
        }

        return true;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!validateForm()) return;

        // Handle new organization
        let finalCliente = cliente;
        if (organizationMode === 'new' && newOrganization.trim()) {
            finalCliente = newOrganization.trim();
            // Add to organizations list and save to localStorage
            const updatedOrgs = [...organizations, finalCliente];
            setOrganizations(updatedOrgs);
            localStorage.setItem('organizations', JSON.stringify(updatedOrgs));
        }

        if (editingUser) {
            // Actualizar usuario existente
            const success = updateClientUser(editingUser.id, {
                username,
                password,
                email,
                telefono,
                comentario,
                role,
                cliente: finalCliente,
            });

            if (success) {
                setSuccess('Usuario actualizado correctamente');
                resetForm();
            } else {
                setError('Error: el nombre de usuario ya existe');
            }
        } else {
            // Crear nuevo usuario
            const success = createClientUser({
                username,
                password,
                email,
                telefono,
                comentario,
                role,
                cliente: finalCliente,
            });

            if (success) {
                setSuccess(`Usuario "${username}" creado exitosamente. Ya puede acceder a /munismt`);
                resetForm();
            } else {
                setError('Error: el nombre de usuario ya existe');
            }
        }
    };

    const handleEdit = (user: ClientUser) => {
        setEditingUser(user);
        setUsername(user.username);
        setPassword(user.password);
        setEmail(user.email);
        setTelefono(user.telefono);
        setComentario(user.comentario || '');
        setRole(user.role);
        setCliente(user.cliente || '');
        if (user.cliente && organizations.includes(user.cliente)) {
            setOrganizationMode('existing');
        } else if (user.cliente) {
            setOrganizationMode('new');
            setNewOrganization(user.cliente);
        }
        setError('');
        setSuccess('');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = (id: string) => {
        deleteClientUser(id);
        setDeleteConfirm(null);
        setSuccess('Usuario eliminado correctamente');
    };

    const filteredUsers = clientUsers.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.telefono.includes(searchTerm)
    );

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h2 className="text-3xl font-bold text-white mb-2">Gestión de Usuarios</h2>
                <p className="text-slate-400">Crea y administra usuarios que podrán acceder al módulo de obleas</p>
            </div>

            {/* Form Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6"
            >
                <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                    <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                    {editingUser ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
                </h3>

                {/* Messages */}
                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            className="mb-4 bg-red-500/10 border border-red-500/50 rounded-lg p-4"
                        >
                            <p className="text-red-400 text-sm flex items-center gap-2">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                                {error}
                            </p>
                        </motion.div>
                    )}

                    {success && (
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            className="mb-4 bg-green-500/10 border border-green-500/50 rounded-lg p-4"
                        >
                            <p className="text-green-400 text-sm flex items-center gap-2">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                {success}
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Usuario */}
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Usuario *
                            </label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                placeholder="ej: municipalidad2"
                            />
                        </div>

                        {/* Contraseña */}
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Contraseña *
                            </label>
                            <input
                                type="text"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                placeholder="Mínimo 6 caracteres"
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Email *
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                placeholder="usuario@ejemplo.com"
                            />
                        </div>

                        {/* Teléfono */}
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Teléfono *
                            </label>
                            <input
                                type="tel"
                                value={telefono}
                                onChange={(e) => setTelefono(e.target.value)}
                                className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                placeholder="1234567890"
                            />
                        </div>

                        {/* Rol */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Rol *
                            </label>
                            <select
                                value={role}
                                onChange={(e) => setRole(e.target.value as 'superadmin' | 'admin' | 'usuario')}
                                className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            >
                                <option value="usuario">Usuario (acceso básico)</option>
                                <option value="admin">Admin (permisos elevados)</option>
                                <option value="superadmin">Superadmin (todos los permisos)</option>
                            </select>
                        </div>
                    </div>

                    {/* Cliente/Organización */}
                    <div className="space-y-3">
                        <label className="block text-sm font-medium text-slate-300">
                            Cliente/Organización (opcional)
                        </label>

                        {/* Toggle Mode */}
                        <div className="flex gap-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    checked={organizationMode === 'existing'}
                                    onChange={() => setOrganizationMode('existing')}
                                    className="w-4 h-4 text-blue-600 bg-slate-900/50 border-slate-600 focus:ring-blue-500"
                                />
                                <span className="text-sm text-slate-300">Seleccionar existente</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    checked={organizationMode === 'new'}
                                    onChange={() => setOrganizationMode('new')}
                                    className="w-4 h-4 text-blue-600 bg-slate-900/50 border-slate-600 focus:ring-blue-500"
                                />
                                <span className="text-sm text-slate-300">Agregar nueva</span>
                            </label>
                        </div>

                        {/* Organization Input */}
                        {organizationMode === 'existing' ? (
                            <select
                                value={cliente}
                                onChange={(e) => setCliente(e.target.value)}
                                className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            >
                                <option value="">Sin organización</option>
                                {organizations.map(org => (
                                    <option key={org} value={org}>{org}</option>
                                ))}
                            </select>
                        ) : (
                            <input
                                type="text"
                                value={newOrganization}
                                onChange={(e) => setNewOrganization(e.target.value)}
                                className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                placeholder="Nombre de la nueva organización"
                            />
                        )}
                    </div>

                    {/* Comentario */}
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            Comentario (opcional)
                        </label>
                        <textarea
                            value={comentario}
                            onChange={(e) => setComentario(e.target.value)}
                            rows={3}
                            className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                            placeholder="Notas adicionales sobre este usuario..."
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 pt-2">
                        <motion.button
                            type="submit"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-2.5 px-6 rounded-lg shadow-lg shadow-blue-500/30 transition-all duration-200 flex items-center justify-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            {editingUser ? 'Actualizar Usuario' : 'Crear Usuario'}
                        </motion.button>

                        {editingUser && (
                            <motion.button
                                type="button"
                                onClick={resetForm}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="px-6 py-2.5 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-all"
                            >
                                Cancelar
                            </motion.button>
                        )}
                    </div>
                </form>
            </motion.div>

            {/* Users List */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6"
            >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                        <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        Usuarios Registrados ({clientUsers.length})
                    </h3>

                    {/* Search */}
                    <div className="relative w-full sm:w-64">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Buscar usuarios..."
                            className="w-full pl-10 pr-4 py-2 bg-slate-900/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>

                {filteredUsers.length === 0 ? (
                    <div className="text-center py-12">
                        <svg className="w-16 h-16 mx-auto text-slate-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                        <p className="text-slate-400">
                            {searchTerm ? 'No se encontraron usuarios' : 'No hay usuarios registrados aún'}
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-700">
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-300">Usuario</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-300">Rol</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-300">Email</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-300">Teléfono</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-300">Cliente</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-300">Comentario</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-300">Fecha Creación</th>
                                    <th className="text-center py-3 px-4 text-sm font-semibold text-slate-300">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map((user) => (
                                    <motion.tr
                                        key={user.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors"
                                    >
                                        <td className="py-3 px-4 text-white font-medium">{user.username}</td>
                                        <td className="py-3 px-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.role === 'superadmin' ? 'bg-purple-500/20 text-purple-300' :
                                                    user.role === 'admin' ? 'bg-orange-500/20 text-orange-300' :
                                                        'bg-green-500/20 text-green-300'
                                                }`}>
                                                {user.role === 'superadmin' ? '⚡ Superadmin' :
                                                    user.role === 'admin' ? '🔧 Admin' :
                                                        '👤 Usuario'}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-slate-300">{user.email}</td>
                                        <td className="py-3 px-4 text-slate-300">{user.telefono}</td>
                                        <td className="py-3 px-4">
                                            {user.cliente ? (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300">
                                                    {user.cliente}
                                                </span>
                                            ) : (
                                                <span className="text-slate-500 text-sm">-</span>
                                            )}
                                        </td>
                                        <td className="py-3 px-4 text-slate-400 text-sm max-w-xs truncate">
                                            {user.comentario || '-'}
                                        </td>
                                        <td className="py-3 px-4 text-slate-400 text-sm">
                                            {new Date(user.fechaCreacion).toLocaleDateString('es-AR')}
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => handleEdit(user)}
                                                    className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-lg transition-all"
                                                    title="Editar"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                </button>

                                                {deleteConfirm === user.id ? (
                                                    <div className="flex gap-1">
                                                        <button
                                                            onClick={() => handleDelete(user.id)}
                                                            className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all text-xs"
                                                            title="Confirmar"
                                                        >
                                                            ✓
                                                        </button>
                                                        <button
                                                            onClick={() => setDeleteConfirm(null)}
                                                            className="p-2 text-slate-400 hover:text-slate-300 hover:bg-slate-500/10 rounded-lg transition-all text-xs"
                                                            title="Cancelar"
                                                        >
                                                            ✗
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => setDeleteConfirm(user.id)}
                                                        className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all"
                                                        title="Eliminar"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </motion.div>
        </div>
    );
}

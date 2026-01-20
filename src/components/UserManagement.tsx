import { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import Swal from "sweetalert2";

import { useUsuario } from "../hooks/useUsuarios";
import type { Usuario, CrearUsuarioBody, EditarUsuarioBody } from "../types/usuarios";

type RoleUI = "superadmin" | "admin" | "usuario";

export default function UserManagement() {
  const { usuarios, crearUsuario, editarUsuario, eliminarUsuario } = useUsuario();

  // Form state (UI)
  const [nombre, setNombre] = useState("");
  const [clave, setClave] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [rol, setRol] = useState<RoleUI>("usuario");
  const [estado, setEstado] = useState<string>("Activo"); // si tu back usa "1/0" avisame y lo adapto

  // UI state
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editingUser, setEditingUser] = useState<Usuario | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const resetForm = () => {
    setNombre("");
    setClave("");
    setEmail("");
    setTelefono("");
    setRol("usuario");
    setEstado("Activo");
    setError("");
    setSuccess("");
    setEditingUser(null);
  };

  const validateForm = (): boolean => {
    if (!nombre || !email || !telefono) {
      setError("Nombre, email y teléfono son obligatorios");
      return false;
    }

    // En crear, clave obligatoria
    if (!editingUser && !clave) {
      setError("La clave es obligatoria para crear usuario");
      return false;
    }

    if (nombre.length < 3) {
      setError("El nombre debe tener al menos 3 caracteres");
      return false;
    }

    if (nombre.includes(" ")) {
      setError("El nombre no puede contener espacios (si querés, lo ajustamos)");
      return false;
    }

    // Si estás creando o si en edición cambiaste clave
    if ((!editingUser && clave.length < 4) || (editingUser && clave.trim() && clave.length < 4)) {
      setError("La clave debe tener al menos 4 caracteres");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Email inválido");
      return false;
    }

    const telefonoRegex = /^\d+$/;
    if (!telefonoRegex.test(telefono)) {
      setError("El teléfono solo debe contener números");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validateForm()) return;

    try {
      if (editingUser) {
        const body: EditarUsuarioBody = {
          IdUsuario: editingUser.IdUsuario,
          Nombre: nombre.trim(),
          Clave: clave.trim() ? clave.trim() : editingUser.Clave, 
          Rol: rol,
          Telefono: telefono.trim(),
          Email: email.trim(),
          Estado: estado,
        };

        await editarUsuario(body);

        setSuccess("Usuario actualizado correctamente");
        Swal.fire({ icon: "success", title: "Listo", text: "Usuario actualizado" });

        resetForm();
      } else {
        // ✅ CREAR
        const body: CrearUsuarioBody = {
          Nombre: nombre.trim(),
          Clave: clave.trim(),
          Rol: rol,
          Telefono: telefono.trim(),
          Email: email.trim(),
          Estado: estado,
        };

        await crearUsuario(body);

        setSuccess(`Usuario "${nombre}" creado exitosamente`);
        Swal.fire({ icon: "success", title: "Creado", text: `Usuario "${nombre}" creado` });

        resetForm();
      }
    } catch (e: any) {
      console.log(e);
      const msg = e?.response?.data?.message ?? "No se pudo guardar el usuario";
      setError(msg);
      Swal.fire({ icon: "error", title: "Error", text: msg });
    }
  };

  const handleEdit = (user: Usuario) => {
    setEditingUser(user);

    setNombre(user.Nombre ?? "");
    setClave(user.Clave ?? ""); // si no querés mostrarla por seguridad, decime y lo ajusto
    setEmail(user.Email ?? "");
    setTelefono(user.Telefono ?? "");
    setRol((user.Rol as RoleUI) ?? "usuario");
    setEstado(user.Estado ?? "Activo");

    setError("");
    setSuccess("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (user: Usuario) => {
    try {
      await eliminarUsuario(user.IdUsuario);
      setDeleteConfirm(null);

      setSuccess("Usuario eliminado correctamente");
      Swal.fire({ icon: "success", title: "Eliminado", text: "Usuario eliminado" });
    } catch (e: any) {
      console.log(e);
      const msg = e?.response?.data?.message ?? "No se pudo eliminar el usuario";
      setError(msg);
      Swal.fire({ icon: "error", title: "Error", text: msg });
    }
  };

  const filteredUsers = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return usuarios;

    return usuarios.filter((u) => {
      const n = String(u.Nombre ?? "").toLowerCase();
      const em = String(u.Email ?? "").toLowerCase();
      const tel = String(u.Telefono ?? "");
      return n.includes(term) || em.includes(term) || tel.includes(term);
    });
  }, [usuarios, searchTerm]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Gestión de Usuarios</h2>
        <p className="text-slate-400">Crea y administra usuarios</p>
      </div>

      {/* Form Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6"
      >
        <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
          {editingUser ? "Editar Usuario" : "Crear Nuevo Usuario"}
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
              <p className="text-red-400 text-sm">{error}</p>
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="mb-4 bg-green-500/10 border border-green-500/50 rounded-lg p-4"
            >
              <p className="text-green-400 text-sm">{success}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Nombre */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Nombre *</label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-600/50 rounded-lg text-white"
                placeholder="ej: municipalidad2"
              />
            </div>

            {/* Clave */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Clave {editingUser ? "(podés cambiarla)" : "*"}
              </label>
              <input
                type="text"
                value={clave}
                onChange={(e) => setClave(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-600/50 rounded-lg text-white"
                placeholder={editingUser ? "Si la dejás vacía, mantiene la anterior" : "Clave"}
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Email *</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-600/50 rounded-lg text-white"
                placeholder="usuario@ejemplo.com"
              />
            </div>

            {/* Teléfono */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Teléfono *</label>
              <input
                type="tel"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-600/50 rounded-lg text-white"
                placeholder="381xxxxxxx"
              />
            </div>

            {/* Rol */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Rol *</label>
              <select
                value={rol}
                onChange={(e) => setRol(e.target.value as RoleUI)}
                className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-600/50 rounded-lg text-white"
              >
                <option value="usuario">Usuario</option>
                <option value="admin">Admin</option>
                <option value="superadmin">Superadmin</option>
              </select>
            </div>

            {/* Estado */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Estado</label>
              <select
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-600/50 rounded-lg text-white"
              >
                <option value="Activo">Activo</option>
                <option value="Inactivo">Inactivo</option>
              </select>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-2.5 px-6 rounded-lg"
            >
              {editingUser ? "Actualizar Usuario" : "Crear Usuario"}
            </motion.button>

            {editingUser && (
              <motion.button
                type="button"
                onClick={resetForm}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-2.5 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg"
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
          <h3 className="text-xl font-semibold text-white">Usuarios ({usuarios.length})</h3>

          <div className="relative w-full sm:w-64">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar usuarios..."
              className="w-full pl-4 pr-4 py-2 bg-slate-900/50 border border-slate-600/50 rounded-lg text-white"
            />
          </div>
        </div>

        {filteredUsers.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-400">{searchTerm ? "No se encontraron usuarios" : "No hay usuarios"}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-300">Nombre</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-300">Rol</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-300">Email</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-300">Teléfono</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-300">Estado</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-slate-300">Acciones</th>
                </tr>
              </thead>

              <tbody>
                {filteredUsers.map((u) => (
                  <motion.tr
                    key={u.IdUsuario}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors"
                  >
                    <td className="py-3 px-4 text-white font-medium">{u.Nombre}</td>
                    <td className="py-3 px-4 text-slate-300">{u.Rol}</td>
                    <td className="py-3 px-4 text-slate-300">{u.Email}</td>
                    <td className="py-3 px-4 text-slate-300">{u.Telefono}</td>
                    <td className="py-3 px-4 text-slate-300">{u.Estado}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEdit(u)}
                          className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-lg transition-all"
                          title="Editar"
                        >
                          ✏️
                        </button>

                        {deleteConfirm === u.IdUsuario ? (
                          <div className="flex gap-1">
                            <button
                              onClick={() => handleDelete(u)}
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
                            onClick={() => setDeleteConfirm(u.IdUsuario)}
                            className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all"
                            title="Eliminar"
                          >
                            🗑️
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

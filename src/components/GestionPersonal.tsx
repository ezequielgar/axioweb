import { useState } from "react";
import type { FormEvent } from "react";
import { usePersonal } from "../hooks/usePersonal";
import type { Personal } from "../types/personal";

type FormDataUI = {
  nombre: string;
  rol: string;
  telefono: string;
  activo: boolean;
};

const GestionPersonal = () => {
  const {
    personal,
    agregarPersonal,
    actualizarPersonal,
    eliminarPersonal,
    obtenerPersonalActivo,
    loading,
    error,
  } = usePersonal();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editando, setEditando] = useState<Personal | null>(null);

  const [formData, setFormData] = useState<FormDataUI>({
    nombre: "",
    rol: "",
    telefono: "",
    activo: true,
  });

  const limpiarFormulario = () => {
    setFormData({
      nombre: "",
      rol: "",
      telefono: "",
      activo: true,
    });
    setEditando(null);
    setIsFormOpen(false);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const payload = {
      NombreCompleto: formData.nombre,
      Rol: formData.rol,
      Telefono: formData.telefono,
      Estado: formData.activo ? "Activo" : "Inactivo",
    } as const;

    try {
      if (editando) {
        await actualizarPersonal(editando.IdPersonal, {
          IdPersonal: editando.IdPersonal,
          ...payload,
        });
      } else {
        await agregarPersonal(payload);
      }
      limpiarFormulario();
    } catch (e: any) {
      alert(e?.message ?? "Error guardando personal");
    }
  };

  const handleEditar = (p: Personal) => {
    setEditando(p);
    setFormData({
      nombre: p.NombreCompleto ?? "",
      rol: p.Rol ?? "",
      telefono: p.Telefono ?? "",
      activo: p.Estado === "Activo",
    });
    setIsFormOpen(true);
  };

  const handleEliminar = async (IdPersonal: number) => {
    if (confirm("¿Estás seguro de eliminar a esta persona? Esto también eliminará sus asignaciones.")) {
      try {
        await eliminarPersonal(IdPersonal);
      } catch (e: any) {
        alert(e?.message ?? "Error al eliminar");
      }
    }
  };

  const personalActivo = obtenerPersonalActivo();
  const personalInactivo = personal.filter((p) => p.Estado !== "Activo");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestión de Personal IT</h2>
          <p className="text-sm text-gray-600 mt-1">
            {personalActivo.length} persona{personalActivo.length !== 1 ? "s" : ""} activa
            {personalActivo.length !== 1 ? "s" : ""}
          </p>
          {loading && <p className="text-xs text-gray-500 mt-1">Cargando...</p>}
          {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
        </div>

        <button
          onClick={() => setIsFormOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition transform hover:scale-105"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Agregar Persona</span>
        </button>
      </div>

      {/* Lista de Personal Activo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {personalActivo.map((p) => (
          <div
            key={p.IdPersonal}
            className="bg-white rounded-xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{p.NombreCompleto}</h3>
                  <p className="text-sm text-gray-600">{p.Rol}</p>
                </div>
              </div>
              <span className="px-2 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded-full">
                Activo
              </span>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center space-x-2 text-sm text-gray-700">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>{p.Telefono}</span>
              </div>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => handleEditar(p)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium transition"
              >
                Editar
              </button>
              <button
                onClick={() => handleEliminar(p.IdPersonal)}
                className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 px-3 py-2 rounded-lg text-sm font-medium transition"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}

        {personalActivo.length === 0 && !loading && (
          <div className="col-span-full bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-12 text-center">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay personal registrado</h3>
            <p className="text-gray-600">Comienza agregando a la primera persona del equipo IT.</p>
          </div>
        )}
      </div>

      {/* Personal Inactivo */}
      {personalInactivo.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Personal Inactivo ({personalInactivo.length})
          </h3>
          <div className="space-y-2">
            {personalInactivo.map((p) => (
              <div key={p.IdPersonal} className="bg-gray-50 rounded-lg p-4 flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-900">{p.NombreCompleto}</p>
                  <p className="text-sm text-gray-600">{p.Rol}</p>
                </div>
                <button
                  onClick={() => handleEditar(p)}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Reactivar
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal de Formulario */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">
                {editando ? "Editar Persona" : "Agregar Persona"}
              </h3>
              <button onClick={limpiarFormulario} className="text-gray-400 hover:text-gray-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre completo *
                </label>
                <input
                  id="nombre"
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ej: Juan Pérez"
                />
              </div>

              <div>
                <label htmlFor="rol" className="block text-sm font-medium text-gray-700 mb-1">
                  Rol / Cargo *
                </label>
                <input
                  id="rol"
                  type="text"
                  value={formData.rol}
                  onChange={(e) => setFormData({ ...formData, rol: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ej: Soporte Nivel 1"
                />
              </div>

              <div>
                <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-1">
                  Teléfono *
                </label>
                <input
                  id="telefono"
                  type="tel"
                  value={formData.telefono}
                  onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ej: +54 9 381 440-0000"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  id="activo"
                  type="checkbox"
                  checked={formData.activo}
                  onChange={(e) => setFormData({ ...formData, activo: e.target.checked })}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="activo" className="text-sm font-medium text-gray-700">
                  Personal activo
                </label>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={limpiarFormulario}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded-lg font-medium transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition"
                >
                  {editando ? "Guardar Cambios" : "Agregar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionPersonal;

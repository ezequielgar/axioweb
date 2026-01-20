import { useMemo, useState } from "react";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";

import { useObleas } from "../hooks/useObleas"; 
import type { ClienteType, EstadoOblea, Oblea,FormatoOblea  } from "../types/obleas";

const fmtDate = (iso?: string) => {
  if (!iso) return "-";
  const d = new Date(iso + "T00:00:00");
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleDateString("es-AR");
};

// Colores estado
const getEstadoColor = (estado: EstadoOblea) => {
  switch (estado) {
    case "Pendiente":
      return "bg-yellow-500/20 text-yellow-400 border-yellow-500/50";
    case "Creada":
      return "bg-green-500/20 text-green-400 border-green-500/50";
    case "Cancelada":
      return "bg-red-500/20 text-red-400 border-red-500/50";
    case "Entregada":
      return "bg-blue-500/20 text-blue-400 border-blue-500/50";
    default:
      return "bg-slate-500/20 text-slate-300 border-slate-500/50";
  }
};

type EditForm = {
  id: string;
  dominio: string;
  formato: string;
  item?: string;
  reparticion?: string;
  modeloVehiculo?: string;
  cliente?: ClienteType;
  nroOblea: number | "";
};

export default function GridObleas() {
  const { obleas, editarOblea, cambiarEstado, eliminarOblea } = useObleas();

  const usuario = { role: "admin" as const, cliente: "Municipalidad" as ClienteType };

  const [seleccionadas, setSeleccionadas] = useState<string[]>([]);
  const [filtroEstado, setFiltroEstado] = useState<EstadoOblea | "">("");
  const [filtroCliente, setFiltroCliente] = useState<ClienteType | "">("");
  const [mostrarPopupExportar, setMostrarPopupExportar] = useState(false);
  const [emailDestino, setEmailDestino] = useState("");

  const [obleaAcciones, setObleaAcciones] = useState<Oblea | null>(null);

  const [editOpen, setEditOpen] = useState(false);
  const [editData, setEditData] = useState<EditForm | null>(null);

  const obleasFiltradas = useMemo(() => {
    return obleas
      .filter((o) => (filtroEstado ? o.estado === filtroEstado : true))
      .filter((o) => (usuario.role === "admin" ? true : o.cliente === usuario.cliente))
      .filter((o) => (usuario.role === "admin" && filtroCliente ? o.cliente === filtroCliente : true));
  }, [obleas, filtroEstado, filtroCliente, usuario.role, usuario.cliente]);

  const toggleSeleccion = (id: string) => {
    setSeleccionadas((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const toggleTodas = () => {
    if (seleccionadas.length === obleasFiltradas.length) setSeleccionadas([]);
    else setSeleccionadas(obleasFiltradas.map((o) => o.id));
  };

  const exportarAExcel = (list: Oblea[]) => {
    const data = list.map((o) => ({
      IdOblea: o.id,
      NroOblea: (o as any).nroOblea ?? "",
      Dominio: o.dominio,
      Formato: o.formato,
      Item: o.item ?? "-",
      Reparticion: o.reparticion ?? "-",
      Modelo: o.modeloVehiculo ?? "-",
      Cliente: o.cliente,
      Estado: o.estado,
      FechaPedido: fmtDate(o.fechaPedido),
      FechaCreacion: fmtDate(o.fechaCreacion),
      CreadaPor: o.creadaPor ?? "-",
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Obleas");

    ws["!cols"] = [
      { wch: 10 }, // Id
      { wch: 14 }, // NroOblea
      { wch: 12 }, // Dominio
      { wch: 10 }, // Formato
      { wch: 10 }, // Item
      { wch: 20 }, // Reparticion
      { wch: 20 }, // Modelo
      { wch: 16 }, // Cliente
      { wch: 12 }, // Estado
      { wch: 14 }, // FechaPedido
      { wch: 14 }, // FechaCreacion
      { wch: 14 }, // CreadaPor
    ];

    XLSX.writeFile(wb, `obleas_${new Date().toISOString().split("T")[0]}.xlsx`);
  };

  const handleExportarYEnviar = () => {
    const list = obleas.filter((o) => seleccionadas.includes(o.id));
    exportarAExcel(list);

    if (emailDestino.trim()) {
      Swal.fire({
        icon: "info",
        title: "Demo",
        text: `Se exportó Excel y se notificaría a: ${emailDestino} (acá iría tu envío real).`,
      });
    }

    setMostrarPopupExportar(false);
    setSeleccionadas([]);
    setEmailDestino("");
  };

  const cambioMasivo = async (nuevoEstado: EstadoOblea) => {
    if (seleccionadas.length === 0) {
      Swal.fire({ icon: "warning", title: "Seleccioná al menos una oblea" });
      return;
    }
    const ok = await Swal.fire({
      icon: "question",
      title: `¿Cambiar estado a "${nuevoEstado}"?`,
      text: `Se actualizarán ${seleccionadas.length} oblea(s).`,
      showCancelButton: true,
      confirmButtonText: "Sí, continuar",
      cancelButtonText: "Cancelar",
    });

    if (!ok.isConfirmed) return;

    try {
      await Promise.all(
        seleccionadas.map((id) => cambiarEstado(Number(id), nuevoEstado))
      );

      if (nuevoEstado === "Creada" && usuario.role === "admin") {
        setMostrarPopupExportar(true);
      } else {
        setSeleccionadas([]);
      }

      Swal.fire({ icon: "success", title: "Listo", timer: 1200, showConfirmButton: false });
    } catch (e: any) {
      console.log(e);
      Swal.fire({ icon: "error", title: "Error", text: e?.response?.data?.message ?? "No se pudo actualizar" });
    }
  };

 const cambioIndividual = async (oblea: Oblea, nuevoEstado: EstadoOblea) => {
    try {
      await cambiarEstado(Number(oblea.id), nuevoEstado);
      setObleaAcciones(null);

      if (nuevoEstado === "Creada" && usuario.role === "admin") {
        setMostrarPopupExportar(true);
        setSeleccionadas([oblea.id]);
      }
      Swal.fire({ icon: "success", title: "Actualizada", timer: 1200, showConfirmButton: false });
    } catch (e: any) {
      console.log(e);
      Swal.fire({
        icon: "error",
        title: "No se pudo",
        text: e?.response?.data?.message ?? "Error cambiando estado",
      });
    }
  };

  const confirmarEliminar = async (oblea: Oblea) => {
    const ok = await Swal.fire({
      icon: "warning",
      title: "Eliminar oblea",
      text: `¿Seguro que querés eliminar "${oblea.dominio}"?`,
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (!ok.isConfirmed) return;

    try {
      await eliminarOblea(oblea.id);
      setObleaAcciones(null);
      Swal.fire({ icon: "success", title: "Eliminada", timer: 1200, showConfirmButton: false });
    } catch (e: any) {
      console.log(e);
      Swal.fire({ icon: "error", title: "Error", text: e?.response?.data?.message ?? "No se pudo eliminar" });
    }
  };



  const guardarEdicion = async () => {
  if (!editData) return;

  const dominio = editData.dominio.trim().replace(/\s+/g, "").toUpperCase();
  if (!dominio) {
    Swal.fire({ icon: "warning", title: "Dominio requerido" });
    return;
  }

  if (editData.nroOblea === "" || Number(editData.nroOblea) <= 0) {
    Swal.fire({
      icon: "warning",
      title: "NroOblea inválido",
      text: "Debe ser un número mayor a 0.",
    });
    return;
  }

  try {
    await editarOblea({
      IdOblea: Number(editData.id),
      dominio,
      formato: editData.formato as any,
      item: editData.item ?? "",
      reparticion: editData.reparticion ?? "",
      modeloVehiculo: editData.modeloVehiculo ?? "",
      cliente: (editData.cliente ?? "Municipalidad") as any,
      nroOblea: Number(editData.nroOblea),
    });

    setEditOpen(false);
    setEditData(null);

    Swal.fire({
      icon: "success",
      title: "Guardado",
      timer: 1200,
      showConfirmButton: false,
    });
  } catch (e: any) {
    console.log(e);
    Swal.fire({
      icon: "error",
      title: "No se pudo guardar",
      text: e?.response?.data?.message ?? "Error editando oblea",
    });
  }
};

const abrirEditar = (o: Oblea) => {
  setEditData({
    id: o.id,
    dominio: o.dominio ?? "",
    formato: o.formato ?? "Interna",
    item: o.item ?? "",
    reparticion: o.reparticion ?? "",
    modeloVehiculo: o.modeloVehiculo ?? "",
    cliente: o.cliente ?? "Municipalidad",
    nroOblea: Number(o.nroOblea ?? 0),
  });
  setEditOpen(true);
};

  return (
    <div className="space-y-4">
      {/* Filtros */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Filtrar por Estado</label>
            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value as any)}
              className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos</option>
              <option value="Pendiente">Pendientes</option>
              <option value="Creada">Creadas</option>
              <option value="Cancelada">Canceladas</option>
              <option value="Entregada">Entregadas</option>
            </select>
          </div>

          {usuario.role === "admin" && (
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Filtrar por Cliente</label>
              <select
                value={filtroCliente}
                onChange={(e) => setFiltroCliente(e.target.value as any)}
                className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todos</option>
                <option value="Municipalidad">Municipalidad</option>
                <option value="Geogas">Geogas</option>
              </select>
            </div>
          )}

          <div className="flex items-end">
            <button
              onClick={() => exportarAExcel(obleasFiltradas)}
              className="w-full px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
            >
              Exportar Vista Actual
            </button>
          </div>
        </div>
      </div>

      {/* Acciones masivas */}
      {seleccionadas.length > 0 && (
        <div className="bg-blue-500/10 border border-blue-500/50 rounded-xl p-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <span className="text-blue-400 font-medium">{seleccionadas.length} oblea(s) seleccionada(s)</span>

            <div className="flex gap-2 flex-wrap">
              {usuario.role === "admin" && (
                <button
                  onClick={() => cambioMasivo("Creada")}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                >
                  Marcar como Creadas
                </button>
              )}

              <button
                onClick={() => cambioMasivo("Pendiente")}
                className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors"
              >
                Pasar a Pendiente
              </button>

              {/* si agregaste Entregada */}
              {/* <button
                onClick={() => cambioMasivo("Entregada")}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Marcar Entregadas
              </button> */}

              <button
                onClick={() => cambioMasivo("Cancelada")}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                Cancelar
              </button>

              <button
                onClick={() => setSeleccionadas([])}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
              >
                Limpiar selección
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tabla */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-700/50">
              <tr>
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={seleccionadas.length === obleasFiltradas.length && obleasFiltradas.length > 0}
                    onChange={toggleTodas}
                    className="w-4 h-4 text-blue-600 bg-slate-700 border-slate-600 rounded focus:ring-blue-500"
                  />
                </th>

                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">ID</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">Dominio</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">Formato</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">Item</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">Repartición</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">Modelo</th>

                {usuario.role === "admin" && (
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">Cliente</th>
                )}

                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">Estado</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">Fecha Pedido</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">Fecha Creación</th>

                {usuario.role === "admin" && (
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">Acciones</th>
                )}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-700">
              {obleasFiltradas.length === 0 ? (
                <tr>
                  <td colSpan={usuario.role === "admin" ? 12 : 10} className="px-4 py-8 text-center text-slate-400">
                    No hay obleas para mostrar
                  </td>
                </tr>
              ) : (
                obleasFiltradas.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-700/30 transition-colors">
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={seleccionadas.includes(o.id)}
                        onChange={() => toggleSeleccion(o.id)}
                        className="w-4 h-4 text-blue-600 bg-slate-700 border-slate-600 rounded focus:ring-blue-500"
                      />
                    </td>

                    <td className="px-4 py-3 text-sm text-slate-300 font-mono">{o.id}</td>
                    <td className="px-4 py-3 text-sm text-white font-semibold">{o.dominio}</td>
                    <td className="px-4 py-3 text-sm text-slate-300">{o.formato}</td>
                    <td className="px-4 py-3 text-sm text-slate-300">{o.item || "-"}</td>
                    <td className="px-4 py-3 text-sm text-slate-300">{o.reparticion || "-"}</td>
                    <td className="px-4 py-3 text-sm text-slate-300">{o.modeloVehiculo || "-"}</td>

                    {usuario.role === "admin" && (
                      <td className="px-4 py-3 text-sm text-slate-300">{o.cliente}</td>
                    )}

                    <td className="px-4 py-3">
                      <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full border ${getEstadoColor(o.estado)}`}>
                        {o.estado}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-sm text-slate-300">{fmtDate(o.fechaPedido)}</td>
                    <td className="px-4 py-3 text-sm text-slate-300">{fmtDate(o.fechaCreacion)}</td>

                    {usuario.role === "admin" && (
                      <td className="px-4 py-3">
                        <button
                          onClick={() => setObleaAcciones(o)}
                          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors"
                        >
                          Acciones
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Popup Exportar */}
      {mostrarPopupExportar && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-white mb-4">Exportar y Notificar</h3>

            <p className="text-slate-300 mb-4">
              Se marcaron obleas como creadas. ¿Querés exportar Excel?
            </p>

            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-300 mb-2">Email de notificación (opcional)</label>
              <input
                type="email"
                value={emailDestino}
                onChange={(e) => setEmailDestino(e.target.value)}
                className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="ejemplo@email.com"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleExportarYEnviar}
                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-2 rounded-lg transition-all"
              >
                Exportar Excel
              </button>
              <button
                onClick={() => {
                  setMostrarPopupExportar(false);
                  setEmailDestino("");
                  setSeleccionadas([]);
                }}
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2 rounded-lg transition-all"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Acciones */}
      {obleaAcciones && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-white mb-2">Acciones de Oblea</h3>

            <p className="text-slate-400 text-sm mb-6">
              Dominio: <span className="text-white font-semibold">{obleaAcciones.dominio}</span>
              <br />
              ID: <span className="text-white font-mono text-xs">{obleaAcciones.id}</span>
            </p>

            <div className="space-y-2">
              <button
                onClick={() => {
                  abrirEditar(obleaAcciones);
                  setObleaAcciones(null);
                }}
                className="w-full px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors flex items-center gap-3"
              >
                ✏️ Editar Oblea
              </button>

              <div className="border-t border-slate-600 my-3" />

              <button
                onClick={() => cambioIndividual(obleaAcciones, "Pendiente")}
                className="w-full px-4 py-3 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400 rounded-lg transition-colors flex items-center gap-3"
              >
                <span className="w-3 h-3 bg-yellow-400 rounded-full" />
                Cambiar a Pendiente
              </button>

              {usuario.role === "admin" && (
                <button
                  onClick={() => cambioIndividual(obleaAcciones, "Creada")}
                  className="w-full px-4 py-3 bg-green-500/10 hover:bg-green-500/20 text-green-400 rounded-lg transition-colors flex items-center gap-3"
                >
                  <span className="w-3 h-3 bg-green-400 rounded-full" />
                  Cambiar a Creada
                </button>
              )}
              <button
                onClick={() => cambioIndividual(obleaAcciones, "Entregada")}
                className="w-full px-4 py-3 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg transition-colors flex items-center gap-3"
              >
                <span className="w-3 h-3 bg-blue-400 rounded-full" />
                Marcar Entregada
              </button>

              <button
                onClick={() => cambioIndividual(obleaAcciones, "Cancelada")}
                className="w-full px-4 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors flex items-center gap-3"
              >
                <span className="w-3 h-3 bg-red-400 rounded-full" />
                Cambiar a Cancelada
              </button>

              <div className="border-t border-slate-600 my-3" />

              <button
                onClick={() => confirmarEliminar(obleaAcciones)}
                className="w-full px-4 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors flex items-center gap-3"
              >
                🗑️ Eliminar
              </button>

              <button
                onClick={() => setObleaAcciones(null)}
                className="w-full px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors mt-3"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Editar */}
      {editOpen && editData && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 max-w-lg w-full">
            <h3 className="text-xl font-bold text-white mb-4">Editar Oblea</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Dominio / DNI</label>
                <input
                  value={editData.dominio}
                  onChange={(e) => setEditData({ ...editData, dominio: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Formato</label>
                <select
                  value={editData.formato}
                  onChange={(e) => setEditData({ ...editData, formato: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Interna">Interna</option>
                  <option value="Externa">Externa</option>
                  <option value="Tarjeta">Tarjeta</option>
                </select>
              </div>

              {usuario.role === "admin" && (
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Cliente</label>
                  <select
                    value={editData.cliente ?? "Municipalidad"}
                    onChange={(e) => setEditData({ ...editData, cliente: e.target.value as ClienteType })}
                    className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Municipalidad">Municipalidad</option>
                    <option value="Geogas">Geogas</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Nro Oblea</label>
                <input
                  type="number"
                  value={editData.nroOblea}
                  onChange={(e) =>
                    setEditData({ ...editData, nroOblea: e.target.value === "" ? "" : Number(e.target.value) })
                  }
                  className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                  placeholder="Ej: 1001350110"
                />
                <p className="text-xs text-slate-400 mt-1">
                  Por defecto se sugiere el próximo. Podés editarlo si cargás viejas.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Item</label>
                <input
                  value={editData.item ?? ""}
                  onChange={(e) => setEditData({ ...editData, item: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Repartición</label>
                <input
                  value={editData.reparticion ?? ""}
                  onChange={(e) => setEditData({ ...editData, reparticion: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-300 mb-2">Modelo/Vehículo</label>
                <input
                  value={editData.modeloVehiculo ?? ""}
                  onChange={(e) => setEditData({ ...editData, modeloVehiculo: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={guardarEdicion}
                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-2 rounded-lg transition-all"
              >
                Guardar
              </button>
              <button
                onClick={() => {
                  setEditOpen(false);
                  setEditData(null);
                }}
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2 rounded-lg transition-all"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

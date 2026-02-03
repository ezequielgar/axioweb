import { useMemo, useState } from "react";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";
import "../styles/swal-dark.css";

const swalDark = Swal.mixin({
  background: '#1e293b',
  color: '#e2e8f0',
  confirmButtonColor: '#3b82f6',
  cancelButtonColor: '#64748b',
  customClass: {
    popup: 'swal-dark-popup',
    title: 'swal-dark-title',
    htmlContainer: 'swal-dark-text',
    confirmButton: 'swal-dark-confirm',
    cancelButton: 'swal-dark-cancel',
  }
});

import RequestButton from "./RequestButton";
import Checkbox from "./Checkbox";

import { useAuth } from "../hooks/useAuth";
import { useReimpresionObleas } from "../hooks/useReimpreciones";

import type { EstadoReimpresion, ReimpresionOblea } from "../types/reimpresiones";
import type { ClienteType } from "../types/obleas";

const fmtDate = (v?: string | null) => {
  if (!v) return "-";
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleString("es-AR");
};

const getEstadoColor = (estado: EstadoReimpresion) => {
  switch (estado) {
    case "Pendiente":
      return "bg-yellow-500/20 text-yellow-300 border-yellow-500/50";
    case "Reimprimida":
      return "bg-green-500/20 text-green-300 border-green-500/50";
    case "Entregada":
      return "bg-blue-500/20 text-blue-300 border-blue-500/50";
    case "Cancelada":
      return "bg-red-500/20 text-red-300 border-red-500/50";
    default:
      return "bg-gray-500/20 text-gray-300 border-gray-500/50";
  }
};

export default function GridObleasReimpresion() {
  const { user } = useAuth();

  const { reimpresiones, cambiarEstado, loading } = useReimpresionObleas();

  const [seleccionadas, setSeleccionadas] = useState<number[]>([]);
  const [filtroEstado, setFiltroEstado] = useState<EstadoReimpresion | "">("");
  const [filtroCliente, setFiltroCliente] = useState<ClienteType | "">("");
  const [filaAcciones, setFilaAcciones] = useState<ReimpresionOblea | null>(null);

  // ✅ roles
  const rol = (user?.Rol ?? "usuario").toLowerCase();
  const esAdmin = rol === "admin" || rol === "superadmin";
  const esUsuario = !esAdmin; // solo para lectura

  // ✅ Filtrado (cliente solo para admin/superadmin)
  const reimpresionesFiltradas = useMemo(() => {
    return (reimpresiones ?? [])
      .filter((r) => (filtroEstado ? r.Estado === filtroEstado : true))
      .filter((r) => {
        if (esAdmin && filtroCliente) return r.Cliente === filtroCliente;
        return true;
      });
  }, [reimpresiones, filtroEstado, filtroCliente, esAdmin]);

  // ✅ seleccionar (solo admin)
  const toggleSeleccion = (IdReimpresion: number) => {
    if (!esAdmin) return;
    setSeleccionadas((prev) =>
      prev.includes(IdReimpresion) ? prev.filter((x) => x !== IdReimpresion) : [...prev, IdReimpresion]
    );
  };

  const toggleTodas = () => {
    if (!esAdmin) return;
    if (seleccionadas.length === reimpresionesFiltradas.length) setSeleccionadas([]);
    else setSeleccionadas(reimpresionesFiltradas.map((r) => r.IdReimpresion));
  };

  // ✅ exportar (lo dejo para todos; si querés SOLO admin: poné `if (!esAdmin) return;`)
  const exportarAExcel = () => {
    const list =
      esAdmin && seleccionadas.length > 0
        ? (reimpresiones ?? []).filter((r) => seleccionadas.includes(r.IdReimpresion))
        : reimpresionesFiltradas;

    const data = list.map((r) => ({
      "Id Reimpresión": r.IdReimpresion,
      "Id Oblea": r.IdOblea,
      "Nro Oblea": r.nroOblea,
      Dominio: r.Dominio,
      Formato: r.Formato,
      Cliente: r.Cliente,
      Estado: r.Estado,
      Motivo: r.Motivo ?? "-",
      "Solicitada Por": r.SolicitadaPor ?? "-",
      "Fecha Solicitud": fmtDate(r.fechaSolicitud),
      "Fecha Reimpresión": fmtDate(r.fechaReimpresion),
      "Fecha Entrega": fmtDate(r.fechaEntrega),
      "Fecha Cancelada": fmtDate(r.fechaCancelacion ?? null),
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Reimpresiones");

    const fecha = new Date().toISOString().split("T")[0];
    XLSX.writeFile(wb, `reimpresiones_${fecha}.xlsx`);

    if (esAdmin && seleccionadas.length > 0) setSeleccionadas([]);
  };

  const cambiarEstadoConConfirm = async (r: ReimpresionOblea, nuevoEstado: EstadoReimpresion) => {
    if (!esAdmin) return;

    const ok = await swalDark.fire({
      icon: "question",
      title: `¿Cambiar estado a "${nuevoEstado}"?`,
      text: `Reimpresión #${r.IdReimpresion} (Oblea ${r.nroOblea} - ${r.Dominio})`,
      showCancelButton: true,
      confirmButtonText: "Sí",
      cancelButtonText: "Cancelar",
    });

    if (!ok.isConfirmed) return;

    try {
      await cambiarEstado(r.IdReimpresion, nuevoEstado);
      setFilaAcciones(null);

      swalDark.fire({
        icon: "success",
        title: "Actualizado",
        timer: 1100,
        showConfirmButton: false,
      });
    } catch (e: any) {
      console.log(e);
      swalDark.fire({
        icon: "error",
        title: "Error",
        text: e?.response?.data?.message ?? "No se pudo cambiar el estado",
      });
    }
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
              onChange={(e) => setFiltroEstado(e.target.value as EstadoReimpresion | "")}
              className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos</option>
              <option value="Pendiente">Pendiente</option>
              <option value="Reimprimida">Reimprimida</option>
              <option value="Entregada">Entregada</option>
              <option value="Cancelada">Cancelada</option>
            </select>
          </div>

          {esAdmin ? (
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Filtrar por Cliente</label>
              <select
                value={filtroCliente}
                onChange={(e) => setFiltroCliente(e.target.value as ClienteType | "")}
                className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todos</option>
                <option value="Municipalidad">Municipalidad</option>
                <option value="Geogas">Geogas</option>
              </select>
            </div>
          ) : (
            <div />
          )}

          <div className="flex items-end gap-2">
            <button
              onClick={exportarAExcel}
              className="w-full px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
            >
              {esAdmin && seleccionadas.length > 0
                ? `Exportar Seleccionadas (${seleccionadas.length})`
                : "Exportar Vista Actual"}
            </button>
          </div>
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-700/50">
              <tr>
                {/* ✅ columna selección solo admin */}
                {esAdmin && (
                  <th className="px-4 py-3 text-left">
                    <Checkbox
                      checked={seleccionadas.length === reimpresionesFiltradas.length && reimpresionesFiltradas.length > 0}
                      onChange={toggleTodas}
                      id="select-all-reimp"
                    />
                  </th>
                )}

                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">Reimpresión</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">Nro Oblea</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">Dominio</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">Formato</th>

                {esAdmin && <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">Cliente</th>}

                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">Estado</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">Fecha Solicitud</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">Fecha Reimpresión</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">Fecha Entrega</th>

                {esAdmin && <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">Acciones</th>}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={esAdmin ? 11 : 9} className="px-4 py-8 text-center text-slate-400">
                    Cargando...
                  </td>
                </tr>
              ) : reimpresionesFiltradas.length === 0 ? (
                <tr>
                  <td colSpan={esAdmin ? 11 : 9} className="px-4 py-8 text-center text-slate-400">
                    No hay reimpresiones para mostrar
                  </td>
                </tr>
              ) : (
                reimpresionesFiltradas.map((r) => (
                  <tr key={r.IdReimpresion} className="hover:bg-slate-700/30 transition-colors">
                    {/* ✅ selección solo admin */}
                    {esAdmin && (
                      <td className="px-4 py-3">
                        <Checkbox
                          checked={seleccionadas.includes(r.IdReimpresion)}
                          onChange={() => toggleSeleccion(r.IdReimpresion)}
                          id={`select-reimp-${r.IdReimpresion}`}
                        />
                      </td>
                    )}

                    <td className="px-4 py-3 text-sm text-slate-300 font-mono">#{r.IdReimpresion}</td>
                    <td className="px-4 py-3 text-sm text-slate-300 font-mono">{r.nroOblea}</td>
                    <td className="px-4 py-3 text-sm text-white font-semibold">{r.Dominio}</td>
                    <td className="px-4 py-3 text-sm text-slate-300">{r.Formato}</td>

                    {esAdmin && <td className="px-4 py-3 text-sm text-slate-300">{r.Cliente}</td>}

                    <td className="px-4 py-3">
                      <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full border ${getEstadoColor(r.Estado)}`}>
                        {r.Estado}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-sm text-slate-300">{fmtDate(r.fechaSolicitud)}</td>
                    <td className="px-4 py-3 text-sm text-slate-300">{fmtDate(r.fechaReimpresion)}</td>
                    <td className="px-4 py-3 text-sm text-slate-300">{fmtDate(r.fechaEntrega)}</td>

                    {esAdmin && (
                      <td className="px-4 py-3">
                        <RequestButton onClick={() => setFilaAcciones(r)} text="ACCIONES" variant="blue" size="small" />
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ✅ cartelito claro para usuario */}
        {esUsuario && (
          <div className="px-4 py-3 text-xs text-slate-400 border-t border-slate-700">
            Tu rol es <span className="text-slate-200 font-semibold">{user?.Rol ?? "usuario"}</span>: solo lectura en Reimpresiones.
          </div>
        )}
      </div>

      {/* Modal acciones (solo admin/superadmin) */}
      {esAdmin && filaAcciones && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-white mb-2">Acciones de Reimpresión</h3>

            <p className="text-slate-400 text-sm mb-6">
              Reimpresión: <span className="text-white font-mono">#{filaAcciones.IdReimpresion}</span>
              <br />
              Oblea: <span className="text-white font-mono">{filaAcciones.nroOblea}</span> —{" "}
              <span className="text-white font-semibold">{filaAcciones.Dominio}</span>
            </p>

            <div className="space-y-2">
              <button
                onClick={() => cambiarEstadoConConfirm(filaAcciones, "Pendiente")}
                className="w-full px-4 py-3 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400 rounded-lg transition-colors flex items-center gap-3"
              >
                <span className="w-3 h-3 bg-yellow-400 rounded-full" />
                Cambiar a Pendiente
              </button>

              <button
                onClick={() => cambiarEstadoConConfirm(filaAcciones, "Reimprimida")}
                className="w-full px-4 py-3 bg-green-500/10 hover:bg-green-500/20 text-green-400 rounded-lg transition-colors flex items-center gap-3"
              >
                <span className="w-3 h-3 bg-green-400 rounded-full" />
                Marcar como Reimprimida
              </button>

              <button
                onClick={() => cambiarEstadoConConfirm(filaAcciones, "Entregada")}
                className="w-full px-4 py-3 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg transition-colors flex items-center gap-3"
              >
                <span className="w-3 h-3 bg-blue-400 rounded-full" />
                Marcar como Entregada
              </button>

              <button
                onClick={() => cambiarEstadoConConfirm(filaAcciones, "Cancelada")}
                className="w-full px-4 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors flex items-center gap-3"
              >
                <span className="w-3 h-3 bg-red-400 rounded-full" />
                Cancelar
              </button>

              <div className="border-t border-slate-600 my-3" />

              <button
                onClick={() => setFilaAcciones(null)}
                className="w-full px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors mt-3"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

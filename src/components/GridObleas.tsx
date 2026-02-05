import { useMemo, useState, useEffect } from "react";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";
import "../styles/swal-dark.css";

// Configuración global de SweetAlert2 con tema dark
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

import { useObleas } from "../hooks/useObleas";
import { useReimpresionObleas } from "../hooks/useReimpreciones";
import { useAuth } from "../hooks/useAuth";
import RequestButton from "./RequestButton";
import Checkbox from "./Checkbox";
import { generarPDFObleas } from "../utils/generadorObleaPDF";

import type {
  ClienteType,
  EstadoOblea,
  Oblea,
  ObleaEditFormData,
  FormatoOblea,
} from "../types/obleas";

const fmtDate = (iso?: string) => {
  if (!iso) return "-";
  const d = new Date(iso.includes("T") ? iso : iso + "T00:00:00");
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleDateString("es-AR");
};

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
    case "En reimpresion":
      return "bg-purple-500/20 text-purple-300 border-purple-500/50";
    default:
      return "bg-slate-500/20 text-slate-300 border-slate-500/50";
  }
};

type EditForm = {
  id: string;
  dominio: string;
  formato: FormatoOblea;
  item?: string;
  reparticion?: string;
  modeloVehiculo?: string;
  cliente?: ClienteType;
  nroOblea: number | "";
};

export default function GridObleas() {
  const { user } = useAuth();
  const { obleas, editarOblea, cambiarEstado, eliminarOblea, verObleas } = useObleas();
  const { crearReimpresionMasivo } = useReimpresionObleas();

  // ✅ permisos
  const role = (user?.Rol ?? "usuario").toLowerCase(); // "admin" | "usuario" | "superadmin"
  const canAdmin = role === "admin" || role === "superadmin";
  const canUser = !!user; // logueado
  const canSolicitarReimpresion = canUser; // ✅ usuario también puede solicitar (solo crea reimpresión)

  const [seleccionadas, setSeleccionadas] = useState<number[]>([]);
  const [filtroEstado, setFiltroEstado] = useState<EstadoOblea | "">("");
  const [filtroCliente, setFiltroCliente] = useState<ClienteType | "">("");

  const [mostrarPopupExportar, setMostrarPopupExportar] = useState(false);
  const [emailDestino, setEmailDestino] = useState("");

  const [obleaAcciones, setObleaAcciones] = useState<Oblea | null>(null);

  const [editOpen, setEditOpen] = useState(false);
  const [editData, setEditData] = useState<EditForm | null>(null);

  const obleasFiltradas = useMemo(() => {
    return (obleas ?? [])
      .filter((o) => (filtroEstado ? o.estado === filtroEstado : true))
      .filter((o) => (canAdmin && filtroCliente ? o.cliente === filtroCliente : true));
  }, [obleas, filtroEstado, filtroCliente, canAdmin]);

  const toIdNum = (id: string) => {
    const n = Number(String(id).trim());
    return Number.isFinite(n) ? n : null;
  };

  // ✅ Todos los usuarios pueden seleccionar filas para exportar
  const toggleSeleccion = (idStr: string) => {
    const idNum = toIdNum(idStr);
    if (idNum == null) {
      swalDark.fire({
        icon: "error",
        title: "ID inválido",
        text: `No pude convertir el id "${idStr}" a número.`,
      });
      return;
    }

    setSeleccionadas((prev) =>
      prev.includes(idNum) ? prev.filter((x) => x !== idNum) : [...prev, idNum]
    );
  };

  const toggleTodas = () => {
    const ids = obleasFiltradas
      .map((o) => toIdNum(o.id))
      .filter((x): x is number => x != null);

    if (ids.length === 0) return;

    if (seleccionadas.length === ids.length) setSeleccionadas([]);
    else setSeleccionadas(ids);
  };

  const exportarAExcel = (list: Oblea[]) => {
    const data = list.map((o) => {
      // ✅ Para usuarios normales, excluir el campo IdOblea
      const baseData = {
        NroOblea: o.nroOblea ?? "",
        Dominio: o.dominio,
        Formato: o.formato,
        Item: o.item ?? "-",
        Reparticion: o.reparticion ?? "-",
        Modelo: o.modeloVehiculo ?? "-",
        Cliente: o.cliente,
        Estado: o.estado,
        FechaPedido: fmtDate(o.fechaPedido),
        FechaCreacion: fmtDate(o.fechaCreacion),
        FechaEntrega: fmtDate(o.fechaEntrega),
        CreadaPor: o.creadaPor ?? "-",
      };

      // ✅ Admin/SuperAdmin: incluir IdOblea al principio
      if (canAdmin) {
        return { IdOblea: o.id, ...baseData };
      }

      return baseData;
    });

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Obleas");

    // ✅ Ajustar anchos de columna según si incluye ID o no
    ws["!cols"] = canAdmin
      ? [
        { wch: 10 }, // IdOblea
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
        { wch: 14 }, // FechaEntrega
        { wch: 14 }, // CreadaPor
      ]
      : [
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
        { wch: 14 }, // FechaEntrega
        { wch: 14 }, // CreadaPor
      ];

    XLSX.writeFile(wb, `obleas_${new Date().toISOString().split("T")[0]}.xlsx`);
  };

  // ✅ export + email popup solo lo usa admin
  const handleExportarYEnviar = () => {
    if (!canAdmin) return;

    const list = (obleas ?? []).filter((o) => {
      const n = toIdNum(o.id);
      return n != null && seleccionadas.includes(n);
    });

    exportarAExcel(list);

    if (emailDestino.trim()) {
      swalDark.fire({
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
    if (!canAdmin) return;

    if (seleccionadas.length === 0) {
      swalDark.fire({ icon: "warning", title: "Seleccioná al menos una oblea" });
      return;
    }

    const ok = await swalDark.fire({
      icon: "question",
      title: `¿Cambiar estado a "${nuevoEstado}"?`,
      text: `Se actualizarán ${seleccionadas.length} oblea(s).`,
      showCancelButton: true,
      confirmButtonText: "Sí, continuar",
      cancelButtonText: "Cancelar",
    });

    if (!ok.isConfirmed) return;

    try {
      await Promise.all(seleccionadas.map((id) => cambiarEstado(id, nuevoEstado)));

      if (nuevoEstado === "Creada") setMostrarPopupExportar(true);
      else setSeleccionadas([]);

      swalDark.fire({ icon: "success", title: "Listo", timer: 1200, showConfirmButton: false });
    } catch (e: any) {
      swalDark.fire({
        icon: "error",
        title: "Error",
        text: e?.response?.data?.message ?? "No se pudo actualizar",
      });
    }
  };

  const cambioIndividual = async (oblea: Oblea, nuevoEstado: EstadoOblea) => {
    if (!canAdmin) return;

    const idNum = toIdNum(oblea.id);
    if (idNum == null) {
      swalDark.fire({ icon: "error", title: "ID inválido", text: `IdOblea inválido: "${oblea.id}"` });
      return;
    }

    try {
      await cambiarEstado(idNum, nuevoEstado);
      setObleaAcciones(null);

      if (nuevoEstado === "Creada") {
        setMostrarPopupExportar(true);
        setSeleccionadas([idNum]);
      }

      swalDark.fire({ icon: "success", title: "Actualizada", timer: 1200, showConfirmButton: false });
    } catch (e: any) {
      swalDark.fire({
        icon: "error",
        title: "No se pudo",
        text: e?.response?.data?.message ?? "Error cambiando estado",
      });
    }
  };

  const confirmarEliminar = async (oblea: Oblea) => {
    if (!canAdmin) return;

    const ok = await swalDark.fire({
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
      swalDark.fire({ icon: "success", title: "Eliminada", timer: 1200, showConfirmButton: false });
    } catch (e: any) {
      swalDark.fire({
        icon: "error",
        title: "Error",
        text: e?.response?.data?.message ?? "No se pudo eliminar",
      });
    }
  };

  const abrirEditar = (o: Oblea) => {
    if (!canAdmin) return;

    setEditData({
      id: o.id,
      dominio: o.dominio ?? "",
      formato: (o.formato ?? "Interna") as FormatoOblea,
      item: o.item ?? "",
      reparticion: o.reparticion ?? "",
      modeloVehiculo: o.modeloVehiculo ?? "",
      cliente: o.cliente ?? "Municipalidad",
      nroOblea: Number(o.nroOblea ?? 0),
    });
    setEditOpen(true);
  };

  const guardarEdicion = async () => {
    if (!canAdmin) return;
    if (!editData) return;

    const dominio = editData.dominio.trim().replace(/\s+/g, "").toUpperCase();
    if (!dominio) {
      swalDark.fire({ icon: "warning", title: "Dominio requerido" });
      return;
    }

    if (editData.nroOblea === "" || Number(editData.nroOblea) <= 0) {
      swalDark.fire({ icon: "warning", title: "NroOblea inválido", text: "Debe ser mayor a 0." });
      return;
    }

    const idNum = toIdNum(editData.id);
    if (idNum == null) {
      swalDark.fire({ icon: "error", title: "ID inválido", text: `IdOblea inválido: "${editData.id}"` });
      return;
    }

    const payload: ObleaEditFormData = {
      IdOblea: idNum,
      dominio,
      formato: editData.formato,
      item: editData.item ?? "",
      reparticion: editData.reparticion ?? "",
      modeloVehiculo: editData.modeloVehiculo ?? "",
      cliente: (editData.cliente ?? "Municipalidad") as ClienteType,
      nroOblea: Number(editData.nroOblea),
      fechaPedido: "",
    };

    try {
      await editarOblea(payload);
      setEditOpen(false);
      setEditData(null);

      swalDark.fire({ icon: "success", title: "Guardado", timer: 1200, showConfirmButton: false });
    } catch (e: any) {
      swalDark.fire({
        icon: "error",
        title: "No se pudo guardar",
        text: e?.response?.data?.message ?? "Error editando oblea",
      });
    }
  };

  /**
   * ✅ Reimpresión UNIFICADA
   * - Admin/Superadmin: cambia estado a "En reimpresion" + crea reimpresión
   * - Usuario: SOLO crea reimpresión (NO toca estado)
   */
  const solicitarReimpresion = async (ids: number[], opts: { cambiarEstadoOblea: boolean }) => {
    if (!canSolicitarReimpresion) return;

    if (!Array.isArray(ids) || ids.length === 0) {
      swalDark.fire({ icon: "warning", title: "Seleccioná al menos una oblea" });
      return;
    }

    // misma validación que tu botón de arriba (para todos)
    const invalidas = (obleas ?? []).filter((o) => {
      const idNum = Number(o.id);
      if (!Number.isFinite(idNum)) return false;
      if (!ids.includes(idNum)) return false;
      return ["Pendiente", "Cancelada"].includes(o.estado);
    });

    if (invalidas.length > 0) {
      swalDark.fire({
        icon: "warning",
        title: "No se puede reimprimir",
        text: `Hay ${invalidas.length} oblea(s) en Pendiente/Cancelada. Solo reimprime Creada o Entregada.`,
      });
      return;
    }

    const ok = await swalDark.fire({
      icon: "question",
      title: "¿Solicitar reimpresión?",
      text:
        opts.cambiarEstadoOblea && canAdmin
          ? `Se solicitará reimpresión de ${ids.length} oblea(s) y pasarán a "En reimpresion".`
          : `Se solicitará reimpresión de ${ids.length} oblea(s).`,
      showCancelButton: true,
      confirmButtonText: "Sí, pedir",
      cancelButtonText: "Cancelar",
    });

    if (!ok.isConfirmed) return;

    try {
      if (opts.cambiarEstadoOblea) {
        await Promise.all(ids.map((id) => cambiarEstado(id, "En reimpresion")));
      }

      await crearReimpresionMasivo({
        IdObleas: ids,
        SolicitadaPor: user?.Nombre ?? "Sistema",
        Motivo: null,
      });

      swalDark.fire({
        icon: "success",
        title: "Reimpresión solicitada",
        timer: 1200,
        showConfirmButton: false,
      });
    } catch (e: any) {
      swalDark.fire({
        icon: "error",
        title: "Error",
        text: e?.response?.data?.message ?? "No se pudo solicitar reimpresión",
      });
    }
  };

  // ✅ ESTE ES TU BOTÓN DE ARRIBA (igual que antes, pero usando la función unificada)
  const solicitarReimpresionMasivo = async () => {
    if (!canAdmin) return; // mantenemos: masivo sigue siendo solo admin
    if (seleccionadas.length === 0) {
      swalDark.fire({ icon: "warning", title: "Seleccioná al menos una oblea" });
      return;
    }
    await solicitarReimpresion(seleccionadas, { cambiarEstadoOblea: true });
    setSeleccionadas([]);
  };

  // ✅ guard


  useEffect(() => {
    const handler = () => {
      verObleas();
    };

    window.addEventListener("obleas:refresh", handler);

    return () => {
      window.removeEventListener("obleas:refresh", handler);
    };
  }, [verObleas]);


  if (!canUser) return null;


  return (
    <div className="space-y-4">
      {/* Filtros */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Filtrar por Estado</label>
            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value as EstadoOblea | "")}
              className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos</option>
              <option value="Pendiente">Pendientes</option>
              <option value="Creada">Creadas</option>
              <option value="Entregada">Entregadas</option>
              <option value="En reimpresion">En reimpresión</option>
              <option value="Cancelada">Canceladas</option>
            </select>
          </div>

          {/* Cliente filter solo admin */}
          {canAdmin ? (
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

          <div className="flex items-end">
            <button
              onClick={() => {
                // ✅ Si hay selección, exportar solo los seleccionados. Si no, toda la grid
                const aExportar = seleccionadas.length > 0
                  ? obleasFiltradas.filter(o => {
                    const idNum = toIdNum(o.id);
                    return idNum != null && seleccionadas.includes(idNum);
                  })
                  : obleasFiltradas;
                exportarAExcel(aExportar);
              }}
              className="w-full px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
            >
              Exportar Vista Actual
            </button>
          </div>
        </div>
      </div>

      {/* Acciones masivas: SOLO admin/superadmin */}
      {canAdmin && seleccionadas.length > 0 && (
        <div className="bg-blue-500/10 border border-blue-500/50 rounded-xl p-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <span className="text-blue-400 font-medium">{seleccionadas.length} oblea(s) seleccionada(s)</span>

            <div className="flex gap-2 flex-wrap">
              <RequestButton
                onClick={() => cambioMasivo("Creada")}
                text="Marcar Creadas"
                variant="green"
                size="small"
                width="auto"
              />

              <RequestButton
                onClick={() => cambioMasivo("Pendiente")}
                text="Pasar a Pendiente"
                variant="yellow"
                size="small"
                width="auto"
              />

              <RequestButton
                onClick={() => cambioMasivo("Entregada")}
                text="Marcar Entregadas"
                variant="blue"
                size="small"
                width="auto"
              />

              <RequestButton
                onClick={() => cambioMasivo("Cancelada")}
                text="Cancelar"
                variant="red"
                size="small"
                width="auto"
              />

              <RequestButton
                onClick={solicitarReimpresionMasivo}
                text="Solicitar Reimpresión"
                variant="purple"
                size="small"
                width="auto"
              />

              <RequestButton
                onClick={async () => {
                  try {
                    const obleasSeleccionadas = obleasFiltradas.filter(o => {
                      const idNum = toIdNum(o.id);
                      return idNum != null && seleccionadas.includes(idNum);
                    });

                    if (obleasSeleccionadas.length === 0) {
                      swalDark.fire({
                        icon: "warning",
                        title: "Sin selección",
                        text: "No hay obleas seleccionadas para generar"
                      });
                      return;
                    }

                    await generarPDFObleas(obleasSeleccionadas);
                    swalDark.fire({
                      icon: "success",
                      title: "PDF Generado",
                      text: `Se generaron ${obleasSeleccionadas.length} oblea(s)`,
                      timer: 2000,
                      showConfirmButton: false
                    });
                  } catch (error: any) {
                    console.error('Error al generar PDF:', error);
                    swalDark.fire({
                      icon: "error",
                      title: "Error",
                      text: error.message || "No se pudo generar el PDF"
                    });
                  }
                }}
                text="🖨️ Crear Oblea"
                variant="blue"
                size="small"
                width="auto"
              />

              <RequestButton
                onClick={() => setSeleccionadas([])}
                text="Limpiar selección"
                variant="blue"
                size="small"
                width="auto"
              />
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
                {/* checkbox para todos */}
                <th className="px-4 py-3 text-left">
                  <Checkbox
                    checked={obleasFiltradas.length > 0 && seleccionadas.length === obleasFiltradas.length}
                    onChange={(checked) => {
                      if (checked) {
                        setSeleccionadas(obleasFiltradas.map(o => toIdNum(o.id)).filter((n): n is number => n != null));
                      } else {
                        setSeleccionadas([]);
                      }
                    }}
                  />
                </th>

                {/* ID - solo admin/superadmin */}
                {canAdmin && <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">ID</th>}
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">Nro Oblea</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">Dominio</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">Formato</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">Item</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">Repartición</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">Modelo</th>

                {canAdmin && <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">Cliente</th>}

                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">Estado</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">Fecha Pedido</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">Fecha Creación</th>

                {/* ✅ admin: Acciones / usuario: Reimpresión */}
                {canAdmin ? (
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">Acciones</th>
                ) : (
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">Reimpresión</th>
                )}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-700">
              {obleasFiltradas.length === 0 ? (
                <tr>
                  <td colSpan={13} className="px-4 py-8 text-center text-slate-400">
                    No hay obleas para mostrar
                  </td>
                </tr>
              ) : (
                obleasFiltradas.map((o) => {
                  const idNum = toIdNum(o.id);
                  const checked = idNum != null && seleccionadas.includes(idNum);

                  return (
                    <tr key={o.id} className="hover:bg-slate-700/30 transition-colors">
                      <td className="px-4 py-3">
                        <Checkbox
                          checked={checked}
                          onChange={() => toggleSeleccion(o.id)}
                        />
                      </td>

                      {/* ID - solo admin/superadmin */}
                      {canAdmin && <td className="px-4 py-3 text-sm text-slate-300 font-mono">{o.id}</td>}
                      <td className="px-4 py-3 text-sm text-slate-300 font-mono">{o.nroOblea}</td>
                      <td className="px-4 py-3 text-sm text-white font-semibold">{o.dominio}</td>
                      <td className="px-4 py-3 text-sm text-slate-300">{o.formato}</td>
                      <td className="px-4 py-3 text-sm text-slate-300">{o.item || "-"}</td>
                      <td className="px-4 py-3 text-sm text-slate-300">{o.reparticion || "-"}</td>
                      <td className="px-4 py-3 text-sm text-slate-300">{o.modeloVehiculo || "-"}</td>

                      {canAdmin && <td className="px-4 py-3 text-sm text-slate-300">{o.cliente}</td>}

                      <td className="px-4 py-3">
                        <span
                          className={`inline-block px-3 py-1 text-xs font-medium rounded-full border ${getEstadoColor(
                            o.estado
                          )}`}
                        >
                          {o.estado}
                        </span>
                      </td>

                      <td className="px-4 py-3 text-sm text-slate-300">{fmtDate(o.fechaPedido)}</td>
                      <td className="px-4 py-3 text-sm text-slate-300">{fmtDate(o.fechaCreacion)}</td>

                      {canAdmin ? (
                        <td className="px-4 py-3">
                          <RequestButton
                            onClick={() => setObleaAcciones(o)}
                            text="Acciones"
                            variant="blue"
                            size="small"
                            width="110px"
                          />
                        </td>
                      ) : (
                        <td className="px-4 py-3">
                          <RequestButton
                            onClick={async () => {
                              const id = toIdNum(o.id);
                              if (id == null) {
                                swalDark.fire({
                                  icon: "error",
                                  title: "ID inválido",
                                  text: `IdOblea inválido: "${o.id}"`,
                                });
                                return;
                              }

                              await solicitarReimpresion([id], { cambiarEstadoOblea: true });
                            }}
                            text="♻️ Solicitar"
                            variant="purple"
                            size="small"
                            width="110px"
                          />
                        </td>
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Popup Exportar (solo admin) */}
      {canAdmin && mostrarPopupExportar && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-white mb-4">Exportar y Notificar</h3>

            <p className="text-slate-300 mb-4">Se marcaron obleas como creadas. ¿Querés exportar Excel?</p>

            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Email de notificación (opcional)
              </label>
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

      {/* Modal Acciones (solo admin) */}
      {canAdmin && obleaAcciones && (
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

              <button
                onClick={() => cambioIndividual(obleaAcciones, "Creada")}
                className="w-full px-4 py-3 bg-green-500/10 hover:bg-green-500/20 text-green-400 rounded-lg transition-colors flex items-center gap-3"
              >
                <span className="w-3 h-3 bg-green-400 rounded-full" />
                Cambiar a Creada
              </button>

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

              {/* ✅ ESTE BOTÓN AHORA FUNCIONA IGUAL QUE EL DE ARRIBA */}
              <button
                onClick={async () => {
                  const idNum = toIdNum(obleaAcciones.id);
                  if (idNum == null) {
                    swalDark.fire({
                      icon: "error",
                      title: "ID inválido",
                      text: `IdOblea inválido: "${obleaAcciones.id}"`,
                    });
                    return;
                  }

                  await solicitarReimpresion([idNum], { cambiarEstadoOblea: true }); // ✅ igual que masivo
                  setObleaAcciones(null);
                }}
                className="w-full px-4 py-3 bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 rounded-lg transition-colors flex items-center gap-3"
              >
                ♻️ Solicitar Reimpresión
              </button>

              <button
                onClick={async () => {
                  if (!obleaAcciones) return;
                  try {
                    await generarPDFObleas([obleaAcciones]);
                    swalDark.fire({
                      icon: "success",
                      title: "PDF Generado",
                      text: `Oblea ${obleaAcciones.dominio} generada`,
                      timer: 2000,
                      showConfirmButton: false
                    });
                    setObleaAcciones(null);
                  } catch (error: any) {
                    console.error('Error al generar PDF:', error);
                    swalDark.fire({
                      icon: "error",
                      title: "Error",
                      text: error.message || "No se pudo generar el PDF"
                    });
                  }
                }}
                className="w-full px-4 py-3 bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 rounded-lg transition-colors flex items-center gap-3"
              >
                🖨️ Crear Oblea
              </button>

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

      {/* Modal Editar (solo admin) */}
      {canAdmin && editOpen && editData && (
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
                  onChange={(e) => setEditData({ ...editData, formato: e.target.value as FormatoOblea })}
                  className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Interna">Interna</option>
                  <option value="Externa">Externa</option>
                  <option value="Tarjeta">Tarjeta</option>
                </select>
              </div>

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

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Nro Oblea</label>
                <input
                  type="number"
                  value={editData.nroOblea}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      nroOblea: e.target.value === "" ? "" : Number(e.target.value),
                    })
                  }
                  className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                />
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

import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
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

import { useObleas } from "../hooks/useObleas";
import { useAuth } from "../hooks/useAuth";

import type { ClienteType, ObleaFormData } from "../types/obleas";

export default function FormularioOblea() {
  const { user } = useAuth();
  const { crearOblea, obleas, proximoNroOblea, obtenerProximoNroOblea } = useObleas();

  // ✅ permisos
  const role = (user?.Rol ?? "usuario").toLowerCase();
  const canAdmin = role === "admin" || role === "superadmin";

  // ✅ cliente efectivo:
  // - admin/superadmin: eligen desde el select
  // - usuario: fijo (si user.Cliente existe), si no Municipalidad
  const clienteUsuario = (user as any)?.Cliente as ClienteType | undefined;
  const clienteFijoUsuario: ClienteType = clienteUsuario ?? "Municipalidad";

  // ✅ creadaPor efectivo:
  // - admin/superadmin: pueden elegirlo
  // - usuario: SIEMPRE su propio nombre
  const nombreUsuario = (user?.Nombre ?? "").trim();
  const creadaPorFijoUsuario = nombreUsuario || "Sistema";

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // 🔥 form: agregamos creadaPor (si tu type no lo tiene, agregalo)
  const [formData, setFormData] = useState<ObleaFormData & { creadaPor?: string }>({
    dominio: "",
    formato: "Interna",
    item: "",
    reparticion: "",
    modeloVehiculo: "",
    cliente: canAdmin ? "Municipalidad" : clienteFijoUsuario,
    nroOblea: 0,
    creadaPor: canAdmin ? "" : creadaPorFijoUsuario,
  });

  // ✅ al cambiar rol/user, si es usuario fijamos cliente y creadaPor
  useEffect(() => {
    if (!canAdmin) {
      setFormData((prev) => ({
        ...prev,
        cliente: clienteFijoUsuario,
        creadaPor: creadaPorFijoUsuario,
      }));
    } else {
      // si pasa a admin, dejamos creadaPor editable (vacío o el que ya tenga)
      setFormData((prev) => ({
        ...prev,
        cliente: prev.cliente ?? "Municipalidad",
        creadaPor: prev.creadaPor ?? "",
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canAdmin, clienteFijoUsuario, creadaPorFijoUsuario]);

  // ✅ Al entrar: pedimos próximo nro sugerido
  useEffect(() => {
    (async () => {
      try {
        const nro = await obtenerProximoNroOblea();
        setFormData((prev) => ({ ...prev, nroOblea: nro }));
      } catch (e) {
        console.log(e);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ✅ cliente para validar duplicados
  const clienteParaValidar = useMemo<ClienteType>(() => {
    if (!canAdmin) return clienteFijoUsuario;
    return (formData.cliente ?? "Municipalidad") as ClienteType;
  }, [formData.cliente, canAdmin, clienteFijoUsuario]);

  // ✅ creadaPor efectivo para enviar
  const creadaPorParaEnviar = useMemo(() => {
    if (!canAdmin) return creadaPorFijoUsuario;
    return (formData.creadaPor ?? "").trim(); // admin elige
  }, [canAdmin, creadaPorFijoUsuario, formData.creadaPor]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === "nroOblea") {
      setFormData((prev) => ({ ...prev, nroOblea: value === "" ? 0 : Number(value) }));
      return;
    }

    // ✅ usuario NO puede cambiar cliente ni creadaPor
    if (!canAdmin && (name === "cliente" || name === "creadaPor")) return;

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    setError("");
    setIsLoading(true);

    const dominioLimpio = formData.dominio.trim().replace(/\s+/g, "").toUpperCase();
    const itemLimpio = formData.item?.trim().replace(/\s+/g, "") || "";
    const reparticionLimpia = formData.reparticion?.trim() || "";
    const modeloLimpio = formData.modeloVehiculo?.trim() || "";

    if (!dominioLimpio) {
      setError("Dominio/DNI es obligatorio");
      setIsLoading(false);
      return;
    }

    if (!formData.nroOblea || Number.isNaN(Number(formData.nroOblea)) || Number(formData.nroOblea) <= 0) {
      setError("El Nro Oblea es obligatorio y debe ser un número válido (> 0).");
      setIsLoading(false);
      return;
    }

    // ✅ si es admin, creadaPor es obligatoria
    if (canAdmin && !creadaPorParaEnviar) {
      setError("Creada por es obligatorio para admin/superadmin.");
      setIsLoading(false);
      return;
    }

    // ✅ Validación duplicados (front)
    const duplicado = (obleas ?? []).find(
      (o) => o.dominio === dominioLimpio && o.cliente === clienteParaValidar && o.estado !== "Cancelada"
    );

    if (duplicado) {
      setError(`Ya existe una solicitud activa con "${dominioLimpio}" para ${clienteParaValidar}. Nro Oblea: ${duplicado.nroOblea}`);
      setIsLoading(false);
      return;
    }

    try {
      await crearOblea({
        dominio: dominioLimpio,
        formato: formData.formato,
        item: itemLimpio || undefined,
        reparticion: reparticionLimpia || undefined,
        modeloVehiculo: modeloLimpio || undefined,
        cliente: clienteParaValidar,
        nroOblea: Number(formData.nroOblea),

        // ✅ clave del cambio:
        creadaPor: creadaPorParaEnviar,
      } as any);

      swalDark.fire({
        icon: "success",
        title: "Oblea solicitada",
        text: "Se registró correctamente.",
        timer: 1400,
        showConfirmButton: false,
      });

      const nro = await obtenerProximoNroOblea();

      setFormData({
        dominio: "",
        formato: "Interna",
        item: "",
        reparticion: "",
        modeloVehiculo: "",
        cliente: canAdmin ? "Municipalidad" : clienteFijoUsuario,
        nroOblea: nro,
        creadaPor: canAdmin ? "" : creadaPorFijoUsuario,
      });

      // ✅ avisar al Grid (cualquier componente puede escuchar esto)
      window.dispatchEvent(new Event("obleas:refresh"));
    } catch (err: any) {
      console.log(err);
      const msg = err?.response?.data?.message || "No se pudo crear la oblea. Revisá el back/validaciones.";
      swalDark.fire({ icon: "error", title: "Error", text: msg });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
      <h2 className="text-2xl font-bold text-white mb-6">Solicitar Nueva Oblea</h2>

      {error && (
        <div className="mb-4 bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* NroOblea */}
          {canAdmin ? (
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Nro Oblea <span className="text-red-500">*</span>
              </label>

              <input
                type="number"
                name="nroOblea"
                value={formData.nroOblea || ""}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white"
                min={1}
                required
              />

              <p className="text-xs text-slate-400 mt-1">Sugerido: {proximoNroOblea ?? formData.nroOblea}</p>
            </div>
          ) : (
            // ✅ Usuario: invisible, pero dejamos el valor fijado para submit
            <input type="hidden" name="nroOblea" value={formData.nroOblea} readOnly />
          )}

          {/* ✅ CreadaPor: SOLO admin/superadmin */}
          {canAdmin ? (
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Creada por <span className="text-red-500">*</span>
              </label>

              <select
                name="creadaPor"
                value={formData.creadaPor ?? ""}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white"
                required
              >
                <option value="" disabled>
                  Seleccionar...
                </option>

                {/* 👇 Acá poné los usuarios reales que vos quieras (o que vengan de un endpoint) */}
                <option value="Municipalidad">Municipalidad</option>
                <option value="Geogas">Geogas</option>
                <option value="Axio">Axio</option>
              </select>

              <p className="text-xs text-slate-400 mt-1">Admin puede elegir quién la crea.</p>
            </div>
          ) : (
            // ✅ Usuario: invisible, pero dejamos el valor fijado para submit
            <input type="hidden" name="creadaPor" value={creadaPorFijoUsuario} readOnly />
          )}

          {/* ✅ Cliente: SOLO admin/superadmin (usuario NO lo ve) */}
          {canAdmin ? (
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Cliente <span className="text-red-500">*</span>
              </label>

              <select
                name="cliente"
                value={(formData.cliente || "Municipalidad") as any}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white"
                required
              >
                <option value="Municipalidad">Municipalidad</option>
                <option value="Geogas">Geogas</option>
              </select>
            </div>
          ) : (
            <input type="hidden" name="cliente" value={clienteFijoUsuario} readOnly />
          )}

          {/* Dominio / DNI */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              {formData.formato === "Tarjeta" ? "DNI" : "Dominio"} <span className="text-red-500">*</span>
            </label>

            <input
              type="text"
              name="dominio"
              value={formData.dominio}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white uppercase"
              required
            />
          </div>

          {/* Formato */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Formato <span className="text-red-500">*</span>
            </label>

            <select
              name="formato"
              value={formData.formato}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white"
              required
            >
              <option value="Interna">Interna</option>
              <option value="Externa">Externa</option>
              <option value="Tarjeta">Tarjeta</option>
            </select>
          </div>

          {/* Item */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Item</label>
            <input
              type="text"
              name="item"
              value={formData.item || ""}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white"
            />
          </div>

          {/* Repartición */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Repartición</label>
            <input
              type="text"
              name="reparticion"
              value={formData.reparticion || ""}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white"
            />
          </div>

          {/* Modelo */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-300 mb-2">Modelo/Vehículo</label>
            <input
              type="text"
              name="modeloVehiculo"
              value={formData.modeloVehiculo || ""}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white"
            />
          </div>
        </div>

        <div className="flex justify-center">
          <RequestButton
            type="submit"
            text={isLoading ? "Solicitando..." : "Solicitar Oblea"}
            size="medium"
            width="27%"
            disabled={isLoading}
          />
        </div>
      </form>
    </div>
  );
}

import { useEffect, useMemo, useState } from "react";
import { useObleas } from "../hooks/useObleas";
import type { ClienteType, ObleaFormData } from "../types/obleas";
import Swal from "sweetalert2";

export default function FormularioOblea() {
  const { crearOblea, obleas, proximoNroOblea, obtenerProximoNroOblea } =
    useObleas();

  const [formData, setFormData] = useState<ObleaFormData>({
    dominio: "",
    formato: "Interna",
    item: "",
    reparticion: "",
    modeloVehiculo: "",
    cliente: "Municipalidad",
    nroOblea: 0,
  });

  const [error, setError] = useState<string>("");

  // ✅ Cuando entra al componente, SOLO miramos el próximo número (NO reservamos)
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

  // ✅ cliente para validar duplicados (por ahora fijo en el form)
  const clienteParaValidar = useMemo<ClienteType>(() => {
    return (formData.cliente ?? "Municipalidad") as ClienteType;
  }, [formData.cliente]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "nroOblea") {
      setFormData((prev) => ({ ...prev, nroOblea: Number(value) }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const dominioLimpio = formData.dominio
      .trim()
      .replace(/\s+/g, "")
      .toUpperCase();

    const itemLimpio = formData.item?.trim().replace(/\s+/g, "") || "";
    const reparticionLimpia = formData.reparticion?.trim() || "";
    const modeloLimpio = formData.modeloVehiculo?.trim() || "";

    if (!dominioLimpio) {
      setError("Dominio/DNI es obligatorio");
      return;
    }

    if (!formData.nroOblea || Number.isNaN(Number(formData.nroOblea))) {
      setError("El Nro Oblea es obligatorio y debe ser un número válido.");
      return;
    }

    // ✅ Validación duplicados (front)
    const duplicado = obleas.find(
      (o) =>
        o.dominio === dominioLimpio &&
        o.cliente === clienteParaValidar &&
        o.estado !== "Cancelada"
    );

    if (duplicado) {
      setError(
        `Ya existe una solicitud activa con "${dominioLimpio}" para ${clienteParaValidar}. Nro Oblea: ${duplicado.nroOblea}`
      );
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

        // ✅ nro sugerido (en tu back actual se ignora y lo genera igual,
        // pero lo dejamos para cuando habilites crear manual)
        nroOblea: Number(formData.nroOblea),

        // ✅ creadaPor: en admin = cliente
        creadaPor: clienteParaValidar,
      });

      Swal.fire({
        icon: "success",
        title: "Oblea solicitada",
        text: "Se registró correctamente.",
        timer: 1400,
        showConfirmButton: false,
      });

      // ✅ reseteamos el form y volvemos a pedir el próximo nro (SOLO mirar)
      const nro = await obtenerProximoNroOblea();

      setFormData({
        dominio: "",
        formato: "Interna",
        item: "",
        reparticion: "",
        modeloVehiculo: "",
        cliente: "Municipalidad",
        nroOblea: nro,
      });
    } catch (err: any) {
      console.log(err);
      const msg =
        err?.response?.data?.message ||
        "No se pudo crear la oblea. Revisá el back/validaciones.";
      Swal.fire({ icon: "error", title: "Error", text: msg });
    }
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
      <h2 className="text-2xl font-bold text-white mb-6">
        Solicitar Nueva Oblea
      </h2>

      {error && (
        <div className="mb-4 bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* NroOblea */}
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

            <p className="text-xs text-slate-400 mt-1">
              Sugerido: {proximoNroOblea ?? formData.nroOblea}
            </p>
          </div>

          {/* Cliente */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Cliente <span className="text-red-500">*</span>
            </label>

            <select
              name="cliente"
              value={formData.cliente || "Municipalidad"}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white"
              required
            >
              <option value="Municipalidad">Municipalidad</option>
              <option value="Geogas">Geogas</option>
            </select>
          </div>

          {/* Dominio / DNI */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              {formData.formato === "Tarjeta" ? "DNI" : "Dominio"}{" "}
              <span className="text-red-500">*</span>
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
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Item
            </label>
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
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Repartición
            </label>
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
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Modelo/Vehículo
            </label>
            <input
              type="text"
              name="modeloVehiculo"
              value={formData.modeloVehiculo || ""}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold py-3 rounded-lg"
        >
          Solicitar Oblea
        </button>
      </form>
    </div>
  );
}

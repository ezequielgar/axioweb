import { useEffect, useState } from "react";
import type { Oblea, ObleaFormData, EstadoOblea, ObleaEditFormData } from "../types/obleas";
import { obleasApi } from "../api/obleas";
import { obleaFromApi, obleaToCreateApi, obleaToEditApi } from "../types/obleas";
import type { UsuarioAuth } from "../types/auth";

export const useObleas = () => {
  const [obleas, setObleas] = useState<Oblea[]>([]);
  const [proximoNroOblea, setProximoNroOblea] = useState<number | null>(null);

  const verObleas = async () => {
    const resp = await obleasApi.verObleas();
    setObleas(resp.data.map(obleaFromApi));
  };

  const obtenerProximoNroOblea = async () => {
    const resp = await obleasApi.proximoNroOblea();
    setProximoNroOblea(resp.data.nroOblea);
    return resp.data.nroOblea;
  };

const crearOblea = async (form: ObleaFormData) => {
  const raw = localStorage.getItem("axio_user");
  const user = raw ? (JSON.parse(raw) as UsuarioAuth) : null;

  const body = obleaToCreateApi(form);

  const creadaPorElegida = (form.creadaPor ?? "").trim();

  const bodyFinal = {
    ...body,
    creadaPor: creadaPorElegida || user?.Nombre || "Sistema",
  };

  await verObleas();
  await obleasApi.crearOblea(bodyFinal);
  await obtenerProximoNroOblea();
};

  const editarOblea = async (form: ObleaEditFormData) => {
    const body = obleaToEditApi(form);
    await obleasApi.editarOblea(body);
    await verObleas();
  };

  const cambiarEstado = async (IdOblea: number, nuevoEstado: EstadoOblea) => {
    await obleasApi.cambiarEstado({ IdOblea, nuevoEstado });
    await verObleas();
  };

  const eliminarOblea = async (id: string) => {
    await obleasApi.eliminarOblea(Number(id));
    await verObleas();
  };

  useEffect(() => {
    verObleas();
     obtenerProximoNroOblea();
  }, []);

  return {
    obleas,
    proximoNroOblea,
    verObleas,
    crearOblea,
    editarOblea,
    cambiarEstado,
    eliminarOblea,
    obtenerProximoNroOblea,
  };
};

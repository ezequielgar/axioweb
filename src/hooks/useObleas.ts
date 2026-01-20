import { useEffect, useState } from "react";
import type { Oblea, ObleaFormData, EstadoOblea } from "../types/obleas";
import { obleasApi } from "../api/obleas";
import {
  obleaFromApi,
  obleaToCreateApi,
  obleaToEditApi,
} from "../types/obleas";
import type { ObleaEditFormData } from "../types/obleas";

export const useObleas = () => {
  const [obleas, setObleas] = useState<Oblea[]>([]);
  const [proximoNroOblea, setProximoNroOblea] = useState<number | null>(null);

  const verObleas = async () => {
    const resp = await obleasApi.verObleas();
    setObleas(resp.data.map(obleaFromApi));
  };

  // const reservarNroOblea = async () => {
  //   const resp = await obleasApi.reservarNroOblea();
  //   setProximoNroOblea(resp.data.nroOblea);
  //   return resp.data.nroOblea;
  // };

const crearOblea = async (form: ObleaFormData) => {
  const body = obleaToCreateApi(form);
  await obleasApi.crearOblea(body);
  await verObleas();
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

const obtenerProximoNroOblea = async () => {
  const resp = await obleasApi.proximoNroOblea();
  setProximoNroOblea(resp.data.nroOblea);
  return resp.data.nroOblea;
};
  useEffect(() => {
    verObleas();
  }, []);

  return {
    obleas,
    proximoNroOblea,
    verObleas,
    // reservarNroOblea,
    crearOblea,
    editarOblea,
    cambiarEstado,
    eliminarOblea,
    obtenerProximoNroOblea
  };
};

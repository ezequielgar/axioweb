import { useEffect, useState } from "react";
import type { Turno, CrearTurnoBody, EditarTurnoBody } from "../types/turnos";
import { turnosApi } from "../api/turno";

export const useTurnos = () => {
  const [turnos, setTurnos] = useState<Turno[]>([]);

  const verTurnos = async () => {
    const resp = await turnosApi.verTurnos();
    setTurnos(resp.data);
  };

  const crearTurno = async (body: CrearTurnoBody) => {
    await turnosApi.crearTurno(body);
    await verTurnos();
  };

  const editarTurno = async (body: EditarTurnoBody) => {
    await turnosApi.editarTurno(body);
    await verTurnos();
  };

  const eliminarTurno = async (id: number) => {
    await turnosApi.eliminarTurno(id);
    await verTurnos();
  };

  useEffect(() => {
    verTurnos();
  }, []);

  return { turnos, verTurnos, crearTurno, editarTurno, eliminarTurno };
};

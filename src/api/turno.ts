import axios from "axios";
import type { Turno, CrearTurnoBody, EditarTurnoBody } from "../types/turnos";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

export const turnosApi = {
  verTurnos: () => axios.get<Turno[]>(`${API_URL}/turnos/verTurnos`),

  crearTurno: (body: CrearTurnoBody) =>
    axios.post(`${API_URL}/turnos/crearTurnos`, body),

  editarTurno: (body: EditarTurnoBody) =>
    axios.put(`${API_URL}/turnos/editarTurnos`, body),

  eliminarTurno: (IdTurno: number) =>
    axios.delete(`${API_URL}/turnos/eliminarTurnos/${IdTurno}`),
};

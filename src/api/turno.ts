import axios from "axios";
import type { Turno, CrearTurnoBody, EditarTurnoBody } from "../types/turnos";


// "http://localhost:3000/api"
// "/api"

const API_URL = import.meta.env.VITE_API_URL ?? "/api";

export const turnosApi = {
  verTurnos: () => axios.get<Turno[]>(`${API_URL}/turnos/verTurnos`),

  crearTurno: (body: CrearTurnoBody) =>
    axios.post(`${API_URL}/turnos/crearTurnos`, body),

  editarTurno: (body: EditarTurnoBody) =>
    axios.put(`${API_URL}/turnos/editarTurnos`, body),

  eliminarTurno: (IdTurno: number) =>
    axios.delete(`${API_URL}/turnos/eliminarTurnos/${IdTurno}`),
};

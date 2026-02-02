import axios from "axios";
import type { Personal, EstadoPersonal, CrearPersonalBody, EditarPersonalBody } from "../types/personal";


// "http://localhost:3000/api"
// "/api"


const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api";

export const personalApi = {
  listar: () => axios.get<Personal[]>(`${API_URL}/personal/verPersonal`),

  listarActivos: () => axios.get<Personal[]>(`${API_URL}/personal/verPersonalActivo`),

  crear: (body: CrearPersonalBody) =>
    axios.post<{ message: string; IdPersonal: number }>(`${API_URL}/personal/crearPersonal`, body),

  editar: (IdPersonal: number, body: EditarPersonalBody) =>
    axios.put<{ message: string }>(`${API_URL}/personal/editarPersonal/${IdPersonal}`, body),

  eliminar: (IdPersonal: number) =>
    axios.delete<{ message: string }>(`${API_URL}/personal/eliminarPersonal/${IdPersonal}`),

  cambiarEstado: (IdPersonal: number, Estado: EstadoPersonal) =>
    axios.patch<{ message: string }>(`${API_URL}/personal/cambiarEstadoPersonal/${IdPersonal}`, { Estado }),
};

import axios from "axios";
import type {
  ObleaApi,
  CrearObleaApiBody,
  EditarObleaApiBody,
  CambiarEstadoApiBody,
} from "../types/obleas";

// "http://localhost:3000/api"
// "/api"


const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api";

export const obleasApi = {
  verObleas: () => axios.get<ObleaApi[]>(`${API_URL}/obleas/verObleas`),

  reservarNroOblea: () =>
    axios.post<{ nroOblea: number }>(`${API_URL}/obleas/reservarNroOblea`),

  crearOblea: (body: CrearObleaApiBody) =>
    axios.post(`${API_URL}/obleas/crearOblea`, body),

  editarOblea: (body: EditarObleaApiBody) =>
    axios.put(`${API_URL}/obleas/editarOblea`, body),

  cambiarEstado: (body: CambiarEstadoApiBody) =>
    axios.patch(`${API_URL}/obleas/cambiarEstado`, body),

  eliminarOblea: (IdOblea: number) =>
    axios.delete(`${API_URL}/obleas/eliminarOblea/${IdOblea}`),

  proximoNroOblea: () => axios.get<{ nroOblea: number }>(`${API_URL}/obleas/proximoNroOblea`),

  
};

import axios from "axios";
import type { Usuario, CrearUsuarioBody, EditarUsuarioBody } from "../types/usuarios";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

export const usuariosApi = {
  verUsuario: () => axios.get<Usuario[]>(`${API_URL}/usuarios/verUsuarios`),

  crearUsuarios: (body: CrearUsuarioBody) =>
    axios.post(`${API_URL}/usuarios/crearUsuarios`, body),

  editarUsuario: (body: EditarUsuarioBody) =>
    axios.put(`${API_URL}/usuarios/editarUsuarios`, body),

  eliminarUsuario: (IdUsuario: number) =>
    axios.delete(`${API_URL}/usuarios/eliminarUsuario/${IdUsuario}`),
};

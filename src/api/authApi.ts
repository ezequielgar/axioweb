import axios from "axios";
import type { LoginResponse } from "../types/auth";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

export const authApi = {
  login: (Nombre: string, Clave: string) =>
    axios.post<LoginResponse>(`${API_URL}/auth/login`, { Nombre, Clave }),
};
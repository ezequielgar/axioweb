import axios from "axios";
import type { LoginResponse } from "../types/auth";

// "http://localhost:3000/api"
// "/api"

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api";

export const authApi = {
  login: (Nombre: string, Clave: string) =>
    axios.post<LoginResponse>(`${API_URL}/auth/login`, { Nombre, Clave }),
};
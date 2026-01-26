import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import Swal from "sweetalert2";
import { authApi } from "../api/authApi";
import type { UsuarioAuth } from "../types/auth";

type UsuarioSession = {
  id: number;
  nombre: string;
  rol: "admin" | "usuario";
  telefono: string | null;
  email: string | null;
  estado: "Activo" | "Inactivo";
};

interface ObleasContextType {
  usuario: UsuarioSession | null;
  loadingAuth: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAdmin: boolean;
}

const ObleasContext = createContext<ObleasContextType | undefined>(undefined);

const STORAGE_KEY = "obleas_usuario";

const mapUserFromApi = (u: UsuarioAuth): UsuarioSession => ({
  id: u.IdUsuario,
  nombre: u.Nombre,
  rol: String(u.Rol).toLowerCase() === "admin" ? "admin" : "usuario",
  telefono: u.Telefono ?? null,
  email: u.Email ?? null,
  estado: u.Estado,
});

export function ObleasProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<UsuarioSession | null>(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as UsuarioSession) : null;
  });

  const [loadingAuth, setLoadingAuth] = useState(false);

  const isAdmin = useMemo(() => usuario?.rol === "admin", [usuario]);

  const login = async (username: string, password: string) => {
    setLoadingAuth(true);
    try {
      const resp = await authApi.login(username, password);
      const user = mapUserFromApi(resp.data.user);

      setUsuario(user);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      return true;
    } catch (e: any) {
      // opcional: mostrar el mensaje del backend
      const msg = e?.response?.data?.message ?? "No se pudo iniciar sesión";
      Swal.fire({ icon: "error", title: "Login", text: msg });
      return false;
    } finally {
      setLoadingAuth(false);
    }
  };

  const logout = () => {
    setUsuario(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  // opcional: si querés “auto logout” si el user quedó inválido
  useEffect(() => {
    if (usuario?.estado === "Inactivo") {
      logout();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ObleasContext.Provider value={{ usuario, loadingAuth, login, logout, isAdmin }}>
      {children}
    </ObleasContext.Provider>
  );
}

export function useObleas() {
  const ctx = useContext(ObleasContext);
  if (!ctx) throw new Error("useObleas debe usarse dentro de ObleasProvider");
  return ctx;
}

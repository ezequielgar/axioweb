import { useEffect, useMemo, useState } from "react";
import type { UsuarioAuth, LoginResponse } from "../types/auth";
import { authApi } from "../api/authApi";

const LS_USER = "axio_user";
const LS_ROLE = "axio_role";
const LS_TOKEN = "axio_token";

const readUserFromLS = (): UsuarioAuth | null => {
  const raw = localStorage.getItem(LS_USER);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as UsuarioAuth;
  } catch {
    return null;
  }
};

export const useAuth = () => {
  // ✅ arranca en loading, lee LS una vez
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UsuarioAuth | null>(null);

  useEffect(() => {
    setUser(readUserFromLS());
    setLoading(false);

    // ✅ si cambia el LS en otra pestaña o logout externo
    const onStorage = (e: StorageEvent) => {
      if (e.key === LS_USER || e.key === LS_ROLE || e.key === LS_TOKEN) {
        setUser(readUserFromLS());
      }
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

      const login = async (Nombre: string, Clave: string): Promise<UsuarioAuth> => {
        const resp = await authApi.login(Nombre, Clave);
        const data = resp.data;

        localStorage.setItem(LS_USER, JSON.stringify(data.user));
        localStorage.setItem(LS_ROLE, data.user.Rol);

        if (data.token) localStorage.setItem(LS_TOKEN, data.token);

        setUser(data.user);
        return data.user;
      };

  const logout = () => {
    localStorage.removeItem(LS_USER);
    localStorage.removeItem(LS_ROLE);
    localStorage.removeItem(LS_TOKEN);
    setUser(null);
  };

  const role = useMemo(() => String(user?.Rol ?? "").toLowerCase(), [user]);
  const isAuthenticated = !!user;
  const isAdmin = role === "admin" || role === "superadmin";

  return { user, loading, login, logout, isAuthenticated, isAdmin, role };
};

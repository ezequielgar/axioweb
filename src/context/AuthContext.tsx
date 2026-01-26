import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { UsuarioAuth, LoginResponse } from "../types/auth";
import { authApi } from "../api/authApi";

const LS_USER = "axio_user";
const LS_ROLE = "axio_role";
const LS_TOKEN = "axio_token";

type AuthContextType = {
  user: UsuarioAuth | null;
  loading: boolean;            // hidrata sesión
  authenticating: boolean;     // login en curso
  login: (Nombre: string, Clave: string) => Promise<UsuarioAuth>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UsuarioAuth | null>(null);
  const [loading, setLoading] = useState(true);
  const [authenticating, setAuthenticating] = useState(false);

  // ✅ hidratar sesión 1 sola vez
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_USER);
      setUser(raw ? (JSON.parse(raw) as UsuarioAuth) : null);
    } catch {
      localStorage.removeItem(LS_USER);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (Nombre: string, Clave: string) => {
    setAuthenticating(true);
    try {
      const resp = await authApi.login(Nombre, Clave);
      const data = resp.data as LoginResponse;

      localStorage.setItem(LS_USER, JSON.stringify(data.user));
      localStorage.setItem(LS_ROLE, data.user.Rol);

      if (data.token) localStorage.setItem(LS_TOKEN, data.token);

      setUser(data.user);
      return data.user;
    } finally {
      setAuthenticating(false);
    }
  };

  const logout = () => {
    localStorage.removeItem(LS_USER);
    localStorage.removeItem(LS_ROLE);
    localStorage.removeItem(LS_TOKEN);
    setUser(null);
  };

  const value = useMemo(
    () => ({ user, loading, authenticating, login, logout }),
    [user, loading, authenticating]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider />");
  return ctx;
}

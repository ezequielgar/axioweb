import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  // ⏳ Esperar a que el AuthProvider hidrate el user desde localStorage
  if (loading) return null;

  // 🚪 Si no está logueado -> login
  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // ✅ Validar rol (admin o superadmin)
  const rol = String(user.Rol ?? "").toLowerCase();
  const canAdmin = rol === "admin" || rol === "superadmin";


  if (!canAdmin) {
    return <Navigate to="/turnos" replace />;
  }

  return <>{children}</>;
}

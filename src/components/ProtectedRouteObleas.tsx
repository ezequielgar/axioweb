import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRouteObleas({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();

  // ⏳ Esperamos a que el AuthProvider hidrate desde localStorage
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <p className="text-slate-300">Cargando sesión...</p>
      </div>
    );
  }

  // 🔒 Si no hay usuario => login obleas
  if (!user) return <Navigate to="/munismt" replace />;

  return <>{children}</>;
}

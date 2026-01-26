import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRouteObleas({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) return null; // o un loader

  if (!user) return <Navigate to="/munismt" replace />;

  return <>{children}</>;
}

import { useEffect, useState } from "react";

import FormularioOblea from "./FormularioOblea";
import GridObleas from "./GridObleas";
import GridObleasReimpresion from "./GridObleasReimpresion";
import TabNavigation from "./TabNavigation";
import LogoutButton from "./LogoutButton";
import AdminPanelButton from "./AdminPanelButton";

import { useReimpresionObleas } from "../hooks/useReimpreciones";

import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function DashboardObleas() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [activeTab, setActiveTab] = useState<"obleas" | "reimpresiones">("obleas");

  // ✅ Reimpresiones desde DB
  const { reimpresiones } = useReimpresionObleas();
  const cantidadPendientes = (reimpresiones ?? []).filter((r) => r.Estado === "Pendiente").length;

  useEffect(() => {
    if (!user) navigate("/munismt", { replace: true });
  }, [user, navigate]);

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate("/munismt", { replace: true });
  };

  const handleClickNotificacion = () => {
    // si querés: al hacer click te lleva a pestaña reimpresiones
    if (cantidadPendientes > 0) setActiveTab("reimpresiones");
    else navigate("/admin-panel/dashboard");
  };



  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <header className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Sistema de Gestión de Obleas</h1>
              <p className="text-slate-400 text-sm mt-1">
                {user.Rol === "admin" ? "Panel de Administración" : `Usuario: ${user.Nombre}`}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-slate-300">{user.Nombre}</span>

              {user.Rol === "admin" && (
                <div className="relative">
                  <AdminPanelButton onClick={handleClickNotificacion} />
                  {cantidadPendientes > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                      {cantidadPendientes}
                    </span>
                  )}
                </div>
              )}

              <LogoutButton onClick={handleLogout} />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <FormularioOblea />

          <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

          {activeTab === "obleas" ? <GridObleas /> : <GridObleasReimpresion />}
        </div>
      </main>
    </div>
  );
}

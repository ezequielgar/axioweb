import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "../styles/swal-dark.css";

// Configuración de SweetAlert2 con tema dark
const swalDark = Swal.mixin({
  background: '#1e293b',
  color: '#e2e8f0',
  confirmButtonColor: '#3b82f6',
  cancelButtonColor: '#64748b',
  customClass: {
    popup: 'swal-dark-popup',
    title: 'swal-dark-title',
    htmlContainer: 'swal-dark-text',
    confirmButton: 'swal-dark-confirm',
    cancelButton: 'swal-dark-cancel',
  }
});
import AxioLogo from "./AxioLogo";
import LoginLoading from "./LoginLoading";
import { useAuth } from "../context/AuthContext";

export default function LoginObleas() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showLoading, setShowLoading] = useState(false);

  const navigate = useNavigate();
  const { login, user, loading } = useAuth();

  // ✅ si ya hay sesión, afuera del login (evita overlay/parpadeo)
  useEffect(() => {
    if (!loading && user) {
      navigate("/munismt/dashboard", { replace: true });
    }
  }, [loading, user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // 1. Validar login primero (SIN loader visible)
      await login(username.trim(), password);

      // 2. Si llegamos acá, el login fue exitoso.
      // Activamos el loader para la transición
      setShowLoading(true);

      // 3. Mantener loader visible por 2 segundos
      await new Promise(resolve => setTimeout(resolve, 2000));

      // 4. Navegar al dashboard
      navigate("/munismt/dashboard", { replace: true });
    } catch (e: any) {
      // Si hay error, el loader NUNCA se activó, así que simplemente mostramos la alerta
      swalDark.fire({
        icon: "error",
        title: "Login",
        text: e?.response?.data?.message ?? "Usuario o contraseña incorrectos",
      });
    }
  };

  if (showLoading) return <LoginLoading />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <AxioLogo size="md" className="mb-4 mx-auto" />
            <h1 className="text-3xl font-bold text-white mb-2">Sistema de Obleas</h1>
            <p className="text-slate-400">Ingrese sus credenciales</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Usuario</label>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white"
                placeholder="Ingrese su usuario"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white"
                placeholder="Ingrese su contraseña"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold py-3 rounded-lg"
            >
              Iniciar Sesión
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-700">
            <p className="text-xs text-slate-500 text-center">Sistema de gestión de obleas - Acceso restringido</p>
          </div>
        </div>
      </div>
    </div>
  );
}

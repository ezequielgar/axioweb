import { useObleas } from '../context/ObleasContext';
import { useNavigate } from 'react-router-dom';
import FormularioOblea from './FormularioOblea';
import GridObleas from './GridObleas';

export default function DashboardObleas() {
  const { usuario, logout } = useObleas();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/munismt');
  };

  if (!usuario) {
    navigate('/munismt');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Sistema de Gestión de Obleas</h1>
              <p className="text-slate-400 text-sm mt-1">
                {usuario.role === 'admin' ? 'Panel de Administración' : `Cliente: ${usuario.cliente}`}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-slate-300">
                {usuario.username}
              </span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Formulario para solicitar obleas */}
          <FormularioOblea />

          {/* Título del Grid */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">
              {usuario.role === 'admin' ? 'Todas las Solicitudes' : 'Mis Solicitudes'}
            </h2>
            <GridObleas />
          </div>
        </div>
      </main>
    </div>
  );
}

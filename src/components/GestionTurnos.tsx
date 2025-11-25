import { useState } from 'react';
import { usePersonal } from '../hooks/usePersonal';
import { useAsignaciones } from '../hooks/useAsignaciones';

const GestionTurnos = () => {
  const { obtenerPersonalActivo } = usePersonal();
  const { agregarAsignacion, eliminarAsignacion, obtenerAsignacionesConPersonal } = useAsignaciones();
  
  const [fechaSeleccionada, setFechaSeleccionada] = useState('');
  const [personalSeleccionado, setPersonalSeleccionado] = useState('');
  const [mesActual, setMesActual] = useState(new Date());

  const personalActivo = obtenerPersonalActivo();
  const todasAsignaciones = obtenerAsignacionesConPersonal();

  // Generar días del mes
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    // Días vacíos al inicio
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Días del mes
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const formatDate = (date: Date | null) => {
    if (!date) return '';
    return date.toISOString().split('T')[0];
  };

  const isToday = (date: Date | null) => {
    if (!date) return false;
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const handleAsignar = () => {
    if (!fechaSeleccionada || !personalSeleccionado) {
      alert('Selecciona una fecha y una persona');
      return;
    }

    agregarAsignacion(fechaSeleccionada, personalSeleccionado);
    setFechaSeleccionada('');
    setPersonalSeleccionado('');
  };

  const handleEliminarAsignacion = (fecha: string) => {
    if (confirm('¿Eliminar esta asignación?')) {
      eliminarAsignacion(fecha);
    }
  };

  const cambiarMes = (incremento: number) => {
    const nuevoMes = new Date(mesActual.getFullYear(), mesActual.getMonth() + incremento, 1);
    setMesActual(nuevoMes);
  };

  const days = getDaysInMonth(mesActual);
  const monthName = mesActual.toLocaleDateString('es-AR', { month: 'long', year: 'numeric' });

  // Obtener asignación para una fecha
  const getAsignacionPorFecha = (fecha: string) => {
    return todasAsignaciones.find(a => a.fecha === fecha);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Gestión de Turnos</h2>
        <p className="text-sm text-gray-600 mt-1">
          Asigna personal IT a días específicos del calendario
        </p>
      </div>

      {/* Formulario de Asignación Rápida */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Asignación Rápida</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="fecha" className="block text-sm font-medium text-gray-700 mb-1">
              Fecha
            </label>
            <input
              id="fecha"
              type="date"
              value={fechaSeleccionada}
              onChange={(e) => setFechaSeleccionada(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="personal" className="block text-sm font-medium text-gray-700 mb-1">
              Personal
            </label>
            <select
              id="personal"
              value={personalSeleccionado}
              onChange={(e) => setPersonalSeleccionado(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Seleccionar persona...</option>
              {personalActivo.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nombre} - {p.rol}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={handleAsignar}
              disabled={!fechaSeleccionada || !personalSeleccionado}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-2 px-4 rounded-lg font-medium transition"
            >
              Asignar Turno
            </button>
          </div>
        </div>

        {personalActivo.length === 0 && (
          <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              ⚠️ No hay personal activo. Primero agrega personas en la sección de Gestión de Personal.
            </p>
          </div>
        )}
      </div>

      {/* Calendario */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
        {/* Navegación de Mes */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => cambiarMes(-1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <h3 className="text-xl font-bold text-gray-900 capitalize">
            {monthName}
          </h3>
          
          <button
            onClick={() => cambiarMes(1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Encabezado de días */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map((day) => (
            <div key={day} className="text-center text-sm font-semibold text-gray-600 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Días del mes */}
        <div className="grid grid-cols-7 gap-2">
          {days.map((day, idx) => {
            if (!day) {
              return <div key={`empty-${idx}`} className="aspect-square" />;
            }

            const dateStr = formatDate(day);
            const asignacion = getAsignacionPorFecha(dateStr);

            return (
              <div
                key={idx}
                className={`
                  aspect-square p-2 rounded-lg border transition
                  ${isToday(day) ? 'ring-2 ring-blue-500' : ''}
                  ${asignacion ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'}
                `}
              >
                <div className="flex flex-col h-full">
                  <div className="text-sm font-semibold text-gray-900">
                    {day.getDate()}
                  </div>
                  
                  {asignacion && (
                    <div className="flex-1 mt-1">
                      <div className="text-xs leading-tight text-blue-900 font-medium mb-1">
                        {asignacion.personal.nombre.split(' ')[0]}
                      </div>
                      <button
                        onClick={() => handleEliminarAsignacion(dateStr)}
                        className="text-xs text-red-600 hover:text-red-700"
                        title="Eliminar asignación"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Lista de Asignaciones Próximas */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Próximas Asignaciones ({todasAsignaciones.length})
        </h3>
        
        {todasAsignaciones.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p>No hay asignaciones todavía</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {todasAsignaciones
              .sort((a, b) => a.fecha.localeCompare(b.fecha))
              .map((asignacion) => (
                <div
                  key={asignacion.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{asignacion.personal.nombre}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(asignacion.fecha + 'T00:00:00').toLocaleDateString('es-AR', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleEliminarAsignacion(asignacion.fecha)}
                    className="text-red-600 hover:text-red-700 p-2"
                    title="Eliminar"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GestionTurnos;

import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { usePersonal } from '../hooks/usePersonal';
import type { AsignacionConPersonal } from '../types/personal';
import {useTurnos} from "../hooks/useTurnos"
import Swal from "sweetalert2";


interface GuardiaModalProps {
  asignacion: AsignacionConPersonal;
  onClose: () => void;
}

const GuardiaModal = ({ asignacion, onClose }: GuardiaModalProps) => {
  
  const { personal } = asignacion;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative animate-fadeIn">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{personal.nombre}</h3>
              <p className="text-sm text-gray-500">{personal.rol}</p>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4 space-y-3">
            <div className="flex items-center space-x-3">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-gray-700">
                {new Date(asignacion.fecha + 'T00:00:00').toLocaleDateString('es-AR', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>

            <div className="flex items-center space-x-3">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span className="text-gray-700">{personal.telefono}</span>
            </div>
          </div>

          {personal.whatsapp && (
            <a
              href={personal.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition duration-200 transform hover:scale-105"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              <span>Contactar por WhatsApp</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
};


const Turnos = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { obtenerPersonalActivo } = usePersonal();
  const {turnos} = useTurnos()
  const normalizeYYYYMMDD = (value: string) => value.slice(0, 10);
  

  const [selectedAsignacion, setSelectedAsignacion] = useState<AsignacionConPersonal | null>(null);
  const [filtroPersona, setFiltroPersona] = useState<string>('');


  const personalActivo = obtenerPersonalActivo();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

const getTurnoPorFecha = (fecha: string) => {
  return turnos.find((t) => normalizeYYYYMMDD(t.Fecha) === fecha);
};


const getAsignacionDesdeTurno = (fecha: string) => {
  const turno = getTurnoPorFecha(fecha);
  if (!turno) return null;

  const persona = personalActivo.find((p) => p.nombre === turno.Usuario);
  if (!persona) return null;

  const asignacion: AsignacionConPersonal = {
    id: String(turno.IdTurno),
    fecha: normalizeYYYYMMDD(turno.Fecha),
    personalId: persona.id,
    createdAt: new Date().toISOString(),
    personal: persona,
  };

  return asignacion;
};




  const generateMonths = () => {
    const today = new Date();
    const months = [];
    
    for (let i = 0; i < 3; i++) {
      const date = new Date(today.getFullYear(), today.getMonth() + i, 1);
      months.push(date);
    }
    
    return months;
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const isToday = (date: Date | null) => {
    if (!date) return false;
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

const formatDate = (date: Date | null) => {
  if (!date) return '';
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};


  const months = generateMonths();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Turnos de Guardia IT</h1>
              <p className="text-sm text-gray-600 mt-1">Bienvenido, {user?.nombre}</p>
            </div>
            <div className="flex items-center space-x-4">
              {isAdmin && (
                <button
                  onClick={() => navigate('/admin')}
                  className="text-gray-600 hover:text-gray-900 transition flex items-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>Administrar</span>
                </button>
              )}
              <button
                onClick={() => navigate('/')}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition"
              >
                Volver al inicio
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <p className="text-gray-700 mb-4">
            Consulta rápidamente quién está de guardia en IT durante los próximos 3 meses.
          </p>
          
          <div className="flex items-center space-x-4">
            <label htmlFor="filtro-persona" className="text-sm font-medium text-gray-700">
              Filtrar por persona:
            </label>
            <select
              id="filtro-persona"
              value={filtroPersona}
              onChange={(e) => setFiltroPersona(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Todas las personas</option>
              {personalActivo.map((persona) => (
                <option key={persona.id} value={persona.nombre}>
                  {persona.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {months.map((month, idx) => {
            const days = getDaysInMonth(month);
            const monthName = month.toLocaleDateString('es-AR', { month: 'long', year: 'numeric' });
            
            return (
              <div key={idx} className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 capitalize text-center">
                  {monthName}
                </h2>
                
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map((day) => (
                    <div key={day} className="text-center text-xs font-semibold text-gray-600 py-2">
                      {day}
                    </div>
                  ))}
                </div>
                
                <div className="grid grid-cols-7 gap-1">
                  {days.map((day, dayIdx) => {
                    if (!day) {
                      return <div key={`empty-${dayIdx}`} className="aspect-square" />;
                    }
                    
                    const dateStr = formatDate(day);
                    const asignacion = getAsignacionDesdeTurno(dateStr);
                    const shouldShow = !filtroPersona || asignacion?.personal.nombre === filtroPersona;

                    
                    return (
                      <button
                        key={dayIdx}
                        onClick={() => asignacion && setSelectedAsignacion(asignacion)}
                        disabled={!asignacion}
                        className={`
                          aspect-square p-1 rounded-lg text-xs transition duration-200
                          ${isToday(day) ? 'ring-2 ring-blue-500' : ''}
                          ${asignacion && shouldShow
                            ? 'bg-blue-100 hover:bg-blue-200 cursor-pointer transform hover:scale-105'
                            : asignacion && !shouldShow
                            ? 'bg-gray-100 opacity-30'
                            : 'bg-gray-50 cursor-default'
                          }
                        `}
                      >
                        <div className="font-semibold text-gray-900">{day.getDate()}</div>
                        {asignacion && shouldShow && (
                          <div className="text-[10px] leading-tight text-gray-700 mt-1 truncate">
                            {asignacion.personal.nombre.split(' ')[0]}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {selectedAsignacion && (
        <GuardiaModal
          asignacion={selectedAsignacion}
          onClose={() => setSelectedAsignacion(null)}
        />
      )}
    </div>
  );
};

export default Turnos;

import { useState } from 'react';
import { useObleas } from '../context/ObleasContext';
import type { ObleaFormData } from '../types/obleas';

export default function FormularioOblea() {
  const { crearOblea, obleas, usuario } = useObleas();
  const [formData, setFormData] = useState<ObleaFormData>({
    dominio: '',
    formato: 'Interna',
    item: '',
    numeroOblea: '',
    reparticion: '',
    modeloVehiculo: '',
    ...(usuario?.role === 'admin' && { cliente: 'Municipalidad' })
  });
  const [mostrarExito, setMostrarExito] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Limpiar espacios en blanco y convertir a mayúsculas el dominio
    const dominioLimpio = formData.dominio.trim().replace(/\s+/g, '').toUpperCase();
    const itemLimpio = formData.item?.trim().replace(/\s+/g, '') || '';
    const numeroOblea = formData.numeroOblea?.trim() || '';
    const reparticionLimpia = formData.reparticion?.trim() || '';
    const modeloLimpio = formData.modeloVehiculo?.trim() || '';

    // Determinar el cliente para la validación
    const clienteParaValidar = usuario?.role === 'admin' ? formData.cliente : usuario?.cliente;

    // Validar duplicados por dominio para el mismo cliente
    const duplicado = obleas.find(oblea =>
      oblea.dominio === dominioLimpio &&
      oblea.cliente === clienteParaValidar &&
      oblea.estado !== 'Cancelada'
    );

    if (duplicado) {
      setError(`Ya existe una solicitud activa con el dominio/DNI "${dominioLimpio}" para ${clienteParaValidar} (ID: ${duplicado.id})`);
      return;
    }

    const dataToSubmit: ObleaFormData = {
      dominio: dominioLimpio,
      formato: formData.formato,
      ...(itemLimpio && { item: itemLimpio }),
      ...(numeroOblea && { numeroOblea: numeroOblea }),
      ...(reparticionLimpia && { reparticion: reparticionLimpia }),
      ...(modeloLimpio && { modeloVehiculo: modeloLimpio }),
      ...(usuario?.role === 'admin' && formData.cliente && { cliente: formData.cliente })
    };

    crearOblea(dataToSubmit);

    // Reset form
    setFormData({
      dominio: '',
      formato: 'Interna',
      item: '',
      numeroOblea: '',
      reparticion: '',
      modeloVehiculo: '',
      ...(usuario?.role === 'admin' && { cliente: 'Municipalidad' })
    });

    setMostrarExito(true);
    setTimeout(() => setMostrarExito(false), 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
      <h2 className="text-2xl font-bold text-white mb-6">Solicitar Nueva Oblea</h2>

      {mostrarExito && (
        <div className="mb-4 bg-green-500/10 border border-green-500/50 text-green-500 px-4 py-3 rounded-lg">
          ¡Oblea solicitada exitosamente!
        </div>
      )}

      {error && (
        <div className="mb-4 bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-lg flex items-start justify-between gap-3">
          <p className="flex-1">{error}</p>
          <button
            onClick={() => setError('')}
            className="text-red-400 hover:text-red-300 transition-colors flex-shrink-0"
            title="Cerrar"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {formData.formato === 'Tarjeta' && (
        <div className="mb-4 bg-blue-500/10 border border-blue-500/50 text-blue-400 px-4 py-3 rounded-lg flex items-start gap-3">
          <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div>
            <p className="font-semibold">Recordatorio para Tarjetas:</p>
            <p className="text-sm mt-1">Los DNI deben ingresarse sin puntos, solo números seguidos. Ejemplo: 12345678</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              {formData.formato === 'Tarjeta' ? 'DNI' : 'Dominio'} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="dominio"
              value={formData.dominio}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase"
              placeholder={formData.formato === 'Tarjeta' ? '12345678' : 'ABC123'}
              required
            />
            {formData.formato === 'Tarjeta' && (
              <p className="text-xs text-slate-400 mt-1">Sin puntos ni espacios</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Formato <span className="text-red-500">*</span>
            </label>
            <select
              name="formato"
              value={formData.formato}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="Interna">Interna</option>
              <option value="Externa">Externa</option>
              <option value="Tarjeta">Tarjeta</option>
            </select>
          </div>

          {usuario?.role === 'admin' && (
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Cliente <span className="text-red-500">*</span>
              </label>
              <select
                name="cliente"
                value={formData.cliente || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="Municipalidad">Municipalidad</option>
                <option value="Geogas">Geogas</option>
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Item
            </label>
            <input
              type="text"
              name="item"
              value={formData.item}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Número de item"
            />
          </div>

          {usuario?.role === 'admin' && (
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Nro de Oblea
              </label>
              <input
                type="text"
                name="numeroOblea"
                value={formData.numeroOblea}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                placeholder="Ej: 1001350109"
              />
              <p className="text-slate-500 text-xs mt-1">
                Número que leerá la pistola escáner (opcional)
              </p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Repartición
            </label>
            <input
              type="text"
              name="reparticion"
              value={formData.reparticion}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nombre de repartición"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Modelo/Vehículo
            </label>
            <input
              type="text"
              name="modeloVehiculo"
              value={formData.modeloVehiculo}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ej: Ford Ranger 2023"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          Solicitar Oblea
        </button>
      </form>
    </div>
  );
}

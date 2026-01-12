import { useState } from 'react';
import { useObleas } from '../context/ObleasContext';
import { ObleaFormData, FormatoOblea } from '../types/obleas';

export default function FormularioOblea() {
  const { crearOblea } = useObleas();
  const [formData, setFormData] = useState<ObleaFormData>({
    dominio: '',
    formato: 'Interna',
    item: '',
    reparticion: '',
    modeloVehiculo: ''
  });
  const [mostrarExito, setMostrarExito] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const dataToSubmit: ObleaFormData = {
      dominio: formData.dominio.toUpperCase(),
      formato: formData.formato,
      ...(formData.item && { item: formData.item }),
      ...(formData.reparticion && { reparticion: formData.reparticion }),
      ...(formData.modeloVehiculo && { modeloVehiculo: formData.modeloVehiculo })
    };

    crearOblea(dataToSubmit);
    
    // Reset form
    setFormData({
      dominio: '',
      formato: 'Interna',
      item: '',
      reparticion: '',
      modeloVehiculo: ''
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

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Dominio <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="dominio"
              value={formData.dominio}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase"
              placeholder="ABC123"
              required
            />
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

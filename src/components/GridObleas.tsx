import { useState } from 'react';
import { useObleas } from '../context/ObleasContext';
import { Oblea, EstadoOblea, ClienteType } from '../types/obleas';
import * as XLSX from 'xlsx';

export default function GridObleas() {
  const { obleas, usuario, actualizarEstado, filtrarObleas } = useObleas();
  const [seleccionadas, setSeleccionadas] = useState<string[]>([]);
  const [filtroEstado, setFiltroEstado] = useState<EstadoOblea | ''>('');
  const [filtroCliente, setFiltroCliente] = useState<ClienteType | ''>('');
  const [mostrarPopupExportar, setMostrarPopupExportar] = useState(false);
  const [emailDestino, setEmailDestino] = useState('');

  const obleasFiltradas = filtrarObleas(
    filtroEstado || undefined,
    filtroCliente || undefined
  ).filter(oblea => {
    // Si es cliente, solo ver sus propias obleas
    if (usuario?.role === 'cliente') {
      return oblea.cliente === usuario.cliente;
    }
    return true;
  });

  const toggleSeleccion = (id: string) => {
    setSeleccionadas(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleTodas = () => {
    if (seleccionadas.length === obleasFiltradas.length) {
      setSeleccionadas([]);
    } else {
      setSeleccionadas(obleasFiltradas.map(o => o.id));
    }
  };

  const cambiarEstado = (nuevoEstado: EstadoOblea) => {
    if (seleccionadas.length === 0) {
      alert('Seleccione al menos una oblea');
      return;
    }

    actualizarEstado(seleccionadas, nuevoEstado);

    if (nuevoEstado === 'Creada' && usuario?.role === 'admin') {
      setMostrarPopupExportar(true);
    } else {
      setSeleccionadas([]);
    }
  };

  const exportarAExcel = (obleas: Oblea[]) => {
    const data = obleas.map(oblea => ({
      'ID': oblea.id,
      'Dominio': oblea.dominio,
      'Formato': oblea.formato,
      'Item': oblea.item || '-',
      'Repartición': oblea.reparticion || '-',
      'Modelo/Vehículo': oblea.modeloVehiculo || '-',
      'Estado': oblea.estado,
      'Cliente': oblea.cliente,
      'Fecha Pedido': new Date(oblea.fechaPedido).toLocaleString('es-AR'),
      'Fecha Creación': oblea.fechaCreacion ? new Date(oblea.fechaCreacion).toLocaleString('es-AR') : '-',
      'Creada Por': oblea.creadaPor || '-'
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Obleas');

    // Ajustar ancho de columnas
    const colWidths = [
      { wch: 15 }, // ID
      { wch: 12 }, // Dominio
      { wch: 10 }, // Formato
      { wch: 10 }, // Item
      { wch: 20 }, // Repartición
      { wch: 20 }, // Modelo/Vehículo
      { wch: 10 }, // Estado
      { wch: 15 }, // Cliente
      { wch: 20 }, // Fecha Pedido
      { wch: 20 }, // Fecha Creación
      { wch: 15 }  // Creada Por
    ];
    ws['!cols'] = colWidths;

    XLSX.writeFile(wb, `obleas_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const handleExportarYEnviar = () => {
    const obleasExportar = obleas.filter(o => seleccionadas.includes(o.id));
    exportarAExcel(obleasExportar);

    if (emailDestino) {
      // Simulación de envío de email
      alert(`Email enviado a: ${emailDestino}\n\nContenido: Se han creado ${obleasExportar.length} obleas nuevas.\n\n(En producción, aquí se enviaría el email con el archivo Excel adjunto)`);
    }

    setMostrarPopupExportar(false);
    setSeleccionadas([]);
    setEmailDestino('');
  };

  const getEstadoColor = (estado: EstadoOblea) => {
    switch (estado) {
      case 'Pendiente': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'Creada': return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'Cancelada': return 'bg-red-500/20 text-red-400 border-red-500/50';
    }
  };

  return (
    <div className="space-y-4">
      {/* Filtros */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Filtrar por Estado
            </label>
            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value as EstadoOblea | '')}
              className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos los estados</option>
              <option value="Pendiente">Pendientes</option>
              <option value="Creada">Creadas</option>
              <option value="Cancelada">Canceladas</option>
            </select>
          </div>

          {usuario?.role === 'admin' && (
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Filtrar por Cliente
              </label>
              <select
                value={filtroCliente}
                onChange={(e) => setFiltroCliente(e.target.value as ClienteType | '')}
                className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todos los clientes</option>
                <option value="Municipalidad">Municipalidad</option>
                <option value="Geogas">Geogas</option>
              </select>
            </div>
          )}

          <div className="flex items-end">
            <button
              onClick={() => exportarAExcel(obleasFiltradas)}
              className="w-full px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
            >
              Exportar Vista Actual
            </button>
          </div>
        </div>
      </div>

      {/* Acciones */}
      {seleccionadas.length > 0 && (
        <div className="bg-blue-500/10 border border-blue-500/50 rounded-xl p-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <span className="text-blue-400 font-medium">
              {seleccionadas.length} oblea(s) seleccionada(s)
            </span>
            <div className="flex gap-2 flex-wrap">
              {usuario?.role === 'admin' && (
                <button
                  onClick={() => cambiarEstado('Creada')}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                >
                  Marcar como Creadas
                </button>
              )}
              <button
                onClick={() => cambiarEstado('Cancelada')}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Grid */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-700/50">
              <tr>
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={seleccionadas.length === obleasFiltradas.length && obleasFiltradas.length > 0}
                    onChange={toggleTodas}
                    className="w-4 h-4 text-blue-600 bg-slate-700 border-slate-600 rounded focus:ring-blue-500"
                  />
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">ID</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">Dominio</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">Formato</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">Item</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">Repartición</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">Modelo</th>
                {usuario?.role === 'admin' && (
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">Cliente</th>
                )}
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">Estado</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">Fecha Pedido</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">Fecha Creación</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {obleasFiltradas.length === 0 ? (
                <tr>
                  <td colSpan={usuario?.role === 'admin' ? 11 : 10} className="px-4 py-8 text-center text-slate-400">
                    No hay obleas para mostrar
                  </td>
                </tr>
              ) : (
                obleasFiltradas.map((oblea) => (
                  <tr key={oblea.id} className="hover:bg-slate-700/30 transition-colors">
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={seleccionadas.includes(oblea.id)}
                        onChange={() => toggleSeleccion(oblea.id)}
                        className="w-4 h-4 text-blue-600 bg-slate-700 border-slate-600 rounded focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-300 font-mono">{oblea.id}</td>
                    <td className="px-4 py-3 text-sm text-white font-semibold">{oblea.dominio}</td>
                    <td className="px-4 py-3 text-sm text-slate-300">{oblea.formato}</td>
                    <td className="px-4 py-3 text-sm text-slate-300">{oblea.item || '-'}</td>
                    <td className="px-4 py-3 text-sm text-slate-300">{oblea.reparticion || '-'}</td>
                    <td className="px-4 py-3 text-sm text-slate-300">{oblea.modeloVehiculo || '-'}</td>
                    {usuario?.role === 'admin' && (
                      <td className="px-4 py-3 text-sm text-slate-300">{oblea.cliente}</td>
                    )}
                    <td className="px-4 py-3">
                      <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full border ${getEstadoColor(oblea.estado)}`}>
                        {oblea.estado}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-300">
                      {new Date(oblea.fechaPedido).toLocaleString('es-AR')}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-300">
                      {oblea.fechaCreacion ? new Date(oblea.fechaCreacion).toLocaleString('es-AR') : '-'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Popup de Exportar */}
      {mostrarPopupExportar && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-white mb-4">Exportar y Notificar</h3>
            
            <p className="text-slate-300 mb-4">
              Se han marcado {seleccionadas.length} oblea(s) como creadas.
            </p>

            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Email de notificación (opcional)
              </label>
              <input
                type="email"
                value={emailDestino}
                onChange={(e) => setEmailDestino(e.target.value)}
                className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="ejemplo@email.com"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleExportarYEnviar}
                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-2 rounded-lg transition-all"
              >
                Exportar Excel
              </button>
              <button
                onClick={() => {
                  setMostrarPopupExportar(false);
                  setSeleccionadas([]);
                  setEmailDestino('');
                }}
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2 rounded-lg transition-all"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

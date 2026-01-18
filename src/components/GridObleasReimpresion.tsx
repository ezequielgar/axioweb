import { useState } from 'react';
import { useObleas } from '../context/ObleasContext';
import { useReimpresiones } from '../context/ReimpresionesContext';
import RequestButton from './RequestButton';
import type { Oblea, EstadoOblea, ClienteType } from '../types/obleas';
import * as XLSX from 'xlsx';

export default function GridObleasReimpresion() {
    const { usuario } = useObleas();
    const { obleasReimpresion, actualizarEstadoObleaReimpresion, eliminarObleaReimpresion } = useReimpresiones();
    const [seleccionadas, setSeleccionadas] = useState<string[]>([]);
    const [filtroEstado, setFiltroEstado] = useState<EstadoOblea | ''>('');
    const [filtroCliente, setFiltroCliente] = useState<ClienteType | ''>('');
    const [obleaSeleccionadaAcciones, setObleaSeleccionadaAcciones] = useState<Oblea | null>(null);

    const obleasFiltradas = obleasReimpresion.filter(oblea => {
        // Filtro por estado
        if (filtroEstado && oblea.estado !== filtroEstado) return false;

        // Filtro por cliente (solo admin)
        if (filtroCliente && oblea.cliente !== filtroCliente) return false;

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

    const exportarAExcel = () => {
        // Exportación inteligente: seleccionadas o vista actual
        const obleasExport = seleccionadas.length > 0
            ? obleasReimpresion.filter(o => seleccionadas.includes(o.id))
            : obleasFiltradas;

        const data = obleasExport.map(oblea => ({
            'Nro de Oblea': oblea.numeroOblea || oblea.id,
            'Dominio': oblea.dominio,
            'Formato': oblea.formato,
            'Item': oblea.item || '-',
            'Repartición': oblea.reparticion || '-',
            'Modelo/Vehículo': oblea.modeloVehiculo || '-',
            'Estado': oblea.estado,
            'Cliente': oblea.cliente,
            'Fecha Pedido': new Date(oblea.fechaPedido).toLocaleString('es-AR'),
            'Fecha Creación': oblea.fechaCreacion ? new Date(oblea.fechaCreacion).toLocaleString('es-AR') : '-',
            'Fecha Entrega': oblea.fechaEntrega ? new Date(oblea.fechaEntrega).toLocaleString('es-AR') : '-',
            'Creada Por': oblea.creadaPor || '-'
        }));

        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Reimpresiones');

        const fecha = new Date().toISOString().split('T')[0];
        XLSX.writeFile(wb, `reimpresiones_${fecha}.xlsx`);

        // Limpiar selección después de exportar
        if (seleccionadas.length > 0) {
            setSeleccionadas([]);
        }
    };

    const cambiarEstadoIndividual = (id: string, nuevoEstado: EstadoOblea) => {
        actualizarEstadoObleaReimpresion(id, nuevoEstado);
        setObleaSeleccionadaAcciones(null);
    };

    const confirmarEliminar = (id: string, dominio: string) => {
        if (confirm(`¿Eliminar oblea de reimpresión ${dominio}?`)) {
            eliminarObleaReimpresion(id);
            setObleaSeleccionadaAcciones(null);
        }
    };

    const getEstadoColor = (estado: EstadoOblea) => {
        switch (estado) {
            case 'Pendiente': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50';
            case 'Creada': return 'bg-green-500/20 text-green-300 border-green-500/50';
            case 'Entregada': return 'bg-blue-500/20 text-blue-300 border-blue-500/50';
            case 'Cancelada': return 'bg-red-500/20 text-red-300 border-red-500/50';
            default: return 'bg-gray-500/20 text-gray-300 border-gray-500/50';
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
                            <option value="Entregada">Entregadas</option>
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
                            onClick={exportarAExcel}
                            className="w-full px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                        >
                            {seleccionadas.length > 0
                                ? `Exportar Seleccionadas (${seleccionadas.length})`
                                : 'Exportar Vista Actual'}
                        </button>
                    </div>
                </div>
            </div>

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
                                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">Nro de Oblea</th>
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
                                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">Fecha Entrega</th>
                                {usuario?.role === 'admin' && (
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">Acciones</th>
                                )}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700">
                            {obleasFiltradas.length === 0 ? (
                                <tr>
                                    <td colSpan={usuario?.role === 'admin' ? 13 : 11} className="px-4 py-8 text-center text-slate-400">
                                        No hay obleas de reimpresión
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
                                        <td className="px-4 py-3 text-sm text-slate-300 font-mono">{oblea.numeroOblea || oblea.id}</td>
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
                                        <td className="px-4 py-3 text-sm text-slate-300">
                                            {oblea.fechaEntrega ? new Date(oblea.fechaEntrega).toLocaleString('es-AR') : '-'}
                                        </td>
                                        {usuario?.role === 'admin' && (
                                            <td className="px-4 py-3">
                                                <RequestButton
                                                    onClick={() => setObleaSeleccionadaAcciones(oblea)}
                                                    text="EDITAR"
                                                    variant="blue"
                                                    size="small"
                                                />
                                            </td>
                                        )}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal de Acciones */}
            {obleaSeleccionadaAcciones && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 max-w-md w-full">
                        <h3 className="text-xl font-bold text-white mb-2">Acciones de Oblea</h3>

                        <p className="text-slate-400 text-sm mb-6">
                            Dominio: <span className="text-white font-semibold">{obleaSeleccionadaAcciones.dominio}</span>
                            <br />
                            Nro de Oblea: <span className="text-white font-mono text-xs">{obleaSeleccionadaAcciones.numeroOblea || obleaSeleccionadaAcciones.id}</span>
                        </p>

                        <div className="space-y-2">
                            <button
                                onClick={() => cambiarEstadoIndividual(obleaSeleccionadaAcciones.id, 'Pendiente')}
                                className="w-full px-4 py-3 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400 rounded-lg transition-colors flex items-center gap-3"
                            >
                                <span className="w-3 h-3 bg-yellow-400 rounded-full" />
                                Cambiar a Pendiente
                            </button>

                            <button
                                onClick={() => cambiarEstadoIndividual(obleaSeleccionadaAcciones.id, 'Creada')}
                                className="w-full px-4 py-3 bg-green-500/10 hover:bg-green-500/20 text-green-400 rounded-lg transition-colors flex items-center gap-3"
                            >
                                <span className="w-3 h-3 bg-green-400 rounded-full" />
                                Cambiar a Creada
                            </button>

                            <button
                                onClick={() => cambiarEstadoIndividual(obleaSeleccionadaAcciones.id, 'Entregada')}
                                className="w-full px-4 py-3 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg transition-colors flex items-center gap-3"
                            >
                                <span className="w-3 h-3 bg-blue-400 rounded-full" />
                                Cambiar a Entregada
                            </button>

                            <button
                                onClick={() => cambiarEstadoIndividual(obleaSeleccionadaAcciones.id, 'Cancelada')}
                                className="w-full px-4 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors flex items-center gap-3"
                            >
                                <span className="w-3 h-3 bg-red-400 rounded-full" />
                                Cambiar a Cancelada
                            </button>

                            <div className="border-t border-slate-600 my-3" />

                            <button
                                onClick={() => confirmarEliminar(obleaSeleccionadaAcciones.id, obleaSeleccionadaAcciones.dominio)}
                                className="w-full px-4 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors flex items-center gap-3"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Eliminar
                            </button>

                            <button
                                onClick={() => setObleaSeleccionadaAcciones(null)}
                                className="w-full px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors mt-3"
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

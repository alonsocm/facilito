import React, { useMemo } from 'react';
import { X, TrendingUp, DollarSign, ShoppingBag, Calendar } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { usePosStore } from '../store/usePosStore';

export const Dashboard = ({ cerrarModal }) => {
    const { ventas } = usePosStore();

    // --- 1. LÓGICA DE DATOS (ESTADÍSTICAS) ---
    const datosProcesados = useMemo(() => {
        const hoy = new Date().toLocaleDateString('es-MX');

        // A. Venta de Hoy
        const ventasHoy = ventas.filter(v => v.fecha === hoy);
        const totalHoy = ventasHoy.reduce((acc, v) => acc + v.total, 0);
        const ticketsHoy = ventasHoy.length;

        // B. Producto Más Vendido (Histórico)
        const conteoProductos = {};
        ventas.forEach(venta => {
            venta.detalle.forEach(item => {
                if (conteoProductos[item.nombre]) {
                    conteoProductos[item.nombre] += item.cantidad;
                } else {
                    conteoProductos[item.nombre] = item.cantidad;
                }
            });
        });

        // Ordenar para encontrar el ganador
        const productoEstrella = Object.entries(conteoProductos)
            .sort((a, b) => b[1] - a[1])[0]; // [Nombre, Cantidad]

        // C. Datos para la Gráfica (Últimos 7 días)
        const ultimos7Dias = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const fechaStr = d.toLocaleDateString('es-MX');

            const totalDia = ventas
                .filter(v => v.fecha === fechaStr)
                .reduce((acc, v) => acc + v.total, 0);

            // Guardamos formato corto para la gráfica (ej: "Lun 12")
            const nombreDia = d.toLocaleDateString('es-MX', { weekday: 'short', day: 'numeric' });

            ultimos7Dias.push({ name: nombreDia, venta: totalDia });
        }

        return { totalHoy, ticketsHoy, productoEstrella, ultimos7Dias };
    }, [ventas]);

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gray-100 rounded-3xl shadow-2xl w-full max-w-5xl h-[90vh] overflow-y-auto animate-fade-in relative flex flex-col">

                {/* HEADER */}
                <div className="bg-facilito-azul p-6 text-white flex justify-between items-center sticky top-0 z-10 shadow-md">
                    <div>
                        <h2 className="text-2xl font-black flex items-center gap-2">
                            <TrendingUp /> REPORTE GERENCIAL
                        </h2>
                        <p className="text-blue-200 text-sm">Resumen de rendimiento en tiempo real</p>
                    </div>
                    <button onClick={cerrarModal} className="bg-white/20 p-2 rounded-full hover:bg-white/40 transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* CONTENIDO */}
                <div className="p-6 space-y-6">

                    {/* TARJETAS DE RESUMEN (KPIs) */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                        {/* 1. CAJA DE HOY */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border-l-8 border-facilito-verde flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 font-bold text-xs uppercase tracking-wider">Ventas de Hoy</p>
                                <h3 className="text-4xl font-black text-facilito-negro mt-1">
                                    ${datosProcesados.totalHoy.toFixed(2)}
                                </h3>
                                <p className="text-sm text-gray-500 mt-2 font-medium">
                                    {datosProcesados.ticketsHoy} tickets cobrados
                                </p>
                            </div>
                            <div className="bg-green-100 p-4 rounded-full text-green-600">
                                <DollarSign size={32} />
                            </div>
                        </div>

                        {/* 2. PRODUCTO ESTRELLA */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border-l-8 border-orange-400 flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 font-bold text-xs uppercase tracking-wider">Producto Estrella</p>
                                <h3 className="text-2xl font-black text-facilito-negro mt-1 truncate max-w-[180px]" title={datosProcesados.productoEstrella?.[0]}>
                                    {datosProcesados.productoEstrella ? datosProcesados.productoEstrella[0] : '---'}
                                </h3>
                                <p className="text-sm text-gray-500 mt-2 font-medium">
                                    {datosProcesados.productoEstrella ? `${datosProcesados.productoEstrella[1]} unidades vendidas` : 'Sin datos'}
                                </p>
                            </div>
                            <div className="bg-orange-100 p-4 rounded-full text-orange-500">
                                <ShoppingBag size={32} />
                            </div>
                        </div>

                        {/* 3. META / INFO (Relleno visual) */}
                        <div className="bg-facilito-azul p-6 rounded-2xl shadow-sm flex flex-col justify-center text-white relative overflow-hidden">
                            <div className="relative z-10">
                                <p className="text-blue-200 font-bold text-xs uppercase tracking-wider">Estado del Sistema</p>
                                <h3 className="text-xl font-bold mt-1">En Línea 🟢</h3>
                                <p className="text-xs text-blue-300 mt-2">Sincronizado con Firebase Cloud</p>
                            </div>
                            <TrendingUp className="absolute -bottom-4 -right-4 text-white/10 w-32 h-32" />
                        </div>
                    </div>

                    {/* GRÁFICA DE VENTAS SEMANAL */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm h-96 flex flex-col">
                        <h3 className="text-lg font-bold text-gray-700 mb-6 flex items-center gap-2">
                            <Calendar size={20} className="text-gray-400" />
                            Historial Últimos 7 Días
                        </h3>

                        <div className="flex-1 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={datosProcesados.ultimos7Dias} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <XAxis
                                        dataKey="name"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#9ca3af', fontSize: 12 }}
                                        dy={10}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#9ca3af', fontSize: 12 }}
                                    />
                                    <Tooltip
                                        cursor={{ fill: '#f3f4f6' }}
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                                    />
                                    <Bar dataKey="venta" radius={[6, 6, 0, 0]} barSize={40}>
                                        {datosProcesados.ultimos7Dias.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.venta > 0 ? '#1e3a8a' : '#e5e7eb'} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* TABLA RÁPIDA DE ÚLTIMAS VENTAS (Opcional) */}
                    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                        <div className="p-4 border-b border-gray-100 font-bold text-gray-700">
                            Últimas 5 Transacciones
                        </div>
                        <table className="w-full text-sm text-left text-gray-500">
                            <thead className="bg-gray-50 text-xs uppercase text-gray-700">
                                <tr>
                                    <th className="px-6 py-3">Hora</th>
                                    <th className="px-6 py-3">Total</th>
                                    <th className="px-6 py-3">Arts.</th>
                                </tr>
                            </thead>
                            <tbody>
                                {ventas.slice(0, 5).map((v) => (
                                    <tr key={v.id} className="border-b hover:bg-gray-50">
                                        <td className="px-6 py-3 font-medium text-gray-900">{v.hora}</td>
                                        <td className="px-6 py-3 text-green-600 font-bold">${v.total.toFixed(2)}</td>
                                        <td className="px-6 py-3">{v.articulos}</td>
                                    </tr>
                                ))}
                                {ventas.length === 0 && (
                                    <tr>
                                        <td colSpan="3" className="px-6 py-4 text-center">Sin ventas registradas hoy</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                </div>
            </div>
        </div>
    );
};
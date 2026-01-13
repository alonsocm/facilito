import React, { useMemo } from 'react';
import { X, TrendingUp, DollarSign, ShoppingBag, Calendar, PieChart } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { usePosStore } from '../store/usePosStore';

export const Dashboard = ({ cerrarModal }) => {
    // Ahora traemos también los 'productos' para consultar sus costos
    const { ventas, productos } = usePosStore();

    // --- LÓGICA DE DATOS (KPIs) ---
    const datosProcesados = useMemo(() => {
        const hoy = new Date().toLocaleDateString('es-MX');

        // A. Filtrar ventas de HOY
        const ventasHoy = ventas.filter(v => v.fecha === hoy);

        // B. Calcular Totales y UTILIDAD
        let ventaTotal = 0;
        let costoTotal = 0;
        let itemsVendidos = 0;

        ventasHoy.forEach(venta => {
            ventaTotal += venta.total;

            venta.detalle.forEach(item => {
                itemsVendidos += item.cantidad;

                // Buscamos el producto en el catálogo para saber su COSTO actual
                // (Nota: Idealmente el costo debería guardarse en el momento de la venta, 
                // pero para este MVP lo buscamos en tiempo real).
                const productoOriginal = productos.find(p => p.id === item.id);
                const costoUnitario = productoOriginal ? Number(productoOriginal.costo) : 0;

                costoTotal += (costoUnitario * item.cantidad);
            });
        });

        const utilidad = ventaTotal - costoTotal;
        const margen = ventaTotal > 0 ? ((utilidad / ventaTotal) * 100) : 0;

        // C. Producto Más Vendido
        const conteoProductos = {};
        ventas.forEach(venta => {
            venta.detalle.forEach(item => {
                conteoProductos[item.nombre] = (conteoProductos[item.nombre] || 0) + item.cantidad;
            });
        });
        const productoEstrella = Object.entries(conteoProductos).sort((a, b) => b[1] - a[1])[0];

        // D. Datos Gráfica (7 días)
        const ultimos7Dias = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const fechaStr = d.toLocaleDateString('es-MX');

            const ventasDia = ventas.filter(v => v.fecha === fechaStr);
            const totalDia = ventasDia.reduce((acc, v) => acc + v.total, 0);
            const nombreDia = d.toLocaleDateString('es-MX', { weekday: 'short', day: 'numeric' });

            ultimos7Dias.push({ name: nombreDia, venta: totalDia });
        }

        return {
            ventaTotal,
            utilidad,
            margen,
            ticketsHoy: ventasHoy.length,
            productoEstrella,
            ultimos7Dias
        };
    }, [ventas, productos]);

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gray-100 rounded-3xl shadow-2xl w-full max-w-5xl h-[90vh] overflow-y-auto animate-fade-in relative flex flex-col">

                {/* HEADER */}
                <div className="bg-facilito-azul p-6 text-white flex justify-between items-center sticky top-0 z-10 shadow-md">
                    <div>
                        <h2 className="text-2xl font-black flex items-center gap-2">
                            <TrendingUp /> REPORTE FINANCIERO
                        </h2>
                        <p className="text-blue-200 text-sm">Análisis de rentabilidad y ventas</p>
                    </div>
                    <button onClick={cerrarModal} className="bg-white/20 p-2 rounded-full hover:bg-white/40 transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* CONTENIDO */}
                <div className="p-6 space-y-6">

                    {/* TARJETAS DE KPIs (Ahora son 3 principales) */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                        {/* 1. VENTAS BRUTAS */}
                        <div className="bg-white p-5 rounded-2xl shadow-sm border-l-8 border-blue-500 relative overflow-hidden">
                            <div className="relative z-10">
                                <p className="text-gray-400 font-bold text-xs uppercase tracking-wider">Ventas de Hoy</p>
                                <h3 className="text-3xl font-black text-facilito-negro mt-1">
                                    ${datosProcesados.ventaTotal.toFixed(2)}
                                </h3>
                                <p className="text-sm text-gray-500 mt-1">
                                    {datosProcesados.ticketsHoy} transacciones
                                </p>
                            </div>
                            <DollarSign className="absolute -bottom-4 -right-4 text-blue-50 w-24 h-24" />
                        </div>

                        {/* 2. UTILIDAD (NUEVO) */}
                        <div className="bg-white p-5 rounded-2xl shadow-sm border-l-8 border-facilito-verde relative overflow-hidden">
                            <div className="relative z-10">
                                <p className="text-gray-400 font-bold text-xs uppercase tracking-wider">Utilidad Neta</p>
                                <h3 className="text-3xl font-black text-green-600 mt-1">
                                    ${datosProcesados.utilidad.toFixed(2)}
                                </h3>
                                <div className="inline-block mt-2 px-2 py-0.5 bg-green-100 text-green-700 rounded-lg text-xs font-bold">
                                    Margen: {datosProcesados.margen.toFixed(1)}%
                                </div>
                            </div>
                            <PieChart className="absolute -bottom-4 -right-4 text-green-50 w-24 h-24" />
                        </div>

                        {/* 3. PRODUCTO ESTRELLA */}
                        <div className="bg-white p-5 rounded-2xl shadow-sm border-l-8 border-orange-400 relative overflow-hidden">
                            <div className="relative z-10">
                                <p className="text-gray-400 font-bold text-xs uppercase tracking-wider">Más Vendido</p>
                                <h3 className="text-2xl font-black text-facilito-negro mt-1 truncate" title={datosProcesados.productoEstrella?.[0]}>
                                    {datosProcesados.productoEstrella ? datosProcesados.productoEstrella[0] : '---'}
                                </h3>
                                <p className="text-sm text-gray-500 mt-1">
                                    {datosProcesados.productoEstrella ? `${datosProcesados.productoEstrella[1]} unidades` : 'Sin datos'}
                                </p>
                            </div>
                            <ShoppingBag className="absolute -bottom-4 -right-4 text-orange-50 w-24 h-24" />
                        </div>

                    </div>

                    {/* SECCIÓN INFERIOR: GRÁFICA Y DETALLES */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        {/* GRÁFICA (Ocupa 2/3) */}
                        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm h-80 flex flex-col">
                            <h3 className="text-lg font-bold text-gray-700 mb-4 flex items-center gap-2">
                                <Calendar size={20} className="text-gray-400" />
                                Comportamiento Semanal
                            </h3>
                            <div className="flex-1 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={datosProcesados.ultimos7Dias}>
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} dy={10} />
                                        <Tooltip
                                            cursor={{ fill: '#f3f4f6' }}
                                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                                            formatter={(value) => [`$${value}`, 'Venta']}
                                        />
                                        <Bar dataKey="venta" radius={[4, 4, 0, 0]} barSize={40}>
                                            {datosProcesados.ultimos7Dias.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.venta > 0 ? '#1e3a8a' : '#e5e7eb'} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* AVISOS / ESTADO (Ocupa 1/3) */}
                        <div className="bg-facilito-azul p-6 rounded-2xl shadow-sm text-white flex flex-col justify-between relative overflow-hidden">
                            <div className="relative z-10 space-y-4">
                                <div>
                                    <h4 className="font-bold opacity-50 text-sm uppercase">Caja Actual</h4>
                                    <p className="text-3xl font-black tracking-tight text-white">Abierta</p>
                                </div>
                                <div>
                                    <h4 className="font-bold opacity-50 text-sm uppercase">Stock Bajo</h4>
                                    <p className="text-xl font-bold">
                                        {productos.filter(p => p.stock <= 5).length} Productos
                                    </p>
                                    <p className="text-xs opacity-60">Requieren reabastecimiento</p>
                                </div>
                            </div>
                            <div className="mt-4 pt-4 border-t border-white/10 relative z-10">
                                <p className="text-xs text-center opacity-40">Sistema Facilito v1.0</p>
                            </div>
                            {/* Decoración de fondo */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                            <div className="absolute bottom-0 left-0 w-24 h-24 bg-facilito-verde/20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};
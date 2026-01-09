import React from 'react';
import { X, DollarSign, Calendar } from 'lucide-react';

export const ModalCorte = ({ ventas, cerrarModal }) => {
    // Calculamos el total sumando todas las ventas
    const totalDia = ventas.reduce((acc, venta) => acc + venta.total, 0);

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-bounce-in">

                {/* Cabecera Azul */}
                <div className="bg-facilito-azul p-6 flex justify-between items-center text-white">
                    <div className="flex items-center gap-3">
                        <Calendar size={32} />
                        <div>
                            <h2 className="text-2xl font-bold">Corte de Caja</h2>
                            <p className="text-sm opacity-80">Resumen de ventas de hoy</p>
                        </div>
                    </div>
                    <button onClick={cerrarModal} className="bg-white/20 p-2 rounded-full hover:bg-white/40">
                        <X size={28} />
                    </button>
                </div>

                <div className="p-6">
                    {/* Tarjeta de TOTAL GIGANTE */}
                    <div className="bg-green-50 border-4 border-green-200 rounded-2xl p-6 text-center mb-8 shadow-sm">
                        <p className="text-gray-600 font-bold text-xl uppercase mb-2">Dinero Total en Caja</p>
                        <div className="flex justify-center items-center text-facilito-verde">
                            <DollarSign size={48} strokeWidth={3} />
                            <span className="text-6xl font-black">{totalDia.toFixed(2)}</span>
                        </div>
                        <p className="text-gray-400 mt-2 font-medium">{ventas.length} ventas realizadas</p>
                    </div>

                    {/* Lista de Movimientos */}
                    <h3 className="text-lg font-bold text-gray-700 mb-4 border-b pb-2">Historial de Ventas</h3>

                    <div className="h-64 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                        {ventas.length === 0 ? (
                            <p className="text-center text-gray-400 py-10 italic">Aún no hay ventas registradas hoy.</p>
                        ) : (
                            ventas.map((venta) => (
                                <div key={venta.id} className="flex justify-between items-center bg-gray-50 p-4 rounded-xl border border-gray-100 hover:bg-gray-100 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <span className="bg-facilito-azul text-white font-bold px-3 py-1 rounded-lg text-sm">
                                            {venta.hora}
                                        </span>
                                        <span className="text-gray-600 font-medium">
                                            {venta.articulos} artículos
                                        </span>
                                    </div>
                                    <span className="font-bold text-xl text-facilito-negro">
                                        + ${venta.total.toFixed(2)}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="bg-gray-100 p-4 text-center">
                    <button onClick={cerrarModal} className="text-facilito-azul font-bold hover:underline">
                        Volver a la tienda
                    </button>
                </div>

            </div>
        </div>
    );
};
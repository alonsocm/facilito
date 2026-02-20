import React from 'react';
import { Trash2, ShoppingBag } from 'lucide-react';
import { usePosStore } from '../store/usePosStore';

export const TicketVenta = ({ alPresionarCobrar }) => {
    const { carrito, eliminarProducto, limpiarCarrito, obtenerTotal } = usePosStore();
    const total = obtenerTotal();

    // Fecha formateada (sacamos la lógica aquí para limpiar el JSX)
    const fechaHoy = new Date().toLocaleDateString('es-MX', {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
    });

    return (
        <div className="flex flex-col h-full bg-white">

            {/* 1. ENCABEZADO */}
            <div className="bg-facilito-azul p-4 text-white shrink-0">
                <div className="flex justify-between items-center mb-1">
                    <h2 className="text-lg font-bold flex items-center gap-2">
                        <ShoppingBag size={20} /> Ticket de Venta
                    </h2>
                    {carrito.length > 0 && (
                        <button
                            onClick={limpiarCarrito}
                            className="text-xs bg-red-500/20 hover:bg-red-500 text-white px-2 py-1 rounded transition-colors"
                        >
                            Vaciar
                        </button>
                    )}
                </div>

                {/* Aquí estaba el posible error, usamos la variable fechaHoy */}
                <p className="text-xs text-blue-200 capitalize">
                    {fechaHoy}
                </p>
            </div>

            {/* 2. LISTA DE PRODUCTOS */}
            <div className="flex-1 overflow-y-auto p-2 space-y-2 bg-gray-50">
                {carrito.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400 select-none">
                        <div className="bg-gray-100 rounded-full p-6 mb-4">
                            <ShoppingBag size={40} className="text-gray-300" />
                        </div>
                        <p className="font-bold text-gray-400 text-sm">Sin artículos aún</p>
                        <p className="text-gray-300 text-xs mt-1 text-center px-8">Toca un producto del catálogo para comenzar</p>
                    </div>
                ) : (
                    carrito.map((item) => (
                        <div key={item.id} className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center animate-fade-in">
                            <div className="flex-1 min-w-0 pr-2">
                                <h4 className="font-black text-facilito-negro leading-tight truncate">{item.nombre}</h4>
                                <div className="text-xs text-gray-400 mt-0.5 font-medium">
                                    <span className="bg-gray-100 px-1.5 py-0.5 rounded font-bold text-gray-500">{item.cantidad}</span>
                                    <span className="ml-1">× ${item.precio.toFixed(2)}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                                <span className="font-black text-facilito-verde text-lg">
                                    ${(item.cantidad * item.precio).toFixed(2)}
                                </span>
                                <button
                                    onClick={() => eliminarProducto(item.id)}
                                    className="bg-red-50 text-red-400 p-1.5 rounded-lg hover:bg-red-100 hover:text-red-600 transition-colors"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* 3. PIE DE PÁGINA */}
            <div className="p-4 bg-white border-t border-gray-200 shrink-0 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-10">
                <div className="flex justify-between items-end mb-4">
                    <span className="text-gray-400 font-bold text-sm">TOTAL A PAGAR</span>
                    <span className="text-2xl sm:text-4xl font-black text-facilito-negro tracking-tight">
                        ${total.toFixed(2)}
                    </span>
                </div>

                <button
                    onClick={alPresionarCobrar}
                    disabled={carrito.length === 0}
                    className={`w-full py-4 rounded-xl font-black text-lg shadow-lg transition-all transform active:scale-95
            ${carrito.length === 0
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            : 'bg-facilito-verde text-white hover:bg-green-600 hover:shadow-green-500/30'}`}
                >
                    COBRAR AHORA
                </button>
            </div>

        </div>
    );
};
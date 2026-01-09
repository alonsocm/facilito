import React from 'react';
import { Trash2 } from 'lucide-react'; // Icono de basurero
import { usePosStore } from '../store/usePosStore';

export const TicketVenta = ({ alPresionarCobrar }) => {
    // Conectamos con el cerebro de la tienda
    const { carrito, eliminarProducto, obtenerTotal, limpiarCarrito } = usePosStore();

    const total = obtenerTotal();

    return (
        <div className="bg-white h-full flex flex-col shadow-2xl border-l-4 border-gray-300">

            {/* 1. CABECERA DEL TICKET */}
            <div className="bg-facilito-azul p-6 text-white text-center">
                <h2 className="text-2xl font-bold uppercase tracking-wider">
                    Ticket de Venta
                </h2>
                <p className="opacity-80 text-sm mt-1">
                    {new Date().toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' })}
                </p>
            </div>

            {/* 2. LISTA DE PRODUCTOS (Cuerpo del ticket) */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {carrito.length === 0 ? (
                    <div className="text-center text-gray-400 mt-10 text-xl italic">
                        El carrito está vacío... <br />
                        ¡Selecciona un producto!
                    </div>
                ) : (
                    carrito.map((item) => (
                        <div key={item.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-200">

                            {/* Información del Item */}
                            <div>
                                <div className="font-bold text-lg text-facilito-negro">
                                    {item.nombre}
                                </div>
                                <div className="text-gray-600">
                                    {item.cantidad} x ${item.precio.toFixed(2)}
                                </div>
                            </div>

                            {/* Subtotal y Botón Borrar */}
                            <div className="flex items-center gap-4">
                                <span className="font-bold text-xl text-facilito-azul">
                                    ${(item.cantidad * item.precio).toFixed(2)}
                                </span>

                                <button
                                    onClick={() => eliminarProducto(item.id)}
                                    className="bg-red-100 p-3 rounded-full text-facilito-rojo hover:bg-facilito-rojo hover:text-white transition-colors"
                                    title="Quitar del carrito"
                                >
                                    <Trash2 size={24} />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* 3. RESUMEN Y COBRO (Pie del ticket) */}
            <div className="bg-gray-100 p-6 border-t-4 border-gray-300">
                <div className="flex justify-between items-center mb-6">
                    <span className="text-2xl text-gray-600 font-bold">TOTAL:</span>
                    <span className="text-5xl font-black text-facilito-verde">
                        ${total.toFixed(2)}
                    </span>
                </div>

                {/* Botón Gigante de Cobrar */}
                <button
                    onClick={alPresionarCobrar}
                    disabled={carrito.length === 0}
                    className={`
            w-full py-6 rounded-2xl text-2xl font-bold text-white shadow-lg
            ${carrito.length === 0
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-facilito-verde hover:bg-green-700 active:scale-95'}
          `}
                >
                    {carrito.length === 0 ? 'LISTO PARA VENDER' : 'COBRAR AHORA'}
                </button>
            </div>
        </div>
    );
};
import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';

export const ModalPago = ({ total, cerrarModal, completarVenta }) => {
    const [pago, setPago] = useState('');
    const cambio = pago ? parseFloat(pago) - total : 0;
    const esSuficiente = pago >= total;

    // Botones de billetes rápidos (Lo más usado en tienditas)
    const billetes = [20, 50, 100, 200, 500];

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-bounce-in">

                {/* Encabezado */}
                <div className="bg-facilito-azul p-6 flex justify-between items-center text-white">
                    <h2 className="text-2xl font-bold">Confirmar Venta</h2>
                    <button onClick={cerrarModal} className="bg-white/20 p-2 rounded-full hover:bg-white/40">
                        <X size={28} />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Total a Pagar */}
                    <div className="text-center">
                        <p className="text-gray-500 text-lg uppercase font-bold">Total a cobrar</p>
                        <p className="text-5xl font-black text-facilito-negro">${total.toFixed(2)}</p>
                    </div>

                    {/* Input de Pago */}
                    <div>
                        <label className="block text-gray-600 font-bold mb-2">¿Con cuánto paga el cliente?</label>
                        <div className="flex gap-2 mb-4">
                            {/* Sugerencias de billetes */}
                            {billetes.map(billete => (
                                billete >= total && ( // Solo mostrar billetes mayores al total
                                    <button
                                        key={billete}
                                        onClick={() => setPago(billete)}
                                        className="flex-1 bg-green-100 text-green-800 font-bold py-2 rounded-lg border-2 border-green-200 hover:bg-green-200"
                                    >
                                        ${billete}
                                    </button>
                                )
                            ))}
                        </div>

                        <input
                            type="number"
                            value={pago}
                            onChange={(e) => setPago(e.target.value)}
                            placeholder="Escribe la cantidad..."
                            autoFocus
                            className="w-full text-3xl font-bold p-4 text-center border-4 border-gray-300 rounded-xl focus:border-facilito-azul focus:outline-none"
                        />
                    </div>

                    {/* Zona de Cambio (El dato más importante) */}
                    <div className={`p-4 rounded-xl text-center border-4 transition-colors ${esSuficiente ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                        <p className="text-gray-600 font-bold text-xl uppercase">Cambio a entregar</p>
                        <p className={`text-4xl font-black ${esSuficiente ? 'text-facilito-verde' : 'text-facilito-rojo'}`}>
                            ${esSuficiente ? cambio.toFixed(2) : 'FALTA DINERO'}
                        </p>
                    </div>

                    {/* Botón Finalizar */}
                    <button
                        disabled={!esSuficiente}
                        onClick={completarVenta}
                        className={`w-full py-5 rounded-2xl text-xl font-bold flex items-center justify-center gap-2 shadow-lg
              ${esSuficiente
                                ? 'bg-facilito-azul text-white hover:bg-blue-900 transform active:scale-95'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                    >
                        <Check size={28} /> TERMINAR VENTA
                    </button>
                </div>
            </div>
        </div>
    );
};
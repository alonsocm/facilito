import React, { useState, useEffect } from 'react';
import { X, Scale, DollarSign, Check } from 'lucide-react';

export const ModalGranel = ({ producto, cerrarModal, confirmarAgregar }) => {
    // Dos estados: Peso (kg) y Dinero ($)
    const [peso, setPeso] = useState('');
    const [dinero, setDinero] = useState('');

    // 1. Si el cliente dice "Deme 20 pesos" (Calculamos peso)
    const cambiarDinero = (valor) => {
        setDinero(valor);
        if (valor && !isNaN(valor)) {
            const pesoCalculado = parseFloat(valor) / producto.precio;
            setPeso(pesoCalculado.toFixed(3)); // 3 decimales para precisión de báscula
        } else {
            setPeso('');
        }
    };

    // 2. Si el cliente dice "Deme medio kilo" (Calculamos precio)
    const cambiarPeso = (valor) => {
        setPeso(valor);
        if (valor && !isNaN(valor)) {
            const precioCalculado = parseFloat(valor) * producto.precio;
            setDinero(precioCalculado.toFixed(2));
        } else {
            setDinero('');
        }
    };

    // Botones rápidos (Atajos de carnicería)
    const setMedioKilo = () => cambiarPeso('0.500');
    const setCuarto = () => cambiarPeso('0.250');
    const setUnKilo = () => cambiarPeso('1.000');

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md animate-bounce-in overflow-hidden">

                {/* Cabecera */}
                <div className="bg-facilito-azul p-6 text-white flex justify-between items-center">
                    <div>
                        <h3 className="text-xl font-bold">{producto.nombre}</h3>
                        <p className="opacity-80 text-sm">Precio por Kg: ${producto.precio.toFixed(2)}</p>
                    </div>
                    <button onClick={cerrarModal} className="bg-white/20 p-2 rounded-full hover:bg-white/40">
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6 space-y-6">

                    {/* OPCIÓN A: POR PRECIO (Lo más común: "Deme 20 pesos") */}
                    <div>
                        <label className="block text-gray-600 font-bold mb-1 text-lg">¿Cuánto dinero pide?</label>
                        <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-green-600" />
                            <input
                                type="number"
                                value={dinero}
                                onChange={(e) => cambiarDinero(e.target.value)}
                                placeholder="0.00"
                                className="w-full pl-10 p-4 text-3xl font-black text-green-700 bg-green-50 border-2 border-green-200 rounded-xl outline-none focus:border-green-500"
                                autoFocus
                            />
                        </div>
                    </div>

                    {/* SEPARADOR VISUAL */}
                    <div className="flex items-center gap-4">
                        <div className="h-px bg-gray-300 flex-1"></div>
                        <Scale className="text-gray-400" />
                        <div className="h-px bg-gray-300 flex-1"></div>
                    </div>

                    {/* OPCIÓN B: POR PESO (Báscula: "Deme medio kilo") */}
                    <div>
                        <label className="block text-gray-600 font-bold mb-2">O peso exacto (Kg):</label>

                        {/* Botones rápidos */}
                        <div className="flex gap-2 mb-3">
                            <button onClick={setCuarto} className="flex-1 py-2 bg-gray-100 rounded-lg text-sm font-bold hover:bg-gray-200">¼ Kg</button>
                            <button onClick={setMedioKilo} className="flex-1 py-2 bg-gray-100 rounded-lg text-sm font-bold hover:bg-gray-200">½ Kg</button>
                            <button onClick={setUnKilo} className="flex-1 py-2 bg-gray-100 rounded-lg text-sm font-bold hover:bg-gray-200">1 Kg</button>
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="number"
                                value={peso}
                                onChange={(e) => cambiarPeso(e.target.value)}
                                placeholder="0.000"
                                className="flex-1 p-3 text-xl font-bold text-gray-700 bg-gray-50 border-2 border-gray-200 rounded-xl outline-none focus:border-facilito-azul"
                            />
                            <span className="text-gray-500 font-bold">Kg</span>
                        </div>
                    </div>

                    <button
                        disabled={!peso || parseFloat(peso) <= 0}
                        onClick={() => confirmarAgregar(parseFloat(peso))}
                        className="w-full bg-facilito-azul text-white py-4 rounded-xl text-xl font-bold hover:bg-blue-800 disabled:bg-gray-300 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                    >
                        <Check /> AGREGAR AL CARRITO
                    </button>
                </div>

            </div>
        </div>
    );
};
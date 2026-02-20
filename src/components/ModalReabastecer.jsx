import React, { useState, useRef, useEffect } from 'react';
import { X, PackagePlus, ArrowRight, Save } from 'lucide-react';

export const ModalReabastecer = ({ producto, cerrar, confirmar }) => {
    const [cantidad, setCantidad] = useState('');
    const inputRef = useRef(null);

    // Auto-focus al abrir
    useEffect(() => {
        setTimeout(() => inputRef.current?.focus(), 100);
    }, []);

    const stockActual = parseFloat(producto.stock || 0);
    const ingreso = parseFloat(cantidad || 0);
    const stockFinal = stockActual + ingreso;

    const manejarEnvio = (e) => {
        e.preventDefault();
        if (ingreso > 0) confirmar(producto.id, ingreso);
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[80] flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">

                {/* HEADER NARANJA (Diferente al azul de ventas para no confundir) */}
                <div className="bg-orange-500 p-4 sm:p-6 flex justify-between items-center text-white">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <PackagePlus /> Recepción de Mercancía
                    </h2>
                    <button onClick={cerrar} className="bg-white/20 p-2 rounded-full hover:bg-white/40">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={manejarEnvio} className="p-6 space-y-6">

                    {/* NOMBRE DEL PRODUCTO */}
                    <div className="text-center">
                        <p className="text-gray-400 text-xs font-bold uppercase">Producto</p>
                        <h3 className="text-xl sm:text-2xl font-black text-gray-800 line-clamp-2">{producto.nombre}</h3>
                    </div>

                    {/* VISUALIZACIÓN MATEMÁTICA */}
                    <div className="flex items-center justify-center gap-4 text-center bg-gray-50 p-4 rounded-2xl border border-gray-100">
                        <div>
                            <p className="text-xs text-gray-500 font-bold mb-1">ACTUAL</p>
                            <p className="text-2xl sm:text-3xl font-bold text-gray-400">{stockActual}</p>
                        </div>
                        <div className="text-orange-500 pt-4">
                            <PackagePlus size={24} />
                        </div>
                        <div>
                            <p className="text-xs text-orange-600 font-bold mb-1">ENTRADA</p>
                            {/* El valor que estamos escribiendo */}
                            <p className="text-2xl sm:text-3xl font-bold text-orange-600">+{ingreso || 0}</p>
                        </div>
                        <div className="text-gray-300 pt-4">
                            <ArrowRight size={24} />
                        </div>
                        <div>
                            <p className="text-xs text-green-600 font-bold mb-1">FINAL</p>
                            <p className="text-2xl sm:text-3xl font-black text-green-600">{stockFinal}</p>
                        </div>
                    </div>

                    {/* INPUT DE CANTIDAD */}
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">Cant:</span>
                        <input
                            ref={inputRef}
                            type="number"
                            className="w-full pl-16 pr-4 py-4 text-4xl font-black text-center border-4 border-orange-100 rounded-2xl focus:border-orange-500 focus:bg-orange-50 outline-none transition-all text-gray-700"
                            placeholder="0"
                            value={cantidad}
                            onChange={(e) => setCantidad(e.target.value)}
                        />
                    </div>

                    {/* BOTONES RÁPIDOS (Cajas comunes) */}
                    <div className="flex justify-center gap-2">
                        {[6, 12, 24].map(num => (
                            <button
                                key={num}
                                type="button"
                                onClick={() => setCantidad(num.toString())}
                                className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-bold text-gray-600 hover:bg-orange-100 hover:text-orange-600 transition-colors"
                            >
                                +{num} pz
                            </button>
                        ))}
                    </div>

                    <button
                        type="submit"
                        disabled={ingreso <= 0}
                        className="w-full bg-orange-500 text-white py-4 rounded-2xl font-black text-xl hover:bg-orange-600 shadow-lg shadow-orange-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                        <Save size={24} /> GUARDAR STOCK
                    </button>
                </form>
            </div>
        </div>
    );
};
import React, { useState, useEffect, useRef } from 'react';
import { X, Banknote, Coins, ArrowRight, CheckCircle2 } from 'lucide-react';

export const ModalPago = ({ total, cerrarModal, completarVenta }) => {
    const [efectivo, setEfectivo] = useState('');
    const inputRef = useRef(null);

    // Auto-foco al abrir
    useEffect(() => {
        if (inputRef.current) inputRef.current.focus();
    }, []);

    // Cálculos matemáticos
    const pagoCliente = parseFloat(efectivo) || 0;
    const cambio = pagoCliente - total;
    const falta = total - pagoCliente;
    const esSuficiente = pagoCliente >= total;

    // Manejar el cobro final
    const manejarCobrar = (e) => {
        if (e) e.preventDefault();

        if (!esSuficiente) return; // No dejar cobrar si falta dinero

        // Enviamos el pago real (o el total si puso exacto) para el ticket
        completarVenta(pagoCliente);
    };

    // Botones de denominación rápida
    const billetes = [20, 50, 100, 200, 500, 1000];

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[70] p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-bounce-in">

                {/* Cabecera */}
                <div className="bg-facilito-azul p-6 flex justify-between items-center text-white">
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <Banknote /> Cobrar Venta
                    </h2>
                    <button onClick={cerrarModal} className="bg-white/20 p-2 rounded-full hover:bg-white/40">
                        <X size={24} />
                    </button>
                </div>

                <div className="p-8">

                    {/* RESUMEN TOTAL */}
                    <div className="text-center mb-8">
                        <p className="text-gray-500 text-sm font-bold uppercase tracking-widest">Total a Pagar</p>
                        <p className="text-6xl font-black text-facilito-negro mt-2">
                            ${total.toFixed(2)}
                        </p>
                    </div>

                    <form onSubmit={manejarCobrar} className="space-y-6">

                        {/* INPUT DE EFECTIVO */}
                        <div>
                            <label className="block text-sm font-bold text-gray-500 mb-2">EFECTIVO RECIBIDO</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-gray-400">$</span>
                                <input
                                    ref={inputRef}
                                    type="number"
                                    step="0.50"
                                    value={efectivo}
                                    onChange={(e) => setEfectivo(e.target.value)}
                                    className={`w-full pl-10 pr-4 py-4 text-3xl font-bold border-4 rounded-xl outline-none transition-colors
                    ${esSuficiente
                                            ? 'border-facilito-verde bg-green-50 text-green-800 focus:ring-4 focus:ring-green-100'
                                            : 'border-gray-300 focus:border-facilito-azul focus:ring-4 focus:ring-blue-50'
                                        }`}
                                    placeholder="0.00"
                                    autoFocus
                                />
                            </div>
                        </div>

                        {/* BOTONES RÁPIDOS (BILLETES) */}
                        <div className="grid grid-cols-3 gap-2">
                            {/* Botón Exacto */}
                            <button
                                type="button"
                                onClick={() => setEfectivo(total.toString())}
                                className="py-2 px-1 bg-gray-200 text-gray-700 font-bold rounded-lg hover:bg-gray-300 text-sm"
                            >
                                Exacto
                            </button>

                            {/* Billetes sugeridos (Solo mostramos los que son mayores al total) */}
                            {billetes.filter(b => b >= total).slice(0, 5).map(billete => (
                                <button
                                    key={billete}
                                    type="button"
                                    onClick={() => setEfectivo(billete.toString())}
                                    className="py-2 px-1 bg-blue-50 text-facilito-azul border border-blue-100 font-bold rounded-lg hover:bg-blue-100 hover:scale-105 transition-transform"
                                >
                                    ${billete}
                                </button>
                            ))}
                        </div>

                        {/* INFO CAMBIO / FALTA */}
                        <div className={`p-4 rounded-xl flex justify-between items-center transition-colors ${esSuficiente ? 'bg-green-100' : 'bg-red-50'}`}>
                            <div className="flex items-center gap-2">
                                {esSuficiente ? <Coins className="text-green-600" /> : <X className="text-red-400" />}
                                <span className={`font-bold ${esSuficiente ? 'text-green-700' : 'text-red-500'}`}>
                                    {esSuficiente ? 'CAMBIO:' : 'FALTA:'}
                                </span>
                            </div>
                            <span className={`text-3xl font-black ${esSuficiente ? 'text-green-700' : 'text-red-500'}`}>
                                ${esSuficiente ? cambio.toFixed(2) : falta.toFixed(2)}
                            </span>
                        </div>

                        {/* BOTÓN COBRAR (Grande) */}
                        <button
                            type="submit"
                            disabled={!esSuficiente}
                            className={`w-full py-5 rounded-2xl font-black text-xl flex items-center justify-center gap-3 shadow-xl transition-all
                ${esSuficiente
                                    ? 'bg-facilito-azul text-white hover:bg-blue-900 hover:scale-[1.02]'
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                        >
                            {esSuficiente ? (
                                <>
                                    <CheckCircle2 size={28} />
                                    COBRAR E IMPRIMIR
                                </>
                            ) : (
                                <>
                                    Falta dinero...
                                </>
                            )}
                        </button>
                    </form>

                </div>
            </div>
        </div>
    );
};
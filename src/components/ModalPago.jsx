import React, { useState, useEffect, useRef } from 'react';
import { X, Banknote, Coins, CheckCircle2, Eraser } from 'lucide-react';

export const ModalPago = ({ total, cerrarModal, completarVenta }) => {
    const [efectivo, setEfectivo] = useState('');
    const inputRef = useRef(null);

    // MEJORA 1: Auto-seleccionar el texto al abrir
    // Esto permite que si escribes "200", se borre lo anterior automáticamente.
    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
            setTimeout(() => inputRef.current.select(), 100); // Pequeño delay para asegurar selección
        }
    }, []);

    const pagoCliente = parseFloat(efectivo) || 0;
    const cambio = pagoCliente - total;
    const falta = total - pagoCliente;
    const esSuficiente = pagoCliente >= total;

    const manejarCobrar = (e) => {
        if (e) e.preventDefault();
        if (!esSuficiente) return;
        completarVenta(pagoCliente);
    };

    const billetes = [20, 50, 100, 200, 500, 1000];

    return (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center z-[70] p-4 animate-fade-in">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">

                {/* HEADER */}
                <div className="bg-facilito-azul p-5 flex justify-between items-center text-white shrink-0">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <Banknote className="text-blue-300" /> Cobrar Venta
                    </h2>
                    <button onClick={cerrarModal} className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto">

                    {/* TOTAL A PAGAR (Más compacto para dar espacio al Cambio) */}
                    <div className="text-center mb-6">
                        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Total a Pagar</p>
                        <p className="text-5xl font-black text-facilito-negro tracking-tight">
                            ${total.toFixed(2)}
                        </p>
                    </div>

                    <form onSubmit={manejarCobrar} className="space-y-6">

                        {/* INPUT DE EFECTIVO MEJORADO */}
                        <div>
                            <div className="relative group">
                                <span className={`absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold transition-colors ${esSuficiente ? 'text-green-600' : 'text-gray-400'}`}>$</span>

                                <input
                                    ref={inputRef}
                                    type="number"
                                    step="0.50"
                                    value={efectivo}
                                    onChange={(e) => setEfectivo(e.target.value)}
                                    // MEJORA: Al hacer clic, selecciona todo para corregir rápido
                                    onClick={(e) => e.target.select()}
                                    className={`w-full pl-10 pr-12 py-4 text-4xl font-black border-4 rounded-2xl outline-none transition-all text-center
                                    ${esSuficiente
                                            ? 'border-green-500 bg-green-50 text-green-800 shadow-lg shadow-green-100'
                                            : 'border-gray-200 focus:border-facilito-azul focus:ring-4 focus:ring-blue-50 text-gray-700'
                                        }`}
                                    placeholder="0.00"
                                />

                                {/* MEJORA 2: Botón para limpiar input rápido */}
                                {efectivo && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setEfectivo('');
                                            inputRef.current.focus();
                                        }}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 p-1"
                                    >
                                        <Eraser size={24} />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* BILLETES RÁPIDOS */}
                        <div className="grid grid-cols-4 gap-2">
                            <button
                                type="button"
                                onClick={() => setEfectivo(total.toFixed(2))}
                                className="col-span-1 py-3 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200 text-sm active:scale-95 transition-all"
                            >
                                Exacto
                            </button>

                            {/* Lógica inteligente: Mostramos billetes cercanos al total */}
                            {billetes.map(billete => (
                                <button
                                    key={billete}
                                    type="button"
                                    onClick={() => setEfectivo(billete.toString())}
                                    // Deshabilitamos billetes menores al total para evitar errores (opcional)
                                    className={`py-3 font-bold rounded-xl transition-all active:scale-95
                                    ${billete < total
                                            ? 'bg-gray-50 text-gray-300 border border-gray-100' // Billetes inútiles
                                            : 'bg-blue-50 text-facilito-azul border-2 border-blue-100 hover:bg-blue-100 hover:border-blue-300' // Billetes útiles
                                        }`}
                                >
                                    ${billete}
                                </button>
                            ))}
                        </div>

                        {/* INFO CAMBIO (Visualmente Impactante) */}
                        <div className={`
                            p-5 rounded-2xl border-2 flex flex-col items-center justify-center transition-all duration-300
                            ${esSuficiente ? 'bg-green-100 border-green-300 scale-105 shadow-xl' : 'bg-gray-50 border-gray-200'}
                        `}>
                            <div className="flex items-center gap-2 mb-1">
                                {esSuficiente ? <Coins className="text-green-600" size={20} /> : null}
                                <span className={`text-sm font-black uppercase tracking-widest ${esSuficiente ? 'text-green-700' : 'text-gray-400'}`}>
                                    {esSuficiente ? 'Entregar Cambio' : 'Falta por pagar'}
                                </span>
                            </div>
                            <span className={`text-5xl font-black ${esSuficiente ? 'text-green-700' : 'text-gray-300'}`}>
                                ${esSuficiente ? cambio.toFixed(2) : falta.toFixed(2)}
                            </span>
                        </div>

                        {/* BOTÓN FINAL */}
                        <button
                            type="submit"
                            disabled={!esSuficiente}
                            className={`w-full py-4 rounded-2xl font-black text-xl shadow-xl transition-all flex items-center justify-center gap-2
                            ${esSuficiente
                                    ? 'bg-facilito-azul text-white hover:bg-blue-700 hover:scale-[1.02] active:scale-95'
                                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                        >
                            <CheckCircle2 size={24} />
                            {esSuficiente ? 'FINALIZAR VENTA' : 'Complete el monto'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};
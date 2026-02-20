import React, { useRef, useState } from 'react';
import { Plus, Minus, Check, AlertTriangle } from 'lucide-react';

export const BotonProducto = ({ producto, alHacerClick }) => {
    const [presionando, setPresionando] = useState(false);
    const timerRef = useRef(null);

    const [mostrarInputCantidad, setMostrarInputCantidad] = useState(false);
    const [cantidadManual, setCantidadManual] = useState(1);
    const [mostrarCheck, setMostrarCheck] = useState(false);
    const checkTimerRef = useRef(null);

    // --- LÓGICA DE PRESIÓN ---
    const iniciarPresion = () => {
        if (producto.esGranel) return;

        setPresionando(true);
        timerRef.current = setTimeout(() => {
            setMostrarInputCantidad(true);
            setPresionando(false);
        }, 500);
    };

    const terminarPresion = (e) => {
        // 🛑 SOLUCIÓN AL BUG: Si es un evento táctil, detenemos el comportamiento
        // por defecto para que el navegador no lance un "MouseUp" fantasma después.
        if (e && e.type === 'touchend') {
            e.preventDefault();
        }

        if (producto.esGranel) {
            alHacerClick(1);
            return;
        }

        if (timerRef.current && !mostrarInputCantidad) {
            clearTimeout(timerRef.current);
            alHacerClick(1);
            mostrarFeedback();
        }
        setPresionando(false);
    };

    const cancelarPresion = () => {
        if (timerRef.current) clearTimeout(timerRef.current);
        setPresionando(false);
    };

    const mostrarFeedback = () => {
        if (checkTimerRef.current) clearTimeout(checkTimerRef.current);
        setMostrarCheck(true);
        checkTimerRef.current = setTimeout(() => setMostrarCheck(false), 900);
    };

    const confirmarCantidad = () => {
        if (cantidadManual > 0) {
            alHacerClick(parseInt(cantidadManual));
            mostrarFeedback();
        }
        setMostrarInputCantidad(false);
        setCantidadManual(1);
    };
    // -------------------------

    const stockBajo = !producto.esGranel && producto.stock !== undefined && producto.stock <= 5 && producto.stock > 0;
    const sinStock = !producto.esGranel && producto.stock !== undefined && producto.stock === 0;

    return (
        <>
            <button
                onMouseDown={iniciarPresion}
                onMouseUp={terminarPresion}
                onMouseLeave={cancelarPresion}

                // Eventos Táctiles (Móvil)
                onTouchStart={iniciarPresion}
                onTouchEnd={terminarPresion}
                onTouchMove={cancelarPresion} // Si arrastran el dedo (scroll), cancelamos
                onTouchCancel={cancelarPresion} // Si entra una llamada o alerta, cancelamos

                // Deshabilitamos el menú contextual (click derecho) en el botón para evitar conflictos en móvil
                onContextMenu={(e) => e.preventDefault()}

                className={`
                relative bg-white p-3 sm:p-4 rounded-2xl shadow-sm border-2 transition-all duration-200
                flex flex-col items-start justify-between h-full group overflow-hidden select-none w-full
                ${presionando ? 'scale-95 border-facilito-azul bg-blue-50'
                    : stockBajo ? 'border-orange-200 hover:border-orange-300 hover:shadow-md'
                    : sinStock ? 'border-red-200 opacity-60'
                    : 'border-transparent hover:border-blue-200 hover:shadow-md'}
                active:scale-95 touch-manipulation cursor-pointer
            `}
                style={{ WebkitTapHighlightColor: 'transparent' }} // Quita el parpadeo azul en Android/iOS
            >
                <div className="w-full flex flex-col gap-2 sm:gap-3 pointer-events-none"> {/* pointer-events-none ayuda a que el click sea en el botón padre */}
                    <div className="w-full aspect-square rounded-xl bg-gray-50 overflow-hidden relative">
                        {producto.imagen ? (
                            <img src={producto.imagen} alt={producto.nombre} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300 font-bold text-4xl bg-gray-100">
                                {producto.nombre.charAt(0).toUpperCase()}
                            </div>
                        )}

                        {producto.esGranel && (
                            <span className="absolute top-2 left-2 bg-yellow-400 text-yellow-900 text-[10px] font-black px-2 py-0.5 rounded-full shadow-sm">
                                KG / $
                            </span>
                        )}
                        {stockBajo && (
                            <span className="absolute top-2 right-2 bg-orange-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full shadow-sm flex items-center gap-0.5">
                                <AlertTriangle size={9} strokeWidth={3} />
                                {producto.stock}
                            </span>
                        )}
                        {sinStock && (
                            <div className="absolute inset-0 bg-gray-900/20 rounded-xl flex items-center justify-center">
                                <span className="bg-red-600 text-white text-[10px] font-black px-2 py-1 rounded-full shadow">AGOTADO</span>
                            </div>
                        )}
                    </div>

                    <p className="font-bold text-facilito-negro leading-tight line-clamp-2 text-left text-sm sm:text-base">
                        {producto.nombre}
                    </p>
                </div>

                <p className="text-facilito-verde font-black text-lg sm:text-xl text-left mt-2 w-full pointer-events-none">
                    ${producto.precio}
                </p>

                {/* Badge hover normal */}
                <div className={`absolute bottom-3 right-3 p-1.5 rounded-full transition-all duration-200
                    ${mostrarCheck
                        ? 'bg-facilito-verde text-white scale-110 opacity-100'
                        : 'bg-blue-100 text-facilito-azul opacity-0 group-hover:opacity-100 scale-0 group-hover:scale-100'
                    }`}>
                    {mostrarCheck ? <Check size={16} strokeWidth={3} /> : <Plus size={16} />}
                </div>
            </button>
            {mostrarInputCantidad && (
                <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white p-6 rounded-3xl shadow-2xl w-72 flex flex-col items-center animate-slide-up">
                        <h3 className="font-bold text-lg mb-4 text-center text-gray-700 leading-tight">
                            Cantidad para <br />
                            <span className="text-facilito-azul text-xl">{producto.nombre}</span>
                        </h3>

                        <div className="flex items-center gap-4 mb-6 bg-gray-50 p-2 rounded-full">
                            <button onClick={() => setCantidadManual(Math.max(1, cantidadManual - 1))} className="w-12 h-12 rounded-full bg-white text-facilito-azul shadow-sm hover:bg-blue-50 flex items-center justify-center transition-all active:scale-90">
                                <Minus size={24} />
                            </button>
                            <input
                                type="number"
                                autoFocus
                                value={cantidadManual}
                                onChange={(e) => setCantidadManual(Number(e.target.value))}
                                onKeyDown={(e) => e.key === 'Enter' && confirmarCantidad()}
                                className="w-20 text-center text-3xl font-black bg-transparent outline-none text-facilito-negro"
                            />
                            <button onClick={() => setCantidadManual(cantidadManual + 1)} className="w-12 h-12 rounded-full bg-facilito-azul text-white shadow-md hover:bg-blue-700 flex items-center justify-center transition-all active:scale-90">
                                <Plus size={24} />
                            </button>
                        </div>

                        <div className="flex gap-3 w-full">
                            <button onClick={() => setMostrarInputCantidad(false)} className="flex-1 py-3 text-gray-500 font-bold hover:bg-gray-100 rounded-2xl transition-colors">
                                Cancelar
                            </button>
                            <button onClick={confirmarCantidad} className="flex-1 py-3 bg-facilito-azul text-white font-bold rounded-2xl shadow-lg shadow-blue-900/20 hover:bg-blue-700 transition-all active:scale-95">
                                Confirmar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
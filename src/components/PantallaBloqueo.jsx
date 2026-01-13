import React, { useState } from 'react';
import { Lock, Delete, UserCircle2 } from 'lucide-react';
import { usePosStore } from '../store/usePosStore';

export const PantallaBloqueo = () => {
    const { login } = usePosStore();
    const [pin, setPin] = useState("");
    const [error, setError] = useState(false);

    const manejarNumero = (num) => {
        if (pin.length < 4) {
            setPin(pin + num);
            setError(false);
        }
    };

    const manejarBorrar = () => {
        setPin(pin.slice(0, -1));
        setError(false);
    };

    const manejarEntrar = () => {
        // Intentamos loguear con el PIN actual
        if (!login(pin)) {
            setError(true);
            setPin(""); // Limpiamos el PIN si falló

            // Efecto de vibración si es celular
            if (navigator.vibrate) navigator.vibrate(200);
        }
    };

    return (
        <div className="fixed inset-0 bg-facilito-azul flex flex-col items-center justify-center text-white z-50">

            {/* LOGO Y TEXTO */}
            <div className="mb-8 text-center animate-fade-in">
                <div className="bg-white/10 p-4 rounded-full inline-block mb-4 shadow-lg">
                    <Lock size={40} />
                </div>
                <h1 className="text-3xl font-black tracking-tighter">ABARROTES FACILITO</h1>
                <p className="text-blue-200 mt-2 font-medium">Ingresa tu PIN de acceso</p>
            </div>

            {/* VISOR DE PUNTOS (PIN) */}
            <div className="flex gap-4 mb-8 h-8 items-center justify-center">
                {[0, 1, 2, 3].map((i) => (
                    <div
                        key={i}
                        className={`rounded-full transition-all duration-300 border-2 border-white
              ${i < pin.length
                                ? (error ? 'w-4 h-4 bg-red-500 border-red-500' : 'w-4 h-4 bg-white scale-110')
                                : 'w-3 h-3 bg-transparent opacity-50'}`}
                    />
                ))}
            </div>

            {/* MENSAJE DE ERROR */}
            <div className="h-6 mb-4">
                {error && <p className="text-red-300 font-bold animate-bounce">PIN INCORRECTO</p>}
            </div>

            {/* TECLADO NUMÉRICO */}
            <div className="grid grid-cols-3 gap-4 w-72">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                    <button
                        key={num}
                        onClick={() => manejarNumero(num.toString())}
                        className="h-20 w-20 rounded-full bg-white/10 text-3xl font-bold hover:bg-white/30 active:scale-90 transition-all backdrop-blur-sm"
                    >
                        {num}
                    </button>
                ))}

                {/* Fila Inferior */}
                <div className="flex items-center justify-center">
                    {/* Espacio vacío para centrar el 0 */}
                </div>

                <button
                    onClick={() => manejarNumero("0")}
                    className="h-20 w-20 rounded-full bg-white/10 text-3xl font-bold hover:bg-white/30 active:scale-90 transition-all backdrop-blur-sm"
                >
                    0
                </button>

                <button
                    onClick={manejarBorrar}
                    className="h-20 w-20 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-all"
                >
                    <Delete size={32} />
                </button>
            </div>

            {/* BOTÓN ENTRAR */}
            <button
                onClick={manejarEntrar}
                disabled={pin.length !== 4}
                className={`mt-8 px-12 py-3 rounded-full font-bold tracking-widest transition-all
            ${pin.length === 4
                        ? 'bg-facilito-verde text-white shadow-lg shadow-green-900/50 scale-105'
                        : 'bg-white/5 text-white/20 cursor-not-allowed'}`}
            >
                ACCEDER
            </button>

            <p className="fixed bottom-6 text-xs text-white/20">ID: TERMINAL-01</p>
        </div>
    );
};
import React, { useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { X } from 'lucide-react';

export const EscanerCamara = ({ onScan, cerrar }) => {
    const domIdRef = useRef(`qr-reader-manual-${Date.now()}`);
    const scannerRef = useRef(null);

    // AQUÍ GUARDARÉMOS EL VIDEO EN CUANTO APAREZCA
    const videoElementRef = useRef(null);

    useEffect(() => {
        // 1. Instancia
        const html5QrCode = new Html5Qrcode(domIdRef.current);
        scannerRef.current = html5QrCode;

        const config = { fps: 10, qrbox: { width: 250, height: 250 }, aspectRatio: 1.0 };

        // 2. Iniciar Cámara
        html5QrCode.start(
            { facingMode: "environment" },
            config,
            (decodedText) => {
                // Al detectar código
                detenerCamaraManual(); // Matamos hardware
                html5QrCode.stop().then(() => {
                    onScan(decodedText);
                    cerrar();
                }).catch(() => {
                    onScan(decodedText);
                    cerrar();
                });
            },
            (error) => { /* ignorar */ }
        ).catch(err => {
            console.error("Error init:", err);
            cerrar();
        });

        // 3. TRUCO: INTERVALO PARA CAPTURAR LA ETIQUETA <VIDEO>
        // La librería tarda unos milisegundos en crear el elemento <video> en el DOM.
        // Lo buscamos repetidamente hasta encontrarlo y guardarlo en nuestra ref.
        const capturaInterval = setInterval(() => {
            const videoElement = document.querySelector(`#${domIdRef.current} video`);
            if (videoElement) {
                videoElementRef.current = videoElement; // ¡Lo tenemos!
                clearInterval(capturaInterval); // Dejamos de buscar
            }
        }, 100);

        // FUNCIÓN DE APAGADO DE HARDWARE (Usando la referencia guardada)
        const detenerCamaraManual = () => {
            if (videoElementRef.current && videoElementRef.current.srcObject) {
                const stream = videoElementRef.current.srcObject;
                const tracks = stream.getTracks();

                tracks.forEach(track => {
                    track.stop(); // <--- ESTO MATARÁ EL PUNTO ROJO
                    track.enabled = false;
                });
                videoElementRef.current.srcObject = null;
            }
        };

        // 4. LIMPIEZA AL DESMONTAR
        return () => {
            clearInterval(capturaInterval); // Limpiamos el intervalo por si acaso

            // Primero matamos el hardware usando nuestra referencia capturada
            detenerCamaraManual();

            // Luego le avisamos a la librería (por cortesía)
            if (scannerRef.current) {
                try {
                    if (scannerRef.current.isScanning) {
                        scannerRef.current.stop().catch(() => { });
                    }
                    scannerRef.current.clear();
                } catch (e) { console.warn(e); }
            }
        };
    }, []);

    return (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
            <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden relative animate-fade-in shadow-2xl">

                <button
                    onClick={cerrar}
                    className="absolute top-4 right-4 z-10 bg-white p-2 rounded-full text-gray-500 hover:text-red-500 shadow-lg"
                >
                    <X size={24} />
                </button>

                <div className="p-6 text-center">
                    <h3 className="text-xl font-bold text-facilito-azul mb-2">Escaneando...</h3>
                    <p className="text-sm text-gray-400 mb-4">Enfoca el código de barras</p>

                    <div className="rounded-xl overflow-hidden border-4 border-facilito-azul bg-black relative shadow-inner">
                        <div id={domIdRef.current} className="w-full h-[300px]"></div>
                        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-red-500 opacity-50 animate-pulse"></div>
                    </div>

                </div>
            </div>
        </div>
    );
};
import React, { forwardRef } from 'react';

export const TicketImprimible = forwardRef(({ venta, carritoActual, totalActual }, ref) => {

    const datos = venta || {
        fecha: new Date().toLocaleDateString('es-MX'),
        hora: new Date().toLocaleTimeString('es-MX'),
        detalle: carritoActual || [],
        total: totalActual || 0,
        pago: 0,
        cambio: 0,
        id: "PRE-TICKET"
    };

    return (
        // CAMBIO CLAVE: Quitamos el ID y las clases "hidden".
        // Ponemos el ref DIRECTAMENTE en el contenedor principal.
        <div ref={ref} className="font-mono text-black p-2 max-w-[80mm] mx-auto bg-white">

            {/* ENCABEZADO */}
            <div className="text-center border-b border-black border-dashed pb-2 mb-2">
                <h2 className="text-xl font-black uppercase">Abarrotes Facilito</h2>
                <p className="text-sm">Calle Ficticia 123, Col. Centro</p>
                <p className="text-sm">Pachuca, Hidalgo</p>
                <p className="text-xs mt-1">Tel: 771-555-5555</p>
            </div>

            {/* DATOS DE VENTA */}
            <div className="text-xs mb-2">
                <p>Folio: {datos.id ? datos.id.slice(-6) : '---'}</p>
                <p>Fecha: {datos.fecha} - {datos.hora}</p>
            </div>

            {/* LISTA DE PRODUCTOS */}
            <table className="w-full text-xs text-left mb-2">
                <thead>
                    <tr className="border-b border-black">
                        <th className="w-10">Cant.</th>
                        <th>Prod.</th>
                        <th className="text-right">Importe</th>
                    </tr>
                </thead>
                <tbody>
                    {datos.detalle?.map((item, index) => (
                        <tr key={index}>
                            <td className="align-top">{item.cantidad}</td>
                            <td className="align-top truncate max-w-[120px]">{item.nombre}</td>
                            <td className="text-right align-top">${(item.precio * item.cantidad).toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* TOTALES */}
            <div className="border-t border-black border-dashed pt-2 text-right">
                <div className="text-xl font-bold">TOTAL: ${datos.total.toFixed(2)}</div>
                {datos.pago > 0 && (
                    <>
                        <p className="text-sm">Efectivo: ${datos.pago.toFixed(2)}</p>
                        <p className="text-sm">Cambio: ${datos.cambio.toFixed(2)}</p>
                    </>
                )}
            </div>

            {/* PIE DE PÁGINA */}
            <div className="text-center mt-4 text-xs">
                <p>¡Gracias por su compra!</p>
                <p>app-facilito.web.app</p>
            </div>

        </div>
    );
});
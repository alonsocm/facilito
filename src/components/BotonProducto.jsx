import React from 'react';

export const BotonProducto = ({ producto, alHacerClick }) => {
    const sinStock = producto.stock <= 0;
    const stockBajo = producto.stock > 0 && producto.stock < 5; // Alerta amarilla si quedan menos de 5

    return (
        <button
            onClick={() => !sinStock && alHacerClick(producto)}
            disabled={sinStock} // Desactiva el clic si no hay stock
            className={`
        w-full h-40 
        rounded-2xl shadow-md 
        flex flex-col items-center justify-center 
        transition-all duration-150 relative overflow-hidden
        p-2 border-4
        ${sinStock
                    ? 'bg-gray-100 border-gray-200 cursor-not-allowed opacity-60' // Estilo Agotado
                    : 'bg-white border-gray-200 hover:border-facilito-azul hover:bg-blue-50 active:bg-blue-100' // Estilo Normal
                }
      `}
        >
            {/* Etiqueta de Stock (Esquina superior) */}
            <div className={`
        absolute top-2 right-2 text-xs font-bold px-2 py-0.5 rounded-full
        ${sinStock ? 'bg-red-100 text-red-500' :
                    stockBajo ? 'bg-yellow-100 text-yellow-600' : 'bg-green-100 text-green-600'}
      `}>
                {sinStock ? 'AGOTADO' : `${producto.stock} disp.`}
            </div>

            <span className={`text-xl font-bold mb-2 leading-tight text-center ${sinStock ? 'text-gray-400' : 'text-facilito-azul'}`}>
                {producto.nombre}
            </span>

            <span className={`text-3xl font-black ${sinStock ? 'text-gray-300' : 'text-facilito-verde'}`}>
                ${producto.precio.toFixed(2)}
            </span>

            <span className="text-sm text-gray-400 mt-1 font-normal uppercase">
                {producto.categoria}
            </span>
        </button>
    );
};
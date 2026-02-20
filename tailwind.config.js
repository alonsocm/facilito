/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Paleta "Facilito": Colores fuertes y claros
                'facilito-fondo': '#F3F4F6', // Gris muy claro para no cansar la vista
                'facilito-azul': '#1E3A8A',  // Azul marino fuerte (Confianza/Títulos)
                'facilito-verde': '#15803D', // Verde fuerte (Acciones positivas/Cobrar)
                'facilito-rojo': '#B91C1C',  // Rojo fuerte (Borrar/Cancelar)
                'facilito-negro': '#111827', // Casi negro para texto principal
            },
            fontSize: {
                // Tamaños personalizados sin sobrescribir la escala base de Tailwind
                // Usamos nombres propios para evitar colisiones con text-lg, text-xl, etc.
                'pos-sm': '0.875rem',   // 14px (etiquetas, badges)
                'pos-base': '1rem',     // 16px (texto normal)
                'pos-md': '1.125rem',   // 18px (subtítulos)
                'pos-lg': '1.25rem',    // 20px (títulos secundarios)
                'pos-xl': '1.5rem',     // 24px (títulos principales)
                'pos-price': '2rem',    // 32px (precios)
                'pos-total': '2.5rem',  // 40px (totales)
                'pos-giant': '3rem',    // 48px (cambio/monto en pago)
            }
        },
    },
    plugins: [],
}
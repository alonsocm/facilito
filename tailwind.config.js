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
                // Sobreescribimos tamaños para asegurar legibilidad
                'base': '1.25rem',    // 20px (Texto normal)
                'lg': '1.5rem',       // 24px (Subtítulos)
                'xl': '2rem',         // 32px (Títulos grandes)
                '2xl': '3rem',        // 48px (Precios gigantes)
            }
        },
    },
    plugins: [],
}
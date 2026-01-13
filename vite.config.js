import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import basicSsl from '@vitejs/plugin-basic-ssl'
import { VitePWA } from 'vite-plugin-pwa' // <--- IMPORTAMOS

export default defineConfig({
  plugins: [
    react(),
    //basicSsl(),
    VitePWA({
      registerType: 'autoUpdate',
      // 👇👇👇 AGREGA ESTE BLOQUE AQUÍ 👇👇👇
      devOptions: {
        enabled: true
      },
      // 👆👆👆 FIN DEL BLOQUE 👆👆👆
      // Esto hace que el navegador descargue los archivos para que funcione medio offline
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}']
      },
      // Aquí definimos cómo se ve la App instalada
      manifest: {
        name: 'Abarrotes Facilito',
        short_name: 'Facilito POS',
        description: 'Punto de Venta Cloud',
        theme_color: '#1e3a8a', // Azul Facilito
        background_color: '#f3f4f6',
        display: 'standalone', // <--- ESTO QUITA LA BARRA DE NAVEGADOR
        orientation: 'landscape', // Sugiere horizontal en móviles
        icons: [
          {
            src: 'https://cdn-icons-png.flaticon.com/512/3081/3081559.png', // Usamos un icono genérico de tienda por ahora
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'https://cdn-icons-png.flaticon.com/512/3081/3081559.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  server: {
    host: true,
    https: true
  }
})
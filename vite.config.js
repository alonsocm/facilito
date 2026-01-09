import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import basicSsl from '@vitejs/plugin-basic-ssl' // <--- 1. IMPORTAR ESTO

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    basicSsl() // <--- 2. AGREGAR ESTO A LA LISTA
  ],
  server: {
    host: true,
    https: true // <--- 3. ASEGURAR QUE ESTO ESTÉ (el plugin usualmente lo activa solo, pero por si acaso)
  }
})
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      devOptions: { enabled: true, type: 'module' }, // se agrego
      injectRegister: 'auto', // se agrego
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        //activa el SW nuevo inmediatamente y toma control
        skipWaiting: true,
        clientsClaim: true,
        cleanupOutdatedCaches: true,
        navigateFallback: 'index.html',
        navigateFallbackDenylist: [/^\/api\//], // no interceptar tus endpoints API
      },
      manifest: {
        name: 'Gestion de Usuarios',
        short_name: 'Gestion Users',
        description: 'Algo', // se agrego
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        scope: '/',
        start_url: '/',
      }
    })
  ]
})

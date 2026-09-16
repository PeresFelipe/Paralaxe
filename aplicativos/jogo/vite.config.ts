import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  publicDir: 'publico',
  server: {
    host: '0.0.0.0',
    allowedHosts: ['terminal.local'],
  },
  plugins: [react(), VitePWA({
    registerType: 'prompt',
    includeAssets: ['favicon.svg'],
    manifest: {
      id: '/',
      name: 'Greywake',
      short_name: 'Greywake',
      description: 'RPG de progressão automática e fantasia sombria. Colete, produza e prepare sua próxima expedição.',
      lang: 'pt-BR',
      start_url: '/',
      scope: '/',
      display: 'standalone',
      background_color: '#10130f',
      theme_color: '#171d14',
      icons: [
        { src: '/icones/greywake-192.png', sizes: '192x192', type: 'image/png' },
        { src: '/icones/greywake-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
      ],
    },
    workbox: {
      globPatterns: ['**/*.{js,css,html,svg,png,webp,gif,ttf}', 'fontes/**/*.txt', 'arte/**/*.txt', 'creditos/**/*.txt'],
      maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
      cleanupOutdatedCaches: true,
      ignoreURLParametersMatching: [/^v$/, /^utm_/, /^fbclid$/],
      navigateFallback: 'index.html',
    },
  })],
})

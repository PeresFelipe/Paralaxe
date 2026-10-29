/**
 * @file Configuração de desenvolvimento, compilação e aplicativo web instalável.
 * O Vite serve publico na raiz da URL e gera o pacote final em dist.
 */
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import { fileURLToPath } from 'node:url'

export default defineConfig({
  // Recursos desta pasta são copiados sem transformação: /arte/... aponta para publico/arte/....
  publicDir: 'publico',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./fonte', import.meta.url)),
    },
  },
  server: {
    host: '0.0.0.0',
    allowedHosts: ['terminal.local'],
  },
  plugins: [react(), VitePWA({
    // Uma nova versão aguarda a confirmação apresentada por EstadoDoJogoWeb.
    registerType: 'prompt',
    includeAssets: ['favicon.svg'],
    // Metadados usados pelo navegador ao instalar o jogo e criar seu atalho.
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
      // Inclui também os avisos de autoria e fontes no cache disponível sem conexão.
      globPatterns: ['**/*.{js,css,html,svg,png,webp,gif,ttf}', 'fontes/**/*.txt', 'arte/**/*.txt', 'creditos/**/*.txt'],
      // Limite por arquivo do pré-cache; não é o limite de tamanho das partidas salvas.
      maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
      cleanupOutdatedCaches: true,
      // Permite localizar o mesmo recurso pré-armazenado com parâmetros de versão ou rastreamento.
      ignoreURLParametersMatching: [/^v$/, /^utm_/, /^fbclid$/],
      // Navegações atendidas pelo aplicativo web retornam a página de entrada.
      navigateFallback: 'index.html',
    },
  })],
})

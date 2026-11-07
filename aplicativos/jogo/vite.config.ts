/**
 * @file Configuração de desenvolvimento, compilação e aplicativo web instalável.
 * O Vite serve publico na raiz da URL e gera o pacote final em dist.
 */
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import { fileURLToPath } from 'node:url'
import { execFileSync } from 'node:child_process'

/** Prepara arquivos derivados antes de servir ou compilar (inclusive ao abrir pelo .bat). */
const animacoes = {
  name: 'preparar-animacoes-dos-oficios',
  buildStart() {
    execFileSync(process.execPath, ['ferramentas/prepararAnimacoesDeOficios.mjs'], {
      cwd: fileURLToPath(new URL('../../', import.meta.url)),
      stdio: 'inherit',
    })
  },
  configureServer() {
    execFileSync(process.execPath, ['ferramentas/prepararAnimacoesDeOficios.mjs'], {
      cwd: fileURLToPath(new URL('../../', import.meta.url)),
      stdio: 'inherit',
    })
  },
}

export default defineConfig({
  // Recursos desta pasta são copiados sem transformação: /arte/... aponta para publico/arte/....
  publicDir: 'publico',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./fonte', import.meta.url)),
    },
  },
  // Desenvolvimento e preview acessíveis apenas na própria máquina.
  // Não expor o servidor na LAN por padrão.
  server: {
    host: '127.0.0.1',
  },
  preview: {
    host: '127.0.0.1',
  },
  plugins: [animacoes, react(), VitePWA({
    // Uma nova versão aguarda a confirmação apresentada por EstadoDoJogoWeb.
    registerType: 'prompt',
    includeAssets: ['favicon.svg'],
    // Metadados usados pelo navegador ao instalar o jogo e criar seu atalho.
    manifest: {
      id: '/',
      name: 'Paralaxe',
      short_name: 'Paralaxe',
      description: 'RPG de progressão automática e fantasia sombria. Colete, produza e prepare sua próxima expedição.',
      lang: 'pt-BR',
      start_url: '/',
      scope: '/',
      display: 'standalone',
      background_color: '#10130f',
      theme_color: '#171d14',
      icons: [
        { src: '/icones/paralaxe-192.png', sizes: '192x192', type: 'image/png' },
        { src: '/icones/paralaxe-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
      ],
    },
    workbox: {
      // Inclui também os avisos de autoria e fontes no cache disponível sem conexão.
      globPatterns: ['**/*.{js,css,html,svg,png,webp,gif,ttf}', 'fontes/**/*.txt', 'arte/**/*.txt', 'creditos/**/*.txt'],
      // Fontes de geração e animações não utilizadas permanecem no repositório,
      // mas não são necessárias ao jogo offline. Todas as artes ativas e licenças ficam no cache.
      globIgnores: [
        'arte/classes/guerreiro/MattzArt/Sprites/**',
        'arte/classes/mago/LuizMelo/Wizard Pack/*.png',
        'arte/cidade/interface/vigilia-brasa.png',
        'arte/cidade/interface/vigilia-cronometro.png',
        'arte/atividades/{mineracao,lenhador,pesca,herbologia,metalurgia,forja,culinaria}.gif',
      ],
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

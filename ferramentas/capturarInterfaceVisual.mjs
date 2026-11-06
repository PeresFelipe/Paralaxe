/** Capturas para comparação manual do /ui-kit, sem pacotes adicionais. */
import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const raiz = fileURLToPath(new URL('../', import.meta.url))
const base = process.env.PARALAXE_URL ?? 'http://127.0.0.1:5173'
const saida = resolve(process.env.PARALAXE_EVIDENCIAS ?? join(raiz, 'artefatos', 'validacao-visual'))
const casos = [
  ...[320, 375, 768, 1024, 1440].flatMap(largura =>
    ['escuro', 'claro'].map(tema => ({ largura, altura: 850, tema }))),
  { largura: 320, altura: 640, tema: 'escuro', menu: true },
  { largura: 375, altura: 700, tema: 'claro', menu: true },
  { largura: 1440, altura: 800, tema: 'escuro', menu: true, aviso: true },
  { largura: 375, altura: 760, tema: 'escuro', aviso: true },
]

function navegador() {
  return [
    process.env.CHROME_PATH,
    process.env.LOCALAPPDATA && join(process.env.LOCALAPPDATA, 'Google', 'Chrome', 'Application', 'chrome.exe'),
    process.env.PROGRAMFILES && join(process.env.PROGRAMFILES, 'Google', 'Chrome', 'Application', 'chrome.exe'),
    process.env.PROGRAMFILES && join(process.env.PROGRAMFILES, 'Microsoft', 'Edge', 'Application', 'msedge.exe'),
    process.env['PROGRAMFILES(X86)'] && join(process.env['PROGRAMFILES(X86)'], 'Microsoft', 'Edge', 'Application', 'msedge.exe'),
    '/usr/bin/chromium', '/usr/bin/google-chrome',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  ].find(caminho => caminho && existsSync(caminho))
}

function captura(executavel, caso, caminho) {
  const pagina = new URL('/ui-kit', base)
  pagina.searchParams.set('tema', caso.tema)
  if (caso.menu) pagina.searchParams.set('menu', 'aberto')
  if (caso.aviso) pagina.searchParams.set('aviso', '1')
  const perfil = mkdtempSync(join(tmpdir(), 'paralaxe-ui-'))
  try {
    execFileSync(executavel, [
      ...(process.getuid?.() === 0 ? ['--no-sandbox'] : []),
      '--headless=new', '--disable-dev-shm-usage', '--disable-gpu', '--no-first-run',
      '--hide-scrollbars', '--force-device-scale-factor=1',
      `--user-data-dir=${perfil}`,
      `--window-size=${caso.largura},${caso.altura}`,
      '--virtual-time-budget=2500', `--screenshot=${caminho}`, pagina.href,
    ], { timeout: 30000, stdio: ['ignore', 'ignore', 'pipe'] })
    if (!existsSync(caminho) || readFileSync(caminho).subarray(0, 8).toString('hex') !== '89504e470d0a1a0a') {
      throw new Error('Chromium não produziu um PNG válido: ' + caminho)
    }
  } finally {
    rmSync(perfil, { recursive: true, force: true })
  }
}

async function principal() {
  const chrome = navegador()
  if (!chrome) throw new Error('Chrome/Edge não encontrado. Defina CHROME_PATH com o executável.')
  let resposta
  try { resposta = await fetch(new URL('/ui-kit', base), { signal: AbortSignal.timeout(5000) }) }
  catch { throw new Error(`Vite indisponível em ${base}. Execute pnpm desenvolver em outro terminal.`) }
  if (!resposta.ok || !(await resposta.text()).includes('id="raiz"')) throw new Error('A URL não abriu o Paralaxe em modo dev.')
  mkdirSync(saida, { recursive: true })
  const resultados = []
  for (const caso of casos) {
    const nome = `ui-kit-${caso.largura}-${caso.tema}${caso.menu ? '-menu' : ''}${caso.aviso ? '-aviso' : ''}.png`
    captura(chrome, caso, join(saida, nome))
    resultados.push({ ...caso, nome })
    console.log('Capturado:', nome)
  }
  const itens = resultados.map(c =>
    `<figure><a href="${c.nome}"><img src="${c.nome}" loading="lazy" alt="${c.largura}px, ${c.tema}"></a><figcaption>${c.largura}px · ${c.tema}${c.menu ? ' · menu' : ''}${c.aviso ? ' · aviso' : ''}</figcaption></figure>`).join('')
  writeFileSync(join(saida, 'index.html'), `<!doctype html><html lang="pt-BR"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Paralaxe — Comparação visual</title><style>body{font:15px system-ui;background:#182024;color:#f5f0df;padding:1.5rem}.grade{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,310px),1fr));gap:1rem}figure{margin:0}img{max-width:100%;border:1px solid #666}figcaption{padding:.5rem}</style><h1>Capturas do UI Kit</h1><p>Revise manualmente as imagens: a ferramenta não mede sobreposições automaticamente.</p><div class="grade">${itens}</div></html>`)
  writeFileSync(join(saida, 'manifesto.json'), JSON.stringify({ data: new Date().toISOString(), base, resultados }, null, 2))
  console.log('Comparador:', join(saida, 'index.html'))
}
principal().catch(erro => { console.error(erro.message); process.exitCode = 1 })

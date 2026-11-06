/**
 * Audita acessos estáticos aos CSS Modules.
 * Uma classe não declarada falha em silêncio no React; impedir isso antes do build.
 * Somente Node nativo, sem navegadores ou pacotes adicionais.
 */
import { readFile, readdir } from 'node:fs/promises'
import { dirname, extname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const raiz = fileURLToPath(new URL('../', import.meta.url))
const fonte = join(raiz, 'aplicativos', 'jogo', 'fonte')
const erros = []
let modulos = 0
let acessos = 0

async function arquivosEm(diretorio) {
  const arquivos = []
  for (const entrada of await readdir(diretorio, { withFileTypes: true })) {
    const caminho = join(diretorio, entrada.name)
    if (entrada.isDirectory()) arquivos.push(...await arquivosEm(caminho))
    else if (['.ts', '.tsx'].includes(extname(entrada.name))) arquivos.push(caminho)
  }
  return arquivos
}

function classesDeclaradas(css) {
  const semComentarios = css.replace(/\/\*[\s\S]*?\*\//g, '')
  return new Set(Array.from(
    semComentarios.matchAll(/\.([A-Za-z_][A-Za-z0-9_-]*)(?![A-Za-z0-9_-])/g),
    match => match[1],
  ))
}

for (const arquivo of await arquivosEm(fonte)) {
  const codigo = await readFile(arquivo, 'utf8')
  const semComentarios = codigo.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '')
  const imports = semComentarios.matchAll(
    /import\s+([A-Za-z_$][\w$]*)\s+from\s+['"]([^'"]+\.module\.css)['"]/g,
  )

  for (const [, apelido, caminho] of imports) {
    const absoluto = caminho.startsWith('@/')
      ? resolve(fonte, caminho.slice(2))
      : resolve(dirname(arquivo), caminho)
    let css
    try {
      css = await readFile(absoluto, 'utf8')
    } catch {
      erros.push(relative(raiz, arquivo) + ': CSS Module ausente ' + caminho)
      continue
    }

    modulos++
    const classes = classesDeclaradas(css)
    // O apelido do importador é um identificador JS: não requer escape adicional.
    const uso = new RegExp('\\b' + apelido + '\\.([A-Za-z_$][\\w$]*)\\b', 'g')
    for (const [, classe] of semComentarios.matchAll(uso)) {
      acessos++
      if (!classes.has(classe)) {
        erros.push(relative(raiz, arquivo) + ': ' + apelido + '.' + classe +
          ' não existe em ' + relative(raiz, absoluto))
      }
    }
  }
}

if (erros.length) {
  console.error('CSS Modules com referências inexistentes:\n- ' + erros.join('\n- '))
  process.exitCode = 1
} else {
  console.log('CSS Modules: ' + modulos + ' importações e ' + acessos + ' acessos verificados.')
}

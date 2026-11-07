/**
 * @file Verificação automatizada da cobertura do catálogo de créditos.
 * Confere arquivos, atribuições e avisos locais; não comprova a validade jurídica das licenças
 * nem a disponibilidade de páginas externas. Um erro resulta em código de saída não zero.
 */
import { readdir, readFile, stat } from 'node:fs/promises'
import { dirname, join, relative, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

/** Resolve o projeto a partir deste arquivo, independentemente da pasta de execução. */
const raiz = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const publico = join(raiz, 'aplicativos/jogo/publico')
const catalogo = JSON.parse(await readFile(join(raiz, 'aplicativos/jogo/fonte/catalogoDeCreditos.json'), 'utf8'))
const erros = []
const ids = new Set()
const grupos = new Set(catalogo.grupos.map((grupo) => grupo.id))

/** Percorre a pasta pública e normaliza separadores do sistema para caminhos de URL. */
async function listarArquivos(pasta) {
  const arquivos = []
  for (const entrada of await readdir(pasta, { withFileTypes: true })) {
    const caminho = join(pasta, entrada.name)
    if (entrada.isDirectory()) arquivos.push(...await listarArquivos(caminho))
    else arquivos.push('/' + relative(publico, caminho).split(sep).join('/'))
  }
  return arquivos
}
const arquivos = await listarArquivos(publico)
/** Restringe a cobertura obrigatória aos formatos de imagem e fonte distribuídos. */
const recursosVisuais = arquivos.filter((arquivo) => /\.(png|gif|webp|svg|ttf|woff2?|jpe?g|avif|otf)$/i.test(arquivo))
/** Caminhos terminados em / abrangem uma pasta inteira; os demais identificam um único arquivo. */
const pertence = (arquivo, caminho) => caminho.endsWith('/') ? arquivo.startsWith(caminho) : arquivo === caminho
const avisos = new Set(['/creditos/LEIA-ME.txt'])

// Primeiro valida cada registro: identidade, grupo, atribuição, referências e arquivos existentes.
for (const recurso of catalogo.recursos) {
  if (ids.has(recurso.id)) erros.push(`Crédito duplicado: ${recurso.id}`)
  ids.add(recurso.id)
  if (!grupos.has(recurso.grupo)) erros.push(`Grupo desconhecido: ${recurso.id}`)
  if (!recurso.titulo?.trim() || !recurso.autores?.length || recurso.autores.some((autor) => !autor.nome?.trim()) || !recurso.licenca?.nome?.trim()) erros.push(`Atribuição incompleta: ${recurso.id}`)
  const links = [recurso.origem, recurso.licenca.url, ...recurso.autores.map((autor) => autor.url), ...recurso.avisos.map((aviso) => aviso.url), ...recurso.creditosComplementares.flatMap((credito) => [credito.url, credito.urlLicenca])].filter(Boolean)
  for (const link of links) {
    if (link.startsWith('/') && !link.startsWith('//')) avisos.add(link)
    else if (!link.startsWith('https://')) erros.push(`Link inválido: ${link}`)
  }
  if (!['tecnologia', 'referencias'].includes(recurso.grupo) && !recurso.arquivos.length) erros.push(`Crédito sem arquivos: ${recurso.id}`)
  for (const caminho of recurso.arquivos) {
    if (!caminho.startsWith('/') || caminho.includes('..') || !recursosVisuais.some((arquivo) => pertence(arquivo, caminho))) erros.push(`Caminho sem recurso correspondente: ${recurso.id} → ${caminho}`)
  }
}
// Projetos MIT efetivamente copiados exigem o copyright e o aviso completo
// distribuídos na mesma versão do jogo, além dos links da janela de créditos.
for (const [id, aviso, autor] of [
  ['referencia-universal-ai', '/creditos/universal-ai-MIT.txt', 'TechLuddite'],
  ['referencia-iktahmetrics', '/creditos/iktahmetrics-MIT.txt', 'Merrill Lines'],
  ['referencia-idle-game-template', '/creditos/idle-game-template-MIT.txt', 'ciefa'],
  ['referencia-skill-issue-chronicles', '/creditos/skill-issue-chronicles-MIT.txt', 'Gylan Salih'],
]) {
  const entrada = catalogo.recursos.find((recurso) => recurso.id === id)
  if (!entrada?.avisos.some((item) => item.url === aviso)) erros.push(`Crédito de código MIT sem aviso: ${id}`)
  try {
    const licenca = await readFile(resolve(publico, '.' + aviso), 'utf8')
    const copyright = autor === 'Gylan Salih' ? 'Copyright (c) 2025 Gylan Salih' : 'Copyright (c) 2026 ' + autor
    if (!licenca.includes('MIT License') || !licenca.includes(copyright) ||
        !licenca.includes('THE SOFTWARE IS PROVIDED')) {
      erros.push(`Aviso MIT incompleto ou titular incorreto: ${id}`)
    }
  } catch {
    erros.push(`Arquivo obrigatório de copyright MIT ausente: ${id}`)
  }
}

// Cada arquivo deve ter exatamente um registro proprietário; isso detecta omissões e sobreposições.
for (const arquivo of recursosVisuais) {
  const autores = catalogo.recursos.filter((recurso) => recurso.arquivos.some((caminho) => pertence(arquivo, caminho)))
  if (autores.length !== 1) erros.push(`${arquivo}: esperado um crédito, encontrados ${autores.length}`)
}
// Resolve links locais dentro da pasta pública e verifica se os avisos serão realmente distribuídos.
for (const aviso of avisos) {
  const caminho = resolve(publico, '.' + aviso)
  if (!caminho.startsWith(publico + sep) || !(await stat(caminho).catch(() => null))?.isFile()) erros.push(`Aviso local ausente: ${aviso}`)
}
if (erros.length) {
  console.error('A revisão dos créditos encontrou problemas:\n' + erros.map((erro) => '- ' + erro).join('\n'))
  process.exitCode = 1
} else console.log(`Créditos verificados: ${recursosVisuais.length} recursos visuais, ${catalogo.recursos.length} contribuições e ${avisos.size} avisos locais.`)

import { readdir, readFile, stat } from 'node:fs/promises'
import { dirname, join, relative, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const raiz = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const publico = join(raiz, 'aplicativos/jogo/publico')
const catalogo = JSON.parse(await readFile(join(raiz, 'aplicativos/jogo/fonte/catalogoDeCreditos.json'), 'utf8'))
const erros = []
const ids = new Set()
const grupos = new Set(catalogo.grupos.map((grupo) => grupo.id))

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
const recursosVisuais = arquivos.filter((arquivo) => /\.(png|gif|webp|svg|ttf|woff2?|jpe?g|avif|otf)$/i.test(arquivo))
const pertence = (arquivo, caminho) => caminho.endsWith('/') ? arquivo.startsWith(caminho) : arquivo === caminho
const avisos = new Set(['/creditos/LEIA-ME.txt'])

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
  if (recurso.grupo !== 'tecnologia' && !recurso.arquivos.length) erros.push(`Crédito sem arquivos: ${recurso.id}`)
  for (const caminho of recurso.arquivos) {
    if (!caminho.startsWith('/') || caminho.includes('..') || !recursosVisuais.some((arquivo) => pertence(arquivo, caminho))) erros.push(`Caminho sem recurso correspondente: ${recurso.id} → ${caminho}`)
  }
}
for (const arquivo of recursosVisuais) {
  const autores = catalogo.recursos.filter((recurso) => recurso.arquivos.some((caminho) => pertence(arquivo, caminho)))
  if (autores.length !== 1) erros.push(`${arquivo}: esperado um crédito, encontrados ${autores.length}`)
}
for (const aviso of avisos) {
  const caminho = resolve(publico, '.' + aviso)
  if (!caminho.startsWith(publico + sep) || !(await stat(caminho).catch(() => null))?.isFile()) erros.push(`Aviso local ausente: ${aviso}`)
}
if (erros.length) {
  console.error('A revisão dos créditos encontrou problemas:\n' + erros.map((erro) => '- ' + erro).join('\n'))
  process.exitCode = 1
} else console.log(`Créditos verificados: ${recursosVisuais.length} recursos visuais, ${catalogo.recursos.length} contribuições e ${avisos.size} avisos locais.`)

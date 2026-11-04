/**
 * @file Gera versões de cadência confortável sem substituir os GIFs originais.
 * Executado pelo Vite no desenvolvimento e na compilação.
 * Inspeciona os tempos reais de todos os quadros, sem alterar paleta ou imagens.
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { join, resolve } from 'node:path'

const pasta = fileURLToPath(new URL('../aplicativos/jogo/publico/arte/atividades/', import.meta.url))
const nomes = ['mineracao', 'lenhador', 'pesca', 'herbologia', 'metalurgia', 'forja', 'culinaria']
const alvoEmCentissegundos = 320
const minimoEmCentissegundos = 250
const maximoEmCentissegundos = 400

/** Avança blocos de dados GIF sem tentar descomprimir os quadros. */
function saltarSubBlocos(bytes, posicao) {
  while (posicao < bytes.length) {
    const comprimento = bytes[posicao]
    posicao += 1 + comprimento
    if (comprimento === 0) return posicao
    if (posicao > bytes.length) throw new Error('Bloco GIF truncado')
  }
  throw new Error('Sub-bloco GIF sem terminador')
}

/** Lê dimensões, número de quadros, atrasos e modo de repetição. */
export function inspecionarGif(bytes) {
  if (bytes.subarray(0, 6).toString('ascii') !== 'GIF89a' && bytes.subarray(0, 6).toString('ascii') !== 'GIF87a') {
    throw new Error('Assinatura GIF inválida')
  }
  const largura = bytes.readUInt16LE(6)
  const altura = bytes.readUInt16LE(8)
  const campos = bytes[10]
  let posicao = 13 + ((campos & 0x80) ? 3 * (2 ** ((campos & 0x07) + 1)) : 0)
  const atrasos = []
  let gce = null
  let repeticao = 'não especificada'
  while (posicao < bytes.length) {
    const tipo = bytes[posicao++]
    if (tipo === 0x3b) break
    if (tipo === 0x21) {
      const extensao = bytes[posicao++]
      if (extensao === 0xf9) {
        if (bytes[posicao] !== 4) throw new Error('Graphic Control Extension inválida')
        gce = posicao + 2
        posicao += 6
        continue
      }
      if (extensao === 0xff) {
        const tamanho = bytes[posicao++]
        const identificador = bytes.subarray(posicao, posicao + tamanho).toString('ascii')
        posicao += tamanho
        if (identificador.startsWith('NETSCAPE')) {
          const tamanhoLoop = bytes[posicao]
          if (tamanhoLoop >= 3 && bytes[posicao + 1] === 1) {
            const loop = bytes.readUInt16LE(posicao + 2)
            repeticao = loop === 0 ? 'infinita' : String(loop)
          }
        }
        posicao = saltarSubBlocos(bytes, posicao)
      } else {
        posicao = saltarSubBlocos(bytes, posicao)
      }
    } else if (tipo === 0x2c) {
      if (posicao + 9 > bytes.length) throw new Error('Quadro GIF truncado')
      const flags = bytes[posicao + 8]
      posicao += 9
      if (flags & 0x80) posicao += 3 * (2 ** ((flags & 0x07) + 1))
      posicao += 1 // tamanho inicial do código LZW
      posicao = saltarSubBlocos(bytes, posicao)
      // Alguns GIFs não declaram duração: um quadro padrão recebe 100 ms.
      const atrasoOriginal = gce === null ? null : bytes.readUInt16LE(gce)
      atrasos.push({ posicao: gce, centissegundos: Math.max(2, atrasoOriginal ?? 10) })
      gce = null
    } else {
      throw new Error(`Marcador GIF desconhecido: 0x${tipo.toString(16)}`)
    }
  }
  if (!atrasos.length) throw new Error('GIF sem quadros')
  return { largura, altura, atrasos, repeticao, duracao: atrasos.reduce((soma, quadro) => soma + quadro.centissegundos, 0) }
}

/** Ajusta os atrasos dos quadros, preservando seus pesos relativos e a codificação original. */
export function suavizarGif(original) {
  const info = inspecionarGif(original)
  const alterado = Buffer.from(original)
  const precisaAjuste = info.duracao < minimoEmCentissegundos || info.duracao > maximoEmCentissegundos
  if (precisaAjuste) {
    if (info.atrasos.some((quadro) => quadro.posicao === null)) {
      throw new Error('Animação sem Graphic Control Extension; não é seguro modificar a cadência')
    }
    const fator = alvoEmCentissegundos / info.duracao
    for (const quadro of info.atrasos) {
      const valor = Math.min(65535, Math.max(2, Math.round(quadro.centissegundos * fator)))
      alterado.writeUInt16LE(valor, quadro.posicao)
    }
  }
  return { alterado, antes: info, depois: inspecionarGif(alterado), ajustado: precisaAjuste }
}

/** Consolida um relatório determinístico para cada recurso e gera as cópias derivadas. */
export function prepararAnimacoesDeOficios() {
  mkdirSync(pasta, { recursive: true })
  const relatorio = []
  for (const nome of nomes) {
    const origem = join(pasta, `${nome}.gif`)
    const destino = join(pasta, `${nome}-suave.gif`)
    if (!existsSync(origem)) throw new Error(`GIF original não encontrado: ${origem}`)
    const resultado = suavizarGif(readFileSync(origem))
    if (!existsSync(destino) || !readFileSync(destino).equals(resultado.alterado)) {
      writeFileSync(destino, resultado.alterado)
    }
    relatorio.push({
      oficio: nome,
      resolucao: `${resultado.antes.largura}x${resultado.antes.altura}`,
      quadros: resultado.antes.atrasos.length,
      duracaoOriginal: +(resultado.antes.duracao / 100).toFixed(2),
      duracaoSuave: +(resultado.depois.duracao / 100).toFixed(2),
      repeticao: resultado.antes.repeticao,
      ajustado: resultado.ajustado,
    })
  }
  console.table(relatorio)
  return relatorio
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  prepararAnimacoesDeOficios()
}

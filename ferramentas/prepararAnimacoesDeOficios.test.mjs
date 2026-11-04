import { test } from 'node:test'
import { strict as assert } from 'node:assert'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { prepararAnimacoesDeOficios, inspecionarGif, suavizarGif } from './prepararAnimacoesDeOficios.mjs'

const pasta = fileURLToPath(new URL('../aplicativos/jogo/publico/arte/atividades/', import.meta.url))
const nomes = ['mineracao', 'lenhador', 'pesca', 'herbologia', 'metalurgia', 'forja', 'culinaria']

test('reconhece os sete GIFs, gera derivados reproduzíveis e conserva dimensões e quadros', () => {
  const relatorio = prepararAnimacoesDeOficios()
  assert.equal(relatorio.length, 7)
  for (const nome of nomes) {
    const original = readFileSync(`${pasta}${nome}.gif`)
    const convertido = suavizarGif(original)
    const info = inspecionarGif(convertido.alterado)
    assert.equal(info.largura, convertido.antes.largura)
    assert.equal(info.altura, convertido.antes.altura)
    assert.equal(info.atrasos.length, convertido.antes.atrasos.length)
    assert.ok(info.duracao >= 250 && info.duracao <= 400, `${nome}: ${info.duracao / 100}s`)
    assert.ok(readFileSync(`${pasta}${nome}-suave.gif`).equals(convertido.alterado))
    assert.ok(suavizarGif(original).alterado.equals(convertido.alterado))
  }
})

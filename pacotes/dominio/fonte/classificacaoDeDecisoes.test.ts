import { describe, expect, it } from 'vitest'
import { classificarDecisoes, pontuarDecisao, PESO_DE_ADERENCIA_A_DIRETRIZ } from './classificacaoDeDecisoes'

describe('motor MIT adaptado de decisões', () => {
  it('pontua benefício e aderência conforme o algoritmo original do Universal-AI', () => {
    const pontuada = pontuarDecisao({ id: 'coletar', utilidade: 0.8, alinhamento: 0.5, motivo: 'material faltante' })
    expect(PESO_DE_ADERENCIA_A_DIRETRIZ).toBe(0.35)
    expect(pontuada.pontuacao).toBeCloseTo(0.8 * (1 - 0.35 + 0.35 * 0.5))
    expect(pontuada.motivo).toBe('material faltante')
  })

  it('ordena todas as alternativas, com justificativa, sem alterar o estado de entrada', () => {
    const opcoes = Object.freeze([
      Object.freeze({ id: 'menos', utilidade: 0.2, motivo: 'pouco benefício' }),
      Object.freeze({ id: 'mais', utilidade: 0.9, motivo: 'maior benefício' }),
      Object.freeze({ id: 'meio', utilidade: 0.5, motivo: 'benefício médio' }),
    ] as const)
    const classificadas = classificarDecisoes(opcoes)
    expect(classificadas.map(c => c.id)).toEqual(['mais', 'meio', 'menos'])
    expect(classificadas.every(c => c.motivo.length > 0)).toBe(true)
    expect(opcoes[0].id).toBe('menos')
  })

  it('reordena conforme a diretriz, desempata com estabilidade e não usa RNG', () => {
    const opcoes = [
      { id: 'seguro', utilidade: 0.8, alinhamento: 1, motivo: 'configuração atual' },
      { id: 'rapido', utilidade: 0.83, alinhamento: 0.4, motivo: 'nova configuração' },
    ] as const
    expect(classificarDecisoes(opcoes)[0]?.id).toBe('seguro')
    const empate = [
      { id: 'primeiro', utilidade: 0.5, motivo: 'um' },
      { id: 'segundo', utilidade: 0.5, motivo: 'dois' },
    ] as const
    expect(classificarDecisoes(empate).map(c => c.id)).toEqual(['primeiro', 'segundo'])
  })

  it('protege cálculos contra NaN, infinito e valores fora do intervalo', () => {
    const opcoes = classificarDecisoes([
      { id: 'quebrado', utilidade: Number.NaN, alinhamento: Infinity, motivo: 'inválido' },
      { id: 'normal', utilidade: 2, alinhamento: -5, motivo: 'limitado' },
    ])
    expect(opcoes.every(c => Number.isFinite(c.pontuacao) && c.pontuacao >= 0 && c.pontuacao <= 1)).toBe(true)
    expect(opcoes[0]?.id).toBe('normal')
  })
})

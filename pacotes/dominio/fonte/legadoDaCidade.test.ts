import { describe, expect, it } from 'vitest'
import type { PartidaLocal } from './personagem'
import { criarLegadoInicial, consultarProjeto, concluirProjeto, estagioDoLegado, totalDeMelhoriasDaCidade, validarLegado, type DefinicaoDeProjetoDaCidade } from './legadoDaCidade'

const AGORA = '2026-11-03T12:00:00.000Z'
const projeto: DefinicaoDeProjetoDaCidade = {
  id: 'cidade.praca.nivel-1', distrito: 'praca', nivel: 1,
  nome: 'Reabrir a Praça', descricao: 'Restaurar a praça', conclusao: 'A praça está de pé',
  requisitos: [{ tipo: 'nivel-personagem', nivel: 1 }],
  materiais: [{ idDaDefinicao: 'material.cloch', nome: 'Cloch', quantidade: 3 }], ouro: 12,
}
function partida(): PartidaLocal {
  return {
    legado: criarLegadoInicial(),
    personagem: { nivel: 1, ouro: 12, inventario: [{ idDaDefinicao: 'material.cloch', quantidade: 2 }],
      banco: { inventario: [{ idDaDefinicao: 'material.cloch', quantidade: 1 }], itensDeEquipamento: [] } },
    combate: { loboDerrotado: false }, masmorra: { contratoConcluido: false },
    jornada: { idsDasReceitasFabricadas: [] }, desafios: { idsConcluidos: [] }, codice: { idsDescobertos: [] },
    profissoes: { mineracao: { nivel: 1, prestigio: 0 }, lenhador: { nivel: 1, prestigio: 0 },
      pesca: { nivel: 1, prestigio: 0 }, herbologia: { nivel: 1, prestigio: 0 },
      metalurgia: { nivel: 1, prestigio: 0 }, forja: { nivel: 1, prestigio: 0 }, culinaria: { nivel: 1, prestigio: 0 } },
  } as unknown as PartidaLocal
}
describe('Legado da Cidade Livre', () => {
  it('disponibiliza o primeiro projeto sem impor tempo de espera', () => {
    expect(consultarProjeto(partida(), projeto).situacao).toBe('pronto')
  })
  it('usa inventário e banco para calcular materiais e debitar apenas uma vez', () => {
    const antes = partida()
    const depois = concluirProjeto(antes, projeto, AGORA)
    expect(antes.personagem.ouro).toBe(12)
    expect(depois.personagem.ouro).toBe(0)
    expect(depois.personagem.inventario).toEqual([])
    expect(depois.personagem.banco.inventario).toEqual([])
    expect(depois.legado.distritos.praca).toBe(1)
    expect(depois.legado.historico).toHaveLength(1)
    expect(concluirProjeto(depois, projeto, AGORA)).toBe(depois)
  })
  it('nunca consome materiais em uma tentativa com recursos insuficientes', () => {
    const p = partida()
    p.personagem.banco.inventario = []
    expect(consultarProjeto(p, projeto).situacao).toBe('disponivel')
    expect(() => concluirProjeto(p, projeto, AGORA)).toThrow()
    expect(p.personagem.inventario[0]?.quantidade).toBe(2)
    expect(p.legado.distritos.praca).toBe(0)
  })
  it('bloqueia conquistas não concluídas e etapas fora de sequência', () => {
    const p = partida()
    expect(consultarProjeto(p, { ...projeto, requisitos: [{ tipo: 'combate-vitoria' }] }).situacao).toBe('bloqueado')
    expect(consultarProjeto(p, { ...projeto, nivel: 3 }).situacao).toBe('bloqueado')
  })
  it('créditos da Vigília antiga cobrem somente parte das moedas', () => {
    const p = partida()
    p.legado.creditosDeTransicao = 10
    const consulta = consultarProjeto(p, projeto)
    expect(consulta.ouroNecessario).toBe(6)
    expect(consulta.creditosAplicaveis).toBe(3)
    const concluida = concluirProjeto(p, projeto, AGORA)
    expect(concluida.legado.creditosDeTransicao).toBe(7)
    expect(concluida.personagem.ouro).toBe(6)
  })
  it('respeita os cinco estágios sem voltar ao estágio anterior', () => {
    const p = partida()
    expect(estagioDoLegado(p.legado)).toBe(0)
    for (const [total, estagio] of [[3, 1], [8, 2], [15, 3], [24, 4]] as const) {
      const modificada = criarLegadoInicial()
      for (const id of Object.keys(modificada.distritos) as Array<keyof typeof modificada.distritos>) modificada.distritos[id] = 0
      const ids = Object.keys(modificada.distritos) as Array<keyof typeof modificada.distritos>
      for (let i = 0; i < total; i++) modificada.distritos[ids[i % ids.length]!]++
      expect(totalDeMelhoriasDaCidade(modificada)).toBe(total)
      expect(estagioDoLegado(modificada)).toBe(estagio)
    }
  })
  it('impede valores inválidos de migrar para o save', () => {
    expect(() => validarLegado({ ...criarLegadoInicial(), creditosDeTransicao: -1 })).toThrow()
    expect(() => validarLegado({ ...criarLegadoInicial(), distritos: { praca: 1 } })).toThrow()
    expect(() => validarLegado(criarLegadoInicial())).not.toThrow()
  })
})

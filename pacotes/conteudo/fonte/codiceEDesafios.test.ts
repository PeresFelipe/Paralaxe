import { describe, expect, it } from 'vitest'
import { atualizarCodiceEDesafios, DESAFIOS, ENTRADAS_DO_CODICE, obterDescobertasComprovadas } from './codiceEDesafios'
import { criarPartidaLocal } from '@greywake/dominio'
import { CLASSES_DE_PERSONAGEM, PRESENTES_INICIAIS } from './criacaoDePersonagem'

function partidaInicial() {
  const classe = CLASSES_DE_PERSONAGEM.find((item) => item.id === 'errante')!
  const presente = PRESENTES_INICIAIS.find((item) => item.id === 'nenhum')!
  return criarPartidaLocal({ idDaPartida: 'codice-teste', criadoEm: '2026-10-29T12:00:00.000Z', versaoDoConteudo: 'test', nomeDoPersonagem: 'Teste', classeDoPersonagem: classe, presente })
}

describe('Códice e Desafios', () => {
  it('descobre a classe e equipamento inicial sem inferir fabricações não realizadas', () => {
    const partida = partidaInicial()
    const ids = obterDescobertasComprovadas(partida)
    expect(ids).toContain('classe.errante')
    expect(ids.some((id) => id.startsWith('equipamento.'))).toBe(true)
    expect(ids.some((id) => id.startsWith('receita.'))).toBe(false)
  })

  it('registra fabricação, progresso do Códice e conclusão de desafio de forma persistente', () => {
    const partida = partidaInicial()
    const comFabricacao = { ...partida, jornada: { meta: null, idsDasReceitasFabricadas: ['receita.metalurgia.tratada-cloch'] } }
    const atualizado = atualizarCodiceEDesafios(comFabricacao)
    expect(atualizado.codice.idsDescobertos).toContain('receita.receita.metalurgia.tratada-cloch')
    expect(atualizado.desafios.idsConcluidos).toContain('desafio.primeira-receita')
    expect(atualizarCodiceEDesafios(atualizado)).toBe(atualizado)
    expect(ENTRADAS_DO_CODICE.length).toBeGreaterThan(60)
    expect(DESAFIOS.length).toBeGreaterThan(0)
  })
})

import { describe, expect, it } from 'vitest'
import { CLASSES_DE_PERSONAGEM, PRESENTES_INICIAIS, VERSAO_DO_CONTEUDO, ATIVIDADES_OCIOSAS_INICIAIS } from '@paralaxe/conteudo'
import { criarPartidaLocal, iniciarAtividadeOciosa } from '@paralaxe/dominio'
import { processarTrabalhoAtual } from './partida'
import { obterDetalhesDoRetorno } from './resumoDoRetorno'

function partidaInicial() {
  return criarPartidaLocal({
    idDaPartida: 'resumo-retorno',
    criadoEm: '2026-01-01T00:00:00.000Z',
    versaoDoConteudo: VERSAO_DO_CONTEUDO,
    nomeDoPersonagem: 'Aedan',
    classeDoPersonagem: CLASSES_DE_PERSONAGEM.find(c => c.id === 'guerreiro')!,
    presente: PRESENTES_INICIAIS.find(p => p.id === 'nenhum')!,
  })
}

describe('resumo de retorno offline', () => {
  it('usa apenas o saldo efetivamente concedido sem alterar a partida', () => {
    const anterior = iniciarAtividadeOciosa(partidaInicial(), ATIVIDADES_OCIOSAS_INICIAIS[0]!, '2026-01-01T00:00:00.000Z')
    const reconciliado = processarTrabalhoAtual(anterior, '2026-01-01T00:00:08.000Z')
    const antes = JSON.stringify(reconciliado.partida)
    expect(obterDetalhesDoRetorno(anterior, reconciliado.partida, 8000, reconciliado.textoExibido).join(' ')).toContain('+2 Cloch')
    expect(JSON.stringify(reconciliado.partida)).toBe(antes)
    expect(obterDetalhesDoRetorno(reconciliado.partida, reconciliado.partida, 0, null)).toEqual([])
  })
  it('identifica limite offline e interrupção por capacidade', () => {
    const inicial = partidaInicial()
    expect(obterDetalhesDoRetorno(inicial, inicial, 100_000_000, null)).toEqual([])
    const ativo = iniciarAtividadeOciosa(inicial, ATIVIDADES_OCIOSAS_INICIAIS[0]!, '2026-01-01T00:00:00.000Z')
    expect(obterDetalhesDoRetorno(ativo, ativo, 100_000_000, 'interrompida por capacidade').join(' ')).toContain('Limite de progresso')
  })
})

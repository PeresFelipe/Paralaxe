import { describe, expect, it } from 'vitest'
import { ATIVIDADES_OCIOSAS_INICIAIS, CLASSES_DE_PERSONAGEM, PRESENTES_INICIAIS, RECEITAS_INICIAIS_DE_FABRICACAO, VERSAO_DO_CONTEUDO } from '@paralaxe/conteudo'
import { criarPartidaLocal, escolherMetaDaJornada, iniciarAtividadeOciosa, iniciarAtividadeSecundaria } from '@paralaxe/dominio'
import { obterSugestaoDePrioridadeDaJornada } from './sugestaoDePrioridade'

const agora = '2026-01-01T00:00:00.000Z'
const cloch = ATIVIDADES_OCIOSAS_INICIAIS.find(a => a.id === 'coletar.mineracao.cloch')!
const stan = ATIVIDADES_OCIOSAS_INICIAIS.find(a => a.id === 'coletar.mineracao.stan')!
function preparar() {
  const p = criarPartidaLocal({ idDaPartida: 'sugestao', criadoEm: agora, versaoDoConteudo: VERSAO_DO_CONTEUDO,
    nomeDoPersonagem: 'Aedan', classeDoPersonagem: CLASSES_DE_PERSONAGEM.find(c => c.id === 'guerreiro')!,
    presente: PRESENTES_INICIAIS.find(p => p.id === 'nenhum')! })
  const comPrestigio = { ...p, profissoes: { ...p.profissoes, mineracao: { nivel: 10, xp: 0, prestigio: 2 } } }
  return escolherMetaDaJornada(comPrestigio, RECEITAS_INICIAIS_DE_FABRICACAO.find(r => r.id === 'receita.metalurgia.tratada-cloch')!, agora)
}
describe('sugestão de prioridade', () => {
  it('sugere principal sem alterar a partida', () => {
    const p = iniciarAtividadeSecundaria(iniciarAtividadeOciosa(preparar(), cloch, agora), stan, agora)
    const snapshot = JSON.stringify(p)
    expect(obterSugestaoDePrioridadeDaJornada(p)?.prioridade).toBe('principal')
    expect(JSON.stringify(p)).toBe(snapshot)
  })
  it('sugere secundária quando só ela traz o ingrediente', () => {
    const p = iniciarAtividadeSecundaria(iniciarAtividadeOciosa(preparar(), stan, agora), cloch, agora)
    expect(obterSugestaoDePrioridadeDaJornada(p)?.prioridade).toBe('secundaria')
  })
})

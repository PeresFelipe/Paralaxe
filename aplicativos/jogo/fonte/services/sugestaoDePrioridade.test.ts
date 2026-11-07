import { describe, expect, it } from 'vitest'
import { ATIVIDADES_OCIOSAS_INICIAIS, CLASSES_DE_PERSONAGEM, PRESENTES_INICIAIS, RECEITAS_INICIAIS_DE_FABRICACAO, VERSAO_DO_CONTEUDO } from '@paralaxe/conteudo'
import { criarPartidaLocal, escolherMetaDaJornada, iniciarAtividadeOciosa, iniciarAtividadeSecundaria, iniciarAtividadeTerciaria } from '@paralaxe/dominio'
import { obterSugestaoDePrioridadeDaJornada } from './sugestaoDePrioridade'

const agora = '2026-01-01T00:00:00.000Z'
const cloch = ATIVIDADES_OCIOSAS_INICIAIS.find(a => a.id === 'coletar.mineracao.cloch')!
const stan = ATIVIDADES_OCIOSAS_INICIAIS.find(a => a.id === 'coletar.mineracao.stan')!
const copar = ATIVIDADES_OCIOSAS_INICIAIS.find(a => a.id === 'coletar.mineracao.copar')!
function preparar() {
  const p = criarPartidaLocal({ idDaPartida: 'sugestao', criadoEm: agora, versaoDoConteudo: VERSAO_DO_CONTEUDO,
    nomeDoPersonagem: 'Aedan', classeDoPersonagem: CLASSES_DE_PERSONAGEM.find(c => c.id === 'guerreiro')!,
    presente: PRESENTES_INICIAIS.find(p => p.id === 'nenhum')! })
  const comPrestigio = { ...p, profissoes: { ...p.profissoes, mineracao: { nivel: 10, xp: 0, prestigio: 2 } } }
  return escolherMetaDaJornada(comPrestigio, RECEITAS_INICIAIS_DE_FABRICACAO.find(r => r.id === 'receita.metalurgia.tratada-cloch')!, agora)
}
describe('sugestão de prioridade', () => {
  it('mantém a prioridade atual quando o arredondamento elimina o ganho', () => {
    const p = iniciarAtividadeSecundaria(iniciarAtividadeOciosa(preparar(), cloch, agora), stan, agora)
    const snapshot = JSON.stringify(p)
    const sugestao = obterSugestaoDePrioridadeDaJornada(p)
    // Com Cloch (4s), arredondar 4/1.25 para 4s não produz ganho;
    // manter Equilibrado evita recomendar uma troca inútil.
    expect(sugestao?.prioridade).toBe('equilibrado')
    expect(sugestao?.opcoes).toHaveLength(3)
    expect(sugestao?.opcoes.every(opcao => opcao.motivo.length > 0)).toBe(true)
    expect(sugestao?.opcoes[0]?.pontuacao).toBeGreaterThanOrEqual(sugestao?.opcoes[1]?.pontuacao ?? 0)
    expect(JSON.stringify(p)).toBe(snapshot)
  })
  it('sugere secundária quando só ela traz o ingrediente', () => {
    const p = iniciarAtividadeSecundaria(iniciarAtividadeOciosa(preparar(), stan, agora), cloch, agora)
    expect(obterSugestaoDePrioridadeDaJornada(p)?.prioridade).toBe('secundaria')
  })

  it('não inventa conselho quando a meta já foi atendida ou há menos de dois trabalhos', () => {
    const p = preparar()
    expect(obterSugestaoDePrioridadeDaJornada(p)).toBeNull()
    const uma = iniciarAtividadeOciosa(p, cloch, agora)
    expect(obterSugestaoDePrioridadeDaJornada(uma)).toBeNull()
  })

  it('considera o terceiro trabalho e mantém a recomendação determinística', () => {
    const p = iniciarAtividadeSecundaria(iniciarAtividadeOciosa(preparar(), stan, agora), cloch, agora)
    const antes = JSON.stringify(p)
    const um = obterSugestaoDePrioridadeDaJornada(p)
    const dois = obterSugestaoDePrioridadeDaJornada(p)
    expect(um).toEqual(dois)
    expect(JSON.stringify(p)).toBe(antes)
  })
  it('inclui terceiro trabalho e não sugere alterar uma prioridade sem ganho efetivo', () => {
    const inicial = preparar()
    const mineracao = { ...inicial.profissoes.mineracao, nivel: 30, prestigio: 3 }
    const preparada = { ...inicial, profissoes: { ...inicial.profissoes, mineracao } }
    const comDuas = iniciarAtividadeSecundaria(iniciarAtividadeOciosa(preparada, stan, agora), copar, agora)
    const comTres = iniciarAtividadeTerciaria(comDuas, cloch, agora)
    const antes = JSON.stringify(comTres)
    const sugestao = obterSugestaoDePrioridadeDaJornada(comTres)
    expect(sugestao?.opcoes).toHaveLength(3)
    expect(sugestao?.motivo).toContain('Cloch')
    expect(sugestao?.prioridade).toBe('equilibrado')
    expect(JSON.stringify(comTres)).toBe(antes)
  })

})

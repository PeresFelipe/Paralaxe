import { describe, expect, it } from 'vitest'
import { ATIVIDADES_OCIOSAS_INICIAIS, CLASSES_DE_PERSONAGEM, PRESENTES_INICIAIS, VERSAO_DO_CONTEUDO, obterDefinicaoDeReceitaDeFabricacao } from '@paralaxe/conteudo'
import { criarPartidaLocal, iniciarAtividadeOciosa, iniciarAtividadeSecundaria, iniciarAtividadeTerciaria, iniciarReceitaDeFabricacao, iniciarReceitaSecundaria, configurarPrioridadeDaColeta } from '@paralaxe/dominio'
import { obterProgressoDoTrabalho } from './visualizacaoDoTrabalho'

function criarPartida(idDaPartida: string) {
  const classe = CLASSES_DE_PERSONAGEM.find((definicao) => definicao.id === 'guerreiro')
  const presente = PRESENTES_INICIAIS.find((definicao) => definicao.id === 'nenhum')
  if (!classe || !presente) throw new Error('Catálogo inicial incompleto para o teste.')

  return criarPartidaLocal({
    idDaPartida,
    criadoEm: '2026-01-01T00:00:00.000Z',
    versaoDoConteudo: VERSAO_DO_CONTEUDO,
    nomeDoPersonagem: 'Aedan',
    classeDoPersonagem: classe,
    presente,
  })
}

describe('prazo exibido dos trabalhos', () => {
  const agora = '2026-01-01T00:00:00.000Z'
  it('não inventa trabalho em espaços vazios', () => {
    const p = criarPartida('vazio')
    expect(obterProgressoDoTrabalho(p)).toBeNull()
    expect(obterProgressoDoTrabalho(p, 'terciaria')).toBeNull()
  })
  it('mostra o prazo real de cada coleta após mudar prioridade, sem alterar o save', () => {
    const base = criarPartida('paralelos')
    const p3 = { ...base, profissoes: { ...base.profissoes, mineracao: { nivel: 30, xp: 0, prestigio: 3 } } }
    const cloch = ATIVIDADES_OCIOSAS_INICIAIS.find(a => a.id === 'coletar.mineracao.cloch')!
    const stan = ATIVIDADES_OCIOSAS_INICIAIS.find(a => a.id === 'coletar.mineracao.stan')!
    const copar = ATIVIDADES_OCIOSAS_INICIAIS.find(a => a.id === 'coletar.mineracao.copar')!
    const principal = iniciarAtividadeOciosa(p3, cloch, agora)
    const secundaria = iniciarAtividadeSecundaria(principal, stan, agora)
    const partida = configurarPrioridadeDaColeta(iniciarAtividadeTerciaria(secundaria, copar, agora), 'secundaria', agora)
    const antes = JSON.stringify(partida)
    expect(obterProgressoDoTrabalho(partida)?.segundosPorAcao).toBe(Math.ceil(cloch.segundosPorAcao / 0.8))
    expect(obterProgressoDoTrabalho(partida, 'secundaria')?.segundosPorAcao).toBe(Math.ceil(stan.segundosPorAcao / 0.75))
    expect(obterProgressoDoTrabalho(partida, 'terciaria')?.segundosPorAcao).toBe(Math.ceil(copar.segundosPorAcao / 0.33))
    expect(obterProgressoDoTrabalho(partida, 'secundaria')?.titulo).toContain('Stán')
    expect(JSON.stringify(partida)).toBe(antes)
  })
  it('produção secundária usa sua própria receita e duração reduzida por eficiência', () => {
    const base = criarPartida('fabricacao')
    const a = obterDefinicaoDeReceitaDeFabricacao('receita.metalurgia.tratada-cloch')!
    const b = obterDefinicaoDeReceitaDeFabricacao('receita.metalurgia.lingote-stan')!
    const preparada = { ...base, profissoes: { ...base.profissoes, metalurgia: { nivel: 10, xp: 0, prestigio: 1 } }, personagem: { ...base.personagem, inventario: [
      { idDaDefinicao: 'material.cloch', quantidade: 30 }, { idDaDefinicao: 'material.stan', quantidade: 30 },
    ] } }
    const p = iniciarReceitaSecundaria(iniciarReceitaDeFabricacao(preparada, a, agora), a, b, agora)
    const exibido = obterProgressoDoTrabalho(p, 'secundaria')
    expect(exibido?.titulo).toContain('Lingote de Stán')
    expect(exibido?.segundosPorAcao).toBe(b.segundosPorAcao * 2)
    expect(exibido?.proximoResultado).toContain('→')
  })
})

import { describe, expect, it } from 'vitest'
import { ATIVIDADES_OCIOSAS_INICIAIS, CLASSES_DE_PERSONAGEM, PRESENTES_INICIAIS, VERSAO_DO_CONTEUDO, obterDefinicaoDeReceitaDeFabricacao } from '@paralaxe/conteudo'
import { criarPartidaLocal, iniciarAtividadeOciosa, iniciarAtividadeSecundaria } from '@paralaxe/dominio'
import { atualizarPartidaNaLista, formatarAusencia, processarTrabalhoAtual } from './partida'

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

describe('serviço de partida', () => {
  it('atualiza a partida pelo mesmo ID sem duplicar a lista', () => {
    const anterior = criarPartida('partida-a')
    const outra = criarPartida('partida-b')
    const atualizada = { ...anterior, atualizadoEm: '2026-01-01T00:01:00.000Z' }

    expect(atualizarPartidaNaLista([anterior, outra], atualizada)).toEqual([atualizada, outra])
  })

  it('formata ausência em segundos, minutos e horas', () => {
    expect(formatarAusencia(0)).toBe('0s')
    expect(formatarAusencia(61_000)).toBe('1min')
    expect(formatarAusencia(3_661_000)).toBe('1h 1min')
  })

  it('credita a coleta pendente e preserva o resumo exibido', () => {
    const inicio = '2026-01-01T00:00:00.000Z'
    const atividade = ATIVIDADES_OCIOSAS_INICIAIS[0]
    if (!atividade) throw new Error('Catálogo inicial de atividades incompleto para o teste.')
    const partida = iniciarAtividadeOciosa(criarPartida('partida-coleta'), atividade, inicio)
    const resultado = processarTrabalhoAtual(partida, '2026-01-01T00:00:04.000Z')

    expect(resultado.partida.personagem.inventario).toContainEqual({ idDaDefinicao: atividade.idDaDefinicaoDoItemProduzido, quantidade: 1 })
    expect(resultado.textoExibido).toBe('+1 Cloch · +8 XP de Profissão')
  })


  it('integra duas coletas de Prestígio I com retorno offline idempotente', () => {
    const inicio = '2026-01-01T00:00:00.000Z'
    const cloch = ATIVIDADES_OCIOSAS_INICIAIS.find(a => a.id === 'coletar.mineracao.cloch')!
    const stan = ATIVIDADES_OCIOSAS_INICIAIS.find(a => a.id === 'coletar.mineracao.stan')!
    const base = criarPartida('partida-coleta-paralela')
    const prestigiado = { ...base, profissoes: { ...base.profissoes, mineracao: { nivel: 10, xp: 0, prestigio: 1 } } }
    const principal = iniciarAtividadeOciosa(prestigiado, cloch, inicio)
    const simultaneo = iniciarAtividadeSecundaria(principal, stan, inicio)
    const resultado = processarTrabalhoAtual(simultaneo, '2026-01-01T00:00:16.000Z')
    expect(resultado.partida.personagem.inventario).toContainEqual({ idDaDefinicao: 'material.cloch', quantidade: 4 })
    expect(resultado.partida.personagem.inventario).toContainEqual({ idDaDefinicao: 'material.stan', quantidade: 1 })
    expect(resultado.textoExibido).toContain('Secundária +1 Stán')
    const repetido = processarTrabalhoAtual(resultado.partida, '2026-01-01T00:00:16.000Z')
    expect(repetido.partida.personagem.inventario).toEqual(resultado.partida.personagem.inventario)
    expect(repetido.partida.profissoes.mineracao.xp).toBe(resultado.partida.profissoes.mineracao.xp)
  })

  it('processa duas receitas de Metalurgia e não paga novamente a mesma ausência', () => {
    const inicio = '2026-01-01T00:00:00.000Z'
    const a = obterDefinicaoDeReceitaDeFabricacao('receita.metalurgia.tratada-cloch')!
    const b = obterDefinicaoDeReceitaDeFabricacao('receita.metalurgia.lingote-stan')!
    const base = criarPartida('partida-producao-paralela')
    const pronta = {
      ...base,
      profissoes: { ...base.profissoes, metalurgia: { nivel: 10, xp: 0, prestigio: 1 } },
      personagem: { ...base.personagem, inventario: [
        { idDaDefinicao: 'material.cloch', quantidade: 30 },
        { idDaDefinicao: 'material.stan', quantidade: 30 },
      ] },
    }
    const principal = iniciarReceitaDeFabricacao(pronta, a, inicio)
    const simultaneo = iniciarReceitaSecundaria(principal, a, b, inicio)
    const resultado = processarTrabalhoAtual(simultaneo, '2026-01-01T00:00:24.000Z')
    expect(resultado.partida.personagem.inventario).toContainEqual({ idDaDefinicao: 'material.tratada-cloch', quantidade: 4 })
    expect(resultado.partida.personagem.inventario).toContainEqual({ idDaDefinicao: 'material.lingote-stan', quantidade: 1 })
    expect(resultado.textoExibido).toContain('Secundária: Lingote de Stán ×1')
    const duplicado = processarTrabalhoAtual(resultado.partida, '2026-01-01T00:00:24.000Z')
    expect(duplicado.partida.personagem.inventario).toEqual(resultado.partida.personagem.inventario)
    expect(duplicado.partida.profissoes.metalurgia).toEqual(resultado.partida.profissoes.metalurgia)
  })

  it('não processa coleta enquanto há expedição ativa', () => {
    const partida = criarPartida('partida-expedicao')
    const expedição = { ...partida.masmorra, expedicaoAtiva: {} as NonNullable<typeof partida.masmorra.expedicaoAtiva> }
    const bloqueada = { ...partida, masmorra: expedição }

    expect(processarTrabalhoAtual(bloqueada, '2026-01-01T00:00:10.000Z')).toEqual({ partida: bloqueada, textoExibido: null })
  })
})

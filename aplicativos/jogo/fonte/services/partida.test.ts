import { describe, expect, it } from 'vitest'
import { ATIVIDADES_OCIOSAS_INICIAIS, CLASSES_DE_PERSONAGEM, PRESENTES_INICIAIS, VERSAO_DO_CONTEUDO, obterDefinicaoDeReceitaDeFabricacao } from '@paralaxe/conteudo'
import { criarPartidaLocal, iniciarAtividadeOciosa, iniciarAtividadeSecundaria, iniciarAtividadeTerciaria, iniciarReceitaDeFabricacao, iniciarReceitaSecundaria, iniciarReceitaTerciaria, configurarPrioridadeDaColeta, configurarPrioridadeDaFabricacao } from '@paralaxe/dominio'
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

  it('Prestígio III: processa três coletas com prioridade Secundária e volta idempotente', () => {
    const inicio = '2026-01-01T00:00:00.000Z'
    const cloch = ATIVIDADES_OCIOSAS_INICIAIS.find(a => a.id === 'coletar.mineracao.cloch')!
    const stan = ATIVIDADES_OCIOSAS_INICIAIS.find(a => a.id === 'coletar.mineracao.stan')!
    const copar = ATIVIDADES_OCIOSAS_INICIAIS.find(a => a.id === 'coletar.mineracao.copar')!
    const base = criarPartida('prestigio-iii-coleta-servico')
    const p3 = { ...base, profissoes: { ...base.profissoes,
      mineracao: { nivel: 30, xp: 0, prestigio: 3 } },
      personagem: { ...base.personagem, inventario: [] },
    }
    const principal = iniciarAtividadeOciosa(p3, cloch, inicio)
    const secundaria = iniciarAtividadeSecundaria(principal, stan, inicio)
    const terceira = iniciarAtividadeTerciaria(secundaria, copar, inicio)
    const prioridade = configurarPrioridadeDaColeta(terceira, 'secundaria', inicio)
    const resultado = processarTrabalhoAtual(prioridade, '2026-01-01T00:01:20.000Z')
    expect(resultado.partida.personagem.inventario).toContainEqual({ idDaDefinicao: 'material.cloch', quantidade: 16 })
    expect(resultado.partida.personagem.inventario).toContainEqual({ idDaDefinicao: 'material.stan', quantidade: 7 })
    expect(resultado.partida.personagem.inventario).toContainEqual({ idDaDefinicao: 'material.copar', quantidade: 2 })
    expect(resultado.textoExibido).toContain('Terciária +2 Copar')
    const repetido = processarTrabalhoAtual(resultado.partida, '2026-01-01T00:01:20.000Z')
    expect(repetido.partida.personagem.inventario).toEqual(resultado.partida.personagem.inventario)
    expect(repetido.partida.profissoes.mineracao).toEqual(resultado.partida.profissoes.mineracao)
  })

  it('Prestígio III: três receitas e prioridade Secundária compartilham estoque sem duplicação', () => {
    const inicio = '2026-01-01T00:00:00.000Z'
    const a = obterDefinicaoDeReceitaDeFabricacao('receita.metalurgia.tratada-cloch')!
    const b = obterDefinicaoDeReceitaDeFabricacao('receita.metalurgia.lingote-stan')!
    const c = obterDefinicaoDeReceitaDeFabricacao('receita.metalurgia.lingote-copar')!
    const base = criarPartida('prestigio-iii-fabricacao-servico')
    const p3 = { ...base, profissoes: { ...base.profissoes,
      metalurgia: { nivel: 30, xp: 0, prestigio: 3 } },
      personagem: { ...base.personagem, inventario: [
        { idDaDefinicao: 'material.cloch', quantidade: 40 },
        { idDaDefinicao: 'material.stan', quantidade: 40 },
        { idDaDefinicao: 'material.copar', quantidade: 40 },
      ] } }
    const primeira = iniciarReceitaDeFabricacao(p3, a, inicio)
    const segunda = iniciarReceitaSecundaria(primeira, a, b, inicio)
    const terceira = iniciarReceitaTerciaria(segunda, a, b, c, inicio)
    const configurado = configurarPrioridadeDaFabricacao(terceira, a, 'secundaria', inicio)
    const resultado = processarTrabalhoAtual(configurado, '2026-01-01T00:01:00.000Z')
    const qtd = (id: string) => resultado.partida.personagem.inventario.find(x => x.idDaDefinicao === id)?.quantidade ?? 0
    expect(qtd('material.tratada-cloch')).toBe(7)
    expect(qtd('material.lingote-stan')).toBe(3)
    expect(qtd('material.lingote-copar')).toBe(1)
    expect(qtd('material.cloch')).toBe(19)
    expect(qtd('material.stan')).toBe(31)
    expect(qtd('material.copar')).toBe(37)
    expect(resultado.textoExibido).toContain('Terciária: Lingote de Copar ×1')
    const repetido = processarTrabalhoAtual(resultado.partida, '2026-01-01T00:01:00.000Z')
    expect(repetido.partida.personagem.inventario).toEqual(resultado.partida.personagem.inventario)
  })

  it('não processa coleta enquanto há expedição ativa', () => {
    const partida = criarPartida('partida-expedicao')
    const expedição = { ...partida.masmorra, expedicaoAtiva: {} as NonNullable<typeof partida.masmorra.expedicaoAtiva> }
    const bloqueada = { ...partida, masmorra: expedição }

    expect(processarTrabalhoAtual(bloqueada, '2026-01-01T00:00:10.000Z')).toEqual({ partida: bloqueada, textoExibido: null })
  })
})

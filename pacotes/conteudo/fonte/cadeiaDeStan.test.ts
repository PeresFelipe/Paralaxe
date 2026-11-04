/**
 * @file Teste de integração da fatia vertical do GDD: Stán → lingote → couraria rebitada.
 * Usa os catálogos reais e os motores de coleta, fabricação, inventário e combate.
 */
import { describe, expect, it } from 'vitest'
import {
  criarPartidaLocal,
  derivarEstatisticasDeCombateDoJogador,
  equiparItem,
  iniciarAtividadeOciosa,
  iniciarReceitaDeFabricacao,
  interromperAtividadeOciosa,
  processarProgressoDeFabricacao,
  processarProgressoOcioso,
  type IdDaProfissao,
  type PartidaLocal,
} from '@paralaxe/dominio'
import { CLASSES_DE_PERSONAGEM, PRESENTES_INICIAIS } from './criacaoDePersonagem'
import { ATIVIDADES_OCIOSAS_INICIAIS } from './atividadesOciosas'
import { RECEITAS_INICIAIS_DE_FABRICACAO } from './receitasDeFabricacao'
import { obterDefinicaoDeEquipamento } from './equipamento'
import { ENTRADAS_DO_CODICE } from './codiceEDesafios'

const inicioEm = Date.parse('2026-11-04T12:00:00.000Z')
const instante = (segundos: number) => new Date(inicioEm + segundos * 1000).toISOString()
const classe = CLASSES_DE_PERSONAGEM.find((item) => item.id === 'errante')!
const presente = PRESENTES_INICIAIS.find((item) => item.id === 'nenhum')!

const acharAtividade = (id: string) => {
  const atividade = ATIVIDADES_OCIOSAS_INICIAIS.find((entrada) => entrada.id === id)
  if (!atividade) throw new Error(`Atividade ausente: ${id}`)
  return atividade
}
const acharReceita = (id: string) => {
  const receita = RECEITAS_INICIAIS_DE_FABRICACAO.find((entrada) => entrada.id === id)
  if (!receita) throw new Error(`Receita ausente: ${id}`)
  return receita
}
const stan = acharAtividade('coletar.mineracao.stan')
const giuis = acharAtividade('coletar.lenhador.giuis')
const lingote = acharReceita('receita.metalurgia.lingote-stan')
const bracadeiras = acharReceita('receita.forja.bracadeiras-rebitadas-stan')
const catalogo = { obterDefinicaoDeEquipamento }

function partidaInicial() {
  return criarPartidaLocal({
    idDaPartida: 'teste-cadeia-stan',
    criadoEm: instante(0),
    versaoDoConteudo: '0.1.0-dev',
    nomeDoPersonagem: 'Aedan',
    classeDoPersonagem: classe,
    presente,
  })
}
function comNiveis(partida: PartidaLocal, ...oficios: IdDaProfissao[]): PartidaLocal {
  const profissoes = { ...partida.profissoes }
  for (const id of oficios) profissoes[id] = { ...profissoes[id], nivel: 10 }
  return { ...partida, profissoes }
}
function quantidade(partida: PartidaLocal, id: string) {
  return partida.personagem.inventario.find((pilha) => pilha.idDaDefinicao === id)?.quantidade ?? 0
}

describe('GDD: primeira cadeia de progressão de Stán', () => {
  it('mantém as receitas antigas e bloqueia os novos níveis até seu requisito', () => {
    const original = partidaInicial()
    const quase = comNiveis(original, 'mineracao', 'metalurgia', 'forja')
    quase.profissoes.mineracao.nivel = 9
    quase.profissoes.metalurgia.nivel = 9
    quase.profissoes.forja.nivel = 9
    expect(() => iniciarAtividadeOciosa(quase, stan, instante(0))).toThrow(/nível 10/)
    const comOuro = { ...quase, personagem: { ...quase.personagem, inventario: [
      { idDaDefinicao: 'material.stan', quantidade: 6 },
      { idDaDefinicao: 'material.lingote-stan', quantidade: 2 },
      { idDaDefinicao: 'material.giuis', quantidade: 4 },
    ] } }
    expect(() => iniciarReceitaDeFabricacao(comOuro, lingote, instante(0))).toThrow(/nível 10/)
    expect(() => iniciarReceitaDeFabricacao(comOuro, bracadeiras, instante(0))).toThrow(/nível 10/)
    expect(ATIVIDADES_OCIOSAS_INICIAIS.some((a) => a.id === 'coletar.mineracao.cloch')).toBe(true)
    expect(RECEITAS_INICIAIS_DE_FABRICACAO.some((r) => r.id === 'receita.forja.giuis-bracadeiras')).toBe(true)
    expect(original.versaoDoEsquemaDaPartida).toBe(comOuro.versaoDoEsquemaDaPartida)
  })

  it('coleta, funde, fabrica e equipa a proteção sem criar recompensas ou consumo duplicados', () => {
    const base = comNiveis(partidaInicial(), 'mineracao', 'metalurgia', 'forja')
    const madeira = processarProgressoOcioso(iniciarAtividadeOciosa(base, giuis, instante(0)), giuis, instante(16))
    expect(madeira.acoesConcluidas).toBe(4)
    const prontoMadeira = interromperAtividadeOciosa(madeira.partida, instante(16))
    const minerado = processarProgressoOcioso(iniciarAtividadeOciosa(prontoMadeira, stan, instante(16)), stan, instante(64))
    expect(minerado.acoesConcluidas).toBe(6)
    expect(quantidade(minerado.partida, 'material.stan')).toBe(6)
    expect(quantidade(minerado.partida, 'material.giuis')).toBe(4)

    const aposColeta = interromperAtividadeOciosa(minerado.partida, instante(64))
    const fundido = processarProgressoDeFabricacao(iniciarReceitaDeFabricacao(aposColeta, lingote, instante(64)), lingote, instante(88))
    expect(fundido.acoesConcluidas).toBe(2)
    expect(quantidade(fundido.partida, 'material.stan')).toBe(0)
    expect(quantidade(fundido.partida, 'material.lingote-stan')).toBe(2)

    const defesaAntes = derivarEstatisticasDeCombateDoJogador(fundido.partida, catalogo).defesa
    const forjado = processarProgressoDeFabricacao(iniciarReceitaDeFabricacao(fundido.partida, bracadeiras, instante(88)), bracadeiras, instante(108))
    expect(forjado.equipamentosProduzidos).toBe(1)
    expect(quantidade(forjado.partida, 'material.lingote-stan')).toBe(0)
    expect(quantidade(forjado.partida, 'material.giuis')).toBe(0)
    expect(forjado.partida.jornada.idsDasReceitasFabricadas).toContain(lingote.id)
    expect(forjado.partida.jornada.idsDasReceitasFabricadas).toContain(bracadeiras.id)
    const fabricado = forjado.partida.personagem.itensDeEquipamento.find((item) => item.idDaDefinicao === 'armadura.stan-bracadeiras-rebitadas')
    if (!fabricado) throw new Error('A fabricação não gerou a instância equipável.')
    const definicao = obterDefinicaoDeEquipamento(fabricado.idDaDefinicao)
    if (!definicao) throw new Error('Definição de equipamento não encontrada.')
    const equipado = equiparItem(forjado.partida, fabricado.idDaInstancia, definicao, instante(109))
    expect(equipado.personagem.equipamento.luvas).toBe(fabricado.idDaInstancia)
    expect(derivarEstatisticasDeCombateDoJogador(equipado, catalogo).defesa).toBeGreaterThan(defesaAntes)

    const repetido = processarProgressoDeFabricacao(forjado.partida, bracadeiras, instante(108))
    expect(repetido.acoesConcluidas).toBe(0)
    expect(repetido.partida).toBe(forjado.partida)
    expect(equipado.personagem.itensDeEquipamento.filter((item) => item.idDaDefinicao === definicao.id)).toHaveLength(1)
  })

  it('não consome metal nem madeira se faltar capacidade para o equipamento', () => {
    const inicial = comNiveis(partidaInicial(), 'forja')
    const preenchido = { ...inicial, personagem: { ...inicial.personagem, inventario: [
      { idDaDefinicao: 'material.lingote-stan', quantidade: 4 },
      { idDaDefinicao: 'material.giuis', quantidade: 8 },
      ...Array.from({ length: 22 }, (_, indice) => ({ idDaDefinicao: `material.teste-${indice}`, quantidade: 1 })),
    ] } }
    // A receita consome o suficiente para uma peça, mas mantém as duas pilhas com saldo.
    const iniciado = iniciarReceitaDeFabricacao(preenchido, bracadeiras, instante(0))
    const resultado = processarProgressoDeFabricacao(iniciado, bracadeiras, instante(20))
    expect(resultado.acoesConcluidas).toBe(0)
    expect(resultado.interrompidoPorCapacidade).toBe(true)
    expect(resultado.partida.personagem.inventario).toEqual(preenchido.personagem.inventario)
  })

  it('publica os novos itens no Códice com IDs estáveis', () => {
    for (const id of [
      'atividade.coletar.mineracao.stan',
      'receita.receita.metalurgia.lingote-stan',
      'receita.receita.forja.bracadeiras-rebitadas-stan',
      'material.material.stan',
      'material.material.lingote-stan',
      'equipamento.armadura.stan-bracadeiras-rebitadas',
    ]) expect(ENTRADAS_DO_CODICE.some((entrada) => entrada.id === id)).toBe(true)
  })
})

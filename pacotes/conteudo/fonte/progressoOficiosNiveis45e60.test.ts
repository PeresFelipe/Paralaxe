/**
 * @file Regressão GDD §§11–14: desbloqueio, coleta e fabricação nas faixas 45–60.
 * Os valores de custo/XP/equipamento são parâmetros provisórios de conteúdo.
 */
import { describe, expect, it } from 'vitest'
import {
  criarPartidaLocal,
  iniciarAtividadeOciosa,
  interromperAtividadeOciosa,
  processarProgressoOcioso,
  iniciarReceitaDeFabricacao,
  processarProgressoDeFabricacao,
  equiparItem,
  derivarEstatisticasDeCombateDoJogador,
  type IdDaProfissao,
  type PartidaLocal,
} from '@paralaxe/dominio'
import { CLASSES_DE_PERSONAGEM, PRESENTES_INICIAIS } from './criacaoDePersonagem'
import { obterDefinicaoDeAtividadeOciosa } from './atividadesOciosas'
import { obterDefinicaoDeReceitaDeFabricacao } from './receitasDeFabricacao'
import { obterDefinicaoDeConsumivelDeCombate } from './combate'
import { obterDefinicaoDeEquipamento } from './equipamento'
import { ENTRADAS_DO_CODICE } from './codiceEDesafios'

const inicio = Date.parse('2026-11-04T12:00:00.000Z')
const tempo = (segundos: number) => new Date(inicio + segundos * 1000).toISOString()
const classe = CLASSES_DE_PERSONAGEM.find((item) => item.id === 'errante')!
const presente = PRESENTES_INICIAIS.find((item) => item.id === 'nenhum')!
const criar = () => criarPartidaLocal({
  idDaPartida: 'teste-oficios-20-30', criadoEm: tempo(0), versaoDoConteudo: '0.1.0-dev',
  nomeDoPersonagem: 'Aedan', classeDoPersonagem: classe, presente,
})
const nivel = (p: PartidaLocal, prof: IdDaProfissao, valor: number): PartidaLocal => ({
  ...p, profissoes: { ...p.profissoes, [prof]: { ...p.profissoes[prof], nivel: valor } },
})
const quantidade = (p: PartidaLocal, id: string) =>
  p.personagem.inventario.find(item => item.idDaDefinicao === id)?.quantidade ?? 0

const coletas = [
  ['mineracao', 45, 'luaidhe'],
  ['mineracao', 60, 'airgead'],
  ['lenhador', 45, 'coll'],
  ['lenhador', 60, 'fuinseog'],
  ['pesca', 45, 'trosc'],
  ['pesca', 60, 'bradan'],
  ['herbologia', 45, 'aiteann'],
  ['herbologia', 60, 'raithneach'],
] as const

const receitas = [
  ['metalurgia',45,'lingote-luaidhe','material.lingote-luaidhe'],
  ['metalurgia',45,'fundicao-pesada','material.placa-fundicao-pesada'],
  ['metalurgia',60,'lingote-airgead','material.lingote-airgead'],
  ['metalurgia',60,'cruach','material.cruach'],
  ['forja',45,'peitoral-fundicao-pesada','armadura.fundicao-pesada-peitoral'],
  ['forja',60,'arco-fuinseog','arma.fuinseog-arco'],
  ['forja',60,'anel-airgead','item.equipamento.airgead-anel'],
  ['culinaria',45,'trosc-defumado','item.comida.trosc-defumado'],
  ['culinaria',45,'extrato-aiteann','item.consumivel.extrato-aiteann'],
  ['culinaria',60,'refeicao-bradan-raithneach','item.comida.bradan-raithneach'],
] as const

describe('progressão normal dos níveis 45 e 60', () => {
  for (const [oficio, requisito, recurso] of coletas) {
    it(`${oficio}: libera ${recurso} somente no nível ${requisito}, preservando o save`, () => {
      const atividade = obterDefinicaoDeAtividadeOciosa(`coletar.${oficio}.${recurso}`)
      if (!atividade) throw new Error('Atividade ausente no catálogo.')
      const inferior = nivel(criar(), oficio, requisito - 1)
      expect(() => iniciarAtividadeOciosa(inferior, atividade, tempo(0)))
        .toThrow(`nível ${requisito}`)
      const pronto = nivel(criar(), oficio, requisito)
      const iniciado = iniciarAtividadeOciosa(pronto, atividade, tempo(0))
      const resultado = processarProgressoOcioso(iniciado, atividade, tempo(atividade.segundosPorAcao * 2))
      expect(resultado.acoesConcluidas).toBe(2)
      expect(resultado.itensConcedidos).toBe(2)
      expect(quantidade(resultado.partida, `material.${recurso}`)).toBe(2)
      expect(resultado.partida.versaoDoEsquemaDaPartida).toBe(pronto.versaoDoEsquemaDaPartida)
      const interrompido = interromperAtividadeOciosa(resultado.partida, tempo(atividade.segundosPorAcao * 2))
      expect(interrompido.ocioso.atividadeAtiva).toBeNull()
      expect(ENTRADAS_DO_CODICE.some(e => e.id === `atividade.${atividade.id}`)).toBe(true)
    })
  }

  for (const [oficio, requisito, id, saida] of receitas) {
    it(`${oficio}: ${id} consome ingredientes, registra a Jornada e produz saída utilizável`, () => {
      const receita = obterDefinicaoDeReceitaDeFabricacao(`receita.${oficio}.${id}`)
      if (!receita) throw new Error('Receita ausente no catálogo.')
      const inventario = receita.ingredientes.map(i => ({ idDaDefinicao: i.idDaDefinicao, quantidade: i.quantidade }))
      const anterior = nivel(criar(), oficio, requisito - 1)
      const bloqueado: PartidaLocal = { ...anterior, personagem: { ...anterior.personagem, inventario } }
      expect(() => iniciarReceitaDeFabricacao(bloqueado, receita, tempo(0)))
        .toThrow(`nível ${requisito}`)
      const pronto = nivel(criar(), oficio, requisito)
      const preparado: PartidaLocal = { ...pronto, personagem: { ...pronto.personagem, inventario } }
      const iniciado = iniciarReceitaDeFabricacao(preparado, receita, tempo(0))
      const produzido = processarProgressoDeFabricacao(iniciado, receita, tempo(receita.segundosPorAcao))
      expect(produzido.acoesConcluidas).toBe(1)
      for (const ingrediente of receita.ingredientes) {
        expect(quantidade(produzido.partida, ingrediente.idDaDefinicao)).toBe(0)
      }
      expect(produzido.partida.jornada.idsDasReceitasFabricadas).toContain(receita.id)
      expect(produzido.partida.versaoDoEsquemaDaPartida).toBe(preparado.versaoDoEsquemaDaPartida)
      if (receita.saida.tipo === 'item') {
        expect(quantidade(produzido.partida, saida)).toBe(1)
        if (saida.startsWith('item.')) {
          expect(obterDefinicaoDeConsumivelDeCombate(saida)).not.toBeNull()
        }
      } else {
        const instancia = produzido.partida.personagem.itensDeEquipamento.find(i => i.idDaDefinicao === saida)
        if (!instancia) throw new Error('Equipamento não foi fabricado.')
        const definicao = obterDefinicaoDeEquipamento(saida)
        if (!definicao) throw new Error('Equipamento sem definição.')
        const antes = derivarEstatisticasDeCombateDoJogador(produzido.partida, { obterDefinicaoDeEquipamento })
        const equipado = equiparItem(produzido.partida, instancia.idDaInstancia, definicao, tempo(120))
        const depois = derivarEstatisticasDeCombateDoJogador(equipado, { obterDefinicaoDeEquipamento })
        expect(equipado.personagem.equipamento[definicao.espaco]).toBe(instancia.idDaInstancia)
        const poderAntes = antes.defesa + antes.poderDoAtaqueBasico + antes.vidaMaxima + antes.manaMaxima + antes.folegoMaximo
        const poderDepois = depois.defesa + depois.poderDoAtaqueBasico + depois.vidaMaxima + depois.manaMaxima + depois.folegoMaximo
        expect(poderDepois).toBeGreaterThan(poderAntes)
      }
      expect(ENTRADAS_DO_CODICE.some(e => e.id === `receita.${receita.id}`)).toBe(true)
    })
  }

  it('liga todos os materiais de nível 45–60 a pelo menos uma receita de utilização', () => {
    for (const [,,recurso] of coletas) {
      const alvo = `material.${recurso}`
      expect(receitas.some(([oficio,,id]) =>
        obterDefinicaoDeReceitaDeFabricacao(`receita.${oficio}.${id}`)?.ingredientes
          .some(i => i.idDaDefinicao === alvo),
      )).toBe(true)
    }
  })

  it('mantém uma lista de IDs única entre novas atividades e receitas', () => {
    expect(new Set(coletas.map(([prof,,slug]) => `coletar.${prof}.${slug}`)).size).toBe(coletas.length)
    expect(new Set(receitas.map(([prof,,slug]) => `receita.${prof}.${slug}`)).size).toBe(receitas.length)
  })
})

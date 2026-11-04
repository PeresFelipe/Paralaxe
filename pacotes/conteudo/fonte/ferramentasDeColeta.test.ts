/**
 * @file Integração real das ferramentas de coleta: Forja, equipamento e rendimento por ciclo.
 */
import { describe, expect, it } from 'vitest'
import {
  criarPartidaLocal, equiparItem, iniciarAtividadeOciosa, iniciarReceitaDeFabricacao,
  processarProgressoDeFabricacao, processarProgressoOcioso, obterBonusDaFerramentaDeColeta,
  ESPACOS_DE_FERRAMENTAS, type PartidaLocal,
} from '@paralaxe/dominio'
import { CLASSES_DE_PERSONAGEM, PRESENTES_INICIAIS } from './criacaoDePersonagem'
import { obterDefinicaoDeAtividadeOciosa } from './atividadesOciosas'
import { obterDefinicaoDeReceitaDeFabricacao } from './receitasDeFabricacao'
import { obterDefinicaoDeEquipamento } from './equipamento'

const origem = Date.parse('2026-11-04T12:00:00.000Z')
const tempo = (segundos: number) => new Date(origem + segundos * 1000).toISOString()
function partida() {
  return criarPartidaLocal({
    idDaPartida: 'ferramentas-integração', criadoEm: tempo(0), versaoDoConteudo: 'test',
    nomeDoPersonagem: 'Aedan', classeDoPersonagem: CLASSES_DE_PERSONAGEM.find(x => x.id === 'errante')!,
    presente: PRESENTES_INICIAIS.find(x => x.id === 'nenhum')!,
  })
}
const casos = [
  ['mineracao','picareta-campo','ferramenta.mineracao.picareta','coletar.mineracao.cloch','ferramentaMineracao',2],
  ['lenhador','machado-corte','ferramenta.lenhador.machado-corte','coletar.lenhador.giuis','ferramentaLenhador',2],
  ['pesca','equipamento-pesca','ferramenta.pesca.equipamento-pesca','coletar.pesca.scadan','ferramentaPesca',3],
  ['herbologia','kit-herbologia','ferramenta.herbologia.kit-herbologia','coletar.herbologia.neantog','ferramentaHerbologia',2],
] as const

describe('ferramentas do GDD §7', () => {
  it('separa quatro slots profissionais dos slots da arma e armadura', () => {
    expect(ESPACOS_DE_FERRAMENTAS).toHaveLength(4)
    expect(new Set(ESPACOS_DE_FERRAMENTAS).size).toBe(4)
    expect(partida().personagem.equipamento.ferramentaMineracao).toBeUndefined()
  })
  for (const [oficio, slug, id, atividadeId, espaco, bonus] of casos) {
    it(`${oficio}: Forja → equipagem → XP, com recurso garantido e sem bônus se só estiver na mochila`, () => {
      const receita = obterDefinicaoDeReceitaDeFabricacao(`receita.forja.${slug}`)!
      const atividade = obterDefinicaoDeAtividadeOciosa(atividadeId)!
      const definicao = obterDefinicaoDeEquipamento(id)!
      expect(definicao.espaco).toBe(espaco)
      const base = partida()
      const ingredientes = receita.ingredientes.map(i => ({ idDaDefinicao: i.idDaDefinicao, quantidade: i.quantidade }))
      const disponivel: PartidaLocal = { ...base, personagem: { ...base.personagem, inventario: ingredientes } }
      const inicio = iniciarReceitaDeFabricacao(disponivel, receita, tempo(0))
      const criado = processarProgressoDeFabricacao(inicio, receita, tempo(12))
      expect(criado.equipamentosProduzidos).toBe(1)
      const item = criado.partida.personagem.itensDeEquipamento.find(i => i.idDaDefinicao === id)
      if (!item) throw new Error('Ferramenta não fabricada.')
      expect(obterBonusDaFerramentaDeColeta(criado.partida, atividade, obterDefinicaoDeEquipamento)).toBe(0)
      const usando = equiparItem(criado.partida, item.idDaInstancia, definicao, tempo(13))
      expect(usando.personagem.equipamento[espaco]).toBe(item.idDaInstancia)
      expect(usando.personagem.equipamento.maoPrincipal).toBe(base.personagem.equipamento.maoPrincipal)
      const coletando = iniciarAtividadeOciosa(usando, atividade, tempo(13))
      const resultado = processarProgressoOcioso(coletando, atividade, tempo(13 + 2 * atividade.segundosPorAcao), obterDefinicaoDeEquipamento)
      expect(resultado.acoesConcluidas).toBe(2)
      expect(resultado.itensConcedidos).toBe(2)
      expect(resultado.xpDeProfissaoConcedido).toBe(2 * (atividade.xpDeProfissaoPorAcao + bonus))
      expect(resultado.partida.versaoDoEsquemaDaPartida).toBe(base.versaoDoEsquemaDaPartida)
    })
  }
  it('não utiliza Picareta para bônus de Lenhador', () => {
    const base = partida()
    const item = { idDaInstancia: 'eq-extra', idDaDefinicao: 'ferramenta.mineracao.picareta', nivelDeReforco: 0 as const }
    const inserido: PartidaLocal = { ...base, personagem: { ...base.personagem, itensDeEquipamento: [...base.personagem.itensDeEquipamento, item] } }
    const usando = equiparItem(inserido, item.idDaInstancia, obterDefinicaoDeEquipamento(item.idDaDefinicao)!, tempo(0))
    const atividade = obterDefinicaoDeAtividadeOciosa('coletar.lenhador.giuis')!
    expect(obterBonusDaFerramentaDeColeta(usando, atividade, obterDefinicaoDeEquipamento)).toBe(0)
  })
})

/** @file Integração dos materiais dos quatro Ofícios no nível 10 (GDD §11–14). */
import { describe, expect, it } from 'vitest'
import {
  criarPartidaLocal,
  iniciarAtividadeOciosa,
  processarProgressoOcioso,
  interromperAtividadeOciosa,
  iniciarReceitaDeFabricacao,
  processarProgressoDeFabricacao,
  equiparItem,
  derivarEstatisticasDeCombateDoJogador,
  type PartidaLocal,
  type IdDaProfissao,
} from '@paralaxe/dominio'
import { CLASSES_DE_PERSONAGEM, PRESENTES_INICIAIS } from './criacaoDePersonagem'
import { ATIVIDADES_OCIOSAS_INICIAIS } from './atividadesOciosas'
import { RECEITAS_INICIAIS_DE_FABRICACAO } from './receitasDeFabricacao'
import { obterDefinicaoDeEquipamento } from './equipamento'
import { obterDefinicaoDeConsumivelDeCombate } from './combate'

const tempo = (s: number) => new Date(Date.UTC(2026, 10, 4, 12, 0, s)).toISOString()
const classe = CLASSES_DE_PERSONAGEM.find((x) => x.id === 'errante')!
const presente = PRESENTES_INICIAIS.find((x) => x.id === 'nenhum')!
function criarPartida() { return criarPartidaLocal({ idDaPartida: 'progresso-nivel-10', criadoEm: tempo(0), versaoDoConteudo: 'test', nomeDoPersonagem: 'Aedan', classeDoPersonagem: classe, presente }) }
function nivel(partida: PartidaLocal, id: IdDaProfissao, n: number): PartidaLocal {
  return { ...partida, profissoes: { ...partida.profissoes, [id]: { ...partida.profissoes[id], nivel: n } } }
}
function item(partida: PartidaLocal, id: string) { return partida.personagem.inventario.find((x) => x.idDaDefinicao === id)?.quantidade ?? 0 }
const conjuntos = [
  { profissao: 'lenhador', atividade: 'coletar.lenhador.beith', receita: 'receita.forja.arco-beith', recurso: 'material.beith', resultado: 'arma.beith-arco', ingredientes: 6 },
  { profissao: 'pesca', atividade: 'coletar.pesca.breac', receita: 'receita.culinaria.breac-assado', recurso: 'material.breac', resultado: 'item.comida.breac-assado', ingredientes: 2 },
  { profissao: 'herbologia', atividade: 'coletar.herbologia.seamair', receita: 'receita.culinaria.infusao-seamair', recurso: 'material.seamair', resultado: 'item.consumivel.infusao-seamair', ingredientes: 2 },
] as const

describe('cadeias verticais de progressão dos Ofícios no nível 10', () => {
  for (const conjunto of conjuntos) {
    it(`${conjunto.profissao} → fabricação → resultado utilizável`, () => {
      const atividade = ATIVIDADES_OCIOSAS_INICIAIS.find((x) => x.id === conjunto.atividade)!
      const receita = RECEITAS_INICIAIS_DE_FABRICACAO.find((x) => x.id === conjunto.receita)!
      const anterior = nivel(criarPartida(), conjunto.profissao, 9)
      expect(() => iniciarAtividadeOciosa(anterior, atividade, tempo(0))).toThrow('nível 10')
      const parcial = nivel(nivel(criarPartida(), conjunto.profissao, 10), receita.idDaProfissao, 10)
      const iniciado = iniciarAtividadeOciosa(parcial, atividade, tempo(0))
      const finalColeta = processarProgressoOcioso(iniciado, atividade, tempo(atividade.segundosPorAcao * conjunto.ingredientes))
      expect(item(finalColeta.partida, conjunto.recurso)).toBe(conjunto.ingredientes)
      const parado = interromperAtividadeOciosa(finalColeta.partida, tempo(atividade.segundosPorAcao * conjunto.ingredientes))
      const inicioProducao = iniciarReceitaDeFabricacao(parado, receita, tempo(atividade.segundosPorAcao * conjunto.ingredientes))
      const saida = processarProgressoDeFabricacao(inicioProducao, receita, tempo(atividade.segundosPorAcao * conjunto.ingredientes + receita.segundosPorAcao))
      expect(item(saida.partida, conjunto.recurso)).toBe(0)
      expect(saida.partida.jornada.idsDasReceitasFabricadas).toContain(receita.id)
      if (receita.saida.tipo === 'item') {
        expect(item(saida.partida, conjunto.resultado)).toBe(1)
        expect(obterDefinicaoDeConsumivelDeCombate(conjunto.resultado)).not.toBeNull()
      } else if (receita.saida.tipo === 'equipamento') {
        const criado = saida.partida.personagem.itensDeEquipamento.find((x) => x.idDaDefinicao === conjunto.resultado)
        if (!criado) throw new Error('Não criou o equipamento.')
        const definicao = obterDefinicaoDeEquipamento(conjunto.resultado)!
        const antes = derivarEstatisticasDeCombateDoJogador(saida.partida, { obterDefinicaoDeEquipamento })
        const equipado = equiparItem(saida.partida, criado.idDaInstancia, definicao, tempo(100))
        const depois = derivarEstatisticasDeCombateDoJogador(equipado, { obterDefinicaoDeEquipamento })
        expect(depois.poderDoAtaqueBasico).toBeGreaterThan(antes.poderDoAtaqueBasico)
      }
      expect(saida.acoesConcluidas).toBe(1)
      expect(saida.partida.versaoDoEsquemaDaPartida).toBe(criarPartida().versaoDoEsquemaDaPartida)
    })
  }
})

/** @file Verificação da matriz canônica de recursos e receitas exclusivas do GDD §§11–14. */
import { describe, expect, it } from 'vitest'
import { criarPartidaLocal, iniciarAtividadeOciosa, iniciarReceitaDeFabricacao } from '@paralaxe/dominio'
import { CLASSES_DE_PERSONAGEM, PRESENTES_INICIAIS } from './criacaoDePersonagem'
import { ATIVIDADES_DE_PRESTIGIO, RECEITAS_DE_PRESTIGIO, EQUIPAMENTOS_DE_PRESTIGIO,
  CONSUMIVEIS_DE_PRESTIGIO, idDoRecursoDePrestigio } from './conteudoDePrestigios'
import { ATIVIDADES_OCIOSAS_INICIAIS } from './atividadesOciosas'
import { RECEITAS_INICIAIS_DE_FABRICACAO } from './receitasDeFabricacao'
import { obterDefinicaoDeEquipamento } from './equipamento'
import { obterDefinicaoDeConsumivelDeCombate } from './combate'

const inicio = '2026-11-04T12:00:00.000Z'
const classe = CLASSES_DE_PERSONAGEM.find(c => c.id === 'errante')!
const presente = PRESENTES_INICIAIS.find(p => p.id === 'nenhum')!
const criar = () => criarPartidaLocal({ idDaPartida: 'prestigio-catalogos', criadoEm: inicio,
  versaoDoConteudo: 'test', nomeDoPersonagem: 'Aedan', classeDoPersonagem: classe, presente })

describe('GDD: Conteúdo exclusivo dos Prestígios I–III', () => {
  it('possui sete recursos por linha de coleta e por Prestígio e três caminhos de fabricação', () => {
    expect(ATIVIDADES_DE_PRESTIGIO).toHaveLength(4 * 3 * 7)
    expect(RECEITAS_DE_PRESTIGIO).toHaveLength(3 * 3 * 7)
    expect(EQUIPAMENTOS_DE_PRESTIGIO).toHaveLength(21)
    expect(CONSUMIVEIS_DE_PRESTIGIO).toHaveLength(21)
    expect(new Set(ATIVIDADES_OCIOSAS_INICIAIS.map(a => a.id)).size).toBe(ATIVIDADES_OCIOSAS_INICIAIS.length)
    expect(new Set(RECEITAS_INICIAIS_DE_FABRICACAO.map(r => r.id)).size).toBe(RECEITAS_INICIAIS_DE_FABRICACAO.length)
  })

  it('o último material de uma era torna-se o primeiro da seguinte, com IDs persistentes', () => {
    for (const oficio of ['mineracao', 'lenhador', 'pesca', 'herbologia'] as const) {
      expect(idDoRecursoDePrestigio(oficio, 2, 0)).toBe(idDoRecursoDePrestigio(oficio, 1, 6))
      expect(idDoRecursoDePrestigio(oficio, 3, 0)).toBe(idDoRecursoDePrestigio(oficio, 2, 6))
    }
    expect(idDoRecursoDePrestigio('mineracao', 1, 0)).toBe('material.grianchloch')
    expect(idDoRecursoDePrestigio('herbologia', 1, 0)).toBe('material.maros')
  })

  it('os 21 equipamentos e os 21 consumíveis são utilizáveis nos motores existentes', () => {
    for (const item of EQUIPAMENTOS_DE_PRESTIGIO) expect(obterDefinicaoDeEquipamento(item.id)).not.toBeNull()
    for (const item of CONSUMIVEIS_DE_PRESTIGIO) expect(obterDefinicaoDeConsumivelDeCombate(item.id)).not.toBeNull()
  })

  it('nenhum recurso exclusivo fica sem caminho de transformação no catálogo', () => {
    const consumidos = new Set(RECEITAS_DE_PRESTIGIO.flatMap(r => r.ingredientes.map(i => i.idDaDefinicao)))
    for (const atividade of ATIVIDADES_DE_PRESTIGIO) {
      expect(consumidos.has(atividade.idDaDefinicaoDoItemProduzido)).toBe(true)
    }
    for (const receita of RECEITAS_DE_PRESTIGIO.filter(r => r.idDaProfissao === 'metalurgia')) {
      expect(consumidos.has(receita.saida.tipo === 'item' ? receita.saida.idDaDefinicao : '')).toBe(true)
    }
  })

  it('impede acesso antecipado a cada camada, mesmo com nível 99 da profissão', () => {
    for (const prestigio of [1,2,3] as const) {
      const coleta = ATIVIDADES_DE_PRESTIGIO.find(a => a.idDaProfissao === 'mineracao' && a.prestigioExigido === prestigio)!
      const receita = RECEITAS_DE_PRESTIGIO.find(r => r.idDaProfissao === 'metalurgia' && r.prestigioExigido === prestigio)!
      const base = criar()
      const anterior = { ...base, profissoes: {
        ...base.profissoes,
        mineracao: { nivel: 99, xp: 0, prestigio: prestigio - 1 },
        metalurgia: { nivel: 99, xp: 0, prestigio: prestigio - 1 },
      } }
      expect(() => iniciarAtividadeOciosa(anterior, coleta, inicio)).toThrow('Prestígio')
      const materiais = receita.ingredientes.map(i => ({ idDaDefinicao: i.idDaDefinicao, quantidade: i.quantidade }))
      const comIngredientes = { ...anterior, personagem: { ...anterior.personagem, inventario: materiais } }
      expect(() => iniciarReceitaDeFabricacao(comIngredientes, receita, inicio)).toThrow('Prestígio')
      const desbloqueado = { ...anterior, profissoes: {
        ...anterior.profissoes, mineracao: { nivel: 99, xp: 0, prestigio },
        metalurgia: { nivel: 99, xp: 0, prestigio },
      } }
      expect(iniciarAtividadeOciosa(desbloqueado, coleta, inicio).ocioso.atividadeAtiva?.idDaDefinicaoDaAtividade).toBe(coleta.id)
      expect(iniciarReceitaDeFabricacao({ ...desbloqueado, personagem: { ...desbloqueado.personagem, inventario: materiais } },
        receita, inicio).fabricacao.receitaAtiva?.idDaDefinicaoDaReceita).toBe(receita.id)
    }
  })
})

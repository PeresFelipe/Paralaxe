/**
 * @file Testes de capacidade que atravessam coleta, fabricação, mercado e masmorra.
 * Exercitam os pontos em que um recurso entra no inventário, verificando que uma recusa
 * por falta de espaço não consome ingredientes nem encerra a expedição.
 */
import { describe, expect, it } from 'vitest'
import { criarPartidaLocal, type DefinicaoDeClasseDoPersonagem, type DefinicaoDePresente, type PartidaLocal } from './personagem'
import { processarProgressoOcioso, iniciarAtividadeOciosa, type DefinicaoDeAtividadeOciosa } from './ocioso'
import { processarProgressoDeFabricacao, iniciarReceitaDeFabricacao, type DefinicaoDeReceitaDeFabricacao } from './fabricacao'
import { comprarOfertaDoMercadoDePnj } from './economia'
import { aceitarContratoDeDunLiath, criarExpedicaoNaMasmorra, extrairExpedicaoDaMasmorra, type DefinicaoDeMasmorra } from './masmorra'
import { LIMITE_DE_PILHA_DE_CONSUMIVEIS_V01, LIMITE_DE_ESPACOS_DO_INVENTARIO_V01 } from './armazenamento'

const classeDoPersonagem: DefinicaoDeClasseDoPersonagem = {
  id: "errante",
  nome: 'Errante',
  resumo: 'Teste',
  atributos: { vitalidade: 5, mente: 5, vigor: 5, forca: 5, destreza: 5, inteligencia: 5, fe: 5 },
  equipamentosIniciais: { maoPrincipal: "arma.viagem-lanca" },
  idDaHabilidadeInicial: "habilidade.abertura",
}
const presente: DefinicaoDePresente = { id: "nenhum", nome: 'Nenhum', resumo: 'Teste', concessoes: [] }

/** Cria um estado novo com identidade e horário fixos, isolando as alterações de cada caso. */
function criarPartida() {
  return criarPartidaLocal({
    idDaPartida: "capacidade-test", criadoEm: '2026-09-10T12:00:00.000Z', versaoDoConteudo: '0.1.0-dev',
    nomeDoPersonagem: 'Ailith', classeDoPersonagem, presente,
  })
}

/** Preenche os espaços com IDs diferentes; aumentar a quantidade de uma única pilha não faria isso. */
function comCompletoDistintoInventario(partida: PartidaLocal, primeiro = { idDaDefinicao: 'material.cloch', quantidade: 2 }) {
  const preenchimentoAuxiliar = Array.from({ length: LIMITE_DE_ESPACOS_DO_INVENTARIO_V01 - 1 }, (_, indice) => ({
    idDaDefinicao: `material.filler-${indice}`,
    quantidade: 1,
  }))
  return { ...partida, personagem: { ...partida.personagem, inventario: [primeiro, ...preenchimentoAuxiliar] } }
}

const mineracao: DefinicaoDeAtividadeOciosa = {
  id: "coletar.mineracao.cloch", idDaProfissao: "mineracao", nome: 'Extrair Cloch', idDaDefinicaoDoItemProduzido: 'material.cloch',
  nomeDoResultado: 'Cloch', nivelExigidoDaProfissao: 1, segundosPorAcao: 4, xpDeProfissaoPorAcao: 8,
}
const tratamento: DefinicaoDeReceitaDeFabricacao = {
  id: "receita.test.tratada-cloch", idDaProfissao: "metalurgia", nome: 'Cloch Tratada', nivelExigidoDaProfissao: 1,
  segundosPorAcao: 6, xpDeProfissaoPorAcao: 12, ingredientes: [{ idDaDefinicao: 'material.cloch', quantidade: 1 }],
  saida: { tipo: 'item', idDaDefinicao: "material.tratada-cloch", nome: 'Cloch Tratada', quantidade: 1 },
}
const masmorra: DefinicaoDeMasmorra = {
  id: "masmorra.capacidade", nome: "Masmorra Capacidade", dificuldade: "facil", idDaSalaInicial: "sala.iniciar",
  salas: [{ id: "sala.iniciar", nome: 'Entrada', tipo: "entrada", idsDasProximasSalas: [] }],
}

describe("capacidade do inventário nos fluxos de aquisição da versão 0.1", () => {
  it("limita a coleta ao tamanho da pilha de materiais e interrompe a atividade explicitamente", () => {
    const base = criarPartida()
    const estocado = {
      ...base,
      personagem: { ...base.personagem, inventario: [{ idDaDefinicao: 'material.cloch', quantidade: 9_998 }] },
    }
    const iniciado = iniciarAtividadeOciosa(estocado, mineracao, '2026-09-10T12:00:00.000Z')
    const resultado = processarProgressoOcioso(iniciado, mineracao, '2026-09-10T12:00:08.000Z')
    expect(resultado.acoesConcluidas).toBe(1)
    expect(resultado.partida.personagem.inventario[0]?.quantidade).toBe(9_999)
    expect(resultado.interrompidoPorCapacidade).toBe(true)
    expect(resultado.partida.ocioso.atividadeAtiva).toBeNull()
  })

  it("não consome ingredientes quando o resultado da fabricação não cabe no inventário", () => {
    // Mantém dois ingredientes: consumir um não libera sua pilha, portanto o novo produto não cabe.
    const completo = comCompletoDistintoInventario(criarPartida())
    const iniciado = iniciarReceitaDeFabricacao(completo, tratamento, '2026-09-10T12:00:00.000Z')
    const resultado = processarProgressoDeFabricacao(iniciado, tratamento, '2026-09-10T12:00:06.000Z')
    expect(resultado.acoesConcluidas).toBe(0)
    expect(resultado.interrompidoPorCapacidade).toBe(true)
    expect(resultado.partida.personagem.inventario.find((pilha) => pilha.idDaDefinicao === 'material.cloch')?.quantidade).toBe(2)
    expect(resultado.partida.personagem.inventario.some((pilha) => pilha.idDaDefinicao === "material.tratada-cloch")).toBe(false)
  })

  it("rejeita compras que excedam a pilha de consumíveis ou os espaços de equipamentos", () => {
    const base = criarPartida()
    const limitado = {
      ...base,
      personagem: {
        ...base.personagem,
        ouro: 100,
        inventario: [{ idDaDefinicao: "item.consumivel.campo-preparacao", quantidade: LIMITE_DE_PILHA_DE_CONSUMIVEIS_V01 }],
      },
    }
    expect(() => comprarOfertaDoMercadoDePnj(limitado, {
      id: "mercado.campo-preparacao", nome: 'Preparado', preco: 15,
      produto: { tipo: 'item', idDaDefinicao: "item.consumivel.campo-preparacao", quantidade: 1 },
    }, '2026-09-10T12:01:00.000Z')).toThrow('capacidade')

    const completo = { ...comCompletoDistintoInventario(base), personagem: { ...comCompletoDistintoInventario(base).personagem, ouro: 100 } }
    expect(() => comprarOfertaDoMercadoDePnj(completo, {
      id: "mercado.luvas", nome: 'Luvas', preco: 20,
      produto: { tipo: "equipamento", idDaDefinicao: "armadura.simples-luvas", espaco: "luvas" },
    }, '2026-09-10T12:01:00.000Z')).toThrow("espaços livres")
  })

  it("exige espaço para os suprimentos do contrato e para todos os saques antes da extração", () => {
    const completo = comCompletoDistintoInventario(criarPartida(), { idDaDefinicao: 'material.cloch', quantidade: 1 })
    expect(() => aceitarContratoDeDunLiath(completo, '2026-09-10T12:01:00.000Z')).toThrow('capacidade')

    const execucao = {
      ...criarExpedicaoNaMasmorra(completo, masmorra, 7, '2026-09-10T12:02:00.000Z'),
      extracaoSeguraDisponivel: true,
      bolsaDaExpedicao: [{ idDaDefinicao: "item.dun-liath.viga", quantidade: 1 }],
    }
    const ativo = { ...completo, masmorra: { ...completo.masmorra, expedicaoAtiva: execucao } }
    expect(() => extrairExpedicaoDaMasmorra(ativo, '2026-09-10T12:03:00.000Z')).toThrow('capacidade')
    expect(ativo.masmorra.expedicaoAtiva).not.toBeNull()
  })
})

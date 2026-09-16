/**
 * @file Testes da compra de equipamentos no mercado PNJ.
 * Verificam débito, sequência de instâncias e rejeição por falta de moedas;
 * os cenários de inventário cheio ficam em capacidadeDoInventario.test.ts.
 */
import { describe, expect, it } from 'vitest'
import { criarPartidaLocal } from './personagem'
import { comprarOfertaDoMercadoDePnj } from './economia'

const classeDoPersonagem = {
  id: "errante" as const,
  nome: 'Errante',
  resumo: 'Teste',
  atributos: { vitalidade: 5, mente: 5, vigor: 5, forca: 5, destreza: 5, inteligencia: 5, fe: 5 },
  equipamentosIniciais: { maoPrincipal: "arma.viagem-lanca", peitoral: "armadura.viagem-protecao" },
  idDaHabilidadeInicial: "habilidade.abertura",
}

const presente = { id: "moeda-bolsaDeMoedas" as const, nome: 'Bolsa', resumo: 'Teste', concessoes: [{ tipo: "ouro" as const, quantidadeTotal: 60 }] }

/** Cria um estado novo com identidade e horário fixos, isolando as alterações de cada caso. */
function criarPartida() {
  return criarPartidaLocal({
    idDaPartida: 'economy-test',
    criadoEm: '2026-09-09T12:00:00.000Z',
    versaoDoConteudo: '0.1.0-dev',
    nomeDoPersonagem: 'Teste',
    classeDoPersonagem,
    presente,
  })
}

describe("mercado de PNJ", () => {
  it("compra equipamento como instância individual e desconta ouro", () => {
    const base = criarPartida()
    const partida = comprarOfertaDoMercadoDePnj(base, {
      id: "mercado.simples-luvas",
      nome: 'Luvas Simples',
      preco: 20,
      produto: { tipo: "equipamento", idDaDefinicao: "armadura.simples-luvas", espaco: "luvas" },
    }, '2026-09-09T12:01:00.000Z')

    expect(partida.personagem.ouro).toBe(40)
    expect(partida.personagem.itensDeEquipamento.at(-1)?.idDaDefinicao).toBe("armadura.simples-luvas")
    expect(partida.personagem.proximaSequenciaDeEquipamento).toBe(base.personagem.proximaSequenciaDeEquipamento + 1)
  })

  it("rejeita compra sem moedas suficientes", () => {
    const base = { ...criarPartida(), personagem: { ...criarPartida().personagem, ouro: 0 } }
    expect(() => comprarOfertaDoMercadoDePnj(base, {
      id: "mercado.simples-botas",
      nome: 'Botas Simples',
      preco: 20,
      produto: { tipo: "equipamento", idDaDefinicao: "armadura.simples-botas", espaco: "botas" },
    }, '2026-09-09T12:01:00.000Z')).toThrow('Moedas insuficientes')
  })
})

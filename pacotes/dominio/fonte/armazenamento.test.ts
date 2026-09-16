/**
 * @file Testes de movimentação entre mochila e banco.
 * Protegem limites de espaços, transferência gratuita de pilhas e preservação da identidade
 * das peças; equipamentos em uso precisam ser retirados do corpo antes do depósito.
 */
import { describe, expect, it } from 'vitest'
import { criarPartidaLocal, type DefinicaoDeClasseDoPersonagem, type DefinicaoDePresente } from './personagem'
import {
  LIMITE_DE_ESPACOS_DO_BANCO_V01,
  LIMITE_DE_ESPACOS_DO_INVENTARIO_V01,
  depositarEquipamentoNoBanco,
  depositarPilhaDoInventarioNoBanco,
  obterUsoDeEspacosDoBanco,
  obterUsoDeEspacosDoInventario,
  retirarEquipamentoDoBanco,
  retirarPilhaDoBancoParaInventario,
} from './armazenamento'

const classeDoPersonagem: DefinicaoDeClasseDoPersonagem = {
  id: "errante",
  nome: 'Errante',
  resumo: 'Equilibrado.',
  atributos: { vitalidade: 5, mente: 5, vigor: 5, forca: 5, destreza: 5, inteligencia: 5, fe: 5 },
  equipamentosIniciais: {
    maoPrincipal: "arma.viagem-lanca",
    peitoral: "armadura.viagem-protecao",
  },
  idDaHabilidadeInicial: "habilidade.abertura",
}

const presente: DefinicaoDePresente = {
  id: "sobrevivencia-estojo",
  nome: 'Kit de Sobrevivência',
  resumo: 'Itens de teste.',
  concessoes: [
    { tipo: 'item', idDaDefinicao: "item.consumivel.campo-preparacao", quantidade: 2 },
    { tipo: 'item', idDaDefinicao: "item.comida.assado-scadan", quantidade: 2 },
  ],
}

/** Cria um estado novo com identidade e horário fixos, isolando as alterações de cada caso. */
function criarPartida() {
  return criarPartidaLocal({
    idDaPartida: "banco-test",
    criadoEm: '2026-09-10T10:00:00.000Z',
    versaoDoConteudo: '0.1.0-dev',
    nomeDoPersonagem: 'Ailith',
    classeDoPersonagem,
    presente,
  })
}

describe("banco da versão 0.1", () => {
  it("inicia vazio e usa os limites aprovados de 24 e 80 espaços", () => {
    const partida = criarPartida()
    expect(LIMITE_DE_ESPACOS_DO_INVENTARIO_V01).toBe(24)
    expect(LIMITE_DE_ESPACOS_DO_BANCO_V01).toBe(80)
    expect(partida.personagem.banco).toEqual({ inventario: [], itensDeEquipamento: [] })
    expect(obterUsoDeEspacosDoInventario(partida)).toBe(2)
    expect(obterUsoDeEspacosDoBanco(partida)).toBe(0)
  })

  it("deposita e retira quantidades das pilhas sem cobrar moedas", () => {
    const base = criarPartida()
    const depositado = depositarPilhaDoInventarioNoBanco(
      base,
      "item.consumivel.campo-preparacao",
      1,
      '2026-09-10T10:01:00.000Z',
    )
    expect(depositado.personagem.ouro).toBe(base.personagem.ouro)
    expect(depositado.personagem.inventario.find((pilha) => pilha.idDaDefinicao === "item.consumivel.campo-preparacao")?.quantidade).toBe(1)
    expect(depositado.personagem.banco.inventario).toContainEqual({ idDaDefinicao: "item.consumivel.campo-preparacao", quantidade: 1 })

    const retirado = retirarPilhaDoBancoParaInventario(
      depositado,
      "item.consumivel.campo-preparacao",
      1,
      '2026-09-10T10:02:00.000Z',
    )
    expect(retirado.personagem.ouro).toBe(base.personagem.ouro)
    expect(retirado.personagem.inventario.find((pilha) => pilha.idDaDefinicao === "item.consumivel.campo-preparacao")?.quantidade).toBe(2)
    expect(retirado.personagem.banco.inventario).toEqual([])
  })

  it("exige desequipar antes do depósito e preserva a instância na retirada", () => {
    const base = criarPartida()
    const peitoralId = base.personagem.equipamento.peitoral
    if (!peitoralId) throw new Error('Peitoral inicial ausente.')
    expect(() => depositarEquipamentoNoBanco(base, peitoralId, '2026-09-10T10:01:00.000Z')).toThrow('Desequipe')

    const equipamento = { ...base.personagem.equipamento }
    delete equipamento.peitoral
    const desequipado = {
      ...base,
      personagem: {
        ...base.personagem,
        equipamento,
      },
    }
    const depositado = depositarEquipamentoNoBanco(desequipado, peitoralId, '2026-09-10T10:02:00.000Z')
    expect(depositado.personagem.itensDeEquipamento.some((item) => item.idDaInstancia === peitoralId)).toBe(false)
    expect(depositado.personagem.banco.itensDeEquipamento.some((item) => item.idDaInstancia === peitoralId)).toBe(true)

    const retirado = retirarEquipamentoDoBanco(depositado, peitoralId, '2026-09-10T10:03:00.000Z')
    expect(retirado.personagem.banco.itensDeEquipamento).toEqual([])
    expect(retirado.personagem.itensDeEquipamento.some((item) => item.idDaInstancia === peitoralId)).toBe(true)
  })
})

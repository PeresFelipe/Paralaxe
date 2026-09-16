import { describe, expect, it } from 'vitest'
import { criarPartidaLocal, type DefinicaoDeClasseDoPersonagem, type DefinicaoDePresente } from './personagem'
import type { ResultadoDeCombate } from './combate'
import { aplicarResultadoDoCombateNaEstrada } from './introducao'

const classeDoPersonagem: DefinicaoDeClasseDoPersonagem = {
  id: "errante", nome: 'Errante', resumo: 'Teste',
  atributos: { vitalidade: 5, mente: 5, vigor: 5, forca: 5, destreza: 5, inteligencia: 5, fe: 5 },
  equipamentosIniciais: { maoPrincipal: "arma.viagem-lanca" },
  idDaHabilidadeInicial: "habilidade.abertura",
}
const presente: DefinicaoDePresente = { id: "nenhum", nome: 'Nenhum', resumo: 'Teste', concessoes: [] }
const vitoria: ResultadoDeCombate = {
  desfecho: "vitoria", duracaoEmSegundos: 10, vidaDoInimigo: 0, xpConcedido: 35, itensConsumidos: [], registro: [], semente: 10,
  jogador: { vida: 100, vidaMaxima: 160, mana: 80, manaMaxima: 80, folego: 80, folegoMaximo: 100 },
}

function criarPartida() {
  return criarPartidaLocal({
    idDaPartida: "servico-test", criadoEm: '2026-09-10T12:00:00.000Z', versaoDoConteudo: '0.1.0-dev',
    nomeDoPersonagem: 'Ailith', classeDoPersonagem, presente,
  })
}

describe("Serviço — Estrada Baixa", () => {
  it("concede a recompensa do serviço somente na primeira vitória", () => {
    const primeiro = aplicarResultadoDoCombateNaEstrada(criarPartida(), vitoria, '2026-09-10T12:01:00.000Z')
    expect(primeiro.personagem.xp).toBe(60)
    expect(primeiro.personagem.ouro).toBe(40)
    expect(primeiro.combate.loboDerrotado).toBe(true)

    const repetir = aplicarResultadoDoCombateNaEstrada(primeiro, vitoria, '2026-09-10T12:02:00.000Z')
    expect(repetir.personagem.xp).toBe(95)
    expect(repetir.personagem.ouro).toBe(40)
  })
})

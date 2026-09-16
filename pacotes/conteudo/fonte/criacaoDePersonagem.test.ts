import { describe, expect, it } from 'vitest'
import { criarPartidaLocal, derivarEstatisticasDeCombateDoJogador } from '@greywake/dominio'
import { CLASSES_DE_PERSONAGEM, PRESENTES_INICIAIS } from './criacaoDePersonagem'
import { obterDefinicaoDeEquipamento } from './equipamento'

describe("presentes iniciais da versão 0.1", () => {
  it("cria e equipa o Anel do Viajante com seus bônus aprovados", () => {
    const classeDoPersonagem = CLASSES_DE_PERSONAGEM.find((entrada) => entrada.id === "errante")
    const presente = PRESENTES_INICIAIS.find((entrada) => entrada.id === "viajante-anel")
    if (!classeDoPersonagem || !presente) throw new Error('Conteúdo de teste ausente.')

    const partida = criarPartidaLocal({
      idDaPartida: "anel-conteudo-test",
      criadoEm: '2026-09-10T12:00:00.000Z',
      versaoDoConteudo: '0.1.0-dev',
      nomeDoPersonagem: 'Ailith',
      classeDoPersonagem,
      presente,
    })
    const anelId = partida.personagem.equipamento.anel1
    const anel = partida.personagem.itensDeEquipamento.find((item) => item.idDaInstancia === anelId)
    const estatisticas = derivarEstatisticasDeCombateDoJogador(partida, { obterDefinicaoDeEquipamento })

    expect(anel?.idDaDefinicao).toBe("item.equipamento.viajante-anel")
    expect(partida.personagem.inventario.some((pilha) => pilha.idDaDefinicao === "item.equipamento.viajante-anel")).toBe(false)
    expect(estatisticas.vidaMaxima).toBe(168)
    expect(estatisticas.manaMaxima).toBe(85)
    expect(estatisticas.folegoMaximo).toBe(108)
  })
})

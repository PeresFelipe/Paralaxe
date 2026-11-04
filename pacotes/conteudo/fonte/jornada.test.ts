/**
 * @file Testes de metas com receitas reais, coleta, banco e fabricação.
 * Comparam produção acompanhada e não acompanhada e processamento ativo e ausente,
 * para que o acompanhamento não altere a economia. Também verificam a memória narrativa.
 */
import { describe, expect, it } from 'vitest'
import {
  escolherMetaDaJornada, criarPartidaLocal, depositarPilhaDoInventarioNoBanco, obterProgressoDaMetaDaJornada,
  processarProgressoDeFabricacao, processarProgressoOcioso, iniciarReceitaDeFabricacao, iniciarAtividadeOciosa, interromperAtividadeOciosa,
} from '@paralaxe/dominio'
import { CLASSES_DE_PERSONAGEM, PRESENTES_INICIAIS } from './criacaoDePersonagem'
import { obterDefinicaoDeReceitaDeFabricacao } from './receitasDeFabricacao'
import { ATIVIDADES_OCIOSAS_INICIAIS } from './atividadesOciosas'
import { obterDialogoDeBrann, obterComparacaoDeEquipamentoDaFabricacao, obterAvisoDeFabricacaoDaJornada, obterResumoDeRetornoDaJornada, obterHistoriaDaJornada } from './jornada'

/** Gera horários relativos ao mesmo instante em UTC, sem depender do fuso do computador. */
const tempo = (segundos: number) => new Date(Date.UTC(2026, 8, 15, 12, 0, segundos)).toISOString()
const bracadeiras = obterDefinicaoDeReceitaDeFabricacao("receita.forja.giuis-bracadeiras")!
const cloch = obterDefinicaoDeReceitaDeFabricacao("receita.metalurgia.tratada-cloch")!
const lenhador = ATIVIDADES_OCIOSAS_INICIAIS.find((atividade) => atividade.idDaProfissao === "lenhador")!
/** Cria um estado novo com identidade e horário fixos, isolando as alterações de cada caso. */
function criarPartida() {
  return criarPartidaLocal({ idDaPartida: "jornada-test", criadoEm: tempo(0), versaoDoConteudo: 'test', nomeDoPersonagem: 'Aedan', classeDoPersonagem: CLASSES_DE_PERSONAGEM[0]!, presente: PRESENTES_INICIAIS.find((presente) => presente.id === "nenhum")! })
}

describe("Jornada com conteúdo real de fabricação", () => {
  it("escolhe, troca e dispensa uma meta sem alterar a atividade atual", () => {
    const trabalhando = iniciarAtividadeOciosa(criarPartida(), lenhador, tempo(0))
    const escolhido = escolherMetaDaJornada(trabalhando, bracadeiras, tempo(1))
    expect(escolhido.ocioso).toBe(trabalhando.ocioso)
    expect(escolhido.fabricacao).toBe(trabalhando.fabricacao)
    const alterado = escolherMetaDaJornada(escolhido, cloch, tempo(2))
    expect(alterado.jornada.meta?.idDaDefinicaoDaReceita).toBe(cloch.id)
    expect(escolherMetaDaJornada(alterado, null, tempo(3)).jornada.meta).toBeNull()
    expect(alterado.ocioso).toBe(trabalhando.ocioso)
  })

  it("usa seis Giúis coletados em uma fabricação bem-sucedida, preservando as recompensas", () => {
    const meta = escolherMetaDaJornada(criarPartida(), bracadeiras, tempo(0))
    const iniciado = iniciarAtividadeOciosa(meta, lenhador, tempo(0))
    const coletado = processarProgressoOcioso(iniciado, lenhador, tempo(24)).partida
    expect(obterProgressoDaMetaDaJornada(coletado, bracadeiras).pronto).toBe(true)
    expect(obterResumoDeRetornoDaJornada(iniciado, coletado)).toContain('Materiais reunidos')
    const preparado = interromperAtividadeOciosa(coletado, tempo(24))
    const fabricacao = iniciarReceitaDeFabricacao(preparado, bracadeiras, tempo(24))
    const concluido = processarProgressoDeFabricacao(fabricacao, bracadeiras, tempo(36)).partida
    // A meta deve registrar a fabricação sem mudar itens, atributos ou experiência concedidos.
    const naoAcompanhado = processarProgressoDeFabricacao({ ...fabricacao, jornada: { meta: null, idsDasReceitasFabricadas: [] } }, bracadeiras, tempo(36)).partida
    expect(concluido.personagem).toEqual(naoAcompanhado.personagem)
    expect(concluido.profissoes).toEqual(naoAcompanhado.profissoes)
    expect(concluido.jornada.meta?.concluidoEm).toBe(tempo(36))
    expect(concluido.jornada.idsDasReceitasFabricadas).toEqual([bracadeiras.id])
    expect(obterAvisoDeFabricacaoDaJornada(fabricacao, concluido)).toContain('Primeira fabricação registrada')
    expect(obterResumoDeRetornoDaJornada(fabricacao, concluido)).toContain('Meta concluída')
    const repeticao = processarProgressoDeFabricacao(concluido, bracadeiras, tempo(36)).partida
    expect(repeticao).toBe(concluido)
    expect(obterAvisoDeFabricacaoDaJornada(concluido, repeticao)).toBeNull()
    expect(obterResumoDeRetornoDaJornada(concluido, repeticao)).toBeNull()
  })

  it("atualiza materiais faltantes após transferências sem contar o estoque do banco como disponível", () => {
    let partida = escolherMetaDaJornada(criarPartida(), bracadeiras, tempo(0))
    partida = { ...partida, personagem: { ...partida.personagem, inventario: [{ idDaDefinicao: 'material.giuis', quantidade: 6 }] } }
    expect(obterProgressoDaMetaDaJornada(partida, bracadeiras).pronto).toBe(true)
    const depositado = depositarPilhaDoInventarioNoBanco(partida, 'material.giuis', 4, tempo(1))
    expect(obterProgressoDaMetaDaJornada(depositado, bracadeiras).ingredientes[0]?.faltante).toBe(4)
    expect(depositado.jornada.meta?.concluidoEm).toBeNull()
    expect(depositado.jornada.idsDasReceitasFabricadas).toEqual([])
  })

  it("mantém produção ativa e ausente equivalentes e registra uma primeira fabricação em vários ciclos", () => {
    let partida = escolherMetaDaJornada(criarPartida(), bracadeiras, tempo(0))
    partida = { ...partida, personagem: { ...partida.personagem, inventario: [{ idDaDefinicao: 'material.giuis', quantidade: 24 }] } }
    const iniciado = iniciarReceitaDeFabricacao(partida, bracadeiras, tempo(0))
    const ausente = processarProgressoDeFabricacao(iniciado, bracadeiras, tempo(48)).partida
    let ativo = iniciado
    // Compara quatro processamentos menores com um único processamento ausente de 48 segundos.
    for (const segundos of [12, 24, 36, 48]) ativo = processarProgressoDeFabricacao(ativo, bracadeiras, tempo(segundos)).partida
    expect(ativo.personagem).toEqual(ausente.personagem)
    expect(ativo.profissoes).toEqual(ausente.profissoes)
    expect(ativo.jornada.idsDasReceitasFabricadas).toEqual([bracadeiras.id])
    expect(ausente.jornada.idsDasReceitasFabricadas).toEqual([bracadeiras.id])
    expect(Boolean(ativo.jornada.meta?.concluidoEm)).toBe(true)
    expect(Boolean(ausente.jornada.meta?.concluidoEm)).toBe(true)
  })

  it("não registra fabricação antes da conclusão ou quando o inventário bloqueia o resultado", () => {
    let partida = escolherMetaDaJornada(criarPartida(), bracadeiras, tempo(0))
    partida = { ...partida, personagem: { ...partida.personagem, inventario: [
      { idDaDefinicao: 'material.giuis', quantidade: 12 },
      ...Array.from({ length: 23 }, (_, indice) => ({ idDaDefinicao: `material.test-${indice}`, quantidade: 1 })),
    ] } }
    const iniciado = iniciarReceitaDeFabricacao(partida, bracadeiras, tempo(0))
    expect(processarProgressoDeFabricacao(iniciado, bracadeiras, tempo(1)).partida.jornada.idsDasReceitasFabricadas).toEqual([])
    const bloqueado = processarProgressoDeFabricacao(iniciado, bracadeiras, tempo(12))
    expect(bloqueado.interrompidoPorCapacidade).toBe(true)
    expect(bloqueado.partida.jornada.idsDasReceitasFabricadas).toEqual([])
    expect(bloqueado.partida.jornada.meta?.concluidoEm).toBeNull()
  })

  it("preserva metas concluídas após consumir o resultado e permite repetir a meta por escolha", () => {
    let partida = escolherMetaDaJornada(criarPartida(), cloch, tempo(0))
    partida = { ...partida, personagem: { ...partida.personagem, inventario: [{ idDaDefinicao: 'material.cloch', quantidade: 6 }] } }
    const primeiro = processarProgressoDeFabricacao(iniciarReceitaDeFabricacao(partida, cloch, tempo(0)), cloch, tempo(6)).partida
    const armazenado = depositarPilhaDoInventarioNoBanco(primeiro, "material.tratada-cloch", 1, tempo(7))
    expect(obterProgressoDaMetaDaJornada(armazenado, cloch).concluido).toBe(true)
    const repetido = escolherMetaDaJornada(armazenado, cloch, tempo(8))
    expect(repetido.jornada.meta?.concluidoEm).toBeNull()
    const segundo = processarProgressoDeFabricacao(repetido, cloch, tempo(12)).partida
    expect(segundo.jornada.idsDasReceitasFabricadas).toEqual([cloch.id])
    expect(obterAvisoDeFabricacaoDaJornada(repetido, segundo)).toContain('Meta concluída')
    expect(obterAvisoDeFabricacaoDaJornada(repetido, segundo)).not.toContain('Primeira')
  })

  it("compara com o equipamento realmente reforçado e inclui uma possível perda de defesa", () => {
    const base = criarPartida()
    expect(obterComparacaoDeEquipamentoDaFabricacao(base, bracadeiras.id)?.linhas.find((linhaDeDados) => linhaDeDados.chave === "defesa")?.diferenca).toBe(6)
    const equipado = { ...base, personagem: { ...base.personagem,
      itensDeEquipamento: [...base.personagem.itensDeEquipamento, { idDaInstancia: "fabricado", idDaDefinicao: "armadura.giuis-bracadeiras", nivelDeReforco: 1 as const }],
      equipamento: { ...base.personagem.equipamento, luvas: "fabricado" },
    } }
    expect(obterComparacaoDeEquipamentoDaFabricacao(equipado, bracadeiras.id)?.linhas.find((linhaDeDados) => linhaDeDados.chave === "defesa")?.diferenca).toBe(-1)
  })
})

describe("encerramento do primeiro arco", () => {
  it("reconhece o contrato concluído sem repetir o convite inicial", () => {
    const partida = criarPartida()
    partida.combate.loboDerrotado = true
    partida.masmorra.contratoAceito = true
    partida.masmorra.contratoConcluido = true
    expect(obterHistoriaDaJornada(partida).rotulo).toBe('Arco concluído')
    expect(obterDialogoDeBrann(partida).acao).toBe('Revisitar Dún Liath')
    expect(obterDialogoDeBrann(partida).lembranca).toBeNull()
  })

  it.each(["morto", "poupado"] as const)("lembra %s sem transformar um contrato inacabado em vitória", (decisao) => {
    const partida = criarPartida()
    partida.combate.loboDerrotado = true
    partida.masmorra.contratoAceito = true
    partida.masmorra.dunLiathProtetor = decisao
    expect(obterHistoriaDaJornada(partida).rotulo).toBe('Contrato em andamento')
    expect(obterDialogoDeBrann(partida).lembranca).not.toBeNull()
    expect(obterDialogoDeBrann(partida).acao).toBe('Rever preparação de Dún Liath')
    expect(obterDialogoDeBrann(partida).corpo).toContain('ainda precisamos recuperar')
  })
})

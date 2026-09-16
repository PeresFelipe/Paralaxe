/**
 * @file Matriz de viabilidade de combate: seis classes combinadas com quatro preparações.
 * Simula uma sequência de referência com conteúdo real e sementes fixas. A preparação
 * é montada diretamente: isto não é um teste da interface nem da obtenção dos materiais.
 * Cada combinação precisa de pelo menos uma conclusão nas oito sementes avaliadas.
 */
import { describe, expect, it } from 'vitest'
import {
  aceitarContratoDeDunLiath,
  aplicarResultadoDeCombate,
  configurarEspacoDeConsumivelDeCombate,
  criarPartidaLocal,
  derivarEstatisticasDeCombateDoJogador,
  simularCombate,
  ensinarEEquiparHabilidadesDeCombate,
  type RecursosDeCombate,
  type PartidaLocal,
} from '@greywake/dominio'
import { CLASSES_DE_PERSONAGEM, PRESENTES_INICIAIS } from './criacaoDePersonagem'
import {
  obterDefinicaoDeHabilidadeDeCombate,
  obterDefinicaoDeConsumivelDeCombate,
  obterDefinicaoDeInimigo,
  obterConjuntoDeHabilidadesAntesDaMasmorra,
} from './combate'
import { obterDefinicaoDeEquipamento } from './equipamento'

const catalogo = {
  obterDefinicaoDeEquipamento,
  obterDefinicaoDeHabilidade: obterDefinicaoDeHabilidadeDeCombate,
  obterDefinicaoDeInimigo,
  obterDefinicaoDeConsumivel: obterDefinicaoDeConsumivelDeCombate,
}

const rotas = ["mineracao", "lenhador", "pesca", "herbologia"] as const
type IdDaRota = (typeof rotas)[number]

/** Resumo da etapa alcançada; aparece na falha para ajudar a localizar a dificuldade. */
type DiagnosticoDaRota = {
  conclusao: boolean
  etapa: string
  vida: number
  preparadosDeCampo: number
}

/** Lê o estoque restante de consumíveis no cenário de teste. */
function itemQuantidade(partida: PartidaLocal, idDaDefinicao: string) {
  return partida.personagem.inventario.find((item) => item.idDaDefinicao === idDaDefinicao)?.quantidade ?? 0
}

/** Injeta suprimentos de preparação sem simular a coleta ou a compra. */
function adicionarItem(partida: PartidaLocal, idDaDefinicao: string, quantidade: number) {
  const existente = partida.personagem.inventario.find((item) => item.idDaDefinicao === idDaDefinicao)
  const inventario = existente
    ? partida.personagem.inventario.map((item) =>
        item.idDaDefinicao === idDaDefinicao ? { ...item, quantidade: item.quantidade + quantidade } : item,
      )
    : [...partida.personagem.inventario, { idDaDefinicao, quantidade }]
  return { ...partida, personagem: { ...partida.personagem, inventario } }
}

/** Cria uma peça exclusiva e a equipa para representar a preparação esperada na rota. */
function adicionarEEquipar(partida: PartidaLocal, idDaDefinicao: string, espaco: "luvas" | "botas") {
  const idDaInstancia = `eq-${partida.personagem.proximaSequenciaDeEquipamento}`
  return {
    ...partida,
    personagem: {
      ...partida.personagem,
      itensDeEquipamento: [
        ...partida.personagem.itensDeEquipamento,
        { idDaInstancia, idDaDefinicao, nivelDeReforco: 0 as const },
      ],
      proximaSequenciaDeEquipamento: partida.personagem.proximaSequenciaDeEquipamento + 1,
      equipamento: { ...partida.personagem.equipamento, [espaco]: idDaInstancia },
    },
  }
}

/** Configura nível, habilidades, armadura e a vantagem específica de cada profissão. */
function prepararRota(partida: PartidaLocal, rota: IdDaRota) {
  const magoUsosPrimeiroPonto = partida.personagem.idDaClasse === "mago"
  let preparado: PartidaLocal = {
    ...partida,
    personagem: {
      ...partida.personagem,
      nivel: 2,
      xp: 100,
      pontosDeAtributoDisponiveis: magoUsosPrimeiroPonto ? 0 : 1,
      atributos: magoUsosPrimeiroPonto
        ? { ...partida.personagem.atributos, vitalidade: partida.personagem.atributos.vitalidade + 1 }
        : partida.personagem.atributos,
      ouro: partida.personagem.ouro + 40,
    },
  }

  preparado = ensinarEEquiparHabilidadesDeCombate(
    preparado,
    obterConjuntoDeHabilidadesAntesDaMasmorra(preparado.personagem.idDaClasse),
    '2026-09-09T12:00:59.000Z',
  )

  preparado = adicionarEEquipar(preparado, "armadura.simples-botas", "botas")
  preparado = { ...preparado, personagem: { ...preparado.personagem, ouro: preparado.personagem.ouro - 20 } }
  if (rota !== "lenhador") {
    preparado = adicionarEEquipar(preparado, "armadura.simples-luvas", "luvas")
    preparado = { ...preparado, personagem: { ...preparado.personagem, ouro: preparado.personagem.ouro - 20 } }
  }

  preparado = aceitarContratoDeDunLiath(preparado, '2026-09-09T12:01:00.000Z')

  if (rota === "mineracao") {
    const reforcadoInstanciaId =
      preparado.personagem.idDaClasse === "mago"
        ? preparado.personagem.equipamento.peitoral
        : preparado.personagem.equipamento.maoPrincipal
    preparado = {
      ...preparado,
      personagem: {
        ...preparado.personagem,
        itensDeEquipamento: preparado.personagem.itensDeEquipamento.map((item) =>
          item.idDaInstancia === reforcadoInstanciaId ? { ...item, nivelDeReforco: 1 as const } : item,
        ),
      },
    }
  }

  if (rota === "lenhador") {
    preparado = adicionarEEquipar(preparado, "armadura.giuis-bracadeiras", "luvas")
  }

  if (rota === "pesca") {
    preparado = adicionarItem(preparado, "item.comida.assado-scadan", 6)
    preparado = configurarEspacoDeConsumivelDeCombate(preparado, 0, "item.comida.assado-scadan", "vida", 70, '2026-09-09T12:01:01.000Z')
  }

  if (rota === "herbologia") {
    preparado = adicionarItem(preparado, "item.consumivel.neantog-preparacao", 6)
    preparado = configurarEspacoDeConsumivelDeCombate(preparado, 0, "item.consumivel.neantog-preparacao", "vida", 70, '2026-09-09T12:01:01.000Z')
  }

  return configurarEspacoDeConsumivelDeCombate(preparado, 1, "item.consumivel.campo-preparacao", "vida", 70, '2026-09-09T12:01:02.000Z')
}

/** Recalcula os máximos do personagem equipado e representa uma recuperação completa. */
function completoRecursos(partida: PartidaLocal): RecursosDeCombate {
  const estatisticas = derivarEstatisticasDeCombateDoJogador(partida, catalogo)
  return {
    vida: estatisticas.vidaMaxima,
    vidaMaxima: estatisticas.vidaMaxima,
    mana: estatisticas.manaMaxima,
    manaMaxima: estatisticas.manaMaxima,
    folego: estatisticas.folegoMaximo,
    folegoMaximo: estatisticas.folegoMaximo,
  }
}

/** Executa e aplica um combate determinístico, carregando os recursos recebidos da luta anterior. */
function luta(partida: PartidaLocal, inimigoId: string, semente: number, recursos: RecursosDeCombate) {
  const resultado = simularCombate(partida, catalogo, inimigoId, semente, 180, recursos)
  return { resultado, partida: aplicarResultadoDeCombate(partida, inimigoId, resultado, '2026-09-09T12:30:00.000Z') }
}

/** Representa o elmo obtido na sequência de referência, mantendo a identidade das peças. */
function equiparGarantidoElmo(partida: PartidaLocal) {
  const idDaInstancia = `eq-${partida.personagem.proximaSequenciaDeEquipamento}`
  return {
    ...partida,
    personagem: {
      ...partida.personagem,
      itensDeEquipamento: [
        ...partida.personagem.itensDeEquipamento,
        { idDaInstancia, idDaDefinicao: "armadura.guarnicao-elmo", nivelDeReforco: 0 as const },
      ],
      proximaSequenciaDeEquipamento: partida.personagem.proximaSequenciaDeEquipamento + 1,
      equipamento: { ...partida.personagem.equipamento, cabeca: idDaInstancia },
    },
  }
}

/** Registra onde a tentativa falhou, a vida restante e os preparados ainda disponíveis. */
function diagnostico(partida: PartidaLocal, etapa: string, vida: number): DiagnosticoDaRota {
  return {
    conclusao: false,
    etapa,
    vida: Math.round(vida),
    preparadosDeCampo: itemQuantidade(partida, "item.consumivel.campo-preparacao"),
  }
}

/** Encadeia inimigos e duas fases do chefe; só restaura recursos no ponto seguro previsto. */
function execucaoReferenciaBaseRota(partida: PartidaLocal, sementeBase: number): DiagnosticoDaRota {
  let atual = partida
  let recursos = completoRecursos(atual)

  const crubach = luta(atual, "inimigo.crubach", sementeBase, recursos)
  if (crubach.resultado.desfecho !== "vitoria") return diagnostico(crubach.partida, 'Crúbach', crubach.resultado.jogador.vida)
  atual = crubach.partida
  recursos = crubach.resultado.jogador

  const tromghiallach = luta(atual, "inimigo.tromghiallach", sementeBase + 1, recursos)
  if (tromghiallach.resultado.desfecho !== "vitoria") return diagnostico(tromghiallach.partida, 'Tromghiallach', tromghiallach.resultado.jogador.vida)
  atual = tromghiallach.partida
  recursos = tromghiallach.resultado.jogador

  atual = equiparGarantidoElmo(atual)
  const guardiao = luta(atual, "inimigo.cosantoir", sementeBase + 10, recursos)
  if (guardiao.resultado.desfecho !== "vitoria") return diagnostico(guardiao.partida, 'Cosantóir', guardiao.resultado.jogador.vida)
  atual = guardiao.partida

  atual = adicionarItem(atual, "item.consumivel.campo-preparacao", 3)
  recursos = completoRecursos(atual)

  const fase1 = luta(atual, "inimigo.fairtheoir-fase1", sementeBase + 20, recursos)
  if (fase1.resultado.desfecho !== "vitoria") return diagnostico(fase1.partida, 'Fairtheoir Fase 1', fase1.resultado.jogador.vida)

  const fase2 = luta(fase1.partida, "inimigo.fairtheoir-fase2", sementeBase + 21, fase1.resultado.jogador)
  if (fase2.resultado.desfecho !== "vitoria") return diagnostico(fase2.partida, 'Fairtheoir Fase 2', fase2.resultado.jogador.vida)

  return {
    conclusao: true,
    etapa: "concluir",
    vida: Math.round(fase2.resultado.jogador.vida),
    preparadosDeCampo: itemQuantidade(fase2.partida, "item.consumivel.campo-preparacao"),
  }
}

describe("Versão 0.1 — matriz de 6 classes × 4 rotas", () => {
  const semPresente = PRESENTES_INICIAIS.find((presente) => presente.id === "nenhum")
  if (!semPresente) throw new Error('Presente Nenhum não encontrado.')

  for (const [classeIndice, classeDoPersonagem] of CLASSES_DE_PERSONAGEM.entries()) {
    for (const [rotaIndice, rota] of rotas.entries()) {
      it(`${classeDoPersonagem.nome} × ${rota} é estruturalmente completável`, () => {
        const base = criarPartidaLocal({
          idDaPartida: `matrix-${classeDoPersonagem.id}-${rota}`,
          criadoEm: '2026-09-09T12:00:00.000Z',
          versaoDoConteudo: '0.1.0-dev',
          nomeDoPersonagem: `${classeDoPersonagem.nome}-${rota}`,
          classeDoPersonagem,
          presente: semPresente,
        })
        const preparado = prepararRota(base, rota)
        const baseSemente = 1000 + classeIndice * 100 + rotaIndice * 10
        const tentativas = Array.from({ length: 8 }, (_, tentativa) =>
          execucaoReferenciaBaseRota(preparado, baseSemente + tentativa * 10_000),
        )

        expect(
          // Este critério prova uma rota possível; não exige vitória garantida em todas as sementes.
          tentativas.some((tentativa) => tentativa.conclusao),
          `Falhas: ${JSON.stringify(tentativas)}`,
        ).toBe(true)
      })
    }
  }
})

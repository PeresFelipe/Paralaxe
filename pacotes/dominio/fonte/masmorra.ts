/**
 * @file Regras da expedição de Dún Liath: rota, salas, decisões, combate e extração.
 * O saque permanece separado do inventário seguro até a extração. Uma derrota descarta
 * a expedição, mas pode preservar a decisão narrativa sobre o Protetor.
 */
import type { CatalogoDeConteudoDeCombate, EntradaDoRegistroDeCombate, ResultadoDeCombate, RecursosDeCombate } from './combate'
import { aplicarResultadoDeCombate, simularCombate } from './combate'
import type { InstanciaDeEquipamento, RaridadeDoEquipamento } from './equipamento'
import type { PartidaLocal } from './personagem'
import { verificarCapacidadeParaEquipamentoNoInventario, verificarCapacidadeParaPilhaNoInventario } from './armazenamento'
import { adaptarInimigoParaDificuldade } from './perfisDeDunLiath'

export type TipoDeSalaDaMasmorra =
  | "entrada"
  | "combate"
  | 'elite'
  | "evento"
  | "tesouro"
  | "recuperacao"
  | "armadilha"
  | "secreta"
  | "chefe"

export interface DefinicaoDeSalaDaMasmorra {
  id: string
  nome: string
  tipo: TipoDeSalaDaMasmorra
  idDaDefinicaoDoInimigo?: string
  idsDasProximasSalas: readonly string[]
  /** Texto que mostra apenas indícios ambientais da rota, sem revelar o tipo de recompensa. */
  pistasDasSaidas?: Readonly<Record<string, string>>
  /** Ambientação da sala persistida no grafo. */
  descricao?: string
  /** Dano percentual não letal, aplicável apenas ao tipo armadilha. */
  fracaoDeDanoDaArmadilha?: number
  /** Requisito somente para um desvio opcional; nunca bloqueia a rota ao Chefe. */
  requisitoDeItemParaEntrar?: string
}

export const DIFICULDADES_DE_DUN_LIATH = ['facil', 'normal', 'dificil', 'impossivel'] as const
export type DificuldadeDaMasmorra = (typeof DIFICULDADES_DE_DUN_LIATH)[number]

export interface DefinicaoDeMasmorra {
  id: string
  nome: string
  dificuldade: DificuldadeDaMasmorra
  /** Gerado antes de iniciar a expedição; a definição-base continua sendo o cânone da primeira visita. */
  procedural?: boolean
  salas: readonly DefinicaoDeSalaDaMasmorra[]
  idDaSalaInicial: string
}

export interface PilhaDaExpedicao {
  idDaDefinicao: string
  quantidade: number
}

/** Saque provisório com raridade e afixos; recebe um ID de instância permanente somente na extração. */
export interface EquipamentoDaExpedicao {
  idDaDefinicao: string
  raridade: RaridadeDoEquipamento
  idsDosAfixos: string[]
}

/** Estado retomável da viagem: semente, caminho escolhido, salas resolvidas, recursos e saque em risco. */
export interface ExpedicaoNaMasmorra {
  idDaDefinicaoDaMasmorra: string
  dificuldade: DificuldadeDaMasmorra
  semente: number
  /** Snapshot imutável do grafo gerado. Saves antigos usam o catálogo fixo sem esta propriedade. */
  grafoGerado?: DefinicaoDeMasmorra | null
  idDaSalaAtual: string
  idsDasSalasVisitadas: string[]
  idsDasSalasResolvidas: string[]
  ramificacoesEscolhidas: Record<string, string>
  bolsaDaExpedicao: PilhaDaExpedicao[]
  equipamentosDaExpedicao: EquipamentoDaExpedicao[]
  recursos: RecursosDeCombate
  decisaoSobreOProtetor: "morto" | "poupado" | null
  registroDeSuprimentosRecuperado: boolean
  fragmentoDoTratadoRecuperado: boolean
  extracaoSeguraDisponivel: boolean
  concluido: boolean
  iniciadoEm: string
  atualizadoEm: string
}

export interface EstadoDeProgressoDaMasmorra {
  expedicaoAtiva: ExpedicaoNaMasmorra | null
  dunLiathFacilConquistado: boolean
  /** Primeiras conclusões por dificuldade. Em saves anteriores, o Fácil é inferido da flag legada. */
  dificuldadesConcluidas?: DificuldadeDaMasmorra[]
  dunLiathProtetor: "morto" | "poupado" | null
  contratoAceito: boolean
  contratoConcluido: boolean
  guardaInstintivaDesbloqueada: boolean
}

export interface CatalogoDeConteudoDaMasmorra extends CatalogoDeConteudoDeCombate {
  obterDefinicaoDeMasmorra(masmorraId: string): DefinicaoDeMasmorra | null
}

export interface ResolucaoDaSalaDaMasmorra {
  partida: PartidaLocal
  resultadoDeCombate?: ResultadoDeCombate
}

const IDS_DOS_AFIXOS = [
  "afixo.vitalidade-1",
  "afixo.mente-1",
  "afixo.vigor-1",
  "afixo.forca-1",
  "afixo.destreza-1",
  "afixo.inteligencia-1",
  "afixo.fe-1",
  "afixo.precisao-4",
  "afixo.defesa-2",
] as const

/** Produz sorteios reproduzíveis a partir da semente derivada da expedição e da sala. */
function criarGeradorAleatorio(semente: number) {
  let estado = semente >>> 0
  return () => {
    estado = (Math.imul(estado, 1664525) + 1013904223) >>> 0
    return estado / 0x1_0000_0000
  }
}

/** Acumula um recurso na bolsa provisória sem concedê-lo ainda ao inventário seguro. */
function adicionarPilha(pilhas: PilhaDaExpedicao[], idDaDefinicao: string, quantidade = 1) {
  const existente = pilhas.find((pilha) => pilha.idDaDefinicao === idDaDefinicao)
  if (!existente) return [...pilhas, { idDaDefinicao, quantidade }]

  return pilhas.map((pilha) =>
    pilha.idDaDefinicao === idDaDefinicao
      ? { ...pilha, quantidade: pilha.quantidade + quantidade }
      : pilha,
  )
}

/** Soma uma recompensa ao inventário; a verificação de capacidade é feita pelo fluxo que chama a função. */
function adicionarInventarioPilha(
  inventario: PartidaLocal["personagem"]["inventario"],
  idDaDefinicao: string,
  quantidade: number,
) {
  const existente = inventario.find((pilha) => pilha.idDaDefinicao === idDaDefinicao)
  if (!existente) return [...inventario, { idDaDefinicao, quantidade }]

  return inventario.map((pilha) =>
    pilha.idDaDefinicao === idDaDefinicao
      ? { ...pilha, quantidade: pilha.quantidade + quantidade }
      : pilha,
  )
}

/** Consolida por definição o consumo de fases diferentes para aplicar o débito combinado uma única vez. */
function mesclarConsumidoItens(primeiro: ResultadoDeCombate["itensConsumidos"], segundo: ResultadoDeCombate["itensConsumidos"]) {
  const quantidades = new Map<string, number>()
  for (const pilha of [...primeiro, ...segundo]) {
    quantidades.set(pilha.idDaDefinicao, (quantidades.get(pilha.idDaDefinicao) ?? 0) + pilha.quantidade)
  }
  return [...quantidades.entries()].map(([idDaDefinicao, quantidade]) => ({ idDaDefinicao, quantidade }))
}

/** Valores de apoio derivados só dos atributos; o chamador pode fornecer máximos completos com bônus de equipamento. */
function criarRecursosIniciais(partida: PartidaLocal): RecursosDeCombate {
  const { vitalidade, mente, vigor } = partida.personagem.atributos
  const vidaMaxima = 100 + vitalidade * 12
  const manaMaxima = 30 + mente * 10
  const folegoMaximo = 60 + vigor * 8

  return {
    vida: vidaMaxima,
    vidaMaxima,
    mana: manaMaxima,
    manaMaxima,
    folego: folegoMaximo,
    folegoMaximo,
  }
}

/** Desloca os instantes de uma segunda fase para formar uma linha de tempo contínua. */
function deslocamentoRegistro(registro: EntradaDoRegistroDeCombate[], deslocamento: number) {
  return registro.map((entrada) => ({
    ...entrada,
    instanteEmSegundos: Number((entrada.instanteEmSegundos + deslocamento).toFixed(3)),
  }))
}

/**
 * Resolve duas fases do chefe, carregando recursos e estoque consumido entre elas.
 * A segunda fase usa uma semente derivada; o retorno consolida duração, consumos e registro.
 */
function simularFairtheoirEncontro(
  partida: PartidaLocal,
  catalogo: CatalogoDeConteudoDeCombate,
  semente: number,
  recursosIniciais: RecursosDeCombate,
): ResultadoDeCombate {
  const fase1 = simularCombate(
    partida,
    catalogo,
    "inimigo.fairtheoir-fase1",
    semente,
    180,
    recursosIniciais,
  )
  if (fase1.desfecho !== "vitoria") return fase1

  // A Fase 2 precisa enxergar o estoque já reduzido pela Fase 1, mas esse estado é
  // transitório: o resultado combinado será aplicado à partida real apenas uma vez.
  const fase2EntradaDeDadosPartida = aplicarResultadoDeCombate(
    partida,
    "inimigo.fairtheoir-fase1",
    fase1,
    partida.atualizadoEm,
  )
  const fase2 = simularCombate(
    fase2EntradaDeDadosPartida,
    catalogo,
    "inimigo.fairtheoir-fase2",
    (semente ^ 0x9e3779b9) >>> 0,
    180,
    fase1.jogador,
  )
  const faseTransicaoEm = fase1.duracaoEmSegundos

  return {
    desfecho: fase2.desfecho,
    duracaoEmSegundos: Number((fase1.duracaoEmSegundos + fase2.duracaoEmSegundos).toFixed(3)),
    jogador: fase2.jogador,
    vidaDoInimigo: fase2.vidaDoInimigo,
    xpConcedido: fase2.desfecho === "vitoria" ? 120 : 0,
    itensConsumidos: mesclarConsumidoItens(fase1.itensConsumidos, fase2.itensConsumidos),
    semente,
    registro: [
      ...fase1.registro.filter((entrada) => entrada.tipo !== "resultado"),
      {
        instanteEmSegundos: faseTransicaoEm,
        agente: 'system',
        tipo: "resultado",
        mensagem: 'Fairtheoir chega a 45% da Vida total. Fase 2 — Desespero.',
      },
      ...deslocamentoRegistro(fase2.registro, faseTransicaoEm),
    ],
  }
}

/** Usa faixas cumulativas: comum, depois incomum; o restante da probabilidade resulta em raro. */
function sortearRaridade(aleatorio: () => number, comum: number, incomum: number): RaridadeDoEquipamento {
  const valor = aleatorio()
  if (valor < comum) return "comum"
  if (valor < comum + incomum) return "incomum"
  return "raro"
}

/** A raridade determina quantos afixos distintos o equipamento sorteado recebe. */
function afixoContagem(raridade: RaridadeDoEquipamento) {
  return raridade === "comum" ? 1 : raridade === "incomum" ? 2 : 3
}

/** Retira cada afixo do conjunto após o sorteio para não repeti-lo na mesma peça. */
function sortearAfixos(aleatorio: () => number, contagem: number) {
  const conjuntoDeSorteio = [...IDS_DOS_AFIXOS]
  const resultado: string[] = []

  while (resultado.length < contagem && conjuntoDeSorteio.length > 0) {
    const indice = Math.floor(aleatorio() * conjuntoDeSorteio.length)
    const [escolhidoPorSorteio] = conjuntoDeSorteio.splice(indice, 1)
    if (escolhidoPorSorteio) resultado.push(escolhidoPorSorteio)
  }

  return resultado
}

/** Escolhe uma definição do conjunto da sala e compõe raridade e afixos do saque provisório. */
function sortearEquipamento(
  aleatorio: () => number,
  definicaoIds: readonly string[],
  raridadeLimiares: { comum: number; incomum: number },
): EquipamentoDaExpedicao {
  const idDaDefinicao = definicaoIds[Math.floor(aleatorio() * definicaoIds.length)] ?? definicaoIds[0]
  if (!idDaDefinicao) throw new Error('Pool de equipamento vazio.')

  const raridade = sortearRaridade(aleatorio, raridadeLimiares.comum, raridadeLimiares.incomum)
  return {
    idDaDefinicao,
    raridade,
    idsDosAfixos: sortearAfixos(aleatorio, afixoContagem(raridade)),
  }
}

/** Entrega suprimentos uma única vez, após conferir espaço; repetir um contrato aceito não duplica a recompensa. */
export function aceitarContratoDeDunLiath(partida: PartidaLocal, agora: string): PartidaLocal {
  if (partida.masmorra.contratoAceito) return partida
  if (partida.masmorra.contratoConcluido) return partida
  verificarCapacidadeParaPilhaNoInventario(partida, "item.consumivel.campo-preparacao", 2)

  return {
    ...partida,
    atualizadoEm: agora,
    personagem: {
      ...partida.personagem,
      inventario: adicionarInventarioPilha(
        partida.personagem.inventario,
        "item.consumivel.campo-preparacao",
        2,
      ),
    },
    masmorra: { ...partida.masmorra, contratoAceito: true },
  }
}

/** Retorna as dificuldades realmente acessíveis, incluindo saves antigos com Fácil concluído. */
export function obterDificuldadesDesbloqueadasDaMasmorra(estado: EstadoDeProgressoDaMasmorra): DificuldadeDaMasmorra[] {
  const concluidas = new Set(estado.dificuldadesConcluidas ?? [])
  if (estado.dunLiathFacilConquistado) concluidas.add('facil')
  const liberadas: DificuldadeDaMasmorra[] = ['facil']
  if (concluidas.has('facil')) liberadas.push('normal')
  if (concluidas.has('normal')) liberadas.push('dificil')
  if (concluidas.has('dificil')) liberadas.push('impossivel')
  return liberadas
}

/** Não altera o catálogo global: cada encontro recebe seu perfil escalado e as técnicas da dificuldade. */
function catalogoEscaladoParaDificuldade(
  catalogo: CatalogoDeConteudoDaMasmorra, dificuldade: DificuldadeDaMasmorra,
): CatalogoDeConteudoDaMasmorra {
  if (dificuldade === 'facil') return catalogo
  return {
    ...catalogo,
    obterDefinicaoDeInimigo: (id) => {
      const base = catalogo.obterDefinicaoDeInimigo(id)
      return base ? adaptarInimigoParaDificuldade(base, dificuldade) : null
    },
  }
}

/** Inicializa a rota na entrada e herda uma decisão narrativa anterior, quando já existir. */
export function criarExpedicaoNaMasmorra(
  partida: PartidaLocal,
  masmorra: DefinicaoDeMasmorra,
  semente: number,
  agora: string,
  recursosIniciais?: RecursosDeCombate,
): ExpedicaoNaMasmorra {
  return {
    idDaDefinicaoDaMasmorra: masmorra.id,
    dificuldade: masmorra.dificuldade,
    semente,
    grafoGerado: masmorra.procedural ? masmorra : null,
    idDaSalaAtual: masmorra.idDaSalaInicial,
    idsDasSalasVisitadas: [masmorra.idDaSalaInicial],
    idsDasSalasResolvidas: [],
    ramificacoesEscolhidas: {},
    bolsaDaExpedicao: [],
    equipamentosDaExpedicao: [],
    recursos: recursosIniciais ?? criarRecursosIniciais(partida),
    decisaoSobreOProtetor: partida.masmorra.dunLiathProtetor,
    registroDeSuprimentosRecuperado: false,
    fragmentoDoTratadoRecuperado: false,
    extracaoSeguraDisponivel: false,
    concluido: false,
    iniciadoEm: agora,
    atualizadoEm: agora,
  }
}

/** Exige contrato e ausência de outra expedição ou trabalho ativo antes de criar o estado da viagem. */
export function iniciarMasmorra(
  partida: PartidaLocal,
  masmorra: DefinicaoDeMasmorra,
  semente: number,
  agora: string,
  recursosIniciais?: RecursosDeCombate,
): PartidaLocal {
  if (partida.ocioso.atividadeAtiva || partida.fabricacao.receitaAtiva) {
    throw new Error("Interrompa a atividade Ocioso antes de iniciar uma Masmorra.")
  }
  if (partida.masmorra.expedicaoAtiva) throw new Error("Já existe uma Expedição na Masmorra ativa.")
  if (!partida.masmorra.contratoAceito && !partida.masmorra.contratoConcluido) {
    throw new Error('Aceite primeiro o Contrato — Fortaleza Cinzenta.')
  }
  if (masmorra.id.startsWith('masmorra.dun-liath.') &&
      !obterDificuldadesDesbloqueadasDaMasmorra(partida.masmorra).includes(masmorra.dificuldade)) {
    throw new Error(`Conclua a dificuldade anterior antes de acessar ${masmorra.dificuldade}.`)
  }

  return {
    ...partida,
    atualizadoEm: agora,
    personagem: { ...partida.personagem, idDaLocalizacaoAtual: masmorra.id },
    masmorra: {
      ...partida.masmorra,
      expedicaoAtiva: criarExpedicaoNaMasmorra(partida, masmorra, semente, agora, recursosIniciais),
    },
  }
}

/** Só avança por uma saída da sala resolvida e impede revisitar salas, tornando a ramificação irreversível. */
export function escolherCaminhoNaMasmorra(
  partida: PartidaLocal,
  masmorra: DefinicaoDeMasmorra,
  proximoSalaId: string,
  agora: string,
): PartidaLocal {
  const execucao = partida.masmorra.expedicaoAtiva
  if (!execucao) throw new Error("Nenhuma Expedição na Masmorra ativa.")

  const mapaPersistido = execucao.grafoGerado ?? masmorra
  const sala = mapaPersistido.salas.find((candidato) => candidato.id === execucao.idDaSalaAtual)
  if (!sala) throw new Error('Sala atual inválida.')
  if (!execucao.idsDasSalasResolvidas.includes(sala.id)) {
    throw new Error('Resolva a sala atual antes de avançar.')
  }
  if (!sala.idsDasProximasSalas.includes(proximoSalaId)) {
    throw new Error('Esse caminho não parte da sala atual.')
  }
  const destino = mapaPersistido.salas.find(candidato => candidato.id === proximoSalaId)
  if (!destino) throw new Error('O corredor selecionado não pertence à estrutura desta expedição.')
  if (destino.requisitoDeItemParaEntrar &&
      !partida.personagem.inventario.some(item =>
        item.idDaDefinicao === destino.requisitoDeItemParaEntrar && item.quantidade > 0)) {
    throw new Error('A passagem permanece selada. É necessário o Lacre do Comandante.')
  }
  if (execucao.idsDasSalasVisitadas.includes(proximoSalaId)) {
    throw new Error("A rota da Masmorra é irreversível.")
  }

  return {
    ...partida,
    atualizadoEm: agora,
    masmorra: {
      ...partida.masmorra,
      expedicaoAtiva: {
        ...execucao,
        idDaSalaAtual: proximoSalaId,
        idsDasSalasVisitadas: [...execucao.idsDasSalasVisitadas, proximoSalaId],
        ramificacoesEscolhidas:
          sala.idsDasProximasSalas.length > 1
            ? { ...execucao.ramificacoesEscolhidas, [sala.id]: proximoSalaId }
            : execucao.ramificacoesEscolhidas,
        atualizadoEm: agora,
      },
    },
  }
}

/**
 * Preserva os recursos entre encontros, aplica o resultado e acrescenta saques específicos do inimigo.
 * Em derrota ou tempo esgotado, encerra a expedição antes de marcar a sala como resolvida.
 */
function resolverCombateSala(
  partida: PartidaLocal,
  masmorra: DefinicaoDeMasmorra,
  catalogo: CatalogoDeConteudoDaMasmorra,
  execucao: ExpedicaoNaMasmorra,
  sala: DefinicaoDeSalaDaMasmorra,
  aleatorio: () => number,
  agora: string,
): { partida: PartidaLocal; execucao: ExpedicaoNaMasmorra; resultadoDeCombate: ResultadoDeCombate } {
  if (!sala.idDaDefinicaoDoInimigo) throw new Error('Sala não possui inimigo.')

  // Derivar a semente da viagem e do avanço da rota mantém o encontro reproduzível ao recarregar.
  const encontroSemente = (execucao.semente + execucao.idsDasSalasVisitadas.length * 7919) >>> 0
  const ehFairtheoir = sala.id === "sala.fairtheoir"
  const catalogoDoEncontro = catalogoEscaladoParaDificuldade(catalogo, execucao.dificuldade)
  const resultadoDeCombate = ehFairtheoir
    ? simularFairtheoirEncontro(partida, catalogoDoEncontro, encontroSemente, execucao.recursos)
    : simularCombate(
        partida,
        catalogoDoEncontro,
        sala.idDaDefinicaoDoInimigo,
        encontroSemente,
        180,
        execucao.recursos,
      )

  if (resultadoDeCombate.desfecho !== "vitoria") {
    const consumidoPartida = aplicarResultadoDeCombate(partida, sala.idDaDefinicaoDoInimigo, resultadoDeCombate, agora)
    return { partida: encerrarExpedicaoComDerrota(consumidoPartida, agora), execucao, resultadoDeCombate }
  }

  const aplicadoInimigoId = ehFairtheoir ? "inimigo.fairtheoir-fase2" : sala.idDaDefinicaoDoInimigo
  let proximoPartida = aplicarResultadoDeCombate(partida, aplicadoInimigoId, resultadoDeCombate, agora)
  proximoPartida = {
    ...proximoPartida,
    personagem: { ...proximoPartida.personagem, idDaLocalizacaoAtual: masmorra.id },
  }

  let proximoExecucao: ExpedicaoNaMasmorra = {
    ...(proximoPartida.masmorra.expedicaoAtiva ?? execucao),
    recursos: resultadoDeCombate.jogador,
  }

  if (sala.idDaDefinicaoDoInimigo === "inimigo.crubach" && aleatorio() < 0.35) {
    proximoExecucao = {
      ...proximoExecucao,
      equipamentosDaExpedicao: [
        ...proximoExecucao.equipamentosDaExpedicao,
        sortearEquipamento(
          aleatorio,
          ["armadura.guarnicao-luvas", "armadura.guarnicao-botas", "arma.guarnicao-espada"],
          { comum: 0.85, incomum: 0.14 },
        ),
      ],
    }
  }

  if (sala.idDaDefinicaoDoInimigo === "inimigo.tromghiallach" && aleatorio() < 0.45) {
    proximoExecucao = {
      ...proximoExecucao,
      equipamentosDaExpedicao: [
        ...proximoExecucao.equipamentosDaExpedicao,
        sortearEquipamento(
          aleatorio,
          ["armadura.guarnicao-elmo", "armadura.guarnicao-perneiras", "arma.bastiao-maca"],
          { comum: 0.8, incomum: 0.18 },
        ),
      ],
    }
  }

  if (sala.idDaDefinicaoDoInimigo === "inimigo.cosantoir") {
    proximoExecucao = {
      ...proximoExecucao,
      bolsaDaExpedicao: adicionarPilha(proximoExecucao.bolsaDaExpedicao, "item.dun-liath.viga", 1),
    }

    if (aleatorio() < 0.25) {
      proximoExecucao = {
        ...proximoExecucao,
        equipamentosDaExpedicao: [
          ...proximoExecucao.equipamentosDaExpedicao,
          sortearEquipamento(
            aleatorio,
            ["arma.vigia-lanca", "escudo.vigia-escudo", "armadura.guarnicao-perneiras"],
            { comum: 0.55, incomum: 0.4 },
          ),
        ],
      }
    }
  }

  if (ehFairtheoir) {
    proximoExecucao = {
      ...proximoExecucao,
      bolsaDaExpedicao: adicionarPilha(proximoExecucao.bolsaDaExpedicao, "item.fairtheoir-fragmento", 1),
      concluido: true,
    }
  }

  return { partida: proximoPartida, execucao: proximoExecucao, resultadoDeCombate }
}

/**
 * Resolve a sala atual uma única vez, despachando combate, evento, tesouro ou recuperação.
 * A marcação em idsDasSalasResolvidas impede reabrir recompensas da mesma sala.
 */
export function resolverSalaDaMasmorra(
  partida: PartidaLocal,
  masmorra: DefinicaoDeMasmorra,
  catalogo: CatalogoDeConteudoDaMasmorra,
  agora: string,
): ResolucaoDaSalaDaMasmorra {
  const execucao = partida.masmorra.expedicaoAtiva
  if (!execucao) throw new Error("Nenhuma Expedição na Masmorra ativa.")

  const mapaPersistido = execucao.grafoGerado ?? masmorra
  const sala = mapaPersistido.salas.find((candidato) => candidato.id === execucao.idDaSalaAtual)
  if (!sala) throw new Error('Sala atual inválida.')
  if (execucao.idsDasSalasResolvidas.includes(sala.id)) throw new Error('Essa sala já foi resolvida.')
  if (sala.id === "sala.protetor" && !execucao.decisaoSobreOProtetor) {
    throw new Error('Escolha Matar ou Poupar antes de resolver esse evento.')
  }

  // Os sorteios de saque usam a mesma posição da rota; não dependem da hora real em que a sala é aberta.
  const aleatorio = criarGeradorAleatorio((execucao.semente ^ execucao.idsDasSalasVisitadas.length * 2654435761) >>> 0)
  let proximoPartida = partida
  let proximoExecucao = execucao
  let resultadoDeCombate: ResultadoDeCombate | null = null

  if (sala.idDaDefinicaoDoInimigo) {
    const combateResolucao = resolverCombateSala(
      partida,
      masmorra,
      catalogo,
      execucao,
      sala,
      aleatorio,
      agora,
    )
    resultadoDeCombate = combateResolucao.resultadoDeCombate

    if (!combateResolucao.partida.masmorra.expedicaoAtiva) {
      return { partida: combateResolucao.partida, resultadoDeCombate }
    }

    proximoPartida = combateResolucao.partida
    proximoExecucao = combateResolucao.execucao
  }

  // Armadilhas novas nunca eliminam o jogador instantaneamente: indícios foram mostrados
  // na rota anterior e a consequência usa apenas recursos da expedição.
  if (sala.tipo === "armadilha") {
    const fracao = Math.min(0.20, Math.max(0, sala.fracaoDeDanoDaArmadilha ?? 0.08))
    const dano = Math.min(Math.max(0, proximoExecucao.recursos.vida - 1),
      Math.max(1, Math.ceil(proximoExecucao.recursos.vidaMaxima * fracao)))
    proximoExecucao = { ...proximoExecucao,
      recursos: { ...proximoExecucao.recursos, vida: proximoExecucao.recursos.vida - dano } }
  }

  // O Arquivo Selado oferece um registro histórico, sem gerar Relíquia automaticamente.
  // Assim como qualquer saque de expedição, o documento é perdido na derrota.
  if (sala.id === 'sala.procedural.arquivo-selado') {
    proximoExecucao = { ...proximoExecucao,
      bolsaDaExpedicao: adicionarPilha(proximoExecucao.bolsaDaExpedicao, 'item.dun-liath.registro-arquivo', 1) }
  } else if (sala.tipo === "secreta") {
    proximoExecucao = { ...proximoExecucao,
      bolsaDaExpedicao: adicionarPilha(proximoExecucao.bolsaDaExpedicao, 'item.dun-liath.sucata', 1) }
  }

  if (sala.id === "sala.tratado") {
    proximoExecucao = {
      ...proximoExecucao,
      fragmentoDoTratadoRecuperado: true,
      bolsaDaExpedicao: adicionarPilha(proximoExecucao.bolsaDaExpedicao, "item.tratado-fragmento", 1),
    }
  }

  if (sala.id === "sala.registroDeDados") {
    proximoExecucao = {
      ...proximoExecucao,
      registroDeSuprimentosRecuperado: true,
      bolsaDaExpedicao: adicionarPilha(proximoExecucao.bolsaDaExpedicao, "item.guarnicao-suprimento-registroDeDados", 1),
    }
  }

  if (
    sala.id === "sala.arsenal" &&
    !proximoExecucao.equipamentosDaExpedicao.some((item) => item.idDaDefinicao === "armadura.guarnicao-elmo")
  ) {
    proximoExecucao = {
      ...proximoExecucao,
      equipamentosDaExpedicao: [
        ...proximoExecucao.equipamentosDaExpedicao,
        sortearEquipamento(aleatorio, ["armadura.guarnicao-elmo"], { comum: 1, incomum: 0 }),
      ],
    }
  }

  // O ponto de recuperação restaura recursos e libera a retirada segura dos saques já obtidos.
  if (sala.tipo === "recuperacao") {
    proximoExecucao = {
      ...proximoExecucao,
      extracaoSeguraDisponivel: true,
      recursos: {
        ...proximoExecucao.recursos,
        vida: proximoExecucao.recursos.vidaMaxima,
        mana: proximoExecucao.recursos.manaMaxima,
        folego: proximoExecucao.recursos.folegoMaximo,
      },
      bolsaDaExpedicao: adicionarPilha(
        proximoExecucao.bolsaDaExpedicao,
        "item.consumivel.campo-preparacao",
        3,
      ),
    }
  }

  proximoExecucao = {
    ...proximoExecucao,
    idsDasSalasResolvidas: [...proximoExecucao.idsDasSalasResolvidas, sala.id],
    atualizadoEm: agora,
  }

  const resolvidoPartida: PartidaLocal = {
    ...proximoPartida,
    atualizadoEm: agora,
    personagem: { ...proximoPartida.personagem, idDaLocalizacaoAtual: masmorra.id },
    masmorra: { ...proximoPartida.masmorra, expedicaoAtiva: proximoExecucao },
  }

  return resultadoDeCombate ? { partida: resolvidoPartida, resultadoDeCombate } : { partida: resolvidoPartida }
}

/** Registra uma escolha única na sala apropriada; a resolução da sala exige que ela já tenha sido tomada. */
export function decidirDestinoDoProtetor(
  partida: PartidaLocal,
  decisao: "morto" | "poupado",
  agora: string,
): PartidaLocal {
  const execucao = partida.masmorra.expedicaoAtiva
  if (!execucao) throw new Error("Nenhuma Expedição na Masmorra ativa.")
  if (execucao.idDaSalaAtual !== "sala.protetor") {
    throw new Error('Essa decisão só existe no Abrigo Improvisado.')
  }
  if (execucao.decisaoSobreOProtetor) throw new Error("Essa decisão já foi tomada nesta expedição.")

  return {
    ...partida,
    atualizadoEm: agora,
    masmorra: {
      ...partida.masmorra,
      expedicaoAtiva: { ...execucao, decisaoSobreOProtetor: decisao, atualizadoEm: agora },
    },
  }
}

/** Transforma os saques em instâncias eq-N, mantendo raridade e afixos e avançando a sequência da partida. */
function materializarExpedicaoEquipamento(
  partida: PartidaLocal,
  saque: EquipamentoDaExpedicao[],
) {
  let proximaSequencia = partida.personagem.proximaSequenciaDeEquipamento
  const criado: InstanciaDeEquipamento[] = saque.map((item) => ({
    idDaInstancia: `eq-${proximaSequencia++}`,
    idDaDefinicao: item.idDaDefinicao,
    nivelDeReforco: 0,
    raridade: item.raridade,
    idsDosAfixos: [...item.idsDosAfixos],
  }))

  return { criado, proximaSequencia }
}

/**
 * Confere espaço para todo o saque antes de concluir a transferência.
 * Concede recompensas de contrato e primeira conclusão apenas quando suas condições ainda não foram registradas.
 */
export function extrairExpedicaoDaMasmorra(partida: PartidaLocal, agora: string): PartidaLocal {
  const execucao = partida.masmorra.expedicaoAtiva
  if (!execucao) throw new Error("Nenhuma Expedição na Masmorra ativa.")
  if (!execucao.extracaoSeguraDisponivel && !execucao.concluido) {
    throw new Error('A retirada segura ainda não está disponível.')
  }

  let inventario = partida.personagem.inventario
  for (const pilha of execucao.bolsaDaExpedicao) {
    const previa: PartidaLocal = {
      ...partida,
      personagem: { ...partida.personagem, inventario },
    }
    verificarCapacidadeParaPilhaNoInventario(previa, pilha.idDaDefinicao, pilha.quantidade)
    inventario = adicionarInventarioPilha(inventario, pilha.idDaDefinicao, pilha.quantidade)
  }

  const anteriores = new Set<DificuldadeDaMasmorra>(partida.masmorra.dificuldadesConcluidas ??
    (partida.masmorra.dunLiathFacilConquistado ? ['facil'] : []))
  const primeiraNestaDificuldade = execucao.concluido && !anteriores.has(execucao.dificuldade)
  const receberLacre = primeiraNestaDificuldade && execucao.dificuldade === 'impossivel'
  const receberEscudo = primeiraNestaDificuldade && execucao.dificuldade === 'dificil'
  if (receberLacre) {
    const previa: PartidaLocal = { ...partida, personagem: { ...partida.personagem, inventario } }
    verificarCapacidadeParaPilhaNoInventario(previa, 'item.dun-liath.lacre-comandante', 1)
    inventario = adicionarInventarioPilha(inventario, 'item.dun-liath.lacre-comandante', 1)
  }
  const equipamentosDaExtracao: EquipamentoDaExpedicao[] = receberEscudo
    ? [...execucao.equipamentosDaExpedicao, {
      idDaDefinicao: 'escudo.ultimo-vigia', raridade: 'comum', idsDosAfixos: ['afixo.defesa-2'],
    }]
    : execucao.equipamentosDaExpedicao
  // A prévia já contém as pilhas extraídas, pois elas também consomem espaços que os equipamentos disputam.
  const equipamentoPrevia: PartidaLocal = {
    ...partida,
    personagem: { ...partida.personagem, inventario },
  }
  if (equipamentosDaExtracao.length > 0) {
    verificarCapacidadeParaEquipamentoNoInventario(equipamentoPrevia, equipamentosDaExtracao.length)
  }
  const equipamento = materializarExpedicaoEquipamento(partida, equipamentosDaExtracao)
  // Flags permanentes separam a conclusão desta viagem das recompensas que só podem ser concedidas uma vez.
  const primeiroConcluir = execucao.concluido && execucao.dificuldade === 'facil' && !partida.masmorra.dunLiathFacilConquistado
  const jaPossuiRegistroDeDados = inventario.some(
    (pilha) =>
      pilha.idDaDefinicao === "item.guarnicao-suprimento-registroDeDados" && pilha.quantidade > 0,
  )
  const contratoPodeConclusao =
    execucao.concluido && (execucao.registroDeSuprimentosRecuperado || jaPossuiRegistroDeDados)
  const contratoRecompensa = contratoPodeConclusao && !partida.masmorra.contratoConcluido

  return {
    ...partida,
    atualizadoEm: agora,
    personagem: {
      ...partida.personagem,
      idDaLocalizacaoAtual: "cidade-livre.taverna",
      inventario,
      itensDeEquipamento: [...partida.personagem.itensDeEquipamento, ...equipamento.criado],
      proximaSequenciaDeEquipamento: equipamento.proximaSequencia,
      ouro: partida.personagem.ouro + (contratoRecompensa ? 150 : 0),
      xp: partida.personagem.xp + (contratoRecompensa ? 150 : 0),
      idsDasHabilidadesConhecidas:
        primeiroConcluir && !partida.personagem.idsDasHabilidadesConhecidas.includes("habilidade.instintiva-guarda")
          ? [...partida.personagem.idsDasHabilidadesConhecidas, "habilidade.instintiva-guarda"]
          : partida.personagem.idsDasHabilidadesConhecidas,
    },
    masmorra: {
      expedicaoAtiva: null,
      dunLiathFacilConquistado: partida.masmorra.dunLiathFacilConquistado ||
        (execucao.concluido && execucao.dificuldade === 'facil'),
      dificuldadesConcluidas: primeiraNestaDificuldade
        ? [...anteriores, execucao.dificuldade]
        : [...anteriores],
      dunLiathProtetor: partida.masmorra.dunLiathProtetor ?? execucao.decisaoSobreOProtetor,
      contratoAceito: partida.masmorra.contratoAceito,
      contratoConcluido: partida.masmorra.contratoConcluido || contratoPodeConclusao,
      guardaInstintivaDesbloqueada: partida.masmorra.guardaInstintivaDesbloqueada || primeiroConcluir,
    },
  }
}

/** Apaga a viagem e seus saques provisórios, retorna à cidade e conserva a decisão narrativa já tomada. */
export function encerrarExpedicaoComDerrota(partida: PartidaLocal, agora: string): PartidaLocal {
  const execucao = partida.masmorra.expedicaoAtiva

  return {
    ...partida,
    atualizadoEm: agora,
    personagem: { ...partida.personagem, idDaLocalizacaoAtual: "cidade-livre.taverna" },
    masmorra: {
      ...partida.masmorra,
      expedicaoAtiva: null,
      dunLiathProtetor:
        partida.masmorra.dunLiathProtetor ?? execucao?.decisaoSobreOProtetor ?? null,
    },
  }
}

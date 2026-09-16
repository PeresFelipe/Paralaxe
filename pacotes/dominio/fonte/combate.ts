import type { AtributosDoPersonagem, PilhaDoInventario, PartidaLocal } from './personagem'
import {
  obterValorPrincipalDoEquipamento,
  type TipoDeDano,
  type DefinicaoDeEquipamento,
  type GrauDeEscalonamento,
} from './equipamento'

export type EstiloDeCombate = "agressivo" | "defensivo" | "misto"
export type RecursoDeCombate = 'mana' | "folego"
export type RecursoDoLimiarDeCombate = "vida" | 'mana' | "folego"
export type PerfilDeHabilidade = "agressivo" | "defensivo"
export type IdDoEfeitoDeCombate = "veneno" | "sangramento" | "atordoamento" | "queimadura" | "congelamento"
export type NivelDeResistencia = "fraco" | 'normal' | "resistente" | "muito-resistente" | "imune"

export interface DefinicaoDeHabilidadeDeCombate {
  id: string
  nome: string
  perfil: PerfilDeHabilidade
  segundosDeRecarga: number
  recurso?: RecursoDeCombate
  custoDeRecurso?: number
  acionarAoAvisoDeAtaque?: boolean
  dano?: {
    tipo: "arma-multiplicador" | "base-escalonamento"
    multiplicador?: number
    poderBase?: number
    tipoDeDano: TipoDeDano
    escalonamento?: Partial<Record<keyof AtributosDoPersonagem, GrauDeEscalonamento>>
    bonusDePrecisaoEmPontosPercentuais?: number
    bonusDeCriticoEmPontosPercentuais?: number
  }
  curar?: {
    poderBase: number
    escalonamento: Partial<Record<keyof AtributosDoPersonagem, GrauDeEscalonamento>>
  }
  restaurar?: {
    vida?: number
    mana?: number
    folego?: number
  }
  melhoriaDeEvasao?: {
    bonus: number
    duracaoEmSegundos: number
  }
  melhoriaDeReducaoDeDano?: {
    multiplicador: number
    duracaoEmSegundos: number
    consumirAoAcertarDiretamente?: boolean
  }
  podeInterromper?: boolean
}

export interface DefinicaoDeAplicacaoDeEfeito {
  situacao: IdDoEfeitoDeCombate
  acumulo: number
}

export interface DefinicaoDeHabilidadeDoInimigo {
  id: string
  nome: string
  segundosDeRecarga: number
  atrasoInicialEmSegundos?: number
  multiplicadorDeDano?: number
  tipoDeDano?: TipoDeDano
  segundosDeAvisoDeAtaque?: number
  interrompivel?: boolean
  aplicacoesDeEfeito?: readonly DefinicaoDeAplicacaoDeEfeito[]
  multiplicadorDoProximoIntervalo?: number
  multiplicadorDoDanoRecebidoPeloProprio?: number
  duracaoDoEfeitoProprioEmSegundos?: number
  vulnerabilidadeApos?: {
    multiplicadorDoDanoRecebido: number
    duracaoEmSegundos: number
  }
}

export interface DefinicaoDeInimigo {
  id: string
  nome: string
  nivelDeCombate: number
  vidaMaxima: number
  defesa: number
  evasao: number
  precisao: number
  poder: number
  intervaloDeAcaoEmSegundos: number
  tipoDeDanoBasico: TipoDeDano
  habilidades: readonly DefinicaoDeHabilidadeDoInimigo[]
  resistenciasADano?: Partial<Record<TipoDeDano, NivelDeResistencia>>
  resistenciasAEfeitos?: Partial<Record<IdDoEfeitoDeCombate, NivelDeResistencia>>
  ehChefe?: boolean
  recompensaDeXp: number
}

export interface DefinicaoDeConsumivelDeCombate {
  id: string
  nome: string
  restaurar: { vida?: number; mana?: number; folego?: number }
}

export interface CatalogoDeEquipamentosDeCombate {
  obterDefinicaoDeEquipamento(idDaDefinicao: string): DefinicaoDeEquipamento | null
}

export interface CatalogoDeConteudoDeCombate extends CatalogoDeEquipamentosDeCombate {
  obterDefinicaoDeHabilidade(habilidadeId: string): DefinicaoDeHabilidadeDeCombate | null
  obterDefinicaoDeInimigo(inimigoId: string): DefinicaoDeInimigo | null
  obterDefinicaoDeConsumivel?(idDaDefinicao: string): DefinicaoDeConsumivelDeCombate | null
}

export interface EspacoDeConsumivelDeCombate {
  idDaDefinicao: string | null
  recursoDeUsoAutomatico: RecursoDoLimiarDeCombate | null
  porcentagemDoLimiarDeUsoAutomatico: number | null
}

export interface PreferenciasDeCombate {
  estilo: EstiloDeCombate
  porcentagemDoLimiarDeVidaDefensiva: number
  espacosDeConsumiveis: [EspacoDeConsumivelDeCombate, EspacoDeConsumivelDeCombate]
}

export interface RecursosDeCombate {
  vida: number
  vidaMaxima: number
  mana: number
  manaMaxima: number
  folego: number
  folegoMaximo: number
}

export interface EntradaDoRegistroDeCombate {
  instanteEmSegundos: number
  agente: "jogador" | "inimigo" | 'system'
  tipo:
    | "basico"
    | "habilidade"
    | "consumivel"
    | "avisoDeAtaque"
    | "interromper"
    | "situacao"
    | "postura"
    | "resultado"
  mensagem: string
}

export interface ResultadoDeCombate {
  desfecho: "vitoria" | "derrota" | "tempoEsgotado"
  duracaoEmSegundos: number
  jogador: RecursosDeCombate
  vidaDoInimigo: number
  xpConcedido: number
  itensConsumidos: PilhaDoInventario[]
  registro: EntradaDoRegistroDeCombate[]
  semente: number
}

export interface ResumoDeCombate {
  idDaDefinicaoDoInimigo: string
  desfecho: ResultadoDeCombate["desfecho"]
  duracaoEmSegundos: number
  semente: number
  concluidoEm: string
}

export interface EstadoDeCombate {
  preferencias: PreferenciasDeCombate
  ultimaExpedicao: ResumoDeCombate | null
  loboDerrotado: boolean
}

const ESCALONAMENTO: Record<GrauDeEscalonamento, number> = { S: 1, A: 0.85, B: 0.7, C: 0.5, D: 0.3, E: 0.15 }
const RESISTENCIA_A_DANO: Record<NivelDeResistencia, number> = {
  fraco: 1.25,
  normal: 1,
  resistente: 0.8,
  "muito-resistente": 0.6,
  imune: 0,
}
const EPSILON = 0.000001
const LIMIAR_DE_EFEITO = 100

interface EstatisticasDerivadasDeCombateDoJogador {
  atributos: AtributosDoPersonagem
  vidaMaxima: number
  manaMaxima: number
  folegoMaximo: number
  regeneracaoDeManaPorSegundo: number
  regeneracaoDeFolegoPorSegundo: number
  defesa: number
  evasao: number
  precisao: number
  chanceDeCritico: number
  poderDoAtaqueBasico: number
  tipoDeDanoBasico: TipoDeDano
  intervaloDeAcaoEmSegundos: number
  escalonamentoDaArma: Partial<Record<keyof AtributosDoPersonagem, GrauDeEscalonamento>>
}

interface EstadoDoAvisoDeAtaque {
  habilidade: DefinicaoDeHabilidadeDoInimigo
  resolveEm: number
}

interface EstadoDeAcumulo {
  valor: number
  aplicadoPorUltimoEm: number
  avaliadoPorUltimoEm: number
  resistenciaAte: number
}

interface MultiplicadorTemporizado {
  multiplicador: number
  expiraEm: number
}

interface EstadoDeReducaoDeDanoDoJogador {
  multiplicador: number
  expiraEm: number
  consumirAoAcertarDiretamente: boolean
}

function limitar(valor: number, minimo: number, maximo: number) {
  return Math.max(minimo, Math.min(maximo, valor))
}

function criarGeradorAleatorio(semente: number) {
  let estado = semente >>> 0
  return () => {
    estado = (Math.imul(estado, 1664525) + 1013904223) >>> 0
    return estado / 0x1_0000_0000
  }
}

function escalonamentoContribuicao(
  atributos: AtributosDoPersonagem,
  escalonamento: Partial<Record<keyof AtributosDoPersonagem, GrauDeEscalonamento>>,
) {
  return Object.entries(escalonamento).reduce((total, [atributo, grau]) => {
    if (!grau) return total
    return total + atributos[atributo as keyof AtributosDoPersonagem] * ESCALONAMENTO[grau]
  }, 0)
}

function mitigacao(defesa: number, atacanteNivel: number) {
  return Math.min(0.75, defesa / (defesa + 100 + 5 * atacanteNivel))
}

function acertoChance(precisao: number, evasao: number, bonus = 0) {
  return limitar(0.9 + (precisao - evasao) * 0.0025 + bonus / 100, 0.7, 0.99)
}

function obterEquipadoDefinicoes(partida: PartidaLocal, catalogo: CatalogoDeEquipamentosDeCombate) {
  return Object.values(partida.personagem.equipamento).flatMap((idDaInstancia) => {
    const instancia = partida.personagem.itensDeEquipamento.find((item) => item.idDaInstancia === idDaInstancia)
    if (!instancia) return []
    const definicao = catalogo.obterDefinicaoDeEquipamento(instancia.idDaDefinicao)
    return definicao ? [{ instancia, definicao }] : []
  })
}

export function criarEspacosPadraoDeConsumiveis(): [EspacoDeConsumivelDeCombate, EspacoDeConsumivelDeCombate] {
  return [
    { idDaDefinicao: null, recursoDeUsoAutomatico: null, porcentagemDoLimiarDeUsoAutomatico: null },
    { idDaDefinicao: null, recursoDeUsoAutomatico: null, porcentagemDoLimiarDeUsoAutomatico: null },
  ]
}

export function configurarEspacoDeConsumivelDeCombate(
  partida: PartidaLocal,
  espacoIndice: 0 | 1,
  idDaDefinicao: string | null,
  recursoDeUsoAutomatico: RecursoDoLimiarDeCombate | null,
  porcentagemDoLimiarDeUsoAutomatico: number | null,
  agora: string,
): PartidaLocal {
  if (porcentagemDoLimiarDeUsoAutomatico !== null) {
    if (porcentagemDoLimiarDeUsoAutomatico < 1 || porcentagemDoLimiarDeUsoAutomatico > 100) {
      throw new Error('Threshold automático precisa estar entre 1% e 100%.')
    }
    if (!recursoDeUsoAutomatico) throw new Error("Escolha o recurso do limiar automático.")
  }

  const espacos: [EspacoDeConsumivelDeCombate, EspacoDeConsumivelDeCombate] = [
    { ...partida.combate.preferencias.espacosDeConsumiveis[0] },
    { ...partida.combate.preferencias.espacosDeConsumiveis[1] },
  ]
  espacos[espacoIndice] = {
    idDaDefinicao,
    recursoDeUsoAutomatico: idDaDefinicao ? recursoDeUsoAutomatico : null,
    porcentagemDoLimiarDeUsoAutomatico: idDaDefinicao ? porcentagemDoLimiarDeUsoAutomatico : null,
  }

  return {
    ...partida,
    atualizadoEm: agora,
    combate: { ...partida.combate, preferencias: { ...partida.combate.preferencias, espacosDeConsumiveis: espacos } },
  }
}

export function ensinarEEquiparHabilidadesDeCombate(
  partida: PartidaLocal,
  habilidadeIds: readonly string[],
  agora: string,
): PartidaLocal {
  const unico = [...new Set([...partida.personagem.idsDasHabilidadesConhecidas, ...habilidadeIds])]
  const ativo: [string | null, string | null, string | null, string | null] = [
    habilidadeIds[0] ?? null,
    habilidadeIds[1] ?? null,
    habilidadeIds[2] ?? null,
    habilidadeIds[3] ?? null,
  ]

  return {
    ...partida,
    atualizadoEm: agora,
    personagem: {
      ...partida.personagem,
      idsDasHabilidadesConhecidas: unico,
      espacosDeHabilidadesAtivas: ativo,
    },
  }
}

export function derivarEstatisticasDeCombateDoJogador(
  partida: PartidaLocal,
  catalogo: CatalogoDeEquipamentosDeCombate,
): EstatisticasDerivadasDeCombateDoJogador {
  const equipado = obterEquipadoDefinicoes(partida, catalogo)
  const atributos: AtributosDoPersonagem = { ...partida.personagem.atributos }
  let simplesDefesaBonus = 0
  let simplesPrecisaoBonus = 0
  let maximoVidaBonus = 0
  let maximoManaBonus = 0
  let maximoFolegoBonus = 0
  const atributoAfixos: Partial<Record<string, keyof AtributosDoPersonagem>> = {
    "afixo.vitalidade-1": "vitalidade",
    "afixo.mente-1": "mente",
    "afixo.vigor-1": 'vigor',
    "afixo.forca-1": "forca",
    "afixo.destreza-1": "destreza",
    "afixo.inteligencia-1": "inteligencia",
    "afixo.fe-1": "fe",
  }

  for (const entrada of equipado) {
    for (const afixoId of entrada.instancia.idsDosAfixos ?? []) {
      const atributo = atributoAfixos[afixoId]
      if (atributo) atributos[atributo] += 1
      if (afixoId === "afixo.precisao-4") simplesPrecisaoBonus += 4
      if (afixoId === "afixo.defesa-2") simplesDefesaBonus += 2
    }
    maximoVidaBonus += entrada.definicao.bonusDeRecursos?.vidaMaxima ?? 0
    maximoManaBonus += entrada.definicao.bonusDeRecursos?.manaMaxima ?? 0
    maximoFolegoBonus += entrada.definicao.bonusDeRecursos?.folegoMaximo ?? 0
  }

  const principalMaoId = partida.personagem.equipamento.maoPrincipal
  const maoPrincipal = equipado.find((entrada) => entrada.instancia.idDaInstancia === principalMaoId)
  if (!maoPrincipal?.definicao.combateDaArma) {
    throw new Error('O personagem precisa de uma arma válida equipada para combater.')
  }

  const defesa = equipado.reduce((total, entrada) => {
    if (entrada.definicao.estatisticaPrincipal?.tipo !== "defesa") return total
    return total + (obterValorPrincipalDoEquipamento(entrada.definicao, entrada.instancia.nivelDeReforco) ?? 0)
  }, simplesDefesaBonus)
  const armaPoder =
    maoPrincipal.definicao.estatisticaPrincipal?.tipo === "ataque"
      ? obterValorPrincipalDoEquipamento(maoPrincipal.definicao, maoPrincipal.instancia.nivelDeReforco) ?? 0
      : 0
  const velocidadeBonus = Math.min(0.25, atributos.destreza * 0.004)

  return {
    atributos,
    vidaMaxima: 100 + atributos.vitalidade * 12 + maximoVidaBonus,
    manaMaxima: 30 + atributos.mente * 10 + maximoManaBonus,
    folegoMaximo: 60 + atributos.vigor * 8 + maximoFolegoBonus,
    regeneracaoDeManaPorSegundo: 1.5 + atributos.mente * 0.35,
    regeneracaoDeFolegoPorSegundo: 5 + atributos.vigor * 0.6,
    defesa,
    evasao: 100,
    precisao: 100 + atributos.destreza * 2 + simplesPrecisaoBonus,
    chanceDeCritico: 0.05 + atributos.destreza * 0.0025,
    poderDoAtaqueBasico: armaPoder,
    tipoDeDanoBasico: maoPrincipal.definicao.combateDaArma.tipoDeDano,
    intervaloDeAcaoEmSegundos: maoPrincipal.definicao.combateDaArma.intervaloDeAcaoEmSegundos / (1 + velocidadeBonus),
    escalonamentoDaArma: maoPrincipal.definicao.combateDaArma.escalonamento,
  }
}

function criarRecursosIniciais(estatisticas: EstatisticasDerivadasDeCombateDoJogador, persistido?: RecursosDeCombate): RecursosDeCombate {
  return {
    vida: limitar(persistido?.vida ?? estatisticas.vidaMaxima, 0, estatisticas.vidaMaxima),
    vidaMaxima: estatisticas.vidaMaxima,
    mana: limitar(persistido?.mana ?? estatisticas.manaMaxima, 0, estatisticas.manaMaxima),
    manaMaxima: estatisticas.manaMaxima,
    folego: limitar(persistido?.folego ?? estatisticas.folegoMaximo, 0, estatisticas.folegoMaximo),
    folegoMaximo: estatisticas.folegoMaximo,
  }
}

function sortearDano(
  bruto: number,
  defesa: number,
  nivel: number,
  chanceDeCritico: number,
  aleatorio: () => number,
  multiplicador = 1,
) {
  const critico = aleatorio() < chanceDeCritico
  const dano = bruto * (critico ? 1.5 : 1) * multiplicador * (1 - mitigacao(defesa, nivel))
  return { dano: Math.max(1, Math.round(dano)), critico }
}

function escolherHabilidade(
  partida: PartidaLocal,
  catalogo: CatalogoDeConteudoDeCombate,
  recursos: RecursosDeCombate,
  recargas: Map<string, number>,
  agora: number,
  avisoDeAtaqueAtivo: boolean,
) {
  const vidaPorcentagem = (recursos.vida / recursos.vidaMaxima) * 100
  const defensivoCondicao = (habilidade: DefinicaoDeHabilidadeDeCombate) =>
    vidaPorcentagem <= partida.combate.preferencias.porcentagemDoLimiarDeVidaDefensiva ||
    (avisoDeAtaqueAtivo && habilidade.acionarAoAvisoDeAtaque === true)

  const candidatos = partida.personagem.espacosDeHabilidadesAtivas
    .map((id, espaco) => ({ id, espaco }))
    .filter((entrada): entrada is { id: string; espaco: number } => Boolean(entrada.id))
    .filter((entrada) => partida.personagem.idsDasHabilidadesConhecidas.includes(entrada.id))
    .map((entrada) => ({ ...entrada, definicao: catalogo.obterDefinicaoDeHabilidade(entrada.id) }))
    .filter((entrada): entrada is { id: string; espaco: number; definicao: DefinicaoDeHabilidadeDeCombate } =>
      entrada.definicao !== null,
    )
    .filter((entrada) => (recargas.get(entrada.id) ?? 0) <= agora + EPSILON)
    .filter((entrada) => {
      const habilidade = entrada.definicao
      if (habilidade.recurso === 'mana' && recursos.mana < (habilidade.custoDeRecurso ?? 0)) return false
      if (habilidade.recurso === "folego" && recursos.folego < (habilidade.custoDeRecurso ?? 0)) return false
      if (habilidade.restaurar) {
        const podeRestaurar =
          ((habilidade.restaurar.vida ?? 0) > 0 && recursos.vida < recursos.vidaMaxima) ||
          ((habilidade.restaurar.mana ?? 0) > 0 && recursos.mana < recursos.manaMaxima) ||
          ((habilidade.restaurar.folego ?? 0) > 0 && recursos.folego < recursos.folegoMaximo)
        if (!podeRestaurar) return false
      }
      if (habilidade.perfil === "defensivo") return defensivoCondicao(habilidade)
      return true
    })

  return candidatos.toSorted((a, b) => {
    const estilo = partida.combate.preferencias.estilo
    if (estilo === "misto") {
      const aDefensivoNecessario = a.definicao.perfil === "defensivo" && defensivoCondicao(a.definicao)
      const bDefensivoNecessario = b.definicao.perfil === "defensivo" && defensivoCondicao(b.definicao)
      if (aDefensivoNecessario !== bDefensivoNecessario) return aDefensivoNecessario ? -1 : 1
      return a.espaco - b.espaco
    }
    const preferido = estilo === "agressivo" ? "agressivo" : "defensivo"
    const aPatamar = a.definicao.perfil === preferido ? 0 : 1
    const bPatamar = b.definicao.perfil === preferido ? 0 : 1
    return aPatamar - bPatamar || a.espaco - b.espaco
  })[0]?.definicao ?? null
}

function recursoPorcentagem(recursos: RecursosDeCombate, recurso: RecursoDoLimiarDeCombate) {
  if (recurso === "vida") return (recursos.vida / recursos.vidaMaxima) * 100
  if (recurso === 'mana') return (recursos.mana / recursos.manaMaxima) * 100
  return (recursos.folego / recursos.folegoMaximo) * 100
}

function removerConsumidoItens(inventario: PilhaDoInventario[], itensConsumidos: PilhaDoInventario[]) {
  const consumido = new Map(itensConsumidos.map((pilha) => [pilha.idDaDefinicao, pilha.quantidade]))
  return inventario
    .map((pilha) => ({
      ...pilha,
      quantidade: pilha.quantidade - (consumido.get(pilha.idDaDefinicao) ?? 0),
    }))
    .filter((pilha) => pilha.quantidade > 0)
}

function totalInventarioParaCombate(partida: PartidaLocal) {
  const totais = new Map<string, number>()
  for (const pilha of partida.personagem.inventario) {
    totais.set(pilha.idDaDefinicao, (totais.get(pilha.idDaDefinicao) ?? 0) + pilha.quantidade)
  }
  for (const pilha of partida.masmorra.expedicaoAtiva?.bolsaDaExpedicao ?? []) {
    totais.set(pilha.idDaDefinicao, (totais.get(pilha.idDaDefinicao) ?? 0) + pilha.quantidade)
  }
  return totais
}

function consumirEntreSeguroEExpedicao(
  partida: PartidaLocal,
  itensConsumidos: PilhaDoInventario[],
): Pick<PartidaLocal, "personagem" | "masmorra"> {
  let seguroInventario = partida.personagem.inventario.map((pilha) => ({ ...pilha }))
  let bolsaDaExpedicao = partida.masmorra.expedicaoAtiva?.bolsaDaExpedicao.map((pilha) => ({ ...pilha })) ?? []

  for (const consumido of itensConsumidos) {
    let faltam = consumido.quantidade

    bolsaDaExpedicao = bolsaDaExpedicao
      .map((pilha) => {
        if (pilha.idDaDefinicao !== consumido.idDaDefinicao || faltam <= 0) return pilha
        const usado = Math.min(pilha.quantidade, faltam)
        faltam -= usado
        return { ...pilha, quantidade: pilha.quantidade - usado }
      })
      .filter((pilha) => pilha.quantidade > 0)

    if (faltam > 0) {
      seguroInventario = removerConsumidoItens(seguroInventario, [
        { idDaDefinicao: consumido.idDaDefinicao, quantidade: faltam },
      ])
    }
  }

  return {
    personagem: { ...partida.personagem, inventario: seguroInventario },
    masmorra: {
      ...partida.masmorra,
      expedicaoAtiva: partida.masmorra.expedicaoAtiva
        ? { ...partida.masmorra.expedicaoAtiva, bolsaDaExpedicao }
        : null,
    },
  }
}

export function simularCombate(
  partida: PartidaLocal,
  catalogo: CatalogoDeConteudoDeCombate,
  idDaDefinicaoDoInimigo: string,
  semente: number,
  maximoDuracaoSegundos = 180,
  recursosIniciais?: RecursosDeCombate,
  manualConsumivelEspacoIndice?: 0 | 1,
): ResultadoDeCombate {
  if (partida.ocioso.atividadeAtiva || partida.fabricacao.receitaAtiva) {
    throw new Error("Interrompa a atividade Ocioso antes de iniciar um combate.")
  }

  const encontradoInimigo = catalogo.obterDefinicaoDeInimigo(idDaDefinicaoDoInimigo)
  if (!encontradoInimigo) throw new Error("Inimigo não encontrado no Catálogo de Conteúdo.")
  const inimigo: DefinicaoDeInimigo = encontradoInimigo
  const estatisticas = derivarEstatisticasDeCombateDoJogador(partida, catalogo)
  const recursos = criarRecursosIniciais(estatisticas, recursosIniciais)
  const aleatorio = criarGeradorAleatorio(semente)
  const registro: EntradaDoRegistroDeCombate[] = []
  const jogadorRecargas = new Map<string, number>()
  const inimigoRecargas = new Map<string, number>()
  const disponivelInventario = totalInventarioParaCombate(partida)
  const consumido = new Map<string, number>()
  const acumulo = new Map<IdDoEfeitoDeCombate, EstadoDeAcumulo>()
  let temporizadoInimigoMultiplicadores: MultiplicadorTemporizado[] = []
  let venenoAte = 0
  let queimaduraAte = 0
  let congelamentoAte = 0
  let evasaoBonus = 0
  let evasaoAte = 0
  let danoReducao: EstadoDeReducaoDeDanoDoJogador | null = null
  let manualPendente: 0 | 1 | null = manualConsumivelEspacoIndice ?? null
  let vidaDoInimigo = inimigo.vidaMaxima
  let agora = 0
  let ultimoTempo = 0
  let jogadorProntoEm = estatisticas.intervaloDeAcaoEmSegundos
  let inimigoProntoEm = inimigo.intervaloDeAcaoEmSegundos
  let avisoDeAtaque: EstadoDoAvisoDeAtaque | null = null

  for (const habilidade of inimigo.habilidades) {
    inimigoRecargas.set(habilidade.id, habilidade.atrasoInicialEmSegundos ?? 0)
  }

  function jogadorDefesa() {
    return estatisticas.defesa * (queimaduraAte > agora + EPSILON ? 0.85 : 1)
  }

  function jogadorEvasao() {
    return estatisticas.evasao + (evasaoAte > agora + EPSILON ? evasaoBonus : 0)
  }

  function jogadorIntervalo() {
    return estatisticas.intervaloDeAcaoEmSegundos * (congelamentoAte > agora + EPSILON ? 1.3 : 1)
  }

  function recebidoAgoraDiretoDano(brutoDano: number) {
    let finalDano = brutoDano
    if (danoReducao && danoReducao.expiraEm > agora + EPSILON) {
      finalDano *= danoReducao.multiplicador
      if (danoReducao.consumirAoAcertarDiretamente) danoReducao = null
    }
    return Math.max(1, Math.round(finalDano))
  }

  function inimigoDanoMultiplicador(tipoDoDado: TipoDeDano) {
    const base = RESISTENCIA_A_DANO[inimigo.resistenciasADano?.[tipoDoDado] ?? 'normal']
    const temporizado = temporizadoInimigoMultiplicadores.reduce(
      (total, efeito) => (efeito.expiraEm > agora + EPSILON ? total * efeito.multiplicador : total),
      1,
    )
    return base * temporizado
  }

  function avancarEfeitos(para: number) {
    const de = ultimoTempo
    if (para <= de) return
    const venenoSegundos = Math.max(0, Math.min(para, venenoAte) - de)
    const queimaduraSegundos = Math.max(0, Math.min(para, queimaduraAte) - de)
    recursos.vida = Math.max(
      0,
      recursos.vida - venenoSegundos * recursos.vidaMaxima * 0.02 - queimaduraSegundos * 3,
    )

    for (const estado of acumulo.values()) {
      const decaimentoIniciar = estado.aplicadoPorUltimoEm + 3
      const decaimentoDe = Math.max(estado.avaliadoPorUltimoEm, decaimentoIniciar)
      if (para > decaimentoDe) estado.valor = Math.max(0, estado.valor - (para - decaimentoDe) * 12)
      estado.avaliadoPorUltimoEm = para
    }
    temporizadoInimigoMultiplicadores = temporizadoInimigoMultiplicadores.filter((efeito) => efeito.expiraEm > para + EPSILON)
    if (danoReducao && danoReducao.expiraEm <= para + EPSILON) danoReducao = null
  }

  function aplicarAcumulo(aplicacao: DefinicaoDeAplicacaoDeEfeito) {
    const estado = acumulo.get(aplicacao.situacao) ?? {
      valor: 0,
      aplicadoPorUltimoEm: agora,
      avaliadoPorUltimoEm: agora,
      resistenciaAte: 0,
    }
    const recebido = aplicacao.acumulo * (estado.resistenciaAte > agora + EPSILON ? 0.5 : 1)
    estado.valor += recebido
    estado.aplicadoPorUltimoEm = agora
    estado.avaliadoPorUltimoEm = agora
    registro.push({
      instanteEmSegundos: agora,
      agente: 'system',
      tipo: "situacao",
      mensagem: `${aplicacao.situacao}: ${Math.round(estado.valor)}/${LIMIAR_DE_EFEITO} acúmulo.`,
    })

    if (estado.valor >= LIMIAR_DE_EFEITO) {
      estado.valor = 0
      estado.resistenciaAte = agora + 6
      if (aplicacao.situacao === "sangramento") {
        const dano = Math.max(1, Math.round(recursos.vida * 0.08))
        recursos.vida = Math.max(0, recursos.vida - dano)
        registro.push({ instanteEmSegundos: agora, agente: 'system', tipo: "situacao", mensagem: `Sangramento causa ${dano} de dano.` })
      } else if (aplicacao.situacao === "atordoamento") {
        jogadorProntoEm = Math.max(jogadorProntoEm, agora) + 1.5
        registro.push({ instanteEmSegundos: agora, agente: 'system', tipo: "situacao", mensagem: 'Atordoamento pausa a ação por 1,5 s.' })
      } else if (aplicacao.situacao === "veneno") {
        venenoAte = agora + 10
      } else if (aplicacao.situacao === "queimadura") {
        queimaduraAte = agora + 6
      } else if (aplicacao.situacao === "congelamento") {
        congelamentoAte = agora + 5
        jogadorProntoEm = agora + Math.max(0, jogadorProntoEm - agora) * 1.3
        if (avisoDeAtaque) {
          avisoDeAtaque = {
            ...avisoDeAtaque,
            resolveEm: agora + Math.max(0, avisoDeAtaque.resolveEm - agora) * 1.2,
          }
        }
      }
    }
    acumulo.set(aplicacao.situacao, estado)
  }

  function aposInimigoAcerto(habilidade: DefinicaoDeHabilidadeDoInimigo) {
    for (const aplicacao of habilidade.aplicacoesDeEfeito ?? []) aplicarAcumulo(aplicacao)
    if (habilidade.vulnerabilidadeApos) {
      temporizadoInimigoMultiplicadores.push({
        multiplicador: habilidade.vulnerabilidadeApos.multiplicadorDoDanoRecebido,
        expiraEm: agora + habilidade.vulnerabilidadeApos.duracaoEmSegundos,
      })
      registro.push({
        instanteEmSegundos: agora,
        agente: "inimigo",
        tipo: "postura",
        mensagem: `${inimigo.nome} fica vulnerável por ${habilidade.vulnerabilidadeApos.duracaoEmSegundos}s.`,
      })
    }
  }

  function tentarConsumivel() {
    const ordem: Array<{ indice: 0 | 1; manual: boolean }> = []
    if (manualPendente !== null) ordem.push({ indice: manualPendente, manual: true })
    for (const indice of [0, 1] as const) {
      if (indice !== manualPendente) ordem.push({ indice, manual: false })
    }

    for (const candidato of ordem) {
      const espaco = partida.combate.preferencias.espacosDeConsumiveis[candidato.indice]
      if (!espaco.idDaDefinicao) continue
      if ((disponivelInventario.get(espaco.idDaDefinicao) ?? 0) <= 0) continue
      const definicao = catalogo.obterDefinicaoDeConsumivel?.(espaco.idDaDefinicao)
      if (!definicao) continue
      const podeRestaurar =
        ((definicao.restaurar.vida ?? 0) > 0 && recursos.vida < recursos.vidaMaxima) ||
        ((definicao.restaurar.mana ?? 0) > 0 && recursos.mana < recursos.manaMaxima) ||
        ((definicao.restaurar.folego ?? 0) > 0 && recursos.folego < recursos.folegoMaximo)
      if (!podeRestaurar) continue

      if (!candidato.manual) {
        if (!espaco.recursoDeUsoAutomatico || espaco.porcentagemDoLimiarDeUsoAutomatico === null) continue
        if (recursoPorcentagem(recursos, espaco.recursoDeUsoAutomatico) > espaco.porcentagemDoLimiarDeUsoAutomatico) continue
      }

      const antes = { ...recursos }
      recursos.vida = Math.min(recursos.vidaMaxima, recursos.vida + (definicao.restaurar.vida ?? 0))
      recursos.mana = Math.min(recursos.manaMaxima, recursos.mana + (definicao.restaurar.mana ?? 0))
      recursos.folego = Math.min(recursos.folegoMaximo, recursos.folego + (definicao.restaurar.folego ?? 0))
      disponivelInventario.set(espaco.idDaDefinicao, (disponivelInventario.get(espaco.idDaDefinicao) ?? 0) - 1)
      consumido.set(espaco.idDaDefinicao, (consumido.get(espaco.idDaDefinicao) ?? 0) + 1)
      if (candidato.manual) manualPendente = null
      registro.push({
        instanteEmSegundos: agora,
        agente: "jogador",
        tipo: "consumivel",
        mensagem: `${definicao.nome}: +${Math.round(recursos.vida - antes.vida)} Vida, +${Math.round(recursos.mana - antes.mana)} Mana, +${Math.round(recursos.folego - antes.folego)} Fôlego.`,
      })
      return true
    }
    return false
  }

  function aplicarJogadorHabilidadeEfeitos(habilidade: DefinicaoDeHabilidadeDeCombate) {
    if (habilidade.restaurar) {
      const antes = { ...recursos }
      recursos.vida = Math.min(recursos.vidaMaxima, recursos.vida + (habilidade.restaurar.vida ?? 0))
      recursos.mana = Math.min(recursos.manaMaxima, recursos.mana + (habilidade.restaurar.mana ?? 0))
      recursos.folego = Math.min(recursos.folegoMaximo, recursos.folego + (habilidade.restaurar.folego ?? 0))
      registro.push({
        instanteEmSegundos: agora,
        agente: "jogador",
        tipo: "habilidade",
        mensagem: `${habilidade.nome} restaura ${Math.round(recursos.vida - antes.vida)} Vida, ${Math.round(recursos.mana - antes.mana)} Mana e ${Math.round(recursos.folego - antes.folego)} Fôlego.`,
      })
    }

    if (habilidade.melhoriaDeEvasao) {
      evasaoBonus = habilidade.melhoriaDeEvasao.bonus
      evasaoAte = agora + habilidade.melhoriaDeEvasao.duracaoEmSegundos
      registro.push({
        instanteEmSegundos: agora,
        agente: "jogador",
        tipo: "habilidade",
        mensagem: `${habilidade.nome} concede +${habilidade.melhoriaDeEvasao.bonus} Evasão por ${habilidade.melhoriaDeEvasao.duracaoEmSegundos}s.`,
      })
    }

    if (habilidade.melhoriaDeReducaoDeDano) {
      danoReducao = {
        multiplicador: habilidade.melhoriaDeReducaoDeDano.multiplicador,
        expiraEm: agora + habilidade.melhoriaDeReducaoDeDano.duracaoEmSegundos,
        consumirAoAcertarDiretamente: habilidade.melhoriaDeReducaoDeDano.consumirAoAcertarDiretamente ?? false,
      }
      registro.push({
        instanteEmSegundos: agora,
        agente: "jogador",
        tipo: "habilidade",
        mensagem: `${habilidade.nome} reduz dano direto recebido em ${Math.round((1 - habilidade.melhoriaDeReducaoDeDano.multiplicador) * 100)}%.`,
      })
    }
  }

  while (agora <= maximoDuracaoSegundos + EPSILON && recursos.vida > 0 && vidaDoInimigo > 0) {
    const avisoDeAtaqueEm = avisoDeAtaque?.resolveEm ?? Number.POSITIVE_INFINITY
    const proximoTempo = Math.min(jogadorProntoEm, inimigoProntoEm, avisoDeAtaqueEm, maximoDuracaoSegundos)
    if (!Number.isFinite(proximoTempo)) break

    agora = proximoTempo
    const diferenca = Math.max(0, agora - ultimoTempo)
    avancarEfeitos(agora)
    recursos.mana = Math.min(recursos.manaMaxima, recursos.mana + estatisticas.regeneracaoDeManaPorSegundo * diferenca)
    recursos.folego = Math.min(recursos.folegoMaximo, recursos.folego + estatisticas.regeneracaoDeFolegoPorSegundo * diferenca)
    ultimoTempo = agora
    if (recursos.vida <= 0) break

    if (avisoDeAtaque && Math.abs(avisoDeAtaque.resolveEm - agora) <= EPSILON) {
      const habilidade = avisoDeAtaque.habilidade
      if (aleatorio() < acertoChance(inimigo.precisao, jogadorEvasao())) {
        const mitigado = inimigo.poder * (habilidade.multiplicadorDeDano ?? 0) * (1 - mitigacao(jogadorDefesa(), inimigo.nivelDeCombate))
        const dano = recebidoAgoraDiretoDano(mitigado)
        recursos.vida = Math.max(0, recursos.vida - dano)
        registro.push({ instanteEmSegundos: agora, agente: "inimigo", tipo: "habilidade", mensagem: `${inimigo.nome} usa ${habilidade.nome} e causa ${dano} de dano.` })
        aposInimigoAcerto(habilidade)
      } else {
        registro.push({ instanteEmSegundos: agora, agente: "inimigo", tipo: "habilidade", mensagem: `${inimigo.nome} usa ${habilidade.nome}, mas erra.` })
      }
      avisoDeAtaque = null
      inimigoProntoEm = agora + inimigo.intervaloDeAcaoEmSegundos * (habilidade.multiplicadorDoProximoIntervalo ?? 1)
      continue
    }

    if (Math.abs(jogadorProntoEm - agora) <= EPSILON && recursos.vida > 0 && vidaDoInimigo > 0) {
      if (!tentarConsumivel()) {
        const habilidade = escolherHabilidade(
          partida,
          catalogo,
          recursos,
          jogadorRecargas,
          agora,
          avisoDeAtaque !== null,
        )
        if (habilidade) {
          const custo = habilidade.custoDeRecurso ?? 0
          if (habilidade.recurso === 'mana') recursos.mana -= custo
          if (habilidade.recurso === "folego") recursos.folego -= custo
          jogadorRecargas.set(habilidade.id, agora + habilidade.segundosDeRecarga)

          if (avisoDeAtaque && habilidade.podeInterromper && avisoDeAtaque.habilidade.interrompivel) {
            registro.push({ instanteEmSegundos: agora, agente: "jogador", tipo: "interromper", mensagem: `${habilidade.nome} interrompe ${avisoDeAtaque.habilidade.nome}.` })
            avisoDeAtaque = null
            inimigoProntoEm = agora + inimigo.intervaloDeAcaoEmSegundos
          }

          aplicarJogadorHabilidadeEfeitos(habilidade)

          if (habilidade.curar) {
            const curar = Math.round(habilidade.curar.poderBase + escalonamentoContribuicao(estatisticas.atributos, habilidade.curar.escalonamento))
            const recuperado = Math.min(curar, recursos.vidaMaxima - recursos.vida)
            recursos.vida += recuperado
            registro.push({ instanteEmSegundos: agora, agente: "jogador", tipo: "habilidade", mensagem: `${habilidade.nome} recupera ${recuperado} de Vida.` })
          } else if (habilidade.dano) {
            if (aleatorio() < acertoChance(estatisticas.precisao, inimigo.evasao, habilidade.dano.bonusDePrecisaoEmPontosPercentuais ?? 0)) {
              const bruto =
                habilidade.dano.tipo === "arma-multiplicador"
                  ? (estatisticas.poderDoAtaqueBasico + escalonamentoContribuicao(estatisticas.atributos, estatisticas.escalonamentoDaArma)) * (habilidade.dano.multiplicador ?? 1)
                  : (habilidade.dano.poderBase ?? 0) + escalonamentoContribuicao(estatisticas.atributos, habilidade.dano.escalonamento ?? {})
              const sorteado = sortearDano(
                bruto,
                inimigo.defesa,
                partida.personagem.nivel,
                limitar(estatisticas.chanceDeCritico + (habilidade.dano.bonusDeCriticoEmPontosPercentuais ?? 0) / 100, 0, 1),
                aleatorio,
                inimigoDanoMultiplicador(habilidade.dano.tipoDeDano),
              )
              vidaDoInimigo = Math.max(0, vidaDoInimigo - sorteado.dano)
              registro.push({ instanteEmSegundos: agora, agente: "jogador", tipo: "habilidade", mensagem: `${habilidade.nome} causa ${sorteado.dano} de dano${sorteado.critico ? ' crítico' : ''}.` })
            } else {
              registro.push({ instanteEmSegundos: agora, agente: "jogador", tipo: "habilidade", mensagem: `${habilidade.nome} erra.` })
            }
          }
        } else {
          if (aleatorio() < acertoChance(estatisticas.precisao, inimigo.evasao)) {
            const bruto = estatisticas.poderDoAtaqueBasico + escalonamentoContribuicao(estatisticas.atributos, estatisticas.escalonamentoDaArma)
            const sorteado = sortearDano(bruto, inimigo.defesa, partida.personagem.nivel, estatisticas.chanceDeCritico, aleatorio, inimigoDanoMultiplicador(estatisticas.tipoDeDanoBasico))
            vidaDoInimigo = Math.max(0, vidaDoInimigo - sorteado.dano)
            registro.push({ instanteEmSegundos: agora, agente: "jogador", tipo: "basico", mensagem: `Ataque básico causa ${sorteado.dano} de dano${sorteado.critico ? ' crítico' : ''}.` })
          } else {
            registro.push({ instanteEmSegundos: agora, agente: "jogador", tipo: "basico", mensagem: 'Ataque básico erra.' })
          }
        }
      }
      jogadorProntoEm = agora + jogadorIntervalo()
      if (vidaDoInimigo <= 0) break
    }

    if (Math.abs(inimigoProntoEm - agora) <= EPSILON && recursos.vida > 0 && vidaDoInimigo > 0 && !avisoDeAtaque) {
      const pronto = inimigo.habilidades.find((habilidade) => (inimigoRecargas.get(habilidade.id) ?? 0) <= agora + EPSILON)
      if (pronto) {
        inimigoRecargas.set(pronto.id, agora + pronto.segundosDeRecarga)
        if (pronto.multiplicadorDoDanoRecebidoPeloProprio !== undefined) {
          const duracao = pronto.duracaoDoEfeitoProprioEmSegundos ?? 0
          temporizadoInimigoMultiplicadores.push({ multiplicador: pronto.multiplicadorDoDanoRecebidoPeloProprio, expiraEm: agora + duracao })
          registro.push({ instanteEmSegundos: agora, agente: "inimigo", tipo: "postura", mensagem: `${inimigo.nome} usa ${pronto.nome} por ${duracao}s.` })
          inimigoProntoEm = agora + inimigo.intervaloDeAcaoEmSegundos
        } else if ((pronto.segundosDeAvisoDeAtaque ?? 0) > 0) {
          avisoDeAtaque = { habilidade: pronto, resolveEm: agora + (pronto.segundosDeAvisoDeAtaque ?? 0) }
          inimigoProntoEm = Number.POSITIVE_INFINITY
          registro.push({ instanteEmSegundos: agora, agente: "inimigo", tipo: "avisoDeAtaque", mensagem: `${inimigo.nome} prepara ${pronto.nome} por ${pronto.segundosDeAvisoDeAtaque}s.` })
        } else {
          if (aleatorio() < acertoChance(inimigo.precisao, jogadorEvasao())) {
            const mitigado = inimigo.poder * (pronto.multiplicadorDeDano ?? 0) * (1 - mitigacao(jogadorDefesa(), inimigo.nivelDeCombate))
            const dano = recebidoAgoraDiretoDano(mitigado)
            recursos.vida = Math.max(0, recursos.vida - dano)
            registro.push({ instanteEmSegundos: agora, agente: "inimigo", tipo: "habilidade", mensagem: `${inimigo.nome} usa ${pronto.nome} e causa ${dano} de dano.` })
            aposInimigoAcerto(pronto)
          } else {
            registro.push({ instanteEmSegundos: agora, agente: "inimigo", tipo: "habilidade", mensagem: `${inimigo.nome} usa ${pronto.nome}, mas erra.` })
          }
          inimigoProntoEm = agora + inimigo.intervaloDeAcaoEmSegundos * (pronto.multiplicadorDoProximoIntervalo ?? 1)
        }
      } else {
        if (aleatorio() < acertoChance(inimigo.precisao, jogadorEvasao())) {
          const mitigado = inimigo.poder * (1 - mitigacao(jogadorDefesa(), inimigo.nivelDeCombate))
          const dano = recebidoAgoraDiretoDano(mitigado)
          recursos.vida = Math.max(0, recursos.vida - dano)
          registro.push({ instanteEmSegundos: agora, agente: "inimigo", tipo: "basico", mensagem: `${inimigo.nome} causa ${dano} de dano.` })
        } else {
          registro.push({ instanteEmSegundos: agora, agente: "inimigo", tipo: "basico", mensagem: `${inimigo.nome} erra.` })
        }
        inimigoProntoEm = agora + inimigo.intervaloDeAcaoEmSegundos
      }
    }

    if (Math.abs(agora - maximoDuracaoSegundos) <= EPSILON) break
  }

  const desfecho: ResultadoDeCombate["desfecho"] = vidaDoInimigo <= 0 ? "vitoria" : recursos.vida <= 0 ? "derrota" : "tempoEsgotado"
  const xpConcedido = desfecho === "vitoria" ? inimigo.recompensaDeXp : 0
  registro.push({
    instanteEmSegundos: agora,
    agente: 'system',
    tipo: "resultado",
    mensagem: desfecho === "vitoria" ? `Vitória. +${xpConcedido} XP geral.` : desfecho === "derrota" ? 'Derrota. O personagem retorna à Cidade Livre.' : 'Combate encerrado por limite de simulação.',
  })

  return {
    desfecho,
    duracaoEmSegundos: Number(agora.toFixed(3)),
    jogador: {
      ...recursos,
      vida: Number(recursos.vida.toFixed(3)),
      mana: Number(recursos.mana.toFixed(3)),
      folego: Number(recursos.folego.toFixed(3)),
    },
    vidaDoInimigo,
    xpConcedido,
    itensConsumidos: [...consumido.entries()].map(([idDaDefinicao, quantidade]) => ({ idDaDefinicao, quantidade })),
    registro,
    semente,
  }
}

export function aplicarResultadoDeCombate(
  partida: PartidaLocal,
  idDaDefinicaoDoInimigo: string,
  resultado: ResultadoDeCombate,
  agora: string,
): PartidaLocal {
  const consumidoEstado = consumirEntreSeguroEExpedicao(partida, resultado.itensConsumidos)
  const ouroPerda =
    resultado.desfecho === "derrota" && !partida.masmorra.expedicaoAtiva
      ? Math.ceil(Math.min(partida.personagem.ouro * 0.1, 10 * partida.personagem.nivel))
      : 0

  return {
    ...partida,
    atualizadoEm: agora,
    personagem: {
      ...consumidoEstado.personagem,
      xp: partida.personagem.xp + resultado.xpConcedido,
      ouro: Math.max(0, consumidoEstado.personagem.ouro - ouroPerda),
      idDaLocalizacaoAtual: "cidade-livre.taverna",
    },
    masmorra: consumidoEstado.masmorra,
    combate: {
      ...partida.combate,
      loboDerrotado:
        partida.combate.loboDerrotado ||
        (idDaDefinicaoDoInimigo === "inimigo.estrada-lobo" && resultado.desfecho === "vitoria"),
      ultimaExpedicao: {
        idDaDefinicaoDoInimigo,
        desfecho: resultado.desfecho,
        duracaoEmSegundos: resultado.duracaoEmSegundos,
        semente: resultado.semente,
        concluidoEm: agora,
      },
    },
  }
}

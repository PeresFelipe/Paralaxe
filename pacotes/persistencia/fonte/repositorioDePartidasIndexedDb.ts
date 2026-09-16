import { lerFormatoLegado, gravarFormatoLegado } from './formatoLegado'
import {
  VERSAO_DO_ESQUEMA_DA_PARTIDA,
  criarEspacosPadraoDeConsumiveis,
  criarPrestigioInicialDoPersonagem,
  criarProgressoInicialDasProfissoes,
  criarJornadaInicial,
  criarEstadoDosEquipamentosIniciais,
  type EstadoDeCombate,
  type EstadoDeFabricacao,
  type EstadoOcioso,
  type PartidaLocal,
  type ProgressoDeProfissaoPorId,
  type ConjuntoDeEquipamentosIniciais,
} from '@greywake/dominio'
import type { RepositorioDePartidasLocais } from './repositorioDePartidas'

const NOME_DO_BANCO_DE_DADOS = 'greywake'
const VERSAO_DO_BANCO_DE_DADOS = 1
const ARMAZENAMENTO_DE_PARTIDAS = 'saves'

interface EstadoLegadoDoPersonagem {
  nome: string
  idDaClasse: PartidaLocal["personagem"]["idDaClasse"]
  idDoPresente: PartidaLocal["personagem"]["idDoPresente"]
  nivel: number
  xp: number
  pontosDeAtributoDisponiveis: number
  atributos: PartidaLocal["personagem"]["atributos"]
  ouro: number
  inventario: PartidaLocal["personagem"]["inventario"]
  equipamento: ConjuntoDeEquipamentosIniciais
  idsDasHabilidadesConhecidas: string[]
  espacosDeHabilidadesAtivas: [string | null, string | null, string | null, string | null]
  idDaLocalizacaoAtual: string
}

interface PartidaLocalLegadaV1 {
  idDaPartida: string
  modoDaPartida: "LOCAL"
  versaoDoEsquemaDaPartida: 1
  versaoDoConteudo: string
  criadoEm: string
  atualizadoEm: string
  segundosDeJogo: number
  personagem: EstadoLegadoDoPersonagem
}

interface PartidaLocalLegadaV2 extends Omit<PartidaLocalLegadaV1, "versaoDoEsquemaDaPartida"> {
  versaoDoEsquemaDaPartida: 2
  profissoes: ProgressoDeProfissaoPorId
  ocioso: EstadoOcioso
}

interface PartidaLocalLegadaV3
  extends Omit<PartidaLocal, "versaoDoEsquemaDaPartida" | "combate" | "masmorra" | "jornada"> {
  versaoDoEsquemaDaPartida: 3
  fabricacao: EstadoDeFabricacao
}

interface PartidaLocalLegadaV4
  extends Omit<PartidaLocal, "versaoDoEsquemaDaPartida" | "combate" | "masmorra" | "jornada"> {
  versaoDoEsquemaDaPartida: 4
  combate: Omit<EstadoDeCombate, "preferencias"> & {
    preferencias: Omit<EstadoDeCombate["preferencias"], "espacosDeConsumiveis">
  }
}

interface PartidaLocalLegadaV5
  extends Omit<PartidaLocal, "versaoDoEsquemaDaPartida" | "combate" | "masmorra" | "jornada"> {
  versaoDoEsquemaDaPartida: 5
  combate: PartidaLocalLegadaV4["combate"]
  masmorra: Omit<PartidaLocal["masmorra"], "contratoAceito">
}

interface PartidaLocalLegadaV6 extends Omit<PartidaLocal, "versaoDoEsquemaDaPartida" | "personagem" | "jornada"> {
  versaoDoEsquemaDaPartida: 6
  personagem: Omit<PartidaLocal["personagem"], "banco">
}

interface PartidaLocalLegadaV7 extends Omit<PartidaLocal, "versaoDoEsquemaDaPartida" | "personagem" | "jornada"> {
  versaoDoEsquemaDaPartida: 7
  personagem: Omit<PartidaLocal["personagem"], "prestigio">
}

interface PartidaLocalLegadaV8 extends Omit<PartidaLocal, "versaoDoEsquemaDaPartida" | "personagem" | "jornada"> {
  versaoDoEsquemaDaPartida: 8
  personagem: Omit<PartidaLocal["personagem"], "prestigio">
}

function requisicaoParaPromessa<T>(requisicao: IDBRequest<T>) {
  return new Promise<T>((resolver, rejeitar) => {
    requisicao.addEventListener('success', () => resolver(requisicao.result), { once: true })
    requisicao.addEventListener(
      'error',
      () => rejeitar(requisicao.error ?? new Error('Falha em uma operação do IndexedDB.')),
      { once: true },
    )
  })
}

function transacaoParaPromessa(transacao: IDBTransaction) {
  return new Promise<void>((resolver, rejeitar) => {
    transacao.addEventListener('complete', () => resolver(), { once: true })
    transacao.addEventListener(
      'error',
      () => rejeitar(transacao.error ?? new Error('Falha na transação do IndexedDB.')),
      { once: true },
    )
    transacao.addEventListener(
      'abort',
      () => rejeitar(transacao.error ?? new Error('Transação do IndexedDB abortada.')),
      { once: true },
    )
  })
}

function criarPadraoCombateEstado(): PartidaLocal["combate"] {
  return {
    preferencias: {
      estilo: "misto",
      porcentagemDoLimiarDeVidaDefensiva: 60,
      espacosDeConsumiveis: criarEspacosPadraoDeConsumiveis(),
    },
    ultimaExpedicao: null,
    loboDerrotado: false,
  }
}

function migrarCombateEstado(combate: PartidaLocalLegadaV4["combate"]): PartidaLocal["combate"] {
  return {
    ...combate,
    preferencias: {
      ...combate.preferencias,
      espacosDeConsumiveis: criarEspacosPadraoDeConsumiveis(),
    },
  }
}

function criarPadraoMasmorraEstado(): PartidaLocal["masmorra"] {
  return {
    expedicaoAtiva: null,
    dunLiathFacilConquistado: false,
    dunLiathProtetor: null,
    contratoAceito: false,
    contratoConcluido: false,
    guardaInstintivaDesbloqueada: false,
  }
}

function normalizarViajanteAnelPresente(
  personagem: PartidaLocal["personagem"],
): PartidaLocal["personagem"] {
  if (personagem.idDoPresente !== "viajante-anel") return personagem

  const existenteAnel = personagem.itensDeEquipamento.find(
    (item) => item.idDaDefinicao === "item.equipamento.viajante-anel",
  )
  if (existenteAnel) {
    return personagem.equipamento.anel1
      ? personagem
      : { ...personagem, equipamento: { ...personagem.equipamento, anel1: existenteAnel.idDaInstancia } }
  }

  const anelPilha = personagem.inventario.find(
    (pilha) => pilha.idDaDefinicao === "item.equipamento.viajante-anel",
  )
  if (!anelPilha || anelPilha.quantidade <= 0) return personagem

  const idDaInstancia = `eq-${personagem.proximaSequenciaDeEquipamento}`
  const inventario = personagem.inventario
    .map((pilha) =>
      pilha.idDaDefinicao === "item.equipamento.viajante-anel"
        ? { ...pilha, quantidade: pilha.quantidade - 1 }
        : pilha,
    )
    .filter((pilha) => pilha.quantidade > 0)

  return {
    ...personagem,
    inventario,
    itensDeEquipamento: [
      ...personagem.itensDeEquipamento,
      { idDaInstancia, idDaDefinicao: "item.equipamento.viajante-anel", nivelDeReforco: 0 },
    ],
    proximaSequenciaDeEquipamento: personagem.proximaSequenciaDeEquipamento + 1,
    equipamento: personagem.equipamento.anel1
      ? personagem.equipamento
      : { ...personagem.equipamento, anel1: idDaInstancia },
  }
}

function comInicialPersonagemPrestigio(
  personagem: Omit<PartidaLocal["personagem"], "prestigio"> | PartidaLocal["personagem"],
): PartidaLocal["personagem"] {
  const existente = (personagem as Partial<PartidaLocal["personagem"]>).prestigio

  return {
    ...personagem,
    prestigio: existente ?? criarPrestigioInicialDoPersonagem(),
  } as PartidaLocal["personagem"]
}

function comVazioBanco(
  personagem:
    | Omit<PartidaLocal["personagem"], "banco">
    | Omit<PartidaLocal["personagem"], "banco" | "prestigio">,
): PartidaLocal["personagem"] {
  return normalizarViajanteAnelPresente(comInicialPersonagemPrestigio({
    ...personagem,
    banco: { inventario: [], itensDeEquipamento: [] },
  }))
}

function migrarLegadoPersonagem(personagem: EstadoLegadoDoPersonagem): PartidaLocal["personagem"] {
  const equipamentosIniciais = criarEstadoDosEquipamentosIniciais(personagem.equipamento)

  return normalizarViajanteAnelPresente({
    ...personagem,
    banco: { inventario: [], itensDeEquipamento: [] },
    equipamento: equipamentosIniciais.equipado,
    itensDeEquipamento: equipamentosIniciais.itensDeEquipamento,
    proximaSequenciaDeEquipamento: equipamentosIniciais.proximaSequenciaDeEquipamento,
    prestigio: criarPrestigioInicialDoPersonagem(),
  })
}

function migrarPartida(dadosArmazenados: unknown): PartidaLocal {
  const brutoPartida = lerFormatoLegado(dadosArmazenados)
  if (!brutoPartida || typeof brutoPartida !== 'object') {
    throw new Error("Partida local inválido.")
  }

  const candidato = brutoPartida as Record<string, unknown>

  if (candidato.versaoDoEsquemaDaPartida === VERSAO_DO_ESQUEMA_DA_PARTIDA) {
    return brutoPartida as PartidaLocal
  }

  if (candidato.versaoDoEsquemaDaPartida === 9) {
    const legado = brutoPartida as Omit<PartidaLocal, "jornada" | "versaoDoEsquemaDaPartida">
    return { ...legado, versaoDoEsquemaDaPartida: VERSAO_DO_ESQUEMA_DA_PARTIDA, jornada: criarJornadaInicial() }
  }

  if (candidato.versaoDoEsquemaDaPartida === 8) {
    const legado = brutoPartida as PartidaLocalLegadaV8
    return {
      ...legado,
      versaoDoEsquemaDaPartida: VERSAO_DO_ESQUEMA_DA_PARTIDA,
      jornada: criarJornadaInicial(),
      personagem: normalizarViajanteAnelPresente(comInicialPersonagemPrestigio(legado.personagem)),
    }
  }

  if (candidato.versaoDoEsquemaDaPartida === 7) {
    const legado = brutoPartida as PartidaLocalLegadaV7
    return {
      ...legado,
      versaoDoEsquemaDaPartida: VERSAO_DO_ESQUEMA_DA_PARTIDA,
      jornada: criarJornadaInicial(),
      personagem: normalizarViajanteAnelPresente(comInicialPersonagemPrestigio(legado.personagem)),
    }
  }

  if (candidato.versaoDoEsquemaDaPartida === 6) {
    const legado = brutoPartida as PartidaLocalLegadaV6
    return {
      ...legado,
      versaoDoEsquemaDaPartida: VERSAO_DO_ESQUEMA_DA_PARTIDA,
      jornada: criarJornadaInicial(),
      personagem: comVazioBanco(legado.personagem),
    }
  }

  if (candidato.versaoDoEsquemaDaPartida === 5) {
    const legado = brutoPartida as PartidaLocalLegadaV5
    return {
      ...legado,
      versaoDoEsquemaDaPartida: VERSAO_DO_ESQUEMA_DA_PARTIDA,
      jornada: criarJornadaInicial(),
      personagem: comVazioBanco(legado.personagem),
      combate: migrarCombateEstado(legado.combate),
      masmorra: {
        ...legado.masmorra,
        contratoAceito:
          legado.masmorra.contratoConcluido || legado.masmorra.expedicaoAtiva !== null,
      },
    }
  }

  if (candidato.versaoDoEsquemaDaPartida === 4) {
    const legado = brutoPartida as PartidaLocalLegadaV4
    return {
      ...legado,
      versaoDoEsquemaDaPartida: VERSAO_DO_ESQUEMA_DA_PARTIDA,
      jornada: criarJornadaInicial(),
      personagem: comVazioBanco(legado.personagem),
      combate: migrarCombateEstado(legado.combate),
      masmorra: criarPadraoMasmorraEstado(),
    }
  }

  if (candidato.versaoDoEsquemaDaPartida === 3) {
    const legado = brutoPartida as PartidaLocalLegadaV3
    return {
      ...legado,
      versaoDoEsquemaDaPartida: VERSAO_DO_ESQUEMA_DA_PARTIDA,
      jornada: criarJornadaInicial(),
      personagem: comVazioBanco(legado.personagem),
      combate: criarPadraoCombateEstado(),
      masmorra: criarPadraoMasmorraEstado(),
    }
  }

  if (candidato.versaoDoEsquemaDaPartida === 2) {
    const legado = brutoPartida as PartidaLocalLegadaV2

    return {
      ...legado,
      versaoDoEsquemaDaPartida: VERSAO_DO_ESQUEMA_DA_PARTIDA,
      jornada: criarJornadaInicial(),
      personagem: migrarLegadoPersonagem(legado.personagem),
      fabricacao: { receitaAtiva: null },
      combate: criarPadraoCombateEstado(),
      masmorra: criarPadraoMasmorraEstado(),
    }
  }

  if (candidato.versaoDoEsquemaDaPartida === 1) {
    const legado = brutoPartida as PartidaLocalLegadaV1

    return {
      ...legado,
      versaoDoEsquemaDaPartida: VERSAO_DO_ESQUEMA_DA_PARTIDA,
      jornada: criarJornadaInicial(),
      personagem: migrarLegadoPersonagem(legado.personagem),
      profissoes: criarProgressoInicialDasProfissoes(),
      ocioso: { atividadeAtiva: null },
      fabricacao: { receitaAtiva: null },
      combate: criarPadraoCombateEstado(),
      masmorra: criarPadraoMasmorraEstado(),
    }
  }

  throw new Error(`Esquema de partida não suportado: ${String(candidato.versaoDoEsquemaDaPartida)}.`)
}

function abrirBancoDeDados() {
  if (!globalThis.indexedDB) {
    return Promise.reject(new Error('IndexedDB não está disponível neste navegador.'))
  }

  return new Promise<IDBDatabase>((resolver, rejeitar) => {
    const requisicao = globalThis.indexedDB.open(NOME_DO_BANCO_DE_DADOS, VERSAO_DO_BANCO_DE_DADOS)

    requisicao.addEventListener(
      'upgradeneeded',
      () => {
        const bancoDeDados = requisicao.result

        if (!bancoDeDados.objectStoreNames.contains(ARMAZENAMENTO_DE_PARTIDAS)) {
          bancoDeDados.createObjectStore(ARMAZENAMENTO_DE_PARTIDAS, { keyPath: 'saveId' })
        }
      },
      { once: true },
    )

    requisicao.addEventListener('success', () => resolver(requisicao.result), { once: true })
    requisicao.addEventListener(
      'error',
      () => rejeitar(requisicao.error ?? new Error('Não foi possível abrir o banco local.')),
      { once: true },
    )
  })
}

export function criarRepositorioDePartidasIndexedDb(): RepositorioDePartidasLocais {
  return {
    async listar() {
      const bancoDeDados = await abrirBancoDeDados()

      try {
        const transacao = bancoDeDados.transaction(ARMAZENAMENTO_DE_PARTIDAS, 'readonly')
        const concluida = transacaoParaPromessa(transacao)
        const requisicao = transacao.objectStore(ARMAZENAMENTO_DE_PARTIDAS).getAll()
        const brutoPartidas = await requisicaoParaPromessa(requisicao)
        await concluida

        return brutoPartidas
          .map((partida) => migrarPartida(partida))
          .toSorted((a, b) => b.atualizadoEm.localeCompare(a.atualizadoEm))
      } finally {
        bancoDeDados.close()
      }
    },

    async obter(idDaPartida) {
      const bancoDeDados = await abrirBancoDeDados()

      try {
        const transacao = bancoDeDados.transaction(ARMAZENAMENTO_DE_PARTIDAS, 'readonly')
        const concluida = transacaoParaPromessa(transacao)
        const requisicao = transacao.objectStore(ARMAZENAMENTO_DE_PARTIDAS).get(idDaPartida)
        const brutoPartida = await requisicaoParaPromessa(requisicao)
        await concluida

        return brutoPartida === undefined ? null : migrarPartida(brutoPartida)
      } finally {
        bancoDeDados.close()
      }
    },

    async salvar(partida) {
      const bancoDeDados = await abrirBancoDeDados()

      try {
        const transacao = bancoDeDados.transaction(ARMAZENAMENTO_DE_PARTIDAS, 'readwrite')
        const concluida = transacaoParaPromessa(transacao)
        const requisicao = transacao.objectStore(ARMAZENAMENTO_DE_PARTIDAS).put(gravarFormatoLegado(partida))
        await requisicaoParaPromessa(requisicao)
        await concluida
      } finally {
        bancoDeDados.close()
      }
    },
  }
}

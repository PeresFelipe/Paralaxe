/**
 * @file Persistência IndexedDB, leitura do formato legado e migração de esquemas de partida.
 * Cada operação abre sua conexão, aguarda a transação e a fecha em finally. Migrações
 * acontecem na leitura em memória; somente salvar regrava a partida no armazenamento.
 */
import { lerFormatoLegado, gravarFormatoLegado } from './formatoLegado'
import {
  VERSAO_DO_ESQUEMA_DA_PARTIDA,
  criarEspacosPadraoDeConsumiveis,
  criarPrestigioInicialDoPersonagem,
  criarProgressoInicialDasProfissoes,
  criarJornadaInicial,
  criarEstadoInicialDaVigilia,
  validarEstadoDaVigilia,
  criarLegadoInicial,
  validarLegado,
  criarEstadoDosEquipamentosIniciais,
  type EstadoDeCombate,
  type EstadoDeFabricacao,
  type EstadoOcioso,
  type PartidaLocal,
  type ProgressoDeProfissaoPorId,
  type ConjuntoDeEquipamentosIniciais,
} from '@paralaxe/dominio'
import type { RepositorioDePartidasLocais } from '@paralaxe/interface'

/** Nome já publicado no navegador; alterá-lo criaria outro banco e ocultaria as partidas existentes. */
/** Nome historico do IndexedDB: manter para que partidas antigas continuem acessiveis apos a renomeacao da marca. */
const NOME_DO_BANCO_DE_DADOS = 'greywake'
/** Versão das estruturas do IndexedDB, independente da versão do esquema de cada partida. */
const VERSAO_DO_BANCO_DE_DADOS = 1
/** Nome histórico da coleção; deve continuar compatível com a chave saveId do formato gravado. */
const ARMAZENAMENTO_DE_PARTIDAS = 'saves'

/** Formato anterior aos equipamentos com instância: cada espaço apontava diretamente para uma definição. */
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

/** Adapta sucesso ou erro de uma requisição IndexedDB; isso, sozinho, ainda não confirma a transação. */
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

/** Espera a confirmação completa e também rejeita abortos, evitando anunciar uma gravação que não foi efetivada. */
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

/** Preenche partidas que ainda não tinham o sistema de combate, sem presumir vitórias anteriores. */
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

/** Acrescenta os dois espaços de consumíveis às preferências antigas sem perder postura e histórico. */
function migrarCombateEstado(combate: PartidaLocalLegadaV4["combate"]): PartidaLocal["combate"] {
  return {
    ...combate,
    preferencias: {
      ...combate.preferencias,
      espacosDeConsumiveis: criarEspacosPadraoDeConsumiveis(),
    },
  }
}

/** Fornece flags vazias para partidas anteriores ao sistema de expedição e contrato. */
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

/** Converte o antigo anel empilhado em equipamento individual, sem duplicar uma instância já existente. */
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

/** Acrescenta prestígio vazio somente quando esse estado ainda não existe na partida antiga. */
function comInicialPersonagemPrestigio(
  personagem: Omit<PartidaLocal["personagem"], "prestigio"> | PartidaLocal["personagem"],
): PartidaLocal["personagem"] {
  const existente = (personagem as Partial<PartidaLocal["personagem"]>).prestigio

  return {
    ...personagem,
    prestigio: existente ?? criarPrestigioInicialDoPersonagem(),
  } as PartidaLocal["personagem"]
}

/** Inicializa o banco ausente e encadeia a normalização de prestígio e do presente Anel do Viajante. */
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

/** Converte o conjunto antigo em instâncias equipadas e inicializa os sistemas adicionados depois. */
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

/**
 * Primeiro traduz o vocabulário, depois escolhe a migração pela versão do esquema.
 * Versões reconhecidas recebem somente os estados que lhes faltavam; versões desconhecidas são rejeitadas.
 */
function migrarPartidaAnterior(dadosArmazenados: unknown): Omit<PartidaLocal, 'vigilia' | 'legado'> {
  const brutoPartida = lerFormatoLegado(dadosArmazenados)
  if (!brutoPartida || typeof brutoPartida !== 'object') {
    throw new Error("Partida local inválido.")
  }

  const candidato = brutoPartida as Record<string, unknown>

  if (candidato.versaoDoEsquemaDaPartida === VERSAO_DO_ESQUEMA_DA_PARTIDA) {
    validarEstadoDaVigilia((brutoPartida as Partial<PartidaLocal>).vigilia)
    validarLegado((brutoPartida as Partial<PartidaLocal>).legado)
    return brutoPartida as PartidaLocal
  }

  if (candidato.versaoDoEsquemaDaPartida === 15) {
    const anterior = brutoPartida as PartidaLocal
    validarEstadoDaVigilia(anterior.vigilia)
    validarLegado(anterior.legado)
    return { ...anterior, versaoDoEsquemaDaPartida: VERSAO_DO_ESQUEMA_DA_PARTIDA,
      ocioso: { ...anterior.ocioso, atividadeTerciaria: null, prioridade: anterior.ocioso.prioridade ?? 'equilibrado' },
      fabricacao: { ...anterior.fabricacao, receitaTerciaria: null, prioridade: anterior.fabricacao.prioridade ?? 'equilibrado' } }
  }

  if (candidato.versaoDoEsquemaDaPartida === 14) {
    const anterior = brutoPartida as PartidaLocal
    validarEstadoDaVigilia(anterior.vigilia)
    validarLegado(anterior.legado)
    return {
      ...anterior, versaoDoEsquemaDaPartida: VERSAO_DO_ESQUEMA_DA_PARTIDA,
      fabricacao: { ...anterior.fabricacao, receitaSecundaria: null },
    }
  }

  if (candidato.versaoDoEsquemaDaPartida === 13) {
    const anterior = brutoPartida as PartidaLocal
    validarEstadoDaVigilia(anterior.vigilia)
    validarLegado(anterior.legado)
    return {
      ...anterior,
      versaoDoEsquemaDaPartida: VERSAO_DO_ESQUEMA_DA_PARTIDA,
      ocioso: { ...anterior.ocioso, atividadeSecundaria: null },
    }
  }

  if (candidato.versaoDoEsquemaDaPartida === 12) {
    validarEstadoDaVigilia((brutoPartida as Partial<PartidaLocal>).vigilia)
    return { ...(brutoPartida as PartidaLocal), versaoDoEsquemaDaPartida: VERSAO_DO_ESQUEMA_DA_PARTIDA }
  }

  if (candidato.versaoDoEsquemaDaPartida === 11) {
    return { ...(brutoPartida as PartidaLocal), versaoDoEsquemaDaPartida: VERSAO_DO_ESQUEMA_DA_PARTIDA }
  }

  if (candidato.versaoDoEsquemaDaPartida === 10) {
    const legado = brutoPartida as Omit<PartidaLocal, "codice" | "desafios" | "versaoDoEsquemaDaPartida">
    return {
      ...legado,
      versaoDoEsquemaDaPartida: VERSAO_DO_ESQUEMA_DA_PARTIDA,
      codice: { idsDescobertos: [`classe.${legado.personagem.idDaClasse}`] },
      desafios: { idsConcluidos: [] },
    }
  }

  // A jornada começa vazia: possuir um item numa partida antiga não comprova que o jogador o fabricou.
  if (candidato.versaoDoEsquemaDaPartida === 9) {
    const legado = brutoPartida as Omit<PartidaLocal, "jornada" | "versaoDoEsquemaDaPartida">
    return { ...legado, versaoDoEsquemaDaPartida: VERSAO_DO_ESQUEMA_DA_PARTIDA, jornada: criarJornadaInicial(), codice: { idsDescobertos: [`classe.${legado.personagem.idDaClasse}`] }, desafios: { idsConcluidos: [] } }
  }

  if (candidato.versaoDoEsquemaDaPartida === 8) {
    const legado = brutoPartida as PartidaLocalLegadaV8
    return {
      ...legado,
      versaoDoEsquemaDaPartida: VERSAO_DO_ESQUEMA_DA_PARTIDA,
      jornada: criarJornadaInicial(),
      codice: { idsDescobertos: [`classe.${legado.personagem.idDaClasse}`] },
      desafios: { idsConcluidos: [] },
      personagem: normalizarViajanteAnelPresente(comInicialPersonagemPrestigio(legado.personagem)),
    }
  }

  if (candidato.versaoDoEsquemaDaPartida === 7) {
    const legado = brutoPartida as PartidaLocalLegadaV7
    return {
      ...legado,
      versaoDoEsquemaDaPartida: VERSAO_DO_ESQUEMA_DA_PARTIDA,
      jornada: criarJornadaInicial(),
      codice: { idsDescobertos: [`classe.${legado.personagem.idDaClasse}`] },
      desafios: { idsConcluidos: [] },
      personagem: normalizarViajanteAnelPresente(comInicialPersonagemPrestigio(legado.personagem)),
    }
  }

  if (candidato.versaoDoEsquemaDaPartida === 6) {
    const legado = brutoPartida as PartidaLocalLegadaV6
    return {
      ...legado,
      versaoDoEsquemaDaPartida: VERSAO_DO_ESQUEMA_DA_PARTIDA,
      jornada: criarJornadaInicial(),
      codice: { idsDescobertos: [`classe.${legado.personagem.idDaClasse}`] },
      desafios: { idsConcluidos: [] },
      personagem: comVazioBanco(legado.personagem),
    }
  }

  if (candidato.versaoDoEsquemaDaPartida === 5) {
    const legado = brutoPartida as PartidaLocalLegadaV5
    return {
      ...legado,
      versaoDoEsquemaDaPartida: VERSAO_DO_ESQUEMA_DA_PARTIDA,
      jornada: criarJornadaInicial(),
      codice: { idsDescobertos: [`classe.${legado.personagem.idDaClasse}`] },
      desafios: { idsConcluidos: [] },
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
      codice: { idsDescobertos: [`classe.${legado.personagem.idDaClasse}`] },
      desafios: { idsConcluidos: [] },
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
      codice: { idsDescobertos: [`classe.${legado.personagem.idDaClasse}`] },
      desafios: { idsConcluidos: [] },
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
      codice: { idsDescobertos: [`classe.${legado.personagem.idDaClasse}`] },
      desafios: { idsConcluidos: [] },
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
      codice: { idsDescobertos: [`classe.${legado.personagem.idDaClasse}`] },
      desafios: { idsConcluidos: [] },
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

/** Migra o legado sem reembolsar investimentos, e preserva a Vigília somente como histórico. */
function migrarPartida(dadosArmazenados: unknown): PartidaLocal {
  const anterior = migrarPartidaAnterior(dadosArmazenados)
  // Todos os legados anteriores ao v14 recebem o segundo espaço vazio sem perder a atividade principal.
  const migrada = {
    ...anterior,
    ocioso: { ...anterior.ocioso, atividadeSecundaria: anterior.ocioso.atividadeSecundaria ?? null,
      atividadeTerciaria: anterior.ocioso.atividadeTerciaria ?? null, prioridade: anterior.ocioso.prioridade ?? 'equilibrado' },
    fabricacao: { ...anterior.fabricacao, receitaSecundaria: anterior.fabricacao.receitaSecundaria ?? null,
      receitaTerciaria: anterior.fabricacao.receitaTerciaria ?? null, prioridade: anterior.fabricacao.prioridade ?? 'equilibrado' },
  }
  if ('legado' in migrada) {
    validarLegado(migrada.legado)
    if (!('vigilia' in migrada)) throw new Error('Save v16 sem histórico da Vigília.')
    validarEstadoDaVigilia(migrada.vigilia)
    return { ...migrada, vigilia: migrada.vigilia, legado: migrada.legado }
  }
  if ('vigilia' in migrada) {
    validarEstadoDaVigilia(migrada.vigilia)
    return { ...migrada, vigilia: migrada.vigilia, legado: criarLegadoInicial(migrada.vigilia) }
  }
  const vigilia = criarEstadoInicialDaVigilia()
  return { ...migrada, vigilia, legado: criarLegadoInicial(vigilia) }
}

/** Abre a base publicada e cria a coleção apenas na atualização inicial da estrutura. */
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
          // A chave continua em inglês porque gravarFormatoLegado converte idDaPartida antes de persistir.
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

/** Entrega as operações do contrato, mantendo transações e compatibilidade dentro desta camada. */
export function criarRepositorioDePartidasIndexedDb(): RepositorioDePartidasLocais {
  return {
    // Migra cada registro em memória e ordena os horários ISO para mostrar primeiro a partida mais recente.
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

    // Uma chave inexistente retorna null; erros de leitura ou migração são propagados para a aplicação.
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

    // Escuta a conclusão antes do put para não perder o evento; só depois dela a operação é considerada salva.
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

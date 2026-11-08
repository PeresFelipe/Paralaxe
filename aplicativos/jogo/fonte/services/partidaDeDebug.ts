/** Cria uma cópia explícita de testes. Não altera o personagem nem os catálogos de origem. */
import {
  ATIVIDADES_OCIOSAS_INICIAIS, RECEITAS_INICIAIS_DE_FABRICACAO,
  DEFINICOES_DE_EQUIPAMENTO, CONSUMIVEIS_DE_COMBATE, HABILIDADES_DE_COMBATE,
  ENTRADAS_DO_CODICE, DESAFIOS, PROJETOS_DA_CIDADE, PARCEIROS,
  obterConjuntoDeHabilidadesAntesDaMasmorra,
} from '@paralaxe/conteudo'
import {
  CHAVES_DOS_ATRIBUTOS, IDS_DAS_PROFISSOES, IDS_DOS_DISTRITOS,
  DIFICULDADES_DE_DUN_LIATH, NOS_DE_PRESTIGIO, NIVEL_GERAL_MAXIMO,
  NIVEL_MAXIMO_DE_PROFISSAO, XP_GERAL_PARA_PROXIMO_NIVEL,
  obterPilhaLimite, obterXpDeProfissaoParaProximoNivel, aplicarXpDeProfissao, type PartidaLocal, type DefinicaoDeEquipamento,
} from '@paralaxe/dominio'

/** Atributos não têm teto canônico; 99 é a referência explícita deste preset de debug. */
export const ATRIBUTO_DE_DEBUG = 99
export const OURO_DE_DEBUG = 9_999_999

export function criarPartidaDeDebug(origem: PartidaLocal, id: string, agora: string): PartidaLocal {
  const idOriginal = origem.depuracao?.idDaPartidaOriginal ?? origem.idDaPartida
  if (!id || id === idOriginal || (!origem.depuracao && id === origem.idDaPartida)) {
    throw new Error('A partida de debug precisa de um ID separado do personagem original.')
  }
  if (!Number.isFinite(Date.parse(agora))) throw new Error('Horário inválido para criar debug.')
  const partida = structuredClone(origem)
  const atributos = { ...partida.personagem.atributos }
  for (const chave of CHAVES_DOS_ATRIBUTOS) atributos[chave] = ATRIBUTO_DE_DEBUG
  const xpDeOficio = Array.from({ length: NIVEL_MAXIMO_DE_PROFISSAO - 1 }, (_, i) => obterXpDeProfissaoParaProximoNivel(i + 1) ?? 0).reduce((soma, xp) => soma + xp, 0)
  const itens = new Set<string>([
    ...ATIVIDADES_OCIOSAS_INICIAIS.map(a => a.idDaDefinicaoDoItemProduzido),
    ...CONSUMIVEIS_DE_COMBATE.map(c => c.id),
    ...RECEITAS_INICIAIS_DE_FABRICACAO.flatMap(r => [
      ...r.ingredientes.map(i => i.idDaDefinicao),
      ...(r.saida.tipo === 'item' ? [r.saida.idDaDefinicao] : []),
    ]),
    ...PROJETOS_DA_CIDADE.flatMap(p => p.materiais.map(m => m.idDaDefinicao)),
    'item.dun-liath.lacre-comandante', 'item.dun-liath.registro-suprimentos',
    'item.dun-liath.fragmento-tratado',
  ])
  const definicoes: readonly DefinicaoDeEquipamento[] = DEFINICOES_DE_EQUIPAMENTO
  const instancias = definicoes.map((d, i) => ({
    idDaInstancia: `eq-debug-${i + 1}`, idDaDefinicao: d.id,
    nivelDeReforco: 2 as const, raridade: 'raro' as const,
    idsDosAfixos: ['afixo.precisao-4', 'afixo.defesa-2'],
  }))
  const melhores = new Map<string, { indice: number; valor: number }>()
  definicoes.forEach((d, indice) => {
    const valor = (d.estatisticaPrincipal?.valor ?? 0)
      + (d.bonusDeColeta?.xpAdicionalPorAcao ?? 0)
      + Object.values(d.bonusDeRecursos ?? {}).reduce((soma, n) => soma + n, 0)
    if (!melhores.has(d.espaco) || valor > melhores.get(d.espaco)!.valor) melhores.set(d.espaco, { indice, valor })
  })
  const equipados = new Set([...melhores.values()].map(v => instancias[v.indice]!.idDaInstancia))
  partida.idDaPartida = id
  partida.depuracao = { idDaPartidaOriginal: idOriginal }
  partida.criadoEm = origem.depuracao && id === origem.idDaPartida ? origem.criadoEm : agora
  partida.atualizadoEm = agora
  partida.personagem = {
    ...partida.personagem,
    nome: origem.depuracao ? origem.personagem.nome : `[DEBUG] ${origem.personagem.nome}`,
    nivel: NIVEL_GERAL_MAXIMO,
    xp: XP_GERAL_PARA_PROXIMO_NIVEL.reduce((soma, xp) => soma + xp, 0),
    pontosDeAtributoDisponiveis: 98,
    atributos,
    ouro: OURO_DE_DEBUG,
    inventario: [...itens].sort().map(idDaDefinicao => ({ idDaDefinicao, quantidade: obterPilhaLimite(idDaDefinicao) })),
    itensDeEquipamento: instancias.filter(i => equipados.has(i.idDaInstancia)),
    banco: { inventario: [], itensDeEquipamento: instancias.filter(i => !equipados.has(i.idDaInstancia)) },
    equipamento: Object.fromEntries([...melhores].map(([espaco, v]) => [espaco, instancias[v.indice]!.idDaInstancia])),
    proximaSequenciaDeEquipamento: instancias.length + 1,
    idsDasHabilidadesConhecidas: HABILIDADES_DE_COMBATE.map(h => h.id),
    espacosDeHabilidadesAtivas: obterConjuntoDeHabilidadesAntesDaMasmorra(origem.personagem.idDaClasse).slice(0, 4) as [string, string, string, string],
    prestigio: { nivel: 3, pontos: 15, idsDosNosDesbloqueados: NOS_DE_PRESTIGIO.map(n => n.id) },
    idDaLocalizacaoAtual: 'cidade-livre.taverna',
  }
  partida.profissoes = Object.fromEntries(IDS_DAS_PROFISSOES.map(id => [id, aplicarXpDeProfissao({ nivel: 1, xp: 0, prestigio: 3 }, xpDeOficio).progresso])) as PartidaLocal['profissoes']
  partida.ocioso = { atividadeAtiva: null, atividadeSecundaria: null, atividadeTerciaria: null, prioridade: 'equilibrado' }
  partida.fabricacao = { receitaAtiva: null, receitaSecundaria: null, receitaTerciaria: null, prioridade: 'equilibrado' }
  partida.minigames = { ultimasJanelasUsadas: {}, bonusAtivo: null }
  partida.combate.loboDerrotado = true
  partida.masmorra = {
    ...partida.masmorra, expedicaoAtiva: null, incursaoAutomaticaAtiva: null, ultimaIncursaoAutomatica: null,
    dunLiathFacilConquistado: true, dificuldadesConcluidas: [...DIFICULDADES_DE_DUN_LIATH],
    contratoAceito: true, contratoConcluido: true, guardaInstintivaDesbloqueada: true,
  }
  partida.grupo = {
    marcoDeMira: 'recrutavel',
    parceiros: Object.fromEntries(PARCEIROS.map(p => [p.id, { vinculo: 'leal', recrutado: true }])),
    idsDosParceirosAtivos: PARCEIROS.slice(0, 3).map(p => p.id),
  }
  partida.jornada = { meta: null, idsDasReceitasFabricadas: RECEITAS_INICIAIS_DE_FABRICACAO.map(r => r.id) }
  partida.codice = { idsDescobertos: [...new Set(ENTRADAS_DO_CODICE.map(e => e.id))] }
  partida.desafios = { idsConcluidos: DESAFIOS.map(d => d.id) }
  partida.legado = {
    distritos: Object.fromEntries(IDS_DOS_DISTRITOS.map(id => [id, 4])) as PartidaLocal['legado']['distritos'],
    creditosDeTransicao: 0,
    historico: PROJETOS_DA_CIDADE.map(p => ({ idDoProjeto: p.id, idDoDistrito: p.distrito, nivel: p.nivel, concluidoEm: agora })),
  }
  return partida
}

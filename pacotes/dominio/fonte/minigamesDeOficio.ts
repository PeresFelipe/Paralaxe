/**
 * @file Sete oportunidades opcionais de profissão: o Ocioso gera a janela, o usuário interage.
 * Não há RNG, prêmio econômico direto ou penalidade ao errar. Sucesso concede bônus
 * temporário de XP nos próximos ciclos, nunca retroativamente.
 */
import type { PartidaLocal } from './personagem'
import type { IdDaProfissao } from './ocioso'

export interface BonusDoMinigame {
  idDaProfissao: IdDaProfissao
  ativadoEm: string
  expiraEm: string
  xpExtraPorCiclo: number
}

export interface EstadoDosMinigamesDeOficio {
  ultimasJanelasUsadas: Partial<Record<IdDaProfissao, number>>
  bonusAtivo: BonusDoMinigame | null
}

export interface OportunidadeDeMinigame {
  idDaProfissao: IdDaProfissao
  nome: string
  instrucao: string
  opcoes: string[]
  janela: number
  respostaCorreta: number
}

export const DURACAO_DA_JANELA_DE_MINIGAME_MS = 180000
export const TEMPO_MINIMO_DE_TRABALHO_PARA_MINIGAME_MS = 60000
export const XP_EXTRA_POR_ACAO_BEM_SUCEDIDA = 4

const TEMAS: Record<IdDaProfissao, { nome: string; instrucao: string; opcoes: [string,string,string] }> = {
  mineracao: { nome: 'Pontos fracos da rocha',
    instrucao: 'Uma fissura exposta corta a rocha. Onde golpear para separar o veio sem esforço?',
    opcoes: ['Na fissura exposta', 'Na face intacta', 'Na base maciça'] },
  lenhador: { nome: 'Direção e timing dos cortes',
    instrucao: 'A árvore inclina para o lado livre. Qual corte conduz a queda com segurança?',
    opcoes: ['Entalhe no lado da queda', 'Golpe contra a inclinação', 'Corte aleatório no tronco'] },
  pesca: { nome: 'Fisgada e tensão',
    instrucao: 'A linha está sob tensão excessiva. Como evitar perdê-la?',
    opcoes: ['Aliviar gradualmente a linha', 'Puxar com força máxima', 'Ignorar a tensão'] },
  herbologia: { nome: 'Identificação e extração',
    instrucao: 'Uma erva está pronta, mas as raízes são frágeis. Qual extração a preserva?',
    opcoes: ['Soltar a terra ao redor da raiz', 'Arrancar pelo caule', 'Cortar a raiz às cegas'] },
  metalurgia: { nome: 'Controle de fundição',
    instrucao: 'A liga começa a espumar pela temperatura alta. Como estabilizar a fusão?',
    opcoes: ['Reduzir o calor gradualmente', 'Aumentar o fogo de uma vez', 'Despejar metal frio sem medida'] },
  forja: { nome: 'Martelamento',
    instrucao: 'A peça está rubra e alinhada sobre a bigorna. Qual golpe conserva a forma?',
    opcoes: ['Batidas ritmadas e precisas', 'Golpes aleatórios e rápidos', 'Marretar com a peça fria'] },
  culinaria: { nome: 'Sequência e timing',
    instrucao: 'Os ingredientes sensíveis já foram preparados. Qual sequência evita perder o ponto?',
    opcoes: ['Aquecer, adicionar e finalizar', 'Servir antes de aquecer', 'Queimar e temperar ao fim'] },
}
const ORDEM_DOS_OFICIOS: IdDaProfissao[] = [
  'mineracao','lenhador','pesca','herbologia','metalurgia','forja','culinaria',
]

export function criarEstadoInicialDosMinigames(): EstadoDosMinigamesDeOficio {
  return { ultimasJanelasUsadas: {}, bonusAtivo: null }
}

/** Identifica o ofício selecionado pelo ID estável da definição de coleta ou receita. */
function trabalhoAtivo(partida: PartidaLocal): { profissao: string; iniciadoEm: string } | null {
  const coleta = partida.ocioso.atividadeAtiva
  if (coleta) return { profissao: coleta.idDaDefinicaoDaAtividade.split('.')[1] ?? '',
    iniciadoEm: coleta.iniciadoEm }
  const receita = partida.fabricacao.receitaAtiva
  return receita ? { profissao: receita.idDaDefinicaoDaReceita.split('.')[1] ?? '',
    iniciadoEm: receita.iniciadoEm } : null
}

export function obterOportunidadeDeMinigame(
  partida: PartidaLocal, profissao: IdDaProfissao, agora: string,
): OportunidadeDeMinigame | null {
  if (partida.masmorra.expedicaoAtiva) return null
  const ativo = trabalhoAtivo(partida)
  const agoraMs = Date.parse(agora)
  if (!ativo || ativo.profissao !== profissao || !Number.isFinite(agoraMs) ||
      agoraMs - Date.parse(ativo.iniciadoEm) < TEMPO_MINIMO_DE_TRABALHO_PARA_MINIGAME_MS) return null
  const janela = Math.floor(agoraMs / DURACAO_DA_JANELA_DE_MINIGAME_MS)
  // Não permite reabrir janelas anteriores ao último desafio resolvido ao atrasar o relógio local.
  // O maior índice de janela permanece como marca d'água por Ofício.
  const ultimaJanela = partida.minigames?.ultimasJanelasUsadas[profissao]
  if (ultimaJanela !== undefined && janela <= ultimaJanela) return null
  const tema = TEMAS[profissao]
  const rotacao = (janela + ORDEM_DOS_OFICIOS.indexOf(profissao)) % 3
  const opcoes = [...tema.opcoes.slice(rotacao), ...tema.opcoes.slice(0, rotacao)]
  return { idDaProfissao: profissao, janela, nome: tema.nome, instrucao: tema.instrucao,
    opcoes, respostaCorreta: opcoes.indexOf(tema.opcoes[0]) }
}

export function responderMinigameDeOficio(
  partida: PartidaLocal, profissao: IdDaProfissao, resposta: number, agora: string,
): { partida: PartidaLocal; acertou: boolean } {
  const oportunidade = obterOportunidadeDeMinigame(partida, profissao, agora)
  if (!oportunidade) throw new Error('A oportunidade de minigame já expirou ou foi utilizada.')
  if (!Number.isInteger(resposta) || resposta < 0 || resposta >= oportunidade.opcoes.length) {
    throw new Error('Resposta de minigame inválida.')
  }
  const acertou = resposta === oportunidade.respostaCorreta
  const anterior = partida.minigames ?? criarEstadoInicialDosMinigames()
  const bonusAtivo = acertou ? {
    idDaProfissao: profissao,
    ativadoEm: agora,
    expiraEm: new Date(Date.parse(agora) + DURACAO_DA_JANELA_DE_MINIGAME_MS).toISOString(),
    xpExtraPorCiclo: XP_EXTRA_POR_ACAO_BEM_SUCEDIDA,
  } : anterior.bonusAtivo
  return { acertou, partida: { ...partida, atualizadoEm: agora, minigames: {
    ultimasJanelasUsadas: { ...anterior.ultimasJanelasUsadas, [profissao]: oportunidade.janela },
    bonusAtivo,
  } } }
}

/** Sem bônus retroativo: o período deve começar após a interação e terminar antes do vencimento. */
export function obterBonusXpDoMinigame(
  partida: PartidaLocal, profissao: IdDaProfissao, ultimoProcessadoEm: string, agora: string,
): number {
  const bonus = partida.minigames?.bonusAtivo
  if (!bonus || bonus.idDaProfissao !== profissao) return 0
  const inicio = Date.parse(ultimoProcessadoEm)
  const ativado = Date.parse(bonus.ativadoEm)
  const fim = Date.parse(agora)
  const expira = Date.parse(bonus.expiraEm)
  if (![inicio, ativado, fim, expira].every(Number.isFinite) || inicio < ativado || fim > expira) return 0
  return bonus.xpExtraPorCiclo
}

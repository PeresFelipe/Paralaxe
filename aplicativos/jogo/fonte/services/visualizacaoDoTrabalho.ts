/** Modelo somente de apresentação: usa o mesmo relógio por espaço do domínio. */
import { ATIVIDADES_OCIOSAS_INICIAIS, RECEITAS_INICIAIS_DE_FABRICACAO } from '@paralaxe/conteudo'
import { explicarPrioridadeDeOficio, obterXpDeProfissaoParaProximoNivel, segundosPorAcaoComPrioridade, type PartidaLocal, type IdDaProfissao } from '@paralaxe/dominio'
import { rotulosDosItens, rotulosDasProfissoes } from '../rotulosDoJogo'
export type EspacoDoTrabalho = 'principal' | 'secundaria' | 'terciaria'

type ProgressoDoTrabalho = {
  titulo: string;
  idDaProfissao: IdDaProfissao;
  segundosPorAcao: number;
  segundosRestantes: number;
  processadoPorUltimoEm: string;
  proximoResultado: string;
  /** Taxas teóricas base, sem buffs, minigames, ferramentas, limites de materiais ou capacidade. */
  xpBasePorHora: number;
  producaoBasePorHora: number;
  segundosEstimadosParaProximoNivel: number | null;
  motivoDaPrioridade: string;
};

function rotuloPara(idDaDefinicao: string) {
  return rotulosDosItens[idDaDefinicao] ?? idDaDefinicao;
}

/** Calcula uma previsão por ciclo, nunca substitui as regras de progressão do domínio. */
function estimativasBase(
  partida: PartidaLocal,
  idDaProfissao: IdDaProfissao,
  segundosPorAcao: number,
  xpPorAcao: number,
  quantidadePorAcao: number,
  prioridade: Parameters<typeof explicarPrioridadeDeOficio>[0],
  espaco: EspacoDoTrabalho,
) {
  const xpBasePorHora = (xpPorAcao * 3600) / segundosPorAcao;
  const producaoBasePorHora = (quantidadePorAcao * 3600) / segundosPorAcao;
  const progresso = partida.profissoes[idDaProfissao];
  const requisito = obterXpDeProfissaoParaProximoNivel(progresso.nivel);
  return {
    xpBasePorHora,
    producaoBasePorHora,
    segundosEstimadosParaProximoNivel: requisito === null || xpPorAcao <= 0
      ? null
      : Math.max(0, Math.ceil((Math.max(0, requisito - progresso.xp) / xpPorAcao) * segundosPorAcao)),
    motivoDaPrioridade: explicarPrioridadeDeOficio(prioridade, espaco),
  };
}

/** Uniformiza coleta e receita em um modelo de apresentação com duração, saldo de tempo e próximo resultado. */
export function obterProgressoDoTrabalho(partida: PartidaLocal, espaco: EspacoDoTrabalho = 'principal'): ProgressoDoTrabalho | null {
  const ativoOcioso = espaco === 'principal' ? partida.ocioso.atividadeAtiva : espaco === 'secundaria' ? partida.ocioso.atividadeSecundaria : partida.ocioso.atividadeTerciaria;
  if (ativoOcioso) {
    const atividade = ATIVIDADES_OCIOSAS_INICIAIS.find(
      (candidato) => candidato.id === ativoOcioso.idDaDefinicaoDaAtividade,
    );
    if (!atividade) return null;
    const segundosPorAcao = segundosPorAcaoComPrioridade(atividade.segundosPorAcao, partida.ocioso.prioridade, espaco);
    return {
      titulo: `${rotulosDasProfissoes[atividade.idDaProfissao]} · ${atividade.nomeDoResultado}`,
      idDaProfissao: atividade.idDaProfissao,
      segundosPorAcao,
      ...estimativasBase(partida, atividade.idDaProfissao, segundosPorAcao, atividade.xpDeProfissaoPorAcao, 1, partida.ocioso.prioridade, espaco),
      segundosRestantes: ativoOcioso.segundosRestantes,
      processadoPorUltimoEm: ativoOcioso.processadoPorUltimoEm,
      proximoResultado: `+1 ${atividade.nomeDoResultado} · +${atividade.xpDeProfissaoPorAcao} XP base`,
    };
  }

  const receitaAtiva = espaco === 'principal' ? partida.fabricacao.receitaAtiva : espaco === 'secundaria' ? partida.fabricacao.receitaSecundaria : partida.fabricacao.receitaTerciaria;
  if (receitaAtiva) {
    const receita = RECEITAS_INICIAIS_DE_FABRICACAO.find(
      (candidato) => candidato.id === receitaAtiva.idDaDefinicaoDaReceita,
    );
    if (!receita) return null;
    const ingredientes = receita.ingredientes
      .map(
        (ingrediente) =>
          `${ingrediente.quantidade} ${rotuloPara(ingrediente.idDaDefinicao)}`,
      )
      .join(" + ");
    const saida =
      receita.saida.tipo === "item"
        ? `${receita.saida.quantidade} ${receita.saida.nome}`
        : receita.saida.tipo === "equipamento"
          ? `1 ${receita.saida.nome}`
          : receita.saida.nome;
    const segundosPorAcao = segundosPorAcaoComPrioridade(receita.segundosPorAcao, partida.fabricacao.prioridade, espaco);
    const quantidadePorAcao = receita.saida.tipo === 'item' ? receita.saida.quantidade : 1;
    return {
      titulo: `${rotulosDasProfissoes[receita.idDaProfissao]} · ${receita.nome}`,
      idDaProfissao: receita.idDaProfissao,
      segundosPorAcao,
      ...estimativasBase(partida, receita.idDaProfissao, segundosPorAcao, receita.xpDeProfissaoPorAcao, quantidadePorAcao, partida.fabricacao.prioridade, espaco),
      segundosRestantes: receitaAtiva.segundosRestantes,
      processadoPorUltimoEm: receitaAtiva.processadoPorUltimoEm,
      proximoResultado: `${ingredientes || "Materiais"} → ${saida} · +${receita.xpDeProfissaoPorAcao} XP base`,
    };
  }

  return null;
}


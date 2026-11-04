/** Modelo somente de apresentação: usa o mesmo relógio por espaço do domínio. */
import { ATIVIDADES_OCIOSAS_INICIAIS, RECEITAS_INICIAIS_DE_FABRICACAO } from '@paralaxe/conteudo'
import { segundosPorAcaoComPrioridade, type PartidaLocal, type IdDaProfissao } from '@paralaxe/dominio'
import { rotulosDosItens, rotulosDasProfissoes } from '../rotulosDoJogo'
export type EspacoDoTrabalho = 'principal' | 'secundaria' | 'terciaria'

type ProgressoDoTrabalho = {
  titulo: string;
  idDaProfissao: IdDaProfissao;
  segundosPorAcao: number;
  segundosRestantes: number;
  processadoPorUltimoEm: string;
  proximoResultado: string;
};

function rotuloPara(idDaDefinicao: string) {
  return rotulosDosItens[idDaDefinicao] ?? idDaDefinicao;
}

/** Uniformiza coleta e receita em um modelo de apresentação com duração, saldo de tempo e próximo resultado. */
export function obterProgressoDoTrabalho(partida: PartidaLocal, espaco: EspacoDoTrabalho = 'principal'): ProgressoDoTrabalho | null {
  const ativoOcioso = espaco === 'principal' ? partida.ocioso.atividadeAtiva : espaco === 'secundaria' ? partida.ocioso.atividadeSecundaria : partida.ocioso.atividadeTerciaria;
  if (ativoOcioso) {
    const atividade = ATIVIDADES_OCIOSAS_INICIAIS.find(
      (candidato) => candidato.id === ativoOcioso.idDaDefinicaoDaAtividade,
    );
    if (!atividade) return null;
    return {
      titulo: `${rotulosDasProfissoes[atividade.idDaProfissao]} · ${atividade.nomeDoResultado}`,
      idDaProfissao: atividade.idDaProfissao,
      segundosPorAcao: segundosPorAcaoComPrioridade(atividade.segundosPorAcao, partida.ocioso.prioridade, espaco),
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
    return {
      titulo: `${rotulosDasProfissoes[receita.idDaProfissao]} · ${receita.nome}`,
      idDaProfissao: receita.idDaProfissao,
      segundosPorAcao: segundosPorAcaoComPrioridade(receita.segundosPorAcao, partida.fabricacao.prioridade, espaco),
      segundosRestantes: receitaAtiva.segundosRestantes,
      processadoPorUltimoEm: receitaAtiva.processadoPorUltimoEm,
      proximoResultado: `${ingredientes || "Materiais"} → ${saida} · +${receita.xpDeProfissaoPorAcao} XP base`,
    };
  }

  return null;
}


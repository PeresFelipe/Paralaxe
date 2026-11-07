/**
 * @file Indicador visual do ciclo atual de coleta ou fabricação.
 * Interpola o tempo a partir da última referência salva para desenhar a barra e a contagem.
 * Não concede itens, experiência nem grava partidas: essa responsabilidade continua no domínio e em Aplicativo.
 */
import { useEffect, useMemo, useRef, useState } from "react";
import type { PartidaLocal } from "@paralaxe/dominio";
import { obterProgressoDoTrabalho, type EspacoDoTrabalho } from '@/services/visualizacaoDoTrabalho';
import { rotulosDasProfissoes } from '@/rotulosDoJogo';
import { formatarDuracao } from '@/services/formatarDuracao';
import estilos from "./IndicadorDeProgressoOcioso.module.css";

export type PropriedadesDeIndicadorDeProgressoOcioso = {
  partida: PartidaLocal;
  compacto?: boolean;
  pausado?: boolean;
  espaco?: EspacoDoTrabalho;
};

/** Apresenta o mesmo ciclo em versão completa ou compacta, podendo congelá-lo durante risco. */
export default function IndicadorDeProgressoOcioso({
  partida,
  compacto = false,
  pausado = false,
  espaco = "principal",
}: PropriedadesDeIndicadorDeProgressoOcioso) {
  const trabalho = useMemo(() => obterProgressoDoTrabalho(partida, espaco), [partida, espaco]);
  const [agoraMs, definirAgoraMs] = useState(() => Date.now());
  const preenchimentoReferencia = useRef<HTMLSpanElement>(null);
  const segundosPorAcao = trabalho?.segundosPorAcao ?? 1;
  const segundosRestantes = trabalho?.segundosRestantes ?? 0;
  const processadoPorUltimoEm = trabalho?.processadoPorUltimoEm;

  useEffect(() => {
    if (!processadoPorUltimoEm) return;
    const preenchimento = preenchimentoReferencia.current;
    const movimento = window.matchMedia("(prefers-reduced-motion: reduce)");
    let temporizador: number | undefined;
    let animacao: Animation | undefined;
    /** Calcula a fração dentro do ciclo pelo resto da divisão; o estado pausado ignora tempo novo decorrido. */
    const amostra = () => {
      const agora = Date.now();
      definirAgoraMs(agora);
      const decorrido = pausado
        ? 0
        : Math.max(0, (agora - Date.parse(processadoPorUltimoEm)) / 1000);
      return ((segundosRestantes + decorrido) % segundosPorAcao) / segundosPorAcao;
    };
    /** Cancela o intervalo de amostragem e a animação anterior antes de desmontar ou sincronizar novamente. */
    const parar = () => {
      window.clearInterval(temporizador);
      animacao?.cancel();
      animacao = undefined;
    };
    /** Ajusta a barra ao relógio e anima apenas quando a página está visível, sem pausa e sem redução de movimento. */
    const sincronizar = () => {
      parar();
      if (document.hidden) return;
      const fracao = amostra();
      if (preenchimento) preenchimento.style.transform = `scaleX(${fracao})`;
      if (!pausado && !movimento.matches && preenchimento?.animate) {
        animacao = preenchimento.animate(
          [{ transform: "scaleX(0)" }, { transform: "scaleX(1)" }],
          {
            duration: segundosPorAcao * 1000,
            iterations: Infinity,
            easing: "linear",
          },
        );
        // Retoma a animação no ponto correto do ciclo, em vez de voltar a zero após cada atualização da partida.
        animacao.currentTime = fracao * segundosPorAcao * 1000;
      }
      if (!pausado)
        temporizador = window.setInterval(() => {
          const posicao = amostra();
          if (!animacao && preenchimento) preenchimento.style.transform = `scaleX(${posicao})`;
        }, 1000);
    };
    sincronizar();
    // Ao voltar à aba, recalcula a posição a partir do horário; não tenta reproduzir todos os quadros que ficaram ocultos.
    document.addEventListener("visibilitychange", sincronizar);
    movimento.addEventListener("change", sincronizar);
    return () => {
      parar();
      document.removeEventListener("visibilitychange", sincronizar);
      movimento.removeEventListener("change", sincronizar);
    };
  }, [processadoPorUltimoEm, segundosPorAcao, segundosRestantes, pausado]);

  const classesDaRaiz = [
    estilos.raiz,
    "ocioso-progresso",
    compacto ? estilos.compacto : "",
    compacto ? "ocioso-progresso--compacto" : "",
    pausado ? estilos.pausado : "",
    pausado ? "ocioso-progresso--pausado" : "",
  ].filter(Boolean).join(" ");

  if (!trabalho) {
    return (
      <div
        className={`${classesDaRaiz} ${estilos.vazio} ocioso-progresso--vazio`}
      >
        <div className={`${estilos.titulo} ocioso-progressoTituloDaSecao`}>
          <span>
            <small>Atividade atual</small>
            <strong>Nenhuma atividade</strong>
          </span>
          {!compacto ? <em>Pronto para começar</em> : null}
        </div>
      </div>
    );
  }

  // Estes números alimentam a contagem e o valor acessível da barra; os ganhos reais não dependem dessa estimativa visual.
  const ultimoProcessadoMs = Date.parse(trabalho.processadoPorUltimoEm);
  const decorridoSegundos =
    !pausado && Number.isFinite(ultimoProcessadoMs)
      ? Math.max(0, (agoraMs - ultimoProcessadoMs) / 1000)
      : 0;
  const totalSegundos = trabalho.segundosRestantes + decorridoSegundos;
  const cicloPosicao = totalSegundos % trabalho.segundosPorAcao;
  const progresso = Math.min(
    100,
    Math.max(0, (cicloPosicao / trabalho.segundosPorAcao) * 100),
  );
  const faltam = Math.max(0, trabalho.segundosPorAcao - cicloPosicao);
  const profissao = partida.profissoes[trabalho.idDaProfissao];

  return (
    <div
      className={classesDaRaiz}
    >
      <div className={`${estilos.titulo} ocioso-progressoTituloDaSecao`}>
        <span>
          <small>Atividade atual</small>
          <strong>{trabalho.titulo}</strong>
        </span>
        <em>
          {pausado ? "Pausada durante risco" : `${Math.ceil(faltam)} s`}
        </em>
      </div>
      <div
        className={`${estilos.trilha} ocioso-progressoTrilha`}
        role="progressbar"
        aria-label={`Progresso do ciclo de ${trabalho.titulo}`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progresso)}
      >
        <span ref={preenchimentoReferencia} className={`${estilos.preenchimento} ocioso-progressoPreenchimento`} />
      </div>
      {!compacto ? (
        <>
          <div className={`${estilos.detalhes} ocioso-progressoDetalhes`}>
          <span>
            <small>Próxima conclusão</small>
            <strong>
              {pausado
                ? "Retoma ao voltar para um estado seguro"
                : trabalho.proximoResultado}
            </strong>
          </span>
          <span>
            <small>Habilidade em curso</small>
            <strong>
              {rotulosDasProfissoes[trabalho.idDaProfissao]} Nv. {profissao.nivel} · {profissao.xp} XP
            </strong>
          </span>
          <span>
            <small>Rendimento base estimado</small>
            <strong>{pausado ? 'Pausado' : `${trabalho.producaoBasePorHora.toLocaleString('pt-BR', { maximumFractionDigits: 1 })} un./h · ${trabalho.xpBasePorHora.toLocaleString('pt-BR', { maximumFractionDigits: 0 })} XP/h`}</strong>
          </span>
          <span>
            <small>Próximo nível (estimativa base)</small>
            <strong>{pausado ? 'Retoma ao sair do risco' : trabalho.segundosEstimadosParaProximoNivel === null ? 'Nível máximo' : `~${formatarDuracao(trabalho.segundosEstimadosParaProximoNivel)}`}</strong>
          </span>
        </div>
        <details className={estilos.explicacao}>
          <summary>Por que esta velocidade?</summary>
          <p>{trabalho.motivoDaPrioridade} As taxas são estimativas base, sem bônus temporários, materiais insuficientes ou inventário cheio.</p>
        </details>
        </>
      ) : null}
    </div>
  );
}


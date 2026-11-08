import { criarAcoesDaCidade } from '@/services/acoesDaCidade';
import { criarAcoesDeOficios } from '@/services/acoesDeOficios';
import { criarAcoesDoBanco } from "@/services/acoesDoBanco";
import { criarAcoesDoPersonagem } from '@/services/acoesDoPersonagem';
import {
  atualizarCodiceEDesafios,
  CLASSES_DE_PERSONAGEM,
  obterAvisoDeFabricacaoDaJornada,
  obterResumoDeRetornoDaJornada,
  PRESENTES_INICIAIS,
  VERSAO_DO_CONTEUDO
} from "@paralaxe/conteudo";
import {
  criarPartidaLocal,
  pausarTrabalhoAtualDuranteRisco,
  type IdDaClasseDoPersonagem,
  type IdDoPresente,
  type PartidaLocal
} from "@paralaxe/dominio";
import type { RepositorioDePartidasLocais } from "@paralaxe/interface";
import { useCallback, useEffect, useRef, useState } from "react";
import { criarFilaDeAlteracoesDaPartida,type AlteracaoDaPartida,type MensagemDaAlteracao } from "../services/alteracoesDaPartida";
import {
  atualizarPartidaNaLista,
  criarIdDaPartida,
  formatarAusencia,
  processarTrabalhoAtual,
} from "../services/partida";
import { obterDetalhesDoRetorno } from "../services/resumoDoRetorno";

type Tela = "carregando" | "partida-listar" | "criar" | "jogo" | "erro";
type ResumoDoPeriodoAusente = {
  duracao: string;
  resultado: string;
  meta: string | null;
  marco: string | null;
  detalhes: readonly string[];
};

export function useAplicativoDaPartida(repositorioDePartidas: RepositorioDePartidasLocais) {
  const [tela, definirTela] = useState<Tela>("carregando");
  const [partidas, definirPartidas] = useState<PartidaLocal[]>([]);
  const [partidaAtiva, definirAtivoPartida] = useState<PartidaLocal | null>(null);
  const [nomeDoPersonagem, definirPersonagemNome] = useState("");
  const [idDaClasseSelecionada, definirIdDaClasseSelecionada] =
    useState<IdDaClasseDoPersonagem | null>(null);
  const [selecionadoPresenteId, definirSelecionadoPresenteId] = useState<IdDoPresente | null>(null);
  const [criacaoPasso, definirCriacaoPasso] = useState(0);
  const [aviso, definirAviso] = useState<{
    textoExibido: string;
    tipo: "informacao" | "conquista";
  } | null>(null);
  const mensagem = aviso?.textoExibido ?? null;
  const [ultimoResultadoDoTrabalho, definirUltimoTrabalhoResultado] = useState<string | null>(null);
  const [ausenteResumo, definirAusenteResumo] = useState<ResumoDoPeriodoAusente | null>(
    null,
  );
  const [ehSalvando, definirEhSalvando] = useState(false);
  const [riscoAtivo, atualizarRiscoAtivo] = useState(false);
  const referenciaDeRisco = useRef(false);
  const definirRiscoAtivo = useCallback((ativo: boolean) => {
    referenciaDeRisco.current = ativo;
    atualizarRiscoAtivo(ativo);
  }, []);
  // A referência permite consultar a versão corrente dentro de Promises e intervalos, sem capturar uma renderização antiga.
  const referenciaDaPartidaAtiva = useRef<PartidaLocal | null>(null);
  const filaRef = useRef<ReturnType<typeof criarFilaDeAlteracoesDaPartida> | null>(null);
  if (!filaRef.current) filaRef.current = criarFilaDeAlteracoesDaPartida({
    obterAtual: () => referenciaDaPartidaAtiva.current,
    salvar: partida => repositorioDePartidas.salvar(partida),
    confirmar: partida => {
      referenciaDaPartidaAtiva.current = partida;
      definirAtivoPartida(partida);
      definirPartidas(anterior => atualizarPartidaNaLista(anterior, partida));
    },
  });
  const filaDeAlteracoes = filaRef.current;

  function definirMensagem(textoExibido: string | null) {
    definirAviso(textoExibido ? { textoExibido, tipo: "informacao" } : null);
  }

  /** Atualiza a referência síncrona e o estado de renderização juntos para ações assíncronas enxergarem a mesma partida. */
  function selecionarPartidaAtiva(partida: PartidaLocal | null) {
    referenciaDaPartidaAtiva.current = partida;
    definirAtivoPartida(partida);
  }

  // O processamento e as ações partem da última partida salva, em ordem.
  // Selecionar uma meta durante um ciclo não pode sobrescrever ingredientes ou conquistas.
  /**
   * Enfileira uma transformação sobre a versão mais recente da partida e só atualiza a tela após salvar.
   * Confere o ID capturado para uma ação antiga não atingir outro personagem selecionado depois.
   */
  function aplicarAlteracaoNaPartidaAtiva(
    atualizar: (atual: PartidaLocal) => PartidaLocal,
    textoExibido?: string | (() => string | undefined),
  ): Promise<PartidaLocal> {
    return filaDeAlteracoes.aplicar(
      atual => atualizarCodiceEDesafios(atualizar(atual)),
      (antes, proxima) => {
        const marco = obterAvisoDeFabricacaoDaJornada(antes, proxima);
        const informacao = typeof textoExibido === "function" ? textoExibido() : textoExibido;
        if (marco) definirAviso({ textoExibido: marco, tipo: "conquista" });
        else if (informacao) definirMensagem(informacao);
      },
    );
  }

  // A carga inicial escolhe a lista de partidas ou o assistente. A limpeza impede atualizar uma montagem já cancelada.
  useEffect(() => {
    let cancelado = false;

    repositorioDePartidas
      .listar()
      .then((armazenadoPartidas) => {
        if (cancelado) return;
        definirPartidas(armazenadoPartidas);
        definirTela(armazenadoPartidas.length > 0 ? "partida-listar" : "criar");
      })
      .catch((erro: unknown) => {
        if (cancelado) return;
        definirMensagem(
          erro instanceof Error
            ? erro.message
            : "Não foi possível carregar os partidas locais.",
        );
        definirTela("erro");
      });

    return () => {
      cancelado = true;
    };
  }, []);

  // O intervalo apenas solicita atualização a cada cinco segundos; as regras usam horários, não a quantidade de disparos.
  useEffect(() => {
    if (tela !== "jogo" || !partidaAtiva) return;
    if (riscoAtivo || partidaAtiva.masmorra.expedicaoAtiva || partidaAtiva.masmorra.incursaoAutomaticaAtiva) return;
    if (!partidaAtiva.ocioso.atividadeAtiva && !partidaAtiva.fabricacao.receitaAtiva)
      return;

    const temporizador = window.setInterval(() => {
      let resultado: ReturnType<typeof processarTrabalhoAtual> | null = null;
      void aplicarAlteracaoNaPartidaAtiva(
        (atual) => {
          // Um disparo já enfileirado pode sobreviver à limpeza do intervalo pelo React.
          if (referenciaDeRisco.current || atual.masmorra.expedicaoAtiva || atual.masmorra.incursaoAutomaticaAtiva) return atual;
          resultado = processarTrabalhoAtual(atual, new Date().toISOString());
          return resultado.partida;
        },
        () =>
          resultado &&
          !resultado.partida.ocioso.atividadeAtiva &&
          !resultado.partida.fabricacao.receitaAtiva
            ? (resultado.textoExibido ?? undefined)
            : undefined,
      )
        .then(() => {
          if (resultado?.textoExibido) definirUltimoTrabalhoResultado(resultado.textoExibido);
        })
        .catch((erro: unknown) => {
          definirMensagem(
            erro instanceof Error
              ? erro.message
              : "Não foi possível salvar o progresso da atividade.",
          );
        });
    }, 5000);

    return () => window.clearInterval(temporizador);
  }, [tela, partidaAtiva, riscoAtivo]);

  /** Comandos de telas recebem a versão corrente da fila, preservando alterações independentes. */
  async function persistirPartidaAtiva(alterar: AlteracaoDaPartida, textoExibido?: MensagemDaAlteracao) {
    try { return await aplicarAlteracaoNaPartidaAtiva(alterar, textoExibido); }
    catch (erro) {
      definirMensagem(erro instanceof Error ? erro.message : "Não foi possível salvar a alteração.");
      throw erro;
    }
  }

  /**
   * Bloqueia o processamento periódico, credita o trabalho pendente e congela seu relógio antes do encontro.
   * Se a gravação falhar, remove o bloqueio e propaga o erro ao componente que iniciou a ação.
   */
  async function prepararRisco() {
    if (!partidaAtiva) throw new Error("Nenhum personagem ativo.");
    definirRiscoAtivo(true);
    try {
      return await aplicarAlteracaoNaPartidaAtiva((atual) => {
        const agora = new Date().toISOString();
        return pausarTrabalhoAtualDuranteRisco(
          processarTrabalhoAtual(atual, agora).partida,
          agora,
        );
      });
    } catch (erro) {
      definirRiscoAtivo(false);
      throw erro;
    }
  }

  /** Resolve classe e presente pelo catálogo, constrói a partida no domínio e só entra no jogo após salvá-la. */
  async function tratarCriarPartida() {
    const classeDoPersonagem = CLASSES_DE_PERSONAGEM.find(
      (definicao) => definicao.id === idDaClasseSelecionada,
    );
    const presente = PRESENTES_INICIAIS.find(
      (definicao) => definicao.id === selecionadoPresenteId,
    );
    if (!classeDoPersonagem || !presente || !nomeDoPersonagem.trim()) return;

    definirEhSalvando(true);
    definirMensagem(null);

    try {
      const agora = new Date().toISOString();
      const partida = atualizarCodiceEDesafios(criarPartidaLocal({
        idDaPartida: criarIdDaPartida(),
        criadoEm: agora,
        versaoDoConteudo: VERSAO_DO_CONTEUDO,
        nomeDoPersonagem,
        classeDoPersonagem,
        presente,
      }));
      await repositorioDePartidas.salvar(partida);
      definirPartidas((atual) => [partida, ...atual]);
      selecionarPartidaAtiva(partida);
      definirRiscoAtivo(false);
      definirAusenteResumo(null);
      definirTela("jogo");
    } catch (erro) {
      definirMensagem(
        erro instanceof Error
          ? erro.message
          : "Não foi possível criar o partida.",
      );
    } finally {
      definirEhSalvando(false);
    }
  }

  /**
   * Espera gravações anteriores, relê a partida e processa a ausência antes de mostrar o resumo.
   * Expedições em andamento retomam seu estado persistido sem gerar trabalho seguro durante a ausência.
   */
  async function tratarCarregarPartida(idDaPartida: string) {
    definirMensagem(null);
    definirAusenteResumo(null);
    definirUltimoTrabalhoResultado(null);
    try {
      await filaDeAlteracoes.aguardar();
      const partidaLida = await repositorioDePartidas.obter(idDaPartida);
      if (!partidaLida) {
        definirMensagem("Esse partida não foi encontrado no armazenamento local.");
        return;
      }

      const armazenado = atualizarCodiceEDesafios(partidaLida)

      if (armazenado.masmorra.expedicaoAtiva || armazenado.masmorra.incursaoAutomaticaAtiva) {
        if (armazenado !== partidaLida) await repositorioDePartidas.salvar(armazenado)
        selecionarPartidaAtiva(armazenado);
        definirPartidas((atual) => atualizarPartidaNaLista(atual, armazenado));
        definirRiscoAtivo(true);
        definirMensagem(
          armazenado.masmorra.incursaoAutomaticaAtiva
            ? "Incursão Automática em andamento. Seu progresso foi preservado."
            : "Expedição em Dún Liath em andamento. Retome do ponto em que parou.",
        );
        definirTela("jogo");
        return;
      }

      const agora = new Date().toISOString();
      const ausencia = Date.parse(agora) - Date.parse(armazenado.atualizadoEm);
      const resultado = processarTrabalhoAtual(armazenado, agora);
      const partidaProcessada = atualizarCodiceEDesafios(resultado.partida)
      await repositorioDePartidas.salvar(partidaProcessada);
      definirPartidas((atual) => atualizarPartidaNaLista(atual, partidaProcessada));
      selecionarPartidaAtiva(partidaProcessada);
      definirRiscoAtivo(false);
      definirTela("jogo");

      // Os ganhos já foram gravados acima. O botão Continuar do resumo apenas fecha a apresentação, sem concedê-los novamente.
      if (resultado.textoExibido && ausencia >= 60_000) {
        definirAusenteResumo({
          duracao: formatarAusencia(ausencia),
          resultado: resultado.textoExibido,
          meta: obterResumoDeRetornoDaJornada(armazenado, partidaProcessada),
          marco: obterAvisoDeFabricacaoDaJornada(armazenado, partidaProcessada),
          detalhes: obterDetalhesDoRetorno(armazenado, partidaProcessada, ausencia, resultado.textoExibido),
        });
      } else if (resultado.textoExibido) {
        const marco = obterAvisoDeFabricacaoDaJornada(armazenado, partidaProcessada);
        definirAviso({
          textoExibido: marco ?? resultado.textoExibido,
          tipo: marco ? "conquista" : "informacao",
        });
      }
    } catch (erro) {
      definirMensagem(
        erro instanceof Error
          ? erro.message
          : "Não foi possível carregar o partida.",
      );
    }
  }

  const portasDasAcoes = {
    persistir: persistirPartidaAtiva,
    agora: () => new Date().toISOString(),
    estaEmRisco: () => referenciaDeRisco.current,
  };
  const {
    tratarIniciarAtividade, tratarIniciarAtividadeSecundaria, tratarIniciarAtividadeTerciaria,
    tratarPararAtividadeTerciaria, tratarPararAtividadeSecundaria,
    tratarIniciarReceitaSecundaria, tratarIniciarReceitaTerciaria,
    tratarPararReceitaTerciaria, tratarPararReceitaSecundaria,
    tratarResponderMinigame, tratarAlterarPrioridadeDeOficio,
    tratarIniciarReceita, tratarPararTrabalho, tratarPrestigiarProfissao,
  } = criarAcoesDeOficios(portasDasAcoes);
  const { tratarConcluirProjeto, tratarComprarOfertaDoMercado } = criarAcoesDaCidade(portasDasAcoes);
  const {
    tratarEscolherJornadaMeta, tratarEquipar, tratarDistribuirAtributos,
    tratarDesbloquearPrestigioNo, tratarRealizarPersonagemPrestigio,
  } = criarAcoesDoPersonagem(portasDasAcoes);

  const { tratarDepositarBancoPilha, tratarRetirarBancoPilha,
    tratarDepositarBancoEquipamento, tratarRetirarBancoEquipamento } =
    criarAcoesDoBanco(persistirPartidaAtiva, definirMensagem);

  /** Limpa somente as escolhas transitórias do assistente; criar outro personagem não remove partidas existentes. */
  function iniciarNovoPartida() {
    definirPersonagemNome("");
    definirIdDaClasseSelecionada(null);
    definirSelecionadoPresenteId(null);
    definirCriacaoPasso(0);
    definirMensagem(null);
    definirAusenteResumo(null);
    definirRiscoAtivo(false);
    definirTela("criar");
  }

  /** Sai da seleção atual e retorna à lista, limpando mensagens e contexto transitório de risco. */
  function alternarPartida() {
    selecionarPartidaAtiva(null);
    definirUltimoTrabalhoResultado(null);
    definirAusenteResumo(null);
    definirRiscoAtivo(false);
    definirMensagem(null);
    definirTela("partida-listar");
  }


  return {
    tela,
    definirTela,
    partidas,
    definirPartidas,
    partidaAtiva,
    definirAtivoPartida,
    nomeDoPersonagem,
    definirPersonagemNome,
    idDaClasseSelecionada,
    definirIdDaClasseSelecionada,
    selecionadoPresenteId,
    definirSelecionadoPresenteId,
    criacaoPasso,
    definirCriacaoPasso,
    aviso,
    mensagem,
    definirMensagem,
    ultimoResultadoDoTrabalho,
    definirUltimoTrabalhoResultado,
    ausenteResumo,
    definirAusenteResumo,
    ehSalvando,
    riscoAtivo,
    definirRiscoAtivo,
    tratarCriarPartida,
    tratarCarregarPartida,
    tratarIniciarAtividade,
    tratarIniciarAtividadeSecundaria,
    tratarPararAtividadeSecundaria,
    tratarIniciarAtividadeTerciaria,
    tratarPararAtividadeTerciaria,
    tratarIniciarReceita,
    tratarIniciarReceitaSecundaria,
    tratarPararReceitaSecundaria,
    tratarIniciarReceitaTerciaria,
    tratarPararReceitaTerciaria,
    tratarAlterarPrioridadeDeOficio,
    tratarResponderMinigame,
    tratarPararTrabalho,
    tratarPrestigiarProfissao,
    tratarConcluirProjeto,
    tratarComprarOfertaDoMercado,
    tratarEscolherJornadaMeta,
    tratarEquipar,
    tratarDistribuirAtributos,
    tratarDesbloquearPrestigioNo,
    tratarRealizarPersonagemPrestigio,
    tratarDepositarBancoPilha,
    tratarRetirarBancoPilha,
    tratarDepositarBancoEquipamento,
    tratarRetirarBancoEquipamento,
    persistirPartidaAtiva,
    prepararRisco,
    iniciarNovoPartida,
    alternarPartida,
  };
}

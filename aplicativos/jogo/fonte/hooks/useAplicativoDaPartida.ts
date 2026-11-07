import { mensagensDeErroDaInterface } from "@/rotulosDaInterface";
import { criarAcoesDoBanco } from "@/services/acoesDoBanco";
import {
  atualizarCodiceEDesafios,
  CLASSES_DE_PERSONAGEM,
  obterAvisoDeFabricacaoDaJornada,
  obterDefinicaoDeAtividadeOciosa,
  obterDefinicaoDeEquipamento,
  obterDefinicaoDeReceitaDeFabricacao,
  obterProjetoDaCidade,
  obterResumoDeRetornoDaJornada,
  OFERTAS_INICIAIS_DO_MERCADO_DE_PNJ,
  PRESENTES_INICIAIS,
  VERSAO_DO_CONTEUDO,
} from "@paralaxe/conteudo";
import {
  comprarOfertaDoMercadoDePnj,
  concluirProjeto,
  configurarPrioridadeDaColeta,
  configurarPrioridadeDaFabricacao,
  criarPartidaLocal,
  desbloquearNoDePrestigioDoPersonagem,
  distribuirPontosDeAtributo,
  equiparItem,
  escolherMetaDaJornada,
  iniciarAtividadeOciosa,
  iniciarAtividadeSecundaria,
  iniciarAtividadeTerciaria,
  iniciarReceitaDeFabricacao,
  iniciarReceitaSecundaria,
  iniciarReceitaTerciaria,
  interromperAtividadeOciosa,
  interromperAtividadeSecundaria,
  interromperAtividadeTerciaria,
  interromperReceitaDeFabricacao,
  interromperReceitaSecundaria,
  interromperReceitaTerciaria,
  pausarTrabalhoAtualDuranteRisco,
  realizarPrestigioDaProfissao,
  realizarPrestigioDoPersonagem,
  responderMinigameDeOficio,
  type DistribuicaoDeAtributos,
  type IdDaClasseDoPersonagem,
  type IdDaProfissao,
  type IdDoPresente,
  type PartidaLocal,
  type PrioridadeDeOficio
} from "@paralaxe/dominio";
import type { RepositorioDePartidasLocais } from "@paralaxe/interface";
import { useCallback, useEffect, useRef, useState } from "react";
import { criarFilaDeAlteracoesDaPartida, type AlteracaoDaPartida, type MensagemDaAlteracao } from "../services/alteracoesDaPartida";
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
  function persistirPartidaAtiva(alterar: AlteracaoDaPartida, textoExibido?: MensagemDaAlteracao) {
    return aplicarAlteracaoNaPartidaAtiva(alterar, textoExibido);
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

  /** Credita o trabalho anterior até agora, encerra sua seleção e inicia a nova coleta na mesma atualização. */
  async function tratarIniciarAtividade(idDaDefinicaoDaAtividade: string) {
    if (!partidaAtiva) return;
    const atividade = obterDefinicaoDeAtividadeOciosa(idDaDefinicaoDaAtividade);
    if (!atividade) return;

    try {
      await aplicarAlteracaoNaPartidaAtiva((atual) => {
        const agora = new Date().toISOString();
        let partida = processarTrabalhoAtual(atual, agora).partida;
        if (partida.fabricacao.receitaAtiva) partida = interromperReceitaDeFabricacao(partida, agora);
        if (partida.ocioso.atividadeAtiva) partida = interromperAtividadeOciosa(partida, agora);
        return iniciarAtividadeOciosa(partida, atividade, agora);
      }, `${atividade.nomeDoResultado} agora é sua atividade automática.`);
    } catch (erro) {
      definirMensagem(
        erro instanceof Error
          ? erro.message
          : "Não foi possível iniciar a atividade.",
      );
    }
  }

  /** O segundo relógio só existe após o Prestígio I da profissão principal. */
  async function tratarIniciarAtividadeSecundaria(id: string) {
    const atividade = obterDefinicaoDeAtividadeOciosa(id)
    if (!atividade) throw new Error('Recurso não encontrado.')
    await aplicarAlteracaoNaPartidaAtiva(atual => {
      const agora = new Date().toISOString()
      return iniciarAtividadeSecundaria(processarTrabalhoAtual(atual, agora).partida, atividade, agora)
    }, `Coleta secundária iniciada: ${atividade.nomeDoResultado}.`)
  }

  async function tratarIniciarAtividadeTerciaria(id: string) {
    const atividade = obterDefinicaoDeAtividadeOciosa(id)
    if (!atividade) throw new Error('Recurso indisponível.')
    await aplicarAlteracaoNaPartidaAtiva(atual => {
      const agora = new Date().toISOString()
      return iniciarAtividadeTerciaria(processarTrabalhoAtual(atual, agora).partida, atividade, agora)
    }, 'Terceira coleta iniciada.')
  }
  async function tratarPararAtividadeTerciaria() {
    await aplicarAlteracaoNaPartidaAtiva(atual => {
      const agora = new Date().toISOString()
      return interromperAtividadeTerciaria(processarTrabalhoAtual(atual, agora).partida, agora)
    }, 'Terceira coleta interrompida.')
  }

  async function tratarPararAtividadeSecundaria() {
    await aplicarAlteracaoNaPartidaAtiva(atual => {
      const agora = new Date().toISOString()
      return interromperAtividadeSecundaria(processarTrabalhoAtual(atual, agora).partida, agora)
    }, 'Coleta secundária interrompida.')
  }

  /** Prestígio I: segunda linha de produção, mantendo a primeira em execução. */
  async function tratarIniciarReceitaSecundaria(id: string) {
    await aplicarAlteracaoNaPartidaAtiva(atual => {
      const agora = new Date().toISOString()
      const partida = processarTrabalhoAtual(atual, agora).partida
      const principalId = partida.fabricacao.receitaAtiva?.idDaDefinicaoDaReceita
      const principal = principalId ? obterDefinicaoDeReceitaDeFabricacao(principalId) : null
      const secundaria = obterDefinicaoDeReceitaDeFabricacao(id)
      if (!principal || !secundaria) throw new Error('Receita principal ou secundária indisponível.')
      return iniciarReceitaSecundaria(partida, principal, secundaria, agora)
    }, 'Produção secundária iniciada.')
  }

  async function tratarIniciarReceitaTerciaria(id: string) {
    await aplicarAlteracaoNaPartidaAtiva(atual => {
      const agora = new Date().toISOString()
      const partida = processarTrabalhoAtual(atual, agora).partida
      const a = partida.fabricacao.receitaAtiva?.idDaDefinicaoDaReceita
      const b = partida.fabricacao.receitaSecundaria?.idDaDefinicaoDaReceita
      const principal = a ? obterDefinicaoDeReceitaDeFabricacao(a) : null
      const secundaria = b ? obterDefinicaoDeReceitaDeFabricacao(b) : null
      const terceira = obterDefinicaoDeReceitaDeFabricacao(id)
      if (!principal || !secundaria || !terceira) throw new Error('Selecione duas receitas antes da terceira.')
      return iniciarReceitaTerciaria(partida, principal, secundaria, terceira, agora)
    }, 'Terceira produção iniciada.')
  }
  async function tratarPararReceitaTerciaria() {
    await aplicarAlteracaoNaPartidaAtiva(atual => {
      const agora = new Date().toISOString()
      return interromperReceitaTerciaria(processarTrabalhoAtual(atual, agora).partida, agora)
    }, 'Terceira produção interrompida.')
  }

  async function tratarPararReceitaSecundaria() {
    await aplicarAlteracaoNaPartidaAtiva(atual => {
      const agora = new Date().toISOString()
      return interromperReceitaSecundaria(processarTrabalhoAtual(atual, agora).partida, agora)
    }, 'Produção secundária interrompida.')
  }

  /** O desafio opcional é resolvido sem prejudicar o progresso ocioso. */
  async function tratarResponderMinigame(id: IdDaProfissao, resposta: number) {
    if (riscoAtivo) throw new Error('Minigame indisponível durante combate.')
    let acertou = false
    await aplicarAlteracaoNaPartidaAtiva(atual => {
      const agora = new Date().toISOString()
      const anterior = processarTrabalhoAtual(atual, agora).partida
      const resultado = responderMinigameDeOficio(anterior, id, resposta, agora)
      acertou = resultado.acertou
      return resultado.partida
    }, () => acertou ? 'Minigame concluído: +4 XP por ciclo nos próximos minutos.' : 'Desafio encerrado; o trabalho automático continua normalmente.')
  }

  /** Prestígio II: processa o saldo antes de mudar a distribuição de produtividade. */
  async function tratarAlterarPrioridadeDeOficio(prioridade: PrioridadeDeOficio) {
    await aplicarAlteracaoNaPartidaAtiva(atual => {
      const agora = new Date().toISOString()
      const pronto = processarTrabalhoAtual(atual, agora).partida
      if (pronto.ocioso.atividadeAtiva) return configurarPrioridadeDaColeta(pronto, prioridade, agora)
      const id = pronto.fabricacao.receitaAtiva?.idDaDefinicaoDaReceita
      const receita = id ? obterDefinicaoDeReceitaDeFabricacao(id) : null
      if (receita) return configurarPrioridadeDaFabricacao(pronto, receita, prioridade, agora)
      throw new Error('Não há trabalho ativo para configurar.')
    }, 'Prioridade da atividade atualizada.')
  }

  /** Troca o trabalho atual por uma receita, preservando o progresso já acumulado e repassando o alvo de reforço. */
  async function tratarIniciarReceita(
    idDaDefinicaoDaReceita: string,
    idDaInstanciaDoEquipamentoAlvo: string | null = null,
  ) {
    if (!partidaAtiva) return;
    const receita = obterDefinicaoDeReceitaDeFabricacao(idDaDefinicaoDaReceita);
    if (!receita) return;

    try {
      await aplicarAlteracaoNaPartidaAtiva((atual) => {
        const agora = new Date().toISOString();
        let partida = processarTrabalhoAtual(atual, agora).partida;
        if (partida.ocioso.atividadeAtiva) partida = interromperAtividadeOciosa(partida, agora);
        if (partida.fabricacao.receitaAtiva) partida = interromperReceitaDeFabricacao(partida, agora);
        return iniciarReceitaDeFabricacao(
          partida,
          receita,
          agora,
          idDaInstanciaDoEquipamentoAlvo,
        );
      }, `${receita.nome} iniciado. A atividade anterior foi substituída.`);
    } catch (erro) {
      definirMensagem(
        erro instanceof Error
          ? erro.message
          : "Não foi possível iniciar a produção.",
      );
    }
  }

  /** Processa os ciclos completos pendentes antes de limpar a coleta ou receita selecionada. */
  async function tratarPararTrabalho() {
    if (!partidaAtiva) return;
    await aplicarAlteracaoNaPartidaAtiva((atual) => {
      const agora = new Date().toISOString();
      let partida = processarTrabalhoAtual(atual, agora).partida;
      if (partida.ocioso.atividadeAtiva) partida = interromperAtividadeOciosa(partida, agora);
      if (partida.fabricacao.receitaAtiva) partida = interromperReceitaDeFabricacao(partida, agora);
      return partida;
    }, "Atividade interrompida.");
  }

  async function tratarPrestigiarProfissao(idDaProfissao: IdDaProfissao) {
    await aplicarAlteracaoNaPartidaAtiva((atual) => realizarPrestigioDaProfissao(atual, idDaProfissao, new Date().toISOString()), 'Prestígio do ofício realizado; ele voltou ao nível 1.')
  }

  /** Conquista validada e recursos consumidos na mesma fila das ações do RPG. */
  async function tratarConcluirProjeto(idDoProjeto: string) {
    const projeto = obterProjetoDaCidade(idDoProjeto)
    if (!projeto) throw new Error('Projeto de reconstrução desconhecido.')
    await aplicarAlteracaoNaPartidaAtiva(
      atual => concluirProjeto(atual, projeto, new Date().toISOString()),
      `Construção restaurada: ${projeto.nome}.`,
    )
  }

  async function tratarComprarOfertaDoMercado(idDaOferta: string) {
    const oferta = OFERTAS_INICIAIS_DO_MERCADO_DE_PNJ.find(item => item.id === idDaOferta)
    if (!oferta) throw new Error('Oferta do Mercado desconhecida.')
    await aplicarAlteracaoNaPartidaAtiva(
      atual => comprarOfertaDoMercadoDePnj(atual, oferta, new Date().toISOString()),
      `${oferta.nome} comprado por ${oferta.preco} moedas.`,
    )
  }

  /** Valida a receita e registra o acompanhamento após atualizar o trabalho; escolher a meta não o substitui. */
  async function tratarEscolherJornadaMeta(idDaReceita: string | null) {
    if (riscoAtivo)
      throw new Error("Escolha sua meta após retornar a um lugar seguro.");
    const receita = idDaReceita ? obterDefinicaoDeReceitaDeFabricacao(idDaReceita) : null;
    if (idDaReceita && !receita) throw new Error("Receita não encontrada.");
    await aplicarAlteracaoNaPartidaAtiva((atual) => {
      const agora = new Date().toISOString();
      return escolherMetaDaJornada(
        processarTrabalhoAtual(atual, agora).partida,
        receita,
        agora,
      );
    });
  }

  /** Resolve a definição da instância selecionada e aplica a troca pelo domínio, exibindo sucesso ou erro. */
  async function tratarEquipar(idDaInstancia: string) {
    if (!partidaAtiva) return;
    const instancia = partidaAtiva.personagem.itensDeEquipamento.find(
      (item) => item.idDaInstancia === idDaInstancia,
    );
    if (!instancia) return;
    const definicao = obterDefinicaoDeEquipamento(instancia.idDaDefinicao);
    if (!definicao) return;

    try {
      await aplicarAlteracaoNaPartidaAtiva(
        (atual) =>
          (() => {
            const agora = new Date().toISOString();
            // Fecha o período anterior com a ferramenta anteriormente equipada;
            // novas ferramentas não podem conceder XP retroativo.
            const atualizado = processarTrabalhoAtual(atual, agora).partida;
            return equiparItem(atualizado, idDaInstancia, definicao, agora);
          })(),
        `${definicao.nome} equipado.`,
      );
    } catch (erro) {
      definirMensagem(
        erro instanceof Error
          ? erro.message
          : mensagensDeErroDaInterface.equiparItem,
      );
    }
  }

  /** Confirma a proposta no domínio e na persistência; propaga falhas para o painel conservar sua proposta. */
  async function tratarDistribuirAtributos(distribuicao: DistribuicaoDeAtributos) {
    if (!partidaAtiva) return;

    try {
      await aplicarAlteracaoNaPartidaAtiva(
        (atual) =>
          distribuirPontosDeAtributo(
            atual,
            distribuicao,
            new Date().toISOString(),
          ),
        "Distribuição de atributos confirmada.",
      );
    } catch (erro) {
      definirMensagem(
        erro instanceof Error
          ? erro.message
          : "Não foi possível distribuir os pontos de atributo.",
      );
      throw erro;
    }
  }

  /** Executa a compra do nó com as validações e custos definidos pelo domínio. */
  async function tratarDesbloquearPrestigioNo(noId: string) {
    if (!partidaAtiva) return;

    try {
      await aplicarAlteracaoNaPartidaAtiva(
        (atual) =>
          desbloquearNoDePrestigioDoPersonagem(
            atual,
            noId,
            new Date().toISOString(),
          ),
        "Nó de Prestígio desbloqueado.",
      );
    } catch (erro) {
      definirMensagem(
        erro instanceof Error
          ? erro.message
          : "Não foi possível desbloquear o nó de Prestígio.",
      );
    }
  }

  /** Busca os atributos originais da classe para o reinício de prestígio e persiste a nova etapa. */
  async function tratarRealizarPersonagemPrestigio() {
    if (!partidaAtiva) return;

    const classeDoPersonagem = CLASSES_DE_PERSONAGEM.find(
      (definicao) => definicao.id === partidaAtiva.personagem.idDaClasse,
    );
    if (!classeDoPersonagem) {
      definirMensagem(
        "A classe deste personagem não foi encontrada no catálogo atual.",
      );
      return;
    }

    try {
      await aplicarAlteracaoNaPartidaAtiva(
        (atual) =>
          realizarPrestigioDoPersonagem(
            atual,
            classeDoPersonagem.atributos,
            new Date().toISOString(),
          ),
        "Prestígio realizado. A nova jornada começa no nível 1.",
      );
    } catch (erro) {
      definirMensagem(
        erro instanceof Error
          ? erro.message
          : "Não foi possível realizar o Prestígio do personagem.",
      );
    }
  }

  const { tratarDepositarBancoPilha, tratarRetirarBancoPilha,
    tratarDepositarBancoEquipamento, tratarRetirarBancoEquipamento } =
    criarAcoesDoBanco(aplicarAlteracaoNaPartidaAtiva, definirMensagem);

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

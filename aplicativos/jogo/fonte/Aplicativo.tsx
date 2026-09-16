import {
  CLASSES_DE_PERSONAGEM,
  VERSAO_DO_CONTEUDO,
  PRESENTES_INICIAIS,
  obterDefinicaoDeReceitaDeFabricacao,
  obterDefinicaoDeEquipamento,
  obterDefinicaoDeAtividadeOciosa,
  obterAvisoDeFabricacaoDaJornada,
  obterResumoDeRetornoDaJornada,
} from "@greywake/conteudo";
import {
  MODO_DA_PARTIDA,
  distribuirPontosDeAtributo,
  escolherMetaDaJornada,
  criarPartidaLocal,
  depositarEquipamentoNoBanco,
  depositarPilhaDoInventarioNoBanco,
  equiparItem,
  pausarTrabalhoAtualDuranteRisco,
  realizarPrestigioDoPersonagem,
  processarProgressoDeFabricacao,
  processarProgressoOcioso,
  iniciarReceitaDeFabricacao,
  iniciarAtividadeOciosa,
  interromperReceitaDeFabricacao,
  interromperAtividadeOciosa,
  desbloquearNoDePrestigioDoPersonagem,
  retirarEquipamentoDoBanco,
  retirarPilhaDoBancoParaInventario,
  type DistribuicaoDeAtributos,
  type IdDaClasseDoPersonagem,
  type IdDoPresente,
  type PartidaLocal,
} from "@greywake/dominio";
import { criarRepositorioDePartidasIndexedDb } from "@greywake/persistencia";
import { useEffect, useRef, useState } from "react";
import CreditosDosRecursos from "./CreditosDosRecursos";
import IconeDoJogo from "./IconeDoJogo";
import EstruturaDoJogo from "./EstruturaDoJogo";
import EstadoDoJogoWeb from "./EstadoDoJogoWeb";

const GIFS_DAS_CLASSES: Partial<Record<IdDaClasseDoPersonagem, string>> = {
  guerreiro: "/arte/classes/guerreiro/MattzArt/guerreiro.gif",
  mago: "/arte/classes/mago/LuizMelo/mago.gif",
};

const repositorioDePartidas = criarRepositorioDePartidasIndexedDb();

type Tela = "carregando" | "partida-listar" | "criar" | "jogo" | "erro";
type ResumoDoPeriodoAusente = {
  duracao: string;
  resultado: string;
  meta: string | null;
  marco: string | null;
};

function obterNomeDaClasse(idDaClasse: IdDaClasseDoPersonagem) {
  return (
    CLASSES_DE_PERSONAGEM.find((definicao) => definicao.id === idDaClasse)?.nome ??
    idDaClasse
  );
}

function obterNomeDoPresente(idDoPresente: IdDoPresente) {
  return (
    PRESENTES_INICIAIS.find((definicao) => definicao.id === idDoPresente)?.nome ?? idDoPresente
  );
}

function atualizarPartidaNaLista(partidas: PartidaLocal[], partida: PartidaLocal) {
  return partidas.map((atual) =>
    atual.idDaPartida === partida.idDaPartida ? partida : atual,
  );
}

function criarIdDaPartida() {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }

  return `partida-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function formatarAusencia(milissegundos: number) {
  const segundos = Math.max(0, Math.floor(milissegundos / 1000));
  const horas = Math.floor(segundos / 3600);
  const minutos = Math.floor((segundos % 3600) / 60);
  if (horas > 0) return `${horas}h ${minutos}min`;
  if (minutos > 0) return `${minutos}min`;
  return `${segundos}s`;
}

function processarTrabalhoAtual(partida: PartidaLocal, agora: string) {
  // A masmorra ativa é um estado de risco persistido. O trabalho ocioso selecionado
  // permanece como referência de continuidade, sem acumular tempo durante a expedição.
  if (partida.masmorra.expedicaoAtiva) return { partida, textoExibido: null };

  const ativoOciosoId = partida.ocioso.atividadeAtiva?.idDaDefinicaoDaAtividade;
  if (ativoOciosoId) {
    const atividade = obterDefinicaoDeAtividadeOciosa(ativoOciosoId);
    if (atividade) {
      const resultado = processarProgressoOcioso(partida, atividade, agora);
      const nivelTextoExibido =
        resultado.niveisDeProfissaoGanhos > 0
          ? ` · +${resultado.niveisDeProfissaoGanhos} nível(is) de Profissão`
          : "";
      const limitadoTextoExibido =
        resultado.segundosLimitados > 0 ? " · limite sem conexão atingido" : "";
      const capacidadeTextoExibido = resultado.interrompidoPorCapacidade
        ? " · Inventário sem capacidade; coleta interrompida"
        : "";
      return {
        partida: resultado.partida,
        textoExibido:
          resultado.acoesConcluidas > 0
            ? `+${resultado.acoesConcluidas} ${atividade.nomeDoResultado} · +${resultado.xpDeProfissaoConcedido} XP de Profissão${nivelTextoExibido}${limitadoTextoExibido}${capacidadeTextoExibido}`
            : resultado.interrompidoPorCapacidade
              ? `${atividade.nome} foi interrompida: Inventário sem capacidade.`
              : null,
      };
    }
  }

  const ativoReceitaId = partida.fabricacao.receitaAtiva?.idDaDefinicaoDaReceita;
  if (ativoReceitaId) {
    const receita = obterDefinicaoDeReceitaDeFabricacao(ativoReceitaId);
    if (receita) {
      const resultado = processarProgressoDeFabricacao(partida, receita, agora);
      const totalSaida =
        resultado.itensProduzidos +
        resultado.equipamentosProduzidos +
        resultado.equipamentosReforcados;
      const interrompidoTextoExibido = resultado.interrompidoPorMateriais
        ? " · produção interrompida por materiais insuficientes"
        : "";
      const capacidadeTextoExibido = resultado.interrompidoPorCapacidade
        ? " · produção interrompida por Inventário sem capacidade"
        : "";
      return {
        partida: resultado.partida,
        textoExibido:
          resultado.acoesConcluidas > 0
            ? `${receita.nome}: ${totalSaida || resultado.acoesConcluidas} concluído(s) · +${resultado.xpDeProfissaoConcedido} XP de Profissão${interrompidoTextoExibido}${capacidadeTextoExibido}`
            : resultado.interrompidoPorMateriais
              ? `${receita.nome} foi interrompida por materiais insuficientes.`
              : resultado.interrompidoPorCapacidade
                ? `${receita.nome} foi interrompida: Inventário sem capacidade.`
                : null,
      };
    }
  }

  return { partida, textoExibido: null };
}

function Aplicativo() {
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
  const [riscoAtivo, definirRiscoAtivo] = useState(false);
  const referenciaDaPartidaAtiva = useRef<PartidaLocal | null>(null);
  const gravarFila = useRef<Promise<void>>(Promise.resolve());

  function definirMensagem(textoExibido: string | null) {
    definirAviso(textoExibido ? { textoExibido, tipo: "informacao" } : null);
  }

  function selecionarPartidaAtiva(partida: PartidaLocal | null) {
    referenciaDaPartidaAtiva.current = partida;
    definirAtivoPartida(partida);
  }

  // O processamento e as ações partem da última partida salva, em ordem.
  // Selecionar uma meta durante um ciclo não pode sobrescrever ingredientes ou conquistas.
  function aplicarAlteracaoNaPartidaAtiva(
    atualizar: (atual: PartidaLocal) => PartidaLocal,
    textoExibido?: string | (() => string | undefined),
  ): Promise<PartidaLocal> {
    const idDaPartida = referenciaDaPartidaAtiva.current?.idDaPartida;
    const tarefa = gravarFila.current.then(async () => {
      const atual = referenciaDaPartidaAtiva.current;
      if (!atual || atual.idDaPartida !== idDaPartida)
        throw new Error("O personagem ativo mudou. Tente novamente.");
      const proximo = atualizar(atual);
      if (proximo === atual) return atual;
      await repositorioDePartidas.salvar(proximo);
      if (referenciaDaPartidaAtiva.current?.idDaPartida === idDaPartida) {
        selecionarPartidaAtiva(proximo);
        definirPartidas((anterior) => atualizarPartidaNaLista(anterior, proximo));
        const marco = obterAvisoDeFabricacaoDaJornada(atual, proximo);
        const informacao = typeof textoExibido === "function" ? textoExibido() : textoExibido;
        if (marco) definirAviso({ textoExibido: marco, tipo: "conquista" });
        else if (informacao) definirMensagem(informacao);
      }
      return proximo;
    });
    gravarFila.current = tarefa.then(
      () => undefined,
      () => undefined,
    );
    return tarefa;
  }

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

  useEffect(() => {
    if (tela !== "jogo" || !partidaAtiva) return;
    if (riscoAtivo || partidaAtiva.masmorra.expedicaoAtiva) return;
    if (!partidaAtiva.ocioso.atividadeAtiva && !partidaAtiva.fabricacao.receitaAtiva)
      return;

    const temporizador = window.setInterval(() => {
      let resultado: ReturnType<typeof processarTrabalhoAtual> | null = null;
      void aplicarAlteracaoNaPartidaAtiva(
        (atual) => {
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

  async function persistirPartidaAtiva(partida: PartidaLocal, textoExibido?: string) {
    await aplicarAlteracaoNaPartidaAtiva(
      (atual) => ({ ...partida, jornada: atual.jornada }),
      textoExibido,
    );
  }

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
      const partida = criarPartidaLocal({
        idDaPartida: criarIdDaPartida(),
        criadoEm: agora,
        versaoDoConteudo: VERSAO_DO_CONTEUDO,
        nomeDoPersonagem,
        classeDoPersonagem,
        presente,
      });
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

  async function tratarCarregarPartida(idDaPartida: string) {
    definirMensagem(null);
    definirAusenteResumo(null);
    definirUltimoTrabalhoResultado(null);
    try {
      await gravarFila.current;
      const armazenado = await repositorioDePartidas.obter(idDaPartida);
      if (!armazenado) {
        definirMensagem("Esse partida não foi encontrado no armazenamento local.");
        return;
      }

      if (armazenado.masmorra.expedicaoAtiva) {
        selecionarPartidaAtiva(armazenado);
        definirPartidas((atual) => atualizarPartidaNaLista(atual, armazenado));
        definirRiscoAtivo(true);
        definirMensagem(
          "Expedição em Dún Liath em andamento. Retome do ponto em que parou.",
        );
        definirTela("jogo");
        return;
      }

      const agora = new Date().toISOString();
      const ausencia = Date.parse(agora) - Date.parse(armazenado.atualizadoEm);
      const resultado = processarTrabalhoAtual(armazenado, agora);
      await repositorioDePartidas.salvar(resultado.partida);
      definirPartidas((atual) => atualizarPartidaNaLista(atual, resultado.partida));
      selecionarPartidaAtiva(resultado.partida);
      definirRiscoAtivo(false);
      definirTela("jogo");

      if (resultado.textoExibido && ausencia >= 60_000) {
        definirAusenteResumo({
          duracao: formatarAusencia(ausencia),
          resultado: resultado.textoExibido,
          meta: obterResumoDeRetornoDaJornada(armazenado, resultado.partida),
          marco: obterAvisoDeFabricacaoDaJornada(armazenado, resultado.partida),
        });
      } else if (resultado.textoExibido) {
        const marco = obterAvisoDeFabricacaoDaJornada(armazenado, resultado.partida);
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
          equiparItem(
            atual,
            idDaInstancia,
            definicao,
            new Date().toISOString(),
          ),
        `${definicao.nome} equipado.`,
      );
    } catch (erro) {
      definirMensagem(
        erro instanceof Error
          ? erro.message
          : "Não foi possível equipar o item.",
      );
    }
  }

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

  async function tratarDepositarBancoPilha(
    idDaDefinicao: string,
    quantidade: number,
  ) {
    if (!partidaAtiva) return;
    try {
      await aplicarAlteracaoNaPartidaAtiva(
        (atual) =>
          depositarPilhaDoInventarioNoBanco(
            atual,
            idDaDefinicao,
            quantidade,
            new Date().toISOString(),
          ),
        `Depósito realizado: ${quantidade} item(ns).`,
      );
    } catch (erro) {
      definirMensagem(
        erro instanceof Error
          ? erro.message
          : "Não foi possível depositar no Banco.",
      );
    }
  }

  async function tratarRetirarBancoPilha(
    idDaDefinicao: string,
    quantidade: number,
  ) {
    if (!partidaAtiva) return;
    try {
      await aplicarAlteracaoNaPartidaAtiva(
        (atual) =>
          retirarPilhaDoBancoParaInventario(
            atual,
            idDaDefinicao,
            quantidade,
            new Date().toISOString(),
          ),
        `Retirada realizada: ${quantidade} item(ns).`,
      );
    } catch (erro) {
      definirMensagem(
        erro instanceof Error
          ? erro.message
          : "Não foi possível retirar do Banco.",
      );
    }
  }

  async function tratarDepositarBancoEquipamento(idDaInstancia: string) {
    if (!partidaAtiva) return;
    try {
      await aplicarAlteracaoNaPartidaAtiva(
        (atual) =>
          depositarEquipamentoNoBanco(atual, idDaInstancia, new Date().toISOString()),
        "Equipamento depositado no Banco.",
      );
    } catch (erro) {
      definirMensagem(
        erro instanceof Error
          ? erro.message
          : "Não foi possível depositar o equipamento.",
      );
    }
  }

  async function tratarRetirarBancoEquipamento(idDaInstancia: string) {
    if (!partidaAtiva) return;
    try {
      await aplicarAlteracaoNaPartidaAtiva(
        (atual) =>
          retirarEquipamentoDoBanco(
            atual,
            idDaInstancia,
            new Date().toISOString(),
          ),
        "Equipamento retirado do Banco.",
      );
    } catch (erro) {
      definirMensagem(
        erro instanceof Error
          ? erro.message
          : "Não foi possível retirar o equipamento.",
      );
    }
  }

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

  function alternarPartida() {
    selecionarPartidaAtiva(null);
    definirUltimoTrabalhoResultado(null);
    definirAusenteResumo(null);
    definirRiscoAtivo(false);
    definirMensagem(null);
    definirTela("partida-listar");
  }

  if (tela === "carregando") {
    return (
      <main className="entrada-estrutura entrada-centralizado">
        <div className="carregando-marcaVisual" />
        <p className="atenuado">Carregando partidas locais…</p>
      </main>
    );
  }

  if (tela === "erro") {
    return (
      <main className="entrada-estrutura entrada-centralizado">
        <p className="secao-chamada">Greywake</p>
        <h1 className="destaque-titulo">
          Não foi possível abrir o armazenamento local.
        </h1>
        <p className="atenuado">{mensagem}</p>
      </main>
    );
  }

  if (tela === "jogo" && partidaAtiva) {
    if (ausenteResumo) {
      return (
        <main className="ausente-retorno-tela">
          <section className="ausente-retorno-cartao">
            <p className="secao-chamada">Bem-vindo de volta</p>
            <h1 className="destaque-titulo">{partidaAtiva.personagem.nome}</h1>
            <p className="ausente-duracao">
              Ausente por <strong>{ausenteResumo.duracao}</strong>
            </p>
            <div className="ausente-resultado">
              <span>Durante sua ausência</span>
              <strong>{ausenteResumo.resultado}</strong>
            </div>
            {ausenteResumo.meta ? (
              <div className="ausente-meta-resultado">
                <IconeDoJogo icone="livro-abrir" tamanho={32} />
                <p>{ausenteResumo.meta}</p>
              </div>
            ) : null}
            {ausenteResumo.marco ? (
              <p className="ausente-marco">{ausenteResumo.marco}</p>
            ) : null}
            <button
              className="principal-botao compacto"
              type="button"
              onClick={() => definirAusenteResumo(null)}
            >
              Continuar
            </button>
          </section>
        </main>
      );
    }

    return (
      <>
        <EstadoDoJogoWeb podeAtualizar={false} />
        <EstruturaDoJogo
          partida={partidaAtiva}
          mensagem={mensagem}
          tipoDaMensagem={aviso?.tipo ?? "informacao"}
          ultimoResultadoDoTrabalho={ultimoResultadoDoTrabalho}
          aoDispensarMensagem={() => definirMensagem(null)}
          riscoAtivo={riscoAtivo}
          aoAlterarEstadoDeRisco={definirRiscoAtivo}
          aoAlternarPartida={alternarPartida}
          aoPersistir={persistirPartidaAtiva}
          prepararRisco={prepararRisco}
          aoIniciarAtividade={tratarIniciarAtividade}
          aoIniciarReceita={tratarIniciarReceita}
          aoEscolherMetaDaJornada={tratarEscolherJornadaMeta}
          aoPararTrabalho={tratarPararTrabalho}
          aoEquipar={tratarEquipar}
          aoDistribuirAtributos={tratarDistribuirAtributos}
          aoRealizarPrestigioDoPersonagem={tratarRealizarPersonagemPrestigio}
          aoDesbloquearNoDePrestigio={tratarDesbloquearPrestigioNo}
          aoDepositarPilhaNoBanco={tratarDepositarBancoPilha}
          aoRetirarPilhaDoBanco={tratarRetirarBancoPilha}
          aoDepositarEquipamentoNoBanco={tratarDepositarBancoEquipamento}
          aoRetirarEquipamentoDoBanco={tratarRetirarBancoEquipamento}
        />
      </>
    );
  }

  if (tela === "partida-listar") {
    return (
      <main className="entrada-estrutura">
        <EstadoDoJogoWeb podeAtualizar />
        <header className="entrada-cabecalho">
          <div>
            <p className="secao-chamada">Greywake</p>
            <strong className="entrada-marca">Versão 0.1 · Sem conexão</strong>
          </div>
          <button
            className="principal-botao compacto"
            type="button"
            onClick={iniciarNovoPartida}
          >
            Novo personagem
          </button>
        </header>
        <section className="entrada-introducao">
          <p className="secao-chamada">Continuar</p>
          <h1 className="destaque-titulo">Escolha um personagem</h1>
          <p className="atenuado">
            Partidas locais, persistentes e separados de qualquer futuro modo
            Conectado.
          </p>
        </section>
        {mensagem ? <p className="emLinha-mensagem">{mensagem}</p> : null}
        <section className="partida-gradeVisual-emExecucao">
          {partidas.map((partida) => (
            <button
              className="partida-cartao-emExecucao"
              type="button"
              key={partida.idDaPartida}
              onClick={() => void tratarCarregarPartida(partida.idDaPartida)}
            >
              <span>
                {obterNomeDaClasse(partida.personagem.idDaClasse)} · Nv.{" "}
                {partida.personagem.nivel}
              </span>
              <strong>{partida.personagem.nome}</strong>
              <small>{obterNomeDoPresente(partida.personagem.idDoPresente)}</small>
              <em>
                {partida.masmorra.expedicaoAtiva
                  ? "EXPEDIÇÃO ATIVA · RETOMAR DÚN LIATH"
                  : "OFFLINE · LOCAL"}
              </em>
            </button>
          ))}
        </section>
        <CreditosDosRecursos />
      </main>
    );
  }

  return (
    <main className="entrada-estrutura">
      <EstadoDoJogoWeb podeAtualizar={criacaoPasso === 0 && !ehSalvando} />
      <header className="entrada-cabecalho">
        <div>
          <p className="secao-chamada">Novo jogo</p>
          <strong className="entrada-marca">Greywake</strong>
        </div>
        {partidas.length > 0 ? (
          <button
            className="discreto-botao"
            type="button"
            onClick={() => definirTela("partida-listar")}
          >
            Voltar aos partidas
          </button>
        ) : null}
      </header>
      <section className="criacao-etapa">
        <div
          className="criacao-progresso"
          aria-label={`Etapa ${criacaoPasso + 1} de 5`}
        >
          {[0, 1, 2, 3, 4].map((passo) => (
            <span key={passo} className={passo <= criacaoPasso ? "ativo" : ""}>
              {passo + 1}
            </span>
          ))}
        </div>

        {criacaoPasso === 0 ? (
          <div className="criacao-foco">
            <p className="secao-chamada">Modo</p>
            <h1 className="destaque-titulo">Sem conexão</h1>
            <p className="atenuado">
              Este personagem usa partida local persistente. Nenhum sistema Conectado
              é necessário para jogar.
            </p>
            <button
              className="principal-botao compacto"
              type="button"
              onClick={() => definirCriacaoPasso(1)}
            >
              Continuar
            </button>
          </div>
        ) : null}

        {criacaoPasso === 1 ? (
          <div className="criacao-foco">
            <p className="secao-chamada">Nome</p>
            <h1 className="destaque-titulo">Quem desperta em Greywake?</h1>
            <label className="campo-pilha">
              <span>Nome do personagem</span>
              <input
                autoFocus
                autoComplete="off"
                value={nomeDoPersonagem}
                onChange={(evento) => definirPersonagemNome(evento.target.value)}
                placeholder="Nome"
              />
            </label>
            <div className="botao-linhaDeDados">
              <button
                className="discreto-botao"
                type="button"
                onClick={() => definirCriacaoPasso(0)}
              >
                Voltar
              </button>
              <button
                className="principal-botao compacto"
                type="button"
                disabled={!nomeDoPersonagem.trim()}
                onClick={() => definirCriacaoPasso(2)}
              >
                Continuar
              </button>
            </div>
          </div>
        ) : null}

        {criacaoPasso === 2 ? (
          <div className="criacao-foco amplo">
            <p className="secao-chamada">Classe inicial</p>
            <h1 className="destaque-titulo">Escolha como começar</h1>
            <p className="atenuado">
              A classe define seu início, não seu destino.
            </p>
            <div className="criacao-escolha-gradeVisual">
              {CLASSES_DE_PERSONAGEM.map((definicao) => {
                const gif = GIFS_DAS_CLASSES[definicao.id];

                return (
                  <button
                    key={definicao.id}
                    type="button"
                    className={`criacao-escolha ${
                      gif ? "criacao-classe-escolha" : ""
                    } ${idDaClasseSelecionada === definicao.id ? "selecionado" : ""}`}
                    aria-pressed={idDaClasseSelecionada === definicao.id}
                    onClick={() => definirIdDaClasseSelecionada(definicao.id)}
                  >
                    {gif && (
                      <img
                        className="criacao-classe-gif"
                        src={gif}
                        alt=""
                        width={80}
                        height={80}
                      />
                    )}

                    <span className="criacao-classe-texto">
                      <strong>{definicao.nome}</strong>
                      <span>{definicao.resumo}</span>
                    </span>
                  </button>
                );
              })}
            </div>
            <div className="botao-linhaDeDados">
              <button className="discreto-botao" type="button" onClick={() => definirCriacaoPasso(1)}>
                Voltar
              </button>
              <button className="principal-botao compacto" type="button" disabled={!idDaClasseSelecionada} onClick={() => definirCriacaoPasso(3)}>
                Continuar
              </button>
            </div>
          </div>
        ) : null}

        {criacaoPasso === 3 ? (
          <div className="criacao-foco amplo">
            <p className="secao-chamada">Presente</p>
            <h1 className="destaque-titulo">Escolha o que levar</h1>
            <div className="criacao-escolha-gradeVisual">
              {PRESENTES_INICIAIS.map((definicao) => (
                <button
                  className={`criacao-escolha ${selecionadoPresenteId === definicao.id ? "selecionado" : ""}`}
                  type="button"
                  key={definicao.id}
                  onClick={() => definirSelecionadoPresenteId(definicao.id)}
                >
                  <strong>{definicao.nome}</strong>
                  <span>{definicao.resumo}</span>
                </button>
              ))}
            </div>
            <div className="botao-linhaDeDados">
              <button
                className="discreto-botao"
                type="button"
                onClick={() => definirCriacaoPasso(2)}
              >
                Voltar
              </button>
              <button
                className="principal-botao compacto"
                type="button"
                disabled={!selecionadoPresenteId}
                onClick={() => definirCriacaoPasso(4)}
              >
                Continuar
              </button>
            </div>
          </div>
        ) : null}

        {criacaoPasso === 4 ? (
          <div className="criacao-foco">
            <p className="secao-chamada">Confirmar</p>
            <h1 className="destaque-titulo">{nomeDoPersonagem}</h1>
            <div className="criacao-resumo-emExecucao">
              <div>
                <span>Modo</span>
                <strong>{MODO_DA_PARTIDA}</strong>
              </div>
              <div>
                <span>Classe</span>
                <strong>
                  {idDaClasseSelecionada ? obterNomeDaClasse(idDaClasseSelecionada) : "—"}
                </strong>
              </div>
              <div>
                <span>Presente</span>
                <strong>
                  {selecionadoPresenteId ? obterNomeDoPresente(selecionadoPresenteId) : "—"}
                </strong>
              </div>
            </div>
            {mensagem ? <p className="emLinha-mensagem">{mensagem}</p> : null}
            <div className="botao-linhaDeDados">
              <button
                className="discreto-botao"
                type="button"
                onClick={() => definirCriacaoPasso(3)}
              >
                Voltar
              </button>
              <button
                className="principal-botao compacto"
                type="button"
                disabled={ehSalvando}
                onClick={() => void tratarCriarPartida()}
              >
                {ehSalvando ? "Criando…" : "Criar personagem"}
              </button>
            </div>
          </div>
        ) : null}
      </section>
      <CreditosDosRecursos />
    </main>
  );
}

export default Aplicativo;

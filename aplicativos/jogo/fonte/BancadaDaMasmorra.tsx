import { useEffect, useMemo, useState } from "react";
import {
  DUN_LIATH_FACIL,
  obterDefinicaoDeHabilidadeDeCombate,
  obterDefinicaoDeConsumivelDeCombate,
  obterDefinicaoDeReceitaDeFabricacao,
  obterDefinicaoDeMasmorra,
  obterDefinicaoDeInimigo,
  obterDefinicaoDeEquipamento,
  obterDefinicaoDeAtividadeOciosa,
  obterConjuntoDeHabilidadesAntesDaMasmorra,
} from "@greywake/conteudo";
import {
  aceitarContratoDeDunLiath,
  escolherCaminhoNaMasmorra,
  decidirDestinoDoProtetor,
  derivarEstatisticasDeCombateDoJogador,
  extrairExpedicaoDaMasmorra,
  resolverSalaDaMasmorra,
  retomarTrabalhoAposRisco,
  iniciarMasmorraComContinuidade,
  ensinarEEquiparHabilidadesDeCombate,
  type ResultadoDeCombate,
  type DefinicaoDeSalaDaMasmorra,
  type PartidaLocal,
} from "@greywake/dominio";

type PropriedadesDaTelaDeMasmorra = {
  partida: PartidaLocal;
  prepararRisco: () => Promise<PartidaLocal>;
  aoAlterarPartida: (
    partida: PartidaLocal,
    mensagem?: string,
  ) => void | Promise<void>;
  aoAlterarEstadoDeRisco?: (ativo: boolean) => void;
  aoAlterarEstadoDePreparacao?: (ativo: boolean) => void;
  aoRetorno?: () => void;
};

const masmorraCatalogo = {
  obterDefinicaoDeEquipamento,
  obterDefinicaoDeHabilidade: obterDefinicaoDeHabilidadeDeCombate,
  obterDefinicaoDeInimigo,
  obterDefinicaoDeConsumivel: obterDefinicaoDeConsumivelDeCombate,
  obterDefinicaoDeMasmorra,
};

const salaTexto: Record<string, string> = {
  "sala.entrada":
    "A fortaleza está silenciosa. O caminho para dentro ainda está aberto.",
  "sala.patio":
    "Duas rotas se separam entre alojamentos militares e a ala administrativa.",
  "sala.alojamentos":
    "Marcas recentes cruzam os antigos alojamentos da guarnição.",
  "sala.administracao":
    "Papéis apodrecidos e selos humanos permanecem entre armários quebrados.",
  "sala.tratado":
    "Um fragmento antigo registra que humanos e monstros já negociaram formalmente.",
  "sala.depositos":
    "O depósito foi esvaziado às pressas. Há sinais de ocupação recente.",
  "sala.crubach": "Um Crúbach bloqueia a galeria estreita.",
  "sala.protetor":
    "Uma criatura ferida protege outra menor. Ela fala, entende você e teme o que fará em seguida.",
  "sala.tromghiallach":
    "A massa de Tromghiallach ocupa o salão como uma muralha viva.",
  "sala.arsenal":
    "O arsenal abandonado ainda guarda uma peça utilizável da antiga guarnição.",
  "sala.registroDeDados":
    "O Registro de Suprimentos da Guarnição sobreviveu entre caixas partidas.",
  "sala.inferior-salao":
    "O salão inferior carrega sinais de evacuação e improviso defensivo.",
  "sala.muralha":
    "Da muralha interna, a passagem para o coração do bastião fica evidente.",
  "sala.passagem":
    "A arquitetura se estreita antes da passagem interna do bastião.",
  "sala.cosantoir": "Cosantóir guarda o acesso às câmaras finais.",
  "sala.recuperacao":
    "Uma capela silenciosa oferece a última oportunidade de se recompor ou retirar.",
  "sala.chefe-portao":
    "Além da porta está o ser que manteve este lugar protegido.",
  "sala.fairtheoir":
    "Fairtheoir espera sem falar. O combate revelará duas fases do Último Vigia.",
};

function salaRotulo(sala: DefinicaoDeSalaDaMasmorra) {
  const sufixo = sala.idDaDefinicaoDoInimigo
    ? " · Combate"
    : sala.tipo === "recuperacao"
      ? " · Recuperação"
      : "";
  return `${sala.nome}${sufixo}`;
}

function itemRotulo(idDaDefinicao: string) {
  const rotulos: Record<string, string> = {
    "item.tratado-fragmento": "Fragmento do Tratado",
    "item.guarnicao-suprimento-registroDeDados": "Registro de Suprimentos",
    "item.dun-liath.viga": "Viga de Dún Liath",
    "item.fairtheoir-fragmento": "Fragmento de Fairtheoir",
    "item.consumivel.campo-preparacao": "Preparado de Campo",
  };
  return rotulos[idDaDefinicao] ?? idDaDefinicao;
}

function ativoTrabalhoRotulo(partida: PartidaLocal) {
  if (partida.ocioso.atividadeAtiva) {
    return (
      obterDefinicaoDeAtividadeOciosa(partida.ocioso.atividadeAtiva.idDaDefinicaoDaAtividade)
        ?.nome ?? "Atividade de coleta"
    );
  }
  if (partida.fabricacao.receitaAtiva) {
    return (
      obterDefinicaoDeReceitaDeFabricacao(partida.fabricacao.receitaAtiva.idDaDefinicaoDaReceita)
        ?.nome ?? "Produção"
    );
  }
  return "Nenhuma atividade automática ativa";
}

export default function BancadaDaMasmorra({
  partida,
  prepararRisco,
  aoAlterarPartida,
  aoAlterarEstadoDeRisco,
  aoAlterarEstadoDePreparacao,
  aoRetorno,
}: PropriedadesDaTelaDeMasmorra) {
  const [mensagem, definirMensagem] = useState<string | null>(null);
  const [resultadoDeCombate, definirCombateResultado] = useState<ResultadoDeCombate | null>(null);
  const [ocupado, definirOcupado] = useState(false);
  const [preparando, definirPreparando] = useState(false);

  const execucao = partida.masmorra.expedicaoAtiva;
  const atualSala = useMemo<DefinicaoDeSalaDaMasmorra | null>(
    () =>
      execucao
        ? (DUN_LIATH_FACIL.salas.find((sala) => sala.id === execucao.idDaSalaAtual) ??
          null)
        : null,
    [execucao],
  );
  const salaResolvido = Boolean(
    atualSala && execucao?.idsDasSalasResolvidas.includes(atualSala.id),
  );

  useEffect(() => {
    aoAlterarEstadoDeRisco?.(Boolean(execucao));
  }, [aoAlterarEstadoDeRisco, execucao]);

  useEffect(() => () => aoAlterarEstadoDeRisco?.(false), [aoAlterarEstadoDeRisco]);

  useEffect(() => {
    aoAlterarEstadoDePreparacao?.(preparando);
  }, [aoAlterarEstadoDePreparacao, preparando]);

  useEffect(
    () => () => aoAlterarEstadoDePreparacao?.(false),
    [aoAlterarEstadoDePreparacao],
  );

  async function persistir(proximo: PartidaLocal, textoExibido?: string) {
    await aoAlterarPartida(proximo, textoExibido);
    if (textoExibido) definirMensagem(textoExibido);
  }

  async function tratarAceitarContrato() {
    if (ocupado) return;
    definirOcupado(true);
    try {
      if (!partida.combate.loboDerrotado)
        throw new Error("Conclua primeiro o Serviço — Estrada Baixa.");
      const agora = new Date().toISOString();
      let proximo = ensinarEEquiparHabilidadesDeCombate(
        partida,
        obterConjuntoDeHabilidadesAntesDaMasmorra(partida.personagem.idDaClasse),
        agora,
      );
      proximo = aceitarContratoDeDunLiath(proximo, agora);
      await persistir(
        proximo,
        "Contrato aceito. Técnicas básicas preparadas e 2× Preparado de Campo entregues uma única vez.",
      );
    } catch (erro) {
      definirMensagem(
        erro instanceof Error
          ? erro.message
          : "Não foi possível aceitar o contrato.",
      );
    } finally {
      definirOcupado(false);
    }
  }

  async function tratarIniciar() {
    if (ocupado) return;
    definirOcupado(true);
    try {
      if (!partida.combate.loboDerrotado)
        throw new Error("Derrote primeiro o Lobo de Estrada.");
      const agora = new Date().toISOString();
      const riscoPartida = await prepararRisco();
      const semente = Date.now() >>> 0;
      const estatisticas = derivarEstatisticasDeCombateDoJogador(riscoPartida, masmorraCatalogo);
      const recursosIniciais = {
        vida: estatisticas.vidaMaxima,
        vidaMaxima: estatisticas.vidaMaxima,
        mana: estatisticas.manaMaxima,
        manaMaxima: estatisticas.manaMaxima,
        folego: estatisticas.folegoMaximo,
        folegoMaximo: estatisticas.folegoMaximo,
      };
      const proximo = iniciarMasmorraComContinuidade(
        riscoPartida,
        DUN_LIATH_FACIL,
        semente,
        agora,
        recursosIniciais,
      );
      await persistir(
        proximo,
        `Dún Liath iniciada. ${ativoTrabalhoRotulo(riscoPartida)} foi pausada e será retomada ao voltar à segurança.`,
      );
      definirCombateResultado(null);
      definirPreparando(false);
      aoAlterarEstadoDeRisco?.(true);
    } catch (erro) {
      definirMensagem(
        erro instanceof Error
          ? erro.message
          : "Não foi possível iniciar Dún Liath.",
      );
      aoAlterarEstadoDeRisco?.(false);
    } finally {
      definirOcupado(false);
    }
  }

  async function tratarResolver() {
    if (!execucao || !atualSala || ocupado) return;
    definirOcupado(true);
    try {
      const agora = new Date().toISOString();
      const resultado = resolverSalaDaMasmorra(
        partida,
        DUN_LIATH_FACIL,
        masmorraCatalogo,
        agora,
      );
      definirCombateResultado(resultado.resultadoDeCombate ?? null);

      if (!resultado.partida.masmorra.expedicaoAtiva) {
        const retomado = retomarTrabalhoAposRisco(resultado.partida, agora);
        await persistir(
          retomado,
          "A expedição terminou em derrota. A Bolsa foi perdida. Sua atividade automática anterior foi retomada.",
        );
        aoAlterarEstadoDeRisco?.(false);
      } else if (
        atualSala.id === "sala.fairtheoir" &&
        resultado.resultadoDeCombate?.desfecho === "vitoria"
      ) {
        await persistir(
          resultado.partida,
          "Fairtheoir caiu. Retorne em segurança para assegurar o conclusão e o saques.",
        );
      } else if (resultado.resultadoDeCombate) {
        await persistir(
          resultado.partida,
          `${atualSala.nome} resolvida · ${resultado.resultadoDeCombate.xpConcedido} XP. Saques encontrado permanece em risco.`,
        );
      } else {
        await persistir(resultado.partida, `${atualSala.nome} resolvida.`);
      }
    } catch (erro) {
      definirMensagem(
        erro instanceof Error
          ? erro.message
          : "Não foi possível resolver a sala.",
      );
    } finally {
      definirOcupado(false);
    }
  }

  async function tratarCaminho(proximoSalaId: string) {
    if (ocupado) return;
    definirOcupado(true);
    try {
      const proximo = escolherCaminhoNaMasmorra(
        partida,
        DUN_LIATH_FACIL,
        proximoSalaId,
        new Date().toISOString(),
      );
      await persistir(
        proximo,
        "Caminho escolhido. A bifurcação anterior não pode ser refeita nesta expedição.",
      );
      definirCombateResultado(null);
    } catch (erro) {
      definirMensagem(
        erro instanceof Error
          ? erro.message
          : "Não foi possível seguir por esse caminho.",
      );
    } finally {
      definirOcupado(false);
    }
  }

  async function tratarProtetor(decisao: "morto" | "poupado") {
    if (ocupado) return;
    definirOcupado(true);
    try {
      const proximo = decidirDestinoDoProtetor(partida, decisao, new Date().toISOString());
      await persistir(
        proximo,
        decisao === "poupado"
          ? "Você poupa o protetor."
          : "Você mata o protetor. O indivíduo protegido foge.",
      );
    } catch (erro) {
      definirMensagem(
        erro instanceof Error
          ? erro.message
          : "Não foi possível registrar essa decisão.",
      );
    } finally {
      definirOcupado(false);
    }
  }

  async function tratarExtrair() {
    if (ocupado) return;
    definirOcupado(true);
    try {
      const agora = new Date().toISOString();
      const estavaConclusao = Boolean(partida.masmorra.expedicaoAtiva?.concluido);
      const extraido = extrairExpedicaoDaMasmorra(partida, agora);
      const retomado = retomarTrabalhoAposRisco(extraido, agora);
      await persistir(
        retomado,
        estavaConclusao
          ? "Conclusão assegurado. Bolsa transferida e atividade automática anterior retomada."
          : "Retirada segura concluída. Bolsa transferida e atividade automática anterior retomada.",
      );
      definirCombateResultado(null);
      definirPreparando(false);
      aoAlterarEstadoDeRisco?.(false);
      aoRetorno?.();
    } catch (erro) {
      definirMensagem(
        erro instanceof Error
          ? erro.message
          : "Não foi possível retirar da Masmorra.",
      );
    } finally {
      definirOcupado(false);
    }
  }

  if (!execucao && preparando) {
    const vazioTecnicas = partida.personagem.espacosDeHabilidadesAtivas.filter(
      (espaco) => !espaco,
    ).length;
    const vazioConsumiveis = partida.combate.preferencias.espacosDeConsumiveis.filter(
      (espaco) => !espaco.idDaDefinicao,
    ).length;

    return (
      <section
        className="funcionalidade-telaDoJogo preparacao-telaDoJogo"
        aria-labelledby="preparacao-titulo"
      >
        <div className="telaDoJogo-tituloDaSecao">
          <div>
            <p className="secao-chamada">Dún Liath · Preparação</p>
            <h2 id="preparacao-titulo" className="destaque-titulo">
              Antes da expedição
            </h2>
            <p className="atenuado">
              A preparação ainda é um contexto seguro. Sua atividade automática
              continua até a entrada ser confirmada.
            </p>
          </div>
          <button
            className="discreto-botao"
            type="button"
            onClick={() => definirPreparando(false)}
          >
            Voltar
          </button>
        </div>

        <div className="preparacao-disposicao">
          <div className="contexto-arte contexto-arte--risco" aria-hidden="true">
            <span>ARTE 16:9 · DÚN LIATH</span>
          </div>
          <aside className="painel preparacao-resumo">
            <p className="secao-chamada">Estado do personagem</p>
            <h3>
              {partida.personagem.nome} · Nv. {partida.personagem.nivel}
            </h3>
            <div className="informacao-linhaDeDados">
              <span>Estilo</span>
              <strong>{partida.combate.preferencias.estilo}</strong>
            </div>
            <div className="informacao-linhaDeDados">
              <span>Técnicas vazias</span>
              <strong>{vazioTecnicas}</strong>
            </div>
            <div className="informacao-linhaDeDados">
              <span>Consumíveis vazios</span>
              <strong>{vazioConsumiveis}</strong>
            </div>
            <div className="informacao-linhaDeDados">
              <span>Atividade atual</span>
              <strong>{ativoTrabalhoRotulo(partida)}</strong>
            </div>
          </aside>
        </div>

        <div className="preparacao-cartoes secao-espacamento">
          <article className="painel">
            <p className="secao-chamada">Equipamento</p>
            <h3>10 espaços do personagem</h3>
            <p className="atenuado">O equipamento atual será usado na entrada.</p>
          </article>
          <article className="painel">
            <p className="secao-chamada">Técnicas</p>
            <h3>{4 - vazioTecnicas}/4 configuradas</h3>
            <p className="atenuado">
              A ordem visível corresponde à prioridade real do combate.
            </p>
          </article>
          <article className="painel">
            <p className="secao-chamada">Consumíveis</p>
            <h3>{2 - vazioConsumiveis}/2 preparados</h3>
            <p className="atenuado">Consumir ocupa a ação atual.</p>
          </article>
          <article className="painel">
            <p className="secao-chamada">Estilo</p>
            <h3>{partida.combate.preferencias.estilo}</h3>
            <p className="atenuado">Agressivo, Defensivo ou Misto.</p>
          </article>
        </div>

        <div className="confirmar-painel secao-espacamento">
          <div>
            <p className="secao-chamada">Ao entrar</p>
            <h3>Você assume o risco da expedição.</h3>
            <ul>
              <li>{ativoTrabalhoRotulo(partida)} será pausada.</li>
              <li>Encontrados irão para a Bolsa de Expedição.</li>
              <li>
                O conteúdo da Bolsa permanece em risco até uma saída segura.
              </li>
            </ul>
          </div>
          <button
            className="principal-botao compacto"
            type="button"
            disabled={ocupado}
            onClick={() => void tratarIniciar()}
          >
            Entrar em Dún Liath
          </button>
        </div>
        {mensagem ? (
          <p className="emLinha-mensagem" role="status">
            {mensagem}
          </p>
        ) : null}
      </section>
    );
  }

  if (!execucao) {
    return (
      <section
        className="funcionalidade-telaDoJogo masmorra-visaoGeral"
        aria-labelledby="masmorra-titulo"
      >
        <div className="telaDoJogo-tituloDaSecao">
          <div>
            <p className="secao-chamada">Aventura · Masmorra</p>
            <h2 id="masmorra-titulo" className="destaque-titulo">
              Dún Liath
            </h2>
            <p className="atenuado">
              Fortificação militar abandonada · expedição prolongada · saques em
              risco.
            </p>
          </div>
          {aoRetorno ? (
            <button className="discreto-botao" type="button" onClick={aoRetorno}>
              Voltar a Aventura
            </button>
          ) : null}
        </div>

        <div className="contexto-arte contexto-arte--masmorra" aria-hidden="true">
          <span>ARTE 16:9 · DÚN LIATH</span>
        </div>
        {mensagem ? (
          <p className="emLinha-mensagem" role="status">
            {mensagem}
          </p>
        ) : null}

        <div className="masmorra-entrada-gradeVisual secao-espacamento">
          <article className="painel">
            <p className="secao-chamada">Objetivo conhecido</p>
            <h3>Fortaleza Cinzenta</h3>
            <p className="atenuado">
              Recupere o Registro de Suprimentos da Guarnição e atravesse a
              fortaleza.
            </p>
            <div className="informacao-linhaDeDados">
              <span>Serviço da Estrada</span>
              <strong>
                {partida.combate.loboDerrotado ? "Concluído" : "Pendente"}
              </strong>
            </div>
            <div className="informacao-linhaDeDados">
              <span>Contrato</span>
              <strong>
                {partida.masmorra.contratoAceito || partida.masmorra.contratoConcluido
                  ? "Aceito"
                  : "Disponível na Taverna"}
              </strong>
            </div>
          </article>
          <article className="painel risco-painel">
            <p className="secao-chamada">Riscos conhecidos</p>
            <ul>
              <li>Presença hostil confirmada.</li>
              <li>A expedição mantém recursos entre salas.</li>
              <li>
                Saques encontrado fica na Bolsa de Expedição até uma saída segura.
              </li>
            </ul>
            {!partida.masmorra.contratoAceito &&
            !partida.masmorra.contratoConcluido ? (
              <button
                className="principal-botao"
                type="button"
                disabled={ocupado || !partida.combate.loboDerrotado}
                onClick={() => void tratarAceitarContrato()}
              >
                Aceitar contrato
              </button>
            ) : (
              <button
                className="principal-botao"
                type="button"
                disabled={ocupado}
                onClick={() => definirPreparando(true)}
              >
                Preparar expedição
              </button>
            )}
          </article>
        </div>
      </section>
    );
  }

  if (!atualSala) {
    return (
      <p className="emLinha-mensagem">
        A sala atual da expedição não foi encontrada no conteúdo.
      </p>
    );
  }

  const emChefePortao = atualSala.id === "sala.chefe-portao";
  const ramoEscolha = salaResolvido && atualSala.idsDasProximasSalas.length > 1;

  return (
    <section
      className="funcionalidade-telaDoJogo masmorra-execucao-telaDoJogo"
      aria-labelledby="masmorra-execucao-titulo"
    >
      <div className="masmorra-execucao-cabecalho">
        <div>
          <p className="secao-chamada">Dún Liath · Expedição ativa</p>
          <h2 id="masmorra-execucao-titulo" className="destaque-titulo">
            {atualSala.nome}
          </h2>
        </div>
        <div className="risco-selo">
          BOLSA ·{" "}
          {execucao.bolsaDaExpedicao.reduce(
            (total, pilha) => total + pilha.quantidade,
            0,
          ) + execucao.equipamentosDaExpedicao.length}{" "}
          EM RISCO
        </div>
      </div>

      {mensagem ? (
        <p className="emLinha-mensagem" role="status">
          {mensagem}
        </p>
      ) : null}

      <div className="masmorra-execucao-gradeVisual">
        <div>
          <div className="contexto-arte contexto-arte--masmorra" aria-hidden="true">
            <span>ARTE 16:9 · {atualSala.nome.toUpperCase()}</span>
          </div>
          <article className="painel sala-painel">
            <p className="secao-chamada">Sala atual</p>
            <h3>{salaRotulo(atualSala)}</h3>
            <p className="atenuado">{salaTexto[atualSala.id]}</p>

            <div className="masmorra-recurso-gradeVisual">
              <div>
                <span>VIDA</span>
                <strong>
                  {Math.round(execucao.recursos.vida)}/{execucao.recursos.vidaMaxima}
                </strong>
              </div>
              <div>
                <span>MANA</span>
                <strong>
                  {Math.round(execucao.recursos.mana)}/{execucao.recursos.manaMaxima}
                </strong>
              </div>
              <div>
                <span>STAMINA</span>
                <strong>
                  {Math.round(execucao.recursos.folego)}/{execucao.recursos.folegoMaximo}
                </strong>
              </div>
            </div>

            {atualSala.id === "sala.protetor" && !execucao.decisaoSobreOProtetor ? (
              <div className="narrativa-escolha">
                <p>
                  Uma criatura ferida protege outra menor. Nenhuma recompensa ou
                  classificação moral é apresentada.
                </p>
                <div className="botao-linhaDeDados">
                  <button
                    className="discreto-botao"
                    type="button"
                    disabled={ocupado}
                    onClick={() => void tratarProtetor("morto")}
                  >
                    Matar
                  </button>
                  <button
                    className="discreto-botao"
                    type="button"
                    disabled={ocupado}
                    onClick={() => void tratarProtetor("poupado")}
                  >
                    Poupar
                  </button>
                </div>
              </div>
            ) : null}

            {!salaResolvido ? (
              <button
                className="principal-botao compacto"
                type="button"
                disabled={
                  ocupado ||
                  (atualSala.id === "sala.protetor" &&
                    !execucao.decisaoSobreOProtetor)
                }
                onClick={() => void tratarResolver()}
              >
                {atualSala.idDaDefinicaoDoInimigo
                  ? "Entrar em combate"
                  : atualSala.tipo === "recuperacao"
                    ? "Usar recuperação"
                    : "Resolver sala"}
              </button>
            ) : null}
          </article>

          {resultadoDeCombate ? (
            <article
              className={`painel encontro-resultado ${resultadoDeCombate.desfecho}`}
            >
              <p className="secao-chamada">Último encontro</p>
              <h3>
                {resultadoDeCombate.desfecho === "vitoria"
                  ? "Vitória"
                  : resultadoDeCombate.desfecho === "derrota"
                    ? "Derrota"
                    : "Encerrado"}
              </h3>
              <p className="atenuado">
                {resultadoDeCombate.duracaoEmSegundos.toFixed(1)}s ·{" "}
                {resultadoDeCombate.xpConcedido} XP · consumíveis usados permanecem
                consumidos.
              </p>
            </article>
          ) : null}

          {salaResolvido && atualSala.idsDasProximasSalas.length > 0 && !emChefePortao ? (
            <div
              className={`masmorra-caminhos ${ramoEscolha ? "masmorra-caminhos--ramo" : ""}`}
            >
              {atualSala.idsDasProximasSalas.map((salaId) => {
                const sala = DUN_LIATH_FACIL.salas.find(
                  (candidato) => candidato.id === salaId,
                );
                return sala ? (
                  <button
                    className="rota-cartao"
                    type="button"
                    key={salaId}
                    disabled={ocupado}
                    onClick={() => void tratarCaminho(salaId)}
                  >
                    <span className="secao-chamada">Próxima rota</span>
                    <strong>{salaRotulo(sala)}</strong>
                    <small>
                      {ramoEscolha
                        ? "Escolher esta rota fecha a alternativa nesta expedição."
                        : "Seguir adiante"}
                    </small>
                  </button>
                ) : null;
              })}
            </div>
          ) : null}

          {salaResolvido && emChefePortao ? (
            <div className="chefe-confirmar">
              <p className="secao-chamada">Portão do Bastião</p>
              <h3>Além deste ponto está Fairtheoir.</h3>
              <p className="atenuado">
                Retornar assegura a Bolsa. Continuar mantém tudo em risco.
              </p>
              <div className="botao-linhaDeDados">
                {execucao.extracaoSeguraDisponivel ? (
                  <button
                    className="discreto-botao"
                    type="button"
                    disabled={ocupado}
                    onClick={() => void tratarExtrair()}
                  >
                    Retornar e assegurar Bolsa
                  </button>
                ) : null}
                {atualSala.idsDasProximasSalas.map((salaId) => (
                  <button
                    className="principal-botao compacto"
                    type="button"
                    key={salaId}
                    disabled={ocupado}
                    onClick={() => void tratarCaminho(salaId)}
                  >
                    Abrir o portão
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {execucao.concluido ? (
            <div className="masmorra-conclusao-painel">
              <p className="secao-chamada">Dún Liath concluída</p>
              <h3>Fairtheoir caiu.</h3>
              <p className="atenuado">
                O conclusão e o conteúdo da Bolsa ainda precisam ser assegurados
                pelo retorno.
              </p>
              <button
                className="principal-botao compacto"
                type="button"
                disabled={ocupado}
                onClick={() => void tratarExtrair()}
              >
                Retornar à Cidade Livre
              </button>
            </div>
          ) : null}
        </div>

        <aside className="masmorra-lateral">
          <article className="painel expedicao-bolsa">
            <p className="secao-chamada">Bolsa de Expedição</p>
            <h3>Em risco</h3>
            {execucao.bolsaDaExpedicao.length === 0 &&
            execucao.equipamentosDaExpedicao.length === 0 ? (
              <p className="atenuado">Nada encontrado nesta expedição ainda.</p>
            ) : null}
            {execucao.bolsaDaExpedicao.map((pilha) => (
              <div className="saque-linhaDeDados" key={pilha.idDaDefinicao}>
                <span>{itemRotulo(pilha.idDaDefinicao)}</span>
                <strong>×{pilha.quantidade}</strong>
              </div>
            ))}
            {execucao.equipamentosDaExpedicao.map((item, indice) => (
              <div className="saque-linhaDeDados" key={`${item.idDaDefinicao}-${indice}`}>
                <span>{item.idDaDefinicao}</span>
                <strong>{item.raridade}</strong>
              </div>
            ))}
            <p className="risco-texto">
              Uma derrota perde esta Bolsa. O patrimônio que já estava seguro
              não está em risco.
            </p>
          </article>

          <article className="painel masmorra-mapa-cartao">
            <p className="secao-chamada">Rota descoberta</p>
            <div className="rota-percurso">
              {execucao.idsDasSalasVisitadas.map((salaId, indice) => {
                const sala = DUN_LIATH_FACIL.salas.find(
                  (candidato) => candidato.id === salaId,
                );
                return (
                  <div key={salaId}>
                    <span>{indice + 1}</span>
                    <strong>{sala?.nome ?? salaId}</strong>
                  </div>
                );
              })}
            </div>
            {atualSala.idsDasProximasSalas.length > 0 && !salaResolvido ? (
              <p className="atenuado pequeno-texto">
                Novas conexões ficam disponíveis depois de resolver a sala
                atual.
              </p>
            ) : null}
          </article>

          {execucao.extracaoSeguraDisponivel && !execucao.concluido && !emChefePortao ? (
            <button
              className="discreto-botao completo-largura"
              type="button"
              disabled={ocupado}
              onClick={() => void tratarExtrair()}
            >
              Retirar em segurança
            </button>
          ) : null}
        </aside>
      </div>
    </section>
  );
}

/**
 * @file Fluxo de Dún Liath: contrato, preparação segura, expedição por salas e retorno.
 * A viagem ativa vive na partida persistida; mensagem, preparação e último resultado
 * são estados de apresentação. Toda decisão relevante solicita gravação por callback.
 */
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
} from "@paralaxe/conteudo";
import {
  aceitarContratoDeDunLiath,
  escolherCaminhoNaMasmorra,
  decidirDestinoDoProtetor,
  derivarEstatisticasDeCombateDoJogador,
  extrairExpedicaoDaMasmorra,
  resolverSalaDaMasmorra,
  gerarDunLiathProcedural,
  obterDificuldadesDesbloqueadasDaMasmorra,
  type DificuldadeDaMasmorra,
  retomarTrabalhoAposRisco,
  iniciarMasmorraComContinuidade,
  ensinarEEquiparHabilidadesDeCombate,
  type ResultadoDeCombate,
  type DefinicaoDeSalaDaMasmorra,
  type PartidaLocal,
} from "@paralaxe/dominio";
import { Button, Card } from "@/components/ui";
import { rotulosDaInterface } from "@/rotulosDaInterface";
import estilos from "./BancadaDaMasmorra.module.css";

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

/** Texto de ambientação por ID; rotas, inimigos e efeitos das salas vêm dos catálogos e do domínio. */
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

/** Acrescenta ao nome a presença de combate ou recuperação para comunicar a natureza da próxima sala. */
function salaRotulo(sala: DefinicaoDeSalaDaMasmorra) {
  const sufixo = sala.idDaDefinicaoDoInimigo
    ? " · Combate"
    : sala.tipo === "recuperacao"
      ? " · Recuperação"
      : "";
  return `${sala.nome}${sufixo}`;
}

/** Traduz os saques conhecidos para apresentação, mantendo o ID visível como alternativa quando faltar rótulo. */
function itemRotulo(idDaDefinicao: string) {
  const rotulos: Record<string, string> = {
    "item.tratado-fragmento": "Fragmento do Tratado",
    "item.guarnicao-suprimento-registroDeDados": "Registro de Suprimentos",
    "item.dun-liath.viga": "Viga de Dún Liath",
    "item.dun-liath.sucata": "Sucata de Dún Liath",
    "item.dun-liath.lacre-comandante": "Lacre do Comandante",
    "item.dun-liath.registro-arquivo": "Registro do Arquivo Selado",
    "item.fairtheoir-fragmento": "Fragmento de Fairtheoir",
    "item.consumivel.campo-preparacao": "Preparado de Campo",
  };
  return rotulos[idDaDefinicao] ?? idDaDefinicao;
}

/** Mostra qual coleta ou receita foi preservada para continuar após a situação de risco. */
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

/** Escolhe a apresentação conforme preparação, viagem ativa e sala atual; não mantém uma segunda cópia da expedição. */
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
  const [dificuldadeSelecionada, definirDificuldadeSelecionada] = useState<DificuldadeDaMasmorra>('facil');
  const [preparando, definirPreparando] = useState(false);

  const execucao = partida.masmorra.expedicaoAtiva;
  const dificuldadesDisponiveis = obterDificuldadesDesbloqueadasDaMasmorra(partida.masmorra);
  const nomesDasDificuldades: Record<DificuldadeDaMasmorra, string> = {
    facil: 'Fácil', normal: 'Normal', dificil: 'Difícil', impossivel: 'Impossível',
  };
  // O snapshot é a verdade para uma expedição já iniciada, inclusive após atualizar o catálogo.
  const mapaDaExpedicao = execucao?.grafoGerado ??
    (execucao ? obterDefinicaoDeMasmorra(execucao.idDaDefinicaoDaMasmorra) : null) ??
    DUN_LIATH_FACIL;
  const atualSala = useMemo<DefinicaoDeSalaDaMasmorra | null>(
    () => execucao
      ? (mapaDaExpedicao.salas.find((sala) => sala.id === execucao.idDaSalaAtual) ?? null)
      : null,
    [execucao, mapaDaExpedicao],
  );
  const salaResolvido = Boolean(
    atualSala && execucao?.idsDasSalasResolvidas.includes(atualSala.id),
  );

  // Mantém a estrutura principal ciente do risco persistido, inclusive quando uma partida é reaberta no meio da viagem.
  useEffect(() => {
    aoAlterarEstadoDeRisco?.(Boolean(execucao));
  }, [aoAlterarEstadoDeRisco, execucao]);

  useEffect(() => () => aoAlterarEstadoDeRisco?.(false), [aoAlterarEstadoDeRisco]);

  // Preparação altera a apresentação, mas ainda não pausa o trabalho; a pausa ocorre ao confirmar a entrada.
  useEffect(() => {
    aoAlterarEstadoDePreparacao?.(preparando);
  }, [aoAlterarEstadoDePreparacao, preparando]);

  useEffect(
    () => () => aoAlterarEstadoDePreparacao?.(false),
    [aoAlterarEstadoDePreparacao],
  );

  /** Espera o callback de gravação antes de anunciar localmente o resultado da ação. */
  async function persistir(proximo: PartidaLocal, textoExibido?: string) {
    await aoAlterarPartida(proximo, textoExibido);
    if (textoExibido) definirMensagem(textoExibido);
  }

  /** Exige o serviço da estrada, prepara as técnicas da classe e solicita os suprimentos únicos do contrato. */
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

  /** Credita e pausa o trabalho seguro, deriva recursos com equipamento e cria uma expedição com semente própria. */
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
      // A entrada usa máximos derivados com bônus de equipamentos; passar estes valores evita depender do cálculo básico de apoio.
      const recursosIniciais = {
        vida: estatisticas.vidaMaxima,
        vidaMaxima: estatisticas.vidaMaxima,
        mana: estatisticas.manaMaxima,
        manaMaxima: estatisticas.manaMaxima,
        folego: estatisticas.folegoMaximo,
        folegoMaximo: estatisticas.folegoMaximo,
      };
      // A primeira visita é narrativa e fixa. Repetições variam com a semente da viagem.
      const baseDaDificuldade = obterDefinicaoDeMasmorra(`masmorra.dun-liath.${dificuldadeSelecionada}`);
      if (!baseDaDificuldade) throw new Error('A dificuldade escolhida não existe.')
      if (!obterDificuldadesDesbloqueadasDaMasmorra(riscoPartida.masmorra).includes(dificuldadeSelecionada)) {
        throw new Error('Conclua a dificuldade anterior antes de entrar.')
      }
      const definicaoDaViagem = dificuldadeSelecionada === 'facil' && !riscoPartida.masmorra.dunLiathFacilConquistado
        ? DUN_LIATH_FACIL
        : gerarDunLiathProcedural(baseDaDificuldade, semente, {
          possuiLacreDoComandante: riscoPartida.personagem.inventario.some(item =>
            item.idDaDefinicao === 'item.dun-liath.lacre-comandante' && item.quantidade > 0),
        });
      const proximo = iniciarMasmorraComContinuidade(
        riscoPartida,
        definicaoDaViagem,
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

  /**
   * Entrega a sala ao domínio, guarda seu resultado visual e persiste sucesso ou derrota.
   * Somente o fim da expedição retoma o trabalho; vencer uma sala intermediária mantém o risco.
   */
  async function tratarResolver() {
    if (!execucao || !atualSala || ocupado) return;
    definirOcupado(true);
    try {
      const agora = new Date().toISOString();
      const resultado = resolverSalaDaMasmorra(
        partida,
        mapaDaExpedicao,
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

  /** Grava a saída escolhida e limpa o resultado do encontro anterior para apresentar a nova sala. */
  async function tratarCaminho(proximoSalaId: string) {
    if (ocupado) return;
    definirOcupado(true);
    try {
      const proximo = escolherCaminhoNaMasmorra(
        partida,
        mapaDaExpedicao,
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

  /** Grava a escolha narrativa antes de permitir a resolução do evento; ocupado evita reenvios durante a operação. */
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

  /** Solicita a transferência segura dos saques, reinicia o relógio do trabalho e retorna à visão de Aventura. */
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

  // A preparação só existe sem viagem ativa e informa as consequências antes de chamar tratarIniciar.
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
          <Button
            variant="secondary"
            size="sm"
            onClick={() => definirPreparando(false)}
          >
            {rotulosDaInterface.voltar}
          </Button>
        </div>

        <div className="preparacao-disposicao">
          <div className="contexto-arte contexto-arte--risco" aria-hidden="true">
            <span>ARTE 16:9 · DÚN LIATH</span>
          </div>
          <Card as="aside" className="preparacao-resumo">
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
              <span>Dificuldade</span>
              <strong>{nomesDasDificuldades[dificuldadeSelecionada]}</strong>
            </div>
            <div className="informacao-linhaDeDados">
              <span>Atividade atual</span>
              <strong>{ativoTrabalhoRotulo(partida)}</strong>
            </div>
          </Card>
        </div>

        <div className="preparacao-cartoes secao-espacamento">
          <Card>
            <p className="secao-chamada">Equipamento</p>
            <h3>10 espaços do personagem</h3>
            <p className="atenuado">O equipamento atual será usado na entrada.</p>
          </Card>
          <Card>
            <p className="secao-chamada">Técnicas</p>
            <h3>{4 - vazioTecnicas}/4 configuradas</h3>
            <p className="atenuado">
              A ordem visível corresponde à prioridade real do combate.
            </p>
          </Card>
          <Card>
            <p className="secao-chamada">Consumíveis</p>
            <h3>{2 - vazioConsumiveis}/2 preparados</h3>
            <p className="atenuado">Consumir ocupa a ação atual.</p>
          </Card>
          <Card>
            <p className="secao-chamada">Estilo</p>
            <h3>{partida.combate.preferencias.estilo}</h3>
            <p className="atenuado">Agressivo, Defensivo ou Misto.</p>
          </Card>
        </div>

        <Card className="confirmar-painel secao-espacamento">
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
          <Button
            variant="primary"
            size="sm"
            disabled={ocupado}
            onClick={() => void tratarIniciar()}
          >
            Entrar em Dún Liath
          </Button>
        </Card>
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
        className="funcionalidade-telaDoJogo"
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
              risco. {partida.masmorra.dunLiathFacilConquistado
                ? 'Novas incursões geram caminhos, armadilhas e passagens opcionais.'
                : 'A primeira visita segue os acontecimentos do contrato.'}
            </p>
          </div>
          {aoRetorno ? (
            <Button variant="secondary" size="sm" onClick={aoRetorno}>
              {rotulosDaInterface.voltarAAventura}
            </Button>
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

        <div className={`${estilos.entradaGrade} secao-espacamento`}>
          <Card>
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
          </Card>
          <Card className="risco-painel">
            <p className="secao-chamada">Dificuldade da expedição</p>
            <div className="botao-linhaDeDados" role="group" aria-label="Escolher dificuldade">
              {(['facil','normal','dificil','impossivel'] as const).map(d => (
                <Button key={d} variant={dificuldadeSelecionada === d ? 'primary' : 'secondary'}
                  size="sm" disabled={ocupado || !dificuldadesDisponiveis.includes(d)}
                  onClick={() => definirDificuldadeSelecionada(d)}>{nomesDasDificuldades[d]}</Button>
              ))}
            </div>
            <p className="atenuado">Desbloqueie cada dificuldade concluindo a anterior. Desafios maiores têm inimigos mais fortes.</p>
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
              <Button
                variant="primary"
                disabled={ocupado || !partida.combate.loboDerrotado}
                onClick={() => void tratarAceitarContrato()}
              >
                Aceitar contrato
              </Button>
            ) : (
              <Button
                variant="primary"
                disabled={ocupado}
                onClick={() => definirPreparando(true)}
              >
                Preparar expedição
              </Button>
            )}
          </Card>
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
      className="funcionalidade-telaDoJogo"
      aria-labelledby="masmorra-execucao-titulo"
    >
      <div className={estilos.execucaoCabecalho}>
        <div>
          <p className="secao-chamada">Dún Liath · {nomesDasDificuldades[execucao.dificuldade]} · Expedição ativa</p>
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

      <div className={estilos.execucaoGrade}>
        <div>
          <div className="contexto-arte contexto-arte--masmorra" aria-hidden="true">
            <span>ARTE 16:9 · {atualSala.nome.toUpperCase()}</span>
          </div>
          <Card className={estilos.salaPainel}>
            <p className="secao-chamada">Sala atual</p>
            <h3>{salaRotulo(atualSala)}</h3>
            <p className="atenuado">{atualSala.descricao ?? salaTexto[atualSala.id] ?? 'A fortificação muda, mas as marcas da guerra e da ocupação permanecem.'}</p>

            <div className={estilos.recursoGrade}>
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
              <div className={estilos.escolhaNarrativa}>
                <p>
                  Uma criatura ferida protege outra menor. Nenhuma recompensa ou
                  classificação moral é apresentada.
                </p>
                <div className="botao-linhaDeDados">
                  <Button
                    variant="secondary"
                    size="sm"
                    disabled={ocupado}
                    onClick={() => void tratarProtetor("morto")}
                  >
                    Matar
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    disabled={ocupado}
                    onClick={() => void tratarProtetor("poupado")}
                  >
                    Poupar
                  </Button>
                </div>
              </div>
            ) : null}

            {!salaResolvido ? (
              <Button
                variant="primary"
                size="sm"
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
              </Button>
            ) : null}
          </Card>

          {resultadoDeCombate ? (
            <Card className={`${estilos.resultadoEncontro} ${resultadoDeCombate.desfecho === "derrota" ? estilos.derrota : ""}`}>
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
            </Card>
          ) : null}

          {salaResolvido && atualSala.idsDasProximasSalas.length > 0 && !emChefePortao ? (
            <div
              className={`masmorra-caminhos ${estilos.caminhos} ${ramoEscolha ? estilos.caminhosRamo : ""}`}
            >
              {atualSala.idsDasProximasSalas.map((salaId) => {
                const sala = mapaDaExpedicao.salas.find(
                  (candidato) => candidato.id === salaId,
                );
                return sala ? (
                  <Button
                    variant="route"
                    key={salaId}
                    disabled={ocupado || Boolean(sala.requisitoDeItemParaEntrar &&
                      !partida.personagem.inventario.some(item =>
                        item.idDaDefinicao === sala.requisitoDeItemParaEntrar && item.quantidade > 0))}
                    onClick={() => void tratarCaminho(salaId)}
                  >
                    <span className="secao-chamada">Próxima rota</span>
                    <strong>{atualSala.pistasDasSaidas?.[salaId]
                      ?? (salaId === 'sala.alojamentos'
                        ? 'Marcas recentes atravessam a poeira rumo ao quartel.'
                        : salaId === 'sala.administracao'
                          ? 'Uma porta antiga traz o selo corroído da guarnição.'
                          : 'Um corredor de pedra molhada segue para o interior.')}</strong>
                    <small>
                      {ramoEscolha
                        ? "Essa escolha fecha a alternativa nesta expedição."
                        : "Seguir adiante"}
                    </small>
                  </Button>
                ) : null;
              })}
            </div>
          ) : null}

          {/* O portão do chefe explicita a escolha entre assegurar o saque atual e continuar assumindo risco. */}
          {salaResolvido && emChefePortao ? (
            <div className={estilos.confirmarChefe}>
              <p className="secao-chamada">Portão do Bastião</p>
              <h3>Além deste ponto está Fairtheoir.</h3>
              <p className="atenuado">
                Retornar assegura a Bolsa. Continuar mantém tudo em risco.
              </p>
              <div className="botao-linhaDeDados">
                {execucao.extracaoSeguraDisponivel ? (
                  <Button
                    variant="secondary"
                    size="sm"
                    disabled={ocupado}
                    onClick={() => void tratarExtrair()}
                  >
                    Retornar e assegurar Bolsa
                  </Button>
                ) : null}
                {atualSala.idsDasProximasSalas.map((salaId) => (
                  <Button
                    variant="primary"
                    size="sm"
                    key={salaId}
                    disabled={ocupado}
                    onClick={() => void tratarCaminho(salaId)}
                  >
                    Abrir o portão
                  </Button>
                ))}
              </div>
            </div>
          ) : null}

          {execucao.concluido ? (
            <Card className={estilos.painelConclusao}>
              <p className="secao-chamada">Dún Liath concluída</p>
              <h3>Fairtheoir caiu.</h3>
              <p className="atenuado">
                O conclusão e o conteúdo da Bolsa ainda precisam ser assegurados
                pelo retorno.
              </p>
              <Button
                variant="primary"
                size="sm"
                disabled={ocupado}
                onClick={() => void tratarExtrair()}
              >
                Retornar à Cidade Livre
              </Button>
            </Card>
          ) : null}
        </div>

        {/* A bolsa mostra saque provisório; a rota lista apenas salas já visitadas, sem transformar navegação em movimento livre. */}
        <aside className={estilos.lateral}>
          <Card className="expedicao-bolsa">
            <p className="secao-chamada">Bolsa de Expedição</p>
            <h3>Em risco</h3>
            {execucao.bolsaDaExpedicao.length === 0 &&
            execucao.equipamentosDaExpedicao.length === 0 ? (
              <p className="atenuado">Nada encontrado nesta expedição ainda.</p>
            ) : null}
            {execucao.bolsaDaExpedicao.map((pilha) => (
              <div className={estilos.linhaSaque} key={pilha.idDaDefinicao}>
                <span>{itemRotulo(pilha.idDaDefinicao)}</span>
                <strong>×{pilha.quantidade}</strong>
              </div>
            ))}
            {execucao.equipamentosDaExpedicao.map((item, indice) => (
              <div className={estilos.linhaSaque} key={`${item.idDaDefinicao}-${indice}`}>
                <span>{item.idDaDefinicao}</span>
                <strong>{item.raridade}</strong>
              </div>
            ))}
            <p className="risco-texto">
              Uma derrota perde esta Bolsa. O patrimônio que já estava seguro
              não está em risco.
            </p>
          </Card>

          <Card className="masmorra-mapa-cartao">
            <p className="secao-chamada">Rota descoberta</p>
            <div className={estilos.percurso}>
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
          </Card>

          {execucao.extracaoSeguraDisponivel && !execucao.concluido && !emChefePortao ? (
            <Button
              variant="secondary"
              fullWidth
              disabled={ocupado}
              onClick={() => void tratarExtrair()}
            >
              Retirar em segurança
            </Button>
          ) : null}
        </aside>
      </div>
    </section>
  );
}

import LimiteDeErroDaTela from './components/jogo/LimiteDeErroDaTela/LimiteDeErroDaTela'
import type { PersistirAlteracaoDaPartida } from "./services/alteracoesDaPartida";
import { catalogoDeCombate } from './services/combateDaEstrada';
/**
 * @file Estrutura visual da partida e navegação entre Personagem, Atividades, Aventura e Cidade.
 * Recebe a partida persistida e callbacks de Aplicativo; suas abas e painéis são estado
 * transitório de apresentação. Consultar outra tela não inicia nem cancela um trabalho.
 */
import {
  ATIVIDADES_OCIOSAS_INICIAIS,
  CLASSES_DE_PERSONAGEM,
  obterHistoriaDaJornada,
  RECEITAS_INICIAIS_DE_FABRICACAO
} from "@paralaxe/conteudo";
import {
  derivarEstatisticasDeCombateDoJogador,
  type DistribuicaoDeAtributos,
  type IdDaProfissao,
  type PartidaLocal,
  type PrioridadeDeOficio
} from "@paralaxe/dominio";
import { lazy, Suspense, useEffect, useMemo, useRef, useState } from "react";
import IndicadorDeProgressoOcioso from "./features/atividades/IndicadorDeProgressoOcioso";
import { MODOS_DE_LARGURA, proximoModoDeLargura, rotuloDoModoDeLargura, type ModoDeLargura } from "./features/navegacao/modosDeLargura";
import { usePreferenciaDeTela } from "./hooks/usePreferenciaDeTela";

import { IconeDoJogo } from "./components/jogo";
import CreditosDosRecursos from "./components/jogo/CreditosDosRecursos";
import { Button, Card } from "./components/ui";
import { MenuDeOpcoes, type OpcaoDeMenu } from "./components/ui/MenuDeOpcoes/MenuDeOpcoes";
import { SeloDeNavegacao } from "./components/ui/SeloDeNavegacao/SeloDeNavegacao";
import {
  type AcoesDoLegado
} from './features/cidade/LegadoDaCidade';
import GradeDoInventario from "./features/inventario/GradeDoInventario";
import MetaDaJornada, { ResumoDaMetaDaJornada } from "./features/jornada/MetaDaJornada";
import PainelRapido from "./features/navegacao/PainelRapido";
import type { TemaDaInterface } from "./hooks/useTemaDaInterface";
import { iconeDeAtalhoPorId, iconeDeProfissaoPorId, iconeDoPainelPorId } from "./iconesDosRecursos";
import { rotulosDasProfissoes } from "./rotulosDoJogo";

import type { AbaDoPersonagem, DestinoPrincipal, PainelRapidoAtivo, TelaDaCidade, TelaDeAventura } from "./features/navegacao/tiposDeNavegacao";
const TelaDoPersonagem = lazy(() => import("./features/personagem/TelaDoPersonagem"));
const ComponenteDaTelaDeAventura = lazy(() => import("./features/aventura/TelaDeAventura"));
const ComponenteDaTelaDaCidade = lazy(() => import("./features/cidade/TelaDaCidade"));
const TelaDeAtividades = lazy(() => import("./features/atividades/TelaDeAtividades"));

/** Contrato entre a coordenação da partida e suas telas. Alterações são enviadas pelos callbacks, não ao IndexedDB. */
type PropriedadesDeEstruturaDoJogo = {
  partida: PartidaLocal;
  mensagem: string | null;
  tipoDaMensagem: "informacao" | "conquista";
  ultimoResultadoDoTrabalho: string | null;
  aoDispensarMensagem: () => void;
  riscoAtivo: boolean;
  aoAlterarEstadoDeRisco: (ativo: boolean) => void;
  aoAlternarPartida: () => void;
  aoSairDoAcesso?: () => Promise<void>;
  aoAbrirDebug: () => Promise<void>;
  debugPendente: boolean;
  temaDaInterface: TemaDaInterface;
  aoAlternarTema: () => void;
  aoPersistir: PersistirAlteracaoDaPartida;
  aoConcluirProjeto: AcoesDoLegado['aoConcluirProjeto'];
  aoComprarOfertaDoMercado: (idDaOferta: string) => Promise<void>;
  prepararRisco: () => Promise<PartidaLocal>;
  aoIniciarAtividade: (idDaDefinicaoDaAtividade: string) => Promise<void>;
  aoIniciarAtividadeSecundaria: (id: string) => Promise<void>;
  aoPararAtividadeSecundaria: () => Promise<void>;
  aoIniciarAtividadeTerciaria: (id: string) => Promise<void>;
  aoPararAtividadeTerciaria: () => Promise<void>;
  aoAlterarPrioridade: (prioridade: PrioridadeDeOficio) => Promise<void>;
  aoResponderMinigame: (oficio: IdDaProfissao, resposta: number) => Promise<void>;
  aoIniciarReceitaSecundaria: (id: string) => Promise<void>;
  aoPararReceitaSecundaria: () => Promise<void>;
  aoIniciarReceitaTerciaria: (id: string) => Promise<void>;
  aoPararReceitaTerciaria: () => Promise<void>;
  aoIniciarReceita: (
    idDaDefinicaoDaReceita: string,
    idDaInstanciaDoEquipamentoAlvo?: string | null,
  ) => Promise<void>;
  aoEscolherMetaDaJornada: (idDaReceita: string | null) => Promise<void>;
  aoPararTrabalho: () => Promise<void>;
  aoPrestigiarProfissao: (idDaProfissao: IdDaProfissao) => Promise<void>;
  aoEquipar: (idDaInstancia: string) => Promise<void>;
  aoDistribuirAtributos: (distribuicao: DistribuicaoDeAtributos) => Promise<void>;
  aoRealizarPrestigioDoPersonagem: () => Promise<void>;
  aoDesbloquearNoDePrestigio: (noId: string) => Promise<void>;
  aoDepositarPilhaNoBanco: (idDaDefinicao: string, quantidade: number) => Promise<void>;
  aoRetirarPilhaDoBanco: (
    idDaDefinicao: string,
    quantidade: number,
  ) => Promise<void>;
  aoDepositarEquipamentoNoBanco: (idDaInstancia: string) => Promise<void>;
  aoRetirarEquipamentoDoBanco: (idDaInstancia: string) => Promise<void>;
};

/** Resume a coleta ou receita efetivamente selecionada na partida, independentemente da tela em consulta. */
function ativoTrabalho(partida: PartidaLocal) {
  if (partida.ocioso.atividadeAtiva) {
    const atividade = ATIVIDADES_OCIOSAS_INICIAIS.find(
      (candidato) =>
        candidato.id === partida.ocioso.atividadeAtiva?.idDaDefinicaoDaAtividade,
    );
    return atividade
      ? {
          titulo: `${rotulosDasProfissoes[atividade.idDaProfissao]} · ${atividade.nomeDoResultado}`,
          detalhe: `${atividade.segundosPorAcao}s por ciclo`,
          idDaProfissao: atividade.idDaProfissao,
        }
      : null;
  }
  if (partida.fabricacao.receitaAtiva) {
    const receita = RECEITAS_INICIAIS_DE_FABRICACAO.find(
      (candidato) =>
        candidato.id === partida.fabricacao.receitaAtiva?.idDaDefinicaoDaReceita,
    );
    return receita
      ? {
          titulo: `${rotulosDasProfissoes[receita.idDaProfissao]} · ${receita.nome}`,
          detalhe: `${receita.segundosPorAcao}s por ciclo`,
          idDaProfissao: receita.idDaProfissao,
        }
      : null;
  }
  return null;
}

/** Compõe cabeçalho, navegação, conteúdo, resumo lateral e barra contínua do trabalho ativo. */
export default function EstruturaDoJogo({
  partida,
  mensagem,
  tipoDaMensagem,
  ultimoResultadoDoTrabalho,
  aoDispensarMensagem,
  riscoAtivo,
  aoAlterarEstadoDeRisco,
  aoAlternarPartida,
  aoSairDoAcesso,
  aoAbrirDebug,
  debugPendente,
  temaDaInterface,
  aoAlternarTema,
  aoPersistir,
  aoConcluirProjeto,
  aoComprarOfertaDoMercado,
  prepararRisco,
  aoIniciarAtividade,
  aoIniciarAtividadeSecundaria,
  aoPararAtividadeSecundaria,
  aoIniciarAtividadeTerciaria,
  aoPararAtividadeTerciaria,
  aoIniciarReceita,
  aoIniciarReceitaSecundaria,
  aoPararReceitaSecundaria,
  aoIniciarReceitaTerciaria,
  aoPararReceitaTerciaria,
  aoAlterarPrioridade,
  aoResponderMinigame,
  aoEscolherMetaDaJornada,
  aoPararTrabalho,
  aoPrestigiarProfissao,
  aoEquipar,
  aoDistribuirAtributos,
  aoRealizarPrestigioDoPersonagem,
  aoDesbloquearNoDePrestigio,
  aoDepositarPilhaNoBanco,
  aoRetirarPilhaDoBanco,
  aoDepositarEquipamentoNoBanco,
  aoRetirarEquipamentoDoBanco,
}: PropriedadesDeEstruturaDoJogo) {
  // Preferências de interface não modificam o save; risco persistido sempre prevalece.
  const restaurarTela = !partida.masmorra.expedicaoAtiva && !partida.masmorra.incursaoAutomaticaAtiva;
  const chaveDaTela = partida.idDaPartida;
  const [destino, definirDestino] = usePreferenciaDeTela<DestinoPrincipal>(
    `${chaveDaTela}.destino`, restaurarTela ? "personagem" : "aventura", ["personagem", "atividades", "aventura", "cidade"], restaurarTela,
  );
  const [personagemAba, definirPersonagemAba] = usePreferenciaDeTela<AbaDoPersonagem>(
    `${chaveDaTela}.personagem`, "visaoGeral", ["visaoGeral", "atributos", "equipamento", "tecnicas", "inventario", "prestigio"],
  );
  const [profissaoSelecionada, definirSelecionadoProfissao] = usePreferenciaDeTela<IdDaProfissao>(
    `${chaveDaTela}.oficio`, ativoTrabalho(partida)?.idDaProfissao ?? "mineracao", ["mineracao", "lenhador", "pesca", "herbologia", "metalurgia", "forja", "culinaria"],
  );
  const [aventuraTelaDoJogo, definirAventuraTelaDoJogo] = usePreferenciaDeTela<TelaDeAventura>(
    `${chaveDaTela}.aventura`, restaurarTela ? "visaoGeral" : "masmorra", ["visaoGeral", "servico", "masmorra", "desafios", "grupo"], restaurarTela,
  );
  const [cidadeTelaDoJogo, definirCidadeTelaDoJogo] = usePreferenciaDeTela<TelaDaCidade>(
    `${chaveDaTela}.cidade`, "visaoGeral", ["visaoGeral", "taverna", "mercado", "ferreiro", "banco", "relicario", "codice", "reconstrucao"],
  );
  const [larguraDeLeitura, definirLarguraDeLeitura] = usePreferenciaDeTela<ModoDeLargura>(
    "largura-de-leitura", "normal", MODOS_DE_LARGURA,
  );
  const [rapidoPainel, definirRapidoPainel] = useState<PainelRapidoAtivo>(null);
  const [preparacaoAtivo, definirPreparacaoAtivo] = useState(false);

  const estatisticas = useMemo(
    () => derivarEstatisticasDeCombateDoJogador(partida, catalogoDeCombate),
    [partida],
  );
  const nomeDaClasse = CLASSES_DE_PERSONAGEM.find(
    (item) => item.id === partida.personagem.idDaClasse,
  )?.nome;
  const trabalho = ativoTrabalho(partida);
  const numeroDeTrabalhosAtivos = [
    partida.ocioso.atividadeAtiva,
    partida.ocioso.atividadeSecundaria,
    partida.ocioso.atividadeTerciaria,
    partida.fabricacao.receitaAtiva,
    partida.fabricacao.receitaSecundaria,
    partida.fabricacao.receitaTerciaria,
  ].filter(Boolean).length;
  const jornada = obterHistoriaDaJornada(partida);
  const masmorraAtivo = Boolean(partida.masmorra.expedicaoAtiva || partida.masmorra.incursaoAutomaticaAtiva);
  // O risco temporário do combate e a expedição persistida bloqueiam a navegação e pausam a barra de trabalho.
  const focadoRisco = riscoAtivo || masmorraAtivo;
  const conteudoRef = useRef<HTMLElement>(null);
  const telaAtual = destino === "cidade" ? `cidade/${cidadeTelaDoJogo}` : destino === "aventura" ? `aventura/${aventuraTelaDoJogo}` : destino;
  const ultimaTela = useRef(telaAtual);

  useEffect(() => {
    const mudou = ultimaTela.current !== telaAtual;
    ultimaTela.current = telaAtual;
    // Voltar ou abrir uma bancada pode desmontar o controle que tinha o foco.
    if (mudou && document.activeElement === document.body) conteudoRef.current?.focus();
  }, [telaAtual]);

  /** Muda o destino principal em contexto seguro e fecha consultas rápidas para evitar painéis fora de contexto. */
  function ir(proximo: DestinoPrincipal) {
    if (focadoRisco) return;
    definirDestino(proximo);
    definirRapidoPainel(null);

  }

  /** Direciona para uma bancada específica de Aventura e fecha a consulta rápida que originou a navegação. */
  function abrirAventura(telaDoJogo: TelaDeAventura) {
    definirDestino("aventura");
    definirAventuraTelaDoJogo(telaDoJogo);
    definirRapidoPainel(null);
  }

  /** Sai do resumo da bolsa para a aba completa de inventário, mantendo a mesma partida. */
  function abrirCompletoInventario() {
    definirDestino("personagem");
    definirPersonagemAba("inventario");
    definirRapidoPainel(null);
  }

  /** Abre uma profissão para consulta; a troca de trabalho depende de um comando separado de início. */
  function abrirProfissao(profissao: IdDaProfissao) {
    if (focadoRisco) return;
    definirSelecionadoProfissao(profissao);
    ir("atividades");
  }

  /** Atalho seguro da jornada para inspecionar ou equipar o resultado de uma fabricação. */
  function abrirEquipamento() {
    if (focadoRisco) return;
    definirPersonagemAba("equipamento");
    ir("personagem");
  }

  /** Abre o contexto de Brann na Cidade após fechar a consulta rápida da jornada. */
  function abrirTaverna() {
    if (focadoRisco) return;
    ir("cidade");
    definirCidadeTelaDoJogo("taverna");
  }

  const principalClasse = `game-shell ${focadoRisco ? "jogo-estrutura--risco" : ""} ${preparacaoAtivo && !focadoRisco ? "jogo-estrutura--preparacao" : ""}`;

  // Única configuração do menu: novas opções são acrescentadas nesta lista, sem alterar o componente.
  const opcoesDoMenu: readonly OpcaoDeMenu[] = [
    {
      id: "alternar-tema",
      grupo: "Aparência",
      titulo: temaDaInterface === "escuro" ? "Ativar tema claro" : "Ativar tema escuro",
      descricao: `Tema atual: ${temaDaInterface}. Preferência salva neste navegador.`,
      icone: <IconeDoJogo icone="aparencia" tamanho={21} />,
      acao: aoAlternarTema,
    },
    {
      id: "largura-leitura",
      grupo: "Aparência",
      titulo: `Largura de leitura: ${rotuloDoModoDeLargura[larguraDeLeitura]}`,
      descricao: "Alternar entre foco, confortável e ampla em telas maiores. Não modifica o personagem.",
      icone: <IconeDoJogo icone="largura" tamanho={21} />,
      acao: () => definirLarguraDeLeitura(atual => proximoModoDeLargura(atual)),
    },
    {
      id: "debug-maximo",
      grupo: "Testes",
      titulo: debugPendente ? "Preparando debug…" : partida.depuracao ? "Repor tudo no máximo" : "Debug: tudo no máximo",
      descricao: focadoRisco
        ? "Disponível ao retornar a um lugar seguro."
        : partida.depuracao
          ? "Restaura progressão e estoques desta partida de teste."
          : "Abre uma cópia de teste com tudo liberado. Seu personagem atual é preservado.",
      icone: <IconeDoJogo icone="opcoes" tamanho={21} />,
      desabilitada: focadoRisco || debugPendente,
      acao: () => { void aoAbrirDebug(); },
    },
    {
      id: "personagens",
      grupo: "Partida",
      titulo: "Escolher personagem",
      descricao: focadoRisco
        ? "Indisponível durante combate ou expedição."
        : "Voltar aos personagens salvos sem apagar o progresso.",
      icone: <IconeDoJogo icone="elmo-barbuta" tamanho={21} />,
      desabilitada: focadoRisco || debugPendente,
      acao: aoAlternarPartida,
    },
    ...(aoSairDoAcesso ? [{
      id: "sair-acesso", grupo: "Acesso", titulo: "Sair do acesso local",
      descricao: "Voltar à entrada. Seus personagens permanecem salvos.",
      desabilitada: focadoRisco || debugPendente,
      acao: () => { void aoSairDoAcesso(); },
    }] : []),
  ];

  return (
    <div className={principalClasse} data-destination={destino} data-largura={larguraDeLeitura}>
      <a className="pular-ligacao" href="#jogo-conteudo">
        Ir para o jogo
      </a>
      <header className="jogo-barraSuperior">
        <div className="jogador-identidade">
          <div className="avatar-marcador" aria-hidden="true">
            <IconeDoJogo icone="elmo-barbuta" tamanho={32} />
          </div>
          <div>
            <strong className="jogador-nome">{partida.personagem.nome}</strong>
            <span>
              {nomeDaClasse} · Nível {partida.personagem.nivel}
            </span>
          </div>
        </div>
        <div className="global-recursos-grupo">
          <dl
            className="global-recursos"
            aria-label="Estado global do personagem"
          >
            <div>
              <dt className="recurso-simbolo vida-simbolo" aria-hidden="true">
                <IconeDoJogo icone={iconeDoPainelPorId.vidaMaxima} tamanho={19} />
              </dt>
              <dt>Vida <span className="recurso-qualificador">máx.</span></dt>
              <dd>{estatisticas.vidaMaxima}</dd>
            </div>
            <div>
              <dt className="recurso-simbolo mana-simbolo" aria-hidden="true">
                <IconeDoJogo icone={iconeDoPainelPorId.manaMaxima} tamanho={19} />
              </dt>
              <dt>Mana <span className="recurso-qualificador">máx.</span></dt>
              <dd>{estatisticas.manaMaxima}</dd>
            </div>
            <div>
              <dt className="recurso-simbolo folego-simbolo" aria-hidden="true">
                <IconeDoJogo icone={iconeDoPainelPorId.folegoMaximo} tamanho={19} />
              </dt>
              <dt>Fôlego <span className="recurso-qualificador">máx.</span></dt>
              <dd>{estatisticas.folegoMaximo}</dd>
            </div>
            <div>
              <dt className="recurso-simbolo moeda-simbolo" aria-hidden="true">
                <IconeDoJogo icone={iconeDoPainelPorId.ouro} tamanho={19} />
              </dt>
              <dt>Moeda</dt>
              <dd>{partida.personagem.ouro}</dd>
            </div>
          </dl>
          <MenuDeOpcoes itens={opcoesDoMenu} iconeDoGatilho={<IconeDoJogo icone="opcoes" tamanho={20} />} />
        </div>
      </header>

      <aside className="jogo-barraLateral" aria-label="Menu do jogo">
        <div className="jogo-marca">
          <span className="marca-simbolo" aria-hidden="true">
            <IconeDoJogo icone="espada-longa" tamanho={48} />
          </span>
          <strong>PARALAXE</strong>
          <small>CRÔNICAS DA CIDADE LIVRE</small>
          <span className="marca-ornamento" aria-hidden="true" />
        </div>
        <nav className="principal-navegacao" aria-label="Navegação principal">
          {(
            [
              ["personagem", "Personagem", "elmo-barbuta", "Seu legado"],
              ["atividades", "Atividades", "picareta", "Ofícios e recursos"],
              ["aventura", "Aventura", "espada-longa", "Além dos portões"],
              ["cidade", "Cidade", "livro-abrir", "Abrigo e comércio"],
            ] as const
          ).map(([id, rotulo, icone, detalhe]) => (
            <Button
              variant="navigation"
              icon={<IconeDoJogo icone={icone} tamanho={32} />}
              key={id}
              disabled={focadoRisco}
              aria-current={destino === id ? "page" : undefined}
              aria-label={id === "atividades" && numeroDeTrabalhosAtivos > 0
                ? `Atividades, ${numeroDeTrabalhosAtivos} trabalho(s) em andamento`
                : rotulo}
              onClick={() => ir(id)}
            >
              <span>
                {rotulo}
                {id === "atividades" ? <SeloDeNavegacao quantidade={numeroDeTrabalhosAtivos} /> : null}
                <small>{detalhe}</small>
              </span>
            </Button>
          ))}
        </nav>
        <div
          className={`reino-situacao ${focadoRisco ? "reino-situacao--risco" : ""}`}
        >
          <span className="reino-leve" aria-hidden="true" />
          <strong>{focadoRisco ? "Em expedição" : "Cidade Livre"}</strong>
          <small>
            {focadoRisco ? "Atividade externa pausada" : "Território seguro"}
          </small>
        </div>
        <div className="barraLateral-notaDeRodape">
          O mundo espera.
          <br />
          Seu legado permanece.
        </div>
      </aside>

      {preparacaoAtivo && !focadoRisco ? (
        <div className="preparacao-estado-faixa">
          <span>PREPARAÇÃO</span>
          <strong>Dún Liath · Ocioso continua</strong>
        </div>
      ) : null}
      {focadoRisco ? (
        <div className="risco-estado-faixa">
          <span>ESTADO DE RISCO</span>
          <strong>
            {masmorraAtivo
              ? (partida.masmorra.incursaoAutomaticaAtiva ? "Incursão Automática · Ocioso pausado" : "Dún Liath · Ocioso pausado")
              : "Combate · Ocioso pausado"}
          </strong>
          <p>A navegação está bloqueada durante o risco. Use as ações deste encontro para concluir ou retornar quando permitido.</p>
        </div>
      ) : null}

      <div className="jogo-disposicao">
        <main ref={conteudoRef} className="jogo-conteudo" id="jogo-conteudo" tabIndex={-1}>
          <LimiteDeErroDaTela key={destino}>
          <Suspense fallback={<p role="status">Carregando tela…</p>}>
          {!focadoRisco ? (
            <ResumoDaMetaDaJornada
              partida={partida}
              aoAbrir={() => definirRapidoPainel("jornada")}
            />
          ) : null}

          {/* As telas recebem intenções de alteração; a coordenação superior mantém a ordem das gravações. */}
          {destino === "personagem" && personagemAba === "visaoGeral" && !focadoRisco ? (
            <section className="sessao-resumo" aria-label="Resumo da sessão">
              <Card appearance="framed">
                <p className="secao-chamada">Agora</p>
                <h2>{trabalho ? "Seu trabalho continua" : "Escolha seu próximo trabalho"}</h2>
                <IndicadorDeProgressoOcioso partida={partida} compacto />
                <p className="atenuado">{trabalho ? "Consultar outras telas seguras mantém a atividade em execução." : "Mineração, Lenhador, Pesca e Herbologia são caminhos iniciais. Você escolhe por onde começar."}</p>
                <Button variant="primary" onClick={() => abrirProfissao(trabalho?.idDaProfissao ?? profissaoSelecionada)}>
                  {trabalho ? "Acompanhar trabalho" : "Escolher um ofício"}
                </Button>
              </Card>
              <Card appearance="soft">
                <p className="secao-chamada">Minha Jornada</p>
                <h2>{jornada.titulo}</h2>
                <p className="atenuado">{jornada.corpo}</p>
                <div className="botao-linhaDeDados">
                  <Button variant="secondary" onClick={partida.combate.loboDerrotado && !partida.masmorra.contratoAceito ? abrirTaverna : () => abrirAventura(partida.masmorra.contratoAceito ? "masmorra" : "servico")}>
                    {partida.combate.loboDerrotado && !partida.masmorra.contratoAceito ? "Conversar na Taverna" : "Consultar preparação"}
                  </Button>
                  <Button variant="ghost" aria-haspopup="dialog" onClick={() => definirRapidoPainel("jornada")}>Ver meta de fabricação</Button>
                </div>
              </Card>
            </section>
          ) : null}
          {destino === "personagem" ? (
            <TelaDoPersonagem
              partida={partida}
              aba={personagemAba}
              aoAba={definirPersonagemAba}
              aoEquipar={aoEquipar}
              aoIniciarReceita={aoIniciarReceita}
              aoDistribuirAtributos={aoDistribuirAtributos}
              aoRealizarPrestigioDoPersonagem={aoRealizarPrestigioDoPersonagem}
              aoDesbloquearNoDePrestigio={aoDesbloquearNoDePrestigio}
            />
          ) : null}

          {destino === "atividades" ? (
            <TelaDeAtividades
              partida={partida}
              ultimoResultadoDoTrabalho={ultimoResultadoDoTrabalho}
              profissaoSelecionada={profissaoSelecionada}
              aoSelecionarProfissao={definirSelecionadoProfissao}
              aoIniciarAtividade={aoIniciarAtividade}
              aoIniciarAtividadeSecundaria={aoIniciarAtividadeSecundaria}
              aoPararAtividadeSecundaria={aoPararAtividadeSecundaria}
              aoIniciarAtividadeTerciaria={aoIniciarAtividadeTerciaria}
              aoPararAtividadeTerciaria={aoPararAtividadeTerciaria}
              aoIniciarReceita={aoIniciarReceita}
              aoIniciarReceitaSecundaria={aoIniciarReceitaSecundaria}
              aoPararReceitaSecundaria={aoPararReceitaSecundaria}
              aoIniciarReceitaTerciaria={aoIniciarReceitaTerciaria}
              aoPararReceitaTerciaria={aoPararReceitaTerciaria}
              aoAlterarPrioridade={aoAlterarPrioridade}
              aoResponderMinigame={aoResponderMinigame}
              aoPararTrabalho={aoPararTrabalho}
              aoPrestigiarProfissao={aoPrestigiarProfissao}
              aoTrilhaReceita={async (idDaReceita) => {
                if (partida.jornada.meta?.idDaDefinicaoDaReceita !== idDaReceita)
                  await aoEscolherMetaDaJornada(idDaReceita);
                definirRapidoPainel("jornada");
              }}
            />
          ) : null}

          {destino === "aventura" ? (
            <ComponenteDaTelaDeAventura
              partida={partida}
              telaDoJogo={aventuraTelaDoJogo}
              aoTelaDoJogo={definirAventuraTelaDoJogo}
              prepararRisco={prepararRisco}
              aoPersistir={aoPersistir}
              aoAlterarEstadoDeRisco={aoAlterarEstadoDeRisco}
              aoAlterarEstadoDePreparacao={definirPreparacaoAtivo}
            />
          ) : null}

          {destino === "cidade" ? (
            <ComponenteDaTelaDaCidade
              partida={partida}
              telaDoJogo={cidadeTelaDoJogo}
              aoTelaDoJogo={definirCidadeTelaDoJogo}
              aoAbrirAventura={() => abrirAventura("masmorra")}
              aoConcluirProjeto={aoConcluirProjeto}
              aoComprarOfertaDoMercado={aoComprarOfertaDoMercado}
              aoDepositarPilhaNoBanco={aoDepositarPilhaNoBanco}
              aoRetirarPilhaDoBanco={aoRetirarPilhaDoBanco}
              aoDepositarEquipamentoNoBanco={aoDepositarEquipamentoNoBanco}
              aoRetirarEquipamentoDoBanco={aoRetirarEquipamentoDoBanco}
            />
          ) : null}
          <div className="movel-creditos">
            <CreditosDosRecursos />
          </div>
          </Suspense>
          </LimiteDeErroDaTela>
        </main>
        {/* Resumo para telas amplas; a disposição compacta oferece os mesmos acessos em outros pontos da estrutura. */}
        <aside className="jogo-companheiro" aria-label="Resumo da jornada">
          <section className="companheiro-secao">
            <div className="companheiro-tituloDaSecao">
              <IconeDoJogo icone="livro-abrir" tamanho={24} />
              <h2>Jornada</h2>
            </div>
            <p className="secao-chamada">{jornada.rotulo}</p>
            <h3>{jornada.titulo}</h3>
            <p className="companheiro-texto">{jornada.corpo}</p>
            <Button
              variant="secondary"
              fullWidth
              disabled={focadoRisco}
              onClick={() => definirRapidoPainel("jornada")}
            >
              Consultar jornada
            </Button>
          </section>
          <section className="companheiro-secao">
            <GradeDoInventario partida={partida} compacto />
            <Button
              variant="secondary"
              fullWidth
              disabled={focadoRisco}
              onClick={abrirCompletoInventario}
            >
              Abrir bolsa
            </Button>
          </section>
          <CreditosDosRecursos />
        </aside>
      </div>

      {/* O trabalho continua visível ao navegar; clicar no resumo retorna à profissão realmente em execução. */}
      <footer className="continuidade-barra">
        <Button
          variant="activity"
          icon={<IconeDoJogo icone={trabalho ? iconeDeProfissaoPorId[trabalho.idDaProfissao] : "picareta"} tamanho={32} />}
          disabled={focadoRisco}
          type="button"
          onClick={() => {
            definirDestino("atividades");
            definirRapidoPainel(null);
            if (trabalho) definirSelecionadoProfissao(trabalho.idDaProfissao);
          }}
        >
          <IndicadorDeProgressoOcioso partida={partida} compacto pausado={focadoRisco} />
        </Button>
        <div className="continuidade-acoes">
          <Button
            variant="hud"
            icon={<IconeDoJogo icone={iconeDeAtalhoPorId.inventario} tamanho={24} />}
            disabled={focadoRisco}
            aria-haspopup="dialog"
            onClick={() => definirRapidoPainel("inventario")}
          >
            Inventário
          </Button>
          <Button
            variant="hud"
            icon={<IconeDoJogo icone="livro-abrir" tamanho={24} />}
            disabled={focadoRisco}
            aria-haspopup="dialog"
            onClick={() => definirRapidoPainel("jornada")}
          >
            Jornada
          </Button>
        </div>
      </footer>

      {mensagem ? (
        <div
          className={`jogo-aviso ${tipoDaMensagem === "conquista" ? "jogo-aviso--conquista" : ""}`}
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          <span className="jogo-aviso-icone" aria-hidden="true">
            <IconeDoJogo
              icone={tipoDaMensagem === "conquista" ? "ferreiro" : /atividad|automátic/i.test(mensagem) ? "picareta" : "livro-abrir"}
              tamanho={24}
            />
          </span>
          <div className="jogo-aviso-conteudo">
            <span className="jogo-aviso-rotulo">
              {tipoDaMensagem === "conquista" ? "Conquista" : /atividad|automátic/i.test(mensagem) ? "Atividade" : "Registro da jornada"}
            </span>
            <p className="jogo-aviso-mensagem">{mensagem}</p>
          </div>
          <Button
            className="jogo-aviso-fechar"
            variant="icon"
            onClick={aoDispensarMensagem}
            aria-label="Dispensar mensagem"
          >
            ×
          </Button>
        </div>
      ) : null}

      {/* Consultas rápidas são diálogos de contexto seguro e não criam outra cópia da partida. */}
      {rapidoPainel === "inventario" && !focadoRisco ? (
        <PainelRapido
          rotulo="Inventário"
          icone={<IconeDoJogo icone={iconeDeAtalhoPorId.inventario} tamanho={32} />}
          aoFechar={() => definirRapidoPainel(null)}
        >
          <GradeDoInventario partida={partida} compacto aoEquipar={aoEquipar} />
          <Button
            variant="secondary"
            fullWidth
            onClick={abrirCompletoInventario}
          >
            Abrir Inventário completo
          </Button>
        </PainelRapido>
      ) : null}

      {rapidoPainel === "jornada" && !focadoRisco ? (
        <PainelRapido
          rotulo="Jornada"
          icone={<IconeDoJogo icone="livro-abrir" tamanho={26} />}
          aoFechar={() => definirRapidoPainel(null)}
        >
          <MetaDaJornada
            partida={partida}
            aoEscolherMeta={aoEscolherMetaDaJornada}
            aoAbrirProfissao={abrirProfissao}
            aoAbrirEquipamento={abrirEquipamento}
          />
          <div className="jornada-secao">
            <span>AGORA</span>
            <strong>{trabalho?.titulo ?? "Sem atividade automática"}</strong>
          </div>
          {partida.combate.loboDerrotado || partida.masmorra.contratoConcluido ? (
            <Button
              variant="secondary"
              fullWidth
              onClick={abrirTaverna}
            >
              Conversar com Brann
            </Button>
          ) : null}
          <Button
            variant="secondary"
            fullWidth
            onClick={() =>
              abrirAventura((partida.masmorra.expedicaoAtiva || partida.masmorra.incursaoAutomaticaAtiva) ? "masmorra" : "visaoGeral")
            }
          >
            Ver em Aventura
          </Button>
        </PainelRapido>
      ) : null}
    </div>
  );
}


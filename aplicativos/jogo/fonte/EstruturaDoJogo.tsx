/**
 * @file Estrutura visual da partida e navegação entre Personagem, Atividades, Aventura e Cidade.
 * Recebe a partida persistida e callbacks de Aplicativo; suas abas e painéis são estado
 * transitório de apresentação. Consultar outra tela não inicia nem cancela um trabalho.
 */
import { useMemo, useState } from "react";
import {
  CLASSES_DE_PERSONAGEM,
  RECEITAS_INICIAIS_DE_FABRICACAO,
  ATIVIDADES_OCIOSAS_INICIAIS,
  obterDefinicaoDeHabilidadeDeCombate,
  obterDefinicaoDeConsumivelDeCombate,
  obterDefinicaoDeInimigo,
  obterDefinicaoDeEquipamento,
  obterHistoriaDaJornada,
  obterDialogoDeBrann,
} from "@greywake/conteudo";
import {
  derivarEstatisticasDeCombateDoJogador,
  obterValorPrincipalDoEquipamento,
  type DistribuicaoDeAtributos,
  type PartidaLocal,
  type IdDaProfissao,
} from "@greywake/dominio";
import BancadaDeCombate from "./BancadaDeCombate";
import BancadaDaMasmorra from "./BancadaDaMasmorra";
import BancadaDoMercado from "./BancadaDoMercado";
import PainelDeAtributos from "./PainelDeAtributos";
import PainelDoBanco from "./PainelDoBanco";
import IndicadorDeProgressoOcioso from "./IndicadorDeProgressoOcioso";
import TelaDeAtividades from "./TelaDeAtividades";
import PainelDePrestigio from "./PainelDePrestigio";
import PainelRapido from "./PainelRapido";
import CreditosDosRecursos from "./CreditosDosRecursos";
import IconeDoJogo from "./IconeDoJogo";
import GradeDoInventario from "./GradeDoInventario";
import MetaDaJornada, { ResumoDaMetaDaJornada } from "./MetaDaJornada";
import { obterIconeDoEquipamento, iconeDoPainelPorId, iconeDeProfissaoPorId } from "./iconesDosRecursos";
import { rotulosDasProfissoes } from "./rotulosDoJogo";

type DestinoPrincipal = "personagem" | "atividades" | "aventura" | "cidade";
type AbaDoPersonagem =
  | "visaoGeral"
  | "atributos"
  | "equipamento"
  | "tecnicas"
  | "inventario"
  | "prestigio";
type TelaDeAventura = "visaoGeral" | "servico" | "masmorra";
type TelaDaCidade =
  | "visaoGeral"
  | "taverna"
  | "mercado"
  | "ferreiro"
  | "banco"
  | "relicario";
type PainelRapidoAtivo = "jornada" | "inventario" | null;

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
  aoPersistir: (partida: PartidaLocal, mensagem?: string) => void | Promise<void>;
  prepararRisco: () => Promise<PartidaLocal>;
  aoIniciarAtividade: (idDaDefinicaoDaAtividade: string) => Promise<void>;
  aoIniciarReceita: (
    idDaDefinicaoDaReceita: string,
    idDaInstanciaDoEquipamentoAlvo?: string | null,
  ) => Promise<void>;
  aoEscolherMetaDaJornada: (idDaReceita: string | null) => Promise<void>;
  aoPararTrabalho: () => Promise<void>;
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

const combateCatalogo = {
  obterDefinicaoDeEquipamento,
  obterDefinicaoDeHabilidade: obterDefinicaoDeHabilidadeDeCombate,
  obterDefinicaoDeInimigo,
  obterDefinicaoDeConsumivel: obterDefinicaoDeConsumivelDeCombate,
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
  aoPersistir,
  prepararRisco,
  aoIniciarAtividade,
  aoIniciarReceita,
  aoEscolherMetaDaJornada,
  aoPararTrabalho,
  aoEquipar,
  aoDistribuirAtributos,
  aoRealizarPrestigioDoPersonagem,
  aoDesbloquearNoDePrestigio,
  aoDepositarPilhaNoBanco,
  aoRetirarPilhaDoBanco,
  aoDepositarEquipamentoNoBanco,
  aoRetirarEquipamentoDoBanco,
}: PropriedadesDeEstruturaDoJogo) {
  // Uma expedição persistida reabre diretamente em Aventura; as demais partidas começam na visão do personagem.
  const [destino, definirDestino] = useState<DestinoPrincipal>(
    partida.masmorra.expedicaoAtiva ? "aventura" : "personagem",
  );
  const [personagemAba, definirPersonagemAba] = useState<AbaDoPersonagem>("visaoGeral");
  const [profissaoSelecionada, definirSelecionadoProfissao] = useState<IdDaProfissao>("mineracao");
  const [aventuraTelaDoJogo, definirAventuraTelaDoJogo] = useState<TelaDeAventura>(
    partida.masmorra.expedicaoAtiva ? "masmorra" : "visaoGeral",
  );
  const [cidadeTelaDoJogo, definirCidadeTelaDoJogo] = useState<TelaDaCidade>("visaoGeral");
  const [rapidoPainel, definirRapidoPainel] = useState<PainelRapidoAtivo>(null);
  const [preparacaoAtivo, definirPreparacaoAtivo] = useState(false);

  const estatisticas = useMemo(
    () => derivarEstatisticasDeCombateDoJogador(partida, combateCatalogo),
    [partida],
  );
  const nomeDaClasse = CLASSES_DE_PERSONAGEM.find(
    (item) => item.id === partida.personagem.idDaClasse,
  )?.nome;
  const trabalho = ativoTrabalho(partida);
  const jornada = obterHistoriaDaJornada(partida);
  const masmorraAtivo = Boolean(partida.masmorra.expedicaoAtiva);
  // O risco temporário do combate e a expedição persistida bloqueiam a navegação e pausam a barra de trabalho.
  const focadoRisco = riscoAtivo || masmorraAtivo;

  /** Muda o destino principal em contexto seguro e fecha consultas rápidas para evitar painéis fora de contexto. */
  function ir(proximo: DestinoPrincipal) {
    if (focadoRisco) return;
    definirDestino(proximo);
    definirRapidoPainel(null);
    if (proximo === "aventura") definirAventuraTelaDoJogo("visaoGeral");
    if (proximo === "cidade") definirCidadeTelaDoJogo("visaoGeral");
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

  return (
    <div className={principalClasse} data-destination={destino}>
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
        <div
          className="global-recursos"
          aria-label="Estado global do personagem"
        >
          <div>
            <span className="recurso-simbolo vida-simbolo">
              <IconeDoJogo icone={iconeDoPainelPorId.vidaMaxima} tamanho={19} />
            </span>
            <small>Vida máx.</small>
            <strong>{estatisticas.vidaMaxima}</strong>
          </div>
          <div>
            <span className="recurso-simbolo mana-simbolo">
              <IconeDoJogo icone={iconeDoPainelPorId.manaMaxima} tamanho={19} />
            </span>
            <small>Mana máx.</small>
            <strong>{estatisticas.manaMaxima}</strong>
          </div>
          <div>
            <span className="recurso-simbolo folego-simbolo">
              <IconeDoJogo icone={iconeDoPainelPorId.folegoMaximo} tamanho={19} />
            </span>
            <small>Fôlego máx.</small>
            <strong>{estatisticas.folegoMaximo}</strong>
          </div>
          <div>
            <span className="recurso-simbolo moeda-simbolo">
              <IconeDoJogo icone={iconeDoPainelPorId.ouro} tamanho={19} />
            </span>
            <small>Moeda</small>
            <strong>{partida.personagem.ouro}</strong>
          </div>
          <button
            className="icone-botao"
            type="button"
            onClick={aoAlternarPartida}
            disabled={focadoRisco}
            aria-label="Trocar personagem"
            title="Trocar personagem"
          >
            ⋯
          </button>
        </div>
      </header>

      <aside className="jogo-barraLateral" aria-label="Menu do jogo">
        <div className="jogo-marca">
          <span className="marca-simbolo" aria-hidden="true">
            <IconeDoJogo icone="espada-longa" tamanho={48} />
          </span>
          <strong>GREYWAKE</strong>
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
            <button
              key={id}
              type="button"
              className={destino === id ? "ativo" : ""}
              disabled={focadoRisco}
              aria-current={destino === id ? "page" : undefined}
              onClick={() => ir(id)}
            >
              <IconeDoJogo icone={icone} tamanho={32} />
              <span>
                {rotulo}
                <small>{detalhe}</small>
              </span>
            </button>
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
              ? "Dún Liath · Ocioso pausado"
              : "Combate · Ocioso pausado"}
          </strong>
        </div>
      ) : null}

      <div className="jogo-disposicao">
        <main className="jogo-conteudo" id="jogo-conteudo" tabIndex={-1}>
          {!focadoRisco ? (
            <ResumoDaMetaDaJornada
              partida={partida}
              aoAbrir={() => definirRapidoPainel("jornada")}
            />
          ) : null}

          {/* As telas recebem intenções de alteração; a coordenação superior mantém a ordem das gravações. */}
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
              aoIniciarReceita={aoIniciarReceita}
              aoPararTrabalho={aoPararTrabalho}
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
              aoPersistir={aoPersistir}
              aoDepositarPilhaNoBanco={aoDepositarPilhaNoBanco}
              aoRetirarPilhaDoBanco={aoRetirarPilhaDoBanco}
              aoDepositarEquipamentoNoBanco={aoDepositarEquipamentoNoBanco}
              aoRetirarEquipamentoDoBanco={aoRetirarEquipamentoDoBanco}
            />
          ) : null}
          <div className="movel-creditos">
            <CreditosDosRecursos />
          </div>
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
            <button
              className="discreto-botao completo-largura"
              type="button"
              disabled={focadoRisco}
              onClick={() => definirRapidoPainel("jornada")}
            >
              Consultar jornada
            </button>
          </section>
          <section className="companheiro-secao">
            <GradeDoInventario partida={partida} compacto />
            <button
              className="discreto-botao completo-largura"
              type="button"
              disabled={focadoRisco}
              onClick={abrirCompletoInventario}
            >
              Abrir bolsa
            </button>
          </section>
          <CreditosDosRecursos />
        </aside>
      </div>

      {/* O trabalho continua visível ao navegar; clicar no resumo retorna à profissão realmente em execução. */}
      <footer className="continuidade-barra">
        <button
          disabled={focadoRisco}
          className="atual-trabalho"
          type="button"
          onClick={() => {
            definirDestino("atividades");
            definirRapidoPainel(null);
            if (trabalho) definirSelecionadoProfissao(trabalho.idDaProfissao);
          }}
        >
          <span aria-hidden="true">
            <IconeDoJogo
              icone={trabalho ? iconeDeProfissaoPorId[trabalho.idDaProfissao] : "picareta"}
              tamanho={32}
            />
          </span>
          <IndicadorDeProgressoOcioso partida={partida} compacto pausado={focadoRisco} />
        </button>
        <div className="continuidade-acoes">
          <button
            type="button"
            disabled={focadoRisco}
            aria-haspopup="dialog"
            onClick={() => definirRapidoPainel("inventario")}
          >
            <IconeDoJogo icone="armadura-sobreposta" tamanho={24} />
            <span>Inventário</span>
          </button>
          <button
            type="button"
            disabled={focadoRisco}
            aria-haspopup="dialog"
            onClick={() => definirRapidoPainel("jornada")}
          >
            <IconeDoJogo icone="livro-abrir" tamanho={24} />
            <span>Jornada</span>
          </button>
        </div>
      </footer>

      {mensagem ? (
        <div
          className={`jogo-aviso ${tipoDaMensagem === "conquista" ? "jogo-aviso--conquista" : ""}`}
        >
          {tipoDaMensagem === "conquista" ? (
            <IconeDoJogo icone="ferreiro" tamanho={32} />
          ) : null}
          <p role="status">{mensagem}</p>
          <button
            type="button"
            onClick={aoDispensarMensagem}
            aria-label="Dispensar mensagem"
          >
            ×
          </button>
        </div>
      ) : null}

      {/* Consultas rápidas são diálogos de contexto seguro e não criam outra cópia da partida. */}
      {rapidoPainel === "inventario" && !focadoRisco ? (
        <PainelRapido
          rotulo="Inventário rápido"
          aoFechar={() => definirRapidoPainel(null)}
        >
          <button
            className="folha-fechar"
            type="button"
            onClick={() => definirRapidoPainel(null)}
            aria-label="Fechar"
          >
            ×
          </button>
          <p className="secao-chamada">Consulta rápida</p>
          <h2 className="destaque-titulo">Inventário</h2>
          <GradeDoInventario partida={partida} compacto aoEquipar={aoEquipar} />
          <button
            className="discreto-botao completo-largura"
            type="button"
            onClick={abrirCompletoInventario}
          >
            Abrir Inventário completo
          </button>
        </PainelRapido>
      ) : null}

      {rapidoPainel === "jornada" && !focadoRisco ? (
        <PainelRapido rotulo="Jornada" aoFechar={() => definirRapidoPainel(null)}>
          <button
            className="folha-fechar"
            type="button"
            onClick={() => definirRapidoPainel(null)}
            aria-label="Fechar"
          >
            ×
          </button>
          <p className="secao-chamada">Continuidade</p>
          <h2 className="destaque-titulo">Jornada</h2>
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
          <div className="jornada-secao">
            <span>{jornada.rotulo}</span>
            <strong>{jornada.titulo}</strong>
            <p>{jornada.corpo}</p>
          </div>
          {partida.combate.loboDerrotado || partida.masmorra.contratoConcluido ? (
            <button
              className="discreto-botao completo-largura"
              type="button"
              onClick={abrirTaverna}
            >
              Conversar com Brann
            </button>
          ) : null}
          <button
            className="discreto-botao completo-largura"
            type="button"
            onClick={() =>
              abrirAventura(partida.masmorra.expedicaoAtiva ? "masmorra" : "visaoGeral")
            }
          >
            Ver em Aventura
          </button>
        </PainelRapido>
      ) : null}
    </div>
  );
}

/** Distribui abas de atributos, equipamentos, técnicas, inventário e prestígio usando os mesmos dados da partida. */
function TelaDoPersonagem({
  partida,
  aba,
  aoAba,
  aoEquipar,
  aoIniciarReceita,
  aoDistribuirAtributos,
  aoRealizarPrestigioDoPersonagem,
  aoDesbloquearNoDePrestigio,
}: {
  partida: PartidaLocal;
  aba: AbaDoPersonagem;
  aoAba: (aba: AbaDoPersonagem) => void;
  aoEquipar: (idDaInstancia: string) => Promise<void>;
  aoIniciarReceita: (
    idDaDefinicaoDaReceita: string,
    idDaInstanciaDoEquipamentoAlvo?: string | null,
  ) => Promise<void>;
  aoDistribuirAtributos: (distribuicao: DistribuicaoDeAtributos) => Promise<void>;
  aoRealizarPrestigioDoPersonagem: () => Promise<void>;
  aoDesbloquearNoDePrestigio: (noId: string) => Promise<void>;
}) {
  const reforcoReceita = RECEITAS_INICIAIS_DE_FABRICACAO.find(
    (receita) => receita.saida.tipo === "equipamento-reforco",
  );

  return (
    <section className="funcionalidade-telaDoJogo">
      <div className="telaDoJogo-tituloDaSecao">
        <div>
          <p className="secao-chamada">Personagem</p>
          <h1 className="destaque-titulo">{partida.personagem.nome}</h1>
          <p className="atenuado">Toda jornada deixa suas marcas.</p>
        </div>
      </div>
      <div className="subnavegacao" aria-label="Personagem">
        {(
          [
            ["visaoGeral", "Visão Geral"],
            ["atributos", "Atributos"],
            ["equipamento", "Equipamento"],
            ["tecnicas", "Técnicas"],
            ["inventario", "Inventário"],
            ["prestigio", "Prestígio"],
          ] as const
        ).map(([id, rotulo]) => (
          <button
            key={id}
            type="button"
            className={aba === id ? "ativo" : ""}
            aria-pressed={aba === id}
            onClick={() => aoAba(id)}
          >
            {rotulo}
          </button>
        ))}
      </div>

      {aba === "visaoGeral" ? (
        <div className="personagem-disposicao">
          <div className="personagem-efigie">
            <div className="retrato-marcador" aria-hidden="true" />
            <p className="efigie-rotulo">EQUIPAMENTO EM USO</p>
            <div className="equipado-suporte">
              {partida.personagem.itensDeEquipamento
                .filter((item) =>
                  Object.values(partida.personagem.equipamento).includes(
                    item.idDaInstancia,
                  ),
                )
                .map((item) => (
                  <button
                    type="button"
                    className="equipado-espaco"
                    key={item.idDaInstancia}
                    title={obterDefinicaoDeEquipamento(item.idDaDefinicao)?.nome}
                    aria-label={`Ver ${obterDefinicaoDeEquipamento(item.idDaDefinicao)?.nome ?? "equipamento"}`}
                    onClick={() => aoAba("equipamento")}
                  >
                    <IconeDoJogo
                      icone={obterIconeDoEquipamento(item.idDaDefinicao)}
                      tamanho={32}
                    />
                  </button>
                ))}
            </div>
          </div>
          <div className="visaoGeral-pilha">
            <article className="painel">
              <p className="secao-chamada">Seu legado</p>
              <h2>
                {partida.personagem.nome} · Nível {partida.personagem.nivel}
              </h2>
              <div className="informacoes-gradeVisual">
                <div>
                  <span>XP geral</span>
                  <strong>{partida.personagem.xp}</strong>
                </div>
                <div>
                  <span>Pontos disponíveis</span>
                  <strong>{partida.personagem.pontosDeAtributoDisponiveis}</strong>
                </div>
                <div>
                  <span>Equipamentos</span>
                  <strong>{partida.personagem.itensDeEquipamento.length}</strong>
                </div>
                <div>
                  <span>Técnicas conhecidas</span>
                  <strong>{partida.personagem.idsDasHabilidadesConhecidas.length}</strong>
                </div>
              </div>
            </article>
            <article className="painel">
              <p className="secao-chamada">Domínio dos ofícios</p>
              <div className="profissao-resumo-gradeVisual">
                {Object.entries(partida.profissoes).map(([idDaProfissao, progresso]) => (
                  <div key={idDaProfissao}>
                    <span className="profissao-resumo-rotulo">
                      <IconeDoJogo
                        icone={iconeDeProfissaoPorId[idDaProfissao as IdDaProfissao]}
                        tamanho={22}
                      />
                      <span>{rotulosDasProfissoes[idDaProfissao as IdDaProfissao]}</span>
                    </span>
                    <strong>Nv. {progresso.nivel}</strong>
                  </div>
                ))}
              </div>
            </article>
          </div>
        </div>
      ) : null}

      {aba === "atributos" ? (
        <PainelDeAtributos
          partida={partida}
          aoDistribuirAtributos={aoDistribuirAtributos}
        />
      ) : null}

      {aba === "equipamento" ? (
        <div className="equipamento-gradeVisual-emExecucao">
          {partida.personagem.itensDeEquipamento.map((instancia) => {
            const definicao = obterDefinicaoDeEquipamento(instancia.idDaDefinicao);
            if (!definicao) return null;
            const equipado = Object.values(partida.personagem.equipamento).includes(
              instancia.idDaInstancia,
            );
            const principal = obterValorPrincipalDoEquipamento(
              definicao,
              instancia.nivelDeReforco,
            );
            return (
              <article
                className={`item-cartao ${equipado ? "selecionado-cartao" : ""}`}
                key={instancia.idDaInstancia}
              >
                <div className="item-miniatura" aria-hidden="true">
                  <IconeDoJogo
                    icone={obterIconeDoEquipamento(instancia.idDaDefinicao)}
                    tamanho={64}
                  />
                </div>
                <div className="item-cartaoCorpo">
                  <p className="secao-chamada">{definicao.espaco}</p>
                  <h3>
                    {definicao.nome} +{instancia.nivelDeReforco}
                  </h3>
                  <p className="atenuado">
                    {principal !== null
                      ? `${definicao.estatisticaPrincipal?.tipo === "ataque" ? "Poder" : "Defesa"} ${principal}`
                      : "Sem valor primário"}
                  </p>
                  <div className="botao-linhaDeDados">
                    <button
                      className="discreto-botao"
                      type="button"
                      disabled={equipado}
                      onClick={() => void aoEquipar(instancia.idDaInstancia)}
                    >
                      {equipado ? "Equipado" : "Equipar"}
                    </button>
                    {reforcoReceita &&
                    instancia.nivelDeReforco === 0 &&
                    definicao.estatisticaPrincipal ? (
                      <button
                        className="discreto-botao"
                        type="button"
                        onClick={() =>
                          void aoIniciarReceita(
                            reforcoReceita.id,
                            instancia.idDaInstancia,
                          )
                        }
                      >
                        Reforçar +1
                      </button>
                    ) : null}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : null}

      {aba === "tecnicas" ? (
        <article className="painel dense-painel">
          <div className="painel-tituloDaSecao">
            <div>
              <p className="secao-chamada">Estilo</p>
              <h2>{partida.combate.preferencias.estilo}</h2>
            </div>
            <span className="situacao-selo">ordem = prioridade real</span>
          </div>
          <div className="tecnica-listar">
            {partida.personagem.espacosDeHabilidadesAtivas.map((habilidadeId, indice) => {
              const habilidade = habilidadeId
                ? obterDefinicaoDeHabilidadeDeCombate(habilidadeId)
                : null;
              return (
                <div
                  className="tecnica-linhaDeDados"
                  key={`${habilidadeId ?? "vazio"}-${indice}`}
                >
                  <span className="prioridade-indice">{indice + 1}</span>
                  <div>
                    <strong>{habilidade?.nome ?? "Espaço vazio"}</strong>
                    <small>
                      {habilidade
                        ? `CD ${habilidade.segundosDeRecarga}s${habilidade.custoDeRecurso !== undefined ? ` · custo ${habilidade.custoDeRecurso} ${habilidade.recurso ?? ""}` : ""}`
                        : "Nenhuma Técnica equipada"}
                    </small>
                  </div>
                </div>
              );
            })}
          </div>
        </article>
      ) : null}

      {aba === "inventario" ? (
        <article className="painel inventario-painel">
          <GradeDoInventario partida={partida} aoEquipar={aoEquipar} />
        </article>
      ) : null}

      {aba === "prestigio" ? (
        <PainelDePrestigio
          partida={partida}
          aoRealizarPrestigio={aoRealizarPrestigioDoPersonagem}
          aoDesbloquearNo={aoDesbloquearNoDePrestigio}
        />
      ) : null}
    </section>
  );
}

/** Alterna a visão geral e as bancadas de serviço ou masmorra; cada bancada controla sua preparação e resolução. */
function ComponenteDaTelaDeAventura({
  partida,
  telaDoJogo,
  aoTelaDoJogo,
  prepararRisco,
  aoPersistir,
  aoAlterarEstadoDeRisco,
  aoAlterarEstadoDePreparacao,
}: {
  partida: PartidaLocal;
  telaDoJogo: TelaDeAventura;
  aoTelaDoJogo: (telaDoJogo: TelaDeAventura) => void;
  prepararRisco: () => Promise<PartidaLocal>;
  aoPersistir: (partida: PartidaLocal, mensagem?: string) => void | Promise<void>;
  aoAlterarEstadoDeRisco: (ativo: boolean) => void;
  aoAlterarEstadoDePreparacao: (ativo: boolean) => void;
}) {
  if (telaDoJogo === "servico") {
    return (
      <BancadaDeCombate
        partida={partida}
        prepararRisco={prepararRisco}
        aoAlterarPartida={aoPersistir}
        aoAlterarEstadoDeRisco={aoAlterarEstadoDeRisco}
        aoRetorno={() => aoTelaDoJogo("visaoGeral")}
      />
    );
  }
  if (telaDoJogo === "masmorra") {
    return (
      <BancadaDaMasmorra
        partida={partida}
        prepararRisco={prepararRisco}
        aoAlterarPartida={aoPersistir}
        aoAlterarEstadoDeRisco={aoAlterarEstadoDeRisco}
        aoAlterarEstadoDePreparacao={aoAlterarEstadoDePreparacao}
        aoRetorno={() => aoTelaDoJogo("visaoGeral")}
      />
    );
  }

  return (
    <section className="funcionalidade-telaDoJogo">
      <div className="telaDoJogo-tituloDaSecao">
        <div>
          <p className="secao-chamada">Aventura</p>
          <h1 className="destaque-titulo">Além da segurança</h1>
          <p className="atenuado">
            Serviços são encontros menores; Masmorras são expedições prolongadas
            com risco acumulado.
          </p>
        </div>
      </div>
      <div className="aventura-visaoGeral-disposicao secao-espacamento">
        <div className="contexto-arte contexto-arte--aventura" aria-hidden="true">
          <span>ARTE 16:9 · AVENTURA</span>
        </div>
        <div className="aventura-gradeVisual">
          <article className="aventura-cartao painel">
            <p className="secao-chamada">Serviço</p>
            <h2>Estrada Baixa</h2>
            <p className="atenuado">
              Presença hostil confirmada. Encontro de curta duração.
            </p>
            <div className="informacao-linhaDeDados">
              <span>Estado</span>
              <strong>
                {partida.combate.loboDerrotado
                  ? "Concluído anteriormente"
                  : "Disponível"}
              </strong>
            </div>
            <button
              className="discreto-botao"
              type="button"
              onClick={() => aoTelaDoJogo("servico")}
            >
              Preparar serviço
            </button>
          </article>
          <article className="aventura-cartao painel risco-painel">
            <p className="secao-chamada">Masmorra</p>
            <h2>Dún Liath</h2>
            <p className="atenuado">
              Fortaleza Cinzenta · expedição prolongada · Bolsa de Expedição.
            </p>
            <div className="informacao-linhaDeDados">
              <span>Contrato</span>
              <strong>
                {partida.masmorra.contratoAceito || partida.masmorra.contratoConcluido
                  ? "Conhecido"
                  : "Ainda não aceito"}
              </strong>
            </div>
            <button
              className="principal-botao compacto"
              type="button"
              onClick={() => aoTelaDoJogo("masmorra")}
            >
              {partida.masmorra.expedicaoAtiva ? "Retomar expedição" : "Ver Dún Liath"}
            </button>
          </article>
        </div>
      </div>
    </section>
  );
}

/** Encaminha os serviços implementados e apresenta o contexto dos locais ainda sem mecânica funcional. */
function ComponenteDaTelaDaCidade({
  partida,
  telaDoJogo,
  aoTelaDoJogo,
  aoAbrirAventura,
  aoPersistir,
  aoDepositarPilhaNoBanco,
  aoRetirarPilhaDoBanco,
  aoDepositarEquipamentoNoBanco,
  aoRetirarEquipamentoDoBanco,
}: {
  partida: PartidaLocal;
  telaDoJogo: TelaDaCidade;
  aoTelaDoJogo: (telaDoJogo: TelaDaCidade) => void;
  aoAbrirAventura: () => void;
  aoPersistir: (partida: PartidaLocal, mensagem?: string) => void | Promise<void>;
  aoDepositarPilhaNoBanco: (idDaDefinicao: string, quantidade: number) => Promise<void>;
  aoRetirarPilhaDoBanco: (
    idDaDefinicao: string,
    quantidade: number,
  ) => Promise<void>;
  aoDepositarEquipamentoNoBanco: (idDaInstancia: string) => Promise<void>;
  aoRetirarEquipamentoDoBanco: (idDaInstancia: string) => Promise<void>;
}) {
  if (telaDoJogo === "mercado")
    return <BancadaDoMercado partida={partida} aoAlterarPartida={aoPersistir} />;
  if (telaDoJogo === "banco") {
    return (
      <PainelDoBanco
        partida={partida}
        aoDepositarPilha={aoDepositarPilhaNoBanco}
        aoRetirarPilha={aoRetirarPilhaDoBanco}
        aoDepositarEquipamento={aoDepositarEquipamentoNoBanco}
        aoRetirarEquipamento={aoRetirarEquipamentoDoBanco}
        aoVoltar={() => aoTelaDoJogo("visaoGeral")}
      />
    );
  }

  if (telaDoJogo === "taverna") {
    const dialogo = obterDialogoDeBrann(partida);
    return (
      <section className="funcionalidade-telaDoJogo">
        <div className="telaDoJogo-tituloDaSecao">
          <div>
            <p className="secao-chamada">Cidade · Taverna</p>
            <h1 className="destaque-titulo">Taverna</h1>
            <p className="atenuado">Conversas e contratos.</p>
          </div>
          <button
            className="discreto-botao"
            type="button"
            onClick={() => aoTelaDoJogo("visaoGeral")}
          >
            Voltar à Cidade
          </button>
        </div>
        <div className="cidade-contexto-disposicao">
          <div className="contexto-arte contexto-arte--cidade" aria-hidden="true">
            <span>ARTE 16:9 · TAVERNA</span>
          </div>
          <article className="painel pnj-cartao">
            <div
              className="retrato-marcador retrato-marcador--pnj"
              aria-hidden="true"
            >
              <span>PNJ 4:5</span>
            </div>
            <div>
              <p className="secao-chamada">
                Brann
                {partida.masmorra.contratoConcluido ? " · Contrato concluído" : ""}
              </p>
              <h2>{dialogo.titulo}</h2>
              <p className="atenuado">{dialogo.corpo}</p>
              {dialogo.lembranca ? (
                <blockquote className="brann-lembranca">
                  {dialogo.lembranca}
                </blockquote>
              ) : null}
              {dialogo.acao ? (
                <button
                  className="principal-botao compacto"
                  type="button"
                  onClick={aoAbrirAventura}
                >
                  {dialogo.acao}
                </button>
              ) : null}
            </div>
          </article>
        </div>
      </section>
    );
  }

  // Ferreiro e Relicário possuem apresentação contextual, mas não executam novos serviços nesta versão.
  if (telaDoJogo !== "visaoGeral") {
    const texto: Record<
      Exclude<TelaDaCidade, "visaoGeral" | "taverna" | "mercado" | "banco">,
      { titulo: string; corpo: string }
    > = {
      ferreiro: {
        titulo: "Ferreiro",
        corpo: "Serviços de PNJ pertencem à Cidade. A Profissão Forja continua em Atividades. Nenhum novo serviço do Ferreiro está implementado nesta configuração.",
      },
      relicario: {
        titulo: "Relicário",
        corpo: "Relíquias descobertas serão apresentadas aqui. O sistema funcional de Relicário ainda não está implementado nesta configuração.",
      },
    };
    const atual = texto[telaDoJogo];
    return (
      <section className="funcionalidade-telaDoJogo">
        <div className="telaDoJogo-tituloDaSecao">
          <div>
            <p className="secao-chamada">Cidade</p>
            <h1 className="destaque-titulo">{atual.titulo}</h1>
            <p className="atenuado">{atual.corpo}</p>
          </div>
          <button
            className="discreto-botao"
            type="button"
            onClick={() => aoTelaDoJogo("visaoGeral")}
          >
            Voltar à Cidade
          </button>
        </div>
        <div className="contexto-arte contexto-arte--cidade" aria-hidden="true">
          <span>ARTE 16:9 · {atual.titulo.toUpperCase()}</span>
        </div>
      </section>
    );
  }

  return (
    <section className="funcionalidade-telaDoJogo">
      <div className="telaDoJogo-tituloDaSecao">
        <div>
          <p className="secao-chamada">Cidade</p>
          <h1 className="destaque-titulo">Cidade Livre</h1>
          <p className="atenuado">
            Trégua, necessidade e comércio sustentam este território neutro.
          </p>
        </div>
      </div>
      <div className="cidade-visaoGeral-disposicao secao-espacamento">
        <div className="contexto-arte contexto-arte--cidade" aria-hidden="true">
          <span>ARTE 16:9 · CIDADE LIVRE</span>
        </div>
        <div className="cidade-localDoJogo-gradeVisual">
          <button type="button" onClick={() => aoTelaDoJogo("taverna")}>
            <IconeDoJogo icone="livro-abrir" tamanho={32} />
            <strong>Taverna</strong>
            <span>Contratos e conversas</span>
          </button>
          <button type="button" onClick={() => aoTelaDoJogo("mercado")}>
            <IconeDoJogo icone="coroa-moeda" tamanho={32} />
            <strong>Mercado</strong>
            <span>Compra e venda</span>
          </button>
          <button type="button" onClick={() => aoTelaDoJogo("ferreiro")}>
            <IconeDoJogo icone="ferreiro" tamanho={32} />
            <strong>Ferreiro</strong>
            <span>Serviços de equipamento</span>
          </button>
          <button type="button" onClick={() => aoTelaDoJogo("banco")}>
            <IconeDoJogo icone="chave" tamanho={32} />
            <strong>Banco</strong>
            <span>Armazenamento seguro</span>
          </button>
          <button type="button" onClick={() => aoTelaDoJogo("relicario")}>
            <IconeDoJogo icone="pedraRunica" tamanho={32} />
            <strong>Relicário</strong>
            <span>Relíquias e memória</span>
          </button>
        </div>
      </div>
    </section>
  );
}

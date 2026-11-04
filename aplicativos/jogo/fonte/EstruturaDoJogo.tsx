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
} from "@paralaxe/conteudo";
import {
  derivarEstatisticasDeCombateDoJogador,
  obterValorPrincipalDoEquipamento,
  type DistribuicaoDeAtributos,
  type PartidaLocal,
  type IdDaProfissao,
} from "@paralaxe/dominio";
import BancadaDeCombate from "./features/aventura/BancadaDeCombate";
import BancadaDaMasmorra from "./features/aventura/BancadaDaMasmorra";
import BancadaDoMercado from "./features/cidade/BancadaDoMercado";
import PainelDeAtributos from "./features/personagem/PainelDeAtributos";
import PainelDoBanco from "./features/cidade/PainelDoBanco";
import IndicadorDeProgressoOcioso from "./features/atividades/IndicadorDeProgressoOcioso";
import TelaDeAtividades from "./features/atividades/TelaDeAtividades";
import PainelDePrestigio from "./features/personagem/PainelDePrestigio";
import PainelDoCodice from "./features/cidade/PainelDoCodice";
import {
  ResumoDaCidade, PainelDeProjetos, type AcoesDoLegado,
} from './features/cidade/LegadoDaCidade';
import PainelDeDesafios from "./features/aventura/PainelDeDesafios";
import PainelRapido from "./features/navegacao/PainelRapido";
import CreditosDosRecursos from "./components/jogo/CreditosDosRecursos";
import { IconeDoJogo } from "./components/jogo";
import GradeDoInventario from "./features/inventario/GradeDoInventario";
import MetaDaJornada, { ResumoDaMetaDaJornada } from "./features/jornada/MetaDaJornada";
import { obterIconeDoEquipamento, iconeDoPainelPorId, iconeDeProfissaoPorId } from "./iconesDosRecursos";
import { rotulosDasProfissoes } from "./rotulosDoJogo";
import { rotulosDaInterface } from './rotulosDaInterface'
import { Button, Card } from "./components/ui";

type DestinoPrincipal = "personagem" | "atividades" | "aventura" | "cidade";
type AbaDoPersonagem =
  | "visaoGeral"
  | "atributos"
  | "equipamento"
  | "tecnicas"
  | "inventario"
  | "prestigio";
type TelaDeAventura = "visaoGeral" | "servico" | "masmorra" | "desafios";
type TelaDaCidade =
  | "visaoGeral"
  | "taverna"
  | "mercado"
  | "ferreiro"
  | "banco"
  | "relicario"
  | "codice"
  | "reconstrucao";
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
  aoConcluirProjeto: AcoesDoLegado['aoConcluirProjeto'];
  aoComprarOfertaDoMercado: (idDaOferta: string) => Promise<void>;
  prepararRisco: () => Promise<PartidaLocal>;
  aoIniciarAtividade: (idDaDefinicaoDaAtividade: string) => Promise<void>;
  aoIniciarAtividadeSecundaria: (id: string) => Promise<void>;
  aoPararAtividadeSecundaria: () => Promise<void>;
  aoIniciarReceitaSecundaria: (id: string) => Promise<void>;
  aoPararReceitaSecundaria: () => Promise<void>;
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
  aoConcluirProjeto,
  aoComprarOfertaDoMercado,
  prepararRisco,
  aoIniciarAtividade,
  aoIniciarAtividadeSecundaria,
  aoPararAtividadeSecundaria,
  aoIniciarReceita,
  aoIniciarReceitaSecundaria,
  aoPararReceitaSecundaria,
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
          <Button
            variant="icon"
            onClick={aoAlternarPartida}
            disabled={focadoRisco}
            aria-label="Trocar personagem"
            title="Trocar personagem"
          >
            ⋯
          </Button>
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
              onClick={() => ir(id)}
            >
              <span>
                {rotulo}
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
              aoIniciarAtividadeSecundaria={aoIniciarAtividadeSecundaria}
              aoPararAtividadeSecundaria={aoPararAtividadeSecundaria}
              aoIniciarReceita={aoIniciarReceita}
              aoIniciarReceitaSecundaria={aoIniciarReceitaSecundaria}
              aoPararReceitaSecundaria={aoPararReceitaSecundaria}
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
            icon={<IconeDoJogo icone="armadura-sobreposta" tamanho={24} />}
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
        >
          {tipoDaMensagem === "conquista" ? (
            <IconeDoJogo icone="ferreiro" tamanho={32} />
          ) : null}
          <p role="status">{mensagem}</p>
          <Button
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
          icone={<IconeDoJogo icone="armadura-sobreposta" tamanho={26} />}
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
              abrirAventura(partida.masmorra.expedicaoAtiva ? "masmorra" : "visaoGeral")
            }
          >
            Ver em Aventura
          </Button>
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
  const reforcos = RECEITAS_INICIAIS_DE_FABRICACAO.filter(
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
          <Button
            variant="tab"
            key={id}
            aria-pressed={aba === id}
            onClick={() => aoAba(id)}
          >
            {rotulo}
          </Button>
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
                  <Button
                    variant="inventory"
                    key={item.idDaInstancia}
                    title={obterDefinicaoDeEquipamento(item.idDaDefinicao)?.nome}
                    aria-label={`Ver ${obterDefinicaoDeEquipamento(item.idDaDefinicao)?.nome ?? "equipamento"}`}
                    onClick={() => aoAba("equipamento")}
                  >
                    <IconeDoJogo
                      icone={obterIconeDoEquipamento(item.idDaDefinicao)}
                      tamanho={32}
                    />
                  </Button>
                ))}
            </div>
          </div>
          <div className="visaoGeral-pilha">
            <Card>
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
            </Card>
            <Card>
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
            </Card>
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
            const reforcoReceita = reforcos.find(receita =>
              receita.saida.tipo === 'equipamento-reforco' &&
              (receita.saida.nivelDeReforcoAlvo ?? 1) === instancia.nivelDeReforco + 1,
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
                    {definicao.bonusDeColeta
                      ? `+${definicao.bonusDeColeta.xpAdicionalPorAcao} XP de ${definicao.bonusDeColeta.idDaProfissao} por ciclo, sem durabilidade`
                      : principal !== null
                        ? `${definicao.estatisticaPrincipal?.tipo === "ataque" ? "Poder" : "Defesa"} ${principal}`
                        : "Sem valor primário"}
                  </p>
                  <div className="botao-linhaDeDados">
                    <Button
                      variant="secondary"
                      size="sm"
                      disabled={equipado}
                      onClick={() => void aoEquipar(instancia.idDaInstancia)}
                    >
                      {equipado ? "Equipado" : "Equipar"}
                    </Button>
                    {reforcoReceita &&
                    instancia.nivelDeReforco < 2 &&
                    definicao.estatisticaPrincipal ? (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() =>
                          void aoIniciarReceita(
                            reforcoReceita.id,
                            instancia.idDaInstancia,
                          )
                        }
                      >
                        Reforçar +{instancia.nivelDeReforco + 1}
                      </Button>
                    ) : null}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : null}

      {aba === "tecnicas" ? (
        <Card className="dense-painel">
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
        </Card>
      ) : null}

      {aba === "inventario" ? (
        <Card className="inventario-painel">
          <GradeDoInventario partida={partida} aoEquipar={aoEquipar} />
        </Card>
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
  if (telaDoJogo === "desafios") {
    return <PainelDeDesafios partida={partida} aoVoltar={() => aoTelaDoJogo("visaoGeral")} />;
  }
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
          <Card className="aventura-cartao">
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
            <Button
              variant="secondary"
              size="sm"
              onClick={() => aoTelaDoJogo("servico")}
            >
              Preparar serviço
            </Button>
          </Card>
          <Card className="aventura-cartao risco-painel">
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
            <Button
              variant="primary"
              size="sm"
              onClick={() => aoTelaDoJogo("masmorra")}
            >
              {partida.masmorra.expedicaoAtiva ? "Retomar expedição" : "Ver Dún Liath"}
            </Button>
          </Card>
          <Card className="aventura-cartao">
            <p className="secao-chamada">Desafios</p>
            <h2>Marcos da jornada</h2>
            <p className="atenuado">Acompanhe contratos, descobertas e seu progresso.</p>
            <div className="informacao-linhaDeDados"><span>Concluídos</span><strong>{partida.desafios.idsConcluidos.length}</strong></div>
            <Button variant="secondary" size="sm" onClick={() => aoTelaDoJogo("desafios")}>Consultar desafios</Button>
          </Card>
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
  aoConcluirProjeto,
  aoComprarOfertaDoMercado,
  aoDepositarPilhaNoBanco,
  aoRetirarPilhaDoBanco,
  aoDepositarEquipamentoNoBanco,
  aoRetirarEquipamentoDoBanco,
}: {
  partida: PartidaLocal;
  telaDoJogo: TelaDaCidade;
  aoTelaDoJogo: (telaDoJogo: TelaDaCidade) => void;
  aoAbrirAventura: () => void;
  aoConcluirProjeto: AcoesDoLegado['aoConcluirProjeto'];
  aoComprarOfertaDoMercado: (idDaOferta: string) => Promise<void>;
  aoDepositarPilhaNoBanco: (idDaDefinicao: string, quantidade: number) => Promise<void>;
  aoRetirarPilhaDoBanco: (
    idDaDefinicao: string,
    quantidade: number,
  ) => Promise<void>;
  aoDepositarEquipamentoNoBanco: (idDaInstancia: string) => Promise<void>;
  aoRetirarEquipamentoDoBanco: (idDaInstancia: string) => Promise<void>;
}) {
  if (telaDoJogo === 'reconstrucao') {
    return <PainelDeProjetos partida={partida} aoVoltar={() => aoTelaDoJogo('visaoGeral')}
      aoConcluirProjeto={aoConcluirProjeto} />;
  }
  if (telaDoJogo === "codice") {
    return <PainelDoCodice partida={partida} aoVoltar={() => aoTelaDoJogo("visaoGeral")} />;
  }
  if (telaDoJogo === "mercado")
    return <BancadaDoMercado partida={partida} aoComprarOferta={aoComprarOfertaDoMercado} />;
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
          <Button
            variant="secondary"
            size="sm"
            onClick={() => aoTelaDoJogo("visaoGeral")}
          >
            {rotulosDaInterface.voltarACidade}
          </Button>
        </div>
        <div className="cidade-contexto-disposicao">
          <div className="contexto-arte contexto-arte--cidade" aria-hidden="true">
            <span>ARTE 16:9 · TAVERNA</span>
          </div>
          <Card className="pnj-cartao">
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
                <Button
                  variant="primary"
                  size="sm"
                  onClick={aoAbrirAventura}
                >
                  {dialogo.acao}
                </Button>
              ) : null}
            </div>
          </Card>
        </div>
      </section>
    );
  }

  // Ferreiro e Relicário possuem apresentação contextual, mas não executam novos serviços nesta versão.
  if (telaDoJogo !== "visaoGeral") {
    const texto: Record<
      Exclude<TelaDaCidade, "visaoGeral" | "taverna" | "mercado" | "banco" | "reconstrucao">,
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
      codice: {
        titulo: "Códice",
        corpo: "Registro das descobertas do personagem.",
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
          <Button
            variant="secondary"
            size="sm"
            onClick={() => aoTelaDoJogo("visaoGeral")}
          >
            {rotulosDaInterface.voltarACidade}
          </Button>
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
        <ResumoDaCidade partida={partida}
          aoAbrirProjetos={() => aoTelaDoJogo('reconstrucao')} />
        <div className="cidade-localDoJogo-gradeVisual">
          <Button variant="location" icon={<IconeDoJogo icone="livro-abrir" tamanho={32} />} onClick={() => aoTelaDoJogo("taverna")}>
            <strong>Taverna</strong>
            <span>Contratos e conversas</span>
          </Button>
          <Button variant="location" icon={<IconeDoJogo icone="coroa-moeda" tamanho={32} />} onClick={() => aoTelaDoJogo("mercado")}>
            <strong>Mercado</strong>
            <span>Compra e venda</span>
          </Button>
          <Button variant="location" icon={<IconeDoJogo icone="ferreiro" tamanho={32} />} onClick={() => aoTelaDoJogo("ferreiro")}>
            <strong>Ferreiro</strong>
            <span>Serviços de equipamento</span>
          </Button>
          <Button variant="location" icon={<IconeDoJogo icone="chave" tamanho={32} />} onClick={() => aoTelaDoJogo("banco")}>
            <strong>Banco</strong>
            <span>Armazenamento seguro</span>
          </Button>
          <Button variant="location" icon={<IconeDoJogo icone="pedraRunica" tamanho={32} />} onClick={() => aoTelaDoJogo("relicario")}>
            <strong>Relicário</strong>
            <span>Relíquias e memória</span>
          </Button>
          <Button variant="location" icon={<IconeDoJogo icone="livro-abrir" tamanho={32} />} onClick={() => aoTelaDoJogo("codice")}>
            <strong>Códice</strong>
            <span>Descobertas e conhecimento</span>
          </Button>
        </div>
      </div>
    </section>
  );
}

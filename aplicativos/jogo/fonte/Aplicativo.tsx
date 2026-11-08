import CartaoDaClasse from './features/criacao/CartaoDaClasse'
/**
 * @file Coordenação principal da aplicação: carregar, criar, selecionar e salvar partidas.
 * Conecta intenções da interface às regras puras do domínio e serializa as gravações
 * no repositório. Estados de navegação, mensagens e formulários ficam somente no React.
 */
import {
  CLASSES_DE_PERSONAGEM,
  PRESENTES_INICIAIS,
} from "@paralaxe/conteudo";
import {
  MODO_DA_PARTIDA,
  type IdDaClasseDoPersonagem,
  type IdDoPresente,
} from "@paralaxe/dominio";
import type { RepositorioDePartidasLocais } from "@paralaxe/interface";
import CreditosDosRecursos from "./components/jogo/CreditosDosRecursos";
import { IconeDoJogo } from "./components/jogo";
import EstruturaDoJogo from "./EstruturaDoJogo";
import EstadoDoJogoWeb from "./features/aplicativo-web/EstadoDoJogoWeb";
import { Button, Card, TextField } from './components/ui'
import { useAplicativoDaPartida } from "./hooks/useAplicativoDaPartida";
import { useTemaDaInterface } from "./hooks/useTemaDaInterface";
import { rotulosDaInterface } from './rotulosDaInterface'

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

interface AplicativoProps {
  repositorioDePartidas: RepositorioDePartidasLocais;
  aoSairDoAcesso?: () => void;
}

/** Compõe as telas e conecta eventos à camada de aplicação da partida. */
function Aplicativo({ repositorioDePartidas, aoSairDoAcesso }: AplicativoProps) {
  const [temaDaInterface, definirTemaDaInterface] = useTemaDaInterface();
  const {
    tela, definirTela, partidas, partidaAtiva, nomeDoPersonagem, definirPersonagemNome,
    idDaClasseSelecionada, definirIdDaClasseSelecionada, selecionadoPresenteId,
    definirSelecionadoPresenteId, criacaoPasso, definirCriacaoPasso, aviso, mensagem,
    definirMensagem, ultimoResultadoDoTrabalho,
    ausenteResumo, definirAusenteResumo, ehSalvando, ehPreparandoDebug, tratarAbrirDebug, riscoAtivo, definirRiscoAtivo,
    tratarCriarPartida, tratarCarregarPartida, tratarIniciarAtividade, tratarIniciarAtividadeSecundaria,
    tratarPararAtividadeSecundaria, tratarIniciarAtividadeTerciaria, tratarPararAtividadeTerciaria, tratarIniciarReceita, tratarIniciarReceitaSecundaria, tratarPararReceitaSecundaria, tratarIniciarReceitaTerciaria, tratarPararReceitaTerciaria, tratarAlterarPrioridadeDeOficio, tratarResponderMinigame,
    tratarPararTrabalho, tratarPrestigiarProfissao, tratarEscolherJornadaMeta, tratarEquipar, tratarDistribuirAtributos,
    tratarDesbloquearPrestigioNo, tratarRealizarPersonagemPrestigio, tratarDepositarBancoPilha,
    tratarRetirarBancoPilha, tratarDepositarBancoEquipamento, tratarRetirarBancoEquipamento,
    tratarConcluirProjeto, tratarComprarOfertaDoMercado,
    persistirPartidaAtiva, prepararRisco,
    iniciarNovoPartida, alternarPartida, encerrarAcessoLocal,
  } = useAplicativoDaPartida(repositorioDePartidas);

  // A renderização segue a máquina de telas: inicialização/erro, partida ativa, lista e, por último, criação.
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
        <p className="secao-chamada">Paralaxe</p>
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
          <Card as="section" className="ausente-retorno-cartao">
            <p className="secao-chamada">Bem-vindo de volta</p>
            <h1 className="destaque-titulo">{partidaAtiva.personagem.nome}</h1>
            <p className="ausente-duracao">
              Ausente por <strong>{ausenteResumo.duracao}</strong>
            </p>
            <div className="ausente-resultado">
              <span>Durante sua ausência</span>
              <strong>{ausenteResumo.resultado}</strong>
            </div>
            {ausenteResumo.detalhes.length > 0 ? (
              <section className="ausente-detalhes" aria-label="Detalhes do progresso durante a ausência">
                <h2>O que mudou</h2>
                <ul>{ausenteResumo.detalhes.map((detalhe) => <li key={detalhe}>{detalhe}</li>)}</ul>
              </section>
            ) : null}
            {ausenteResumo.meta ? (
              <div className="ausente-meta-resultado">
                <IconeDoJogo icone="livro-abrir" tamanho={32} />
                <p>{ausenteResumo.meta}</p>
              </div>
            ) : null}
            {ausenteResumo.marco ? (
              <p className="ausente-marco">{ausenteResumo.marco}</p>
            ) : null}
            <Button
              variant="primary"
              size="sm"
              onClick={() => definirAusenteResumo(null)}
            >
              Continuar
            </Button>
          </Card>
        </main>
      );
    }

    return (
      <>
        <EstadoDoJogoWeb podeAtualizar={false} />
        <EstruturaDoJogo
          key={partidaAtiva.idDaPartida}
          partida={partidaAtiva}
          mensagem={mensagem}
          tipoDaMensagem={aviso?.tipo ?? "informacao"}
          ultimoResultadoDoTrabalho={ultimoResultadoDoTrabalho}
          aoDispensarMensagem={() => definirMensagem(null)}
          riscoAtivo={riscoAtivo}
          aoAlterarEstadoDeRisco={definirRiscoAtivo}
          aoAlternarPartida={alternarPartida}
          {...(aoSairDoAcesso ? { aoSairDoAcesso: () => encerrarAcessoLocal(aoSairDoAcesso) } : {})}
          aoAbrirDebug={tratarAbrirDebug}
          debugPendente={ehPreparandoDebug}
          temaDaInterface={temaDaInterface}
          aoAlternarTema={() => definirTemaDaInterface(atual => atual === "escuro" ? "claro" : "escuro")}
          aoPersistir={persistirPartidaAtiva}
          prepararRisco={prepararRisco}
          aoIniciarAtividade={tratarIniciarAtividade}
          aoIniciarAtividadeSecundaria={tratarIniciarAtividadeSecundaria}
          aoPararAtividadeSecundaria={tratarPararAtividadeSecundaria}
          aoIniciarAtividadeTerciaria={tratarIniciarAtividadeTerciaria}
          aoPararAtividadeTerciaria={tratarPararAtividadeTerciaria}
          aoIniciarReceita={tratarIniciarReceita}
          aoIniciarReceitaSecundaria={tratarIniciarReceitaSecundaria}
          aoPararReceitaSecundaria={tratarPararReceitaSecundaria}
          aoIniciarReceitaTerciaria={tratarIniciarReceitaTerciaria}
          aoPararReceitaTerciaria={tratarPararReceitaTerciaria}
          aoAlterarPrioridade={tratarAlterarPrioridadeDeOficio}
          aoResponderMinigame={tratarResponderMinigame}
          aoEscolherMetaDaJornada={tratarEscolherJornadaMeta}
          aoPararTrabalho={tratarPararTrabalho}
          aoPrestigiarProfissao={tratarPrestigiarProfissao}
          aoConcluirProjeto={tratarConcluirProjeto}
          aoComprarOfertaDoMercado={tratarComprarOfertaDoMercado}
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
            <p className="secao-chamada">Paralaxe</p>
            <strong className="entrada-marca">Versão 0.1 · Sem conexão</strong>
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={iniciarNovoPartida}
          >
            Novo personagem
          </Button>
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
            <Button
              variant="saveCard"
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
            </Button>
          ))}
        </section>
        {aoSairDoAcesso ? <Button variant="ghost" disabled={ehSalvando || ehPreparandoDebug} onClick={() => void encerrarAcessoLocal(aoSairDoAcesso)}>Sair do acesso local</Button> : null}
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
          <strong className="entrada-marca">Paralaxe</strong>
        </div>
        {partidas.length > 0 ? (
          <Button
            variant="secondary"
            onClick={() => definirTela("partida-listar")}
          >
            Voltar às partidas
          </Button>
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

        {/* Assistente de cinco etapas: modo, nome, classe, presente e confirmação. As escolhas ainda não criam a partida. */}
        {criacaoPasso === 0 ? (
          <div className="criacao-foco">
            <p className="secao-chamada">Modo</p>
            <h1 className="destaque-titulo">Sem conexão</h1>
            <p className="atenuado">
              Este personagem usa partida local persistente. Nenhum sistema Conectado
              é necessário para jogar.
            </p>
            <Button
              variant="primary"
              size="sm"
              onClick={() => definirCriacaoPasso(1)}
            >
              Continuar
            </Button>
          </div>
        ) : null}

        {criacaoPasso === 1 ? (
          <div className="criacao-foco">
            <p className="secao-chamada">Nome</p>
            <h1 className="destaque-titulo">Quem desperta em Paralaxe?</h1>
            <TextField
              className="campo-pilha"
              label="Nome do personagem"
              autoFocus
              autoComplete="off"
              value={nomeDoPersonagem}
              onChange={(evento) => definirPersonagemNome(evento.target.value)}
              placeholder="Nome"
            />
            <div className="botao-linhaDeDados">
              <Button
                variant="secondary"
                onClick={() => definirCriacaoPasso(0)}
              >
                {rotulosDaInterface.voltar}
              </Button>
              <Button
                variant="primary"
                size="sm"
                disabled={!nomeDoPersonagem.trim()}
                onClick={() => definirCriacaoPasso(2)}
              >
                Continuar
              </Button>
            </div>
          </div>
        ) : null}

        {/* A arte é decorativa; a escolha e sua identificação acessível continuam no botão da classe. */}
        {criacaoPasso === 2 ? (
          <div className="criacao-foco amplo">
            <p className="secao-chamada">Classe inicial</p>
            <h1 className="destaque-titulo">Escolha como começar</h1>
            <p className="atenuado">
              A classe define seu início, não seu destino.
            </p>
            <div className="criacao-escolha-gradeVisual">
              {CLASSES_DE_PERSONAGEM.map(definicao => <CartaoDaClasse key={definicao.id}
                definicao={definicao} selecionada={idDaClasseSelecionada === definicao.id}
                aoSelecionar={definirIdDaClasseSelecionada} />)}
            </div>
            <div className="botao-linhaDeDados">
              <Button variant="secondary" onClick={() => definirCriacaoPasso(1)}>
                {rotulosDaInterface.voltar}
              </Button>
              <Button variant="primary" size="sm" disabled={!idDaClasseSelecionada} onClick={() => definirCriacaoPasso(3)}>
                Continuar
              </Button>
            </div>
          </div>
        ) : null}

        {criacaoPasso === 3 ? (
          <div className="criacao-foco amplo">
            <p className="secao-chamada">Presente</p>
            <h1 className="destaque-titulo">Escolha o que levar</h1>
            <div className="criacao-escolha-gradeVisual">
              {PRESENTES_INICIAIS.map((definicao) => (
                <Button
                  variant="creation"
                  key={definicao.id}
                  aria-pressed={selecionadoPresenteId === definicao.id}
                  onClick={() => definirSelecionadoPresenteId(definicao.id)}
                >
                  <strong>{definicao.nome}</strong>
                  <span>{definicao.resumo}</span>
                </Button>
              ))}
            </div>
            <div className="botao-linhaDeDados">
              <Button
                variant="secondary"
                onClick={() => definirCriacaoPasso(2)}
              >
                {rotulosDaInterface.voltar}
              </Button>
              <Button
                variant="primary"
                size="sm"
                disabled={!selecionadoPresenteId}
                onClick={() => definirCriacaoPasso(4)}
              >
                Continuar
              </Button>
            </div>
          </div>
        ) : null}

        {/* Somente esta confirmação chama o domínio e grava o personagem; ehSalvando bloqueia novos envios durante a operação. */}
        {criacaoPasso === 4 ? (
          <div className="criacao-foco">
            <p className="secao-chamada">{rotulosDaInterface.confirmar}</p>
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
              <Button
                variant="secondary"
                onClick={() => definirCriacaoPasso(3)}
              >
                {rotulosDaInterface.voltar}
              </Button>
              <Button
                variant="primary"
                size="sm"
                disabled={ehSalvando}
                loading={ehSalvando}
                onClick={() => void tratarCriarPartida()}
              >
                {ehSalvando ? "Criando…" : "Criar personagem"}
              </Button>
            </div>
          </div>
        ) : null}
      </section>
      {aoSairDoAcesso ? <Button variant="ghost" disabled={ehSalvando || ehPreparandoDebug} onClick={() => void encerrarAcessoLocal(aoSairDoAcesso)}>Sair do acesso local</Button> : null}
        <CreditosDosRecursos />
    </main>
  );
}

export default Aplicativo;


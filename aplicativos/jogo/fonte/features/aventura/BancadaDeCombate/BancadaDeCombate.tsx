/**
 * @file Preparação, apresentação e confirmação do serviço contra o lobo da estrada.
 * O domínio calcula a luta inteira antes da exibição; o temporizador desta tela revela
 * o registro aos poucos. Ao fim da apresentação, aplica o resultado e solicita sua gravação.
 */
import { useEffect, useMemo, useState } from "react";
import {
  CONSUMIVEIS_DE_COMBATE,
  obterDefinicaoDeHabilidadeDeCombate,
  obterDefinicaoDeConsumivelDeCombate,
  obterDefinicaoDeInimigo,
  obterDefinicaoDeEquipamento,
} from "@greywake/conteudo";
import {
  aplicarResultadoDoCombateNaEstrada,
  configurarEspacoDeConsumivelDeCombate,
  derivarEstatisticasDeCombateDoJogador,
  retomarTrabalhoAposRisco,
  simularCombate,
  type ResultadoDeCombate,
  type RecursoDoLimiarDeCombate,
  type PartidaLocal,
} from "@greywake/dominio";
import { Button, Card } from '../../../components/ui'
import estilos from './BancadaDeCombate.module.css'

type PropriedadesDaTelaDeCombate = {
  partida: PartidaLocal;
  prepararRisco: () => Promise<PartidaLocal>;
  aoAlterarPartida: (
    partida: PartidaLocal,
    mensagem?: string,
  ) => void | Promise<void>;
  aoAlterarEstadoDeRisco?: (ativo: boolean) => void;
  aoRetorno?: () => void;
};

const combateCatalogo = {
  obterDefinicaoDeEquipamento,
  obterDefinicaoDeHabilidade: obterDefinicaoDeHabilidadeDeCombate,
  obterDefinicaoDeInimigo,
  obterDefinicaoDeConsumivel: obterDefinicaoDeConsumivelDeCombate,
};

function formatoRecurso(valor: number) {
  return Math.max(0, Math.round(valor));
}

function inventarioQuantidade(partida: PartidaLocal, idDaDefinicao: string) {
  return (
    partida.personagem.inventario.find(
      (pilha) => pilha.idDaDefinicao === idDaDefinicao,
    )?.quantidade ?? 0
  );
}

/** Resolve o ID da técnica para exibir nome, custo e recarga junto de sua prioridade. */
function habilidadeDetalhesAdicionais(habilidadeId: string | null) {
  if (!habilidadeId) return null;
  const habilidade = obterDefinicaoDeHabilidadeDeCombate(habilidadeId);
  if (!habilidade) return null;
  const recurso =
    habilidade.recurso && habilidade.custoDeRecurso !== undefined
      ? `${habilidade.recurso} ${habilidade.custoDeRecurso} · `
      : "";
  return { habilidade, textoExibido: `${recurso}CD ${habilidade.segundosDeRecarga}s` };
}

/** Mantém resultado e tempo visível como estado transitório e usa callbacks para pausar trabalho e persistir a luta. */
export default function BancadaDeCombate({
  partida,
  prepararRisco,
  aoAlterarPartida,
  aoAlterarEstadoDeRisco,
  aoRetorno,
}: PropriedadesDaTelaDeCombate) {
  const [resultado, definirResultado] = useState<ResultadoDeCombate | null>(null);
  const [combateBasePartida, definirCombateBasePartida] = useState<PartidaLocal | null>(
    null,
  );
  const [visivelSegundos, definirVisivelSegundos] = useState(0);
  const [executando, definirExecutando] = useState(false);
  const [mensagem, definirMensagem] = useState<string | null>(null);
  const [registroAbrir, definirRegistroAbrir] = useState(false);

  const estatisticas = useMemo(
    () => derivarEstatisticasDeCombateDoJogador(partida, combateCatalogo),
    [partida],
  );
  // Filtra o registro já calculado pelo relógio da apresentação; não executa novas ações de combate.
  const visivelRegistro =
    resultado?.registro.filter((entrada) => entrada.instanteEmSegundos <= visivelSegundos + 0.001) ??
    [];
  const progresso =
    resultado && resultado.duracaoEmSegundos > 0
      ? Math.min(100, (visivelSegundos / resultado.duracaoEmSegundos) * 100)
      : 0;
  const maisRecenteAvisoDeAtaque =
    [...visivelRegistro].reverse().find((entrada) => entrada.tipo === "avisoDeAtaque") ??
    null;

  // Este intervalo avança apenas a reprodução visual em passos de 0,1 segundo.
  useEffect(() => {
    if (!executando || !resultado) return;

    const temporizador = window.setInterval(() => {
      definirVisivelSegundos((atual) =>
        Math.min(resultado.duracaoEmSegundos, atual + 0.1),
      );
    }, 100);

    return () => window.clearInterval(temporizador);
  }, [executando, resultado]);

  // Quando a reprodução termina, usa a partida-base daquela luta para aplicar recompensas e consumos.
  useEffect(() => {
    if (!executando || !resultado || !combateBasePartida) return;
    if (visivelSegundos + 0.0001 < resultado.duracaoEmSegundos) return;

    definirExecutando(false);
    const agora = new Date().toISOString();
    const primeiroServicoConcluir =
      resultado.desfecho === "vitoria" && !combateBasePartida.combate.loboDerrotado;
    const aplicado = aplicarResultadoDoCombateNaEstrada(combateBasePartida, resultado, agora);
    // O horário do trabalho é reiniciado no retorno para que a duração da luta não gere coleta ou fabricação.
    const atualizado = retomarTrabalhoAposRisco(aplicado, agora);
    const perdidoMoedas = Math.max(
      0,
      combateBasePartida.personagem.ouro - aplicado.personagem.ouro,
    );
    const textoExibido =
      resultado.desfecho === "vitoria"
        ? primeiroServicoConcluir
          ? `Serviço concluído: +${resultado.xpConcedido + 25} XP geral e +40 moedas. Atividade automática retomada.`
          : `Vitória persistida: +${resultado.xpConcedido} XP geral. Atividade automática retomada.`
        : `Derrota persistida: ${perdidoMoedas} moeda(s) perdida(s). O personagem retornou à Cidade Livre e a atividade automática foi retomada.`;

    void Promise.resolve(aoAlterarPartida(atualizado, textoExibido)).then(() => {
      definirMensagem(textoExibido);
      aoAlterarEstadoDeRisco?.(false);
    });
  }, [
    combateBasePartida,
    aoAlterarEstadoDeRisco,
    aoAlterarPartida,
    resultado,
    executando,
    visivelSegundos,
  ]);

  useEffect(() => () => aoAlterarEstadoDeRisco?.(false), [aoAlterarEstadoDeRisco]);

  /** Mescla somente os campos alterados de um espaço e aplica a configuração pelo domínio antes de salvar. */
  async function atualizarConsumivelEspaco(
    espacoIndice: 0 | 1,
    valores: {
      idDaDefinicao?: string | null;
      recurso?: RecursoDoLimiarDeCombate | null;
      limiar?: number | null;
    },
  ) {
    if (executando) return;
    const atual = partida.combate.preferencias.espacosDeConsumiveis[espacoIndice];
    const atualizado = configurarEspacoDeConsumivelDeCombate(
      partida,
      espacoIndice,
      valores.idDaDefinicao === undefined
        ? atual.idDaDefinicao
        : valores.idDaDefinicao,
      valores.recurso === undefined ? atual.recursoDeUsoAutomatico : valores.recurso,
      valores.limiar === undefined
        ? atual.porcentagemDoLimiarDeUsoAutomatico
        : valores.limiar,
      new Date().toISOString(),
    );
    await aoAlterarPartida(
      atualizado,
      `Espaço ${espacoIndice + 1} de consumível atualizado.`,
    );
    definirMensagem(`Espaço ${espacoIndice + 1} de consumível atualizado.`);
  }

  /** Prepara o contexto de risco, cria a semente de 32 bits e solicita a simulação para iniciar sua apresentação. */
  async function iniciarLuta(manualEspaco?: 0 | 1) {
    if (executando) return;

    try {
      definirMensagem(null);
      const riscoPartida = await prepararRisco();
      const semente = Date.now() >>> 0;
      // O simulador valida seus próprios pré-requisitos, inclusive ausência de trabalho ativo; falhas são exibidas pelo catch.
      const simulado = simularCombate(
        riscoPartida,
        combateCatalogo,
        "inimigo.estrada-lobo",
        semente,
        180,
        undefined,
        manualEspaco,
      );
      definirCombateBasePartida(riscoPartida);
      definirResultado(simulado);
      definirVisivelSegundos(0);
      definirRegistroAbrir(false);
      aoAlterarEstadoDeRisco?.(true);
      definirExecutando(true);
    } catch (erro) {
      definirMensagem(
        erro instanceof Error
          ? erro.message
          : "Não foi possível iniciar o combate.",
      );
      aoAlterarEstadoDeRisco?.(false);
    }
  }

  /** Reutiliza a semente anterior; a partida pode ter mudado, portanto isso não garante repetir o resultado anterior. */
  function repetirSemente() {
    if (!resultado || executando) return;
    void iniciarComSemente(resultado.semente);
  }

  /** Inicia outra luta com a semente fornecida e o estado atual preparado para risco. */
  async function iniciarComSemente(semente: number) {
    try {
      const riscoPartida = await prepararRisco();
      const simulado = simularCombate(
        riscoPartida,
        combateCatalogo,
        "inimigo.estrada-lobo",
        semente,
      );
      definirCombateBasePartida(riscoPartida);
      definirResultado(simulado);
      definirVisivelSegundos(0);
      definirRegistroAbrir(false);
      aoAlterarEstadoDeRisco?.(true);
      definirExecutando(true);
    } catch (erro) {
      definirMensagem(
        erro instanceof Error
          ? erro.message
          : "Não foi possível repetir o combate.",
      );
      aoAlterarEstadoDeRisco?.(false);
    }
  }

  const habilidadeEspacos = partida.personagem.espacosDeHabilidadesAtivas;

  return (
    <section
      className={`funcionalidade-telaDoJogo combate-telaDoJogo ${estilos.screen} ${executando ? "combate-telaDoJogo--executando" : ""}`}
      aria-labelledby="combate-titulo"
    >
      <div className="telaDoJogo-tituloDaSecao">
        <div>
          <p className="secao-chamada">Aventura · Serviço</p>
          <h2 id="combate-titulo" className="destaque-titulo">
            Estrada Baixa
          </h2>
          <p className="atenuado">
            Combate automático em tempo real. A interface explica o estado e a
            automação.
          </p>
        </div>
        {!executando && aoRetorno ? (
          <Button variant="secondary" onClick={aoRetorno}>
            Voltar a Aventura
          </Button>
        ) : null}
      </div>

      {!executando && !resultado ? (
        <div className="preparacao-disposicao">
          <div className="contexto-arte contexto-arte--risco" aria-hidden="true">
            <span>ARTE 16:9 · ESTRADA BAIXA</span>
          </div>
          <Card as="aside" className="preparacao-resumo">
            <p className="secao-chamada">Preparação leve</p>
            <h3>Lobo de Estrada</h3>
            <div className="informacao-linhaDeDados">
              <span>Vida</span>
              <strong>{estatisticas.vidaMaxima}</strong>
            </div>
            <div className="informacao-linhaDeDados">
              <span>Mana</span>
              <strong>{estatisticas.manaMaxima}</strong>
            </div>
            <div className="informacao-linhaDeDados">
              <span>Fôlego</span>
              <strong>{estatisticas.folegoMaximo}</strong>
            </div>
            <div className="risco-nota">
              Ao confirmar, sua atividade automática atual será pausada durante o
              combate e retomada ao retornar à segurança.
            </div>
            <Button
              variant="primary"
              size="lg"
              onClick={() => void iniciarLuta()}
            >
              Iniciar serviço
            </Button>
          </Card>
        </div>
      ) : null}

      {/* Os recursos exibidos vêm do resultado calculado; a progressão temporal nesta versão se aplica à barra e ao registro. */}
      {executando || resultado ? (
        <>
          <div className={estilos.combatContext}>
            <span>Serviço · Estrada Baixa</span>
            <strong>
              {executando ? "COMBATE ATIVO · IDLE PAUSADO" : "RESULTADO"}
            </strong>
          </div>
          <div className="contexto-arte contexto-arte--combate" aria-hidden="true">
            <span>ARTE / CENA DE COMBATE</span>
          </div>

          <div className={estilos.combatGrid}>
            <Card className={estilos.combatant}>
              <p className="secao-chamada">Você</p>
              <h3>{partida.personagem.nome}</h3>
              <div className={estilos.resourcePile}>
                <div>
                  <span>VIDA</span>
                  <strong>
                    {resultado
                      ? `${formatoRecurso(resultado.jogador.vida)} / ${resultado.jogador.vidaMaxima}`
                      : estatisticas.vidaMaxima}
                  </strong>
                </div>
                <div>
                  <span>MANA</span>
                  <strong>
                    {resultado
                      ? `${formatoRecurso(resultado.jogador.mana)} / ${resultado.jogador.manaMaxima}`
                      : estatisticas.manaMaxima}
                  </strong>
                </div>
                <div>
                  <span>STAMINA</span>
                  <strong>
                    {resultado
                      ? `${formatoRecurso(resultado.jogador.folego)} / ${resultado.jogador.folegoMaximo}`
                      : estatisticas.folegoMaximo}
                  </strong>
                </div>
              </div>

              <div className="secao-divisor" />
              <p className="secao-chamada">Prioridade real</p>
              <div className="tecnica-listar">
                {habilidadeEspacos.map((habilidadeId, indice) => {
                  const detalhesAdicionais = habilidadeDetalhesAdicionais(habilidadeId);
                  return (
                    <div
                      className="tecnica-linhaDeDados"
                      key={`${habilidadeId ?? "vazio"}-${indice}`}
                    >
                      <span className="prioridade-indice">{indice + 1}</span>
                      <div>
                        <strong>{detalhesAdicionais?.habilidade.nome ?? "Espaço vazio"}</strong>
                        <small>
                          {detalhesAdicionais?.textoExibido ?? "Nenhuma Técnica equipada"}
                        </small>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            <Card>
              <div
                className={estilos.progressTrack}
                aria-label="Tempo do combate"
              >
                <span style={{ width: `${progresso}%` }} />
              </div>
              <div className={estilos.timingResources}>
                <span>Tempo {visivelSegundos.toFixed(1)}s</span>
                {resultado ? (
                  <span>Fim previsto {resultado.duracaoEmSegundos.toFixed(1)}s</span>
                ) : null}
              </div>

              {maisRecenteAvisoDeAtaque ? (
                <div className={estilos.attackWarning} role="status">
                  <span className="secao-chamada">Ameaça conhecida</span>
                  <strong>{maisRecenteAvisoDeAtaque.mensagem}</strong>
                  <small>Aviso de ataque identificado no registro de combate.</small>
                </div>
              ) : (
                <p className="atenuado">
                  A próxima ameaça relevante aparecerá aqui quando for
                  telegráfica.
                </p>
              )}

              {mensagem ? (
                <p className="emLinha-mensagem" role="status">
                  {mensagem}
                </p>
              ) : null}

              {resultado && !executando ? (
                <div className={`${estilos.combatResult} ${resultado.desfecho === 'derrota' ? estilos.defeat : ''}`}>
                  <p className="secao-chamada">Resultado</p>
                  <h3>
                    {resultado.desfecho === "vitoria"
                      ? "Vitória"
                      : resultado.desfecho === "derrota"
                        ? "Derrota"
                        : "Combate encerrado"}
                  </h3>
                  <p className="atenuado">
                    Duração {resultado.duracaoEmSegundos.toFixed(1)}s ·{" "}
                    {resultado.xpConcedido} XP do encontro
                  </p>
                  <div className="botao-linhaDeDados">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={aoRetorno}
                    >
                      Retornar a Aventura
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={repetirSemente}
                    >
                      Repetir mesma semente
                    </Button>
                  </div>
                </div>
              ) : null}

              <div className={estilos.combatLogSection}>
                <Button
                  variant="secondary"
                  onClick={() => definirRegistroAbrir((atual) => !atual)}
                  aria-expanded={registroAbrir}
                >
                  {registroAbrir ? "Recolher registro" : "Ver registro de combate"}
                </Button>
                {registroAbrir ? (
                  <div className={estilos.combatLog} aria-live="polite">
                    {visivelRegistro.length === 0 ? (
                      <p className="atenuado">
                        O registro aparecerá aqui durante o combate.
                      </p>
                    ) : null}
                    {visivelRegistro.map((entrada, indice) => (
                      <div
                        className={estilos.logEntry}
                        data-type={entrada.tipo}
                        key={`${entrada.instanteEmSegundos}-${indice}`}
                      >
                        <time>{entrada.instanteEmSegundos.toFixed(1)}s</time>
                        <span>{entrada.mensagem}</span>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            </Card>

            <Card className={`${estilos.combatant} ${estilos.enemy}`}>
              <p className="secao-chamada">Inimigo</p>
              <h3>Lobo de Estrada</h3>
              <div className="informacao-linhaDeDados">
                <span>Vida inicial</span>
                <strong>60</strong>
              </div>
              <div className="informacao-linhaDeDados">
                <span>Defesa</span>
                <strong>4</strong>
              </div>
              <div className="informacao-linhaDeDados">
                <span>Poder</span>
                <strong>8</strong>
              </div>
              <div className="informacao-linhaDeDados">
                <span>Intervalo</span>
                <strong>2,25 s</strong>
              </div>
              <div className="risco-nota">
                Bote possui aviso de ataque de 1,2 s e é interrompível.
              </div>
            </Card>
          </div>
        </>
      ) : null}

      {/* A configuração de consumíveis fica disponível fora da reprodução do encontro. */}
      {!executando ? (
        <div className={`${estilos.consumables} secao-espacamento`}>
          {([0, 1] as const).map((espacoIndice) => {
            const espaco = partida.combate.preferencias.espacosDeConsumiveis[espacoIndice];
            return (
              <Card key={espacoIndice}>
                <p className="secao-chamada">
                  Consumível preparado · Espaço {espacoIndice + 1}
                </p>
                <label className="campo-pilha">
                  <span>Item</span>
                  <select
                    value={espaco.idDaDefinicao ?? ""}
                    onChange={(evento) =>
                      void atualizarConsumivelEspaco(espacoIndice, {
                        idDaDefinicao: evento.target.value || null,
                      })
                    }
                  >
                    <option value="">Vazio</option>
                    {CONSUMIVEIS_DE_COMBATE.map((consumivel) => (
                      <option key={consumivel.id} value={consumivel.id}>
                        {consumivel.nome} · ×
                        {inventarioQuantidade(partida, consumivel.id)}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="campo-pilha">
                  <span>Usar automaticamente quando</span>
                  <select
                    value={espaco.recursoDeUsoAutomatico ?? ""}
                    disabled={!espaco.idDaDefinicao}
                    onChange={(evento) =>
                      void atualizarConsumivelEspaco(espacoIndice, {
                        recurso: (evento.target.value ||
                          null) as RecursoDoLimiarDeCombate | null,
                      })
                    }
                  >
                    <option value="">Desativado</option>
                    <option value="vida">Vida</option>
                    <option value="mana">Mana</option>
                    <option value="folego">Fôlego</option>
                  </select>
                </label>
                <label className="campo-pilha">
                  <span>Limite (%)</span>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    disabled={!espaco.idDaDefinicao || !espaco.recursoDeUsoAutomatico}
                    value={espaco.porcentagemDoLimiarDeUsoAutomatico ?? 50}
                    onChange={(evento) =>
                      void atualizarConsumivelEspaco(espacoIndice, {
                        limiar: Number(evento.target.value),
                      })
                    }
                  />
                </label>
                {espaco.idDaDefinicao ? (
                  <p className="atenuado pequeno-texto">
                    Usar consumível ocupa a ação atual; não concede uma ação
                    extra.
                  </p>
                ) : null}
              </Card>
            );
          })}
        </div>
      ) : null}
    </section>
  );
}

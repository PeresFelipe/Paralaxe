import { useCombateDaEstrada, type PropriedadesDoCombateDaEstrada } from "@/hooks/useCombateDaEstrada";
/**
 * @file Preparação, apresentação e confirmação do serviço contra o lobo da estrada.
 * O domínio calcula a luta inteira antes da exibição; o temporizador desta tela revela
 * o registro aos poucos. Ao fim da apresentação, aplica o resultado e solicita sua gravação.
 */
import { Button, Card, SelectField, TextField } from '@/components/ui';
import { rotulosDaInterface } from '@/rotulosDaInterface';
import {
  CONSUMIVEIS_DE_COMBATE,
  obterDefinicaoDeHabilidadeDeCombate
} from "@paralaxe/conteudo";
import {
  type PartidaLocal,
  type RecursoDoLimiarDeCombate
} from "@paralaxe/dominio";
import estilos from './BancadaDeCombate.module.css';

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
export default function BancadaDeCombate(props: PropriedadesDoCombateDaEstrada) {
  const { partida, aoRetorno } = props;
  const { resultado, executando, visivelSegundos, mensagem, registroAbrir, definirRegistroAbrir,
    estatisticas, visivelRegistro, progresso, maisRecenteAvisoDeAtaque, iniciarLuta,
    repetirSemente, atualizarConsumivelEspaco, confirmarResultado, retomarTrabalho, falhaAoRetomar, falhaAoSalvar, salvando } = useCombateDaEstrada(props);
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
            {rotulosDaInterface.voltarAAventura}
          </Button>
        ) : null}
      </div>

      {falhaAoRetomar ? <div role="alert" className="informacao-alerta">
        <p>{mensagem} A retomada do trabalho precisa ser gravada.</p>
        <Button variant="primary" onClick={() => void retomarTrabalho()}>Tentar retomar trabalho</Button>
      </div> : null}
      {falhaAoSalvar ? <div role="alert" className="informacao-alerta">
        <p>{mensagem} O resultado permanece pendente de gravação.</p>
        <Button variant="primary" onClick={() => void confirmarResultado()}>Tentar salvar novamente</Button>
      </div> : null}
      {salvando ? <p role="status">Salvando resultado do combate…</p> : null}
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
                <SelectField
                  className="campo-pilha"
                  label="Item"
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
                </SelectField>
                <SelectField
                  className="campo-pilha"
                  label="Usar automaticamente quando"
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
                </SelectField>
                <TextField
                  className="campo-pilha"
                  label="Limite (%)"
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

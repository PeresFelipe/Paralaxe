import EscolhasDaMasmorra from './EscolhasDaMasmorra';
import CenaDaMasmorra from "../CenaDaMasmorra/CenaDaMasmorra";
import { nomesDasDificuldades, useMasmorra, type PropriedadesDaMasmorra } from "@/hooks/useMasmorra";
import { ativoTrabalhoRotulo } from "@/services/acoesDaMasmorra";
/**
 * @file Fluxo de Dún Liath: contrato, preparação segura, expedição por salas e retorno.
 * A viagem ativa vive na partida persistida; mensagem, preparação e último resultado
 * são estados de apresentação. Toda decisão relevante solicita gravação por callback.
 */
import IconeDoJogo from "@/components/jogo/IconeDoJogo";
import { Button, Card, ProgressBar } from "@/components/ui";
import { obterIconeDoEquipamento, obterIconeDoItem } from "@/iconesDosRecursos";
import { rotulosDaInterface } from "@/rotulosDaInterface";
import {
  DUN_LIATH_FACIL,
  obterDefinicaoDeEquipamento
} from "@paralaxe/conteudo";
import {
  type DefinicaoDeSalaDaMasmorra
} from "@paralaxe/dominio";
import estilos from "./BancadaDaMasmorra.module.css";

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

/** Escolhe a apresentação conforme preparação, viagem ativa e sala atual; não mantém uma segunda cópia da expedição. */
export default function BancadaDaMasmorra(props: PropriedadesDaMasmorra) {
  const { partida, aoRetorno } = props;
  const { mensagem, resultadoDeCombate, ocupado, falhaAoRetomar, retomarTrabalho, dificuldadeSelecionada, definirDificuldadeSelecionada,
    preparando, definirPreparando, presetDeIncursao, definirPresetDeIncursao, execucao, incursaoAtiva, resultadoDaIncursao,
    progressoDaIncursao, relogioIncursao, nomesDosPresets, dificuldadesDisponiveis, mapaDaExpedicao, atualSala, salaResolvido,
    tratarAceitarContrato, tratarIniciar, tratarResolver, tratarCaminho, tratarProtetor, tratarExtrair,
    tratarIniciarIncursao, tratarFinalizarIncursao, tratarCancelarIncursao } = useMasmorra(props);
  if (falhaAoRetomar) return <section className="funcionalidade-telaDoJogo">
    <h2 className="destaque-titulo">Retomada pendente</h2>
    <p role="alert">{mensagem}</p>
    <Button variant="primary" disabled={ocupado} onClick={() => void retomarTrabalho()}>Tentar retomar trabalho</Button>
  </section>;
  // A preparação só existe sem viagem ativa e informa as consequências antes de chamar tratarIniciar.
  if (!execucao && !incursaoAtiva && preparando) {
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

  if (incursaoAtiva) {
    const segundosRestantes = Math.max(0, Math.ceil((Date.parse(incursaoAtiva.terminaEm) - relogioIncursao) / 1000));
    return (
      <section className="funcionalidade-telaDoJogo" aria-labelledby="incursao-em-curso">
        <div className="telaDoJogo-tituloDaSecao">
          <div>
            <p className="secao-chamada">Dún Liath · Incursão Automática</p>
            <h2 id="incursao-em-curso" className="destaque-titulo">Incursão em andamento</h2>
            <p className="atenuado">Este modo não percorre a Masmorra manual. As atividades de Ofício estão pausadas.</p>
          </div>
        </div>
        <Card className={estilos.incursaoPainel}>
          <h3>Preset {nomesDosPresets[incursaoAtiva.preset]}</h3>
          <div className="informacao-linhaDeDados">
            <span>Chance calculada ao iniciar</span>
            <strong>{Math.round(incursaoAtiva.chanceDeSucesso * 100)}%</strong>
          </div>
          <div className="informacao-linhaDeDados">
            <span>{resultadoDaIncursao?.concluida ? 'Resultado disponível' : 'Tempo restante'}</span>
            <strong>{resultadoDaIncursao?.concluida ? 'Pronto para resgatar' :
              Math.floor(segundosRestantes / 60) + 'm ' + String(segundosRestantes % 60).padStart(2, '0') + 's'}</strong>
          </div>
          <ProgressBar className={estilos.incursaoBarra ?? ''} value={progressoDaIncursao} max={100}
            label="Progresso da Incursão Automática" />
          <p className="atenuado">
            Recompensa possível: {incursaoAtiva.recompensaPossivel.map(item =>
              item.quantidade + '× ' + itemRotulo(item.idDaDefinicao)).join(', ')}.
            A chance e o saque ficam fixos na partida. Sem recompensas exclusivas do Chefe ou Relíquias.
          </p>
          <div className="botao-linhaDeDados">
            {resultadoDaIncursao?.concluida ? (
              <Button variant="primary" size="sm" disabled={ocupado}
                onClick={() => void tratarFinalizarIncursao()}>Resgatar resultado</Button>
            ) : null}
            <Button variant="secondary" size="sm" disabled={ocupado}
              onClick={() => void tratarCancelarIncursao()}>Cancelar sem recompensas</Button>
          </div>
        </Card>
        {mensagem ? <p className="emLinha-mensagem" role="status">{mensagem}</p> : null}
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
        <div className="secao-espacamento">
          <Card className={estilos.incursaoPainel}>
            <p className="secao-chamada">Modo separado · Incursão Automática</p>
            <h3>Uma incursão sem explorar salas manualmente</h3>
            <p className="atenuado">
              Liberada após concluir Dún Liath Fácil. Presets definem duração, chance e recompensas.
              Sua atividade atual será pausada. Sem segredos, Relíquias ou itens exclusivos do Chefe.
            </p>
            <div className="botao-linhaDeDados" role="group" aria-label="Preset da incursão">
              {(['cautelosa', 'equilibrada', 'ousada'] as const).map(preset => (
                <Button key={preset} size="sm"
                  variant={presetDeIncursao === preset ? 'primary' : 'secondary'}
                  disabled={ocupado || !partida.masmorra.dunLiathFacilConquistado}
                  onClick={() => definirPresetDeIncursao(preset)}>
                  {nomesDosPresets[preset]}
                </Button>
              ))}
            </div>
            <p className="atenuado">
              {presetDeIncursao === 'cautelosa' ? '15 min · 82% base · 1 Viga' :
                presetDeIncursao === 'equilibrada' ? '30 min · 67% base · 2 Vigas' :
                  '60 min · 52% base · 3 Vigas'} · bônus provisório de nível até 12 p.p.
            </p>
            <Button variant="primary" size="sm" disabled={ocupado || !partida.masmorra.dunLiathFacilConquistado}
              onClick={() => void tratarIniciarIncursao()}>
              {partida.masmorra.dunLiathFacilConquistado ? 'Iniciar Incursão Automática' : 'Conclua Dún Liath Fácil'}
            </Button>
            {partida.masmorra.ultimaIncursaoAutomatica ? (
              <p className="atenuado">
                Última incursão: {partida.masmorra.ultimaIncursaoAutomatica.sucesso ? 'Sucesso' : 'Falha'}
                {' · '}{nomesDosPresets[partida.masmorra.ultimaIncursaoAutomatica.preset]}
              </p>
            ) : null}
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
  const rotas = atualSala.idsDasProximasSalas.flatMap((id) => {
    const sala = mapaDaExpedicao.salas.find(candidata => candidata.id === id);
    if (!sala) return [];
    const requisito = sala.requisitoDeItemParaEntrar;
    const bloqueada = requisito && !partida.personagem.inventario.some(item =>
      item.idDaDefinicao === requisito && item.quantidade > 0);
    const titulo = atualSala.pistasDasSaidas?.[id] ?? (
      id === 'sala.alojamentos' ? 'Marcas recentes atravessam a poeira rumo ao quartel.'
        : id === 'sala.administracao' ? 'Uma porta antiga traz o selo corroído da guarnição.'
          : 'Um corredor de pedra molhada segue para o interior.'
    );
    return [{
      id, titulo, confirmar: 'Seguir por esta rota',
      detalhe: ramoEscolha ? 'Confirmar fecha a alternativa nesta expedição.' : 'Seguir adiante.',
      ...(bloqueada ? { bloqueio: `Requer ${itemRotulo(requisito)}.` } : {}),
    }];
  });

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
          <CenaDaMasmorra mapa={mapaDaExpedicao} expedicao={execucao} sala={atualSala} />
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
                <EscolhasDaMasmorra
                  titulo="O destino do Protetor"
                  escolhas={[
                    { id: 'morto', titulo: 'Matar', confirmar: 'Atacar o Protetor', detalhe: 'Atacar a criatura ferida.' },
                    { id: 'poupado', titulo: 'Poupar', confirmar: 'Poupar o Protetor', detalhe: 'Deixar a criatura viver.' },
                  ]}
                  ocupado={ocupado}
                  aoConfirmar={id => tratarProtetor(id === 'morto' ? 'morto' : 'poupado')}
                />
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

          {salaResolvido && rotas.length > 0 && !emChefePortao && (
            <EscolhasDaMasmorra
              key={atualSala.id}
              titulo={ramoEscolha ? "Escolha a próxima rota" : "Próxima rota"}
              escolhas={rotas}
              ocupado={ocupado}
              aoConfirmar={tratarCaminho}
            />
          )}

          {salaResolvido && emChefePortao && (
            <EscolhasDaMasmorra
              key={atualSala.id}
              titulo="Portão do Bastião"
              escolhas={[
                ...(execucao.extracaoSeguraDisponivel ? [{
                  id: 'extrair', titulo: 'Retornar e assegurar Bolsa', confirmar: 'Retornar com o saque',
                  detalhe: 'Encerra a expedição e guarda o saque.',
                }] : []),
                ...rotas.map(rota => ({
                  ...rota, titulo: 'Abrir o portão', confirmar: 'Abrir o portão',
                  detalhe: 'Enfrentar Fairtheoir e manter a Bolsa em risco.',
                })),
              ]}
              ocupado={ocupado}
              aoConfirmar={id => id === 'extrair' ? tratarExtrair() : tratarCaminho(id)}
            />
          )}

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
          <Card appearance="framed" className="expedicao-bolsa">
            <p className="secao-chamada">Bolsa de Expedição</p>
            <h3>Em risco</h3>
            {execucao.bolsaDaExpedicao.length === 0 &&
            execucao.equipamentosDaExpedicao.length === 0 ? (
              <p className="atenuado">Nada encontrado nesta expedição ainda.</p>
            ) : null}
            {execucao.bolsaDaExpedicao.map((pilha) => (
              <div className={estilos.linhaSaque} key={pilha.idDaDefinicao}>
                <IconeDoJogo icone={obterIconeDoItem(pilha.idDaDefinicao)} tamanho={24} />
                <span>{itemRotulo(pilha.idDaDefinicao)}</span>
                <strong>×{pilha.quantidade}</strong>
              </div>
            ))}
            {execucao.equipamentosDaExpedicao.map((item, indice) => (
              <div className={estilos.linhaSaque} key={`${item.idDaDefinicao}-${indice}`}>
                <IconeDoJogo icone={obterIconeDoEquipamento(item.idDaDefinicao)} tamanho={24} />
                <span>{obterDefinicaoDeEquipamento(item.idDaDefinicao)?.nome ?? item.idDaDefinicao}</span>
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

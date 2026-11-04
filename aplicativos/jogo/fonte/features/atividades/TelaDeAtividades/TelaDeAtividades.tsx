/**
 * @file Consulta de profissões e comandos de coleta, produção e acompanhamento de receitas.
 * Distingue a profissão aberta da profissão realmente ativa. Apenas os callbacks de
 * iniciar/parar alteram o trabalho; navegar ou consultar ingredientes mantém a atividade em andamento.
 */
import { useState } from 'react'
import { RECEITAS_INICIAIS_DE_FABRICACAO, ATIVIDADES_OCIOSAS_INICIAIS, obterDefinicaoDeEquipamento } from '@paralaxe/conteudo'
import { NIVEL_MAXIMO_DE_PROFISSAO, type PrioridadeDeOficio, obterBonusDaFerramentaDeColeta, obterOportunidadeDeMinigame, obterXpDeProfissaoParaProximoNivel, type PartidaLocal, type IdDaProfissao } from '@paralaxe/dominio'
import IndicadorDeProgressoOcioso from '../IndicadorDeProgressoOcioso'
import { IconeDoJogo, ComparacaoDeEquipamento } from '@/components/jogo'
import { obterIconeDoItem, iconeDeProfissaoPorId } from '@/iconesDosRecursos'
import { rotulosDosItens, rotulosDasProfissoes } from '@/rotulosDoJogo'
import { Button, Card, ProgressBar } from '@/components/ui'
import { SeletorDeOficios } from '../SeletorDeOficios/SeletorDeOficios'
import { CenaDoOficio } from '../CenaDoOficio/CenaDoOficio'
import estilos from './TelaDeAtividades.module.css'

type PropriedadesDeTelaDeAtividades = {
  partida: PartidaLocal
  ultimoResultadoDoTrabalho: string | null
  profissaoSelecionada: IdDaProfissao
  aoSelecionarProfissao: (profissao: IdDaProfissao) => void
  aoIniciarAtividade: (id: string) => Promise<void>
  aoIniciarAtividadeSecundaria: (id: string) => Promise<void>
  aoPararAtividadeSecundaria: () => Promise<void>
  aoIniciarAtividadeTerciaria: (id: string) => Promise<void>
  aoPararAtividadeTerciaria: () => Promise<void>
  aoIniciarReceita: (id: string) => Promise<void>
  aoIniciarReceitaSecundaria: (id: string) => Promise<void>
  aoPararReceitaSecundaria: () => Promise<void>
  aoIniciarReceitaTerciaria: (id: string) => Promise<void>
  aoPararReceitaTerciaria: () => Promise<void>
  aoAlterarPrioridade: (prioridade: PrioridadeDeOficio) => Promise<void>
  aoResponderMinigame: (profissao: IdDaProfissao, resposta: number) => Promise<void>
  aoPararTrabalho: () => Promise<void>
  aoPrestigiarProfissao: (id: IdDaProfissao) => Promise<void>
  aoTrilhaReceita: (idDaReceita: string) => Promise<void>
}

/** Filtra o catálogo pela profissão selecionada e combina requisitos com o inventário para explicar as ações disponíveis. */
export default function TelaDeAtividades({ partida, ultimoResultadoDoTrabalho, profissaoSelecionada, aoSelecionarProfissao, aoIniciarAtividade, aoIniciarAtividadeSecundaria, aoPararAtividadeSecundaria, aoIniciarAtividadeTerciaria, aoPararAtividadeTerciaria, aoIniciarReceita, aoIniciarReceitaSecundaria, aoPararReceitaSecundaria, aoIniciarReceitaTerciaria, aoPararReceitaTerciaria, aoAlterarPrioridade, aoResponderMinigame, aoPararTrabalho, aoPrestigiarProfissao, aoTrilhaReceita }: PropriedadesDeTelaDeAtividades) {
  const [pendente, definirPendente] = useState(false)
  const [acaoErro, definirAcaoErro] = useState<string | null>(null)
  const progresso = partida.profissoes[profissaoSelecionada]
  const proximoNivelXp = obterXpDeProfissaoParaProximoNivel(progresso.nivel)
  const atividades = ATIVIDADES_OCIOSAS_INICIAIS.filter((atividade) => atividade.idDaProfissao === profissaoSelecionada)
  // Reforço precisa de uma instância escolhida; sua entrada permanece em Personagem → Equipamento.
  const receitas = RECEITAS_INICIAIS_DE_FABRICACAO.filter((receita) => receita.idDaProfissao === profissaoSelecionada && receita.saida.tipo !== "equipamento-reforco")
  const ocioso = ATIVIDADES_OCIOSAS_INICIAIS.find((atividade) => atividade.id === partida.ocioso.atividadeAtiva?.idDaDefinicaoDaAtividade)
  const secundaria = ATIVIDADES_OCIOSAS_INICIAIS.find(a => a.id === partida.ocioso.atividadeSecundaria?.idDaDefinicaoDaAtividade)
  const terciaria = ATIVIDADES_OCIOSAS_INICIAIS.find(a => a.id === partida.ocioso.atividadeTerciaria?.idDaDefinicaoDaAtividade)
  const fabricar = RECEITAS_INICIAIS_DE_FABRICACAO.find((receita) => receita.id === partida.fabricacao.receitaAtiva?.idDaDefinicaoDaReceita)
  const receitaSecundaria = RECEITAS_INICIAIS_DE_FABRICACAO.find(r => r.id === partida.fabricacao.receitaSecundaria?.idDaDefinicaoDaReceita)
  const receitaTerciaria = RECEITAS_INICIAIS_DE_FABRICACAO.find(r => r.id === partida.fabricacao.receitaTerciaria?.idDaDefinicaoDaReceita)
  const trabalho = ocioso?.nomeDoResultado ?? fabricar?.nome
  const minigame = obterOportunidadeDeMinigame(partida, profissaoSelecionada, new Date().toISOString())
  const ativoProfissao = ocioso?.idDaProfissao ?? fabricar?.idDaProfissao
  const possuido = (id: string) => partida.personagem.inventario.find((pilha) => pilha.idDaDefinicao === id)?.quantidade ?? 0

  /** Bloqueia repetição enquanto a Promise está pendente, apresenta a falha local e libera os controles no finally. */
  async function agir(acao: () => Promise<void>) {
    if (pendente) return
    definirPendente(true)
    definirAcaoErro(null)
    try { await acao() }
    catch (erro) { definirAcaoErro(erro instanceof Error ? erro.message : 'Não foi possível concluir a ação. Tente novamente.') }
    finally { definirPendente(false) }
  }

  /** Troca a consulta e limpa o erro anterior, sem chamar início, parada ou persistência de atividade. */
  function escolherProfissao(profissao: IdDaProfissao) {
    definirAcaoErro(null)
    aoSelecionarProfissao(profissao)
  }

  return (
    <section className="funcionalidade-telaDoJogo atividades-telaDoJogo" aria-label="Atividades">
      <div className="telaDoJogo-tituloDaSecao">
        <div><p className="secao-chamada">Ofícios da Cidade Livre</p><h1 className={`destaque-titulo ${estilos.pageTitle}`}><IconeDoJogo icone={iconeDeProfissaoPorId[profissaoSelecionada]} tamanho={24} />{rotulosDasProfissoes[profissaoSelecionada]}</h1></div>
        <span className={`atividade-estado ${ativoProfissao === profissaoSelecionada ? "atividade-estado--executando" : ''}`}>{ativoProfissao === profissaoSelecionada ? 'EM ATIVIDADE' : 'EM CONSULTA'}</span>
      </div>
      <div className={estilos.layout}>
        <SeletorDeOficios selecionado={profissaoSelecionada} profissoes={partida.profissoes} emCurso={ativoProfissao} aoSelecionar={escolherProfissao} />
        <div className="atividades-areaDeTrabalho" aria-busy={pendente}>
          <div className={`atividade-etapa ${estilos.stage}`}>
            <CenaDoOficio profissao={profissaoSelecionada} legenda={atividades[0]?.nome ?? rotulosDasProfissoes[profissaoSelecionada]} />
            <Card appearance="soft" className="atividade-atualizado">
              {ativoProfissao === profissaoSelecionada ? <>
                <IndicadorDeProgressoOcioso partida={partida} />
                {secundaria ? <div aria-label="Coleta secundária em andamento">
                  <p className="secao-chamada">Prestígio I · Coleta secundária a 50% de eficiência</p>
                  <IndicadorDeProgressoOcioso partida={{ ...partida, ocioso: { ...partida.ocioso, atividadeAtiva: partida.ocioso.atividadeSecundaria ?? null } }} compacto />
                  <Button variant="secondary" size="sm" disabled={pendente} onClick={() => void agir(aoPararAtividadeSecundaria)}>Parar coleta secundária</Button>
                </div> : null}
                {terciaria ? <div aria-label="Coleta terciária em andamento">
                  <p className="secao-chamada">Prestígio III · Terceira coleta (33% de eficiência)</p>
                  <IndicadorDeProgressoOcioso partida={{ ...partida, ocioso: { ...partida.ocioso, atividadeAtiva: partida.ocioso.atividadeTerciaria ?? null } }} compacto />
                  <Button variant="secondary" size="sm" disabled={pendente} onClick={() => void agir(aoPararAtividadeTerciaria)}>Parar terceira coleta</Button>
                </div> : null}
                {receitaSecundaria ? <div aria-label="Produção secundária em andamento">
                  <p className="secao-chamada">Prestígio I · Produção secundária a 50% de eficiência</p>
                  <IndicadorDeProgressoOcioso partida={{ ...partida, fabricacao: { ...partida.fabricacao, receitaAtiva: partida.fabricacao.receitaSecundaria ?? null } }} compacto />
                  <Button variant="secondary" size="sm" disabled={pendente} onClick={() => void agir(aoPararReceitaSecundaria)}>Parar produção secundária</Button>
                </div> : null}
                {receitaTerciaria ? <div aria-label="Produção terciária em andamento">
                  <p className="secao-chamada">Prestígio III · Terceira produção (33% de eficiência)</p>
                  <IndicadorDeProgressoOcioso partida={{ ...partida, fabricacao: { ...partida.fabricacao, receitaAtiva: partida.fabricacao.receitaTerciaria ?? null } }} compacto />
                  <Button variant="secondary" size="sm" disabled={pendente} onClick={() => void agir(aoPararReceitaTerciaria)}>Parar terceira produção</Button>
                </div> : null}
              </> : <div className="atividade-pronto">
                <p className="secao-chamada">{receitas.length ? 'Na bancada' : 'No campo'}</p>
                <h2>{receitas.length ? 'Tudo começa com os materiais.' : 'O próximo ciclo começa com você.'}</h2>
                <p>{trabalho ? `${trabalho} continua em curso. Iniciar uma nova tarefa substitui a atual.` : 'Escolha abaixo o que deseja coletar ou produzir.'}</p>
                {ativoProfissao ? <div className="atividade-pronto-atalho"><Button variant="secondary" size="sm" onClick={() => escolherProfissao(ativoProfissao)}>Ver atividade em curso →</Button></div> : null}
              </div>}
              <div className="atividade-atualizado-acoes">
                {ativoProfissao === profissaoSelecionada ? <Button variant="secondary" disabled={pendente} onClick={() => void agir(aoPararTrabalho)}>Parar atividade</Button> : null}
              </div>
            </Card>
          </div>
          <div className="profissao-nivel-faixa">
            <strong>{rotulosDasProfissoes[profissaoSelecionada]} · Nv. {progresso.nivel}</strong>
            {proximoNivelXp ? <><ProgressBar max={proximoNivelXp} value={progresso.xp} label={`XP de ${rotulosDasProfissoes[profissaoSelecionada]} até o próximo nível`} /><span>{progresso.xp} / {proximoNivelXp} XP</span></> : <span>Nível máximo da versão · {progresso.xp} XP</span>}
            {progresso.prestigio >= 2 && ativoProfissao === profissaoSelecionada ? (
              <div aria-label="Prioridade dos trabalhos">
                <p className="secao-chamada">Prestígio II · Prioridade dos trabalhos</p>
                {(['equilibrado', 'principal', 'secundaria'] as const).map(opcao => {
                  const atual = ocioso ? partida.ocioso.prioridade ?? 'equilibrado' : partida.fabricacao.prioridade ?? 'equilibrado'
                  const nome = opcao === 'equilibrado' ? 'Equilibrado' : opcao === 'principal' ? 'Prioridade Principal' : 'Prioridade Secundária'
                  return <Button key={opcao} variant={atual === opcao ? 'primary' : 'secondary'} size="sm"
                    disabled={pendente || atual === opcao} onClick={() => void agir(() => aoAlterarPrioridade(opcao))}>{nome}</Button>
                })}
              </div>
            ) : null}
            <details><summary>Detalhes</summary><p>Prestígio: {progresso.prestigio}. Ao alcançar Prestígio I, você pode manter duas coletas do mesmo Ofício; a secundária opera a 50% de eficiência (provisório).</p></details>
            {progresso.nivel >= NIVEL_MAXIMO_DE_PROFISSAO && progresso.prestigio < 3 ? <Button variant="primary" disabled={pendente || Boolean(partida.ocioso.atividadeAtiva || partida.ocioso.atividadeSecundaria || partida.ocioso.atividadeTerciaria || partida.fabricacao.receitaAtiva || partida.fabricacao.receitaSecundaria || partida.fabricacao.receitaTerciaria)} onClick={() => void agir(() => aoPrestigiarProfissao(profissaoSelecionada))}>Realizar Prestígio {progresso.prestigio + 1} · reiniciar ofício</Button> : null}
          </div>
          {minigame ? <Card appearance="soft" aria-label="Minigame opcional do Ofício">
            <p className="secao-chamada">Oportunidade opcional · {minigame.nome}</p>
            <h2>Desafio de {rotulosDasProfissoes[profissaoSelecionada]}</h2>
            <p>{minigame.instrucao}</p>
            <div className="botao-linhaDeDados">
              {minigame.opcoes.map((opcao, indice) => (
                <Button key={opcao} size="sm" variant="secondary" disabled={pendente}
                  onClick={() => void agir(() => aoResponderMinigame(profissaoSelecionada, indice))}>{opcao}</Button>
              ))}
            </div>
            <p className="atenuado">Acerto: +4 XP por ciclo durante 3 minutos. Errar não afeta a produção automática.</p>
          </Card> : null}
          {acaoErro ? <p className="informacao-alerta" role="alert">{acaoErro}</p> : null}
          <div className={estilos.options}>
            <div className={estilos.optionsHeading}><h2>{receitas.length ? 'Receitas conhecidas' : 'Recursos disponíveis'}</h2><span>Rendimento por ciclo</span></div>
            {atividades.map((atividade) => {
              const ativo = ocioso?.id === atividade.id
              const ativaSecundaria = secundaria?.id === atividade.id
              const ativaTerciaria = terciaria?.id === atividade.id
              const podeIniciarTerciaria = progresso.prestigio >= 3 && !!secundaria && ocioso?.idDaProfissao === profissaoSelecionada && !ativo && !ativaSecundaria && !ativaTerciaria
              const podeIniciarSecundaria = progresso.prestigio >= 1 && ocioso?.idDaProfissao === profissaoSelecionada && !ativo && !ativaSecundaria && !terciaria
              const desbloqueado = progresso.nivel >= atividade.nivelExigidoDaProfissao && progresso.prestigio >= (atividade.prestigioExigido ?? 0)
              const bonusFerramenta = obterBonusDaFerramentaDeColeta(partida, atividade, obterDefinicaoDeEquipamento)
              return <Card appearance="soft" className={`${estilos.option} ${ativo ? "selecionado-cartao" : ''}`} key={atividade.id}>
                <div className="item-miniatura" aria-hidden="true"><IconeDoJogo icone={obterIconeDoItem(atividade.idDaDefinicaoDoItemProduzido)} tamanho={40} /></div>
                <div className={estilos.optionBody}>
                  <div className={estilos.optionTitle}><h2>{atividade.nomeDoResultado}</h2><span>Possuído: <strong>{possuido(atividade.idDaDefinicaoDoItemProduzido)}</strong></span></div>
                  <p className={estilos.yield}>+1 por ciclo · {atividade.segundosPorAcao}s · +{atividade.xpDeProfissaoPorAcao + bonusFerramenta} XP{bonusFerramenta ? ` (ferramenta +${bonusFerramenta})` : ''}</p>
                  {!desbloqueado ? <p className="informacao-alerta">Requer {rotulosDasProfissoes[profissaoSelecionada]} no nível {atividade.nivelExigidoDaProfissao}{atividade.prestigioExigido ? ` e Prestígio ${atividade.prestigioExigido}` : ''}.</p> : null}
                  {trabalho && !ativo && !ativaSecundaria ? <p className={estilos.replacement}>Iniciar como principal substitui {trabalho} e encerra a secundária.</p> : null}
                  <Button variant={ativo ? 'secondary' : 'primary'} size="sm" disabled={pendente || !desbloqueado} onClick={() => void agir(ativo ? aoPararTrabalho : () => aoIniciarAtividade(atividade.id))}>{ativo ? 'Em curso · Parar' : `Coletar ${atividade.nomeDoResultado}`}</Button>
                  {ativaTerciaria ? <Button variant="secondary" size="sm" disabled={pendente} onClick={() => void agir(aoPararAtividadeTerciaria)}>Terciária · Parar</Button>
                    : podeIniciarTerciaria ? <Button variant="secondary" size="sm" disabled={pendente || !desbloqueado} onClick={() => void agir(() => aoIniciarAtividadeTerciaria(atividade.id))}>Adicionar terceira coleta</Button> : null}
                  {ativaSecundaria ? <Button variant="secondary" size="sm" disabled={pendente} onClick={() => void agir(aoPararAtividadeSecundaria)}>Secundária · Parar</Button>
                    : podeIniciarSecundaria ? <Button variant="secondary" size="sm" disabled={pendente || !desbloqueado} onClick={() => void agir(() => aoIniciarAtividadeSecundaria(atividade.id))}>Adicionar coleta secundária</Button> : null}
                </div>
              </Card>
            })}
            {receitas.map((receita) => {
              const ativo = fabricar?.id === receita.id
              const ativaSecundaria = receitaSecundaria?.id === receita.id
              const ativaTerciaria = receitaTerciaria?.id === receita.id
              const podeIniciarTerciaria = progresso.prestigio >= 3 && !!receitaSecundaria && fabricar?.idDaProfissao === profissaoSelecionada && receita.saida.tipo !== 'equipamento-reforco' && !ativo && !ativaSecundaria && !ativaTerciaria
              const podeIniciarSecundaria = progresso.prestigio >= 1 && fabricar?.idDaProfissao === profissaoSelecionada
                && fabricar.saida.tipo !== 'equipamento-reforco' && receita.saida.tipo !== 'equipamento-reforco'
                && !ativo && !ativaSecundaria && !receitaTerciaria
              // Esta verificação orienta os botões. O domínio revalida os ingredientes ao executar a operação sobre o estado atual.
              const suficiente = receita.ingredientes.every((ingrediente) => possuido(ingrediente.idDaDefinicao) >= ingrediente.quantidade)
              const desbloqueado = progresso.nivel >= receita.nivelExigidoDaProfissao && progresso.prestigio >= (receita.prestigioExigido ?? 0)
              return <Card appearance="soft" className={`${estilos.option} ${ativo ? "selecionado-cartao" : ''}`} key={receita.id}>
                <div className="item-miniatura" aria-hidden="true"><IconeDoJogo icone={receita.saida.tipo === 'item' ? obterIconeDoItem(receita.saida.idDaDefinicao) : iconeDeProfissaoPorId[profissaoSelecionada]} tamanho={40} /></div>
                <div className={estilos.optionBody}>
                  <h2>{receita.nome}</h2>
                  <p className={estilos.yield}>{receita.segundosPorAcao}s por ciclo · +{receita.xpDeProfissaoPorAcao} XP</p>
                  <details className={estilos.recipeDetails}>
                    <summary>Materiais e comparação · {receita.ingredientes.filter((ingrediente) => possuido(ingrediente.idDaDefinicao) < ingrediente.quantidade).length} pendente(s)</summary>
                    <ComparacaoDeEquipamento partida={partida} idDaReceita={receita.id} />
                  <div className={estilos.ingredients}>
                    {receita.ingredientes.map((ingrediente) => {
                      const quantidade = possuido(ingrediente.idDaDefinicao)
                      const faltante = Math.max(0, ingrediente.quantidade - quantidade)
                      // Os atalhos de materiais procuram tanto coleta direta quanto uma receita intermediária que produza o ingrediente.
                      const origem = ATIVIDADES_OCIOSAS_INICIAIS.find((atividade) => atividade.idDaDefinicaoDoItemProduzido === ingrediente.idDaDefinicao)
                      const producaoOrigem = RECEITAS_INICIAIS_DE_FABRICACAO.find((candidato) => candidato.saida.tipo === 'item' && candidato.saida.idDaDefinicao === ingrediente.idDaDefinicao)
                      const origemProfissao = origem?.idDaProfissao ?? producaoOrigem?.idDaProfissao
                      return <div className={estilos.ingredientRow} key={ingrediente.idDaDefinicao}><span>{rotulosDosItens[ingrediente.idDaDefinicao] ?? ingrediente.idDaDefinicao} <strong>{quantidade} / {ingrediente.quantidade}</strong>{faltante ? <small>Faltam {faltante}</small> : null}</span>{faltante && origemProfissao ? <Button variant="secondary" size="sm" onClick={() => escolherProfissao(origemProfissao)}>Ver {rotulosDasProfissoes[origemProfissao]} →</Button> : null}</div>
                    })}
                  </div>
                  </details>
                  {!desbloqueado ? <p className="informacao-alerta">Requer {rotulosDasProfissoes[profissaoSelecionada]} no nível {receita.nivelExigidoDaProfissao}{receita.prestigioExigido ? ` e Prestígio ${receita.prestigioExigido}` : ''}.</p> : null}
                  {trabalho && !ativo && !ativaSecundaria ? <p className={estilos.replacement}>Iniciar como principal substitui {trabalho} e encerra a secundária.</p> : null}
                  <div className="botao-linhaDeDados"><Button variant={ativo ? 'secondary' : 'primary'} size="sm" disabled={pendente || (!ativo && (!suficiente || !desbloqueado))} onClick={() => void agir(ativo ? aoPararTrabalho : () => aoIniciarReceita(receita.id))}>{ativo ? 'Em curso · Parar' : suficiente ? 'Iniciar produção' : 'Faltam materiais'}</Button>
                    {ativaTerciaria ? <Button variant="secondary" size="sm" disabled={pendente} onClick={() => void agir(aoPararReceitaTerciaria)}>Terciária · Parar</Button>
                      : podeIniciarTerciaria ? <Button variant="secondary" size="sm" disabled={pendente || !desbloqueado || !suficiente} onClick={() => void agir(() => aoIniciarReceitaTerciaria(receita.id))}>Adicionar terceira produção</Button> : null}
                    {ativaSecundaria ? <Button variant="secondary" size="sm" disabled={pendente} onClick={() => void agir(aoPararReceitaSecundaria)}>Secundária · Parar</Button>
                      : podeIniciarSecundaria ? <Button variant="secondary" size="sm" disabled={pendente || !desbloqueado || !suficiente} onClick={() => void agir(() => aoIniciarReceitaSecundaria(receita.id))}>Adicionar produção secundária</Button> : null}
                    <Button variant="secondary" size="sm" disabled={pendente || !desbloqueado} onClick={() => void agir(() => aoTrilhaReceita(receita.id))}>{partida.jornada.meta?.idDaDefinicaoDaReceita === receita.id ? 'Ver meta na Jornada' : 'Acompanhar na Jornada'}</Button></div>
                </div>
              </Card>
            })}
            {!atividades.length && !receitas.length ? <Card><h2>Sem receitas disponíveis</h2><p className="atenuado">As melhorias de equipamentos desta configuração ficam em Personagem → Equipamento.</p></Card> : null}
          </div>
          <p className={estilos.result}><span>Última conclusão</span><strong>{ultimoResultadoDoTrabalho ?? 'Os resultados da atividade aparecerão aqui.'}</strong></p>
        </div>
      </div>
    </section>
  )
}
